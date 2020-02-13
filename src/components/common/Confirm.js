import React from "react";
import { View, Text, Modal, TouchableOpacity, Image } from "react-native";

const Confirm = props => {
  return (
    <Modal
      visible={props.visible}
      transparent
      animationType="slide"
      onRequestClose={() => {}}
    >
      <View style={[styles.containerStyle, props.containerStyle]}>
        <View style={[styles.boxStyle, props.boxStyle]}>
          {props.imageUrl ? (
            <View style={[styles.confirmImgBox, props.confirmImgBox]}>
              <Image
                resizeMode="contain"
                source={props.imageUrl}
                style={[styles.confirmImg, props.confirmImg]}
              />
            </View>
          ) : (
            false
          )}
          <Text style={[styles.msgStyle, props.msgStyle]}>
            {props.messageTxt}
          </Text>
          {props.children}
          <View style={styles.hr} />
          <View style={styles.msgBtns}>
            <TouchableOpacity
              style={[styles.buttonStyle, props.buttonStyle]}
              onPress={props.onCancel}
            >
              <Text style={[styles.buttonTxtStyle, props.buttonTxtStyle]}>
                {props.cancelTxt}
              </Text>
            </TouchableOpacity>
            <View style={[styles.separationline, props.separationline]} />
            <TouchableOpacity
              style={[styles.buttonStyle, props.buttonStyle]}
              onPress={props.onOK}
            >
              <Text style={[styles.buttonTxtStyle, props.buttonTxtStyle]}>
                {props.checkTxt}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = {
  containerStyle: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.75)",
    position: "relative",
    justifyContent: "center",
    alignItems: "center"
  },
  boxStyle: {
    width: "70%",
    backgroundColor: "#EF4D1B",
    borderRadius: 10
  },
  msgStyle: {
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "center",
    color: "white",
    lineHeight: 25,
    paddingTop: 25,
    paddingBottom: 25,
    paddingLeft: 15,
    paddingRight: 15
  },
  separationline: {
    width: 1,
    height: "80%",
    backgroundColor: "rgba(204, 204, 204, 0.75)"
  },
  confirmImgBox: {
    justifyContent: "center",
    alignItems: "center"
  },
  confirmImg: {
    position: "absolute",
    bottom: 0
  },
  hr: {
    width: "100%",
    borderBottomColor: "rgba(204, 204, 204, 0.75)",
    borderBottomWidth: 1,
    justifyContent: "center",
    alignItems: "center"
  },
  msgBtns: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center"
  },
  buttonStyle: {
    flex: 1,
    paddingLeft: 15,
    paddingRight: 15,
    flexDirection: "row",
    justifyContent: "center"
  },
  buttonTxtStyle: {
    paddingTop: 15,
    paddingBottom: 15,
    color: "white",
    fontSize: 18
  }
};

export { Confirm };
