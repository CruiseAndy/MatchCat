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
  ImageBackground,
  Dimensions,
  Image
} from 'react-native';
import { connect } from 'react-redux';
import { Actions } from 'react-native-router-flux';
import { ifIphoneX } from "react-native-iphone-x-helper";
import ImagePicker from 'react-native-image-picker';
import QRCode from 'react-native-qrcode-svg';

/* Components */
import {
  Card,
  Input,
  IconBlock,
  Spinner,
  Message,
} from '../../components/common';

/* Actions */
import { translatorWixQRcode, addWixQRcode, updateWixQRcode } from '../../actions';

/* Data */
import Language from '../../Language.json';
import { UPLOAD_QRCODE_BG } from "../../images";

const winWidth = Dimensions.get("window").width;

class UploadQRcode extends Component {

	constructor(props) {
		super(props);
		this.state = {
      spinner: false,
      isShowMsg: false,
      message: "",
      avatarSource: {},
      qrcodeDecode: "",
      qrcodeUploadSuccess: false,
      acctName: "",
      remarkName: "",
		}
    this.Lang = Language[this.props.langCountry].uploadQRcodePage;
	}

	componentWillReceiveProps(nextProps) {
    this.Lang = Language[nextProps.langCountry].uploadQRcodePage;
  }

  onShowNoticeMsg = msg => {
    this.setState({ message: msg, isShowMsg: true });
  }

  onSelectImageFromDevice = () => {
    const options = {
      title: this.Lang.choiseImg, 
      cancelButtonTitle: this.Lang.cancel,
      takePhotoButtonTitle: this.Lang.takePicture, 
      chooseFromLibraryButtonTitle: this.Lang.imageLibrary, 
      cameraType: 'back',
      mediaType: 'photo',
      videoQuality: 'high', 
      durationLimit: 10,
      maxWidth: 600,
      maxHeight: 600,
      aspectX: 2, 
      aspectY: 1,
      quality: 0.8,
      angle: 0,
      allowsEditing: false,
      noData: false,
      storageOptions: { 
          skipBackup: true, 
          path: 'images'
      }
    };
    /**
     * The first arg is the options object for customization (it can also be null or omitted for default options),
     * The second arg is the callback which sends object: response (more info in the API Reference)
     */
    ImagePicker.showImagePicker(options, (response) => {
      if (response.didCancel) {
        console.log('User cancelled image picker');
      } else if (response.error) {
        console.log('ImagePicker Error: ', response.error);
      } else if (response.customButton) {
        console.log('User tapped custom button: ', response.customButton);
      } else {
        // const source = { uri: response.uri };

        // You can also display the image using data:
        // const source = { uri: 'data:image/jpeg;base64,' + response.data };

        this.setState({
          avatarSource: response,
          qrcodeDecode: 'data:image/jpeg;base64,' + response.data,
        });
      }
    });
  }

  translatorQRcode = () => {
    if (Object.getOwnPropertyNames(this.state.avatarSource).length == 0) {
      if (this.props.updateWeChatCodeInfo) {
        this.onShowNoticeMsg(this.Lang.uploadQRcodeSuccess);
        return;
      }
      else
        return;
    }

    const imgData = new FormData();
    imgData.append("qr_image", {
      uri: this.state.avatarSource.uri,
      type: this.state.avatarSource.type,
      name: this.state.avatarSource.fileName
    });

    this.setState({ spinner: true });

    //  qrcode image to address
    this.props.translatorWixQRcode(imgData)
    .then(res => {
      if (Object.getOwnPropertyNames(this.props.translateQRcodeRlt).length != 0) {
        if(this.props.updateWeChatCodeInfo)
          this.updateQRcode();
        else
          this.submitQRcode();
      }
    })
    .catch(err => {
      this.setState({ spinner: false });
      if (this.props.errorMsg && Object.getOwnPropertyNames(this.props.errorMsg).length != 0)
				this.setState({ message: this.props.errorMsg.data.message, isShowMsg: true });
    });
  }

  submitQRcode = ()  => {
    const { userData, translateQRcodeRlt, weChatCodeCreate, addAccountRlt } = this.props;
    let remark = "";

    const auth_token = userData.content.auth_token;
    const url = translateQRcodeRlt.content.code_url;
    const codesCount = weChatCodeCreate ? weChatCodeCreate.codes_count : addAccountRlt.content.account.codes_count;

    if (codesCount.toString().length < 2)
      remark = `QR0${codesCount + 1}`;
    else
      remark = `QR${codesCount + 1}`;

    const acct_id = weChatCodeCreate.acct_id ? weChatCodeCreate.acct_id : addAccountRlt.content.account.id;

    // add qrcode code
    this.props.addWixQRcode(auth_token, url, remark, acct_id)
    .then(res => {
      if (Object.getOwnPropertyNames(this.props.addQRcodeRlt).length != 0) {
        this.onShowNoticeMsg(this.Lang.uploadQRcodeSuccess);
        this.setState({ qrcodeUploadSuccess: true });
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

  updateQRcode = () => {
    const { userData, translateQRcodeRlt } = this.props;
    const auth_token = userData.content.auth_token;
    const url = translateQRcodeRlt.content.code_url;
    const remark = this.props.updateWeChatCodeInfo.content.remark;
    const accountId = this.props.updateWeChatCodeInfo.weChatInfo.id;
    const codeId = this.props.updateWeChatCodeInfo.content.id;

    this.props.updateWixQRcode(auth_token, url, remark, accountId, codeId)
    .then(res => {
      if (Object.getOwnPropertyNames(this.props.updateQRcodeRlt).length != 0) {
        this.onShowNoticeMsg(this.Lang.uploadQRcodeSuccess);
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

  onMsgOK = () => {
    this.setState({ isShowMsg: false });

    if (this.props.weChatCodeCreate.acct_id) {
      Actions.pop();
      this.props.weChatCodeCreate.refresh();
    }
    else if (this.props.updateWeChatCodeInfo) {
      Actions.pop();
      this.props.updateWeChatCodeInfo.refresh();
    }
    else if (this.state.qrcodeUploadSuccess)
      Actions.reset("home");
  }

  onBackPage = () => {
    if (this.props.weChatCodeCreate) {
      Actions.pop();
    }
    else if (this.props.updateWeChatCodeInfo) {
      Actions.pop();
    }
    else {
      Actions.reset("home");
    }
  }

	render() {
    let acct_name, remark;
    if (this.props.updateWeChatCodeInfo)  {
      acct_name = this.props.updateWeChatCodeInfo.weChatInfo.acct_name;
      remark = this.props.updateWeChatCodeInfo.content.remark;
    }
    
		return (
			<Card style={ uploadQRcodeStyle.container }>
        <Spinner visible={this.state.spinner} />
        <Message
          visible={this.state.isShowMsg}
          messageTxt={this.state.message}
          checkTxt="OK"
          onOK={ () => this.onMsgOK() }
        />
        <View style={ uploadQRcodeStyle.header }>
          <TouchableOpacity style={{ paddingLeft: 10, paddingRight: 10 }} onPress={ () => this.onBackPage() }>
            <IconBlock
              name="chevron-left"
              color={"#C8C8C8"}
            />
          </TouchableOpacity>
          <Text style={ uploadQRcodeStyle.headerTxt }>{this.Lang.title}</Text>
        </View>
        {
          acct_name != "" && acct_name
          ? <View style={ uploadQRcodeStyle.titleView }>
              <Text style={{ fontSize: 18, color: "#000000", fontWeight: "bold", marginBottom: 10 }}>{acct_name || ""}</Text>
              <Text style={{ fontSize: 18, color: "#707070", fontWeight: "bold" }}>{`${this.Lang.serialNum} ${remark || ""}`}</Text>
            </View>
          : null
        }
        <TouchableOpacity
          style={{
            ...uploadQRcodeStyle.uploadView,
            borderWidth: Object.getOwnPropertyNames(this.state.avatarSource).length == 0 && !this.props.updateWeChatCodeInfo ? 2 : 0
          }}
          onPress={ () => this.onSelectImageFromDevice() }
        >
        {/**
          * 如果是更新，則顯示 QRcode；如果是新增 QRcode，則顯示"上傳收款碼"
         */}
        {
          Object.getOwnPropertyNames(this.state.avatarSource).length != 0
          ? <Image source={this.state.avatarSource} resizeMode="contain" style={{ width: "100%", height: "100%" }} />
          : this.props.updateWeChatCodeInfo
            ? <QRCode value={this.props.updateWeChatCodeInfo.url} size={200} bgColor='white' fgColor='black'/>
            : <ImageBackground source={ UPLOAD_QRCODE_BG } resizeMode="contain" style={ uploadQRcodeStyle.qrcodeView }>
                <Text style={ uploadQRcodeStyle.qrcodeTxt }>{this.Lang.uploadQRcode}</Text>
              </ImageBackground>
        }
        </TouchableOpacity>
        <TouchableOpacity
          style={{
            ...uploadQRcodeStyle.submitBtnView,
            backgroundColor: Object.getOwnPropertyNames(this.state.avatarSource).length != 0 || this.props.updateWeChatCodeInfo
              ? "#F7820D" : "#E5E5E5"
          }}
          onPress={ () => this.translatorQRcode() }
        >
          <Text style={{
            ...uploadQRcodeStyle.submitBtnTxt,
            color: Object.getOwnPropertyNames(this.state.avatarSource).length != 0 || this.props.updateWeChatCodeInfo
              ? "#0C0600" : "#848485"
          }}>{this.Lang.submit}</Text>
        </TouchableOpacity>
      </Card>
		);
	}
}

/*
  UploadQRcode 的 css樣式
*/
const uploadQRcodeStyle = StyleSheet.create({
	container: {
		paddingLeft: 20,
		paddingRight: 20,
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
  titleView: {
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 30,
  },
  uploadView: {
    backgroundColor: "#F0F0F0",
    width: "80%",
    height: (winWidth - 40) * 0.9,
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
    marginBottom: 30,
    borderWidth: 2,
    borderStyle: "dashed",
    borderColor: "#F7820D",
    borderRadius: 10,
  },
  qrcodeView: {
    width: "100%",
    height: "100%",
    alignItems: "center",
    justifyContent: "center",
  },
  qrcodeTxt: {
    fontSize: 22,
    color: "#F7820D",
    fontWeight: "bold",
    lineHeight: 35
  },
  submitBtnView: {
    width: "80%",
    height: 50,
    backgroundColor: "#F7820D",
    borderRadius: 50,
    alignItems: "center",
    justifyContent: "center",
  },
  submitBtnTxt: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#0C0600",
    elevation: 5,
    shadowColor: "#c6c6c6",
    shadowOpacity: 0.4,
    shadowRadius: 3,
    shadowOffset: {
      height: 5,
      width: 0
		},
  }
})

const mapStateToProps = ({ languageType, loginData, addWechatData }) => {
  const { langCountry } = languageType;
  const { userData } = loginData;
  const { addAccountRlt, translateQRcodeRlt, addQRcodeRlt, updateQRcodeRlt, errorMsg } = addWechatData;

	return { langCountry, userData, addAccountRlt, translateQRcodeRlt, addQRcodeRlt, updateQRcodeRlt, errorMsg };
}

export default connect(mapStateToProps, { translatorWixQRcode, addWixQRcode, updateWixQRcode })(UploadQRcode);