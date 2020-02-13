
import {
  GET_VERIFY_CODE_SUCCESS,
  GET_VERIFY_CODE_FAIL,
  VERIFY_PHONE_SUCCESS,
  VERIFY_PHONE_FAIL
} from '../actions/types';

const INITIAL_STATE = {
  verifyCodeRlt: {},
  verifyPhoneRlt: {},
  errMsg: {}
};

export default (state = INITIAL_STATE, action) => {
	switch (action.type) {
		case GET_VERIFY_CODE_SUCCESS:
			return { ...state, verifyCodeRlt: action.result, verifyPhoneRlt: {} };
    case GET_VERIFY_CODE_FAIL:
      return { ...state, errorMsg: action.errMsg, verifyPhoneRlt: {} };
    case VERIFY_PHONE_SUCCESS:
      return { ...state, verifyPhoneRlt: action.result, verifyCodeRlt: {} };
    case VERIFY_PHONE_FAIL:
      return { ...state, errorMsg: action.errMsg, verifyCodeRlt: {} };
		default:
			return state;
	}
}