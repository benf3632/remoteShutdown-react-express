import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import MainScreen from '../screens/MainScreen';
import SelectHostScreen from '../screens/SelectHostScreen';

const MainStack = createStackNavigator();

const MainNavigator = props => {
	return (
		<NavigationContainer>
			<MainStack.Navigator initialRouteName='SelectHost'>
				<MainStack.Screen
					name='SelectHost'
					component={SelectHostScreen}
					options={{ title: 'Select Host' }}
				/>
				<MainStack.Screen
					name='Main'
					component={MainScreen}
					options={{ title: 'Remote Shutdown' }}
				/>
			</MainStack.Navigator>
		</NavigationContainer>
	);
};

export default MainNavigator;
