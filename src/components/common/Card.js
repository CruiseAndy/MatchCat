import React from 'react';
import { StyleSheet, View, Dimensions, ScrollView } from 'react-native';
import { ifIphoneX } from "react-native-iphone-x-helper";

const winHeight = Dimensions.get('window').height;

const Card = (props) => {
	return (
		<View style={[styles.constainerStyle, props.style]}>
			{props.children}
		</View>
	);
}

const styles = StyleSheet.create({
	constainerStyle: {
		height: winHeight,
		...ifIphoneX({
			paddingTop: 40,
		}, {
			paddingTop: 30,
		}),
		backgroundColor: "white",
	},
});

export { Card };