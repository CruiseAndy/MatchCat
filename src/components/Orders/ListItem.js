import React, { Component } from "react";
import { StyleSheet, View, Text, Modal, TouchableOpacity } from "react-native";
import { IconBlock } from "../../components/common";
import moment from "moment";
class ListItem extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isShowMore: false
    };
  }
  componentDidMount() {
    if (this.props.orderType === "sell") {
      this.props.onReady(this.props.item.id);
    }
  }
  onMoreShow = () => {
    this.setState({ isShowMore: true });
  };
  onMoreClose = () => {
    this.setState({ isShowMore: false });
  };
  /**
   * 訂單狀態：
   * 買分:
    waiting-> 待付款
    checking -> 待審核
    prepare -> 失敗
    success -> 成功
    cancelled -> 取消
    expired -> 過期
    *搶單:
    waiting -> 未結單
    success_callback -> 成功(商戶對應肥貓的訂單狀態)
    success -> 成功(交易員對應肥貓的訂單狀態)
    prepare -> 失敗
    expired -> 過期
    mistake -> 異常 (預收金額與實付金額不符)
    solved -> 待處理 (預收金額與實付金額不符，後台已有人員處理中)
   */
  render() {
    const { item, index, Lang, orderType } = this.props;
    {
      return orderType === "buy" ? (
        <View
          style={{
            ...style.listItem,
            borderBottomColor: "#f6f6f6",
            borderBottomWidth: 1,
            paddingBottom: 10
          }}
        >
          {/* order status */}
          <View style={style.statusBlock}>
            <View style={{ alignItems: "center" }}>
              <IconBlock
                style={
                  item.status === "success"
                    ? style.textSuccess
                    : item.status === "waiting" || item.status === "checking"
                    ? style.textWaiting
                    : item.status === "cancelled"
                    ? style.textCancelled
                    : style.text
                }
                name={
                  item.status === "success"
                    ? "check-circle"
                    : item.status === "waiting" || item.status === "checking"
                    ? "repeat"
                    : "times-circle"
                }
              />
              <Text
                style={
                  item.status === "success"
                    ? style.textSuccess
                    : item.status === "waiting" || item.status === "checking"
                    ? style.textWaiting
                    : item.status === "cancelled"
                    ? style.textCancelled
                    : style.text
                }
              >
                {Lang.buy.status[item.status]}
              </Text>
            </View>
          </View>
          {/* order content */}
          <View style={style.itemInfo}>
            {/* order fee & amount */}
            <View style={style.infoItem}>
              <Text>{Lang.amount} </Text>
              <Text
                style={[
                  style.amount,
                  item.status === "success"
                    ? style.textSuccess
                    : item.status === "waiting" || item.status === "checking"
                    ? style.textWaiting
                    : item.status === "cancelled"
                    ? style.textCancelled
                    : style.text
                ]}
              >
                ${item.amount}
              </Text>
            </View>
            <View style={style.infoItem}>
              <Text>{Lang.fee} </Text>
              <Text
                style={[
                  style.amount,
                  item.status === "success"
                    ? style.textSuccess
                    : item.status === "waiting" || item.status === "checking"
                    ? style.textWaiting
                    : item.status === "cancelled"
                    ? style.textCancelled
                    : style.text
                ]}
              >
                {item.fee}
              </Text>
            </View>
            <View style={style.infoItem}>
              <Text style={{ color: "#B2B2B2" }}>
                {moment(Date.parse(item.created_at)).format("YYYY-MM-DD")}
              </Text>
            </View>
          </View>
          {/* order more & pay Button */}
          <View>
            {item.status === "waiting" ? (
              <TouchableOpacity
                style={style.buttonStyle}
                onPress={() => this.props.onPayFee(item)}
              >
                <Text style={style.buttonText}>結帳去</Text>
              </TouchableOpacity>
            ) : (
              <IconBlock
                name="ellipsis-v"
                viewStyle={{
                  flex: 1,
                  justifyContent: "center",
                  alignItems: "center"
                }}
                style={{
                  color: "#C5C5C5",
                  paddingLeft: 12,
                  paddingRight: 12
                }}
                onPress={() => this.onMoreShow()}
              />
            )}
          </View>
          {/* show order detial */}
          {this.state.isShowMore ? (
            <MoreModal
              visible={this.state.isShowMore}
              Lang={this.props.Lang}
              content={{
                ...item,
                orderType: this.props.orderType,
                valid_balance: this.props.userInfo
                  ? this.props.userInfo.valid_balance
                  : 0
              }}
              onClose={this.onMoreClose}
            />
          ) : (
            false
          )}
        </View>
      ) : (
        <View style={style.listItem}>
          {/* line */}
          <View
            style={[
              item.status === "success" || item.status === "success_callback"
                ? style.lineSuccess
                : item.status === "waiting" || item.status === "solved"
                ? style.lineWaiting
                : item.status === "mistake"
                ? style.lineSolved
                : item.status === "cancelled"
                ? style.lineCancelled
                : style.line
            ]}
          />
          {/* order content */}
          <View style={style.itemInfo}>
            {/* order time & number & amount */}
            <Text
              style={[
                style.amount,
                item.status === "success" || item.status === "success_callback"
                  ? style.textSuccess
                  : item.status === "waiting" || item.status === "solved"
                  ? style.textWaiting
                  : item.status === "mistake"
                  ? style.textSolved
                  : item.status === "cancelled"
                  ? style.textCancelled
                  : style.text
              ]}
            >
              ${item.amount}
            </Text>
            <View
              style={{
                flexDirection: "row",
                flexWrap: "wrap",
                marginTop: 5,
                marginBottom: 5
              }}
            >
              <Text>{Lang.orderNum} </Text>
              <Text>{item.order_num}</Text>
            </View>
            <Text style={{ color: "#B2B2B2" }}>
              {moment(Date.parse(item.created_at)).format("YYYY-MM-DD")}
            </Text>
          </View>
          {/* order status */}
          <View style={style.statusBlock}>
            {item.status === "waiting" ? (
              false
            ) : (
              <View
                style={{
                  flex: 0.7,
                  justifyContent: "center",
                  alignItems: "center"
                }}
              >
                <IconBlock
                  style={
                    item.status === "success" ||
                    item.status === "success_callback"
                      ? style.textSuccess
                      : item.status === "waiting" || item.status === "solved"
                      ? style.textWaiting
                      : item.status === "mistake"
                      ? style.textSolved
                      : item.status === "cancelled"
                      ? style.textCancelled
                      : style.text
                  }
                  name={
                    item.status === "success" ||
                    item.status === "success_callback"
                      ? "check-circle"
                      : item.status === "mistake"
                      ? "warning"
                      : item.status === "solved"
                      ? "repeat"
                      : "times-circle"
                  }
                />
                <Text
                  style={
                    item.status === "success" ||
                    item.status === "success_callback"
                      ? style.textSuccess
                      : item.status === "waiting" || item.status === "solved"
                      ? style.textWaiting
                      : item.status === "mistake"
                      ? style.textSolved
                      : item.status === "cancelled"
                      ? style.textCancelled
                      : style.text
                  }
                >
                  {item.status === "success_callback"
                    ? Lang.sell.status.success
                    : Lang.sell.status[item.status]}
                </Text>
              </View>
            )}
            <IconBlock
              name="ellipsis-v"
              viewStyle={{
                flex: 0.3,
                justifyContent: "center",
                alignItems: "center"
              }}
              style={{
                textAlign: "right",
                color: "#C5C5C5",
                minWidth: 30
              }}
              onPress={() => this.onMoreShow()}
            />
          </View>
          {/* show order detial */}
          {this.state.isShowMore ? (
            <MoreModal
              visible={this.state.isShowMore}
              Lang={this.props.Lang}
              content={{
                ...item,
                orderType: this.props.orderType,
                valid_balance: this.props.userInfo
                  ? this.props.userInfo.valid_balance
                  : 0
              }}
              onClose={this.onMoreClose}
            />
          ) : (
            false
          )}
        </View>
      );
    }
  }
}
const style = StyleSheet.create({
  listItem: {
    flex: 1,
    paddingVertical: "5%",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center"
  },
  itemInfo: {
    flex: 1,
    flexWrap: "wrap"
  },
  infoItem: {
    paddingVertical: 5,
    flexDirection: "row",
    flexWrap: "wrap",
    alignItems: "flex-end"
  },
  statusBlock: {
    flex: 0.3,
    flexDirection: "row"
  },
  line: {
    width: 3,
    height: "100%",
    marginRight: 10,
    backgroundColor: "#707070"
  },
  lineSuccess: {
    width: 3,
    height: "100%",
    marginRight: 10,
    backgroundColor: "#FD7044"
  },
  lineWaiting: {
    width: 3,
    height: "100%",
    marginRight: 10,
    backgroundColor: "#1387E2"
  },
  lineCancelled: {
    width: 3,
    height: "100%",
    marginRight: 10,
    backgroundColor: "#02223F"
  },
  lineSolved: {
    width: 3,
    height: "100%",
    marginRight: 10,
    backgroundColor: "#ffa503"
  },
  amount: {
    fontSize: 18,
    fontWeight: "bold"
  },
  text: {
    color: "#707070"
  },
  textSuccess: {
    color: "#FD7044"
  },
  textWaiting: {
    color: "#1387E2"
  },
  textCancelled: {
    color: "#02223F"
  },
  textSolved: {
    color: "#ffa503"
  },
  buttonStyle: {
    paddingVertical: 6,
    paddingLeft: "5%",
    paddingRight: "5%",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 15,
    backgroundColor: "#1387E2",
    elevation: 5,
    shadowOffset: { width: 0, height: 0 },
    shadowColor: "#1387E2",
    shadowOpacity: 1.5
  },
  buttonText: {
    fontSize: 15,
    color: "#fff"
  }
});

const MoreModal = prop => {
  const { Lang } = prop;
  const modalStyle = StyleSheet.create({
    mask: {
      flex: 1,
      backgroundColor: "rgba(0, 0, 0, 0.75)",
      position: "relative",
      justifyContent: "center",
      alignItems: "center"
    },
    icons: {
      padding: 12,
      fontWeight: "100",
      color: "#AFAFAF"
    },
    content: {
      width: "90%",
      paddingVertical: 12,
      paddingLeft: "5%",
      paddingRight: "5%",
      backgroundColor: "#fff",
      borderRadius: 10
    },
    header: {
      paddingVertical: 12
    },
    infoItem: {
      paddingVertical: "2%",
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "flex-end",
      flexWrap: "wrap"
    },
    infoTitle: {
      fontSize: 16,
      color: "#FD7044"
    },
    infoText: {
      fontSize: 16,
      color: "#5A5A5A"
    }
  });
  return (
    <Modal
      visible={prop.visible}
      transparent
      animationType="slide"
      onRequestClose={() => {}}
    >
      <View style={modalStyle.mask}>
        <View style={modalStyle.content}>
          <IconBlock
            viewStyle={{
              position: "absolute",
              top: 0,
              right: 0,
              zIndex: 100
            }}
            style={modalStyle.icons}
            name="close"
            onPress={() => prop.onClose()}
          />
          <View style={modalStyle.header}>
            <Text style={{ fontSize: 18, fontWeight: "bold" }}>
              {Lang.modal.title}
            </Text>
          </View>
          <View style={modalStyle.body}>
            <View style={modalStyle.infoItem}>
              <Text style={modalStyle.infoTitle}>{Lang.modal.createdAt}</Text>
              <Text tyle={modalStyle.infoText}>
                {moment(Date.parse(prop.content.created_at)).format(
                  "YYYY-MM-DD"
                )}
              </Text>
            </View>
            {prop.content.orderType === "sell" ? (
              <View style={modalStyle.infoItem}>
                <Text style={modalStyle.infoTitle}>
                  {Lang.modal.sellOrderAccount}
                </Text>
                <Text style={modalStyle.infoText}>
                  {prop.content.sell_order_account}
                </Text>
              </View>
            ) : (
              false
            )}
            <View style={modalStyle.infoItem}>
              <Text style={modalStyle.infoTitle}>{Lang.modal.orderNum}</Text>
              <Text style={modalStyle.infoText}>{prop.content.order_num}</Text>
            </View>
            <View style={modalStyle.infoItem}>
              <Text style={modalStyle.infoTitle}>{Lang.modal.amount}</Text>
              <Text style={modalStyle.infoText}>{prop.content.amount}</Text>
            </View>
            <View style={modalStyle.infoItem}>
              <Text style={modalStyle.infoTitle}>{Lang.modal.status}</Text>
              <Text style={modalStyle.infoText}>
                {prop.content.status === "success_callback"
                  ? Lang[prop.content.orderType].status.success
                  : Lang[prop.content.orderType].status[prop.content.status]}
              </Text>
            </View>
            {prop.content.orderType === "sell" ? (
              <View style={modalStyle.infoItem}>
                <Text style={modalStyle.infoTitle}>
                  {Lang.modal.orderRemark}
                </Text>
                <Text style={modalStyle.infoText}>
                  {prop.content.order_remark}
                </Text>
              </View>
            ) : (
              false
            )}
            <View style={modalStyle.infoItem}>
              <Text style={modalStyle.infoTitle}>
                {Lang.modal.validBalance}
              </Text>
              <Text style={modalStyle.infoText}>
                {prop.content.valid_balance}
              </Text>
            </View>
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default ListItem;
