import {
  PROFILE_ACCOUNTS_SUCCESS,
  PROFILE_ACCOUNTS_FAIL,
  PROFILE_ACCOUNTS_DELETE_FAIL,
  PROFILE_ACCOUNTS_UPDATE_FAIL
} from "../actions/types";

const INITIAL_STATE = {
  weChatContent: {},
  errorMsg: {}
};

export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case PROFILE_ACCOUNTS_SUCCESS:
      return { ...state, weChatContent: action.payload };
    case PROFILE_ACCOUNTS_FAIL:
      return { ...state, errorMsg: action.errMsg };
    case PROFILE_ACCOUNTS_UPDATE_FAIL:
      return { ...state, errorMsg: action.errMsg };
    case PROFILE_ACCOUNTS_DELETE_FAIL:
      return { ...state, errorMsg: action.errMsg };
    default:
      return state;
  }
};
