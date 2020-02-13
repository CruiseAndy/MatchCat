/*
 * Date : 2019/04/23
 * Writer : kevin
 */

/* Tools */
import React, { Component } from "react";
import { BackHandler, Alert } from "react-native";
import {
  Scene,
  Router,
  Stack,
  ActionConst,
  Actions
} from "react-native-router-flux";
import { connect } from "react-redux";

/* Pages */
import Login from "../container/Login";
import Home from "../container/Home";
import Register from "../container/Register";
import ForgetPwd from "../container/ForgetPwd";
import VerifyPhone from "../container/VerifyPhone";
import Orders from "../container/Orders";
import CreateBuyOrder from "../container/CreateBuyOrder";
import PreGrabOrderCheck from "../container/PreGrabOrderCheck";
import GrabOrder from "../container/GrabOrder";
import GrabOrderSuccess from "../container/GrabOrder/GrabOrderSuccess";
import ServiceCenter from "../container/ServiceCenter";
import AddWechat from "../container/AddWechat";
import UploadQRcode from "../container/AddWechat/UploadQRcode";
import WeChatAccount from "../container/WeChatAccount";
import QrCodes from "../container/QrCodes";
import ServiceRule from "../container/ServiceRule";

import Language from "../Language.json";

class RouterComponent extends Component {
  constructor(props) {
    super(props);
    this.state = {
      backButtonPressed: false,
    }
    this.Lang = Language[this.props.langCountry];
  }
  onBackAndroid = () => {
    /**
     * return false: go back
     * return true: not thing
     */
    if (Actions.state.index === 0) {
      Alert.alert(
      `${this.Lang.exitApp}`,
      "",
      [
        {
          text: 'Cancel',
          onPress: () => console.log('Cancel Pressed'),
          style: 'cancel',
        },
        { text: 'OK', onPress: () => BackHandler.exitApp() },
      ],
        { cancelable: false },
      );
      return true;
    }
    else {
      return false;
    }
  };
  render() {
    return (
      <Router backAndroidHandler={this.onBackAndroid}>
        <Stack key="root" hideNavBar>
          <Scene
            key="login"
            component={Login}
            type={ActionConst.RESET}
            hideNavBar
            initial
          />
          <Scene key="home" component={Home} hideNavBar />
          <Scene
            key="register"
            component={Register}
            type={ActionConst.RESET}
            hideNavBar
          />
          <Scene
            key="verifyPhone"
            component={VerifyPhone}
            type={ActionConst.RESET}
            hideNavBar
          />
          <Scene key="forgetPwd" component={ForgetPwd} hideNavBar />
          <Scene
            key="pregrabordercheck"
            component={PreGrabOrderCheck}
            type={ActionConst.RESET}
            hideNavBar
          />
          <Scene key="orders" component={Orders} hideNavBar />
          <Scene key="createBuyOrder" component={CreateBuyOrder} hideNavBar />
          <Scene key="grabOrder" component={GrabOrder} hideNavBar />
          <Scene
            key="grabOrderSuccess"
            component={GrabOrderSuccess}
            type={ActionConst.RESET}
            hideNavBar
          />
          <Scene key="serviceCenter" component={ServiceCenter} hideNavBar />
          <Scene key="addWechat" component={AddWechat} hideNavBar />
          <Scene key="uploadQRcode" component={UploadQRcode} hideNavBar />
          <Scene key="weChatAccount" component={WeChatAccount} hideNavBar />
          <Scene key="qrCodes" component={QrCodes} hideNavBar />
          <Scene key="serviceRule" component={ServiceRule} hideNavBar />
        </Stack>
      </Router>
    );
  }
}

// export default RouterComponent;

const mapStateToProps = ({ languageType }) => {
  const { langCountry } = languageType;

  return { langCountry };
};

export default connect(mapStateToProps, {})(RouterComponent);
