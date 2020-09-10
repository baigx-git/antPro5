import ex = require("umi/dist");

declare namespace API {
  export interface CurrentUser {
    avatar?: string;
    username?: string;
    title?: string;
    group?: string;
    signature?: string;
    tags?: {
      key: string;
      label: string;
    }[];
    id?: string;
    access?: 'user' | 'guest' | 'admin';
    unreadCount?: number;
    authorities?:any[];
  }

  export interface Reslut {
    error?:{
      errCode?:string
      errMsg?:string
    },
    result?:any
  }

  export interface LoginStateType {
    status?: 'ok' | 'error';
    type?: string;
  }

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
