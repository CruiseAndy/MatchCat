const DOMAINS = "https://p2p.feibaopay.com/api";
const TEST_DOMAINS = "https://p2p-dev.feibaopay.com/api";

/* Tools */
import axios from "axios";
export const axiosIns = axios.create({
  baseURL: DOMAINS,
  timeout: 5000
});

/**
 * @param non
 * @returns user data object
 */
export const API_GET_VERSION = `/version`;

/**
 * @param account
 * @param password
 * @returns user data object
 */
export const API_LOGIN = `/user/login`;

/**
 * @param account
 * @param password
 * @param password_confirmation
 * @param referral_code
 */
export const API_REGISTER = `/user/signup`;

/**
 * @param account
 */
export const API_CHECK_ACCOUNT = `/user/check_account`;

/**
 * @param account
 * @param phone
 * @param reset_password
 */
export const API_SEND_SMS = `/user/send_sms_token`;

/**
 * @param account
 * @param sms_token
 */
export const API_COMFIRM_USER_PHONE = `/user/confirm_user_phone`;

/**
 * @param account
 * @param sms_token
 * @param password
 * @param password_confirmation
 */
export const API_RESET_PASSWORD = `/user/reset_password`;

/**
 * @param auth_token
 */
export const API_USER_DATA = "/user";

/**
 * @param auth_token
 */
export const API_USER_LOGOUT = "/user/logout";

/**
 * @param auth_token
 * @param page
 * @param per_page
 * @param period_type
 * @param period_before
 * @returns user params object
 */
export const API_SELL_ORDERS = "/user/sell_orders";

/**
 * @param auth_token
 * @param period_type
 * @param period_before
 * @returns user params object
 */
export const API_SELL_ORDERS_SUMMARY = "/user/sell_orders/summary";

/**
 * @param auth_token
 * @param page
 * @param per_page
 * @param period_type
 * @param period_before
 * @returns user params object
 *
 * Request buy orders summary(GET)
 * URL: {API_BUY_ORDERS}/summary
 * @param auth_token
 * @param period_type
 * @param period_before
 * @returns user params object
 */
export const API_BUY_ORDERS = "/user/buy_orders";

/**
 * @param auth_token
 * @param amount
 * @returns user data object
 */
export const API_CREATE_BUY_ORDERS = "/user/buy_orders/create";

/**
 * @param auth_token
 * @param order_num
 * @returns user data object
 */
export const API_UPDATE_BUY_ORDERS = "/user/buy_orders";

/**
 * @param auth_token
 * @param status
 * @returns user data object
 */
export const API_CHANGE_GRAB_ORDER_STATUS = "/user/sell_orders/active";

/**
 * @param auth_token
 * @returns user data object
 */
export const API_GRAB_ORDER = "/user/sell_orders/matching";

/**
 * GET
 * @param auth_token
 * @returns user params object
 * PUT
 * @param auth_token
 * @param status (欲改變的狀態)
 * @param acct_id
 * @returns user data object
 * DELETE
 * @param auth_token
 * @param acct_id
 * @returns user data object
 *
 * Request Codes(GET)
 * URL: {API_PROFILE_ACCOUNTS}/{acct_id}/codes
 * @param auth_token
 * @param acct_id
 * @returns user params object
 * Request Codes(PUT)
 * URL: {API_PROFILE_ACCOUNTS}/{acct_id}/codes/{code_id}/status
 * @param auth_token
 * @param status (欲改變的狀態)
 * @param acct_id
 * @param code_id
 * @returns user data object
 * Request Codes(DELETE)
 * URL: {API_PROFILE_ACCOUNTS}/{acct_id}/codes/{code_id}
 * @param auth_token
 * @param acct_id
 * @param code_id
 * @returns user data object
 */
export const API_PROFILE_ACCOUNTS = "/user/profile/accounts";

/**
 * @param auth_token
 * @param payment_type
 * @param acct_name
 * @param name
 * @param account
 * @param nickname
 * @returns user data object
 */
export const API_ADD_WECHAT_ACCOUNT = "/user/profile/accounts/create";

/**
 * @param qr_image
 * @returns user data object
 */
export const API_QRCODE_TRANSLATOR = "/service/decode";
