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
  Image,
} from 'react-native';
import { connect } from 'react-redux';
import { Actions } from 'react-native-router-flux';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';

/* Components */
import {
  Card,
  Input,
  IconBlock,
  Spinner,
  Message,
} from '../../components/common';

/* Actions */
import {
  checkAccount,
  getVerification,
  userResetPwd,
} from '../../actions';

/* Data */
import Language from '../../Language.json';
import { REGISTER_LOGO } from '../../images';

class ForgetPwd extends Component {

	constructor(props) {
		super(props);
		this.state = {
      spinner: false,
      account: "",
      phone: "",
      message: "",
      isShowMsg: false,
      flagTimeout: "",
      step: 1,
      verifyStatus: 0, // 0: general, 1: register
      msgCheckBtnTxt: "",
      verification: "",
      password: "",
      rePassword: "",
      countValue: -1,
      visibleGetVerifyBtn: true,
		}
    this.Lang = Language[this.props.langCountry].forgetPwdPage;
  }
  
  componentWillMount() {
    // only modify password when user was logined
    this.props.modifyPwdData && this.setState({ account: this.props.modifyPwdData.account, phone: this.props.modifyPwdData.phone, step: 2 });
  }

	componentWillReceiveProps(nextProps) {
    this.Lang = Language[nextProps.langCountry].forgetPwdPage;
  }

  componentWillUnmount() {
    this.state.flagTimeout && clearTimeout(this.state.flagTimeout);
  }

  onShowNoticeMsg = msg => {
    this.setState({ message: msg, isShowMsg: true });
  }

  onGetVerifyCode = () => {
    if (!this.state.visibleGetVerifyBtn)
      return;

    this.setState({ spinner: true });
    this.props.getVerification(this.state.account, "", "", true)
    .then(res => {
      //  check verify code result status
      if (this.props.verifyCodeRlt && this.props.verifyCodeRlt.status == "OK") {
        this.onShowNoticeMsg(this.Lang.sendVerificationMsg);
        this.setState(
          { visibleGetVerifyBtn: false, countValue: 120 },
          () => {
            this.onCountingDown();
          }
        );
      }
    })
    .catch(err => {
      if (this.props.errorMsg && Object.getOwnPropertyNames(this.props.errorMsg).length != 0)
        this.onShowNoticeMsg(this.props.errorMsg.data.message);
    })
    .finally(() => {
      this.setState({ spinner: false });
    });
  }

  onMsgOK = () => {
    this.setState(
      { isShowMsg: false },
      () => {
        if (this.state.verifyStatus == 1) {
          Actions.register();
        }
        else if (this.state.verifyStatus == 2) {
          Actions.login();
        }
      }
    );
  }

  onCountingDown = () => {
    if (this.state.countValue <= 0) {
      this.setState({ countValue: -1, visibleGetVerifyBtn: true });
      return;
    }

    this.setState(
      { countValue: this.state.countValue - 1 },
      () => {
        this.state.flagTimeout = setTimeout(() => {
          this.onCountingDown();
        }, 1000);
      }
    );
  }
  
  onVerifyAccount = () => {
    if (this.state.account == "")
      return;

    this.setState({ spinner: true });
    this.props.checkAccount(this.state.account)
    .then(res => {
      // check account was registered
      if (this.props.accountValid.status == "OK") {
        const { user_exist, phone_confirmed, phone } = this.props.accountValid.content;
        if (user_exist && phone_confirmed) {
          this.setState({ step: 2, phone });
        }
        else if (!user_exist) {
          this.onShowNoticeMsg(this.Lang.accountExistMsg);
          this.setState({ verifyStatus: 1, msgCheckBtnTxt: this.Lang.goRegisterMsg });
        }
        else if (user_exist && !phone_confirmed) {
          this.onShowNoticeMsg(this.Lang.accountInvalidMsg);
          this.setState({ verifyStatus: 1, msgCheckBtnTxt: this.Lang.goRegisterMsg });
        }
      }
    })
    .catch(err => {
      if (this.props.errorMsg && Object.getOwnPropertyNames(this.props.errorMsg).length != 0)
        this.onShowNoticeMsg(this.props.errorMsg.data.message);
    })
    .finally(() => {
      this.setState({ spinner: false });
    });
  }
  
  onCheckSend = () => {
    let { verification, account, password, rePassword } = this.state;

    if (verification == "") {
      this.onShowNoticeMsg(this.Lang.verificationMsg);
      return;
    }
    else if (password == "") {
      this.onShowNoticeMsg(this.Lang.passwordMsg);
      return;
    }
    else if (rePassword == "") {
      this.onShowNoticeMsg(this.Lang.rePasswordMsg);
      return;
    }
    else if (password != rePassword) {
      this.onShowNoticeMsg(this.Lang.pwdNotSameMsg);
      return;
    }

    this.setState({ spinner: true });
    this.props.userResetPwd({
      account,
      sms_token: verification,
      password,
      password_confirmation: rePassword
    })
    .then(res => {
      // reset password success
      if (this.props.resetPwdRlt.status == "OK") {
        this.onShowNoticeMsg(this.Lang.resetPwdSuccessMsg);
        this.setState({ verifyStatus: 2, msgCheckBtnTxt: "確認" });
      }
    })
    .catch(err => {
      if (this.props.errorMsg && Object.getOwnPropertyNames(this.props.errorMsg).length != 0)
        this.onShowNoticeMsg(this.props.errorMsg.data.message);
    })
    .finally(() => {
      this.setState({ spinner: false });
    });
  }

  onStep1VerifyAccount = () => {
    return (
      <View style={{ width: "100%" }}>
        <View style={ forgetPwdStyle.infoView }>
          <IconBlock
            name="user"
            size={24}
            color={"#FBA444"}
            viewStyle={ forgetPwdStyle.infoIconView }
          />
          <Input 
            containerStyle={ forgetPwdStyle.infoInputContainer }
            inputStyle={ forgetPwdStyle.infoInputTxt }
            secureTextEntry={false}
            placeholder={this.Lang.account}
            placeholderTextColor="#AFAFAF"
            value={this.state.account}
            onChangeText={ account => this.setState({ account }) }
          />
        </View>
        <TouchableOpacity
          style={{ ...forgetPwdStyle.btnSubmit, backgroundColor: this.state.account == "" ? "#AFAFAF" : "#F7820D" }}
          onPress={ () => this.onVerifyAccount() }
        >
          <Text style={{ color: "white", fontSize: 18, fontWeight: "bold" }}>{this.Lang.verifyAccount}</Text>
        </TouchableOpacity>
      </View>
    );
  }

  onStep2VerifyPhone = () => {
    return (
      <View style={{ width: "100%" }}>
        <View style={{ ...forgetPwdStyle.infoView, backgroundColor: "transparent", borderColor: "transparent", width: "100%" }}>
          <IconBlock
            name="user"
            size={24}
            color={"#FBA444"}
            viewStyle={ forgetPwdStyle.infoIconView }
          />
          <Text style={{ ...forgetPwdStyle.infoInputTxt, height: "auto" }}>{this.state.account}</Text>
        </View>
        <View style={{ ...forgetPwdStyle.infoView, backgroundColor: "transparent", borderColor: "transparent", width: "100%" }}>
          <IconBlock
            name="mobile"
            size={28}
            color={"#FBA444"}
            viewStyle={ forgetPwdStyle.infoIconView }
          />
          <Text style={{ ...forgetPwdStyle.infoInputTxt, height: "auto" }}>{this.state.phone}</Text>
        </View>
        {/* 獲取驗證碼 */}
        <View style={{ flexDirection: "row" }}>
          <TouchableOpacity
            style={{ ...forgetPwdStyle.getVerification, backgroundColor: this.state.visibleGetVerifyBtn ? "#F7820D" : "#AFAFAF" }}
            onPress={ () => this.onGetVerifyCode() }
          >
            <Text style={{ color: "white", fontSize: 16, fontWeight: "bold" }}>{this.state.countValue > 0 ? `${this.state.countValue}s...` : this.Lang.verification}</Text>
          </TouchableOpacity>
          <View style={{ ...forgetPwdStyle.infoView, width: "53%" }}>
            <Input 
              containerStyle={ forgetPwdStyle.infoInputContainer }
              inputStyle={{ ...forgetPwdStyle.infoInputTxt, paddingLeft: 20, textAlign: "center" }}
              secureTextEntry={false}
              placeholder={this.Lang.enterVerification}
              keyboardType={"numeric"}
              placeholderTextColor="#AFAFAF"
              value={this.state.verification}
              onChangeText={ verification => this.setState({ verification }) }
            />
          </View>
        </View>
        {/* 設定密碼 */}
        <View style={ forgetPwdStyle.infoView }>
          <IconBlock
            name="lock"
            size={24}
            color={"#FBA444"}
            viewStyle={ forgetPwdStyle.infoIconView }
          />
          <Input 
            containerStyle={ forgetPwdStyle.infoInputContainer }
            inputStyle={ forgetPwdStyle.infoInputTxt }
            secureTextEntry={true}
            placeholder={this.Lang.password}
            placeholderTextColor="#AFAFAF"
            value={this.state.password}
            onChangeText={ password => this.setState({ password }) }
          />
        </View>
        {/* 確認密碼 */}
        <View style={{ ...forgetPwdStyle.infoView, marginBottom: 50 }}>
          <IconBlock
            name="lock"
            size={24}
            color={"#FBA444"}
            viewStyle={ forgetPwdStyle.infoIconView }
          />
          <Input 
            containerStyle={ forgetPwdStyle.infoInputContainer }
            inputStyle={ forgetPwdStyle.infoInputTxt }
            secureTextEntry={true}
            placeholder={this.Lang.rePassword}
            placeholderTextColor="#AFAFAF"
            value={this.state.rePassword}
            onChangeText={ rePassword => this.setState({ rePassword }) }
          />
        </View>
        <TouchableOpacity style={ forgetPwdStyle.btnSubmit } onPress={ () => this.onCheckSend() } >
          <Text style={{ color: "#02223F", fontSize: 18, fontWeight: "bold" }}>{this.Lang.submit}</Text>
        </TouchableOpacity>
      </View>
    );
  }

	render() {
		return (
			<KeyboardAwareScrollView
				resetScrollToCoords={{ x: 0, y: 0 }}
				scrollEnabled={false}
			>
        <Card style={ forgetPwdStyle.container }>
          <Spinner visible={this.state.spinner} />
          <Message
            visible={this.state.isShowMsg}
            messageTxt={this.state.message}
            checkTxt={this.state.msgCheckBtnTxt || "OK"}
            onOK={ () => this.onMsgOK() }
          />
          <TouchableOpacity style={ forgetPwdStyle.iconClose } onPress={ () => Actions.pop() }>
            <IconBlock
              name="times"
              size={30}
              color={"#AFAFAF"}
            />
          </TouchableOpacity>
          <Image source={REGISTER_LOGO} style={ forgetPwdStyle.logoImg } resizeMode="contain" />
          {/* 輸入帳號 */}
          {
            this.state.step == 1 ? this.onStep1VerifyAccount() : this.onStep2VerifyPhone()
          }
        </Card>
      </KeyboardAwareScrollView>
		);
	}
}

/*
  ForgetPwd 的 css樣式
*/
const forgetPwdStyle = StyleSheet.create({
	container: {
		paddingLeft: 25,
		paddingRight: 25,
		alignItems: "center",
		justifyContent: "center",
		flex: 1,
    backgroundColor: "#F0F0F0",
    position: "relative",
	},
	iconClose: {
		position: "absolute",
    top: 15,
    right: 5,
    padding: 10,
  },
  logoImg: {
    width: 180,
    marginBottom: 30,
  },
	infoView: {
		backgroundColor: "white",
		borderRadius: 40,
		flexDirection: "row",
		alignItems: "center",
		position: "relative",
		marginBottom: 15,
		borderWidth: 2,
		borderColor: "white",
	},
	infoIconView: {
		position: "absolute",
		left: 15,
	},
	infoInputContainer: {
		marginBottom: 0,
		borderWidth: 0,
	},
	infoInputTxt: {
		color: "black",
		fontSize: 18,
		paddingRight: 20,
		paddingLeft: 50,
		height: 45,
		textAlign: "left",
  },
  btnSubmit: {
    width: "100%",
    height: 45,
    backgroundColor: "#F7820D",
    borderRadius: 40,
    alignItems: "center",
    justifyContent: "center",
  },
  getVerification: {
    width: "45%",
    height: 45,
    marginRight: 5,
    backgroundColor: "#F7820D",
    borderRadius: 40,
    alignItems: "center",
    justifyContent: "center",
  },
})

const mapStateToProps = ({ languageType, registerData, verifyPhoneData, forgetPwdData }) => {
  const { langCountry } = languageType;
  const { accountValid } = registerData;
  const { verifyCodeRlt } = verifyPhoneData;
  const { resetPwdRlt, errorMsg } = forgetPwdData;

	return { langCountry, accountValid, verifyCodeRlt, resetPwdRlt, errorMsg };
}

export default connect(mapStateToProps, { checkAccount, getVerification, userResetPwd })(ForgetPwd);