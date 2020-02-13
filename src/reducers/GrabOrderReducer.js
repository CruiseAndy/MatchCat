
import {
  CHANGE_GRAB_ORDER_STATUS_SUCCESS,
  CHANGE_GRAB_ORDER_STATUS_FAIL,
  GRAB_ORDER_SUCCESS,
  GRAB_ORDER_FAIL,
  GRAB_ORDER_NO_RECIVE_PAY_SUCCESS,
  GRAB_ORDER_NO_RECIVE_PAY_FAIL,
  GRAB_ORDER_RECIVE_PAY_SUCCESS,
  GRAB_ORDER_RECIVE_PAY_FAIL
} from '../actions/types';

const INITIAL_STATE = {
	changeGrabOrderStatusRlt: {},
	grabOrderRlt: {},
	errorMsg: {},
	orderExpireRlt: {},
	orderConfirmRlt: {}
};

export default (state = INITIAL_STATE, action) => {
	switch (action.type) {
		case CHANGE_GRAB_ORDER_STATUS_SUCCESS:
			return { ...state, changeGrabOrderStatusRlt: action.changeGrabOrderStatusRlt };
		case CHANGE_GRAB_ORDER_STATUS_FAIL:
			return { ...state, errorMsg: action.errMsg };
		case GRAB_ORDER_SUCCESS:
			return { ...state, grabOrderRlt: action.grabOrderRlt };
		case GRAB_ORDER_FAIL:
			return { ...state, errorMsg: action.errMsg };
		case GRAB_ORDER_NO_RECIVE_PAY_SUCCESS:
			return { ...state, orderExpireRlt: action.orderExpireRlt };
		case GRAB_ORDER_NO_RECIVE_PAY_FAIL:
			return { ...state, errorMsg: action.errMsg };
		case GRAB_ORDER_RECIVE_PAY_SUCCESS:
			return { ...state, orderConfirmRlt: action.orderConfirmRlt };
		case GRAB_ORDER_RECIVE_PAY_FAIL:
			return { ...state, errorMsg: action.errMsg };
		default:
			return state;
	}
}