import React, { Component } from "react";
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  BackHandler
} from "react-native";
import { connect } from "react-redux";
import { Actions } from "react-native-router-flux";
import Switches from "react-native-switches";
import Icon from "react-native-vector-icons/FontAwesome";
import {
  requestCodes,
  upDateCodesStatus,
  deleteCodes,
  singleProfileAccount
} from "../../actions";
// components
import Language from "../../Language.json";
import { Card, IconBlock, Message, Confirm } from "../../components/common";

class QRCodes extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isShowWeChat: false,
      isDelete: false,
      weChatAccount: {},
      list: [],
      messageBox: {
        show: false,
        text: ""
      },
      conFirmMsg: {
        show: false,
        text: "",
        conFormBtnText: "",
        cancelBtnText: "",
        imageUrl: "",
        confirmHandler: () => {},
        cancelHandler: () => {}
      }
    };
    this.Lang = Language[this.props.langCountry].qrCodesPage;
  }
  componentDidMount() {
    this.backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      this.onBackPressHandle
    );
    this.onRemoteSingleAccounts();
    this.onRemoteCodes();
  }
  componentWillUnmount() {
    this.backHandler.remove();
  }
  onBackPressHandle = () => {
    this.props.refresh();
  };
  onDeleteHandler = ({ id: code_id, remark }) => {
    const { confirm } = this.Lang;
    this.setState({
      conFirmMsg: {
        show: true,
        text: `${confirm.hasDelete}${remark}`,
        conFormBtnText: confirm.base.confirmBtn,
        cancelBtnText: confirm.base.cancelBtn,
        confirmHandler: () => {
          this.setState(
            {
              conFirmMsg: {
                show: false
              }
            },
            () => this.onRemoteDelete(code_id)
          );
        },
        cancelHandler: () => {
          this.setState({
            conFirmMsg: {
              show: false
            }
          });
        }
      }
    });
  };
  onSetLists = prop => {
    this.setState({
      list: prop.codes
    });
  };
  onChangeDeleteStatus = () => {
    this.setState(
      oldState => {
        return {
          isDelete: !oldState.isDelete
        };
      },
      () => this.onSetLists(this.props.qrcodes)
    );
  };
  onShowMsg = async ({ isShow, message }) => {
    this.setState({
      messageBox: {
        show: isShow,
        text: message
      }
    });
  };
  onMsgCheck = () => {
    const { errorMsg } = this.props;
    this.onShowMsg({ isShow: false }).then(() => {
      // legal token handler
      if (errorMsg.code === 2003 || errorMsg.code === 2004) {
        Actions.login();
      }
    });
  };
  onRemoteDelete = code_id => {
    const { requestData, singleAccount } = this.props;
    const { auth_token } = requestData;
    const { id: acct_id } = singleAccount;
    this.props
      .deleteCodes({ auth_token, acct_id, code_id })
      .then(rep => {
        if (rep === "OK") {
          this.onRemoteCodes();
          this.onRemoteSingleAccounts();
        }
      })
      .catch(err => {
        if (
          this.props.errorMsg &&
          this.props.errorMsg.code &&
          this.props.errorMsg.code !== null
        ) {
          this.onShowMsg({ isShow: true, ...this.props.errorMsg });
        } else {
          // console.error(this.props.errorMsg);
        }
      });
  };
  onRemoteUpdateStatus = ({ code_id, newStatus: status }) => {
    const { requestData, singleAccount } = this.props;
    const { auth_token } = requestData;
    const { id: acct_id } = singleAccount;
    this.props
      .upDateCodesStatus({ auth_token, acct_id, status, code_id })
      .then(rep => {
        if (rep === "OK") {
          this.onRemoteCodes();
        }
      })
      .catch(err => {
        if (
          this.props.errorMsg &&
          this.props.errorMsg.code &&
          this.props.errorMsg.code !== null
        ) {
          this.onShowMsg({ isShow: true, ...this.props.errorMsg });
        } else {
          // console.error(this.props.errorMsg);
        }
      });
  };
  onRemoteCodes = () => {
    const { requestData, weChatId: acct_id } = this.props;
    const { auth_token } = requestData;
    this.props
      .requestCodes({ auth_token, acct_id })
      .then(rep => {
        if (rep === "OK") {
          this.onSetLists(this.props.qrcodes);
        }
      })
      .catch(err => {
        if (
          this.props.errorMsg &&
          this.props.errorMsg.code &&
          this.props.errorMsg.code !== null
        ) {
          this.onShowMsg({ isShow: true, ...this.props.errorMsg });
        } else {
          // console.error(this.props.errorMsg);
        }
      });
  };
  onRemoteSingleAccounts = () => {
    const { requestData, weChatId: acct_id } = this.props;
    const { auth_token } = requestData;
    this.props
      .singleProfileAccount({ auth_token, acct_id })
      .then(rep => {
        if (rep === "OK") {
          this.setState({
            weChatAccount: this.props.singleAccount
          });
        }
      })
      .catch(err => {
        if (
          this.props.errorMsg &&
          this.props.errorMsg.code &&
          this.props.errorMsg.code !== null
        ) {
          this.onShowMsg({ isShow: true, ...this.props.errorMsg });
        } else {
          // console.error(this.props.errorMsg);
        }
      });
  };
  render() {
    return (
      <Card
        style={{
          backgroundColor: "#F6F6F6"
        }}
      >
        {/* header */}
        <View style={style.header}>
          <IconBlock
            name="chevron-left"
            style={{
              paddingRight: 15
            }}
            onPress={() => {
              Actions.pop();
              this.props.refresh();
            }}
          />
          <View style={style.tabs}>
            <View style={[style.tabItem]}>
              <Text style={style.pageTitle}>{this.Lang.title}</Text>
            </View>
          </View>
        </View>
        {/* WeChat info */}
        <View
          style={{
            width: "100%",
            paddingLeft: "8%",
            paddingRight: "8%",
            marginBottom: 8
          }}
        >
          <View
            style={{
              paddingVertical: 5,
              paddingLeft: "5%",
              paddingRight: "5%",
              flexDirection: "row",
              justifyContent: "center",
              alignItems: "center",
              borderTopLeftRadius: 10,
              borderTopRightRadius: 10
            }}
          >
            <Text
              style={{
                color: "#1D4E7C",
                fontSize: 20,
                fontWeight: "700"
              }}
            >
              {this.state.weChatAccount.acct_name}
            </Text>
          </View>
          <TouchableOpacity
            style={{
              paddingVertical: 4,
              flexDirection: "row",
              justifyContent: "center",
              alignItems: "center"
            }}
            onPress={() =>
              this.setState(oldState => {
                return {
                  isShowWeChat: !oldState.isShowWeChat
                };
              })
            }
          >
            <Icon
              style={{ paddingLeft: 5, paddingRight: 5 }}
              name="user"
              size={13}
              color="#95989A"
              theme={{ iconFamily: "FontAwesome" }}
            />
            <Text
              style={{
                color: "#95989A",
                fontSize: 14
              }}
            >
              {this.Lang.buttons.userInfo}
            </Text>
            <Icon
              style={{ paddingLeft: 5, paddingRight: 5 }}
              name="angle-down"
              size={13}
              color="#95989A"
              theme={{ iconFamily: "FontAwesome" }}
            />
          </TouchableOpacity>
          <View
            style={{
              height: this.state.isShowWeChat ? "auto" : 0,
              paddingLeft: "10%",
              paddingRight: "10%",
              backgroundColor: "#fff",
              borderRadius: 10,
              overflow: this.state.isShowWeChat ? "visible" : "hidden"
            }}
          >
            <View style={style.contentItem}>
              <Text style={style.itemTitle}>{this.Lang.content.name}</Text>
              <Text style={style.itemInfo}>
                {this.state.weChatAccount.name}
              </Text>
            </View>
            <View style={style.contentItem}>
              <Text style={style.itemTitle}>{this.Lang.content.account}</Text>
              <Text style={style.itemInfo}>
                {this.state.weChatAccount.account}
              </Text>
            </View>
            <View style={style.contentItem}>
              <Text style={style.itemTitle}>{this.Lang.content.nickName}</Text>
              <Text style={style.itemInfo}>
                {this.state.weChatAccount.nickname}
              </Text>
            </View>
          </View>
        </View>
        <View
          style={{
            width: "100%",
            paddingLeft: "8%",
            paddingRight: "8%",
            flexDirection: "row",
            justifyContent: "space-between",
            marginLeft: "auto",
            marginRight: "auto"
          }}
        >
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <Text
              style={{
                color: "#1D4E7C",
                fontWeight: "bold",
                fontSize: 20,
                paddingRight: 10
              }}
            >
              {this.Lang.content.qrCode}
            </Text>
            <Text style={{ fontSize: 15, color: "#707070" }}>
              {this.Lang.content.codeTotal}
            </Text>
            <Text
              style={{
                fontSize: 15,
                color: "#F7820D",
                marginLeft: 5,
                marginRight: 5
              }}
            >
              {this.state.weChatAccount.codes_count}
            </Text>
            <Text style={{ fontSize: 15, color: "#707070" }}>
              {this.Lang.content.codesCountNum}
            </Text>
          </View>
          <TouchableOpacity
            style={[style.tabItem]}
            onPress={() => {
              const _this = this;
              setTimeout(() => {
                _this.onChangeDeleteStatus();
              }, 300);
            }}
          >
            <Text style={style.nextPageTitle}>
              {this.state.isDelete
                ? this.Lang.buttons.finish
                : this.Lang.buttons.delete}
            </Text>
          </TouchableOpacity>
        </View>
        {/* codes List */}
        <ScrollView
          key="qrCode"
          contentContainerStyle={{
            width: "100%",
            paddingVertical: 20,
            paddingLeft: "8%",
            paddingRight: "8%",
            flexDirection: "row",
            justifyContent: "flex-start",
            alignItems: "stretch",
            flexWrap: "wrap"
          }}
        >
          {this.state.list.map((item, index) => {
            return (
              <CodeItem
                key={item.id}
                content={item}
                Lang={this.Lang}
                isDelete={this.state.isDelete}
                onUpdateStatus={this.onRemoteUpdateStatus}
                onDelete={this.onDeleteHandler}
                onRemoteCodes={() => this.onRemoteCodes()}
                weChatInfo={this.props.singleAccount}
              />
            );
          })}
          {this.state.isDelete ? (
            false
          ) : (
            <TouchableOpacity
              style={style.addBtn}
              onPress={() =>
                Actions.uploadQRcode({
                  weChatCodeCreate: {
                    acct_id: this.props.singleAccount.id,
                    codes_count: this.props.singleAccount.codes_count,
                    refresh: () => this.onRemoteCodes()
                  }
                })
              }
            >
              <IconBlock name="plus" color="#F0F0F0" size={66} />
              <Text
                style={{ color: "#707070", fontSize: 20, fontWeight: "bold" }}
              >
                {this.Lang.buttons.addCodes}
              </Text>
            </TouchableOpacity>
          )}
        </ScrollView>
        {this.state.messageBox.show ? (
          <Message
            visible={this.state.messageBox.show}
            messageTxt={this.state.messageBox.text}
            checkTxt="OK"
            onOK={() => this.onMsgCheck()}
          />
        ) : (
          false
        )}
        {this.state.conFirmMsg.show ? (
          <Confirm
            visible={this.state.conFirmMsg.show}
            messageTxt={this.state.conFirmMsg.text}
            checkTxt={this.state.conFirmMsg.conFormBtnText}
            cancelTxt={this.state.conFirmMsg.cancelBtnText}
            imageUrl={this.state.conFirmMsg.imageUrl}
            msgImage={style.confirmMsgImage}
            confirmImgBox={style.confirmImgBox}
            confirmImg={style.confirmImg}
            onOK={() => this.state.conFirmMsg.confirmHandler()}
            onCancel={() => this.state.conFirmMsg.cancelHandler()}
          />
        ) : (
          false
        )}
      </Card>
    );
  }
}
const style = StyleSheet.create({
  header: {
    paddingVertical: 8,
    paddingLeft: 20,
    paddingRight: 20,
    flexDirection: "row"
  },
  tabs: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    marginLeft: 5
  },
  tabItem: {
    justifyContent: "center"
  },
  pageTitle: {
    color: "#FD7348",
    fontSize: 18
  },
  nextPageTitle: {
    paddingTop: 5,
    paddingBottom: 5,
    paddingLeft: 10,
    paddingRight: 10,
    color: "#666",
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: "#666666"
  },
  addBtn: {
    width: "46%",
    aspectRatio: 0.87,
    marginLeft: "2%",
    marginRight: "2%",
    marginBottom: 10,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 10,
    backgroundColor: "#fff",
    elevation: 5,
    shadowOffset: { width: 0, height: 5 },
    shadowColor: "#c6c6c6",
    shadowOpacity: 0.75,
    shadowRadius: 5
  },
  contentItem: {
    paddingVertical: 8,
    flexDirection: "row",
    alignItems: "center"
  },
  itemTitle: {
    paddingRight: "5%",
    color: "#8D8D8D",
    fontSize: 14
  },
  itemInfo: {
    flex: 1,
    textAlign: "right",
    color: "#02223F",
    fontWeight: "bold",
    fontSize: 16
  },
  confirmImgBox: {
    paddingVertical: 30
  },
  confirmImg: {
    bottom: -30
  }
});

/*=================================================================== */
/**
 * Codes item component
 * QR Code狀態:
 *  verifying-> 驗證中
    verified-> 已驗證
    suspended-> 已停用
    failed-> 已失效
 *
 */
const CodeItem = prop => {
  const {
    Lang,
    content,
    isDelete,
    onUpdateStatus,
    onDelete,
    parentWidth,
    onRemoteCodes,
    weChatInfo
  } = prop;
  const { id, remark, orders_count, status } = content;
  const itemStyle = StyleSheet.create({
    layout: {
      width: "46%",
      aspectRatio: 0.87,
      marginLeft: "2%",
      marginRight: "2%",
      paddingTop: 10,
      paddingLeft: "5%",
      paddingRight: "5%",
      marginBottom: 10,
      justifyContent: "space-around",
      alignItems: "stretch",
      borderRadius: 10,
      backgroundColor: "#fff",
      elevation: 5,
      shadowOffset: { width: 0, height: 5 },
      shadowColor: "#c6c6c6",
      shadowOpacity: 0.75,
      shadowRadius: 5
    },
    deleteStyle: {
      borderColor: "#000",
      borderWidth: 2
    },
    content: {
      flex: 1,
      justifyContent: "center"
    },
    contentItem: {
      flexDirection: "row",
      justifyContent: "center",
      alignItems: "center"
    },
    footer: {
      paddingVertical: 5,
      borderBottomLeftRadius: 8,
      borderBottomRightRadius: 8,
      justifyContent: "center",
      alignItems: "center"
    },
    deleteBtn: {
      width: "95%",
      height: 40,
      borderRadius: 50,
      marginLeft: "auto",
      marginRight: "auto",
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: "#707070"
    },
    footerBtnText: {
      fontWeight: "bold",
      color: "#fff",
      fontSize: 17
    },
    iconDeleteBox: {
      position: "absolute",
      top: -12.5,
      right: -12.5,
      paddingBottom: 6,
      paddingLeft: 6,
      zIndex: 100
    },
    iconDelete: {
      padding: 0,
      color: "#000",
      fontSize: 30
    },
    verifiedBg: {
      backgroundColor: "#F7820D"
    },
    verifyingBg: {
      backgroundColor: "#F7820D"
    },
    suspendedBg: {
      backgroundColor: "#2D7BC3"
    },
    failedBg: {
      backgroundColor: "#707070"
    },
    verifiedColor: {
      color: "#F7820D"
    },
    verifyingColor: {
      color: "#2E7CC3"
    },
    suspendedColor: {
      color: "#F7820D"
    },
    failedColor: {
      color: "#D3D3D3"
    },
    switchBtnText: {
      color: "#707070",
      fontWeight: "bold"
    }
  });

  onFilterSwitchOptions = obj => {
    return obj;
  };
  onStatusHandler = ({ status, id: code_id }) => {
    switch (status) {
      case "verified":
        setTimeout(() => {
          onUpdateStatus({ code_id, newStatus: false });
        }, 300);
        break;
      case "suspended":
        setTimeout(() => {
          onUpdateStatus({ code_id, newStatus: true });
        }, 300);
        break;
      case "verified":
        // 去新增微信頁
        break;
      default:
        return false;
    }
  };
  return (
    <View style={[itemStyle.layout, isDelete ? itemStyle.deleteStyle : false]}>
      {isDelete ? (
        <View
          style={{
            position: "absolute",
            top: 0,
            bottom: 0,
            left: 0,
            right: 0,
            margin: "auto",
            zIndex: 99,
            backgroundColor: "rgba(0,0,0,0.2)"
          }}
        />
      ) : (
        false
      )}
      {isDelete ? (
        <TouchableOpacity
          style={itemStyle.iconDeleteBox}
          onPress={() => onDelete({ id, remark })}
        >
          <IconBlock
            name="times-circle"
            style={itemStyle.iconDelete}
            viewStyle={{ borderRadius: 30, backgroundColor: "#fff" }}
          />
        </TouchableOpacity>
      ) : (
        false
      )}
      {/* card item header */}
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
          borderBottomColor: "#F0F0F0",
          borderBottomWidth: 2
        }}
      >
        <Text
          style={{
            color: "#707070",
            fontSize: 14,
            fontWeight: "bold"
          }}
        >
          {remark}
        </Text>
        <IconBlock
          name={
            status === "failed"
              ? null
              : status === "verifying"
              ? "history"
              : "check-circle"
          }
          style={{ ...itemStyle[`${status}Color`], fontSize: 18 }}
        />
      </View>
      {/* card item contnet */}
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <Text
          style={{
            color: orders_count > 10 ? "#F84D00" : "#1D4E7C",
            fontSize: 30,
            fontWeight: "600"
          }}
        >
          {orders_count}
        </Text>
        <Text style={{ color: "#707070", fontSize: 14 }}>
          {Lang.content.ordersCount}
        </Text>
      </View>
      <View
        style={{
          justifyContent: "center",
          alignItems: "center",
          paddingVertical: 5
        }}
      >
        {status === "failed" || status === "verifying" ? (
          <Text
            style={{
              ...itemStyle[`${status}Color`],
              fontSize: 26,
              fontWeight: "700"
            }}
          >
            {Lang.statusText[status]}
          </Text>
        ) : (
          <Switches
            shape={"pill"}
            showText={false}
            buttonSize={28}
            buttonOffsetLeft={4}
            buttonOffsetRight={4}
            sliderWidth={90}
            colorSwitchOn="#F7820D"
            onChange={() => this.onStatusHandler(content)}
            value={status === "verified" ? true : false}
          />
        )}
      </View>
    </View>
  );
};
/*=================================================================== */

const mapStateToProps = state => {
  return {
    langCountry: state.languageType.langCountry,
    requestData: state.loginData.userData.content,
    singleAccount: state.qrcodes.singleAccount.account,
    errorMsg: state.qrcodes.errorMsg,
    qrcodes: state.qrcodes.CodesContent
  };
};
export default connect(
  mapStateToProps,
  { requestCodes, upDateCodesStatus, deleteCodes, singleProfileAccount }
)(QRCodes);
