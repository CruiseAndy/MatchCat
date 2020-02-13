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

/* Components */
import {
  Card,
  Input,
  IconBlock,
  Spinner,
  Selector,
  Message,
  Confirm,
} from '../../components/common';

/* Actions */
import {
  getVerification,
  verifyPhone,
} from '../../actions';

/* Data */
import Language from '../../Language.json';
import { REGISTER_LOGO } from '../../images';

class VerifyPhone extends Component {
	constructor(props) {
		super(props);
		this.state = {
      spinner: false,
      country: "",
      countryCode: "",
      phone: "",
      verification: "",
      message: "",
      isShowMsg: false,
      visibleGetVerification: false,
      flagTimeout: "",
      countValue: -1,
      verifyStatus: false, // true: complete, false: not complete
      isShowComfirm: false
    }
    this.Lang = Language[this.props.langCountry].verifyPhone;
    this.countryList = [
      { key: 0, label: this.Lang.countryList.chinese, countryCode: "86" }
    ]
	}

	componentWillReceiveProps(nextProps) {
    this.Lang = Language[nextProps.langCountry].verifyPhone;
  }

  componentWillUnmount() {
    this.state.flagTimeout && clearTimeout(this.state.flagTimeout);
  }

  onShowNoticeMsg = msg => {
    this.setState({ message: msg, isShowMsg: true });
  }

  onGetVerification = () => {
    let { countryCode, phone } = this.state;

    this.setState({ spinner: true });
    this.props.getVerification(this.props.accountFromRegister, countryCode, phone, false)
    .then(res => {
      //  check verify code result status
      if (this.props.verifyCodeRlt && this.props.verifyCodeRlt.status == "OK") {
        this.onShowNoticeMsg(this.Lang.sendVerificationMsg);
        this.setState(
          { visibleGetVerification: false, countValue: 120 },
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

  onCountingDown = () => {
    if (this.state.countValue <= 0) {
      this.setState({ countValue: -1, visibleGetVerification: true });
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

  onCountryChanghe = option => {
    this.setState(
      { country: option.label, countryCode: option.countryCode },
      () => {
        this.onCheckVerifyBtnStatus();
      }
    );
  }

  onPhoneChange = phone => {
    if (/^\d+$/.test(phone) || phone == "") {
      this.setState(
        { phone },
        () => {
          this.onCheckVerifyBtnStatus();
        }
      );
    }
  }

  onCheckVerifyBtnStatus = () => {
    if (this.state.phone != "" && this.state.country != "")
      this.setState({ visibleGetVerification: true });
    else
      this.setState({ visibleGetVerification: false });
  }
  
  onSubmit = () => {
    let { verification, country, phone } = this.state;

    if (verification == "") {
      this.onShowNoticeMsg(this.Lang.verificationMsg);
      return;
    }
    else if (country == "") {
      this.onShowNoticeMsg(this.Lang.countryMsg);
      return;
    }
    else if (phone == "") {
      this.onShowNoticeMsg(this.Lang.phoneMsg);
      return;
    }

    this.setState({ spinner: true });
    this.props.verifyPhone(this.props.accountFromRegister, verification)
    .then(res => {
      //  check verify phone result status
      if (this.props.verifyPhoneRlt && this.props.verifyPhoneRlt.status == "OK") {
        this.setState({ verifyStatus: true });
        this.onShowNoticeMsg(this.Lang.verifyComplete);
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
    this.setState({ isShowMsg: false });
    if (this.state.verifyStatus) {
      Actions.reset("home");
    }
  }

  onClose = () => {
    if (!this.state.verifyStatus) {
      this.setState({ isShowComfirm: true });
    }
  }

	render() {
		return (
			<Card style={ registerStyle.container }>
        <Spinner visible={this.state.spinner} />
        <Message
          visible={this.state.isShowMsg}
          messageTxt={this.state.message}
          checkTxt="OK"
          onOK={ () => this.onMsgOK() }
        />
        <Confirm
          visible={this.state.isShowComfirm}
          messageTxt={this.Lang.verifyPhoneNotComplete}
          cancelTxt={this.Lang.cancel}
          checkTxt={this.Lang.ok}
          onCancel={() => this.setState({ isShowComfirm: false })}
          onOK={() => Actions.login()}
        />
        <TouchableOpacity style={ registerStyle.iconClose } onPress={ () => this.onClose() }>
          <IconBlock
            name="times"
            size={24}
            color={"#AFAFAF"}
          />
        </TouchableOpacity>
        <Image source={REGISTER_LOGO} style={{ ...registerStyle.logoImg, marginBottom: 87 }} resizeMode="contain" />
        {/* 使用者帳號 */}
        <View style={{ ...registerStyle.infoView, backgroundColor: "transparent", borderColor: "transparent", width: "100%" }}>
          <IconBlock
            name="user"
            size={24}
            color={"#FBA444"}
            viewStyle={ registerStyle.infoIconView }
          />
          <Text style={{ ...registerStyle.infoInputTxt, height: "auto" }}>{this.props.accountFromRegister}</Text>
        </View>
        {/* 手機國家 */}
        <View style={ registerStyle.infoView }>
          <IconBlock
            name="map-marker"
            size={24}
            color={"#FBA444"}
            viewStyle={ registerStyle.infoIconView }
          />
          <Selector
            modalStyle={ registerStyle.infoSelectorView }
            textStyle={ registerStyle.infoInputTxt }
            placeholder={this.Lang.country}
            data={this.countryList}
            onChange={ option => this.onCountryChanghe(option) }
            value={this.state.country}
          />
          <IconBlock
            name="chevron-down"
            size={16}
            color={"#707070"}
            viewStyle={{ position: "absolute", right: 15 }}
          />
        </View>
        {/* 手機號碼 */}
        <View style={ registerStyle.infoView }>
          <IconBlock
            name="mobile"
            size={28}
            color={"#FBA444"}
            viewStyle={ registerStyle.infoIconView }
          />
          <Input 
            containerStyle={ registerStyle.infoInputContainer }
            inputStyle={ registerStyle.infoInputTxt }
            secureTextEntry={false}
            placeholder={this.Lang.phone}
            placeholderTextColor="#AFAFAF"
            keyboardType={"numeric"}
            value={this.state.phone}
            onChangeText={ phone => this.onPhoneChange(phone) }
          />
        </View>
        {/* 獲取驗證碼 */}
        <View style={{ flexDirection: "row" }}>
          <TouchableOpacity
            style={{ ...registerStyle.getVerification, backgroundColor: this.state.visibleGetVerification ? "#F7820D" : "#AFAFAF" }}
            onPress={ () => {
              this.state.visibleGetVerification ? this.onGetVerification() : null
            }}
          >
            <Text style={{ color: "white", fontSize: 16, fontWeight: "bold" }}>{this.state.countValue > 0 ? `${this.state.countValue}s...` : this.Lang.verification}</Text>
          </TouchableOpacity>
          <View style={{ ...registerStyle.infoView, width: "53%", borderColor: this.state.accountTxtFocus ? "#ED3807" : "white" }}>
            <Input 
              containerStyle={ registerStyle.infoInputContainer }
              inputStyle={{ ...registerStyle.infoInputTxt, paddingLeft: 20, textAlign: "center" }}
              secureTextEntry={false}
              placeholder={this.Lang.enterVerification}
              placeholderTextColor="#AFAFAF"
              keyboardType={"numeric"}
              value={this.state.verification}
              onChangeText={ verification => this.setState({ verification }) }
            />
          </View>
        </View>
        {/* 註冊 */}
        <TouchableOpacity style={ registerStyle.btnRegister } onPress={ () => this.onSubmit() }>
          <Text style={{ color: "black", fontSize: 18, fontWeight: "bold" }}>{this.Lang.submit}</Text>
        </TouchableOpacity>
        {/* notice */}
        <Text style={{ color: "#252527", fontSize: 16 }}>
          {this.Lang.notice1}
          <Text style={{ textDecorationLine: "underline" }} onPress={ () => Actions.serviceRule() }>{this.Lang.notice2}</Text>
        </Text>
      </Card>
		);
	}
}

/*
  VerifyPhone 的 css樣式
*/
const registerStyle = StyleSheet.create({
	container: {
		paddingLeft: 40,
		paddingRight: 40,
		alignItems: "center",
		justifyContent: "center",
		flex: 1,
    backgroundColor: "#F0F0F0",
    position: "relative",
	},
	iconClose: {
		position: "absolute",
    top: 30,
    right: 15,
  },
  logoImg: {
    width: 130,
    marginBottom: 30,
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
  }
})

const mapStateToProps = ({ languageType, verifyPhoneData }) => {
  const { langCountry } = languageType;
  const { verifyCodeRlt, verifyPhoneRlt, errorMsg } = verifyPhoneData;

	return { langCountry, verifyCodeRlt, verifyPhoneRlt, errorMsg };
}

export default connect(mapStateToProps, { getVerification, verifyPhone })(VerifyPhone);