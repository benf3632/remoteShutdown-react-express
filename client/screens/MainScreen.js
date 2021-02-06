import React, { useState, useEffect } from 'react';
import {
  View,
  Button,
  StyleSheet,
  Text,
  TextInput,
  Dimensions,
  TouchableOpacity,
  ToastAndroid,
} from 'react-native';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import RadioForm from 'react-native-simple-radio-button';
import RNFS from 'react-native-fs';

import Card from '../components/Card';
import Colors from '../constants/Color';

const radio_props = [
  { label: 'Shutdown', value: 0 },
  { label: 'Restart', value: 1 },
  { label: 'Sleep', value: 2 },
];

const convertToMiliseconds = (time) => {
  return time.getHours() * 3600000 + time.getMinutes() * 60000;
};

const MainScreen = props => {
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
  const [time, setTime] = useState(new Date(2000, 12, 12, 0, 0, 0));
  const [selectedIp, setSelectedIp] = useState(props.route.params.selectedIp);
  const [mode, setMode] = useState(0);
  const [started, setStarted] = useState();

  const showTimePicker = () => {
    setDatePickerVisibility(true);
  };

  const hideTimePicker = () => {
    setDatePickerVisibility(false);
  };

  const handleConfirm = date => {
    setDatePickerVisibility(false);
    const dateObj = new Date(date);
    setTime(dateObj);
  };

  const startTimerHandler = async () => {
    const miliseconds = convertToMiliseconds(time);
    const res = await fetch(`http://${selectedIp}:3030/execute`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        time: miliseconds,
        mode: mode,
      }),
    });
    if ((await res.status) === 200) {
      setStarted(true);
      ToastAndroid.show('The timer has started', ToastAndroid.SHORT);
    } else {
      ToastAndroid.show('Could not start the timer', ToastAndroid.SHORT);
    }
  };

  const stopTimerHandler = async () => {
    const res = await fetch(`http://${selectedIp}:3030/cancel`);
    if ((await res.status) === 200) {
      ToastAndroid.show('The timer has stopped', ToastAndroid.SHORT);
      setStarted(false);
    } else {
      ToastAndroid.show('Could not stop the timer', ToastAndroid.SHORT);
    }
  };

  const saveForQuickTileHandler = () => {
    RNFS.writeFile(RNFS.DocumentDirectoryPath + '/quickTile.conf', 
      JSON.stringify({
        ipAddress: selectedIp, 
        data: {
          time: convertToMiliseconds(time), 
          mode: mode
        }
      })
    ).then((success) => ToastAndroid.show('Saved for quick tile', ToastAndroid.SHORT));
  };

  return (
    <View style={styles.screen}>
      <Card style={styles.container}>
        <Text style={styles.ipText}>Selected IP</Text>
        <TextInput
          style={styles.input}
          placeholder='Enter an Ip'
          value={selectedIp}
          onChangeText={text => setSelectedIp(text)}
          keyboardType='decimal-pad'
          maxLength={15}
        />
        <Text style={styles.ipText}>Select Time</Text>
        <TouchableOpacity onPress={showTimePicker} activeOpacity={0.2}>
          <Text>
            {time.getHours().toString().padStart(2, '0')}:
            {time.getMinutes().toString().padStart(2, '0')}
          </Text>
        </TouchableOpacity>
        <DateTimePickerModal
          isVisible={isDatePickerVisible}
          mode='time'
          date={time}
          onConfirm={handleConfirm}
          onCancel={hideTimePicker}
        />
        <RadioForm
          style={styles.radioForm}
          formHorizontal={true}
          labelHorizontal={false}
          radio_props={radio_props}
          initial={0}
          onPress={val => setMode(val)}
          buttonColor={Colors.accent}
          selectedButtonColor={Colors.accent}
        />
        <Button
          title={started ? 'Stop Timer' : 'Start Timer'}
          color={Colors.primary}
          onPress={started ? stopTimerHandler : startTimerHandler}
        />
        <View style={{paddingTop: 10}}>
          <Button
            title={"Save for quick Tile"}
            color={Colors.primary}
            onPress={saveForQuickTileHandler} />
        </View>
      </Card>
    </View>
  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    width: Dimensions.get('window').width - Dimensions.get('window').width / 4,
    height: Dimensions.get('window').height / 2,
  },
  ipText: {
    fontWeight: 'bold',
    fontSize: 16,
  },
  input: {
    width: 150,
    marginVertical: 10,
    textAlign: 'center',
    borderBottomColor: '#ccc',
    borderBottomWidth: 1,
  },
  radioForm: {
    marginVertical: 10,
  },
});

export default MainScreen;
