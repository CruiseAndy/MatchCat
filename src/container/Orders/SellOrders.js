// Tools
import React, { Component } from "react";
import { FlatList, StyleSheet, View, Text } from "react-native";
import { connect } from "react-redux";
import { Actions } from "react-native-router-flux";
import {
  querySellOrders,
  querySellSummary,
  queryWechatAccount,
  getUserData
} from "../../actions";
// Components
import ListItem from "../../components/Orders/ListItem";
import PeriodType from "../../components/Orders/PeriodType";
import PeriodScrollList from "../../components/Orders/PeriodScrollList";
import { Spinner, Message } from "../../components/common";

class SellOrders extends Component {
  constructor(props) {
    super(props);
    this.state = {
      auth_token: "",
      page: 1,
      totalPage: 0,
      per_page: 10,
      period_type: "",
      period_before: 0,
      loading: false,
      isLoadMore: false,
      flatListlHeight: 0,
      messageBox: {
        show: false,
        text: ""
      },
      record: {
        count: {
          key: "sell_order_count",
          value: 0
        },
        successRate: {
          key: "sell_order_success_rate",
          value: 0
        },
        amount: {
          key: "sell_order_amount",
          value: 0
        }
      },
      lists: [],
      summary: [],
      userInfo: {}
    };
  }
  componentDidMount() {
    this.onRemoteUserInfo();
  }
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
        if (
          this.state.period_type === "day" &&
          (this.state.period_before === 0 || this.state.period_before === 1)
        ) {
          this.onSetRecord();
        }
      }
    );
  };
  onSetFlatListlHeight = height => {
    this.setState({ flatListlHeight: height - 10 });
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
  onRenderEmpty = () => {
    if (this.state.lists.length > 0) return null;
    return (
      <View
        style={{ height: 40, justifyContent: "center", alignItems: "center" }}
      >
        <Text style={{ color: "#c5c5c5", fontSize: 16 }}>
          {this.props.Lang.noOrders}
        </Text>
      </View>
    );
  };
  onSetLists = prop => {
    this.setState({
      totalPage: Math.ceil(prop.sell_orders_count / this.state.per_page),
      lists: [...this.state.lists, ...prop.sell_orders]
    });
  };
  onSetRecord = (str = "") => {
    let count = (success_rate = amount = 0);

    if (str === "setting" && this.state.summary[0]) {
      count = this.state.summary[0].sell_order_count;
      success_rate = this.state.summary[0].sell_order_success_rate;
      amount = this.state.summary[0].sell_order_amount;
    }

    this.setState({
      record: {
        count: {
          key: "sell_order_count",
          value: count
        },
        successRate: {
          key: "sell_order_success_rate",
          value: success_rate
        },
        amount: {
          key: "sell_order_amount",
          value: amount
        }
      }
    });
  };
  onSetSummary = prop => {
    this.setState({ summary: prop.summary }, () => {
      if (
        this.state.period_type === "day" &&
        (this.state.period_before === 0 || this.state.period_before === 1)
      ) {
        this.onSetRecord("setting");
      }
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
    this.setState(
      {
        loading: true,
        isLoadMore: true
      },
      () => {
        // remote request
        this.onRequestOrders();
        this.onRequestSummary();
      }
    );
  };
  onRequestOrders = () => {
    const { page, per_page, period_type, period_before } = this.state;
    const { auth_token } = this.props.requestData;
    this.props
      .querySellOrders(auth_token, page, per_page, period_type, period_before)
      .then(rep => {
        if (rep === "OK") {
          this.onSetLists(this.props.ordersInfo);
        }
      })
      .catch(err => {
        if (
          this.props.errorMsg &&
          this.props.errorMsg.code &&
          this.props.errorMsg.code !== null
        ) {
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
    const period_type =
      this.state.period_type === "day" && this.state.period_before === 1
        ? "yesterday"
        : this.state.period_type;
    const { auth_token } = this.props.requestData;
    this.props
      .querySellSummary(auth_token, period_type)
      .then(rep => {
        if (rep === "OK") {
          this.onSetSummary(this.props.summaryInfo);
        }
      })
      .catch(err => {
        if (
          this.props.errorMsg &&
          this.props.errorMsg.code &&
          this.props.errorMsg.code !== null
        ) {
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
  onRemoteWechatAccount = order_num => {
    const { auth_token } = this.props.requestData;
    this.props
      .queryWechatAccount(auth_token, order_num)
      .then(rep => {
        if (rep === "OK") {
          const activeIndex = this.state.lists.findIndex(
            item => item.id === order_num
          );
          if (activeIndex > -1) {
            const stateCopy = Object.assign({}, this.state);
            stateCopy.lists[
              activeIndex
            ].sell_order_account = this.props.weChatAccount.sell_order_account;
            this.setState(stateCopy);
          }
        }
      })
      .catch(err => {
        if (
          this.props.errorMsg &&
          this.props.userInfoErrorMsg.code &&
          this.props.userInfoErrorMsg.code !== null
        ) {
          this.onShowMsg({ isShow: true, ...this.props.userInfoErrorMsg });
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
          this.props.userInfoErrorMsg.code !== null
        ) {
          this.onShowMsg({ isShow: true, ...this.props.userInfoErrorMsg });
        } else {
          // console.error(errorMsg);
        }
      });
  };
  render() {
    const {
      record,
      lists,
      summary,
      period_type,
      period_before,
      loading
    } = this.state;
    const { Lang } = this.props;
    return (
      <View style={style.layout}>
        {/* header */}
        {period_type === "week" || period_type === "month" ? (
          <View style={{ ...style.header, minHeight: 60 }}>
            <PeriodScrollList
              key={period_type}
              orderType="sell"
              summary={summary}
              Lang={Lang}
              periodBefore={period_before}
              periodType={period_type}
              onPeriodClick={this.onPeriodHandler}
            />
          </View>
        ) : (
          <View style={style.header}>
            <Text
              style={{ textAlign: "center", fontSize: 18, paddingVertical: 3 }}
            >
              {period_type === "day" && period_before === 1
                ? Lang.recordTitle.yesterday
                : Lang.recordTitle[period_type]}
            </Text>
            <View>
              <View style={{ paddingVertical: 8, justifyContent: "center" }}>
                <Text
                  style={{
                    color: "#FD7044",
                    fontWeight: "bold",
                    fontSize: 35,
                    textAlign: "center"
                  }}
                >
                  {record.amount.value}
                </Text>
                <Text style={{ textAlign: "center" }}>
                  {Lang.sell.record[record.amount.key]}
                </Text>
              </View>
              <View
                style={{
                  paddingVertical: 3,
                  flexDirection: "row",
                  justifyContent: "center",
                  backgroundColor: "#FD7044"
                }}
              >
                <View
                  style={{
                    flex: 1,
                    flexDirection: "row",
                    justifyContent: "center"
                  }}
                >
                  <Text style={{ alignItems: "baseline" }}>
                    <Text style={{ color: "#262628", marginRight: 5 }}>
                      {Lang.sell.record[record.count.key]}
                    </Text>
                    <Text style={style.recordAmount}>{record.count.value}</Text>
                  </Text>
                </View>
                <View
                  style={{
                    flex: 1,
                    flexDirection: "row",
                    justifyContent: "center"
                  }}
                >
                  <Text style={{ alignItems: "baseline" }}>
                    <Text style={{ color: "#262628", marginRight: 5 }}>
                      {Lang.sell.record[record.successRate.key]}
                    </Text>
                    <Text style={style.recordAmount}>
                      {`${Math.round(record.successRate.value * 10000) / 100}%`}
                    </Text>
                  </Text>
                </View>
              </View>
            </View>
          </View>
        )}
        {/* content */}
        <View
          style={style.listBlock}
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
                  onReady={order_num => this.onRemoteWechatAccount(order_num)}
                  userInfo={this.state.userInfo}
                  item={item}
                  index={index}
                  Lang={Lang}
                  orderType="sell"
                />
              );
            }}
            onEndReachedThreshold={0.1}
            onEndReached={this.onloadMore}
            ListEmptyComponent={this.onRenderEmpty}
            style={{
              height: this.state.flatListlHeight,
              backgroundColor: "#F6f6f6"
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
  footer: {
    flex: 0.2,
    paddingVertical: 20,
    alignItems: "center",
    backgroundColor: "#f6f6f6"
  },
  recordAmount: {
    color: "#fff",
    fontSize: 25,
    fontWeight: "500"
  }
});

const mapStateToProps = state => {
  return {
    ordersInfo: state.sellOrders.ordersInfo,
    weChatAccount: state.sellOrders.weChatAccount,
    summaryInfo: state.sellOrders.summaryInfo,
    errorMsg: state.sellOrders.errorMsg,
    requestData: state.loginData.userData.content,
    userContent: state.homeData.userInfo.content,
    userInfoErrorMsg: state.homeData.errorMsg
  };
};
export default connect(
  mapStateToProps,
  { querySellOrders, querySellSummary, queryWechatAccount, getUserData }
)(SellOrders);
