import { request } from 'umi';
import { getAuthHeader } from './endpoints'

export async function queryGoogleBooks(query: String) {
  const queryString = query.replace(/\s+/g,"+")
  return request<API.GoogleBooksQuery>(`/api/book/google_books/q=${queryString}`, {
    method: 'GET',
    headers: { ...getAuthHeader() },
  });
}

export interface AddBookParams {
  google_books_id: string;
  google_books_self_link: string;
}
export async function addBook(params: AddBookParams) {
  return request<API.GoogleBooksQuery>(`/api/book/`, {
    method: 'POST',
    headers: { ...getAuthHeader() },
    data: params
  });
}

export async function removeBook(bookId: string) {
  return request<API.CurrentUser>(`/api/user/book/${bookId}/remove/`, {
    method: 'PUT',
    headers: { ...getAuthHeader() },
  })
}

export async function getGoogleBook(id: Number) {
  return request<API.GoogleBookRes>(`/api/book/${id}/google_book/`, {
    method: 'GET',
    headers: { ...getAuthHeader() },
  });
}
