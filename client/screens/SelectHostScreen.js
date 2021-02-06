import React, { useState, useEffect, useCallback } from 'react';
import {
  StyleSheet,
  View,
  ActivityIndicator,
  Text,
  FlatList,
  Button,
  RefreshControl,
  ScrollView,
  TouchableNativeFeedback
} from 'react-native';
import Card from '../components/Card';
import NetInfo, { NetInfoStateType } from "@react-native-community/netinfo";
import Color from '../constants/Color';


const timeout = (ms, promise) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      reject(new Error('timeout'));
    }, ms);
    promise.then(resolve, reject);
  });
};


const getNetwrokId = (ipAddress, subnet) => {
  let ipAddressArray = ipAddress.split('.');
  let subnetArray = subnet.split('.');
  ipAddressArray = ipAddressArray.map(element => parseInt(element));
  subnetArray = subnetArray.map(element => parseInt(element));
  console.log(ipAddressArray);
  console.log(subnetArray);
  let networkIdArray = [];
  ipAddressArray.forEach((element, index) => {
    networkIdArray.push(element & subnetArray[index]);
  });
  networkIdArray = networkIdArray.map(element => element.toString());
  return networkIdArray.slice(0, 3).join('.');
};

const SelectHostScreen = props => {
  const [isLoading, setIsLoading] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [hosts, setHosts] = useState([]);

  const getHosts = async () => {
    let networkState = await NetInfo.fetch();
    let networkId = '192.168.1.';
    if (networkState.type === NetInfoStateType.wifi) {
      networkId = getNetwrokId(networkState.details.ipAddress, networkState.details.subnet);
      //networkId = getNetwrokId(networkState.details.ipAddress, '255.255.255.0');
      console.log(networkId);
    }
    for (let i = 0; i < 256; i++) {
      try {
        const response = await timeout(
          100,
          fetch(`http://${networkId}.${i}:3030/host`)
        );
        const host = await response.json();
        console.log(host);
        setHosts([...hosts, host]);
        setIsLoading(false);
      } catch (err) {}
    }
    setIsLoading(false);
    setIsRefreshing(false);
  };
  
  useEffect(() => {
    setIsLoading(true);
    detectHosts();
  }, [detectHosts]);

  const detectHosts = useCallback(async () => {
    setIsRefreshing(true);
    await getHosts();
  }, [setIsLoading]);

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
            onRefresh={() => {setHosts([]); detectHosts()}}
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
