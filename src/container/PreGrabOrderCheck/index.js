/*
 * Date : 2019/04/17
 * Writer : kevin
 */

/**
 * 確認使用者搶單前環境條件是否正常
 * 網路：利用套件檢查網路是否正常穩定
 * 錢包：確認使用者餘額是否有大於100
 * QRcode：確認使用者是否有上傳 QRcode
 */

/* Tools */
import React, { Component } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  Image
} from "react-native";
import { connect } from "react-redux";
import LinearGradient from 'react-native-linear-gradient';
import { Actions } from 'react-native-router-flux';
import * as Progress from 'react-native-progress';
import NetworkState, { Settings } from 'react-native-network-state';

/* Components */
import {
  Card,
  IconBlock,
} from "../../components/common";

/* Data */
import Language from "../../Language.json";
import { MONEY_BLUE, MONEY_ORANGE } from "../../images";

const winWidth = Dimensions.get("window").width;
const winHeight = Dimensions.get("window").height;

class PreGrabOrderCheck extends Component {
  constructor(props) {
    super(props);
    this.state = {
      processWallet: 0,  // 0: initial, 1: success, 2: fail
      processNetwork: 0,  // 0: initial, 1: success, 2: fail
      processQRcode: 0,  // 0: initial, 1: success, 2: fail
      checkComplete: null,
      isOpenDetectNetwork: false,
      flagTimeout: 0,
    }
    this.Lang = Language[this.props.langCountry].preGrabOrderCheckPage;
  }

  componentWillReceiveProps(nextProps) {
    this.Lang = Language[nextProps.langCountry].preGrabOrderCheckPage;
  }

  componentDidMount() {
    setTimeout(() => {
      this.onDetectAllStatus()
      .then(() => {
        const { processWallet, processNetwork, processQRcode } = this.state;
        if (processWallet == 1 && processNetwork == 1 && processQRcode == 1)
          this.setState({ checkComplete: true });
        else
          this.setState({ checkComplete: false });
      })
    }, 1500);
  }

  componentWillUnmount() {
    if (this.state.flagTimeout)
      clearTimeout(this.state.flagTimeout);
  }

  onDetectAllStatus = () => {
    return new Promise(async (resolve, reject) => {
      try {
        await this.onCheckWalletStatus();
        await this.onCheckNetworkStatus();
        await this.onCheckQRcodeStatus();
        await resolve("OK");
      }catch (err) {
        //  do something
      }
    })
  }

  onCheckWalletStatus = () => {
    return new Promise((resolve, reject) => {
      if (this.props.userInfo.content && this.props.userInfo.content.valid_balance > 100) {
        this.setState({ processWallet: 1 });
      }
      else {
        this.setState({ processWallet: 2 });
      }
      resolve();
    });
  }

  onCheckNetworkStatus = () => {
    return new Promise((resolve, reject) => {
      this.setState({ isOpenDetectNetwork: true });
      resolve();
    });
  }

  onCheckQRcodeStatus = () => {
    return new Promise((resolve, reject) => {
      let validQRcodeAmount = 0;
      this.props.userInfo.content.wechat_accounts.map(item => {
        if (item.status == "verified")
          validQRcodeAmount += item.on_count;
      })

      if (validQRcodeAmount > 0) {
        this.setState({ processQRcode: 1 });
      }
      else {
        this.setState({ processQRcode: 2 });
      }
      resolve();
    });
  }

  onProcessCheckIcon = status => {
    const insideStyle = StyleSheet.create({
      processIcon: {
        position: "absolute",
        top: "40%",
        right: "10%",
        backgroundColor: "#2D7BC3",
        borderRadius: 20,
        width: 30,
        height: 30,
        alignItems: "center",
        justifyContent: "center",
      }
    });

    if (status == 2) {
      return(
        <View style={ insideStyle.processIcon }>
          <IconBlock
            name="close"
            size={20}
            color={"white"}
          />
        </View>
      );
    }
    else if (status == 1) {
      return(
        <View style={{ ...insideStyle.processIcon, backgroundColor: "#FF5C29" }}>
          <IconBlock
            name="check"
            size={20}
            color={"white"}
          />
        </View>
      );
    }
    else {
      return (
        <View style={{ ...insideStyle.processIcon, backgroundColor: "transparent" }}>
          <Progress.Circle
            size={30}
            indeterminate={true}
            thickness={0} // 内圆厚度
            borderWidth={6} // 边框
            color='FF5C29'
            strokeCap="butt"
          />
        </View>
      );
    }
  }

  onGoGrabOrder = () => {
    if (!this.state.checkComplete)
      return;
    
    Actions.grabOrder();
  }

  render() {
    return (
      <LinearGradient colors={['#f95603', '#f99236', '#f95603']} style={ preGrabOrderStyle.linearGradient }>
        <Card style={ preGrabOrderStyle.container }>
          <View style={{ marginBottom: 20, width: "100%", paddingLeft: 25, paddingRight: 25 }}>
            <Text style={{ ...preGrabOrderStyle.titleTxt, fontSize: 40 }}>{this.Lang.comingSoon}</Text>
            <Text style={{ ...preGrabOrderStyle.titleTxt, fontSize: 30 }}>{this.Lang.enterGrabOrder}</Text>
            <View style={ preGrabOrderStyle.iconStatusSection }>
              {/* 確認錢包 */}
              <View style={{ ...preGrabOrderStyle.iconBlock, bottom: 0, left: 0}}>
                <View style={ preGrabOrderStyle.iconView }>
                  <Image source={this.state.processWallet == 2 ? MONEY_BLUE : MONEY_ORANGE} resizeMode="contain" style={{ width: 33, height: 33 }} />
                </View>
                <View style={{ ...preGrabOrderStyle.iconStatusView, opacity: this.state.processWallet == 2 ? 1 : 0 }}>
                  <Text
                    style={ preGrabOrderStyle.iconStatusTxt }
                    onPress={ () => this.state.processWallet == 2 ? Actions.reset("home") : null }
                  >{this.Lang.pushMeRecharge}</Text>
                </View>
                {this.onProcessCheckIcon(this.state.processWallet)}
              </View>
              {/* 確認網路 */}
              <View style={{ ...preGrabOrderStyle.iconBlock, top: 0, left: ((winWidth / 2) - 90) }}>
                <IconBlock
                  viewStyle={ preGrabOrderStyle.iconView }
                  name="wifi"
                  size={35}
                  color={this.state.processNetwork == 2 ? "#4489C9" : "#FF5C29"}
                />
                <View style={{ ...preGrabOrderStyle.iconStatusView, opacity: this.state.processNetwork == 2 ? 1 : 0 }}>
                  <Text
                    style={ preGrabOrderStyle.iconStatusTxt }
                    // onPress={ () => this.state.processNetwork == 2 ? Actions.login() : null }
                  >{this.Lang.checkNetwok}</Text>
                </View>
                {this.onProcessCheckIcon(this.state.processNetwork)}
                {
                  this.state.isOpenDetectNetwork
                  ? <NetworkState
                      style={{ position: 'absolute', top: 0, right: 0, bottom: 0, left: 0, width: 1, height: 1 }}
                      onConnected={ () => this.setState({ processNetwork: 1 }) }
                      onDisconnected={ () => this.setState({ processNetwork: 2 }) }
                      txtDisconnected=""
                      styleDisconnected={{ backgroundColor: "transparent" }}
                    />
                  : null
                }
              </View>
              {/* 確認QRcode */}
              <View style={{ ...preGrabOrderStyle.iconBlock, bottom: 0, right: 0 }}>
                <IconBlock
                  viewStyle={ preGrabOrderStyle.iconView }
                  name="qrcode"
                  size={40}
                  color={this.state.processQRcode == 2 ? "#4489C9" : "#FF5C29"}
                />
                <View style={{ ...preGrabOrderStyle.iconStatusView, opacity: this.state.processQRcode == 2 ? 1 : 0 }}>
                  <Text
                    style={ preGrabOrderStyle.iconStatusTxt }
                    onPress={ () => this.state.processQRcode == 2 ? Actions.weChatAccount() : null }
                  >{this.Lang.checkQRcode}</Text>
                </View>
                {this.onProcessCheckIcon(this.state.processQRcode)}
              </View>
            </View>
          </View>
          <View style={{ width: "100%", alignItems: "center" }}>
            <TouchableOpacity style={{ ...preGrabOrderStyle.button, marginBottom: 15, elevation: 0 }} onPress={ () => Actions.reset("home") }>
              <Text style={{ ...preGrabOrderStyle.buttonTxt, color: "white" }}>{this.Lang.backHome}</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={{ ...preGrabOrderStyle.button, backgroundColor: this.state.checkComplete ? "white" : "#E5E5E5" }}
              onPress={ () => this.onGoGrabOrder() }
            >
              <Text style={{ ...preGrabOrderStyle.buttonTxt, color: this.state.checkComplete ? "#FF5C29" : "#848485" }}>{this.Lang.ready}</Text>
            </TouchableOpacity>
          </View>
        </Card>
      </LinearGradient>
    );
  }
}

/*
  PreGrabOrderCheck 的 css樣式
*/
const preGrabOrderStyle = StyleSheet.create({
	linearGradient: {
		width: "100%",
		height: winHeight,
  },
  container: {
    backgroundColor: "transparent",
    alignItems: "center",
    justifyContent: "center",
    paddingLeft: 10,
    paddingRight: 10,
    paddingTop: 10,
  },
  titleTxt: {
    color: "white",
    textAlign: "center",
    fontWeight: "bold",
    elevation: 5,
    shadowColor: "#c6c6c6",
    shadowOpacity: 0.4,
    shadowRadius: 3,
    shadowOffset: {
      height: 5,
      width: 0
    },
    marginBottom: 10,
  },
  iconStatusSection: {
    marginTop: 35,
    flexDirection: "row",
    justifyContent: "space-between",
    position: "relative",
    width: "100%",
    height: 230,
  },
  iconBlock: {
    alignItems: "center",
    position: "absolute",
    width: 120,
  },
  iconView: {
    backgroundColor: "white",
    width: 70,
    height: 70,
    borderRadius: 70,
    alignItems: "center",
    justifyContent: "center",
    // elevation: 5,
    shadowColor: "#c6c6c6",
    shadowOpacity: 0.4,
    shadowRadius: 3,
    shadowOffset: {
      height: 5,
      width: 0
    },
  },
  iconStatusView: {
    marginTop: 10,
    width: "100%",
    height: 30,
    backgroundColor: "#2D7BC3",
    borderRadius: 20,
    elevation: 5,
    shadowColor: "#c6c6c6",
    shadowOpacity: 0.4,
    shadowRadius: 3,
    shadowOffset: {
      height: 5,
      width: 0
    },
    justifyContent: "center",
  },
  iconStatusTxt: {
    textAlign: "center",
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
  button: {
    width: "85%",
    height: 50,
    borderColor: "white",
    borderWidth: 2,
    borderRadius: 50,
    alignItems: "center",
    justifyContent: "center",
    elevation: 5,
    shadowColor: "#c6c6c6",
    shadowOpacity: 0.4,
    shadowRadius: 3,
    shadowOffset: {
      height: 5,
      width: 0
    },
  },
  buttonTxt: {
    fontSize: 18,
    fontWeight: "bold",
  }
});

const mapStateToProps = ({ languageType, homeData }) => {
  const { langCountry } = languageType;
	const { userInfo, errorMsg } = homeData;

  return { langCountry, userInfo, errorMsg };
};

export default connect(mapStateToProps, {})(PreGrabOrderCheck);