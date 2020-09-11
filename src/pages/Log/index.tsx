import { Button, message,Tag  } from 'antd';
import React, { useState, useRef } from 'react';
import { PageContainer, FooterToolbar } from '@ant-design/pro-layout';
import ProTable, {ActionType,ConfigProvider, ProColumns} from '@ant-design/pro-table';
import {formatMessage} from 'umi';
import { TableListItem,TableListPagination } from './data.d';
import { queryRule, removeRule } from './service';

import {localLang,intlMap} from '@/utils/utils';
import {TablePaginationConfig} from "antd/lib/table";



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
  "create": { text: formatMessage({id:'common.create'}), status: "create",color:"green" },
  "delete": { text: formatMessage({id:'common.remove'}), status: "delete" ,color:"blue"},
  "clean": { text: formatMessage({id:'common.clean'}), status: "clean",color:"red" },
}

const TableList: React.FC<{}> = () => {
  const actionRef = useRef<ActionType>();
  const [selectedRowsState, setSelectedRows] = useState<TableListItem[]>([]);
  const [pages,handPages] = useState<TableListPagination>({current:1,
    pageSize:20});
  const selectedLang = localLang;
  const [intl] = useState(selectedLang);

  const pagination:(false | TablePaginationConfig) = {
    onChange:(page, size)=>{
      handPages({
        current:page,
        pageSize:size
      })
    }

  }

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
      title: formatMessage({id:'log.type'}),
      dataIndex: 'type',
      valueEnum: mj,
      render: (_, record) => <Tag color={mj[record.type].color}>{_}</Tag>
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
        search={{span:7,labelWidth:70}}
        pagination={pagination}
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
