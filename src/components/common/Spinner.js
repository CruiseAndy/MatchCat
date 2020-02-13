import React, { Component } from 'react';
import LodingSpinner from 'react-native-loading-spinner-overlay';

const Spinner = ({ visible, size }) => {
    return (
        <LodingSpinner visible={visible} color="#FBA444" size={"large"||size} />
    );
}

const styles = {
    
}

export { Spinner };