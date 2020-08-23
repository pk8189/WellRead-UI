import { request } from 'umi';
import { eraseCookie } from './cookies';

export interface LoginParamsType {
  username: string;
  password: string;
}

export async function tokenLogin(params: LoginParamsType) {
  return request <API.ApiRes<API.LoginStateType>> ('/api/token', {
    requestType: 'form',
    method: 'POST',
    data: params,
  });
}

export async function getFakeCaptcha(mobile: string) {
  return request(`/api/login/captcha?mobile=${mobile}`);
}

export async function outLogin() {
  await eraseCookie('authtoken')
}
