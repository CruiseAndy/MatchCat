/*
 * Date : 2019/04/17
 * Writer : kevin
 */

/* Tools */
import React, { Component } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, Dimensions, Linking, ScrollView } from 'react-native';
import { connect } from 'react-redux';
import { Actions } from 'react-native-router-flux';
import LinearGradient from 'react-native-linear-gradient';
import CheckBox from 'react-native-check-box';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';

/* Components */
import { Card, Input, IconBlock, Spinner, Message, Confirm } from '../../components/common';

/* Actions */
import { getVersion, userLogin, startGrabOrder } from '../../actions';

/* Data */
import { LOGIN } from '../../images';
import Language from '../../Language.json';
import { appVersion } from '../../../app.json';

const winHeight = Dimensions.get('window').height;

class Login extends Component {

	constructor(props) {
		super(props);
		this.state = {
			account: "",
			password: "",
			hidePwd: true,
			pwdTxtFocus: false,
			isRememberMe: false,
			spinner: false,
			message: "",
			isShowMsg: false,
			isShowVersionMsg: false
		}
		this.Lang = Language[this.props.langCountry].loginPage;
	}

	componentDidMount() {
		this.props.getVersion()
		.then(res => {
			if (this.props.version.content.app_version !== appVersion) {
				this.setState({ spinner: false, isShowVersionMsg: true });
			}
		})
		.catch(err => {
			if (this.props.errorMsg && this.props.errorMsg && Object.getOwnPropertyNames(this.props.errorMsg).length != 0)
				this.setState({ message: this.props.errorMsg.data.message, isShowMsg: true, spinner: false });
		})
		.finally(() => {
			this.setState(
				{ spinner: true },
				() => {
					this.onGetStorgeUserData();
				}
			);
		});
	}

	componentWillReceiveProps(nextProps) {
		this.Lang = Language[nextProps.langCountry].loginPage;
	}

	onLogin = () => {
		let { account, password } = this.state;

		if (!account || account == "") {
			this.setState({ message: this.Lang.accountMsg, isShowMsg: true });
			return;
		}
		else if (!password || password == "") {
			this.setState({ message: this.Lang.passwordMsg, isShowMsg: true });
			return;
		}

		this.setState({ spinner: true });
		this.props.userLogin(account, password)
		.then(res => {
			if (this.props.userData.status && this.props.userData.status == "OK" && this.state.isRememberMe) {
				this.onSetStorgeUserData({account, password});
			}
			else {
				this.onRemoveStorgeUserData();
			};

			this.setState({ spinner: false });
			if (this.props.userData.content.phone_confirmed) {
				if (this.props.userData.content.pending_sell_order) {
					this.props.startGrabOrder(this.props.userData.content.auth_token)
					this.setState({ message: this.Lang.sellOrderMsg, isShowMsg: true });
				}
				else	if (this.props.userData.content.pending_buy_order)
					this.setState({ message: this.Lang.buyOrderMsg, isShowMsg: true });
				else
					Actions.reset("home");
			}
			else
				Actions.verifyPhone({ accountFromRegister: account });
		})
		.catch(err => {
			if (this.props.errorMsg && Object.getOwnPropertyNames(this.props.errorMsg).length != 0)
				this.setState({ message: this.props.errorMsg.data.message, isShowMsg: true, spinner: false });
		});
	}

	onRemoveStorgeUserData = () => {
		storage.remove({
			key: 'MatchCatUserData'
		});
	}

	onSetStorgeUserData = data => {
		storage.save({
			key: 'MatchCatUserData', // 注意:请不要在key中使用_下划线符号!
			data,
		});
	}

	onGoDownload = () => {
		this.setState({ isShowVersionMsg: false });
		Linking.openURL(this.props.version.content.download_link);
	}

	onGetStorgeUserData = () => {
		storage
			.load({
				key: 'MatchCatUserData',
				// autoSync(默认为true)意味着在没有找到数据或数据过期时自动调用相应的sync方法
				autoSync: true, // 设置为false的话，则等待sync方法提供的最新数据(当然会需要更多时间)。

				// syncInBackground(默认为true)意味着如果数据过期，
				// 在调用sync方法的同时先返回已经过期的数据。
				syncInBackground: true,
			})
			.then(ret => {
				let { account, password } = ret;
				this.setState({
					account,
					password,
					isRememberMe: true,
					spinner: false
				});
			})
			.catch(err => {
				//如果没有找到数据且没有sync方法，
				//或者有其他异常，则在catch中返回
				// do nothing
				switch (err.name) {
					case 'NotFoundError':
						// TODO;
						break;
					case 'ExpiredError':
						// TODO
						break;
				};

				this.setState({ spinner: false });
			});
	}

	onMsgOK = () => {
		this.setState({ isShowMsg: false });
		
		if (this.props.userData.status != "OK")
			return;

		if (this.props.userData.content.pending_buy_order) 
			Actions.createBuyOrder();
		else if (this.props.userData.content.pending_sell_order)
			Actions.grabOrderSuccess();
		else
			Actions.reset("home");
	}

	render() {
		return (
			<KeyboardAwareScrollView
				resetScrollToCoords={{ x: 0, y: 0 }}
				scrollEnabled={false}
			>
				<LinearGradient colors={['#FCA749', '#FCA749', '#EF411E']} style={ loginStyle.linearGradient }>
					<Spinner visible={this.state.spinner} />
					<Message
						visible={this.state.isShowMsg}
						messageTxt={this.state.message}
						checkTxt="OK"
						onOK={ () => this.onMsgOK() }
					/>
					<Confirm
						visible={this.state.isShowVersionMsg}
						messageTxt={this.Lang.versionMsgTitle}
						cancelTxt={this.Lang.versionCancelMsg}
						checkTxt={this.Lang.versionOKMsg}
						onCancel={() => this.setState({ isShowVersionMsg: false })}
						onOK={() => this.onGoDownload()}
					/>
					<ScrollView>
						<Card style={ loginStyle.container }>
							<Image source={LOGIN} style={ loginStyle.logoImg } resizeMode="contain" />
							<View style={ loginStyle.infoView }>
								<IconBlock
									name="user"
									size={24}
									color={"#FBA444"}
									viewStyle={ loginStyle.iconView }
								/>
								<Input 
									containerStyle={ loginStyle.inputContainer }
									inputStyle={ loginStyle.inputTxt }
									secureTextEntry={false}
									placeholder={this.Lang.account}
									placeholderTextColor="#AFAFAF"
									value={this.state.account}
									onChangeText={ account => this.setState({ account, isRememberMe: false }) }
								/>
							</View>
							<View style={{ ...loginStyle.infoView, borderColor: this.state.pwdTxtFocus ? "#ED3807" : "white" }}>
								<IconBlock
									name="lock"
									size={24}
									color={"#FBA444"}
									viewStyle={ loginStyle.iconView }
								/>
								<Input 
									containerStyle={ loginStyle.inputContainer }
									inputStyle={ loginStyle.inputTxt }
									secureTextEntry={this.state.hidePwd}
									placeholder={this.Lang.password}
									placeholderTextColor="#AFAFAF"
									value={this.state.password}
									onChangeText={ password => this.setState({ password, isRememberMe: false }) }
									onFocus={ () => this.setState({ pwdTxtFocus: true }) }
									onBlur={ () => this.setState({ pwdTxtFocus: false }) }
								/>
								<TouchableOpacity style={{ position: "absolute", right: 15 }} onPress={ () => this.setState({ hidePwd: !this.state.hidePwd }) }>
									<IconBlock
										name="eye"
										size={24}
										color={"#FBA444"}
									/>
								</TouchableOpacity>
							</View>
							<TouchableOpacity style={ loginStyle.loginButton } onPress={ () => this.onLogin() }>
								<Text style={ loginStyle.loginButtonTxt }>{this.Lang.login}</Text>
							</TouchableOpacity>
							<View style={ loginStyle.rememberView }>
								<TouchableOpacity
									style={ loginStyle.rememberMe }
									onPress={ () => this.setState({ isRememberMe: !this.state.isRememberMe }) }
								>
									<CheckBox
										onClick={ () => this.setState({ isRememberMe: !this.state.isRememberMe }) }
										isChecked={this.state.isRememberMe}
									/>
									<Text style={ loginStyle.rememberTxt }>{this.Lang.rememberMe}</Text>
								</TouchableOpacity>
								<Text style={ loginStyle.rememberTxt } onPress={ () => Actions.forgetPwd() }>{this.Lang.forgetPwd}</Text>
							</View>
							<TouchableOpacity style={ loginStyle.registerView } onPress={ () => Actions.register() }>
								<Text style={ loginStyle.registerTxt }>{this.Lang.registerMember}</Text>
							</TouchableOpacity>
						</Card>
					</ScrollView>
				</LinearGradient>
			</KeyboardAwareScrollView>
		);
	}
}

/*
  Login 的 css樣式
*/
const loginStyle = StyleSheet.create({
	linearGradient: {
		width: "100%",
		height: winHeight,
	},
	container: {
		paddingLeft: 25,
		paddingRight: 25,
		alignItems: "center",
		justifyContent: "center",
		flex: 1,
		backgroundColor: "transparent",
	},
	logoImg: {
		width: 180,
		height: 100,
		marginBottom: 10,
	},
	loginNoticeView: {
		height: 25,
		marginBottom: 15,
	},
	infoView: {
		backgroundColor: "white",
		borderRadius: 45,
		flexDirection: "row",
		alignItems: "center",
		position: "relative",
		marginBottom: 15,
	},
	inputContainer: {
		marginBottom: 0,
		borderWidth: 0,
	},
	inputTxt: {
		color: "black",
		fontSize: 20,
		paddingRight: 20,
		paddingLeft: 50,
		height: 50,
		textAlign: "left",
	},
	iconView: {
		position: "absolute",
		left: 15,
	},
	loginButton: {
		width: "100%",
		height: 50,
		marginBottom: 15,
		backgroundColor: "transparent",
		borderRadius: 45,
		alignItems: "center",
		justifyContent: "center",
		borderColor: "black",
		borderWidth: 2,
	},
	loginButtonTxt: {
		color: "black",
		fontWeight: "bold",
		fontSize: 20,
	},
	rememberView: {
		width: "100%",
		height: 50,
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "space-between",
		paddingLeft: 15,
		paddingRight: 15,
	},
	rememberTxt: {
		color: "black",
		fontSize: 18,
	},
	rememberMe: {
		flexDirection: "row",
		alignItems: "center",
	},
	registerView: {
		position: "absolute",
		bottom: 35,
		padding: 10,
	},
	registerTxt: {
		fontSize: 18,
	}
})

const mapStateToProps = ({ loginData, languageType }) => {
	const { version, userData, errorMsg } = loginData;
	const { langCountry } = languageType;

	return { version, userData, langCountry, errorMsg };
}

export default connect(mapStateToProps, { getVersion, userLogin, startGrabOrder })(Login);