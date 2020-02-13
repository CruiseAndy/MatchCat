import {
  BUY_ORDER_QUERY_SUCCESS,
  BUY_ORDER_QUERY_FAIL,
  BUY_SUMMARY_QUERY_SUCCESS,
  BUY_SUMMARY_QUERY_FAIL,
  BUY_ORDER_VERIFY_SUCCESS,
  BUY_ORDER_VERIFY_FAIL,
  BUY_ORDER_CANCEL_SUCCESS,
  BUY_ORDER_CANCEL_FAIL,
  BUY_ORDER_QUERY_CARDINFO_SUCCESS,
  BUY_ORDER_QUERY_CARDINFO_FAIL
} from "../actions/types";

const INITIAL_STATE = {
  transferInfo: {},
  ordersInfo: {},
  summaryInfo: {},
  errorMsg: {},
  orderStatus: {}
};

export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case BUY_ORDER_QUERY_SUCCESS:
      return { ...state, ordersInfo: action.payload };
    case BUY_SUMMARY_QUERY_SUCCESS:
      return { ...state, summaryInfo: action.payload };
    case BUY_ORDER_VERIFY_SUCCESS:
      return { ...state, orderStatus: action.payload };
    case BUY_ORDER_CANCEL_SUCCESS:
      return { ...state, orderStatus: action.payload };
    case BUY_ORDER_QUERY_CARDINFO_SUCCESS:
      return { ...state, transferInfo: action.payload };
    case BUY_ORDER_QUERY_CARDINFO_FAIL:
      return { ...state, errorMsg: action.errMsg };
    case BUY_SUMMARY_QUERY_FAIL:
      return { ...state, errorMsg: action.errMsg };
    case BUY_ORDER_QUERY_FAIL:
      return { ...state, errorMsg: action.errMsg };
    case BUY_ORDER_VERIFY_FAIL:
      return { ...state, errorMsg: action.errMsg };
    case BUY_ORDER_CANCEL_FAIL:
      return { ...state, errorMsg: action.errMsg };
    default:
      return state;
  }
};
