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
import { ifIphoneX } from "react-native-iphone-x-helper";
import LinearGradient from 'react-native-linear-gradient';

/* Components */
import {
  Card,
  Confirm,
  Input,
  Message
} from "../../components/common";

/* Actions */
import { grabOrderNoRecivePay, grabOrderConfirm } from "../../actions";

/* Data */
import Language from "../../Language.json";
import {
  GRAB_ORDER_STEP1,
  GRAB_ORDER_STEP2,
  GRAB_ORDER_SUCCESS_LOGO,
} from "../../images";

class GrabOrderSuccess extends Component {
  constructor(props) {
    super(props);
    this.state = {
      countdownNum: 180,
      noRecivePay: false,
      realAmount: "",
      stepNum: 0,
      message: "",
      isShowMsg: false,
      validAmount: true,
    }
    this.Lang = Language[this.props.langCountry].grabOrderSuccess;
    this.flagTimtout = 0;
  }

  componentWillReceiveProps(nextProps) {
    this.Lang = Language[nextProps.langCountry].grabOrderSuccess;
  }

  componentDidMount() {
    const { exipred_at } = this.props.grabOrderRlt.content;

    this.setState(
      { countdownNum: exipred_at <= 0 ? 0 : exipred_at },
      () => {
        this.onCountDown(this.state.countdownNum);
      }
    );
  }

  componentWillUnmount() {
    clearTimeout(this.flagTimtout);
  }

  onCountDown = num => {
    if (num < 0) {
      clearTimeout(this.flagTimtout);
      return;
    }
    this.setState(
      { countdownNum: num - 1 },
      () => {
        this.flagTimtout = setTimeout(() => {
          this.onCountDown(this.state.countdownNum);
        }, 1000);
      }
    );
  }

  onOrderConfirm = () => {
    const { amount } = this.props.grabOrderRlt.content.order;
    if (this.state.realAmount == "")
      return;
    
    if (this.state.stepNum == 1 && this.state.realAmount != parseInt(amount)) {
      this.setState({ stepNum: 2, validAmount: false });
      return;
    }

    const { auth_token } = this.props.userData.content;
    const { id } = this.props.grabOrderRlt.content.order;
    this.props.grabOrderConfirm(auth_token, this.state.realAmount, id)
    .then(res => {
      this.setState({ stepNum: 3 });
    })
    .catch(err => {
      this.setState({ stepNum: 0 });
      if (this.props.errorMsg && Object.getOwnPropertyNames(this.props.errorMsg).length != 0)
        this.setState({ message: this.props.errorMsg.data.message, isShowMsg: true });
    })
  }

  onOrderExpire = () => {
    const { auth_token } = this.props.userData.content;
    const { id } = this.props.grabOrderRlt.content.order;
    const received_amount = this.state.validAmount ? "" : this.state.realAmount;
    this.props.grabOrderNoRecivePay(auth_token, id, received_amount)
    .then(res => {
      this.state.validAmount ? false : this.setState({ stepNum: 3 });
    })
    .catch(err => {
      if (this.props.errorMsg && Object.getOwnPropertyNames(this.props.errorMsg).length != 0)
        this.setState({ message: this.props.errorMsg.data.message, isShowMsg: true });
    })
    .finally(() => {
      this.setState({ noRecivePay: false });
      this.state.validAmount ? Actions.reset("home") : false;
    });
  }

  onRecivePayUIStep1 = () => {
    return (
      <Confirm
        visible={true}
        messageTxt={this.Lang.enterRealAmount}
        cancelTxt={this.Lang.cancel}
        checkTxt={this.Lang.confirm}
        imageUrl={GRAB_ORDER_STEP1}
        msgStyle={{ paddingBottom: 10, marginTop: 20 }}
        boxStyle={{ alignItems: "center", justifyContent: "center" }}
        confirmImg={{ bottom: -35, width: "60%" }}
        onCancel={ () => this.setState({ stepNum: 0, realAmount: "" }) }
        onOK={ () => this.onOrderConfirm() }
      >
        <Input 
          containerStyle={ grabSuccessStyle.realAmountView }
          inputStyle={ grabSuccessStyle.inputTxt }
          keyboardType={"numeric"}
          value={this.state.realAmount}
          onChangeText={ realAmount => this.setState({ realAmount }) }
        />
      </Confirm>
    );
  }

  onRecivePayUIStep2 = () => {
    return (
      <Confirm
          visible={true}
          cancelTxt={this.Lang.cancel}
          checkTxt={this.Lang.confirm}
          imageUrl={GRAB_ORDER_STEP1}
          msgStyle={{ paddingBottom: 10, marginTop: 20 }}
          boxStyle={{ alignItems: "center", justifyContent: "center" }}
          confirmImg={{ bottom: -60, width: "60%" }}
          onCancel={ () => this.setState({ stepNum: 0, realAmount: "" }) }
          onOK={ () => this.onOrderExpire() }
      >
        <Text
          style={{ color: "white", marginBottom: 15, fontSize: 18, fontWeight: "bold", textAlign: "center", lineHeight: 30 }}
        >{this.Lang.notice}</Text>
      </Confirm>
    );
  }

  onRecivePayUIStep3 = () => {
    return (
      <Confirm
        visible={true}
        cancelTxt={this.Lang.backHome}
        checkTxt={this.Lang.continueGrabOrder}
        imageUrl={GRAB_ORDER_STEP2}
        msgStyle={{ padding: 0, lineHeight: 0 }}
        boxStyle={{ alignItems: "center", justifyContent: "center" }}
        confirmImg={{ bottom: -60, width: "100%" }}
        onCancel={ () => Actions.reset("home") }
        onOK={ () => Actions.pregrabordercheck() }
      >
      {
        this.state.validAmount
        ? <View style={{ alignItems: "center" }}>
            <Text key={0} style={{ color: "white", marginBottom: 5, fontSize: 20 }}>{this.Lang.success}</Text>
            <Text style={{ color: "white", marginBottom: 5, fontSize: 40, fontWeight: "bold" }}>{this.state.realAmount}</Text>
            <Text style={{ color: "white", marginBottom: 10, fontSize: 16 }}>
              {`${this.Lang.balance} ${this.props.orderConfirmRlt.content.balance}`}
            </Text>
          </View>
        : <View style={{ alignItems: "center" }}>
            <Text key={1} style={{ color: "white", marginBottom: 5, fontSize: 20 }}>{this.Lang.contactService}</Text>
            <Text style={{ color: "white", marginBottom: 10, fontSize: 16 }}>
              {`${this.Lang.serialNum} ${this.props.grabOrderRlt.content.order.order_num}`}
            </Text>
          </View>
      }
      </Confirm>
    );
  }

  render() {
    const { order: { amount, order_num }, acct_name } = this.props.grabOrderRlt.content;
    return (
      <LinearGradient colors={['#FCA749', '#FCA749', '#EF411E']} style={ grabSuccessStyle.linearGradient }>
        <Card style={ grabSuccessStyle.container }>
          {/** 未收到款項之提示訊息 */}
          <Confirm
            visible={this.state.noRecivePay}
            messageTxt={this.Lang.checkRecivePay}
            cancelTxt={this.Lang.cancel}
            checkTxt={this.Lang.confirm}
            onCancel={ () => this.setState({ noRecivePay: false }) }
            onOK={ () => this.onOrderExpire() }
          />
          {/** 收到款項之訊息流程 */}
          {
            this.state.stepNum == 1
            ? this.onRecivePayUIStep1()
            : this.state.stepNum == 2
              ? this.onRecivePayUIStep2()
              : this.state.stepNum == 3
                ? this.onRecivePayUIStep3()
                : null
          }
          <Message
            visible={this.state.isShowMsg}
            messageTxt={this.state.message}
            checkTxt="OK"
            onOK={ () => this.setState({ isShowMsg: false }) }
          />
          <View style={ grabSuccessStyle.section1 }>
            <Text style={{ fontSize: 20, color: "white", fontWeight: "bold" }}>{this.Lang.title}</Text>
          </View>
          <View style={ grabSuccessStyle.section2 }>
            <View style={{ alignItems: "center", justifyContent: "center", marginBottom: 40 }}>
					    <Image source={ GRAB_ORDER_SUCCESS_LOGO } resizeMode="contain" style={{ position: "absolute", bottom: -20, width: 80, height: 80 }} />
            </View>
            <Text style={{ fontSize: 20, color: "#262628", fontWeight: "bold", marginBottom: 5 }}>{acct_name}</Text>
            <Text style={{ fontSize: 40, color: "#F7820D", fontWeight: "bold", marginBottom: 5 }}>{`$ ${amount.split(".")[0]}`}</Text>
            <Text style={{ fontSize: 16, color: "#CECECE" }}>{this.Lang.checkPayment}</Text>
            <View style={ grabSuccessStyle.hr } />
            <Text style={{ fontSize: 16, color: "#656565" }}>{`${this.Lang.serialNum} ${order_num}`}</Text>
          </View>
          <View style={ grabSuccessStyle.section3 }>
            <TouchableOpacity
              style={{
                ...grabSuccessStyle.btn,
                ...this.state.countdownNum <= 0 ? "" : grabSuccessStyle.btn2,
                backgroundColor: this.state.countdownNum <= 0 ? "white" : "transparent",
                marginBottom: 10,
                elevation: 0,
              }}
              onPress={ () => this.state.countdownNum <= 0 ? this.setState({ noRecivePay: true }) : false }
            >
              <Text style={{ ...grabSuccessStyle.btnTxt, color: this.state.countdownNum <= 0 ? "#FB823A" : "white" }}>
              {
                this.state.countdownNum <= 0
                ? `${this.Lang.noGetPayment}`
                : `${this.state.countdownNum}...${this.Lang.noGetPayment}`
              }
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={{ ...grabSuccessStyle.btn, backgroundColor: "white" }}
              onPress={ () => this.setState({ stepNum: 1 }) }
            >
              <Text style={{ ...grabSuccessStyle.btnTxt, color: "#F7820D" }}>{this.Lang.getPayment}</Text>
            </TouchableOpacity>
          </View>
        </Card>
			</LinearGradient>
    );
  }
}

/*
  Grab Order Success 的 css樣式
*/
const grabSuccessStyle = StyleSheet.create({
	linearGradient: {
    width: "100%",
    flex: 1,
	},
	container: {
    backgroundColor: "transparent",
    alignItems: "center",
    justifyContent: "center",
    paddingLeft: 35,
    paddingRight: 35,
    position: "relative",
    paddingTop: 10,
  },
  section1: {
    width: "100%",
    position: "absolute",
    paddingLeft: 20,
		...ifIphoneX({
			top: 30,
		}, {
			top: 20,
		}),
    alignItems: "center",
    marginTop: 20,
    marginBottom: 20,
  },
  section2: {
    width: "100%",
    position: "relative",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "white",
    borderRadius: 10,
    paddingTop: 20,
    paddingBottom: 20,
    marginTop: 70,
    marginBottom: 10,
    elevation: 5,
    shadowColor: "#c6c6c6",
    shadowOpacity: 0.4,
    shadowRadius: 3,
    shadowOffset: {
      height: 5,
      width: 0
    },
  },
  hr: {
    width: "90%",
    height: 1,
    borderWidth: 1,
    borderColor: "#F0F0F0",
    marginTop: 15,
    marginBottom: 15,
  },
  section3: {
    width: "100%",
  },
  btn: {
    width: "100%",
    height: 45,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 40,
    elevation: 5,
    shadowColor: "#c6c6c6",
    shadowOpacity: 0.4,
    shadowRadius: 3,
    shadowOffset: {
      height: 5,
      width: 0
    },
  },
  btnTxt: {
    fontSize: 18,
    fontWeight: "bold",
  },
  btn2: {
    borderWidth: 2,
    borderColor: "white",
  },
  realAmountView: {
    width: "80%",
    height: 40,
    backgroundColor: "white",
    borderRadius: 40,
    paddingLeft: 5,
    paddingRight: 5,
    marginBottom: 20,
    elevation: 5,
    shadowColor: "#c6c6c6",
    shadowOpacity: 0.4,
    shadowRadius: 3,
    shadowOffset: {
      height: 5,
      width: 0
    },
  },
  inputTxt: {
    fontSize: 18,
    textAlign: "center",
  }
});

const mapStateToProps = ({ languageType, loginData, grabOrderData }) => {
  const { langCountry } = languageType;
  const { userData } = loginData;
  const { grabOrderRlt, orderConfirmRlt, errorMsg } = grabOrderData;

  return { langCountry, userData, grabOrderRlt, orderConfirmRlt, errorMsg };
};

export default connect(mapStateToProps, { grabOrderNoRecivePay, grabOrderConfirm })(GrabOrderSuccess);