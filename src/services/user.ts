import { request } from 'umi';
import { getAuthHeader } from './endpoints'

export async function queryCurrent() {
  return request<API.CurrentUser>('/api/user/', {
    method: 'GET',
    headers: { ...getAuthHeader() },
  });
}

export async function queryNotices(): Promise<any> {
  return request<{ data: API.NoticeIconData[] }>('/mock/api/notices');
}
