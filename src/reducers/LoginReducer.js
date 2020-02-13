
import { LOGIN_SUCCESS, LOGIN_FAIL, GET_VERSION_SUCCESS, GET_VERSION_FAIL } from '../actions/types';

const INITIAL_STATE = {
	version: {},
	userData : {},
	errorMsg: {}
};

export default (state = INITIAL_STATE, action) => {
	switch (action.type) {
		case GET_VERSION_SUCCESS:
			return { ...state, version: action.version };
		case GET_VERSION_FAIL:
			return { ...state, errorMsg: action.errMsg };
		case LOGIN_SUCCESS:
			return { ...state, userData: action.userData };
		case LOGIN_FAIL:
			return { ...state, errorMsg: action.errMsg };
		default:
			return state;
	}
}