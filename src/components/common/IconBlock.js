/*
 * Date : 2017/11/27
 * Writer : kevin
 */

/* Tools */
import React from 'react';
import Icon from 'react-native-vector-icons/FontAwesome';
import { View, Text } from 'react-native';

/**
 * Description
 * 圖片大小與顏色都會有預設值
 * 文字若要不顯示只要不寫即可
 */

const IconBlock = (props) => {
	const { viewStyle, iconSytle, iconDesc } = styles;

	return (
		<View style={{ ...viewStyle, ...props.viewStyle}}>
			<Icon
				style={{ ...iconSytle, ...props.style}}
				name={props.name} 
				size={props.size || 22}   // 图片大小
				color={props.color || "#727272"} // 圖片顏色
				onPress={props.onPress}
				theme={{ iconFamily: 'FontAwesome' }}
			/>
			{/* <Text style={[iconDesc, props.textStyle]}>{props.children}</Text> */}
		</View>
	);
};

const styles = {
	viewStyle: {
		flexDirection: 'row',
		justifyContent: 'flex-start',
	},
	iconSytle: {
		padding: 5,
	},
	iconDesc: {
		fontSize: 18,
		color: '#727272',
		fontWeight: '600',
		paddingTop: 7,
	},
}

export { IconBlock };