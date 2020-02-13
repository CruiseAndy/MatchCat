import React, { Component } from 'react';
import { View, TextInput } from 'react-native';

const Input = props => {
	const { inputStyle, labelStyle, containerStyle,  } = styles;
	const { value, onChangeText, placeholder, secureTextEntry, keyboardType, placeholderTextColor, onFocus, onBlur } = props;

	return (
		<View style={[ containerStyle, props.containerStyle ]}>
			<TextInput
				secureTextEntry={secureTextEntry}
				placeholder={placeholder}
				placeholderTextColor={placeholderTextColor}
				autoCorrect={false}
				style={[ inputStyle, props.inputStyle ]}
				value={value}
				keyboardType = {keyboardType || "default"}
				onChangeText={onChangeText}
				onFocus={onFocus}
				onBlur={onBlur}
			/>
		</View>
	);
}

const styles = {
	containerStyle: {
		flexDirection: 'row',
		alignItems: 'center',
		borderRadius: 5,
		borderWidth: 1,
		borderColor: '#c0c0c0',
		marginBottom: 10,
	},
	inputStyle: {
		width: "100%",
		height: 45,
		color: '#000',
		paddingRight: 10,
		paddingLeft: 10,
		fontSize: 18,
		lineHeight: 23,
	},
}

export { Input };