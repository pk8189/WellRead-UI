declare namespace API {

  export interface CurrentUser {
    id: number;
    full_name: string;
    email: string;
    books: {
      id: number;
      google_books_id: string;
      google_books_self_link: string;
    }[];
    notes: {
      id: number;
      create_date: string;
      content: string;
      private: boolean;
      archived: boolean;
      user_id: number;
      book_id: number;
    }[];
  }

  export interface BookRes {
    id: Number;
    google_books_id: String;
    google_books_self_link: String;
    tags: Array;
    clubs: Array;
    users: Array;
    notes: Array;
    club_tags: Array;
  }

  export interface GoogleBookRes {
    kind: String;
    id: String;
    etag: String;
    selfLink: String;
    volumeInfo: Object;
  }

  export interface GoogleBooksQuery {
    volumes:[]
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
