import { AlipayCircleOutlined, TaobaoCircleOutlined, WeiboCircleOutlined } from '@ant-design/icons';
import { Alert, Checkbox, message } from 'antd';
import React, { useState } from 'react';
import { Link, SelectLang, useModel , formatMessage} from 'umi';
import { getPageQuery } from '@/utils/utils';
import logo from '@/assets/logo.svg';
import { LoginParamsType, fakeAccountLogin } from '@/services/login';
import Cookies from 'js-cookie';
import Footer from '@/components/Footer';
import LoginFrom from './components/Login';
import styles from './style.less';


const { Tab, Username, Password, Mobile, Captcha, Submit } = LoginFrom;

const LoginMessage: React.FC<{
  content: string;
}> = ({ content }) => (
  <Alert
    style={{
      marginBottom: 24,
    }}
    message={content}
    type="error"
    showIcon
  />
);

/**
 * 此方法会跳转到 redirect 参数所在的位置
 */
const replaceGoto = () => {
  const urlParams = new URL(window.location.href);
  const params = getPageQuery();
  let { redirect } = params as { redirect: string };
  if (redirect) {
    const redirectUrlParams = new URL(redirect);
    if (redirectUrlParams.origin === urlParams.origin) {
      redirect = redirect.substr(urlParams.origin.length);
      if (redirect.match(/^\/.*#/)) {
        redirect = redirect.substr(redirect.indexOf('#'));
      }
    } else {
      window.location.href = '/';
      return;
    }
  }
  window.location.href = urlParams.href.split(urlParams.pathname)[0] + (redirect || '/');
};

const Login: React.FC<{}> = () => {
  const [userLoginState, setUserLoginState] = useState<API.LoginStateType>({});
  const [submitting, setSubmitting] = useState(false);

  const { refresh } = useModel('@@initialState');
  console.log(useModel('@@initialState'))
  const [autoLogin, setAutoLogin] = useState(true);
  const [type, setType] = useState<string>('account');
  let username="";
  let password="";
  let userInfo=Cookies.get("userInfo")
  if(userInfo){
    userInfo=JSON.parse(Cookies.get("userInfo"))
  }


  const handleSubmit = async (values: LoginParamsType) => {
    setSubmitting(true);
    try {
      const msg = await fakeAccountLogin({ ...values, type });
      if(msg.error?.errCode){
        message.error(msg.error.errMsg);
      } else {
        if(autoLogin){
          Cookies.set("userInfo",{...values,autoLogin})
        }else {
          Cookies.remove("userInfo")
        }
        localStorage.setItem('Authorization', msg.result);
        replaceGoto();
        setTimeout(() => {
          refresh();
        }, 0);
        return;
      }
      // 如果失败去设置用户错误信息
      setUserLoginState(msg);
    } catch (error) {
      message.error('登录失败，请重试！');
    }
    setSubmitting(false);
  };
  if(userInfo?.autoLogin){
    username=userInfo.username
    password=userInfo.password
  }
  const { status, type: loginType } = userLoginState;

  return (
    <div className={styles.container}>
      <div className={styles.lang}>
        <SelectLang />
      </div>
      <div className={styles.content}>
        <div className={styles.top}>
          <div className={styles.header}>
            <Link to="/">
              <img alt="logo" className={styles.logo} src={logo} />
            </Link>
          </div>
          <div className={styles.desc}>{formatMessage({id:"login.title"})}</div>
        </div>

        <div className={styles.main}>
          <LoginFrom activeKey={type} onTabChange={setType} onSubmit={handleSubmit}>
            <Tab key="account" tab={formatMessage({id:"login.tab.title"})}>
              {status === 'error' && loginType === 'account' && !submitting && (
                <LoginMessage content="账户或密码错误（admin/ant.design）" />
              )}

              <Username
                name="username"
                defaultValue={username}
                placeholder={formatMessage({id:"login.username"})}
                rules={[
                  {
                    required: true,
                    message: formatMessage({id:"login.ipnut.username"}),
                  },
                ]}
              />
              <Password
                name="password"
                defaultValue={password}
                placeholder={formatMessage({id:"login.password"})}
                rules={[
                  {
                    required: true,
                    message: formatMessage({id:"login.ipnut.password"}),
                  },
                ]}
              />
            </Tab>
            <div>
              <Checkbox checked={autoLogin} onChange={(e) => setAutoLogin(e.target.checked)}>
                {formatMessage({id:"autologin"})}
              </Checkbox>
            </div>
            <Submit loading={submitting}>{formatMessage({id:"login"})}</Submit>
          </LoginFrom>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Login;
