/*
 * Date : 2017/11/29
 * Writer : kevin
 * Other tool : react-native-modal-dropdown 
 */

/* Tools */
import React, { Component } from 'react';
import ModalSelector from 'react-native-modal-selector';
import { StyleSheet, TextInput } from 'react-native';

const Selector = (props) => {
    return (
        <ModalSelector
            style={[styles.modalStyle, props.modalStyle]}
            data={props.data}
            onChange={props.onChange}
            disabled={props.disabled}
            cancelText="取消"
        >
            <TextInput
                style={[styles.textinputStyle, props.textStyle]}
                value={props.value}
                placeholder={props.placeholder}
                editable={false}
            />
        </ModalSelector>
    );
}

const styles = StyleSheet.create({
    modalStyle: {
        flex: 1,
        justifyContent: 'center',
        marginTop: 2,
        marginBottom: 2,
        borderRadius: 5,
        backgroundColor: '#DCDCDC'
    },
    textinputStyle: {
        textAlign: 'center',
        fontSize: 16,
        fontWeight: '600',
        color: '#727272',
        paddingTop: 5,
        paddingBottom: 5,
    }
});

export { Selector };