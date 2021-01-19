import { request } from 'umi';
import { TableListParams, TableListItem, UpLoadParams } from './data.d';

export async function queryRule(params?: TableListParams) {
  debugger
  params.size=params.pageSize;
  params.start=params.createdTime?params.createdTime[0]:undefined
  params.end=params.createdTime?params.createdTime[1]:undefined
  const res = await request('/api/taskLog/getTaskLogInfos', {
    params
  });
  const result = {}
  if(res){
    result.data = res.result.records
    result.total = res.result.total
    result.current = res.result.current
    result.pageSize = res.result.size
  }
  return result;
}

export async function removeRule(params: { ids: number[] }) {
  return request('/api/task/delete', {
    method: 'DELETE',
    data: {
      ...params
    },
  });
}

export async function upLoadFile(params: UpLoadParams) {
  console.log(params)
  // return request('/api/rule', {
  //   method: 'POST',
  //   data: {
  //     ...params
  //   },
  // });
}

export  function downloadExcelFile(id:string) {
  const options = {
    headers: {
      'Authorization': localStorage.getItem('Authorization'),
      'content-type': "application/json;charset=UTF-8"
    },
    responseType : 'blob',
  };
  return request(`/api/task/fileDownload/${id}`,options);
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
