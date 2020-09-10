export interface TableListItem {
  id: string;
  name: string;
  number: string;
  password: string;
  type: string;
  taskFileId: string;
  remark?: any;
  status?: boolean;
  valid: boolean;
  deleted: boolean;
  revision: number;
  createdBy: string;
  createdTime: string;
  updatedBy: string;
  updatedTime: string;
}

export interface TableListPagination {
  total: number;
  pageSize: number;
  current: number;
}

export interface TableListData {
  list: TableListItem[];
  pagination: Partial<TableListPagination>;
}

export interface TableListParams {
  status?: string;
  name?: string;
  desc?: string;
  key?: number;
  pageSize?: number;
  size?: number;
  currentPage?: number;
  filter?: { [key: string]: any[] };
  sorter?: { [key: string]: any };
}

export interface UpLoadParams {
  type?: string;
  name?: string;
  password?: string;
  bz?: string;
  fileId?: string;
}

/*
 * 类型数据
 */
export interface BusinessType {
  id: string;
  code:string;
  name:string
}

export interface TaskData {
  business?:BusinessType[]
}

export interface PasswordParams {
  ids:string[];
  password:string
}
