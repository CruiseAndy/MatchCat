import React from 'react';
import { View, Text, Modal, TouchableOpacity } from 'react-native';

const Message = props => {
  return (
    <Modal
      visible={props.visible}
      transparent
      animationType="slide"
      onRequestClose={() => {}}
    >
      <View style={[ styles.containerStyle, props.containerStyle ]}>
        <View style={[ styles.boxStyle, props.boxStyle ]}>
          <Text style={[ styles.msgStyle, props.msgStyle]}>{props.messageTxt}</Text>
          <View style={ styles.hr }></View>
          <TouchableOpacity style={[ styles.buttonStyle, props.buttonStyle ]} onPress={props.onOK}>
            <Text style={[ styles.buttonTxtStyle, props.buttonTxtStyle ]}>{props.checkTxt}</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = {
  containerStyle: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.75)',
    position: 'relative',
    justifyContent: 'center',
    alignItems: 'center',
  },
  boxStyle: {
    width: "70%",
    backgroundColor: "#EF4D1B",
    borderRadius: 10,
  },
  msgStyle: {
    fontSize: 18,
    fontWeight: "bold",
    textAlign: 'center',
    color: "white",
    lineHeight: 25,
    paddingTop: 25,
    paddingBottom: 25,
    paddingLeft: 15,
    paddingRight: 15
  },
  hr: {
    width: "100%",
    borderBottomColor: 'rgba(204, 204, 204, 0.75)',
    borderBottomWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonStyle: {
    paddingLeft: 15,
    paddingRight: 15,
    flexDirection: 'row',
    justifyContent: 'center'
  },
  buttonTxtStyle: {
    paddingTop: 15,
    paddingBottom: 15,
    color: "white",
    fontSize: 18,
  }
}

export { Message };