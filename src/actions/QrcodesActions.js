/* Types */
import {
  REQUEST_CODES_SUCCESS,
  REQUEST_CODES__FAIL,
  UPDATE_CODES_SUCCESS,
  UPDATE_CODES_FAIL,
  DELETE_CODES_SUCCESS,
  DELETE_CODES_FAIL,
  SINGLE_PROFILE_ACCOUNTS_SUCCESS,
  SINGLE_PROFILE_ACCOUNTS_FAIL
} from "./types";
import { axiosIns, API_PROFILE_ACCOUNTS } from "./api";

export const singleProfileAccount = ({ auth_token, acct_id }) => {
  return dispatch => {
    return new Promise((resolve, reject) => {
      axiosIns({
        method: "get",
        url: `${API_PROFILE_ACCOUNTS}/${acct_id}`,
        params: {
          auth_token,
          acct_id
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
    type: SINGLE_PROFILE_ACCOUNTS_SUCCESS,
    payload: resp.data.content
  };
};

const accountRequestFail = err => {
  return {
    type: SINGLE_PROFILE_ACCOUNTS_FAIL,
    errMsg: err.response.data
  };
};
export const requestCodes = ({ auth_token, acct_id }) => {
  return dispatch => {
    return new Promise((resolve, reject) => {
      axiosIns({
        method: "get",
        url: `${API_PROFILE_ACCOUNTS}/${acct_id}/codes`,
        params: {
          auth_token,
          acct_id
        }
      })
        .then(async response => {
          await dispatch(codesRequestSuccess(response));
          await resolve("OK");
        })
        .catch(async error => {
          await dispatch(codesRequestFail(error));
          await reject("ERROR");
        });
    });
  };
};

const codesRequestSuccess = resp => {
  return {
    type: REQUEST_CODES_SUCCESS,
    payload: resp.data.content
  };
};

const codesRequestFail = err => {
  return {
    type: REQUEST_CODES__FAIL,
    errMsg: err.response.data
  };
};

/**
 * 更新QR Code狀態(停用／啟用)
 */
export const upDateCodesStatus = ({ auth_token, status, acct_id, code_id }) => {
  return dispatch => {
    return new Promise((resolve, reject) => {
      axiosIns({
        method: "put",
        url: `${API_PROFILE_ACCOUNTS}/${acct_id}/codes/${code_id}/status`,
        data: {
          auth_token,
          status,
          acct_id,
          code_id
        }
      })
        .then(async response => {
          await resolve("OK");
        })
        .catch(async error => {
          await dispatch(codesUpdateFail(error));
          await reject("error");
        });
    });
  };
};

const codesUpdateFail = err => {
  return {
    type: UPDATE_CODES_FAIL,
    errMsg: err.response.data
  };
};
/**
 * 刪除QR Code(不分狀態)
 */
export const deleteCodes = ({ auth_token, acct_id, code_id }) => {
  return dispatch => {
    return new Promise((resolve, reject) => {
      axiosIns({
        method: "delete",
        url: `${API_PROFILE_ACCOUNTS}/${acct_id}/codes/${code_id}`,
        data: {
          auth_token,
          acct_id,
          code_id
        }
      })
        .then(async response => {
          await resolve("OK");
        })
        .catch(async error => {
          await dispatch(codesDeleteFail(error));
          await reject("ERROR");
        });
    });
  };
};

const codesDeleteFail = err => {
  return {
    type: DELETE_CODES_FAIL,
    errMsg: err.response.data
  };
};
