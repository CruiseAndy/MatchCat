import React, { Component } from "react";
import { StyleSheet, Modal, Text, TouchableOpacity, View } from "react-native";
import { ifIphoneX } from "react-native-iphone-x-helper";
import { Card, IconBlock, Confirm } from "../common";
class transferMessage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      messageBox: {
        show: false,
        text: "",
        conFormBtnText: "",
        cancelBtnText: "",
        imageUrl: "",
        confirmHandler: () => {},
        cancelHandler: () => {}
      }
    };
  }
  onIconClick = () => {
    this.props.onShow(false);
  };
  onCancelHandler = () => {
    const { base, cancelOrderText } = this.props.Lang.confirm;
    this.setState({
      messageBox: {
        show: true,
        text: cancelOrderText,
        conFormBtnText: base.confirmBtn,
        cancelBtnText: base.cancelBtn,
        confirmHandler: () => {
          this.setState(
            {
              messageBox: {
                show: false
              }
            },
            () => {
              this.props.onTransferCancel();
            }
          );
        },
        cancelHandler: () => {
          this.setState({
            messageBox: {
              show: false
            }
          });
        }
      }
    });
  };
  render() {
    const { messageBox } = this.state;
    const { orderContent, Lang } = this.props;
    return (
      <Modal
        animationType="slide"
        transparent={false}
        visible={this.props.show}
        onRequestClose={() => {
          alert("Modal has been closed.");
        }}
      >
        <Card
          style={[
            {
              backgroundColor: "#f0f0f0"
            },
            this.props.isShowClose ? { paddingTop: 30 } : false
          ]}
        >
          {this.props.isShowClose ? (
            <IconBlock
              name="remove"
              viewStyle={{
                justifyContent: "flex-end"
              }}
              style={{
                color: "#AFAFAF",
                fontSize: 25,
                fontWeight: "100",
                paddingVertical: 8,
                paddingLeft: 12,
                paddingRight: 12
              }}
              onPress={() => {
                this.onIconClick(false);
              }}
            />
          ) : (
            false
          )}

          {/* header */}
          <View style={style.header}>
            <Text
              style={{
                ...style.headerTextShadow,
                color: "#02223F",
                fontSize: 20,
                fontWeight: "bold"
              }}
            >
              {Lang.transferTitle}
            </Text>
            <Text
              style={{
                flexDirection: "row",
                alignItems: "baseline"
              }}
            >
              <Text
                style={{
                  color: "#F7820E",
                  fontSize: 25
                }}
              >
                $
              </Text>
              <Text
                style={{
                  color: "#F7820E",
                  fontSize: 35
                }}
              >
                {orderContent.amount}
              </Text>
            </Text>
          </View>
          {/* content */}
          <View style={style.cardInfo}>
            <View style={style.infoItem}>
              <Text style={style.infoItemText}>{Lang.cardInfo.userName}</Text>
              <Text style={{ ...style.infoItemText, fontWeight: "bold" }}>
                {orderContent.card_info.user_name}
              </Text>
            </View>
            <View style={style.infoItem}>
              <Text style={style.infoItemText}>
                {Lang.cardInfo.bankAccount}
              </Text>
              <Text style={{ ...style.infoItemText, fontWeight: "bold" }}>
                {orderContent.card_info.bank_account}
              </Text>
            </View>
            <View style={style.infoItem}>
              <Text style={style.infoItemText}>{Lang.cardInfo.bankName}</Text>
              <Text style={{ ...style.infoItemText, fontWeight: "bold" }}>
                {orderContent.card_info.bank_name}
              </Text>
            </View>
            <View style={style.infoItem}>
              <Text style={style.infoItemText}>{Lang.cardInfo.province}</Text>
              <Text style={{ ...style.infoItemText, fontWeight: "bold" }}>
                {orderContent.card_info.province}
              </Text>
            </View>
            <View style={style.infoItem}>
              <Text style={style.infoItemText}>{Lang.cardInfo.city}</Text>
              <Text style={{ ...style.infoItemText, fontWeight: "bold" }}>
                {orderContent.card_info.city}
              </Text>
            </View>
            <View
              style={{ ...style.infoItem, borderBottomColor: "rgba(0,0,0,0)" }}
            >
              <Text style={style.infoItemText}>{Lang.cardInfo.subBranch}</Text>
              <Text style={{ ...style.infoItemText, fontWeight: "bold" }}>
                {orderContent.card_info.sub_branch}
              </Text>
            </View>
          </View>
          {/* footer */}
          {orderContent.status === "checking" ? (
            <View style={style.footer}>
              <TouchableOpacity
                style={{
                  paddingTop: "5%",
                  paddingBottom: "5%",
                  justifyContent: "center"
                }}
                onPress={() => this.props.onToService()}
              >
                <Text
                  style={{
                    fontSize: 16,
                    textAlign: "center",
                    color: "#89898a",
                    textDecorationLine: "underline"
                  }}
                >
                  {Lang.orderCheckingService}
                </Text>
              </TouchableOpacity>
            </View>
          ) : (
            <View style={style.footer}>
              <TouchableOpacity
                style={style.transferBtn}
                onPress={() => this.onCancelHandler()}
              >
                <Text style={style.btnText}>{Lang.buttons.cancelOrder}</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={{ ...style.transferBtn, backgroundColor: "#F7820E" }}
                onPress={() => this.props.onTransferSubmit()}
              >
                <Text style={{ ...style.btnText, color: "#fff" }}>
                  {Lang.buttons.checkingOrder}
                </Text>
              </TouchableOpacity>
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "center",
                  alignItems: "center"
                }}
              >
                <Text style={{ color: "#89898a" }}>{Lang.hasProblem}</Text>
                <TouchableOpacity onPress={() => this.props.onToService()}>
                  <Text
                    style={{
                      color: "#89898a",
                      textDecorationLine: "underline"
                    }}
                  >
                    {Lang.advisoryService}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
        </Card>
        {this.state.messageBox.show ? (
          <Confirm
            visible={messageBox.show}
            messageTxt={messageBox.text}
            checkTxt={Lang.confirm.base.confirmBtn}
            cancelTxt={Lang.confirm.base.cancelBtn}
            onOK={() => messageBox.confirmHandler()}
            onCancel={() => messageBox.cancelHandler()}
          />
        ) : (
          false
        )}
      </Modal>
    );
  }
}

const style = StyleSheet.create({
  header: {
    flex: 0.25,
    justifyContent: "center",
    alignItems: "center"
  },
  headerTextShadow: {
    textShadowColor: "rgba(0,0,0,0.16)",
    textShadowOffset: { width: 0, height: 3 },
    textShadowRadius: 1
  },
  cardInfo: {
    width: "90%",
    paddingLeft: "5%",
    paddingRight: "5%",
    marginTop: 10,
    marginBottom: "5%",
    marginLeft: "auto",
    marginRight: "auto",
    borderRadius: 10,
    backgroundColor: "#fff"
  },
  infoItem: {
    paddingVertical: "5%",
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    alignItems: "center",
    borderBottomColor: "#F0F0F0",
    borderBottomWidth: 1
  },
  infoItemText: {
    fontSize: 17,
    color: "#707070"
  },
  transferBtn: {
    width: "100%",
    aspectRatio: 7,
    marginBottom: 10,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#F7820D",
    borderRadius: 50
  },
  btnText: {
    fontSize: 18,
    color: "#F7820D"
  },
  footer: {
    flex: 0.7,
    width: "90%",
    marginLeft: "auto",
    marginRight: "auto"
  }
});

export default transferMessage;
