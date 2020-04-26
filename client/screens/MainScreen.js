import React, { useState } from 'react';
import { View, Button, StyleSheet } from 'react-native';
import DateTimePickerModal from 'react-native-modal-datetime-picker';

const MainScreen = props => {
	const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
	const { selectedIp } = props.route.params;

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
		<View style={styles.container}>
			<Button title='Show Time Picker' onPress={showTimePicker} />
			<DateTimePickerModal
				isVisible={isDatePickerVisible}
				mode='time'
				onConfirm={handleConfirm}
				onCancel={hideDatePicker}
			/>
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: '#fff',
		alignItems: 'center',
		justifyContent: 'center',
	},
});

export default MainScreen;
