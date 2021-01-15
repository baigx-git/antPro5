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
      'Authorization': sessionStorage.getItem('Authorization'),
    },
    beforeUpload(file: RcFile, fileList:RcFile[]) {
      return new Promise((resolve, reject:(reason?: any) => void) => {
        fileList.forEach((item:RcFile) => {
          if (!['xls','xlsx'].includes(item.name.split(".")[item.name.split('.').length-1]) && values===1) {
            message.error('上传类型为xls,xlsx')
            return reject(false)
          }
          if (!['csv'].includes(item.name.split(".")[item.name.split('.').length-1]) && values===2) {
            message.error('离线文件上传类型为csv')
            return reject(false)
          }
          if (item.size / 1024 / 1024 > 10) {
            message.error('最大上传10M')
            return reject(false)
          }
          return resolve(true);
        })
      })
    },
    onRemove(file: RcFile) {
      console.log(file)

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
      title={values===1?"新建任务":"离线任务"}
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
          label="任务名称"
          rules={[
            {
              required: true,
              message: '请输入任务名称',
            },
            {
              max:20,
              message: '任务名称不能大于20个字符',
            }
          ]}
        >
          <Input placeholder="请输入任务名称" autocomplete="new-password" />
        </Form.Item>

        <Form.Item
          name="password"
          label="密码"
          rules={[
            {
              required: true,
              message: '请输入任务密码',
            },
            {
              max:20,
              message: '密码不能大于20个字符',
            }
          ]}
          hasFeedback
        >
          <Input.Password autocomplete="new-password" />
        </Form.Item>

        <Form.Item
          name="type"
          label="业务类型"
          hasFeedback
          rules={[{ required: true, message: '请选择业务类型' }]}
        >
          <Select placeholder="请选择业务类型">
            {business.map(item => (
              <Option key={item.code} value={item.code}>{item.name}</Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item
          name="taskFileId"
          label="文件"
          valuePropName="fileList"
          getValueFromEvent={normFile}
          extra={values===1?"支持扩展名 .xlsx, .xls":"支持扩展名 .csv"}
          rules={[
            {
              required: true,
              message: '请上传文件',
            }
          ]}
        >
          <Upload  {...fileProps}>
            <Button>
              <UploadOutlined /> 上传
            </Button>
          </Upload>
        </Form.Item>

        <Form.Item
          name="bz"
          label="备注"
          rules={[
            {
              max:200,
              message: '备注不能大于200个字符',
            }
          ]}
        >
          <Input.TextArea rows={4} />
        </Form.Item>

        <Form.Item wrapperCol={{ span: 12, offset: 6 }} >
          <Button type="primary" htmlType="submit" loading={check}>
            保存
          </Button>
        </Form.Item>
      </Form>

    </Modal>
  );
};

export default CreateForm;
