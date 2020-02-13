/* Types */
import {
  PROFILE_ACCOUNTS_SUCCESS,
  PROFILE_ACCOUNTS_FAIL,
  PROFILE_ACCOUNTS_UPDATE_SUCCESS,
  PROFILE_ACCOUNTS_UPDATE_FAIL,
  PROFILE_ACCOUNTS_DELETE_SUCCESS,
  PROFILE_ACCOUNTS_DELETE_FAIL
} from "./types";
import { axiosIns, API_PROFILE_ACCOUNTS } from "./api";

export const requestProfileAccount = auth_token => {
  return dispatch => {
    return new Promise((resolve, reject) => {
      axiosIns({
        method: "get",
        url: API_PROFILE_ACCOUNTS,
        params: {
          auth_token
        }
      })
        .then(async response => {
          await dispatch(accountRequestSuccess(response));
          await resolve("OK");
        })
        .catch(async error => {
          await dispatch(accountRequestFail(error));
          await reject("ERROR");
        });
    });
  };
};

const accountRequestSuccess = resp => {
  return {
    type: PROFILE_ACCOUNTS_SUCCESS,
    payload: resp.data.content
  };
};

const accountRequestFail = err => {
  return {
    type: PROFILE_ACCOUNTS_FAIL,
    errMsg: err.response.data
  };
};
/**
 * 更新微信帳號狀態(停用／啟用)
 */
export const upDateAccountStatus = ({ auth_token, status, acct_id }) => {
  return dispatch => {
    return new Promise((resolve, reject) => {
      axiosIns({
        method: "put",
        url: `${API_PROFILE_ACCOUNTS}/${acct_id}/status`,
        data: {
          auth_token,
          status,
          acct_id
        }
      })
        .then(async response => {
          await resolve("OK");
        })
        .catch(async error => {
          await dispatch(accountUpdateFail(error));
          await reject("error");
        });
    });
  };
};

const accountUpdateFail = err => {
  return {
    type: PROFILE_ACCOUNTS_UPDATE_FAIL,
    errMsg: err.response.data
  };
};
/**
 * 刪除微信帳號(不分狀態)
 */
export const deleteAccount = ({ auth_token, acct_id }) => {
  return dispatch => {
    return new Promise((resolve, reject) => {
      axiosIns({
        method: "delete",
        url: `${API_PROFILE_ACCOUNTS}/${acct_id}`,
        data: {
          auth_token,
          acct_id
        }
      })
        .then(async response => {
          await resolve("OK");
        })
        .catch(async error => {
          await dispatch(accountDeleteFail(error));
          await reject("ERROR");
        });
    });
  };
};

const accountDeleteFail = err => {
  return {
    type: PROFILE_ACCOUNTS_DELETE_FAIL,
    errMsg: err.response.data
  };
};
