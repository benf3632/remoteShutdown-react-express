import React, { useState } from 'react';
import {
	View,
	Button,
	StyleSheet,
	Text,
	TextInput,
	Dimensions,
} from 'react-native';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import Card from '../components/Card';

const MainScreen = props => {
	const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
	const [time, setTime] = useState();
	const [selectedIp, setSelectedIp] = useState(props.route.params.selectedIp);

	const showTimePicker = () => {
		setDatePickerVisibility(true);
	};

	const hideDatePicker = () => {
		setDatePickerVisibility(false);
	};

	const handleConfirm = date => {
		console.log('A date has been picked: ', date);
		hideDatePicker();
	};

	return (
		<View style={styles.screen}>
			<Card style={styles.container}>
				<Text style={styles.ipText}>Selcted Ip</Text>
				<TextInput
					style={styles.input}
					placeholder='Enter an Ip'
					value={selectedIp}
					onChangeText={text => setSelectedIp(text)}
					keyboardType='decimal-pad'
					maxLength={15}
				/>
				<Text></Text>
				<DateTimePickerModal
					isVisible={isDatePickerVisible}
					mode='time'
					onConfirm={handleConfirm}
					onCancel={hideDatePicker}
				/>
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
		height: Dimensions.get('window').height / 3,
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
});

export default MainScreen;
