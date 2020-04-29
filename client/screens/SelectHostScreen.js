import React, { useState, useEffect, useCallback } from 'react';
import {
  StyleSheet,
  View,
  ActivityIndicator,
  Text,
  FlatList,
  Button,
  RefreshControl,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import Card from '../components/Card';
import TouchableNativeFeedback from '@expo/react-native-touchable-native-feedback-safe';
import Color from '../constants/Color';

const timeout = (ms, promise) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      reject(new Error('timeout'));
    }, ms);
    promise.then(resolve, reject);
  });
};

const getHosts = async () => {
  let hosts = [];
  for (let i = 0; i < 256; i++) {
    try {
      const response = await timeout(
        25,
        fetch(`http://192.168.1.${i}:3000/host`)
      );
      const host = await response.json();
      hosts = hosts.concat(host);
    } catch (err) {}
  }
  return hosts;
};

const SelectHostScreen = props => {
  const [isLoading, setIsLoading] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [hosts, setHosts] = useState([]);

  useEffect(() => {
    setIsLoading(true);
    detectHosts().then(() => setIsLoading(false));
  }, [detectHosts]);

  const detectHosts = useCallback(async () => {
    setIsRefreshing(true);
    try {
      const res = await getHosts();
      setHosts(res);
      setIsRefreshing(false);
    } catch (err) {
      console.log(err.message);
    }
    setIsRefreshing(false);
  }, [setIsLoading]);

  useEffect(() => {
    const willFocusSub = props.navigation.addListener('willFocus', detectHosts);
    return () => {
      willFocusSub.remove();
    };
  }, [detectHosts]);

  const selectHostHandler = ip => {
    props.navigation.navigate('Main', {
      selectedIp: ip,
    });
  };

  if (isLoading) {
    return (
      <View style={{ ...styles.centered, marginVertical: 10 }}>
        <Text style={{ marginVertical: 10 }}>Loading..</Text>
        <ActivityIndicator color='#9519a0' size='large' />
      </View>
    );
  }

  if (!isLoading && hosts.length === 0) {
    return (
      <ScrollView
        contentContainerStyle={styles.centered}
        refreshControl={
          <RefreshControl
            colors={[Color.accent]}
            refreshing={isRefreshing}
            onRefresh={detectHosts}
          />
        }>
        <View style={styles.centered}>
          <Text>Did not found any hosts that running the server...</Text>
          <Button
            title='Try Entering IP Manualy'
            onPress={selectHostHandler.bind(this, '')}
          />
        </View>
      </ScrollView>
    );
  }

  return (
    <FlatList
      contentContainerStyle={styles.list}
      onRefresh={detectHosts}
      refreshing={isRefreshing}
      data={hosts}
      keyExtractor={item => item.hostname}
      renderItem={item => (
        <Card style={styles.hostContainer}>
          <TouchableNativeFeedback
            onPress={selectHostHandler.bind(this, item.item.ip)}
            useForeground>
            <View style={styles.touchable}>
              <Text style={styles.host}>{item.item.hostname}</Text>
              <Text style={styles.ip}>{item.item.ip}</Text>
            </View>
          </TouchableNativeFeedback>
        </Card>
      )}
    />
  );
};

const styles = StyleSheet.create({
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  list: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  hostContainer: {
    marginVertical: 20,
    width: 300,
    height: 100,
    overflow: 'hidden',
  },
  touchable: {
    borderRadius: 10,
    overflow: 'hidden',
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  host: {
    fontWeight: 'bold',
    fontSize: 16,
    marginVertical: 10,
    textAlign: 'center',
  },
  ip: {
    color: '#ccc',
    fontSize: 13,
    textAlign: 'center',
  },
});

export default SelectHostScreen;
