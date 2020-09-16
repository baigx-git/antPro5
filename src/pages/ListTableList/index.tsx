import {SettingFilled} from '@ant-design/icons';
import {Button, Divider, message, Input, Select, Spin} from 'antd';
import React, {useState, useRef, useEffect} from 'react';
import {PageContainer, FooterToolbar} from '@ant-design/pro-layout';
import ProTable, {ProColumns, ActionType} from '@ant-design/pro-table';

import {TableListItem,Recycle} from './data.d';
import {queryRule, recycleBinClean, revokeBinClean} from './service';
import CreateForm from "./components/CreateForm";
import {connect, Dispatch,formatMessage} from 'umi';
import {changeObj, localLang} from '@/utils/utils';
import {TaskData} from "@/pages/Task/data";
import debounce from 'lodash/debounce';
import {SelectData} from "@/pages/Detail/data";
const {Option} = Select;

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

  const [selectValue, setSelectValue] = useState<SelectData>({
    data: [],
    fetching: false,
    value: []
  });

  const selectedLang = localLang;
  const [intl] = useState(selectedLang);
  const fetchTask = (value: any) => {
    console.log('fetching user', value);
    setSelectValue({data: [], fetching: true});

    dispatch({
      type: 'detail/queryTask',
      payload: {},
      callback: (res: any) => {
        setSelectValue({
          data: res.data,
          fetching: false,
        })
      }
    })

  };

  const handleChange = (value: any, form) => {
    setSelectValue({
      data: [],
      fetching: false,
      value
    })
    form.setFieldsValue({taskId: value})
  };

  const columns: ProColumns<TableListItem>[] = [
    {
      title: formatMessage({id: 'detail.rfid'}),
      dataIndex: 'epcNo',
      hideInSearch: true
    },
    {
      title: formatMessage({id: 'task.name'}),
      dataIndex: 'taskId',
      hideInSearch: false,
      hideInTable: true,
      renderFormItem: (_, {...rest}, form) => {
        const {fetching, data, value} = selectValue;
        return (
          <Select
            mode="tags"
            value={value}
            placeholder={formatMessage({id: 'task.input'})}
            notFoundContent={fetching ? <Spin size="small"/> : null}
            filterOption={false}
            onSearch={debounce(fetchTask, 800)}
            onChange={(e: any) => {
              handleChange(e, form)
            }}
            style={{width: '100%'}}
          >
            {data?.map(d => (
              <Option key={d.id} value={d.id}>{d.name}</Option>
            ))}
          </Select>
        )
      },
    },
    {
      title: formatMessage({id: 'detail.taskName'}),
      dataIndex: 'taskName',
      hideInSearch: true
    },
    {
      title: formatMessage({id: 'detail.barcodeNo'}),
      dataIndex: 'barcodeNo',
      hideInSearch: true
    },
    {
      title: formatMessage({id: 'detail.serialNo'}),
      dataIndex: 'serialNo',
      hideInSearch: true
    },
    {
      title: formatMessage({id: 'detail.modeNo'}),
      dataIndex: 'modeNo',
      hideInSearch: true
    },
    {
      title: formatMessage({id: 'detail.buildingNo'}),
      dataIndex: 'buildingNo',
      hideInSearch: true
    },
    {
      title: formatMessage({id: 'detail.floor'}),
      dataIndex: 'floor',
      hideInSearch: true
    },
    {
      title: formatMessage({id: 'detail.productionLine'}),
      dataIndex: 'productionLine',
      hideInSearch: true
    },


  ];

  return (
    <PageContainer>
      <ProTable<TableListItem>
        headerTitle="回收站查询"
        actionRef={actionRef}
        rowKey="id"
        toolBarRender={() => [
          <Button type="primary" onClick={() => handleModalVisible(true)}>
            <SettingFilled spin/> {formatMessage({id:'common.setting'})}
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
