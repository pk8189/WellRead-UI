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

export interface UpdateNoteParams {
  content: string;
  book_id?: number;
  private?: boolean;
}
export async function updateNote(params: UpdateNoteParams, noteId: number,) {
  return request<API.Note>(`/api/note/${noteId}/`, {
    method: 'PUT',
    headers: { ...getAuthHeader() },
    data: params
  });
}

export interface TagNoteParams {
  tags: Array<number>,
  clubTags: Array<number>
}
export async function tagNote(params: TagNoteParams, noteId: number,) {
  return request<API.Note>(`/api/note/${noteId}/tag/add/`, {
    method: 'PUT',
    headers: { ...getAuthHeader() },
    data: params
  });
}

export interface RemoveTagNoteParams {
  tags: Array<number>,
  clubTags: Array<number>
}
export async function removeTagNote(params: RemoveTagNoteParams, noteId: number,) {
  return request<API.Note>(`/api/note/${noteId}/tag/remove/`, {
    method: 'PUT',
    headers: { ...getAuthHeader() },
    data: params
  });
}

