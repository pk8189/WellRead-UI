import { request } from 'umi';
import { getAuthHeader } from './endpoints'

export interface AddNoteParams {
  content: string;
  book_id: number;
  private: boolean;
}
export async function addNote(params: AddNoteParams) {
  return request<API.GoogleBooksQuery>(`/api/note/`, {
    method: 'POST',
    headers: { ...getAuthHeader() },
    data: params
  });
}

export async function deleteNote(id: number) {
  return request<API.CurrentUser>(`/api/note/${id}/`, {
    method: 'DELETE',
    headers: { ...getAuthHeader() },
  })
}
