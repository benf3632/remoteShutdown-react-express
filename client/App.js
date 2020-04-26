import React, { useState } from 'react';
import { StyleSheet, Text, View, Button, Platform, Modal } from 'react-native';
import DateTimePickerModal from 'react-native-modal-datetime-picker';

export default function App() {
	const [isDatePickerVisible, setDatePickerVisibility] = useState(false);

	const showDatePicker = () => {
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
			<Button title='Show Time Picker' onPress={showDatePicker} />
			<DateTimePickerModal
				isVisible={isDatePickerVisible}
				mode='time'
				onConfirm={handleConfirm}
				onCancel={hideDatePicker}
			/>
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: '#fff',
		alignItems: 'center',
		justifyContent: 'center',
	},
	picker: {
		width: '100%',
		height: 200,
	},
});
