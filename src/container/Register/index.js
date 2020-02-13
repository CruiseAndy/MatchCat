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
  Modal,
  ScrollView
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
  userRegister,
  checkAccount,
} from '../../actions';

/* Data */
import Language from '../../Language.json';
import { REGISTER_LOGO, REGISTER_SUCCESS_LOGO } from '../../images';

class Register extends Component {

	constructor(props) {
		super(props);
		this.state = {
      spinner: false,
      checkAccount: "",
      account: "",
      password: "",
      rePassword: "",
      recommendCode: "",
      message: "",
      isShowMsg: false,
      accountValid: true,
      showCompleteLayout: false,
		}
    this.Lang = Language[this.props.langCountry].registerPage;
	}

	componentWillReceiveProps(nextProps) {
    this.Lang = Language[nextProps.langCountry].registerPage;
  }

  onShowNoticeMsg = msg => {
    this.setState({ message: msg, isShowMsg: true });
  }

  onAccountChange = account => {
    this.setState({ account });
    if (account == "")
      return;
    
    this.props.checkAccount(account)
    .then(res => {
      // check account can be use
      if (this.props.accountValid && this.props.accountValid.status == "OK")
        this.setState({ accountValid: !this.props.accountValid.content.user_exist });
    })
    .catch(err => {
      if (this.props.errorMsg && Object.getOwnPropertyNames(this.props.errorMsg).length != 0)
        this.onShowNoticeMsg(this.props.errorMsg.data.message);
    })
  }
  
  onRegister = () => {
    let { account, password, rePassword, recommendCode } = this.state;

    if (account == "") {
      this.onShowNoticeMsg(this.Lang.accountMsg);
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
    this.props.userRegister({
      account,
      password,
      password_confirmation: rePassword,
      referral_code: recommendCode
    })
    .then(res => {
      //  check register status
      if (this.props.registerRlt && this.props.registerRlt.status == "OK") {
        this.setState(
          { showCompleteLayout: true },
          () => {
            setTimeout(() => {
              this.setState({ showCompleteLayout: false });
              Actions.verifyPhone({ accountFromRegister: this.props.registerRlt.content.account });
            }, 3000);
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

  onReadyVerifyPhone = visible => {
    return (
      <Modal
        visible={visible}
        transparent
        animationType="slide"
      >
        <View style={{ flex: 1, backgroundColor: "white", alignItems: "center", justifyContent: "center" }}>
          <Text style={{ fontSize: 30, marginBottom: 10, color: "#F6820D", fontWeight: "bold" }}>{this.Lang.completeMsg.congratulations}</Text>
          <Image source={ REGISTER_SUCCESS_LOGO } style={{ width: 100, height: 100, marginTop: 50, marginBottom: 20 }} resizeMode="contain" />
          <Text style={{ fontSize: 28, fontWeight: "bold", marginBottom: 10, marginBottom: 30 }}>{this.Lang.completeMsg.registrationSuccess}</Text>
          <Text style={{ fontSize: 22, color: "#F6820D", fontWeight: "bold" }}>{this.Lang.completeMsg.comingSoonToMobilePhoneVerification}</Text>
        </View>
      </Modal>
    );
  }

	render() {
		return (
			<KeyboardAwareScrollView
				resetScrollToCoords={{ x: 0, y: 0 }}
				scrollEnabled={false}
			>
        <Card style={ registerStyle.container }>
          {this.onReadyVerifyPhone(this.state.showCompleteLayout)}
          <Spinner visible={this.state.spinner} />
          <Message
            visible={this.state.isShowMsg}
            messageTxt={this.state.message}
            checkTxt="OK"
            onOK={ () => this.setState({ isShowMsg: false }) }
          />
          <TouchableOpacity style={ registerStyle.iconClose } onPress={ () => Actions.login() }>
            <IconBlock
              name="times"
              size={30}
              color={"#AFAFAF"}
            />
          </TouchableOpacity>
          <Image source={REGISTER_LOGO} style={ registerStyle.logoImg } resizeMode="contain" />
          <View style={ registerStyle.accountValidView }>
          {
            this.state.account != ""
            ? this.state.accountValid
              ? <Text style={{ ...registerStyle.accountValidTxt, color: "green" }}>{this.Lang.accountCanUse}</Text>
              : <Text style={{ ...registerStyle.accountValidTxt, color: "red" }}>{this.Lang.accountCanNotUse}</Text>
            : null
          }
          </View>
          {/* 帳號 */}
          <View style={ registerStyle.infoView }>
            <IconBlock
              name="user"
              size={24}
              color={"#FBA444"}
              viewStyle={ registerStyle.infoIconView }
            />
            <Input 
              containerStyle={ registerStyle.infoInputContainer }
              inputStyle={ registerStyle.infoInputTxt }
              secureTextEntry={false}
              placeholder={this.Lang.account}
              placeholderTextColor="#AFAFAF"
              value={this.state.account}
              onChangeText={ account => this.onAccountChange(account) }
            />
            {
              this.state.account != ""
              ? this.state.accountValid
                ? <IconBlock
                    name="check"
                    size={24}
                    color={"green"}
                    viewStyle={{ position: "absolute", right:  15 }}
                  />
                : <IconBlock
                    name="close"
                    size={24}
                    color={"red"}
                    viewStyle={{ position: "absolute", right:  15 }}
                  />
              : null
            }
          </View>
          {/* 設定密碼 */}
          <View style={ registerStyle.infoView }>
            <IconBlock
              name="lock"
              size={24}
              color={"#FBA444"}
              viewStyle={ registerStyle.infoIconView }
            />
            <Input 
              containerStyle={ registerStyle.infoInputContainer }
              inputStyle={ registerStyle.infoInputTxt }
              secureTextEntry={true}
              placeholder={this.Lang.password}
              placeholderTextColor="#AFAFAF"
              value={this.state.password}
              onChangeText={ password => this.setState({ password }) }
            />
          </View>
          {/* 確認密碼 */}
          <View style={ registerStyle.infoView }>
            <IconBlock
              name="lock"
              size={24}
              color={"#FBA444"}
              viewStyle={ registerStyle.infoIconView }
            />
            <Input 
              containerStyle={ registerStyle.infoInputContainer }
              inputStyle={ registerStyle.infoInputTxt }
              secureTextEntry={true}
              placeholder={this.Lang.rePassword}
              placeholderTextColor="#AFAFAF"
              value={this.state.rePassword}
              onChangeText={ rePassword => this.setState({ rePassword }) }
            />
          </View>
          {/* 推薦人手機號 */}
          <View style={ registerStyle.infoView }>
            <IconBlock
              name="users"
              size={20}
              color={"#FBA444"}
              viewStyle={ registerStyle.infoIconView }
            />
            <Input 
              containerStyle={ registerStyle.infoInputContainer }
              inputStyle={ registerStyle.infoInputTxt }
              secureTextEntry={false}
              placeholder={this.Lang.recommendCode}
              placeholderTextColor="#AFAFAF"
              value={this.state.recommendCode}
              onChangeText={ recommendCode => this.setState({ recommendCode }) }
            />
          </View>
          {/* 註冊 */}
          <TouchableOpacity style={ registerStyle.btnRegister } onPress={ () => this.onRegister() }>
            <Text style={{ color: "black", fontSize: 18, fontWeight: "bold" }}>{this.Lang.register}</Text>
          </TouchableOpacity>
          {/* notice */}
          <Text style={{ color: "#252527", fontSize: 16 }}>
            {this.Lang.notice1}
            <Text style={{ textDecorationLine: "underline" }} onPress={ () => Actions.serviceRule() }>{this.Lang.notice2}</Text>
          </Text>
        </Card>
      </KeyboardAwareScrollView>
		);
	}
}

/*
  Register 的 css樣式
*/
const registerStyle = StyleSheet.create({
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
    marginBottom: 10,
  },
  infoSelectorView: {
    width: "100%",
    height: 45,
    backgroundColor: "transparent"
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
  getVerification: {
    width: "45%",
    height: 45,
    marginRight: 5,
    backgroundColor: "#AFAFAF",
    borderRadius: 40,
    alignItems: "center",
    justifyContent: "center",
  },
  btnRegister: {
    width: "100%",
    height: 45,
    backgroundColor: "#F7820D",
    borderRadius: 40,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 15,
  },
  accountValidView: {
    width: "100%",
    height: 30,
    alignItems: "center",
  },
  accountValidTxt: {
    fontSize: 16,
  }
})

const mapStateToProps = ({ languageType, registerData }) => {
  const { langCountry } = languageType;
  const { accountValid, registerRlt, errorMsg } = registerData;

	return { langCountry, accountValid, registerRlt, errorMsg };
}

export default connect(mapStateToProps, {
  userRegister,
  checkAccount
})(Register);