/*
 * Date : 2017/11/29
 * Writer : kevin
 */

/* Tools */
import { combineReducers } from "redux";

/* Reducers */
import LoginReducer from "./LoginReducer";
import LanguageReducer from "./LanguageReducer";
import RegisterReducer from "./RegisterReducer";
import VerifyPhoneReducer from "./VerifyPhoneReducer";
import ForgetPwdReducer from "./ForgetPwdReducer";
import HomeReducer from "./HomeReducer";
import SellOrdersReducer from "./SellOrdersReducer";
import BuyOrdersReducer from "./BuyOrdersReducer";
import CreateBuyOrderReducer from "./CreateBuyOrderReducer";
import GrabOrderReducer from "./GrabOrderReducer";
import WeChatAccountsReducer from "./WeChatAccountsReducer";
import QrcodesReducer from "./QrcodesReducer";
import AddWechatDataReducer from "./AddWechatDataReducer";

export default combineReducers({
  languageType: LanguageReducer,
  loginData: LoginReducer,
  registerData: RegisterReducer,
  verifyPhoneData: VerifyPhoneReducer,
  forgetPwdData: ForgetPwdReducer,
  homeData: HomeReducer,
  sellOrders: SellOrdersReducer,
  buyOrders: BuyOrdersReducer,
  createBuyOrder: CreateBuyOrderReducer,
  grabOrderData: GrabOrderReducer,
  weChatAccounts: WeChatAccountsReducer,
  qrcodes: QrcodesReducer,
  addWechatData: AddWechatDataReducer
});
