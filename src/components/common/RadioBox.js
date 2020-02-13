/*
 * Date : 2017/12/07
 * Writer : kevin
 */

/* Tools */
import React from 'react';
import RadioForm, {
    RadioButton, RadioButtonInput, RadioButtonLabel
} from 'react-native-simple-radio-button';
import { StyleSheet } from 'react-native';

const RadioBox = props => {
    return (
        <RadioForm
            radio_props={ props.data || [] }
            initial={props.initial || 0}
            formHorizontal={props.formHorizontal ? true : false}
            labelHorizontal={props.labelHorizontal ? false : true}
            buttonColor={props.buttonColor || '#727272'}
            animation={props.animation ? true : false}
            onPress={props.onPress}
            buttonSize={props.buttonSize || 7}
            buttonOuterSize={props.buttonOuterSize || 18}
            buttonStyle={props.buttonStyle || {}}
            labelStyle={[styles.labelStyle, props.labelStyle]}
        />
    );
}

const styles = StyleSheet.create({
    labelStyle: {
        fontSize: 14,
        color: '#727272',
        marginRight: 15
    },
});

export { RadioBox };