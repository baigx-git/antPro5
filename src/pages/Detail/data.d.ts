export interface TableListItem {
  id: string;
  name: string;
  number: string;
  password: string;
  type: string;
  taskFileId: string;
  remark?: any;
  status: boolean;
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
  currentPage?: number;
  filter?: { [key: string]: any[] };
  sorter?: { [key: string]: any };
  cycleDay?:number;
}

export interface Recycle {
  id?:string|undefined;
  cycleDay?:number;
}

export interface RecycleData {
  recycle?:Recycle
}

export interface SelectData {
  data?:any[],
  fetching:boolean,
  value?:any
}
