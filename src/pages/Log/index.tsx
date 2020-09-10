import { Button, message } from 'antd';
import React, { useState, useRef } from 'react';
import { PageContainer, FooterToolbar } from '@ant-design/pro-layout';
import ProTable, {ActionType,ConfigProvider, ProColumns} from '@ant-design/pro-table';
import {formatMessage} from 'umi';
import { TableListItem } from './data.d';
import { queryRule, removeRule } from './service';

import {localLang,intlMap} from '@/utils/utils';



/**
 *  删除节点
 * @param selectedRows
 */
const handleRemove = async (selectedRows: TableListItem[]) => {
  const hide = message.loading(formatMessage({id:'common.delete'}));
  if (!selectedRows) return true;
  try {
    await removeRule({
      ids: selectedRows.map((row) => row.id),
    });
    hide();
    message.success(formatMessage({id:'common.delete.success'}));
    return true;
  } catch (error) {
    hide();
    message.error(formatMessage({id:'common.delete.error'}));
    return false;
  }
};

const mj={
  "create": { text: formatMessage({id:'common.create'}), status: "create" },
  "delete": { text: formatMessage({id:'common.remove'}), status: "delete" },
  "clean": { text: formatMessage({id:'common.clean'}), status: "clean" },
}

const TableList: React.FC<{}> = () => {
  const actionRef = useRef<ActionType>();
  const [selectedRowsState, setSelectedRows] = useState<TableListItem[]>([]);

  const selectedLang = localLang;
  const [intl] = useState(selectedLang);

  const columns: ProColumns<TableListItem>[] = [
    {
      title: formatMessage({id:'log.number'}),
      dataIndex: 'index',
      valueType: 'indexBorder',
      width: 72,
    },
    {
      title: formatMessage({id:'log.type'}),
      dataIndex: 'type',
      valueEnum: mj,
    },
    {
      title: formatMessage({id:'log.content'}),
      dataIndex: 'message',
      hideInSearch:true,
    },
    {
      title: formatMessage({id:'log.operate.ip'}),
      dataIndex: 'ip',
      hideInSearch:true,
    },
    {
      title: formatMessage({id:'common.operator'}),
      dataIndex: 'createdBy',
      hideInSearch:true,
    },
    {
      title: formatMessage({id:'common.operate.time'}),
      dataIndex: 'createdTime',
      valueType: 'dateTimeRange',
      render: (_, record) => (
        <>
          {record.createdTime}
        </>
      ),

    }

  ];

  return (
    <PageContainer>
      <ConfigProvider
        value={{
          intl: intlMap[intl],
        }}
      >
      <ProTable<TableListItem>
        headerTitle={formatMessage({id:"log.search"})}
        actionRef={actionRef}
        rowKey="id"
        request={(params, sorter, filter) => queryRule({ ...params, sorter, filter })}
        columns={columns}
        // rowSelection={{
        //   onChange: (_, selectedRows) => setSelectedRows(selectedRows),
        // }}
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
            {formatMessage({id:'common.batch.delete'})}
          </Button>
        </FooterToolbar>
      )}
      </ConfigProvider>
    </PageContainer>
  );
};

export default TableList;
