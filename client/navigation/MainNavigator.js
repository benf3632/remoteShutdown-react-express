import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import MainScreen from '../screens/MainScreen';

const MainStack = createStackNavigator();

const MainNavigator = props => {
	return (
		<NavigationContainer>
			<MainStack.Navigator>
				<MainStack.Screen name='Remote Shutdown' component={MainScreen} />
			</MainStack.Navigator>
		</NavigationContainer>
	);
};

export default MainNavigator;
