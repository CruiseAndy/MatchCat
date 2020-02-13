import {
  BUY_ORDER_CREATE_SUCCESS,
  BUY_ORDER_CREATE_FAIL,
  BUY_ORDER_VERIFY_SUCCESS,
  BUY_ORDER_VERIFY_FAIL,
  BUY_ORDER_CANCEL_SUCCESS,
  BUY_ORDER_CANCEL_FAIL,
  BUY_ORDER_QUERY_EXIST_SUCCESS,
  BUY_ORDER_QUERY_EXIST_FAIL,
  BUY_ORDER_QUERY_CARDINFO_SUCCESS,
  BUY_ORDER_QUERY_CARDINFO_FAIL
} from "../actions/types";

const INITIAL_STATE = {
  info: {},
  errorMsg: {},
  orderStatus: {},
  existContent: {},
  existCardInfo: {}
};

export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case BUY_ORDER_CREATE_SUCCESS:
      return { ...state, info: action.payload };
    case BUY_ORDER_VERIFY_SUCCESS:
      return { ...state, orderStatus: action.payload };
    case BUY_ORDER_CANCEL_SUCCESS:
      return { ...state, orderStatus: action.payload };
    case BUY_ORDER_QUERY_EXIST_SUCCESS:
      return { ...state, existContent: action.payload };
    case BUY_ORDER_QUERY_CARDINFO_SUCCESS:
      return { ...state, existCardInfo: action.payload };
    case BUY_ORDER_CREATE_FAIL:
      return { ...state, errorMsg: action.errMsg };
    case BUY_ORDER_VERIFY_FAIL:
      return { ...state, errorMsg: action.errMsg };
    case BUY_ORDER_CANCEL_FAIL:
      return { ...state, errorMsg: action.errMsg };
    case BUY_ORDER_QUERY_EXIST_FAIL:
      return { ...state, errorMsg: action.errMsg };
    case BUY_ORDER_QUERY_CARDINFO_FAIL:
      return { ...state, errorMsg: action.errMsg };
    default:
      return state;
  }
};
