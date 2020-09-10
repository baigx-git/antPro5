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
  type?: string;
  createdTime?:string[];
  start?:string;
  end?:string;
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
