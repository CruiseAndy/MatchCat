import {
  REQUEST_CODES_SUCCESS,
  REQUEST_CODES__FAIL,
  UPDATE_CODES_SUCCESS,
  UPDATE_CODES_FAIL,
  DELETE_CODES_SUCCESS,
  DELETE_CODES_FAIL,
  SINGLE_PROFILE_ACCOUNTS_SUCCESS,
  SINGLE_PROFILE_ACCOUNTS_FAIL
} from "../actions/types";

const INITIAL_STATE = {
  CodesContent: {},
  singleAccount: {},
  errorMsg: {}
};

export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case REQUEST_CODES_SUCCESS:
      return { ...state, CodesContent: action.payload };
    case SINGLE_PROFILE_ACCOUNTS_SUCCESS:
      return { ...state, singleAccount: action.payload };
    case REQUEST_CODES__FAIL:
      return { ...state, errorMsg: action.errMsg };
    case UPDATE_CODES_FAIL:
      return { ...state, errorMsg: action.errMsg };
    case DELETE_CODES_FAIL:
      return { ...state, errorMsg: action.errMsg };
    case SINGLE_PROFILE_ACCOUNTS_FAIL:
      return { ...state, errorMsg: action.errMsg };
    default:
      return state;
  }
};
