// Tools
import React, { Component } from "react";
import { FlatList, StyleSheet, View, Text } from "react-native";
import { connect } from "react-redux";
import { Actions } from "react-native-router-flux";
import {
  queryBuyOrders,
  queryBuySummary,
  requestCardInfo,
  verifyBuyOrder,
  cancelBuyOrder,
  getUserData
} from "../../actions";
// Components
import { BUY_ODR_SUCCESS } from "../../images";
import ListItem from "../../components/Orders/ListItem";
import PeriodType from "../../components/Orders/PeriodType";
import PeriodScrollList from "../../components/Orders/PeriodScrollList";
import TransferMessage from "../../components/Orders/transferMessage";
import { Spinner, Message, Confirm } from "../../components/common";
class BuyOrders extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isShowTransferMsg: false,
      auth_token: "",
      page: 1,
      totalPage: 0,
      per_page: 10,
      period_type: "",
      period_before: 0,
      loading: false,
      isLoadMore: false,
      messageBox: {
        isShow: false,
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
      lists: [],
      summary: [],
      transferInfo: {},
      userInfo: {}
    };
  }
  componentDidMount() {
    this.onRemoteUserInfo();
  }
  onPeriodScrollListHandler = ({ key, value }) => {
    this.setState(
      {
        auth_token: this.props.requestData.auth_token,
        page: 1,
        period_type: key,
        period_before: value,
        lists: []
      },
      () => {
        this.onRemoteRequest();
      }
    );
  };
  onPeriodHandler = ({ key, value }) => {
    this.setState(
      {
        auth_token: this.props.requestData.auth_token,
        page: 1,
        period_type: key,
        period_before: value,
        lists: []
      },
      () => {
        this.onRemoteRequest();
      }
    );
  };
  onSetFlatListlHeight = height => {
    this.setState({
      flatListlHeight: height - 10
    });
  };
  onMsgCheck = () => {
    const { errorMsg } = this.props;
    this.onShowMsg({ isShow: false }, () => {
      // legal token handler
      if (errorMsg.code === 2003 || errorMsg.code === 2004) {
        Actions.login();
      }
    });
  };
  onShowMsg = ({ isShow, message }) => {
    this.setState({
      messageBox: {
        show: isShow,
        text: message
      }
    });
  };
  onModalHandler = bool => {
    this.setState({
      isShowTransferMsg: bool
    });
  };
  onToServiceCenter = () => {
    const _this = this;
    Actions.serviceCenter();
    setTimeout(() => {
      _this.setState({
        isShowTransferMsg: false
      });
    }, 1300);
  };
  onRenderEmpty = () => {
    if (this.state.lists.length > 0) return null;
    return (
      <View
        style={{
          height: 40,
          justifyContent: "center",
          alignItems: "center"
        }}
      >
        <Text
          style={{
            color: "#6f6f6f",
            fontSize: 16
          }}
        >
          {this.props.Lang.noOrders}
        </Text>
      </View>
    );
  };
  onSetLists = prop => {
    this.setState({
      totalPage: Math.ceil(prop.buy_orders_count / this.state.per_page),
      lists: [...this.state.lists, ...prop.buy_orders]
    });
  };
  onSetSummary = prop => {
    this.setState({
      summary: prop.summary
    });
  };
  onloadMore = () => {
    const { page, totalPage } = this.state;
    this.setState(
      oldState => ({
        page:
          oldState.page === this.state.totalPage
            ? oldState.page
            : oldState.page + 1
      }),
      () => {
        if (page !== totalPage) {
          this.onRemoteRequest();
        }
      }
    );
  };
  onRemoteRequest = () => {
    // setting requset status to component state
    this.setState({
      loading: true,
      isLoadMore: true
    });
    // remote request
    this.onRequestOrders();
    this.onRequestSummary();
  };
  onRequestOrders = () => {
    const {
      auth_token,
      page,
      per_page,
      period_type,
      period_before
    } = this.state;
    this.props
      .queryBuyOrders(auth_token, page, per_page, period_type, period_before)
      .then(rep => {
        if (rep === "OK") {
          this.onSetLists(this.props.ordersInfo);
        }
      })
      .catch(err => {
        if (this.props.errorMsg && this.props.errorMsg.code && this.props.errorMsg.code === null) {
          this.onShowMsg({ isShow: true, ...errorMsg });
        } else {
          // console.error(errorMsg);
        }
      })
      .finally(() => {
        // resetting requset status to component state
        this.setState({
          loading: false,
          isLoadMore: false
        });
      });
  };
  onRequestSummary = () => {
    const period_type = this.state.period_type === "day" && this.state.period_before === 1 ? "yesterday" : this.state.period_type;
    const { auth_token } = this.props.requestData;

    this.props
      .queryBuySummary(auth_token, period_type)
      .then(rep => {
        if (rep === "OK") {
          this.onSetSummary(this.props.summaryInfo);
        }
      })
      .catch(err => {
        if (this.props.errorMsg && this.props.errorMsg.code && this.props.errorMsg.code === null) {
          this.onShowMsg({ isShow: true, ...errorMsg });
        } else {
          // console.error(errorMsg);
        }
      })
      .finally(() => {
        // resetting requset status to component state
        this.setState({
          loading: false,
          isLoadMore: false
        });
      });
  };
  onRemoteVerify = () => {
    const { requestData } = this.props;
    const { auth_token } = requestData;
    const { id: order_num } = this.state.transferInfo;
    this.props
      .verifyBuyOrder(auth_token, order_num)
      .then(rep => {
        if (rep === "OK") {
          this.setState(
            {
              isShowTransferMsg: false
            },
            () => {
              const { orderChecking } = this.props.Lang.confirm;
              this.setState({
                conFirmMsg: {
                  show: true,
                  text: orderChecking.content,
                  conFormBtnText: orderChecking.confirmBtn,
                  cancelBtnText: orderChecking.cancelBtn,
                  imageUrl: BUY_ODR_SUCCESS,
                  confirmHandler: () => {
                    // reset orders
                    this.setState(
                      {
                        lists: []
                      },
                      () => {
                        this.onRemoteRequest();
                      }
                    );
                    const _this = this;
                    setTimeout(() => {
                      _this.setState({
                        conFirmMsg: {
                          show: false
                        }
                      });
                    }, 500);
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
        if (this.props.errorMsg && this.props.errorMsg.code && this.props.errorMsg.code === null) {
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
      .cancelBuyOrder(auth_token, order_num)
      .then(rep => {
        if (rep === "OK") {
          this.setState(
            {
              isShowTransferMsg: false
            },
            () => {
              // reset orders
              this.setState(
                {
                  lists: []
                },
                () => {
                  this.onRemoteRequest();
                }
              );
            }
          );
        }
      })
      .catch(err => {
        if (this.props.errorMsg && this.props.errorMsg.code && this.props.errorMsg.code === null) {
          this.onShowMsg({ isShow: true, ...this.props.errorMsg });
        } else {
          // console.error(this.props.errorMsg);
        }
      });
  };
  onRemoteCardInfo = ({ id: order_num, amount, status }) => {
    const { requestData } = this.props;
    const { auth_token } = requestData;
    this.props
      .requestCardInfo(auth_token, order_num)
      .then(rep => {
        if (rep === "OK") {
          this.setState(
            {
              transferInfo: {
                id: order_num,
                status: status,
                amount: amount,
                card_info: this.props.payCard.card_info
              }
            },
            () => {
              this.setState({
                isShowTransferMsg: true
              });
            }
          );
        }
      })
      .catch(err => {
        if (this.props.errorMsg && this.props.errorMsg.code && this.props.errorMsg.code === null) {
          this.onShowMsg({ isShow: true, ...this.props.errorMsg });
        } else {
          // console.error(this.props.errorMsg);
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
      isShowTransferMsg,
      conFirmMsg,
      lists,
      summary,
      period_type,
      period_before,
      loading,
      transferInfo,
      userInfo
    } = this.state;
    const { Lang } = this.props;

    return (
      <View style={style.layout}>
        {/* header */}
        {period_type === "day" || period_type === "yesterday" ? (
          <View
            style={{
              flex: 0.3,
              paddingTop: 20,
              justifyContent: "center",
              backgroundColor: "#f6f6f6"
            }}
          >
            <Text
              style={{
                textAlign: "center",
                fontSize: 18,
                fontWeight: "400"
              }}
            >
              {Lang.balanceStatus}
            </Text>
            <View style={style.userAmount}>
              <View style={style.amountItem}>
                <Text
                  style={{
                    color: "#FD7044",
                    fontSize: 25,
                    fontWeight: "bold",
                    paddingBottom: 5
                  }}
                >
                  {userInfo && userInfo.valid_balance
                    ? userInfo.valid_balance
                    : 0}
                </Text>
                <Text>{Lang.validBalance}</Text>
              </View>
              <View
                style={{
                  width: 1.5,
                  height: "50%",
                  backgroundColor: "#C8C8C9",
                  opacity: 0.25
                }}
              />
              <View style={style.amountItem}>
                <Text
                  style={{
                    color: "#FD7044",
                    fontSize: 25,
                    fontWeight: "bold",
                    paddingBottom: 5
                  }}
                >
                  {userInfo && userInfo.balance ? userInfo.balance : 0}
                </Text>
                <Text>{Lang.balance}</Text>
              </View>
            </View>
            <View style={style.shadowLine} />
          </View>
        ) : (
          <View style={{ ...style.header, minHeight: 60 }}>
            <PeriodScrollList
              orderType="buy"
              summary={summary}
              Lang={Lang}
              periodBefore={period_before}
              periodType={period_type}
              onPeriodClick={this.onPeriodHandler}
            />
          </View>
        )}
        {/* content */}
        <View
          style={{
            ...style.listBlock,
            backgroundColor: "#fff"
          }}
          onLayout={event =>
            this.onSetFlatListlHeight(event.nativeEvent.layout.height)
          }
        >
          <Spinner visible={loading} />
          <FlatList
            data={lists}
            keyExtractor={(item, index) => index.toString()}
            renderItem={({ item, index }) => {
              return (
                <ListItem
                  userInfo={this.state.userInfo}
                  item={item}
                  index={index}
                  Lang={Lang}
                  orderType="buy"
                  onPayFee={this.onRemoteCardInfo}
                />
              );
            }}
            onEndReachedThreshold={0.1}
            onEndReached={this.onloadMore}
            ListEmptyComponent={this.onRenderEmpty}
            style={{
              height: this.state.flatListlHeight,
              backgroundColor: "#Fff"
            }}
            contentContainerStyle={{
              marginLeft: "5%",
              marginRight: "5%",
              paddingBottom: 20
            }}
          />
        </View>
        {/* footer */}
        <View style={style.footer}>
          <PeriodType Lang={Lang} onClick={this.onPeriodHandler} />
        </View>
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
        {this.state.isShowTransferMsg ? (
          <TransferMessage
            Lang={this.props.Lang}
            isShowClose={true}
            show={isShowTransferMsg}
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
      </View>
    );
  }
}
const style = StyleSheet.create({
  layout: {
    flex: 1,
    alignItems: "stretch",
    justifyContent: "space-between"
  },
  listBlock: {
    flex: 1
  },
  shadowLine: {
    width: "100%",
    height: 1,
    position: "absolute",
    bottom: 0,
    zIndex: -1,
    elevation: 5,
    shadowOffset: { width: 0, height: 1 },
    shadowColor: "#6f6f6f",
    shadowOpacity: 10,
    backgroundColor: "rgba(0, 0, 0, 0.1)"
  },
  userAmount: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center"
  },
  amountItem: {
    flex: 1,
    paddingVertical: 8,
    justifyContent: "center",
    alignItems: "center"
  },
  footer: {
    flex: 0.2,
    paddingVertical: 20,
    alignItems: "center",
    backgroundColor: "#fff"
  },
  recordList: {
    marginLeft: "auto",
    marginRight: "auto",
    flexDirection: "row"
  },
  listItem: {
    flex: 1,
    flexDirection: "row"
  },
  recordAmount: {
    color: "#FD7044",
    fontSize: 30
  },
  confirmImgBox: {
    paddingVertical: 30
  },
  confirmImg: {
    bottom: -30
  }
});

const mapStateToProps = state => {
  return {
    ordersInfo: state.buyOrders.ordersInfo,
    summaryInfo: state.buyOrders.summaryInfo,
    errorMsg: state.buyOrders.errorMsg,
    requestData: state.loginData.userData.content,
    payCard: state.buyOrders.transferInfo,
    userContent: state.homeData.userInfo.content,
    userInfoErrorMsg: state.homeData.errorMsg
  };
};
export default connect(
  mapStateToProps,
  {
    queryBuyOrders,
    queryBuySummary,
    requestCardInfo,
    verifyBuyOrder,
    cancelBuyOrder,
    getUserData
  }
)(BuyOrders);
