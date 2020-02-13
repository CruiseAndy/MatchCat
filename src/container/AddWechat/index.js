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
  Modal
} from 'react-native';
import { connect } from 'react-redux';
import { Actions } from 'react-native-router-flux';
import { ifIphoneX } from "react-native-iphone-x-helper";
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
import { addWixAccount, updateWixAccount } from '../../actions';

/* Data */
import Language from '../../Language.json';
import { REGISTER_LOGO } from '../../images';

class AddWechat extends Component {

	constructor(props) {
		super(props);
		this.state = {
      spinner: false,
      managerName: "",
      wechatAccount: "",
      realName: "",
      nickName: "",
      message: "",
      isShowMsg: false,
      showCompleteLayout: false,
		}
    this.Lang = Language[this.props.langCountry].addWechatAccountPage;
  }
  
  componentWillMount() {
    if (this.props.weChatInfo) {
      this.setState({
        managerName: this.props.weChatInfo.content.acct_name,
        wechatAccount: this.props.weChatInfo.content.account,
        realName: this.props.weChatInfo.content.name,
        nickName: this.props.weChatInfo.content.nickname
      });
    }
  }

	componentWillReceiveProps(nextProps) {
    this.Lang = Language[nextProps.langCountry].addWechatAccountPage;
  }

  onShowNoticeMsg = msg => {
    this.setState({ message: msg, isShowMsg: true });
  }

  onWechatAccountSubmit = () => {
    let { managerName, wechatAccount, realName, nickName } = this.state;

    if (managerName == "") {
      this.onShowNoticeMsg(this.Lang.managerNameMsg1);
      return;
    }
    else if (managerName.length > 10) {
      this.onShowNoticeMsg(this.Lang.managerNameMsg2);
      return;
    }
    else if (wechatAccount == "") {
      this.onShowNoticeMsg(this.Lang.wechatAccountMsg);
      return;
    }
    else if (realName == "") {
      this.onShowNoticeMsg(this.Lang.realNameMsg);
      return;
    }
    else if (nickName == "") {
      this.onShowNoticeMsg(this.Lang.nickNameMsg);
      return;
    }

    this.setState({ spinner: true });
    if (this.props.weChatInfo) {
      this.onRunUpdateWechatAccount();
    }
    else {
      this.onRunAddWechatAccount();
    }
  }

  onRunUpdateWechatAccount = () => {
    this.props.updateWixAccount(this.props.weChatInfo.content.id, {
      auth_token: this.props.userData.content.auth_token,
      acct_name: this.state.managerName,
      name: this.state.realName,
      account: this.state.wechatAccount,
      nickname: this.state.nickName
    })
    .then(res => {
      if (this.props.updateAccountRlt && this.props.updateAccountRlt.status == "OK") {
        Actions.pop();
        this.props.weChatInfo.refresh();
      }
    })
    .catch(err => {
      if (this.props.errorMsg && Object.getOwnPropertyNames(this.props.errorMsg).length != 0)
        this.setState({ message: this.props.errorMsg.data.message, isShowMsg: true });
    })
    .finally(() => {
      this.setState({ spinner: false });
    });
  }

  onRunAddWechatAccount = () => {
    this.props.addWixAccount({
      auth_token: this.props.userData.content.auth_token,
      payment_type: "wechat",
      acct_name: this.state.managerName,
      name: this.state.realName,
      account: this.state.wechatAccount,
      nickname: this.state.nickName
    })
    .then(res => {
      if (this.props.addAccountRlt && this.props.addAccountRlt.status == "OK") {
        this.setState(
          { showCompleteLayout: true },
          () => {
            setTimeout(() => {
              this.setState({ showCompleteLayout: false });
              Actions.uploadQRcode({ weChatCodeCreate: { codes_count: 0 } });
            }, 3000);
          }
        );
      }
    })
    .catch(err => {
      if (this.props.errorMsg && Object.getOwnPropertyNames(this.props.errorMsg).length != 0)
        this.setState({ message: this.props.errorMsg.data.message, isShowMsg: true });
    })
    .finally(() => {
      this.setState({ spinner: false });
    });
  }

  onReadyUploadQRcode = visible => {
    return (
      <Modal
        visible={visible}
        transparent
        animationType="slide"
      >
        <View style={{ flex: 1, backgroundColor: "white", alignItems: "center", justifyContent: "center" }}>
          <Text style={{ fontSize: 30, color: "#F6820D", fontWeight: "bold", marginBottom: 30 }}>{this.Lang.congratulation}</Text>
          <IconBlock
            size={100}
            name="weixin"
            color={"#F7820D"}
          />
          <Text style={{ fontSize: 24, fontWeight: "bold", marginBottom: 100 }}>{this.Lang.wechatAccountCreateSuccess}</Text>
          <Text style={{ fontSize: 20, color: "#F6820D", fontWeight: "bold" }}>{this.Lang.enterUploadQRcode}</Text>
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
        <Card style={ addWechatStyle.container }>
          {this.onReadyUploadQRcode(this.state.showCompleteLayout)}
          <Spinner visible={this.state.spinner} />
          <Message
            visible={this.state.isShowMsg}
            messageTxt={this.state.message}
            checkTxt="OK"
            onOK={ () => this.setState({ isShowMsg: false }) }
          />
          <View style={ addWechatStyle.header }>
            <TouchableOpacity style={{ paddingLeft: 10, paddingRight: 10 }} onPress={ () => Actions.pop() }>
              <IconBlock
                name="chevron-left"
                color={"#C8C8C8"}
              />
            </TouchableOpacity>
            <Text style={ addWechatStyle.headerTxt }>{this.Lang.title}</Text>
          </View>
          <Image source={REGISTER_LOGO} style={ addWechatStyle.logoImg } resizeMode="contain" />
          {/* 管理名稱 */}
          <View style={ addWechatStyle.infoView }>
            <IconBlock
              name="user-secret"
              size={20}
              color={"#FBA444"}
              viewStyle={ addWechatStyle.infoIconView }
            />
            <Input 
              containerStyle={ addWechatStyle.infoInputContainer }
              inputStyle={ addWechatStyle.infoInputTxt }
              placeholder={this.Lang.managerName}
              placeholderTextColor="#AFAFAF"
              value={this.state.managerName}
              onChangeText={ managerName => this.setState({ managerName }) }
            />
          </View>
          {/* 微信帳號 */}
          <View style={ addWechatStyle.infoView }>
            <IconBlock
              name="weixin"
              size={20}
              color={"#FBA444"}
              viewStyle={{ ...addWechatStyle.infoIconView, left: 10 }}
            />
            <Input 
              containerStyle={ addWechatStyle.infoInputContainer }
              inputStyle={ addWechatStyle.infoInputTxt }
              placeholder={this.Lang.wechatAccount}
              placeholderTextColor="#AFAFAF"
              value={this.state.wechatAccount}
              onChangeText={ wechatAccount => this.setState({ wechatAccount }) }
            />
          </View>
          {/* 真實姓名 */}
          <View style={ addWechatStyle.infoView }>
            <IconBlock
              name="user"
              size={20}
              color={"#FBA444"}
              viewStyle={ addWechatStyle.infoIconView }
            />
            <Input 
              containerStyle={ addWechatStyle.infoInputContainer }
              inputStyle={ addWechatStyle.infoInputTxt }
              placeholder={this.Lang.realName}
              placeholderTextColor="#AFAFAF"
              value={this.state.realName}
              onChangeText={ realName => this.setState({ realName }) }
            />
          </View>
          {/* 微信暱稱 */}
          <View style={ addWechatStyle.infoView }>
            <IconBlock
              name="paw"
              size={20}
              color={"#FBA444"}
              viewStyle={ addWechatStyle.infoIconView }
            />
            <Input 
              containerStyle={ addWechatStyle.infoInputContainer }
              inputStyle={ addWechatStyle.infoInputTxt }
              placeholder={this.Lang.nickName}
              placeholderTextColor="#AFAFAF"
              value={this.state.nickName}
              onChangeText={ nickName => this.setState({ nickName }) }
            />
          </View>
          {/* 提交 */}
          <TouchableOpacity style={ addWechatStyle.submitVerify } onPress={ () => this.onWechatAccountSubmit() }>
            <Text style={{ color: "#262628", fontSize: 18, fontWeight: "bold" }}>{this.Lang.submit}</Text>
          </TouchableOpacity>
        </Card>
      </KeyboardAwareScrollView>
		);
	}
}

/*
  AddWechat 的 css樣式
*/
const addWechatStyle = StyleSheet.create({
	container: {
		paddingLeft: 15,
		paddingRight: 15,
		alignItems: "center",
		justifyContent: "center",
		flex: 1,
    backgroundColor: "#F0F0F0",
    position: "relative",
	},
  header: {
    width: "100%",
    height: 30,
    position: "absolute",
		...ifIphoneX({
			top: 40,
		}, {
			top: 30,
		}),
    flexDirection: "row",
    alignItems: "center",
  },
  headerTxt: {
    marginLeft: 5,
    fontSize: 18,
    fontWeight: "bold",
    color: "#F78513",
  },
  logoImg: {
    width: 130,
    marginBottom: 20,
  },
	infoView: {
    width: "95%",
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
		height: 50,
		textAlign: "left",
  },
  submitVerify: {
    width: "95%",
    height: 45,
    backgroundColor: "#F7820D",
    borderRadius: 40,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 15,
  }
})

const mapStateToProps = ({ languageType, addWechatData, loginData }) => {
  const { langCountry } = languageType;
  const { userData } = loginData;
  const { addAccountRlt, updateAccountRlt, errorMsg } = addWechatData;

	return { langCountry, addAccountRlt, userData, updateAccountRlt, errorMsg };
}

export default connect(mapStateToProps, { addWixAccount, updateWixAccount })(AddWechat);