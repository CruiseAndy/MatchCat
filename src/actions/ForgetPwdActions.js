/* Types */
import { RESET_PWD_SUCCESS, RESET_PWD_FAIL } from './types';
import { axiosIns, API_RESET_PASSWORD } from './api';

export const userResetPwd = data => {
  return dispatch => {
    return new Promise((resolve, reject) => {
      axiosIns({
        method: 'post',
        url: API_RESET_PASSWORD,
        data
      })
      .then( async response => {
        await dispatch(resetPwdSuccess(response));
        await resolve("OK");
      })
      .catch(async error => {
        await dispatch(resetPwdFail(error));
        await reject("ERROR");
      });
    });
  };
};

const resetPwdSuccess = resp => {
  return {
    type: RESET_PWD_SUCCESS,
    resetPwdRlt: resp.data
  }
}

const resetPwdFail = err => {
  return {
    type: RESET_PWD_FAIL,
    errMsg: err.response
  };
}