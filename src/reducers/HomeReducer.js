
import {
	GET_USER_DATA_SUCCESS,
	GET_USER_DATA_FAIL,
  LOGOUT_SUCCESS,
  LOGOUT_FAIL,
  CHANGE_WIX_ACCOUNT_STATUS_SUCCESS,
  CHANGE_WIX_ACCOUNT_STATUS_FAIL
} from '../actions/types';

const INITIAL_STATE = {
	userInfo: {},
	errorMsg: {},
	userLogout: {},
	wixAccountStatus: {}
};

export default (state = INITIAL_STATE, action) => {
	switch (action.type) {
		case GET_USER_DATA_SUCCESS:
			return { ...state, userInfo: action.userInfo };
		case GET_USER_DATA_FAIL:
			return { ...state, errorMsg: action.errMsg };
		case LOGOUT_SUCCESS:
			return { ...state, userLogout: action.userLogout };
		case LOGOUT_FAIL:
			return { ...state, errorMsg: action.errMsg };
		case CHANGE_WIX_ACCOUNT_STATUS_SUCCESS:
			return { ...state, wixAccountStatus: action.result };
		case CHANGE_WIX_ACCOUNT_STATUS_FAIL:
			return { ...state, errorMsg: action.errMsg };
		default:
			return state;
	}
}