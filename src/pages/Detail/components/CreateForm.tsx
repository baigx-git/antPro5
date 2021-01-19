import React from 'react';
import {
  Form,
  Button,
  InputNumber,
  Modal
} from 'antd';
import {Recycle} from '../data.d';
import {formatMessage} from "@@/plugin-locale/localeExports";

interface CreateFormProps {
  modalVisible: boolean;
  onCancel: () => void;
  setCycleDay:Recycle;
  check:boolean;
  onFinish:(values: any) => void;
}

const formItemLayout = {
  labelCol: { span: 8 },
  wrapperCol: { span: 10 },
};

const CreateForm: React.FC<CreateFormProps> = (props) => {
  const { modalVisible, onCancel,setCycleDay,check,onFinish} = props;

  return (
    <Modal
      destroyOnClose
      title={formatMessage({id:"common.setting"})}
      visible={modalVisible}
      onCancel={() => onCancel()}
      footer={null}
    >

      <Form
        name="validate_other"
        onFinish={onFinish}
        initialValues={setCycleDay}
      >
        <Form.Item label={formatMessage({id:"task.clean.frequency"})}>
            <Form.Item
              {...formItemLayout}
              name="cycleDay"
              noStyle
              rules={[{ required: true, message: formatMessage({id:"task.input.frequency"})} ]}
            >
              <InputNumber  style={{ width: 160 }} placeholder={formatMessage({id:"task.input.frequency"})} min={1} max={31} />
            </Form.Item>
            <span style={{marginLeft: 10}}>
              {formatMessage({id:"day"})}
            </span>
          </Form.Item>

        <Form.Item wrapperCol={{ span: 20, offset: 4 }}>
          <span>{formatMessage({id:"task.frequency.describe"})}</span>
        </Form.Item>


        <Form.Item wrapperCol={{ span: 12, offset: 6 }}>
          <Button type="primary" htmlType="submit" loading={check}>
            {formatMessage({id:"save"})}
          </Button>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default CreateForm;
