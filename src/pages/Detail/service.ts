import { request } from 'umi';
import { TableListParams, TableListItem, Recycle } from './data.d';


export async function queryTask(params?: TableListParams) {
  params.size = "-1";
  const res = await request('/api/task/getList', {
    params
  });
  const result = {}
  if (res) {
    result.data = res.result.records
    result.total = res.result.total
    result.current = res.result.current
    result.pageSize = res.result.size
  }
  return result;
}

export async function queryRule(params?: TableListParams) {
  params.size = params.pageSize;
  const res = await request('/api/assets/open/getAssets', {
    params
  });
  const result = {}
  if (res) {
    result.data = res.result.records
    result.total = res.result.total
    result.current = res.result.current
    result.pageSize = res.result.size
  }
  return result;
}

export async function recycleBinClean(params: string[]) {
  return request('/api/assets/delete', {
    method: 'DELETE',
    data: params,
  });
}

export async function revokeBinClean(params: string[]) {
  return request('/api/task/revokeTaskRecycleBin', {
    method: 'PUT',
    data: params,
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

export async function settingBinClean(params: Recycle) {
  return request('/api/task/updateRegularTaskClean', {
    method: 'PUT',
    data: {
      ...params
    },
  });
}

/**
 * 获取回收站清理周期
 */
export async function getRegularTaskClean() {
  return request('/api/task/getRegularTaskClean', {
    method: 'GET',
  });
}
