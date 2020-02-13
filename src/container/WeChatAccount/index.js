import React, { Component } from "react";
import {
  StyleSheet,
  View,
  ScrollView,
  Text,
  TouchableOpacity
} from "react-native";
import { connect } from "react-redux";
import { Actions } from "react-native-router-flux";
import {
  requestProfileAccount,
  upDateAccountStatus,
  deleteAccount
} from "../../actions";
import Switches from "react-native-switches";
// components
import Language from "../../Language.json";
import { Card, IconBlock, Message, Confirm } from "../../components/common";

// main component
class WeChatAccount extends Component {
  constructor(props) {
    super(props);
    this.state = {
      test: false,
      isDelete: false,
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
    this.Lang = Language[this.props.langCountry].weChatAccountPage;
  }
  componentDidMount() {
    this.onRemoteProfileAccounts();
  }
  onDeleteHandler = ({ id: acct_id, acct_name }) => {
    const { confirm } = this.Lang;
    this.setState({
      conFirmMsg: {
        show: true,
        text: `${confirm.hasDelete}${acct_name}`,
        conFormBtnText: confirm.base.confirmBtn,
        cancelBtnText: confirm.base.cancelBtn,
        confirmHandler: () => {
          this.setState(
            {
              conFirmMsg: {
                show: false
              }
            },
            () => this.onRemoteDelete(acct_id)
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
      list: prop.accounts
    });
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
  onRemoteDelete = acct_id => {
    const { requestData } = this.props;
    const { auth_token } = requestData;
    this.props
      .deleteAccount({ auth_token, acct_id })
      .then(rep => {
        if (rep === "OK") {
          this.onRemoteProfileAccounts();
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
  onRemoteUpdateAccountStatus = ({ id: acct_id, newStatus: status }) => {
    const { requestData } = this.props;
    const { auth_token } = requestData;
    this.props
      .upDateAccountStatus({ auth_token, acct_id, status })
      .then(rep => {
        if (rep === "OK") {
          this.onRemoteProfileAccounts();
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
  onRemoteProfileAccounts = () => {
    const { requestData } = this.props;
    const { auth_token } = requestData;
    this.props
      .requestProfileAccount(auth_token)
      .then(rep => {
        if (rep === "OK") {
          this.onSetLists(this.props.weChat);
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
            style={{
              paddingRight: 15
            }}
            name="chevron-left"
            onPress={() => Actions.reset("home")}
          />
          <View style={style.tabs}>
            <View style={[style.tabItem]}>
              <Text style={style.pageTitle}>{this.Lang.title}</Text>
            </View>
            <TouchableOpacity
              style={[style.tabItem]}
              onPress={() => {
                const _this = this;
                setTimeout(() => {
                  _this.setState(oldState => {
                    return {
                      isDelete: !oldState.isDelete
                    };
                  });
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
        </View>
        <ScrollView
          key="weChat"
          contentContainerStyle={{
            width: "100%",
            paddingVertical: 20
          }}
        >
          {this.state.list.map((item, index) => {
            return (
              <AccountItem
                key={item.id}
                content={item}
                Lang={this.Lang}
                isDelete={this.state.isDelete}
                onUpdateAccountStatus={this.onRemoteUpdateAccountStatus}
                onDelete={this.onDeleteHandler}
                onRemoteProfileAccounts={() => this.onRemoteProfileAccounts()}
              />
            );
          })}
          {this.state.isDelete ? (
            false
          ) : (
            <TouchableOpacity
              style={{
                ...style.addBtn,
                justifyContent: "center",
                alignItems: "center"
              }}
              onPress={() => Actions.addWechat()}
            >
              <IconBlock name="wechat" color="#F0F0F0" size={66} />
              <Text
                style={{ color: "#707070", fontSize: 20, fontWeight: "bold" }}
              >
                {this.Lang.buttons.addAccount}
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
    paddingBottom: 8,
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
    color: "#000",
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "#000"
  },
  addBtn: {
    width: "90%",
    aspectRatio: 2.2,
    marginLeft: "auto",
    marginRight: "auto",
    marginTop: 10,
    marginBottom: 10,
    borderRadius: 10,
    backgroundColor: "#fff",
    elevation: 5,
    shadowOffset: { width: 0, height: 5 },
    shadowColor: "#c6c6c6",
    shadowOpacity: 0.75,
    shadowRadius: 5
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
 * WeChat account item component
 * 微信帳號狀態:
 *  verifying-> 驗證中
    verified-> 已驗證
    suspended-> 停用
    failed-> 驗證失敗
 *
 */
const AccountItem = prop => {
  const {
    Lang,
    content,
    isDelete,
    onUpdateAccountStatus,
    onDelete,
    onRemoteProfileAccounts
  } = prop;
  const { id, acct_name, status, verified_codes_count } = content;
  const itemStyle = StyleSheet.create({
    layout: {
      width: "90%",
      marginLeft: "auto",
      marginRight: "auto",
      marginTop: 10,
      marginBottom: 10,
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
    header: {
      flex: 1,
      paddingTop: 20,
      paddingBottom: 30,
      paddingLeft: "5%",
      paddingRight: "5%",
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "flex-start"
    },
    content: {
      flex: 2
    },
    contentItem: {
      paddingLeft: "5%",
      paddingRight: "5%",
      paddingVertical: 8,
      flexDirection: "row",
      alignItems: "center"
    },
    itemTitle: {
      flex: 0.4,
      color: "#A7A7A7",
      fontSize: 16
    },
    itemInfo: {
      flex: 0.6,
      color: "#727272",
      fontWeight: "bold",
      fontSize: 16
    },
    footer: {
      width: "100%",
      marginLeft: "auto",
      marginRight: "auto",
      paddingVertical: 8,
      paddingLeft: "8%",
      paddingRight: "8%",
      borderBottomLeftRadius: 8,
      borderBottomRightRadius: 8,
      backgroundColor: "#F4F4F4",
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center"
    },
    footerBtn: {
      alignItems: "center"
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
      backgroundColor: "#F05A2C"
    },
    verifiedColor: {
      color: "#F7820D"
    },
    verifyingColor: {
      color: "#2D7BC3"
    },
    suspendedColor: {
      color: "#2D7BC3"
    },
    failedColor: {
      color: "#EF4D1B"
    }
  });
  onStatusHandler = content => {
    // newStatus -> 欲修改狀態
    let newStatus = "";
    const { id, status: oldStatus } = content;
    switch (oldStatus) {
      case "verified":
        newStatus = false;
        setTimeout(() => {
          onUpdateAccountStatus({ id, newStatus });
        }, 300);
        break;
      case "suspended":
        newStatus = true;
        setTimeout(() => {
          onUpdateAccountStatus({ id, newStatus });
        }, 300);
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
          onPress={() => onDelete({ id, acct_name })}
        >
          <IconBlock
            name="times-circle"
            style={itemStyle.iconDelete}
            viewStyle={{
              borderRadius: 30,
              backgroundColor: "#fff"
            }}
          />
        </TouchableOpacity>
      ) : (
        false
      )}
      <View style={itemStyle.header}>
        <Text style={{ flex: 1, color: "#1D4E7C", fontSize: 28 }}>
          {acct_name}
        </Text>
        {status === "verified" || status === "suspended" ? (
          <Switches
            shape={"pill"}
            buttonSize={28}
            buttonOffsetLeft={4}
            buttonOffsetRight={4}
            sliderWidth={75}
            spaceBetween={1}
            colorSwitchOn="#F7820D"
            colorTextOff={status === "suspended" ? "#000" : "#F7820D"}
            colorTextOn={status === "verified" ? "#fff" : "#D3D5DA"}
            textOff={Lang.buttons.stop}
            textOn={Lang.buttons.start}
            onChange={() => this.onStatusHandler(content)}
            value={status === "verified" ? true : false}
          />
        ) : (
          <View
            style={{
              justifyContent: "center",
              alignItems: "center",
              flexDirection: "row"
            }}
          >
            {status === "verifying" ? (
              <IconBlock name="history" style={itemStyle[`${status}Color`]} />
            ) : (
              false
            )}
            <Text style={{ ...itemStyle[`${status}Color`], fontSize: 18 }}>
              {Lang.statusText[`${status}`]}
            </Text>
          </View>
        )}
      </View>
      <View style={itemStyle.footer}>
        <View
          style={{
            justifyContent: "center",
            alignItems: "center",
            flexDirection: "row"
          }}
        >
          <IconBlock
            name="qrcode"
            color="#707070"
            viewStyle={{ marginRight: 5 }}
          />
          <Text
            style={{
              alignItems: "baseline",
              color: status === "failed" ? "#C1C1C1" : "#F7820D"
            }}
          >
            <Text>{Lang.inUse} </Text>
            <Text style={{ fontSize: 18 }}>{verified_codes_count}</Text>
          </Text>
        </View>
        <TouchableOpacity
          style={{
            justifyContent: "center",
            alignItems: "center",
            flexDirection: "row"
          }}
          activeOpacity={isDelete ? 1 : 0.2}
          onPress={() => {
            if (!isDelete) {
              Actions.qrCodes({
                weChatId: prop.content.id,
                refresh: () => onRemoteProfileAccounts()
              });
            }
          }}
        >
          <Text
            style={{
              color: "#797979"
            }}
          >
            {Lang.buttons.qrCode}
          </Text>
          <IconBlock name="angle-right" color="rgba(0,0,0,0.2)" />
        </TouchableOpacity>
      </View>
    </View>
  );
};
/*=================================================================== */

const mapStateToProps = state => {
  return {
    langCountry: state.languageType.langCountry,
    weChat: state.weChatAccounts.weChatContent,
    requestData: state.loginData.userData.content,
    errorMsg: state.weChatAccounts.errorMsg
  };
};
export default connect(
  mapStateToProps,
  { requestProfileAccount, upDateAccountStatus, deleteAccount }
)(WeChatAccount);
