/*
 * Date : 2019/04/17
 * Writer : kevin
 */

/* Tools */
import React, { Component } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image
} from "react-native";
import { connect } from "react-redux";
import { Actions } from 'react-native-router-flux';

/* Components */
import { Card, Message } from "../../components/common";

/* Actions */
import { changeGrabOrderStatus, startGrabOrder, setGrabOrderData } from "../../actions";

/* Data */
import Language from "../../Language.json";
import { GRAB_ORDER_LOADING } from "../../images";

const ws_url = token => `wss://p2p.feibaopay.com/cable?token=${token}`;
const subscrible_request = {
  command: "subscribe",
  identifier: '{"channel":"FetchWechatSellOrderChannel"}'
}

class GrabOrder extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isShowMsg: false,
      message: "",
      arrPoint: ["."],
      flagInterval: 0,
      flagGrabOrderInterval: 0,
      matchCount: 0,
    }
    this.Lang = Language[this.props.langCountry].grabOrderPage;
    this.SocketClient = null;
  }

  componentWillReceiveProps(nextProps) {
    this.Lang = Language[nextProps.langCountry].grabOrderPage;
  }

  componentDidMount() {
    this.onPointAnimation();

    this.SocketClient = new WebSocket(ws_url(this.props.userData.content.auth_token));

    this.SocketClient.onopen = () => {
      // connection opened
      console.log("open");
      this.SocketClient.send(JSON.stringify(subscrible_request)); // send a message
    };

    this.SocketClient.onmessage = (e) => {
      // a message was received
      const resRlt = JSON.parse(e.data);

      if (resRlt.hasOwnProperty("message") && typeof(resRlt.message) == "object" && resRlt.message.type == "matched_order") {
        this.props.setGrabOrderData(resRlt.message.info);
        clearTimeout(this.state.flagGrabOrderInterval);
        this.onChangeGrabOrderStatus(false);
        Actions.grabOrderSuccess();
      }

      if (resRlt.hasOwnProperty("message") && typeof(resRlt.message) == "object" && resRlt.message.type == "stop_fetching") {
        clearTimeout(this.state.flagGrabOrderInterval);
        this.onChangeGrabOrderStatus(false);
        Actions.pop();
      }
    };

    this.SocketClient.onerror = (e) => {
      // an error occurred
      console.log(e);
    };

    this.SocketClient.onclose = (e) => {
      // connection closed
      console.log(e);
      Actions.pop();
    };

    this.onChangeGrabOrderStatus(true);
  }

  componentWillUnmount() {
    clearInterval(this.state.flagInterval);
    clearInterval(this.state.flagGrabOrderInterval);
    this.SocketClient && this.SocketClient.close();
  }

  onShowNoticeMsg = msg => {
    this.setState({ message: msg, isShowMsg: true });
  }

  onPointAnimation = () => {
    this.state.flagInterval = setInterval(() => {
      if (this.state.arrPoint.length >= 3) {
        this.setState({ arrPoint: ["."] });
      }
      else {
        this.setState({ arrPoint: [ ...this.state.arrPoint, "." ] });
      }
    }, 1000)
  }

  onChangeGrabOrderStatus = status => {
    const { auth_token } = this.props.userData.content;

    this.props.changeGrabOrderStatus({ auth_token, status })
    .then(res => {
      /**
       * 搶單狀態更改成功，即進入配對模式，每隔一秒發出一次配對需求
       * 總共發50次，約50秒
       * 超過50次即停止搶單，並回到上一頁
       */
      // let secondInterval = this.props.changeGrabOrderStatusRlt.content.frequency * 1000;
      if (status) {
      //   this.onStartGrabOrder();
      //   this.state.flagGrabOrderInterval = setInterval(() => {
      //     if (this.state.matchCount < 50) {
      //       this.setState(
      //         { matchCount: this.state.matchCount + 1 },
      //         () => {
      //           this.onStartGrabOrder();
      //         }
      //       );
      //     }
      //     else {
      //       clearInterval(this.state.flagGrabOrderInterval);
      //       this.onChangeGrabOrderStatus(false);
      //     }
      //   }, secondInterval);

        this.state.flagGrabOrderInterval = setTimeout(() => {
          this.onChangeGrabOrderStatus(false);
        }, 300000);
      }
      else {
        this.SocketClient && this.SocketClient.close();
        Actions.pop();
      }
    })
    .catch(err => {
      if (this.props.errorMsg && Object.getOwnPropertyNames(this.props.errorMsg).length != 0)
					this.onShowNoticeMsg(this.props.errorMsg.data.message);
    });
  }

  onStartGrabOrder = () => {
    this.props.startGrabOrder(this.props.userData.content.auth_token)
    .then(res => {
      if (this.props.grabOrderRlt.content.matched_order) {
        clearInterval(this.state.flagGrabOrderInterval);
        this.onChangeGrabOrderStatus(false);
        Actions.grabOrderSuccess();
      }
    })
    .catch(err => {
      if (this.props.errorMsg && Object.getOwnPropertyNames(this.props.errorMsg).length != 0)
					this.onShowNoticeMsg(this.props.errorMsg.data.message);
    });
  }

  onMsgOK = () => {
    this.setState(
      { isShowMsg: false },
      () => {
        Actions.pop();
      }
    );
  }

  render() {
    return (
      <Card style={ grabOrderStyle.container }>
        <Message
          visible={this.state.isShowMsg}
          messageTxt={this.state.message}
          checkTxt="OK"
          onOK={ () => this.onMsgOK() }
        />
        <View style={ grabOrderStyle.section1 }>
          <Text style={{ fontSize: 30, color: "white", fontWeight: "bold", marginBottom: 40 }}>{this.Lang.matching}
            <Text>{this.state.arrPoint}</Text>
          </Text>
          <Image source={GRAB_ORDER_LOADING} resizeMode="contain" style={{ width: 180, height: 180 }} />
        </View>
        <View style={ grabOrderStyle.section2 }>
          <TouchableOpacity style={ grabOrderStyle.backBtn } onPress={ () => Actions.pop() }>
            <Text style={ grabOrderStyle.backBtnTxt }>{this.Lang.back}</Text>
          </TouchableOpacity>
        </View>
      </Card>
    );
  }
}

/*
  GrabOrder 的 css樣式
*/
const grabOrderStyle = StyleSheet.create({
	container: {
    backgroundColor: "#FF5C29",
    alignItems: "center",
    justifyContent: "center",
    paddingLeft: 35,
    paddingRight: 35,
    position: "relative",
  },
  section1: {
    width: "100%",
    alignItems: "center"
  },
  section2: {
    width: "100%",
    position: "absolute",
    bottom: "10%",
    alignItems: "center",
    justifyContent: "center",
  },
  backBtn: {
    width: "100%",
    height: 50,
    backgroundColor: "#FF5C29",
    borderColor: "white",
    borderWidth: 2,
    borderRadius: 50,
    alignItems: "center",
    justifyContent: "center",
  },
  backBtnTxt: {
    color: "white",
    fontSize: 20,
    fontWeight: "bold",
  }
});

const mapStateToProps = ({ languageType, loginData, grabOrderData }) => {
  const { langCountry } = languageType;
  const { userData } = loginData;
  const { grabOrderRlt, changeGrabOrderStatusRlt } = grabOrderData;

  return { langCountry, userData, grabOrderRlt, changeGrabOrderStatusRlt };
};

export default connect(mapStateToProps, { changeGrabOrderStatus, startGrabOrder, setGrabOrderData })(GrabOrder);