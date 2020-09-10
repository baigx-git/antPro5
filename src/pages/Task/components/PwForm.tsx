import React from 'react';
import {Button, Form, Input, Modal} from "antd";

interface PwFormProps {
  modalVisible: boolean;
  onCancel: () => void;
  onFinish: (values: any) => void;
  check: boolean;
}

const formItemLayout = {
  labelCol: {span: 6},
  wrapperCol: {span: 14},
};
const PwForm: React.FC<PwFormProps> = (props) => {

  const {modalVisible, onCancel, onFinish, check} = props;

  return (
    <Modal
      destroyOnClose
      title="重置密码"
      visible={modalVisible}
      onCancel={() => onCancel()}
      footer={null}
    >
      <Form
        name="validate_other"
        {...formItemLayout}
        onFinish={onFinish}
      >
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
          <Input.Password/>
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

export default PwForm;
