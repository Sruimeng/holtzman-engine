export enum Storage {
  UID = 't_uid',
}

export enum CommonStorage {
  Signup = 't_signup',
  Login = 't_login',
  UserDetail = 't_user_detail',
  EuCookie = 't.cookieAccept',
  Comment = 't_comment',
}

export const STORAGE_KEYS = {
  THEME: 'app_theme',
  LOCALE: 'app_locale',
} as const;
