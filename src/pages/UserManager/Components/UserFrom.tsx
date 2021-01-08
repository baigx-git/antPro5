import React from 'react';
import {Button, Form, Input, Modal} from "antd";

interface UserFromProps {
  modalVisible: boolean;
  onCancel: () => void;
  onFinish: (values: any) => void;
  check: boolean;
  values:any
}

const formItemLayout = {
  labelCol: {span: 6},
  wrapperCol: {span: 14},
};
const UserFrom: React.FC<UserFromProps> = (props) => {

  const {modalVisible, onCancel, onFinish, check,values} = props;
  return (
    <Modal
      destroyOnClose
      title="用户"
      visible={modalVisible}
      onCancel={() => onCancel()}
      footer={null}
    >
      <Form
        name="validate_other"
        {...formItemLayout}
        onFinish={onFinish}
        initialValues={{
          username: values.username || "",
          password:""
        }}
      >
        <Form.Item
          name="username"
          label="用户名"
          rules={[
            {
              required: true,
              message: '请输入用户名',
            },
            {
              max: 20,
              message: '用户名不能大于20个字符',
            }
          ]}
          hasFeedback
        >
          <Input autocomplete="new-password"/>
        </Form.Item>
        <Form.Item
          name="password"
          label="密码"
          rules={[
            {
              required: true,
              message: '请输入密码',
            },
            {
              max: 20,
              message: '密码不能大于20个字符',
            }
          ]}
          hasFeedback
        >
          <Input.Password autocomplete="new-password"/>
        </Form.Item>

        <Form.Item
          name="repassword"
          label="确认密码"
          hasFeedback
          rules={[
            {
              required: true,
              message: '请输入确认密码',
            },
            ({ getFieldValue }) => ({
              validator(_, value) {
                if (!value || getFieldValue('password') === value) {
                  return Promise.resolve();
                }
                return Promise.reject('The two passwords that you entered do not match!');
              },
            }),
          ]}
        >
          <Input.Password  autocomplete="new-password"/>
        </Form.Item>

        <Form.Item wrapperCol={{span: 12, offset: 6}}>
          <Button type="primary" htmlType="submit" loading={check}>
            保存
          </Button>
        </Form.Item>
      </Form>

    </Modal>
  )
}

export default UserFrom;
