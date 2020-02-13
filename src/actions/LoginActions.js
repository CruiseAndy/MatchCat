
/* Types */
import { LOGIN_SUCCESS, LOGIN_FAIL, GET_VERSION_SUCCESS, GET_VERSION_FAIL } from './types';
import { axiosIns, API_LOGIN, API_GET_VERSION } from './api';

export const getVersion = () => {
  return dispatch => {
    return new Promise((resolve, reject) => {
      axiosIns.get(API_GET_VERSION)
        .then( async response => {
          await dispatch(getVersionSuccess(response));
          await resolve("OK");
        })
        .catch(async error => {
          await dispatch(getVersionFail(error));
          await reject("ERROR");
        });
    });
  };
};

const getVersionSuccess = resp => {
  return {
    type: GET_VERSION_SUCCESS,
    version: resp.data
  }
}

const getVersionFail = err => {
  return {
    type: GET_VERSION_FAIL,
    errMsg: err.response
  };
}

export const userLogin = (account, password) => {
  return dispatch => {
    return new Promise((resolve, reject) => {
      axiosIns({
        method: 'post',
        url: API_LOGIN,
        data: { account, password }
      })
        .then( async response => {
          await dispatch(userLoginSuccess(response));
          await resolve("OK");
        })
        .catch(async error => {
          await dispatch(userLoginFail(error));
          await reject("ERROR");
        });
    });
  };
};

const userLoginSuccess = resp => {
  return {
    type: LOGIN_SUCCESS,
    userData: resp.data
  }
}

const userLoginFail = err => {
  return {
    type: LOGIN_FAIL,
    errMsg: err.response
  };
}