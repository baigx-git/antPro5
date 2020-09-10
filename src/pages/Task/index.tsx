import {PlusOutlined} from '@ant-design/icons';
import {Button, Divider, message, Input} from 'antd';
import React, {useState, useRef, useEffect} from 'react';
import {PageContainer, FooterToolbar} from '@ant-design/pro-layout';
import ProTable, {ProColumns, ActionType} from '@ant-design/pro-table';
import CreateForm from './components/CreateForm';
import {TableListItem, TaskData} from './data.d';
import {queryRule, removeRule, downloadExcelFile,resetPassword} from './service';
import {connect, Dispatch, useAccess, Access} from 'umi';
import {changeObj} from '@/utils/utils';
import PwForm from "@/pages/Task/components/PwForm";

/**
 *  删除节点
 * @param selectedRows
 */
const handleRemove = async (selectedRows: TableListItem[]) => {
  const hide = message.loading('正在删除');
  if (!selectedRows) return true;
  try {
    const ids = selectedRows.map((row) => row.id)
    await removeRule(ids);
    hide();
    message.success('删除成功，即将刷新');
    return true;
  } catch (error) {
    hide();
    message.error('删除失败，请重试');
    return false;
  }
};

const downloadFile = async (fields: TableListItem) => {
  const hide = message.loading('正在下载');
  try {
    const res = await downloadExcelFile(fields.id)
    const filename = decodeURI(res.response.headers.get("content-disposition").split(";")[1].split("filename=")[1])
    if (window.navigator.msSaveOrOpenBlob) {
      navigator.msSaveBlob(res.data, filename);
    } else {
      const link = document.createElement('a');
      const evt = document.createEvent('MouseEvents');
      link.style.display = 'none';
      link.href = window.URL.createObjectURL(res.data);
      link.download = filename;
      document.body.appendChild(link); // 此写法兼容可火狐浏览器
      evt.initEvent('click', false, false);
      link.dispatchEvent(evt);
      document.body.removeChild(link);
    }
    return true;
  } catch (error) {
    hide();
    message.error('下载失败！');
    return false;
  }
};

interface BasicListProps {
  task: TaskData;
  dispatch: Dispatch;
}

const TableList: React.FC<BasicListProps> = (props) => {
  const {
    task: {business = []}, dispatch
  } = props;
  const actionRef = useRef<ActionType>();
  const [createModalVisible, handleModalVisible] = useState<boolean>(false);
  const [createPwVisible, handlePwVisible] = useState<boolean>(false);

  const [check, handleCheck] = useState<boolean>(false);

  const [pwcheck, handlePwCheck] = useState<boolean>(false);

  const onFinish = (values: any) => {
    handleCheck(true)
    const taskFileId = values.taskFileId ? values.taskFileId[0].response?.id : undefined
    const param = {
      ...values
    }
    param.taskFileId = taskFileId
    dispatch({
      type: 'task/createTask',
      payload: param,
      callback: res => {
        if (res.result) {
          handleCheck(false)
          handleModalVisible(false)
          message.success("创建task成功")
          actionRef.current?.reloadAndRest();
        }
      }
    });
  };



  useEffect(() => {
    dispatch({
      type: 'task/fetchBusinessType',
    })
  }, [1]);

  const [selectedRowsState, setSelectedRows] = useState<TableListItem[]>([]);


  /**
   * 重置密码
   * @param values
   */
  const onSet = async (values: any) => {
    handlePwCheck(true)
    const ids = selectedRowsState.map((row) => row.id)
    try {
      await resetPassword({...values,ids})
      handlePwCheck(false);
      message.success('重置成功！');
      return true;
    }catch (e) {
      message.error('重置失败！');
      return false;
    }


  };

  const columns: ProColumns<TableListItem>[] = [
    {
      title: '任务编号',
      dataIndex: 'number',
      hideInSearch: true
    },
    {
      title: '任务名称',
      dataIndex: 'name',
      rules: [
        {
          required: true,
          message: '规则名称为必填项',
        },
      ],
    },
    {
      title: '业务类型',
      dataIndex: 'type',
      valueType: 'string',
      valueEnum: changeObj(business)
    },
    {
      title: '创建日期',
      dataIndex: 'createdTime',
      sorter: true,
      hideInSearch: true,
    },
    {
      title: '状态',
      dataIndex: 'status',
      valueEnum: {
        true: {text: '已完成', status: true},
        false: {text: '未完成', status: false},
      },
    },
    {
      title: '操作',
      dataIndex: 'option',
      valueType: 'option',
      render: (_, record) => (
        <>
          <a
            onClick={() => {
              downloadFile(record);
            }}
          >
            下载
          </a>
        </>
      ),
    },
  ];

  const access = useAccess()
  return (
    <PageContainer>
      <ProTable<TableListItem>
        headerTitle="任务查询"
        actionRef={actionRef}
        rowKey="id"
        toolBarRender={() => [
          <Access accessible={access.isPermission('ROLE_ADMIN')}>
            <Button type="primary" onClick={() => handleModalVisible(true)}>
              <PlusOutlined/> 新建任务
            </Button>
          </Access>,
        ]}
        request={(params, sorter, filter) => queryRule({...params, sorter, filter})}
        columns={columns}
        rowSelection={{
          onChange: (_, selectedRows) => setSelectedRows(selectedRows),
        }}
      />
      {selectedRowsState?.length > 0 && (
        <FooterToolbar
          extra={
            <div>
              已选择 <a style={{fontWeight: 600}}>{selectedRowsState.length}</a> 项&nbsp;&nbsp;
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
            批量删除
          </Button>

          <Button
            onClick={() => {
              handlePwVisible(true)
            }}
          >
            重置密码
          </Button>
        </FooterToolbar>
      )}

      <CreateForm onCancel={() => handleModalVisible(false)} check={check} modalVisible={createModalVisible}
                  business={business} onFinish={onFinish}>
      </CreateForm>

      <PwForm modalVisible={createPwVisible} onCancel={()=>handlePwVisible(false)} onFinish={onSet} check={pwcheck}/>



    </PageContainer>
  );
};


export default connect(({task}: { task: any }) => ({
  task
}))(TableList);
