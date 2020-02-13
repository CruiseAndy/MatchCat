import {
  SELL_ORDER_QUERY_SUCCESS,
  SELL_ORDER_QUERY_FAIL,
  SELL_SUMMARY_QUERY_SUCCESS,
  SELL_SUMMARY_QUERY_FAIL,
  SELL_WECHAT_ACCOUNT_QUERY_SUCCESS,
  SELL_WECHAT_ACCOUNT_QUERY_FAIL
} from "../actions/types";

const INITIAL_STATE = {
  ordersInfo: {},
  summaryInfo: {},
  errorMsg: {},
  weChatAccount: {}
};

export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case SELL_ORDER_QUERY_SUCCESS:
      return { ...state, ordersInfo: action.payload };
    case SELL_ORDER_QUERY_FAIL:
      return { ...state, errorMsg: action.errMsg };
    case SELL_SUMMARY_QUERY_SUCCESS:
      return { ...state, summaryInfo: action.payload };
    case SELL_WECHAT_ACCOUNT_QUERY_SUCCESS:
      return { ...state, weChatAccount: action.payload };
    case SELL_SUMMARY_QUERY_FAIL:
      return { ...state, errorMsg: action.errMsg };
    case SELL_WECHAT_ACCOUNT_QUERY_FAIL:
      return { ...state, errorMsg: action.errMsg };
    default:
      return state;
  }
};
