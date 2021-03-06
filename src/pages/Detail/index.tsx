import {Button, Divider, message, Select, Spin, Empty, Modal} from 'antd';

import React, {useState, useRef, useEffect} from 'react';
import {PageContainer, FooterToolbar} from '@ant-design/pro-layout';
import ProTable, {ProColumns, ConfigProvider, ActionType} from '@ant-design/pro-table';

import {TableListItem, Recycle, SelectData} from './data.d';
import {queryRule, recycleBinClean, revokeBinClean} from './service';
import CreateForm from "./components/CreateForm";
import {connect, Dispatch, formatMessage} from 'umi';
import debounce from 'lodash/debounce';
import {localLang, intlMap, changeObj} from '@/utils/utils';
import {TaskData} from "@/pages/Task/data";
import {Access, useAccess} from "@@/plugin-access/access";
import {removeRule} from "@/pages/Task/service";
import {ExclamationCircleOutlined} from '@ant-design/icons';

const {Option} = Select;
const {confirm} = Modal;


interface BasicListProps {
  task: TaskData;
  dispatch: Dispatch;
}

const TableList: React.FC<BasicListProps> = (props) => {
  const {
    task: {business = []}, dispatch
  } = props;
  const [setCycleDay, handleCycleDay] = useState<Recycle>({cycleDay: 30});
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
  const onFinish = (values: any) => {

    const parms = {
      ...setCycleDay,
      ...values
    }
    handleCheck(true)
    dispatch({
      type: 'recycle/settingBinClean',
      payload: parms,
      callback: res => {
        handleCheck(false)
        if (res.result) {
          handleModalVisible(false)
          message.success(formatMessage({id: "operation"}) + " " + formatMessage({id: "success"}))
          actionRef.current?.reloadAndRest();
        } else {
          message.success(formatMessage({id: "operation"}) + " " + formatMessage({id: "error"}))
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

  /**
   *  删除节点
   * @param selectedRows
   */
  const handleRemove = async (selectedRows: TableListItem[]) => {
    confirm({
      title: formatMessage({id: 'common.comfirm.delete'}),
      icon: <ExclamationCircleOutlined/>,
      onOk() {
        const hide = message.loading(formatMessage({id: "common.delete"}));
        if (!selectedRows) return true;
        try {
          const ids = selectedRows.map((row) => row.id);
          recycleBinClean(ids).then(res => {
            hide();
            message.success(formatMessage({id: "common.delete.success"}));
            setSelectedRows([]);
            actionRef.current?.reloadAndRest();
            return true;
          });

        } catch (error) {
          hide();
          message.error(formatMessage({id: "common.delete.error"}));
          return false;
        }

      },
      onCancel() {
      },
    });

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
            showSearch
            showArrow={false}
            value={value}
            placeholder={formatMessage({id: 'task.input'})}
            notFoundContent={fetching ? <Spin size="small"/> : <Empty image={Empty.PRESENTED_IMAGE_SIMPLE}/>}
            //filterOption={false}
            filterOption={(input, option) =>
              option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
            }
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
      title: formatMessage({id: 'task.type'}),
      dataIndex: 'type',
      valueEnum: changeObj(business)
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
  const access = useAccess()
  return (
    <PageContainer>
      <ConfigProvider
        value={{
          intl: intlMap[intl],
        }}
      >
        <ProTable<TableListItem>
          headerTitle={formatMessage({id: 'detail.name'})}
          actionRef={actionRef}
          rowKey="id"
          request={(params, sorter, filter) => queryRule({...params, sorter, filter})}
          columns={columns}
          rowSelection={{
            onChange: (_, selectedRows) => setSelectedRows(selectedRows),
          }}
          search={{
            optionRender: ({searchText, resetText}, {form}) => [
              <Button
                key="search"
                type="primary"
                onClick={() => {
                  form?.submit();
                }}
              >
                {searchText}
              </Button>,
              <Button
                key="rest"
                onClick={() => {
                  setSelectValue({
                    data: [],
                    fetching: false,
                    value: undefined
                  })
                  form?.resetFields();
                }}
              >
                {resetText}
              </Button>,
            ],
          }}
        />

        {selectedRowsState?.length > 0 && (
          <FooterToolbar
            extra={
              <div>
                {formatMessage({id: 'common.select'})} <a
                style={{fontWeight: 600}}>{selectedRowsState.length}</a> {formatMessage({id: 'common.term'})}&nbsp;&nbsp;
              </div>
            }
          >
            <Access accessible={access.isPermission('ROLE_ADMIN')}>
              <Button
                onClick={async () => {
                  await handleRemove(selectedRowsState);
                }}
              >
                {formatMessage({id: 'common.remove'})}
              </Button>
            </Access>
          </FooterToolbar>

        )}

        <CreateForm onCancel={() => handleModalVisible(false)} modalVisible={createModalVisible}
                    setCycleDay={setCycleDay}
                    onFinish={onFinish} check={check}>
        </CreateForm>
      </ConfigProvider>
    </PageContainer>
  );
};

export default connect(({task}: { task: any }) => ({
  task
}))(TableList);
