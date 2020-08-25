import { request } from 'umi';
import { getAuthHeader } from './endpoints'

export async function queryGoogleBooks(query: String) {
  const queryString = query.replace(/\s+/g,"+")
  return request<API.GoogleBooksQuery>(`/api/book/google_books/q=${queryString}`, {
    method: 'GET',
    headers: { ...getAuthHeader() },
  });
}