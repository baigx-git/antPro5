import {request} from "umi";

export async  function getUserList(params:any) {

  const res = await request('/api/authentication/getAllUser', {
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

export async  function getRoleList() {
  const res = await request('/api/role/getRoles');
  return res.result
}


export async  function getUserRoleList(params:any) {
  const res = await request('/api/role/getRoles',{params});
  return res.result
}

export async function putUserRole (params:any) {
  return request('/api/role/userBestow?userId='+params.userId+'&roleIds='+params.roleIds,{
    method: 'PUT'
  });
}

export async function removeUsers(params: string[]) {
  return request('/api/authentication/batchDeleteUser', {
    method: 'DELETE',
    data:params,
  });
}

export async function updateUser(params: any) {
  return request('/api/authentication/updateUser', {
    method: 'PUT',
    data:params,
  });
}

export async function registerUser(params: any) {
  return request('/api/authentication/register', {
    method: 'POST',
    data:params,
  });
}
