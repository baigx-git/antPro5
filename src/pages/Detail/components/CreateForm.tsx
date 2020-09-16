import React from 'react';
import {
  Form,
  Button,
  InputNumber,
  Modal
} from 'antd';
import {Recycle} from '../data.d';

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
      title="设置"
      visible={modalVisible}
      onCancel={() => onCancel()}
      footer={null}
    >

      <Form
        name="validate_other"
        onFinish={onFinish}
        initialValues={setCycleDay}
      >
        <Form.Item label="回收站自动清理频率">
            <Form.Item
              {...formItemLayout}
              name="cycleDay"
              noStyle
              rules={[{ required: true, message: '请输入清理频率' }]}
            >
              <InputNumber  style={{ width: 160 }} placeholder="请输入清理频率" min={1} max={31} />
            </Form.Item>
            <span style={{marginLeft: 10}}>
              天
            </span>
          </Form.Item>

        <Form.Item wrapperCol={{ span: 20, offset: 4 }}>
          <span>说明：默认回收站只保留30创建的task</span>
        </Form.Item>


        <Form.Item wrapperCol={{ span: 12, offset: 6 }}>
          <Button type="primary" htmlType="submit" loading={check}>
            保存
          </Button>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default CreateForm;
