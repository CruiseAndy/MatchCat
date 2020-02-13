/* Types */
import { 
  REGISTER_SUCCESS,
  REGISTER_FAIL,
  CHECK_ACCOUNT_SUCCESS,
  CHECK_ACCOUNT_FAIL,
  LOGIN_SUCCESS
} from './types';
import { axiosIns, API_REGISTER, API_CHECK_ACCOUNT } from './api';

/* Tools */
import axios from 'axios';

/************************************* check accout valid *************************************/
export const checkAccount = account => {
  return dispatch => {
    return new Promise((resolve, reject) => {
      axiosIns.get(API_CHECK_ACCOUNT, {
        params: { account }
      })
      .then( async response => {
        await dispatch(accountCheckSuccess(response));
        await resolve("OK");
      })
      .catch(async error => {
        await dispatch(accountCheckFail(error));
        await reject("ERROR");
      });
    });
  };
}

const accountCheckSuccess = resp => {
  return {
    type: CHECK_ACCOUNT_SUCCESS,
    result: resp.data
  }
}

const accountCheckFail = err => {
  return {
    type: CHECK_ACCOUNT_FAIL,
    errMsg: err.response
  };
}

/************************************* register account *************************************/
export const userRegister = data => {
  return dispatch => {
    return new Promise((resolve, reject) => {
      axiosIns({
        method: 'post',
        url: API_REGISTER,
        data
      })
      .then( async response => {
        await dispatch(userRegisterSuccess(response));
        await dispatch(storeToken(response));
        await resolve("OK");
      })
      .catch(async error => {
        await dispatch(userRegisterFail(error));
        await reject("ERROR");
      });
    });
  };
};

const userRegisterSuccess = resp => {
  return {
    type: REGISTER_SUCCESS,
    result: resp.data
  }
}

const userRegisterFail = err => {
  return {
    type: REGISTER_FAIL,
    errMsg: err.response
  };
}

const storeToken = resp => {
  return {
    type: LOGIN_SUCCESS,
    userData: resp.data
  };
}