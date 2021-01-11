import {FormattedMessage, formatMessage} from 'umi';
import React, {Component, useState} from 'react';
import UserFrom from "@/pages/account/settings/components/UserFrom";
import {List, message} from 'antd';
import {registerUser, updateUser} from "@/pages/UserManager/service";

type Unpacked<T> = T extends (infer U)[] ? U : T;

interface SecurityViewProps {
  modalVisible: boolean;
  values: any
}

const SecurityView: React.FC<SecurityViewProps> = (props) => {
  const [createUserVisible, handleUserVisible] = useState<boolean>(false);
  const [check, handleCheck] = useState<boolean>(false);
  const getData = () => [
    {
      title: formatMessage({id: 'accountandsettings.security.password'}, {}),
      actions: [
        <a key="Modify" onClick={() => handleUserVisible(true)}>
          <FormattedMessage id="accountandsettings.security.modify" defaultMessage="Modify"/>
        </a>,
      ],
    }
  ];

  const onSet = (values: any) => {

    let user = {...props?.currentUser.result, ...values}
    const hide = message.loading('正在修改');
    try {
      updateUser(user).then(res => {
        hide();
        // message.success('修改成功，即将刷新');
        handleUserVisible(false)
      });


    } catch (error) {
      hide();
      message.error('修改失败，请重试');
      return false;
    }

  };


  const data = getData();
  return (
    <>
      <List<Unpacked<typeof data>>
        itemLayout="horizontal"
        dataSource={data}
        renderItem={(item) => (
          <List.Item actions={item.actions}>
            <List.Item.Meta title={item.title}/>
          </List.Item>
        )}
      />

      <UserFrom onCancel={() => handleUserVisible(false)} modalVisible={createUserVisible}
                values={props?.currentUser || {}} check={check} onFinish={onSet}>

      </UserFrom>
    </>
  );
}

export default SecurityView;
