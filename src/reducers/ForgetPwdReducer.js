
import { RESET_PWD_SUCCESS, RESET_PWD_FAIL } from '../actions/types';

const INITIAL_STATE = {
	resetPwdRlt : {},
	errorMsg: {}
};

export default (state = INITIAL_STATE, action) => {
	switch (action.type) {
		case RESET_PWD_SUCCESS:
			return { ...state, resetPwdRlt: action.resetPwdRlt };
		case RESET_PWD_FAIL:
			return { ...state, errorMsg: action.errMsg };
		default:
			return state;
	}
}