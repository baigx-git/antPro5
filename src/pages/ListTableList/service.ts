import { request } from 'umi';
import { TableListParams, TableListItem, Recycle } from './data.d';

export async function queryRule(params?: TableListParams) {
  params.size = params.pageSize;
  const res = await request('/api/assets/getInRecycleBin', {
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
  return request('/api/assets/recycleBinClean', {
    method: 'DELETE',
    data: params,
  });
}

export async function revokeBinClean(params: string[]) {
  return request('/api/assets/revokeAssetsRecycleBin', {
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
  return request('/api/assets/updateRegularAssetsClean', {
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
  return request('/api/assets/getRegularAssetsClean', {
    method: 'GET',
  });
}
