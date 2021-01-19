import {Button, Divider, message, Input, Upload, Space, Dropdown, Menu, Modal} from 'antd';
import React, {useState, useRef, useEffect} from 'react';
import {PageContainer, FooterToolbar} from '@ant-design/pro-layout';
import ProTable, {ProColumns, ActionType, ConfigProvider} from '@ant-design/pro-table';
import CreateForm from './components/CreateForm';
import {TableListItem, TaskData} from './data.d';
import {queryRule, removeRule, downloadExcelFile, resetPassword} from './service';
import {connect, Dispatch, useAccess, Access, formatMessage} from 'umi';
import {changeObj, localLang, intlMap} from '@/utils/utils';
import PwForm from "@/pages/Task/components/PwForm";
import {ExclamationCircleOutlined} from '@ant-design/icons';

const {confirm} = Modal;

const downloadFile = async (fields: TableListItem) => {
  const hide = message.loading(formatMessage({id: "task.downloading"}));
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
    message.error(formatMessage({id: "task.download.error"}));
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
  const [menuNumber, handleMenuNumber] = useState<number>(0);
  const [createPwVisible, handlePwVisible] = useState<boolean>(false);

  const [check, handleCheck] = useState<boolean>(false);

  const [pwcheck, handlePwCheck] = useState<boolean>(false);

  const [selectedRowsState, setSelectedRows] = useState<TableListItem[]>([]);

  const selectedLang = localLang;
  const [intl] = useState(selectedLang);


  /**
   *  删除节点
   * @param selectedRows
   */
  const handleRemove = async (selectedRows: TableListItem[]) => {
    confirm({
      title: formatMessage({id: 'common.comfirm.delete'}),
      icon: <ExclamationCircleOutlined/>,
      onOk() {
        const hide = message.loading(formatMessage({id: 'common.delete'}))
        if (!selectedRows) return true;
        try {
          const ids = selectedRows.map((row) => row.id)
          removeRule(ids).then(res => {
            hide();
            message.success(formatMessage({id: 'common.delete.success'}))
            setSelectedRows([]);
            actionRef.current?.reloadAndRest();
            return true
          })


        } catch (error) {
          hide();
          message.error(formatMessage({id: 'common.delete.error'}))
          return false
        }
      },
      onCancel() {
      },
    });

  };


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
        handleCheck(false)
        if (res.result) {
          handleModalVisible(false)
          message.success(formatMessage({id: "task.create.success"}))
          actionRef.current?.reloadAndRest()
        } else if (res.error) {
          message.error(res?.error.errMsg)
        }
      }
    });
  };


  useEffect(() => {
    dispatch({
      type: 'task/fetchBusinessType',
    })
  }, [1]);


  /**
   * 重置密码
   * @param values
   */
  const onSet = async (values: any) => {
    handlePwCheck(true)
    const ids = selectedRowsState.map((row) => row.id)
    try {
      await resetPassword({...values, ids})
      handlePwCheck(false);
      message.success(formatMessage({id: "task.reset.success"}));
      handlePwVisible(false);
      actionRef.current?.reloadAndRest()
      return true;
    } catch (e) {
      message.error(formatMessage({id: "task.reset.error"}));
      return false;
    }


  };

  const columns: ProColumns<TableListItem>[] = [
    {
      title: formatMessage({id: "task.number"}),
      dataIndex: 'number',
      hideInSearch: true
    },
    {
      title: formatMessage({id: "task.name"}),
      dataIndex: 'name'
    },
    {
      title: formatMessage({id: "task.type"}),
      dataIndex: 'type',
      valueType: 'string',
      valueEnum: changeObj(business)
    },
    {
      title: formatMessage({id: "create.date"}),
      dataIndex: 'createdTime',
      sorter: true,
      hideInSearch: true,
    },
    {
      title: formatMessage({id: "status"}),
      dataIndex: 'status',
      valueEnum: {
        true: {text: '已完成', status: true},
        false: {text: '未完成', status: false},
      },
    },
    {
      title: formatMessage({id: "operation"}),
      dataIndex: 'option',
      valueType: 'option',
      render: (_, record) => (
        <>

          <Space direction="horizontal" style={{width: '100%'}} size="large">
            <Button
              onClick={() => {
                downloadFile(record);
              }}
            >
              {formatMessage({id: "download"})}
            </Button>
          </Space>


        </>
      ),
    },
  ];

  const access = useAccess()

  const menu = (
    <Menu>
      <Menu.Item key="1" onClick={() => {
        handleModalVisible(true)
        handleMenuNumber(1)
      }}>{formatMessage({id: "create"}) + " " + formatMessage({id: "task"})}</Menu.Item>
      <Menu.Item key="2" onClick={() => {
        handleModalVisible(true)
        handleMenuNumber(2)
      }}>{formatMessage({id: "outline"}) + " " + formatMessage({id: "task"})}</Menu.Item>
    </Menu>
  );

  return (
    <PageContainer>
      <ConfigProvider
        value={{
          intl: intlMap[intl],
        }}
      >
        <ProTable<TableListItem>
          headerTitle={formatMessage({id: "task"}) + formatMessage({id: "search"})}
          actionRef={actionRef}
          rowKey="id"
          toolBarRender={() => [
            <Access accessible={access.isPermission('ROLE_ADMIN')}>
              <Dropdown key="menu" overlay={menu}>
                <Button>
                  {formatMessage({id: "task"})}
                </Button>
              </Dropdown>
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
                {formatMessage({id: "common.select"})} <a
                style={{fontWeight: 600}}>{selectedRowsState.length}</a> {formatMessage({id: "common.term"})}&nbsp;&nbsp;
              </div>
            }
          >
            <Access accessible={access.isPermission('ROLE_ADMIN')}>
              <Button
                onClick={async () => {
                  await handleRemove(selectedRowsState);
                }}
              >
                {formatMessage({id: "common.batch.delete"})}
              </Button>

              <Button
                onClick={() => {
                  handlePwVisible(true)
                }}
              >
                {formatMessage({id: "reset.password"})}
              </Button>
            </Access>
          </FooterToolbar>
        )}

      </ConfigProvider>

      <CreateForm onCancel={() => handleModalVisible(false)} check={check} modalVisible={createModalVisible}
                  values={menuNumber}
                  business={business} onFinish={onFinish}>
      </CreateForm>

      <PwForm modalVisible={createPwVisible} onCancel={() => handlePwVisible(false)} onFinish={onSet} check={pwcheck}/>


    </PageContainer>
  );
};


export default connect(({task}: { task: any }) => ({
  task
}))(TableList);
