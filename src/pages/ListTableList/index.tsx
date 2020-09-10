import {SettingFilled} from '@ant-design/icons';
import {Button, Divider, message, Input} from 'antd';
import React, {useState, useRef, useEffect} from 'react';
import {PageContainer, FooterToolbar} from '@ant-design/pro-layout';
import ProTable, {ProColumns, ActionType} from '@ant-design/pro-table';

import {TableListItem,Recycle} from './data.d';
import {queryRule, recycleBinClean, revokeBinClean} from './service';
import CreateForm from "./components/CreateForm";
import {connect, Dispatch,formatMessage} from 'umi';
import {changeObj} from '@/utils/utils';
import {TaskData} from "@/pages/Task/data";

/**
 *  删除节点
 * @param selectedRows
 */
const handleRemove = async (selectedRows: TableListItem[]) => {
  const hide = message.loading('正在删除');
  if (!selectedRows) return true;
  try {
    const ids = selectedRows.map((row) => row.id);
    await recycleBinClean(ids);
    hide();
    message.success('删除成功，即将刷新');
    return true;
  } catch (error) {
    hide();
    message.error('删除失败，请重试');
    return false;
  }
};

/**
 *  恢复节点
 * @param selectedRows
 */
const handleRevoke = async (selectedRows: TableListItem[]) => {
  const hide = message.loading('正在恢复');
  if (!selectedRows) return true;
  try {
    const ids = selectedRows.map((row) => row.id);
    await revokeBinClean(ids);
    hide();
    message.success('恢复成功，即将刷新');
    return true;
  } catch (error) {
    hide();
    message.error('恢复失败，请重试');
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
  const [setCycleDay, handleCycleDay] = useState<Recycle>({cycleDay:30});
  const [createModalVisible, handleModalVisible] = useState<boolean>(false);
  useEffect(() => {
    dispatch({
      type: 'task/fetchBusinessType',
    })
  }, [1]);
  useEffect(() => {
    dispatch({
      type: 'recycle/getRegularTaskClean',
      callback: res => {
        if (!res.error) {
          handleCycleDay(res.result);
        }
      }
    })
  }, [createModalVisible]);


  const actionRef = useRef<ActionType>();
  const [selectedRowsState, setSelectedRows] = useState<TableListItem[]>([]);
  const [check, handleCheck] = useState<boolean>(false);
  const onFinish = (values:any) => {

    const parms={
      ...setCycleDay,
      ...values
    }
    console.log(parms)
    handleCheck(true)
    dispatch({
      type: 'recycle/settingBinClean',
      payload: parms,
      callback:res=>{
        handleCheck(false)
        if(res.result){
          handleModalVisible(false)
          message.success("设置成功")
          actionRef.current?.reloadAndRest();
        }else{
          message.success("设置失败")

        }
      }
    });
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
      title: '状态',
      dataIndex: 'status',
      hideInForm: true,
      hideInSearch: true,
      valueEnum: {
        true: {text: '已完成', status: true},
        false: {text: '未完成', status: false},
      },
    },
    {
      title: '创建日期',
      dataIndex: 'createdTime',
      sorter: true,
      hideInSearch: true
    }
  ];

  return (
    <PageContainer>
      <ProTable<TableListItem>
        headerTitle="回收站查询"
        actionRef={actionRef}
        rowKey="id"
        toolBarRender={() => [
          <Button type="primary" onClick={() => handleModalVisible(true)}>
            <SettingFilled spin/> 设置
          </Button>,
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
            清理
          </Button>

          <Button
            onClick={async () => {
              await handleRevoke(selectedRowsState);
              setSelectedRows([]);
              actionRef.current?.reloadAndRest();
            }}
          >
            恢复
          </Button>
        </FooterToolbar>
      )}
      <CreateForm onCancel={() => handleModalVisible(false)} modalVisible={createModalVisible} setCycleDay={setCycleDay} onFinish={onFinish} check={check}>
      </CreateForm>
    </PageContainer>
  );
};

export default connect(({task}: { task: any }) => ({
  task
}))(TableList);
