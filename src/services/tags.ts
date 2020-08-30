import { request } from 'umi';
import { getAuthHeader } from './endpoints'

export interface CreateTagParams {
  name: string;
}
export async function createTag(params: CreateTagParams) {
  return request<API.GoogleBooksQuery>(`/api/tag/`, {
    method: 'POST',
    headers: { ...getAuthHeader() },
    data: params
  });
}