declare namespace API {

  export interface CurrentUser {
    id: number;
    full_name: string;
    email: string;
    books?: {
      id: string;
      book_title: string;
      author_name: string;
    }[];
  }

  export interface LoginStateType {
    access_token?: string;
    token_type?: 'bearer';
  }

  export interface ErrorType {
    detail?: string;
  }

  export type ApiRes<T> = Result<T, ErrorType>

  export interface NoticeIconData {
    id: string;
    key: string;
    avatar: string;
    title: string;
    datetime: string;
    type: string;
    read?: boolean;
    description: string;
    clickClose?: boolean;
    extra: any;
    status: string;
  }
}
