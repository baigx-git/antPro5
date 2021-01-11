import { UploadOutlined } from '@ant-design/icons';
import { Button, Input, Select, Upload, Form, message } from 'antd';
import { connect, FormattedMessage, formatMessage } from 'umi';
import React, { Component } from 'react';

import { CurrentUser } from '../data.d';
import styles from './BaseView.less';
import { updateUser} from "@/pages/UserManager/service";

const { Option } = Select;
interface SelectItem {
  label: string;
  key: string;
}


interface BaseViewProps {
  currentUser?: CurrentUser;
}

class BaseView extends Component<BaseViewProps> {
  view: HTMLDivElement | undefined = undefined;

  getViewDom = (ref: HTMLDivElement) => {
    this.view = ref;
  };

  handleFinish = (values:any) => {
    let { currentUser } = this.props;
    let param = {...currentUser?.result,...values}
    let user={
     id: param.id, username:param.username
    }
    updateUser(user).then(res=>{
      if(res.result){
        message.success(formatMessage({ id: 'accountandsettings.basic.update.success' }));
      }else{
        message.error('修改失败，请重试');
      }
    })

  };


  render() {
    const { currentUser } = this.props;

    return (
      <div className={styles.baseView} ref={this.getViewDom}>
        <div className={styles.left}>
          <Form
            layout="vertical"
            onFinish={this.handleFinish}
            initialValues={currentUser.result}
            hideRequiredMark
          >
            <Form.Item
              name="username"
              label={formatMessage({ id: 'accountandsettings.basic.nickname' })}
              rules={[
                {
                  required: true,
                  message: formatMessage({ id: 'accountandsettings.basic.nickname-message' }, {}),
                },
              ]}
            >
              <Input />
            </Form.Item>
            {/*<Form.Item*/}
            {/*  name="profile"*/}
            {/*  label={formatMessage({ id: 'accountandsettings.basic.profile' })}*/}
            {/*  rules={[*/}
            {/*    {*/}
            {/*      required: true,*/}
            {/*      message: formatMessage({ id: 'accountandsettings.basic.profile-message' }, {}),*/}
            {/*    },*/}
            {/*  ]}*/}
            {/*>*/}
            {/*  <Input.TextArea*/}
            {/*    placeholder={formatMessage({ id: 'accountandsettings.basic.profile-placeholder' })}*/}
            {/*    rows={4}*/}
            {/*  />*/}
            {/*</Form.Item>*/}
            <Form.Item>
              <Button htmlType="submit" type="primary">
                <FormattedMessage
                  id="accountandsettings.basic.update"
                  defaultMessage="Update Information"
                />
              </Button>
            </Form.Item>
          </Form>
        </div>
      </div>
    );
  }
}

export default connect(
  ({ accountAndsettings }: { accountAndsettings: { currentUser: CurrentUser } }) => ({
    currentUser: accountAndsettings.currentUser,
  }),
)(BaseView);
