
/* Types */
import {
  GET_USER_DATA_SUCCESS,
  GET_USER_DATA_FAIL,
  LOGOUT_SUCCESS,
  LOGOUT_FAIL,
  CHANGE_WIX_ACCOUNT_STATUS_SUCCESS,
  CHANGE_WIX_ACCOUNT_STATUS_FAIL
} from './types';
import {
  axiosIns,
  API_USER_DATA,
  API_USER_LOGOUT,
  API_PROFILE_ACCOUNTS
} from './api';

export const getUserData = auth_token => {
  return dispatch => {
    return new Promise((resolve, reject) => {
      axiosIns.get(API_USER_DATA, {
        params: { auth_token }
      })
      .then( async response => {
        await dispatch(getUserDataSuccess(response));
        await resolve("OK");
      }).catch( async error => {
        await dispatch(getUserDataFail(error));
        await reject("ERROR");
      });  
    })
  }
}

const getUserDataSuccess = resp => {
  return {
    type: GET_USER_DATA_SUCCESS,
    userInfo: resp.data
  }
}

const getUserDataFail = err => {
  return {
    type: GET_USER_DATA_FAIL,
    errMsg: err.response
  }
}

export const userLogout = auth_token => {
  return dispatch => {
    return new Promise((resolve, reject) => {
      axiosIns({
        method: 'post',
        url: API_USER_LOGOUT,
        data: { auth_token }
      })
      .then( async response => {
        await dispatch(userLogoutSuccess(response));
        await resolve("OK");
      }).catch( async error => {
        await dispatch(userLogoutFail(error));
        await reject("ERROR");
      });  
    })
  }
}

const userLogoutSuccess = resp => {
  return {
    type: LOGOUT_SUCCESS,
    userLogout: resp.data
  }
}

const userLogoutFail = err => {
  return {
    type: LOGOUT_FAIL,
    errMsg: err.response
  }
}

/**
 * true is "verified", false is "suspended"
 */
export const changeWixAccountStatus = ({ auth_token, status, acct_id }) => {
  return dispatch => {
    return new Promise((resolve, reject) => {
      axiosIns({
        method: 'put',
        url: `${API_PROFILE_ACCOUNTS}/${acct_id}/status`,
        data: { auth_token, status }
      })
      .then( async response => {
        await dispatch(changeWixAccountStatusSuccess(response));
        await resolve("OK");
      }).catch( async error => {
        await dispatch(changeWixAccountStatusFail(error));
        await reject("ERROR");
      }); 
    })
  }
}

const changeWixAccountStatusSuccess = resp => {
  return {
    type: CHANGE_WIX_ACCOUNT_STATUS_SUCCESS,
    result: resp.data
  }
}

const changeWixAccountStatusFail = err => {
  return {
    type: CHANGE_WIX_ACCOUNT_STATUS_FAIL,
    errMsg: err.response
  }
}