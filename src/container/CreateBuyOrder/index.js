import React, { Component } from "react";
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  ImageBackground,
  Platform
} from "react-native";
import { connect } from "react-redux";
import { Actions } from "react-native-router-flux";
import { BUY_ODR_BTN_ATV, BUY_ODR_SUCCESS } from "../../images";
import {
  createOrderRequest,
  verifyOrderRequest,
  cancelOrderRequest,
  requestBuyOrderExist,
  requestBuyOrderCardInfo,
  getUserData
} from "../../actions";
import Language from "../../Language.json";
/* Components */
import TransferMessage from "../../components/Orders/transferMessage";
import { Card, IconBlock, Message, Confirm } from "../../components/common";

class CreateBuyOrder extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isShowMsg: false,
      activeAmount: 0,
      buyAmount: [300, 500, 1000, 2000, 5000, 10000],
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
      },
      userInfo: {},
      transferInfo: {}
    };
    this.Lang = Language[this.props.langCountry].createBuyOrderPage;
  }
  componentDidMount() {
    this.onRemoteUserInfo();
    // check order exist
    this.onRemoteExist();
    // setting default amount
    this.onAmountClick(this.state.buyAmount[0]);
  }
  componentWillReceiveProps(nextProps) {
    this.Lang = Language[nextProps.langCountry].createBuyOrderPage;
  }
  onCalculationBounsRate = ({ rate = 0 }) => {
    return this.state.activeAmount * parseFloat(rate);
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
    const { errorMsg, existing } = this.props;
    this.onShowMsg({ isShow: false }).then(() => {
      // legal token handler
      if (errorMsg.code === 2003 || errorMsg.code === 2004) {
        Actions.login();
      }
      if (existing && existing.existing_order) {
        this.setState(
          {
            transferInfo: {
              id: this.props.existing.order[0].id,
              status: this.props.existing.order[0].status,
              amount: this.props.existing.order[0].amount,
              card_info: this.props.existCardInfo.card_info
            }
          },
          () => {
            this.setState({
              isShowMsg: true
            });
          }
        );
      }
    });
  };
  onModalHandler = bool => {
    this.setState({
      isShowMsg: bool
    });
  };
  onToServiceCenter = () => {
    const _this = this;
    Actions.serviceCenter();
    setTimeout(() => {
      _this.setState({
        isShowMsg: false
      });
    }, 1300);
  };
  onSubmitHandler = () => {
    const { requestData } = this.props;
    const { auth_token } = requestData;
    this.props
      .requestBuyOrderExist(auth_token)
      .then(rep => {
        if (rep === "OK") {
          const { existing_order } = this.props.existing;
          if (existing_order) {
            this.onRemoteCardInfo();
          } else {
            const { sureBuy, base } = this.Lang.confirm;
            this.setState({
              conFirmMsg: {
                show: true,
                text: `${sureBuy} $${this.state.activeAmount}`,
                conFormBtnText: base.confirmBtn,
                cancelBtnText: base.cancelBtn,
                confirmHandler: () => {
                  this.setState(
                    {
                      conFirmMsg: {
                        show: false
                      }
                    },
                    () => this.onRemoteCreateOrder()
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
          }
        }
      })
      .catch(err => {
        if (
          this.props.errorMsg &&
          this.props.errorMsg.code &&
          this.props.errorMsg.code === null
        ) {
          this.onShowMsg({ isShow: true, ...errorMsg });
        } else {
          // console.error(errorMsg);
        }
      });
  };
  onAmountClick = value => {
    this.setState({
      activeAmount: value
    });
  };
  onRemoteExist = () => {
    const { requestData } = this.props;
    const { auth_token } = requestData;
    this.props
      .requestBuyOrderExist(auth_token)
      .then(rep => {
        if (rep === "OK") {
          const { existing_order } = this.props.existing;
          if (existing_order) {
            this.onRemoteCardInfo();
          }
        }
      })
      .catch(err => {
        if (
          this.props.errorMsg &&
          this.props.errorMsg.code &&
          this.props.errorMsg.code === null
        ) {
          this.onShowMsg({ isShow: true, ...errorMsg });
        } else {
          // console.error(errorMsg);
        }
      });
  };
  onRemoteCardInfo = () => {
    const { requestData } = this.props;
    const { id: order_num, status } = this.props.existing.order[0];
    const { orderExisting, orderCheckIngExisting } = this.Lang;
    const { auth_token } = requestData;
    this.props
      .requestBuyOrderCardInfo(auth_token, order_num)
      .then(rep => {
        if (rep === "OK") {
          this.onShowMsg({
            isShow: true,
            message:
              status === "checking" ? orderCheckIngExisting : orderExisting
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
  onRemoteCreateOrder = () => {
    const { activeAmount: amount } = this.state;
    const { requestData } = this.props;
    const { auth_token } = requestData;
    this.props
      .createOrderRequest(auth_token, amount)
      .then(rep => {
        if (rep === "OK") {
          this.setState(
            {
              transferInfo: {
                id: this.props.orderContent.order.id,
                status: this.props.existing.order.status,
                amount: this.props.orderContent.amount,
                card_info: this.props.orderContent.card_info
              }
            },
            () => {
              this.setState({
                isShowMsg: true
              });
            }
          );
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
  onRemoteVerify = () => {
    const { requestData } = this.props;
    const { auth_token } = requestData;
    const { id: order_num } = this.state.transferInfo;
    this.props
      .verifyOrderRequest(auth_token, order_num)
      .then(rep => {
        if (rep === "OK") {
          this.setState(
            {
              isShowMsg: false
            },
            () => {
              const { orderChecking } = this.Lang.confirm;
              this.setState({
                conFirmMsg: {
                  show: true,
                  text: orderChecking.content,
                  conFormBtnText: orderChecking.confirmBtn,
                  cancelBtnText: orderChecking.cancelBtn,
                  imageUrl: BUY_ODR_SUCCESS,
                  confirmHandler: () => {
                    Actions.reset("orders", { switchOptionsVal: "buy" });
                  },
                  cancelHandler: () => {
                    Actions.reset("home");
                  }
                }
              });
            }
          );
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
  onRemoteCancel = () => {
    const { requestData } = this.props;
    const { auth_token } = requestData;
    const { id: order_num } = this.state.transferInfo;
    this.props
      .cancelOrderRequest(auth_token, order_num)
      .then(rep => {
        if (rep === "OK") {
          this.setState(
            {
              isShowMsg: false
            }
            // () => Actions.orders()
          );
        }
      })
      .catch(err => {
        if (
          this.props.errorMsg &&
          this.props.errorMsg.code &&
          this.props.errorMsg.code === null
        ) {
          this.onShowMsg({ isShow: true, ...errorMsg });
        } else {
          // console.error(errorMsg);
        }
      });
  };
  onRemoteUserInfo = () => {
    const { requestData } = this.props;
    const { auth_token } = requestData;
    this.props
      .getUserData(auth_token)
      .then(rep => {
        if (rep === "OK") {
          this.setState({
            userInfo: this.props.userContent
          });
        }
      })
      .catch(err => {
        if (
          this.props.errorMsg &&
          this.props.userInfoErrorMsg.code &&
          this.props.userInfoErrorMsg.code === null
        ) {
          this.onShowMsg({ isShow: true, ...this.props.userInfoErrorMsg });
        } else {
          // console.error(errorMsg);
        }
      });
  };
  render() {
    const {
      activeAmount,
      isShowMsg,
      conFirmMsg,
      transferInfo,
      userInfo
    } = this.state;
    return (
      <Card
        style={[
          style.layout,
          Platform.OS === "android" ? style.resetLayoutPadding : false
        ]}
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
              <Text style={style.pageTitle}>{this.Lang.buyTab}</Text>
            </View>
          </View>
        </View>
        {/* content */}
        <View style={{ flex: 1 }}>
          {/* user  valid_balance */}
          <View>
            <Text style={style.buyAmountTitle}>{this.Lang.buyTitle}</Text>
            <Text style={style.userValidBalance}>
              {this.Lang.validBalance} $
              {userInfo && userInfo.valid_balance ? userInfo.valid_balance : 0}
            </Text>
          </View>
          {/* amount buttons */}
          <View style={style.btnBox}>
            {this.state.buyAmount.map(item => {
              return (
                <TouchableOpacity
                  key={item}
                  style={style.amountBtn}
                  onPress={() => this.onAmountClick(item)}
                >
                  <ImageBackground
                    source={BUY_ODR_BTN_ATV}
                    style={{
                      flex: 1,
                      justifyContent: "center",
                      alignItems: "center",
                      borderRadius: 25,
                      backgroundColor:
                        item === activeAmount ? "rgba(0,0,0,0)" : "#ebebea"
                    }}
                    imageStyle={{
                      resizeMode: "cover",
                      borderWidth: 1,
                      borderColor:
                        item === activeAmount ? "rgba(0,0,0,0)" : "#e6e6e6",
                      borderRadius: 25,
                      opacity: item === activeAmount ? 1 : 0
                    }}
                  >
                    <Text
                      style={{
                        ...style.amountBtnText,
                        color: item === activeAmount ? "#fff" : "#CFCFD1",
                        fontWeight: item === activeAmount ? "bold" : "normal"
                      }}
                    >
                      {item}
                    </Text>
                  </ImageBackground>
                </TouchableOpacity>
              );
            })}
          </View>
          {/* show buy total */}
          <View style={style.amountBox}>
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
                paddingVertical: "3%"
              }}
            >
              <Text style={style.buyFee}>{this.Lang.buyFee}</Text>
              <Text style={style.buyFee}>{activeAmount}</Text>
            </View>
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
                paddingVertical: "3%"
              }}
            >
              <Text style={style.buyAddBonus}>{this.Lang.bonus}</Text>
              <Text style={style.buyAddBonus}>
                {this.onCalculationBounsRate(userInfo)}
              </Text>
            </View>
            <View
              style={{
                width: "100%",
                height: 1,
                backgroundColor: "#fff"
              }}
            />
            <View style={style.buyTotal}>
              <Text
                style={{
                  color: "#707070",
                  fontSize: 20,
                  paddingBottom: 8,
                  fontWeight: "bold"
                }}
              >
                {this.Lang.buyTotal}
              </Text>
              <Text
                style={{
                  flexDirection: "row",
                  alignItems: "baseline"
                }}
              >
                <Text
                  style={{
                    color: "#B1B1B1",
                    fontSize: 32
                  }}
                >
                  $
                </Text>
                <Text
                  style={{
                    color: "#F7820E",
                    fontSize: 50
                  }}
                >
                  {activeAmount + this.onCalculationBounsRate(userInfo)}
                </Text>
              </Text>
            </View>
          </View>

          {/* footer */}
          <View style={style.footer}>
            <TouchableOpacity
              style={style.submitBtn}
              onPress={() => this.onSubmitHandler()}
            >
              <Text style={{ color: "#fff", fontSize: 16 }}>
                {this.Lang.buttons.createOrder}
              </Text>
            </TouchableOpacity>
            <Text
              style={{
                paddingVertical: 5,
                color: "#89898A",
                fontSize: 16,
                textAlign: "center"
              }}
            >
              {this.Lang.remind}
            </Text>
          </View>
        </View>
        {isShowMsg ? (
          <TransferMessage
            isShowClose={true}
            Lang={this.Lang}
            show={isShowMsg}
            onShow={this.onModalHandler}
            onToService={this.onToServiceCenter}
            onTransferSubmit={this.onRemoteVerify}
            onTransferCancel={this.onRemoteCancel}
            orderContent={transferInfo}
          />
        ) : (
          false
        )}
        {conFirmMsg.show ? (
          <Confirm
            visible={conFirmMsg.show}
            messageTxt={conFirmMsg.text}
            checkTxt={conFirmMsg.conFormBtnText}
            cancelTxt={conFirmMsg.cancelBtnText}
            imageUrl={conFirmMsg.imageUrl}
            msgImage={style.confirmMsgImage}
            confirmImgBox={style.confirmImgBox}
            confirmImg={style.confirmImg}
            onOK={() => conFirmMsg.confirmHandler()}
            onCancel={() => conFirmMsg.cancelHandler()}
          />
        ) : (
          false
        )}
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
      </Card>
    );
  }
}

const style = StyleSheet.create({
  layout: { flex: 1, backgroundColor: "#F0F0F0" },
  resetLayoutPadding: {
    paddingTop: 15
  },
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
  buyAmountTitle: {
    textAlign: "center",
    color: "#000",
    fontSize: 20,
    fontWeight: "bold"
  },
  userValidBalance: {
    paddingVertical: 5,
    textAlign: "center",
    fontSize: 16,
    color: "#BEBEC3"
  },
  btnBox: {
    paddingTop: "1.5%",
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    alignItems: "center"
  },
  amountBtn: {
    width: "46%",
    aspectRatio: 2.95,
    marginLeft: "2%",
    marginRight: "2%",
    marginBottom: "2.5%"
  },
  amountBtnText: {
    color: "#CFCFD1",
    fontSize: 28
  },
  amountBox: {
    width: "90%",
    marginLeft: "auto",
    marginRight: "auto"
  },
  buyFee: {
    color: "#000",
    fontSize: 20
  },
  buyAddBonus: {
    color: "#F7820D",
    fontSize: 18
  },
  buyTotal: {
    paddingVertical: "1%",
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    alignItems: "flex-end"
  },
  submitBtn: {
    width: "100%",
    aspectRatio: 6.5,
    borderRadius: 50,
    justifyContent: "center",
    alignItems: "center",
    elevation: 5,
    shadowOffset: { width: 1, height: 5 },
    shadowColor: "#ccc",
    shadowOpacity: 1.5,
    backgroundColor: "#F7820D"
  },
  confirmImgBox: {
    paddingVertical: 30
  },
  confirmImg: {
    bottom: -30
  },
  footer: {
    width: "90%",
    paddingVertical: "2%",
    marginLeft: "auto",
    marginRight: "auto"
  }
});

const mapStateToProps = state => {
  return {
    langCountry: state.languageType.langCountry,
    orderContent: state.createBuyOrder.info.content,
    existing: state.createBuyOrder.existContent,
    existCardInfo: state.createBuyOrder.existCardInfo,
    userContent: state.homeData.userInfo.content,
    requestData: state.loginData.userData.content,
    errorMsg: state.createBuyOrder.errorMsg,
    userInfoErrorMsg: state.homeData.errorMsg
  };
};

export default connect(
  mapStateToProps,
  {
    createOrderRequest,
    verifyOrderRequest,
    cancelOrderRequest,
    requestBuyOrderExist,
    requestBuyOrderCardInfo,
    getUserData
  }
)(CreateBuyOrder);
