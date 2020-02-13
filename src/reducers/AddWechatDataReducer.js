
import {
	ADD_WECHAT_ACCOUNT_SUCCESS,
	ADD_WECHAT_ACCOUNT_FAIL,
  UPDATE_WECHAT_ACCOUNT_SUCCESS,
  UPDATE_WECHAT_ACCOUNT_FAIL,
  TRANSLATOR_WECHAT_QRCODE_SUCCESS,
  TRANSLATOR_QRCODE_FAIL,
  ADD_WECHAT_QRCODE_SUCCESS,
  ADD_QRCODE_FAIL,
  UPDATE_QRCODE_SUCCESS,
  UPDATE_QRCODE_FAIL
} from '../actions/types';

const INITIAL_STATE = {
	addAccountRlt: {},
	updateAccountRlt: {},
	translateQRcodeRlt: {},
	addQRcodeRlt: {},
	updateQRcodeRlt: {},
	errorMsg: {}
};

export default (state = INITIAL_STATE, action) => {
	switch (action.type) {
		case ADD_WECHAT_ACCOUNT_SUCCESS:
			return { ...state, addAccountRlt: action.addAccountRlt };
		case ADD_WECHAT_ACCOUNT_FAIL:
			return { ...state, errorMsg: action.errMsg };
		case UPDATE_WECHAT_ACCOUNT_SUCCESS:
			return { ...state, updateAccountRlt: action.updateAccountRlt };
		case UPDATE_WECHAT_ACCOUNT_FAIL:
			return { ...state, errorMsg: action.errMsg };
		case TRANSLATOR_WECHAT_QRCODE_SUCCESS:
			return { ...state, translateQRcodeRlt: action.translateQRcodeRlt };
		case TRANSLATOR_QRCODE_FAIL:
			return { ...state, errorMsg: action.errMsg };
		case ADD_WECHAT_QRCODE_SUCCESS:
			return { ...state, addQRcodeRlt: action.addQRcodeRlt };
		case ADD_QRCODE_FAIL:
			return { ...state, errorMsg: action.errMsg };
		case UPDATE_QRCODE_SUCCESS:
			return { ...state, updateQRcodeRlt: action.updateQRcodeRlt };
		case UPDATE_QRCODE_FAIL:
			return { ...state, errorMsg: action.errMsg };
		default:
			return state;
	}
}