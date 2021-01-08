import {request} from 'umi';
import {TableListParams, TableListItem, UpLoadParams,PasswordParams} from './data.d';

export async function queryRule(params?: TableListParams) {
  params.size = params.pageSize;
  const res = await request('/api/task/getList', {
    params
  });
  const result = {data:[],total:0,current:1,pageSize:10}
  if (res && !res.error) {
    result.data = res.result.records
    result.total = res.result.total
    result.current = res.result.current
    result.pageSize = res.result.size
  }
  return result;
}

export async function removeRule(params: string[]) {
  return request('/api/task/delete', {
    method: 'DELETE',
    data:params,
  });
}

export async function createTaskController(params: UpLoadParams) {
  return request('/api/task/create', {
    method: 'POST',
    data: {
      ...params
    },
  });
}

export function downloadExcelFile(id: string) {
  const options = {
    headers: {
      'Authorization': sessionStorage.getItem('Authorization'),
      'content-type': "application/json;charset=UTF-8"
    },
    responseType: 'blob',
    getResponse: true
  };
  return request(`/api/task/fileDownload/${id}`, options);
}


/**
 *  获取业务类型
 * @param params
 */
export async function getBusiness() {
  return request('/api/business/getBusiness', {
    method: 'GET',
  });
}

export async function addRule(params: TableListItem) {
  return request('/api/rule', {
    method: 'POST',
    data: {
      ...params,
      method: 'post',
    },
  });
}

export async function updateRule(params: TableListParams) {
  return request('/api/rule', {
    method: 'POST',
    data: {
      ...params,
      method: 'update',
    },
  });
}

export async function resetPassword(params: PasswordParams) {
  return request('/api/task/taskRestPassword?password='+params.password, {
    method: 'put',
    data: params.ids,
  });
}
