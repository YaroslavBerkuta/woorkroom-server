export enum EMessageRmqp {
  CREATE_USER = 'create_user',
  FIND_USER_BY_ID = 'find_user_by_id',
  UPDATE_USER = 'update_user',
  FIND_USER_BY_EMAIL = 'find_user_by_email',
  DELETE_USER_BY_ID = 'delete_user_by_id',

  CREATE_EMPLOYEE = 'create_employee',
  UPDATE_EMPLOYEE = 'update_employee',
  DELETE_EMPLOYEE = 'delete_employee',

  CREATE_COMPANY = 'create_company',
  UPDATE_COMPANY = 'update_company',
  DELETE_COMPANY = 'delete_company',
  FIND_COMPANY_BY_ID = 'find_company_by_id',
  GET_MY_COMPANYS = 'get_my_companys',

  LOGIN = 'login',
  REGISTER = 'register',
  LOGOUT = 'logout',
  GET_SESSION = 'get_session',
  GET_USER_SESSIONS = 'get_user_sessions',

  SEND_VERIFICATION_CODE = 'send_verification_code',
}
