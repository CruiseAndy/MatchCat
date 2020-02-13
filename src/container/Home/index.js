/*
 * Date : 2019/04/17
 * Writer : kevin
 */

/* Tools */
import React, { Component } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
	ImageBackground,
	Platform,
	Image
} from "react-native";
import { connect } from "react-redux";
import { Actions } from "react-native-router-flux";
import { ifIphoneX } from "react-native-iphone-x-helper";

/* Components */
import {
  Card,
  IconBlock,
  Spinner,
	Message,
	Confirm
} from "../../components/common";

/* Actions */
import { getUserData, userLogout, changeWixAccountStatus } from "../../actions";

/* Data */
import Language from "../../Language.json";
import { BUY_BTN_TW, BUY_BTN_CN, GRAB_ORDER_BTN, LOGO_TITLE } from "../../images";

const winHeight = Dimensions.get("window").height;

class Home extends Component {
  constructor(props) {
    super(props);
    this.state = {
      spinner: false,
      isShowMsg: false,
      message: "",
			balance: 0,
			valid_balance: 0,
			monthly_orders_count: 0,
			msgStatus: 0, // 1: logout, 2: sell order, 3: buy order
			moneyTxtLength: 7,
			wechatAccounts: null,
			wechatAccountIndex: 0,
			/**
			 	* verifying: 驗證中
				* verified: 已驗證
				* suspended: 停用
				* failed: 驗證失敗
			 */
			wechatAccountStatus: "verified",
			wechatUseQRcode: 0,
			wechatStopQRcode: 0,
			flagTimeout: 0,
			isGrabOrderStatus: false,
			returnReload: false,
			isShowLogoutMsg: false
    };
		this.Lang = Language[this.props.langCountry].homePage;
	}

  componentDidMount() {
		this.onGetUserInfo();
  }

  componentWillReceiveProps(nextProps) {
		this.Lang = Language[nextProps.langCountry].homePage;
	}
	
	componentWillUnmount() {
		if (this.state.flagTimeout != 0)
			clearTimeout(this.state.flagTimeout);
	}

  onGetUserInfo = () => {
		// this.setState({ spinner: true });
		this.props.getUserData(this.props.userData.content.auth_token)
		.then(res => {
			if (Object.getOwnPropertyNames(this.props.userInfo).length != 0) {
				this.setState({
					balance: this.props.userInfo.content.balance,
					valid_balance: this.props.userInfo.content.valid_balance,
					wechatAccounts: this.props.userInfo.content.wechat_accounts,
					wechatAccountStatus: this.props.userInfo.content.wechat_accounts.length != 0 ? this.props.userInfo.content.wechat_accounts[this.state.wechatAccountIndex].status : [],
					wechatUseQRcode: this.props.userInfo.content.wechat_accounts.length != 0 ? this.props.userInfo.content.wechat_accounts[this.state.wechatAccountIndex].on_count : 0,
					wechatStopQRcode: this.props.userInfo.content.wechat_accounts.length != 0 ? this.props.userInfo.content.wechat_accounts[this.state.wechatAccountIndex].off_count : 0,
					monthly_orders_count: this.props.userInfo.content.monthly_orders_count
				});
			}
		})
		.catch(err => {
			if (this.props.errorMsg && Object.getOwnPropertyNames(this.props.errorMsg).length != 0)
				this.setState({ message: this.props.errorMsg.data.message, isShowMsg: true });
		});
		// .finally(() => {
		// 	this.setState({ spinner: false });
		// });
	};
	
	onShiftWechatccount = vector => {
		// 正在顯示第一個，且還要向左移
		if (this.state.wechatAccountIndex == 0 && vector < 0)
			return;
		
		// 正在顯示最後一個，也還要向右移
		if (this.state.wechatAccountIndex == this.state.wechatAccounts.length - 1 && vector > 0)
			return;
		
		this.setState(
			{ wechatAccountIndex: this.state.wechatAccountIndex + vector },
			() => {
				this.setState({
					wechatAccountStatus: this.state.wechatAccounts[this.state.wechatAccountIndex].status,
					wechatUseQRcode: this.props.userInfo.content.wechat_accounts[this.state.wechatAccountIndex].on_count,
					wechatStopQRcode: this.props.userInfo.content.wechat_accounts[this.state.wechatAccountIndex].off_count,
				});
			}
		);
	}

	onLogout = () => {
		this.setState({ isShowLogoutMsg: false });
		this.props.userLogout(this.props.userData.content.auth_token)
		.then(res => {
			this.setState({ message: this.Lang.logoutSuccessMsg, isShowMsg: true, msgStatus: 1 });
		})
		.catch(err => {
			if (this.props.errorMsg && Object.getOwnPropertyNames(this.props.errorMsg).length != 0)
				this.setState({ message: this.props.errorMsg.data.message, isShowMsg: true, msgStatus: 1 });
		})
		.finally(() => {
			this.setState({ spinner: false });
		});
	}

	onChangeWechatAccountStatus = status => {
		this.setState({ spinner: true });
		const auth_token = this.props.userData && this.props.userData.content.auth_token;
		const acct_id = this.state.wechatAccounts[this.state.wechatAccountIndex].id;

		this.state.flagTimeout = setTimeout(() => {
			this.props.changeWixAccountStatus({ auth_token, status, acct_id })
			.finally(() => {
				this.onGetUserInfo();
				this.setState({ spinner: false });
			});
		}, 1500);
	}

	onCheckGrabOrderStatus = userInfo => {
		/**
		 * 確認是否可以進行搶單
		 * 1. 可用餘額是否大於100
		 * 2. 微信帳號是否正常
		 */
		const { valid_balance, wechatAccounts } = userInfo;
		let usedWinAccount = 0;
		return new Promise((resolve, reject) => {
			if (valid_balance < 100) {
				reject(this.Lang.balaceNotEnough);
			}
	
			if (wechatAccounts.length != 0) {
				wechatAccounts.map(item => {
					const { status } = item;
					if (status == "verified")
						usedWinAccount++;
				})
			}
			
			if (usedWinAccount == 0) {
				reject(this.Lang.noWechatAccount);
			}
			resolve();
		})
	}

	onMsgOK = () => {
		this.setState({ isShowMsg: false });
		if (this.state.msgStatus === 1) {
			this.setState(
				{ msgStatus: 0 },
				() => {
					Actions.login();
				}
			);
		}
	}

	onGOPreGrabordercheck = () => {
		const { valid_balance, wechatAccounts } = this.state;
		this.onCheckGrabOrderStatus({ valid_balance, wechatAccounts })
		.then(() => {
			Actions.pregrabordercheck();
		})
		.catch(errMsg => {
			this.setState({ message: errMsg, isShowMsg: true });
		})
	}

	onWechatAccountIcon = status => {
		/**
			* verifying: 驗證中
			* verified: 已驗證
			* suspended: 停用
			* failed: 驗證失敗
			*/
		const insideStyle = StyleSheet.create({
			wechatIconView: {
				width: "18%",
				height: "70%",
				backgroundColor: "white",
				borderRadius: 10,
				alignItems: "center",
				justifyContent: "center",
				marginRight: 10,
				backgroundColor: "#F7820D",
				elevation: 5,
				shadowColor: "#c6c6c6",
				shadowOpacity: 0.4,
				shadowRadius: 3,
				shadowOffset: {
					height: 5,
					width: 0
				},
			},
			wechatIconTxt: {
				marginBottom: 3,
				color: "white",
				fontSize: 14,
				fontWeight: "bold",
			}
		});
		return (
			status == "verified"
			?	<TouchableOpacity style={ insideStyle.wechatIconView } onPress={ () => this.onChangeWechatAccountStatus(false) }>
					<IconBlock
						name="check"
						size={25}
						color={"white"}
					/>
					<Text style={ insideStyle.wechatIconTxt }>{this.Lang.startup}</Text>
				</TouchableOpacity>
			: status == "suspended"
				?	<TouchableOpacity
						style={{ ...insideStyle.wechatIconView, backgroundColor: "#2D7BC3" }}
						onPress={ () => this.onChangeWechatAccountStatus(true) }
					>
						<IconBlock
							name="pause"
							size={20}
							color={"white"}
						/>
						<Text style={ insideStyle.wechatIconTxt }>{this.Lang.stop}</Text>
					</TouchableOpacity>
				: status == "verifying"
					? <TouchableOpacity style={{ ...insideStyle.wechatIconView, backgroundColor: "#BBBBBC" }}>
							<IconBlock
								name="clock-o"
								size={25}
								color={"white"}
							/>
							<Text style={ insideStyle.wechatIconTxt }>{this.Lang.review}</Text>
						</TouchableOpacity>
					: status == "failed"
						?	<TouchableOpacity style={{ ...insideStyle.wechatIconView, backgroundColor: "#EF4D1B" }}>
								<Text style={ insideStyle.wechatIconTxt }>{this.Lang.review}</Text>
								<Text style={{ ...insideStyle.wechatIconTxt, marginBottom: 0 }}>{this.Lang.fail}</Text>
							</TouchableOpacity>
						: null
		);
	}

  render() {
    return (
      <Card style={ homeStyle.container }>
				<Spinner visible={this.state.spinner} />
        <Message
          visible={this.state.isShowMsg}
          messageTxt={this.state.message}
          checkTxt="OK"
          onOK={ () => this.onMsgOK() }
        />
				<Confirm
					visible={this.state.isShowLogoutMsg}
					messageTxt={this.Lang.checkLogoutMsgTitle}
					cancelTxt={this.Lang.cancelMsg}
					checkTxt={this.Lang.logoutMsg}
					onCancel={() => this.setState({ isShowLogoutMsg: false })}
					onOK={() => this.onLogout()}
				/>
				<View style={ homeStyle.titleBar }>
					<TouchableOpacity onPress={ () => Actions.serviceCenter() }>
						<IconBlock
							name="comments-o"
							size={28}
							color={"#939394"}
						/>
					</TouchableOpacity>
					<Image source={ LOGO_TITLE } resizeMode="contain" />
					<TouchableOpacity onPress={ () => this.setState({ isShowLogoutMsg: true }) }>
						<IconBlock
							name="sign-out"
							size={30}
							color={"#939394"}
						/>
					</TouchableOpacity>
				</View>
				{/* 修改密碼，微信管理，交易流水 */}
				<View style={ homeStyle.section2 }>
					<View style={{ ...homeStyle.block, justifyContent: "space-around", height: "100%" }}>
						<TouchableOpacity
							style={ homeStyle.section2Link }
							onPress={ () => Actions.forgetPwd({ modifyPwdData: { account: this.props.userData.content.account, phone: this.props.userData.content.phone } }) }
						>
							<IconBlock
								name="pencil"
								size={Platform.OS === 'ios' ? 15 : 20}
								color={"#F7820D"}
							/>
							<Text style={ homeStyle.section2Txt }>{this.Lang.modifyPwd}</Text>
						</TouchableOpacity>
						<View style={{ borderWidth: 1, borderColor: "#E0E0E0", height: "60%" }} />
						<TouchableOpacity style={ homeStyle.section2Link } onPress={() => Actions.weChatAccount()}>
							<IconBlock
								name="weixin"
								size={Platform.OS === 'ios' ? 15 : 20}
								color={"#F7820D"}
							/>
							<Text style={ homeStyle.section2Txt }>{this.Lang.wechatManager}</Text>
						</TouchableOpacity>
						<View style={{ borderWidth: 1, borderColor: "#E0E0E0", height: "60%" }} />
						<TouchableOpacity style={ homeStyle.section2Link } onPress={ () => Actions.orders() }>
							<IconBlock
								name="search"
								size={Platform.OS === 'ios' ? 15 : 20}
								color={"#F7820D"}
							/>
							<Text style={ homeStyle.section2Txt }>{this.Lang.transactionRecord}</Text>
						</TouchableOpacity>
					</View>
				</View>
				{/* 使用者錢包資料 */}
				<View style={ homeStyle.section1 }>
					<View style={ homeStyle.block }>
						<View style={{ width: "45%", alignItems: "flex-start", justifyContent: "center", paddingLeft: 20 }}>
							<Text style={{ ...homeStyle.moneyTitle }}>{this.Lang.walletAmount}</Text>
							<Text
								style={{ ...homeStyle.moneyNum, marginBottom: 10, fontSize: this.state.moneyTxtLength > 5 ? 22 : 24 }}
							>{this.state.balance}</Text>
							<View style={{ flexDirection: "row", alignItems: "center" }}>
								<Text style={{ ...homeStyle.moneyTitle }}>{this.Lang.canUseAmount}</Text>
								{
									this.props.userInfo.content && this.props.userInfo.content.pending_buy_order
									?	<IconBlock
											name="clock-o"
											size={15}
											color={"#F7820D"}
										/>
									: null
								}
							</View>
							<Text
								style={{ ...homeStyle.moneyNum, color: "#F7820D", fontSize: this.state.moneyTxtLength > 5 ? 22 : 24 }}
							>{this.state.valid_balance}</Text>
						</View>
						<View style={{ width: "55%", position: "relative" }}>
							{/* <TouchableOpacity style={{ position: "absolute", right: 0, top: 0 }}>
								<IconBlock
									name="question-circle"
									size={30}
									color={"#939394"}
								/>
							</TouchableOpacity> */}
							<TouchableOpacity onPress={() => Actions.createBuyOrder()}>
								<Image source={ this.props.langCountry == "CN" ? BUY_BTN_CN : BUY_BTN_TW } resizeMode="contain" style={ homeStyle.buyImgBg } />
							</TouchableOpacity>
						</View>
					</View>
				</View>
				{/* 使用者微信帳號資料 */}
				<TouchableOpacity style={ homeStyle.section3 } onPress={ () => Actions.weChatAccount() }>
				{
					this.state.wechatAccounts == null
					?	null
					: this.state.wechatAccounts.length > 0
						?	<View style={{ ...homeStyle.block, justifyContent: "flex-start", height: "100%", paddingLeft: 10 }}>
								{this.onWechatAccountIcon(this.state.wechatAccountStatus)}
								<View style={ homeStyle.wechatInfoView }>
									<View>
										<Text style={{
											fontSize: this.state.wechatAccounts.length != 0
																? this.state.wechatAccounts[this.state.wechatAccountIndex].acct_name.split("").length >= 6
																	?	16
																	:	22
																:	22,
											fontWeight: "bold",
											color: "#02223F",
											width: "80%"
										}}>
											{this.state.wechatAccounts.length != 0 ? this.state.wechatAccounts[this.state.wechatAccountIndex].acct_name : ""}
										</Text>
									</View>
									<View style={{ flexDirection: "row", alignItems: "center" }}>
										<IconBlock
											style={{ padding: 0, marginRight: 5 }}
											textStyle={{ paddingTop: 0 }}
											name="qrcode"
											size={15}
											color="#707070"
										/>
										<Text style={{ fontSize: 13, fontWeight: "bold", color: "#F7820D" }}>
											{`${this.Lang.usedQRcode}\xa0${this.state.wechatUseQRcode}\xa0`}
										</Text>
									</View>
								</View>
								{
									this.state.wechatAccounts.length > 1
									?	<View style={{ flexDirection: "row", justifyContent: "space-around", width: "25%" }}>
											<TouchableOpacity style={{ paddingLeft: 10, paddingRight: 10 }} onPress={ () => this.onShiftWechatccount(-1) }>
												<IconBlock
													viewStyle={{ marginRight: 5 }}
													name="chevron-left"
													size={25}
													color={this.state.wechatAccountIndex == 0 ? "#939394" : "#02223F"}
												/>
											</TouchableOpacity>
											<TouchableOpacity style={{ paddingLeft: 10, paddingRight: 10 }} onPress={ () => this.onShiftWechatccount(1) }>
												<IconBlock
													name="chevron-right"
													size={25}
													color={this.state.wechatAccountIndex == this.state.wechatAccounts.length - 1 ? "#939394" : "#02223F"}
												/>
											</TouchableOpacity>
										</View>
									: null
								}
							</View>
						: <View style={{ ...homeStyle.block, justifyContent: "flex-start", height: "100%", paddingLeft: 10, position: "relative" }}>
								<IconBlock
									viewStyle={{ marginRight: 10 }}
									name="qrcode"
									size={50}
									color={"#EDEDED"}
								/>
								<View style={ homeStyle.wechatInfoView }>
									<Text style={{ fontSize: 14, color: "#707070", fontWeight: "bold" }}>{this.Lang.addWechatAccount}</Text>
								</View>
								<TouchableOpacity style={ homeStyle.addWechatView } onPress={ () => Actions.weChatAccount() }>
									<Text style={{ color: "white", fontSize: 18, fontWeight: "bold" }}>GO</Text>
								</TouchableOpacity>
							</View>
				}
				</TouchableOpacity>
				<View style={ homeStyle.section4 }>
					<TouchableOpacity onPress={ () => this.onGOPreGrabordercheck() }>
						<ImageBackground source={ GRAB_ORDER_BTN } resizeMode="contain" style={{ width: "100%", height: "100%" }}>
							<Text style={ homeStyle.redEnvelopeImgTxt }>{this.Lang.grabOrder}</Text>
						</ImageBackground>
					</TouchableOpacity>
				</View>
				<View style={ homeStyle.section5 }>
					<Text style={ homeStyle.transactionAmountTxt }>
						{this.Lang.monthlyOrdersCount}<Text>{this.state.monthly_orders_count}</Text>{this.Lang.amount}
					</Text>
				</View>
			</Card>
    );
  }
}

/*
  Home 的 css樣式
*/
const homeStyle = StyleSheet.create({
  linearGradient: {
    width: "100%",
    height: winHeight
  },
  container: {
    alignItems: "center",
    justifyContent: "flex-start",
		backgroundColor: "#F0F0F0",
		paddingTop: 10,
  },
  titleBar: {
    width: "100%",
    height: winHeight * 0.1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingLeft: 15,
		paddingRight: 15,
  },
  titleTxt: {
    color: "black",
    fontSize: 20,
    fontWeight: "bold"
  },
  section1: {
    width: "100%",
    height: winHeight * 0.2,
    paddingLeft: 15,
    paddingRight: 15,
		flexDirection: "row",
		marginBottom: 10,
  },
  section2: {
    width: "100%",
    height: winHeight * 0.08,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
		marginBottom: 10,
    paddingLeft: 15,
    paddingRight: 15,
  },
  section2Link: {
    flexDirection: "row",
		alignItems: "center",
		height: "100%",
  },
  section2Txt: {
    fontSize: 16,
    color: "#707070"
  },
  section3: {
    width: "100%",
    height: winHeight * 0.12,
    flexDirection: "row",
    alignItems: "center",
    paddingLeft: 15,
    paddingRight: 15
  },
  section4: {
    width: "100%",
		height: winHeight * 0.35,
  },
  section5: {
    width: "100%",
    alignItems: "center"
  },
  block: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
    elevation: 5,
    shadowColor: "#c6c6c6",
    shadowOpacity: 0.4,
    shadowRadius: 3,
    shadowOffset: {
      height: 5,
      width: 0
		},
		backgroundColor: "white",
		borderRadius: 10,
  },
  moneyNum: {
    fontSize: 24,
    fontWeight: "bold"
  },
  moneyTitle: {
    fontSize: 14,
    color: "#B5B5B6"
  },
  buyImgBg: {
    width: "100%",
    height: "100%",
    top: 15
  },
	buyImgTxt: {
		textAlign: "center",
    ...Platform.select({
      ios: {
        ...ifIphoneX({
					marginTop: "61%"
				}, {
					marginTop: "45%"
				}),
      },
      android: {
        marginTop: "41%",
      },
    }),
		color: "#9A4405",
		fontSize: 18,
		fontWeight: "bold",
		marginLeft: 7,
	},
	redEnvelopeImgTxt: {
		textAlign: "center",
		...ifIphoneX({
			marginTop: "46%"
		}, {
			marginTop: "36%"
		}),
		color: "white",
		fontSize: 24,
		fontWeight: "bold",
	},
	transactionAmountTxt: {
		fontSize: 16,
		fontWeight: "bold",
		color: "#F78815"
	},
	wechatInfoView: {
		flexDirection: "column",
		width: "50%",
		height: "70%",
		justifyContent: "space-around",
	},
	addWechatView: {
		width: "20%",
		height: "50%",
		backgroundColor: "#F7820D",
		alignItems: "center",
		justifyContent: "center",
		borderRadius: 50,
		position: "absolute",
		right: "5%",
	}
});

const mapStateToProps = ({ languageType, homeData, loginData }) => {
  const { langCountry } = languageType;
	const { userInfo, errorMsg, userLogout } = homeData;
  const { userData } = loginData;

  return { langCountry, userInfo, userData, errorMsg, userLogout };
};

export default connect(
  mapStateToProps,
  { getUserData, userLogout, changeWixAccountStatus }
)(Home);
