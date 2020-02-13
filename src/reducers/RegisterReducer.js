
import {
  REGISTER_SUCCESS,
  REGISTER_FAIL,
  CHECK_ACCOUNT_SUCCESS,
  CHECK_ACCOUNT_FAIL
} from '../actions/types';

const INITIAL_STATE = {
  accountValid: {},
  registerRlt: {},
	errorMsg: {}
};

export default (state = INITIAL_STATE, action) => {
	switch (action.type) {
		case CHECK_ACCOUNT_SUCCESS:
			return { ...state, accountValid: action.result };
    case CHECK_ACCOUNT_FAIL:
      return { ...state, errorMsg: action.errMsg };
    case REGISTER_SUCCESS:
      return { ...state, registerRlt: action.result };
    case REGISTER_FAIL:
      return { ...state, errorMsg: action.errMsg };
		default:
			return state;
	}
}