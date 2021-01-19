import React from 'react';
import {
  Form,
  Select,
  Button,
  Upload,
  Input,
  Modal,message
} from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import {RcFile, UploadChangeParam} from "antd/lib/upload";
import { formatMessage} from 'umi';

const { Option } = Select;

const formItemLayout = {
  labelCol: { span: 6 },
  wrapperCol: { span: 14 },
};

const normFile = (e:any) => {
  console.log('Upload event:', e);
  if (Array.isArray(e)) {
    return e;
  }
  return e && e.fileList;
};

interface CreateFormProps {
  modalVisible: boolean;
  onCancel: () => void;
  business:any[];
  onFinish:(values: any) => void;
  check:boolean;
  values:number

}



const CreateForm: React.FC<CreateFormProps> = (props) => {
  const { modalVisible, onCancel, business=[],onFinish, check, values } = props;

  console.log(values)


  const fileProps = {
    name: 'file',
    action: '/api/task/fileUpload',
    multiple:false,
    maxCount:1,
    headers: {
      'Authorization': localStorage.getItem('Authorization'),
    },
    beforeUpload(file: RcFile, fileList:RcFile[]) {
      return new Promise((resolve, reject:(reason?: any) => void) => {
        fileList.forEach((item:RcFile) => {
          if (!['xls','xlsx'].includes(item.name.split(".")[item.name.split('.').length-1]) && values===1) {
            message.error(formatMessage({id:"task.upalod.type"}))
            return reject(false)
          }
          if (!['csv'].includes(item.name.split(".")[item.name.split('.').length-1]) && values===2) {
            message.error(formatMessage({id:"task.csv.upalod.type"}))
            return reject(false)
          }
          if (item.size / 1024 / 1024 > 10) {
            message.error(formatMessage({id:"task.upalod.size"}))
            return reject(false)
          }
          return resolve(true);
        })
      })
    },
    onRemove(file: RcFile) {

    },
    onChange(info:UploadChangeParam) {
      if (info.file.status !== 'uploading') {
        console.log(info.file, info.fileList);
      }
      if (info.file.status === 'done') {
        message.success(`${info.file.name} file uploaded successfully`);
      } else if (info.file.status === 'error') {
        message.error(`${info.file.name} file upload failed.`);
      }
    },

    progress: {
      strokeColor: {
        '0%': '#108ee9',
        '100%': '#87d068',
      },
      strokeWidth: 3,
      format: (percent:number) => `${parseFloat(percent.toFixed(2))}%`,
    },
  }

  return (
    <Modal
      destroyOnClose
      title={values===1?formatMessage({id:"create"})+" "+formatMessage({id:"task"}):formatMessage({id:"outline"})+" "+formatMessage({id:"task"})}
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
          {...formItemLayout}
          name="name"
          label={formatMessage({id:"task.name"})}
          rules={[
            {
              required: true,
              message: formatMessage({id:"task.input"}),
            },
            {
              max:20,
              message: formatMessage({id:"task.input.size"}),
            }
          ]}
        >
          <Input placeholder={formatMessage({id:"task.input"})} autocomplete="new-password" />
        </Form.Item>

        <Form.Item
          name="password"
          label={formatMessage({id:"login.password"})}
          rules={[
            {
              required: true,
              message: formatMessage({id:"task.input.password"}),
            },
            {
              max:20,
              message: formatMessage({id:"task.password.size"}),
            }
          ]}
          hasFeedback
        >
          <Input.Password autocomplete="new-password" />
        </Form.Item>

        <Form.Item
          name="type"
          label={formatMessage({id:"task.type"})}
          hasFeedback
          rules={[{ required: true, message: formatMessage({id:"task.input.type"}) }]}
        >
          <Select placeholder={formatMessage({id:"task.input.type"})}>
            {business.map(item => (
              <Option key={item.code} value={item.code}>{item.name}</Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item
          name="taskFileId"
          label={formatMessage({id:"file"})}
          valuePropName="fileList"
          getValueFromEvent={normFile}
          extra={values===1?formatMessage({id:"file.extend.name"}):formatMessage({id:"file.csv.extend.name"})}
          rules={[
            {
              required: true,
              message: formatMessage({id:"file.upload.require"}),
            }
          ]}
        >
          <Upload  {...fileProps}>
            <Button>
              <UploadOutlined /> {formatMessage({id:"upload"})}
            </Button>
          </Upload>
        </Form.Item>

        <Form.Item
          name="bz"
          label={formatMessage({id:"remarks"})}
          rules={[
            {
              max:200,
              message: formatMessage({id:"remarks.size"}),
            }
          ]}
        >
          <Input.TextArea rows={4} />
        </Form.Item>

        <Form.Item wrapperCol={{ span: 12, offset: 6 }} >
          <Button type="primary" htmlType="submit" loading={check}>
            {formatMessage({id:"save"})}
          </Button>
        </Form.Item>
      </Form>

    </Modal>
  );
};

export default CreateForm;
