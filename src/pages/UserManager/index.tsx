import {Button, message, Tag, Select, Space} from 'antd';
import React, {useState, useRef, useEffect} from 'react';
import { PageContainer, FooterToolbar } from '@ant-design/pro-layout';
import ProTable, {ActionType,ConfigProvider, ProColumns} from '@ant-design/pro-table';
import {formatMessage} from 'umi';
import { TableListItem,TableListPagination } from './data.d';
import { getUserList,getRoleList ,putUserRole,removeUsers,registerUser,updateUser} from './service';

import {localLang,intlMap} from '@/utils/utils';
import {TablePaginationConfig} from "antd/lib/table";
import CreateForm from "@/pages/UserManager/components/CreateForm";
import UserFrom from "@/pages/UserManager/components/UserFrom";
import {Access, useAccess} from "@@/plugin-access/access";

import {PlusOutlined} from '@ant-design/icons';
const { Option } = Select;

const mj={
  "create": { text: formatMessage({id:'common.create'}), status: "create",color:"green" },
  "delete": { text: formatMessage({id:'common.remove'}), status: "delete" ,color:"blue"},
  "clean": { text: formatMessage({id:'common.clean'}), status: "clean",color:"red" },
}

const TableList: React.FC<{}> = () => {
  const actionRef = useRef<ActionType>();
  const [selectedRowsState, setSelectedRows] = useState<TableListItem[]>([]);

  const [currentRow, setCurrentRow] = useState<any>();
  const [createModalVisible, handleModalVisible] = useState<boolean>(false);
  const [check, handleCheck] = useState<boolean>(false);

  const [createUserVisible, handleUserVisible] = useState<boolean>(false);
  const [pages,handPages] = useState<TableListPagination>({current:1,
    pageSize:20});
  const selectedLang = localLang;
  const [intl] = useState(selectedLang);
  const [role,handleRole]=useState<any>({
    roleList:[],
    id:0,
    roles:[]
  })


  useEffect(() => {
    getRoleList().then(res=>{
    const   roles = res.map((item:any,index:number)=>{
        return {
          key : item.id.toString(),
          name:item.name
        }
      })
      handleRole({roleList:roles})
      }

    )

  }, [2]);

  const pagination:(false | TablePaginationConfig) = {
    onChange:(page, size)=>{
      handPages({
        current:page,
        pageSize:size
      })
    }

  }

  const onFinish = (values: any) => {
    let params={
      userId:role.userId,
      roleIds:values.join(",")
    }

    const hide = message.loading('正在配置...');
    try {
      putUserRole(params).then(res=>{
        hide();
        message.success('配置成功，即将刷新');
        handleModalVisible(false)
        actionRef.current?.reloadAndRest()
      })

    } catch (error) {
      hide();
      message.error('配置失败，请重试');
      return false;
    }
  };
  const onSet = (values:any) => {

    let user = {...currentRow, ...values }
    console.log(user)
    if (user.id) {
      const hide = message.loading('正在修改');
      try {
        updateUser(user).then(res=>{
          debugger
          hide();
         // message.success('修改成功，即将刷新');
          handleUserVisible(false)
          actionRef.current?.reloadAndRest()
        });


      } catch (error) {
        hide();
        message.error('修改失败，请重试');
        return false;
      }

    }else{
      const hide = message.loading('正在新增');
      try {
          registerUser(user).then(res=>{
          hide();
            if(!res.result){
              message.success('新增失败，即将刷新')
            }else{
               message.success('新增成功，即将刷新');
            }
          handleUserVisible(false)
          actionRef.current?.reloadAndRest()
        });

      } catch (error) {
        hide();
        message.error('新增失败，请重试');
        return false;
      }

    }



  };

  /**
   *  删除节点
   * @param selectedRows
   */
  const handleRemove = async (selectedRows: TableListItem[]) => {
    const hide = message.loading('正在删除');
    if (!selectedRows) return true;
    try {
      const ids = selectedRows.map((row) => row.id)
      await removeUsers(ids);
      hide();
      message.success('删除成功，即将刷新');
      return true;
    } catch (error) {
      hide();
      message.error('删除失败，请重试');
      return false;
    }
  };

  const columns: ProColumns<TableListItem>[] = [
    {
      title: formatMessage({id:'log.number'}),
      dataIndex: 'index',
      valueType: 'indexBorder',
      width: 72,
      render(text,record,index){
        return(
          <span><div className = "ant-pro-field-index-column ant-pro-field-index-column-border" > {(pages.current-1)*pages.pageSize+(index+1)} </div></span>
        )
      }
    },
    {
      title: formatMessage({id:'userManager.username'}),
      dataIndex: 'username',
    },
    {
      title: formatMessage({id:'userManager.role'}),
      dataIndex: 'role',
      hideInSearch:true,
      render(text, record, index): any {

        return (
          <Select
            mode="multiple"
            disabled
            style={{ width: '100%' }}
            placeholder="暂无角色"
            bordered={false}
            value={record.role?.split(",")}
          >
            {role.roleList?.map(d => (
              <Option key={d.key} value={d.key}>{d.name}</Option>
            ))}

          </Select>
        )
      }
    },
    // {
    //   title: formatMessage({id:'log.operate.ip'}),
    //   dataIndex: 'ip',
    //   hideInSearch:true,
    // },
    // {
    //   title: formatMessage({id:'common.operator'}),
    //   dataIndex: 'createdBy',
    //   hideInSearch:true,
    // },
    // {
    //   title: formatMessage({id:'common.operate.time'}),
    //   dataIndex: 'createdTime',
    //   valueType: 'dateTimeRange',
    //   render: (_, record) => (
    //     <>
    //       {record.createdTime}
    //     </>
    //   ),
    //
    // }
    {
      title: '操作',
      dataIndex: 'option',
      valueType: 'option',
      render: (_, record) => (
        <>
          <Space direction="horizontal" style={{ width: '100%' }} size="large">
          <a
            onClick={() => {
              setCurrentRow(record)
              handleUserVisible(true);
            }}
          >
            修改
          </a>

          <a
            onClick={() => {
                const userRoel=record.role?.split(",")
                handleRole({userId:record.id,roleList:role.roleList,roles:userRoel});
                handleModalVisible(true);
            }}
          >
            配置角色
          </a>
          </Space>
        </>
      ),
    },

  ];
  const access = useAccess()
  return (
    <PageContainer>
      <ConfigProvider
        value={{
          intl: intlMap[intl],
        }}
      >
        <ProTable<TableListItem>
          headerTitle={formatMessage({id:"userManager.search"})}
          actionRef={actionRef}
          rowKey="id"
          toolBarRender={() => [
            <Access accessible={access.isPermission('ROLE_ADMIN')}>
              <Button type="primary" onClick={() => { handleUserVisible(true)
                setCurrentRow(undefined)} }>
                <PlusOutlined/> 新建用户
              </Button>
            </Access>,
          ]}
          request={(params, sorter, filter) => getUserList({ ...params, sorter, filter })}
          columns={columns}
          search={{span:7,labelWidth:70}}
          pagination={pagination}
          rowSelection={{
            onChange: (_, selectedRows) => setSelectedRows(selectedRows),
          }}
        />
        {selectedRowsState?.length > 0 && (
          <FooterToolbar
          extra={
          <div>
            {formatMessage({id:'common.select'})} <a style={{ fontWeight: 600 }}>{selectedRowsState.length}</a> {formatMessage({id:'common.term'})}&nbsp;&nbsp;
          </div>
        }
          >
            <Button
              onClick={async () => {
                await handleRemove(selectedRowsState);
                setSelectedRows([]);
                actionRef.current?.reloadAndRest();
              }}
            >
              {formatMessage({id:'common.remove'})}
            </Button>

          </FooterToolbar>
        )}
      </ConfigProvider>

      <CreateForm onCancel={() => handleModalVisible(false)}  modalVisible={createModalVisible} role={role} onFinish={onFinish}>

      </CreateForm>

      <UserFrom onCancel={() => handleUserVisible(false)}  modalVisible={createUserVisible} values={currentRow || {}} check={check} onFinish={onSet}>

      </UserFrom>

    </PageContainer>

  );
};

export default TableList;
