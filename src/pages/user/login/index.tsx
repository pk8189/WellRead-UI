import _ from 'lodash';
import { Alert, Checkbox, message } from 'antd';
import React, { useState } from 'react';
import { Link, useModel } from 'umi';
import { getPageQuery } from '@/utils/utils';
import logo from '@/assets/logo.png';
import { LoginParamsType, tokenLogin } from '@/services/login';
import Footer from '@/components/Footer';
import LoginFrom from './components/Login';
import styles from './style.less';
import { createCookie, ONE_DAY }  from '../../../services/cookies'

const { Username, Password, Submit } = LoginFrom;

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
 * redirect
 */
const replaceGoto = (token: string) => {
  createCookie('authtoken', token, ONE_DAY);
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
  const [errorState, setErrorState] = useState<API.ErrorType>({});
  const [submitting, setSubmitting] = useState(false);

  const { refresh } = useModel('@@initialState');
  const [autoLogin, setAutoLogin] = useState(true);

  const handleSubmit = async (values: LoginParamsType) => {
    setSubmitting(true);
    try {
      const msg = await tokenLogin({ ...values });
      if (_.get(msg, 'access_token', false)) {
        message.success('Login success');
        replaceGoto(msg.access_token);
        setTimeout(() => {
          refresh();
        }, 0);
        return;
      }
      setErrorState(msg)
    } catch (error) {
      message.error('Login failed');
    }
    setSubmitting(false);
  };
  const { detail } = errorState;
  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <div className={styles.top}>
          <div className={styles.header}>
            <Link to="/">
              <img alt="logo" className={styles.logo} src={logo} />
              <span className={styles.title}>Well-Read</span>
            </Link>
          </div>
          <div className={styles.desc}>Social Reading Experience</div>
        </div>

        <div className={styles.main}>
          <LoginFrom onSubmit={handleSubmit}>
            {detail === 'Incorrect username or password' && !submitting && (
              <LoginMessage content={detail} />
            )}

            <Username
            name="username"
            placeholder=" username"
            rules={[
                {
                required: true,
                message: 'Email Required',
                },
            ]}
            />
            <Password
            name="password"
            placeholder=" password"
            rules={[
                {
                required: true,
                message: 'Password Required',
                },
            ]}
            />
            <div>
              <Checkbox checked={autoLogin} onChange={(e) => setAutoLogin(e.target.checked)}>
                Remember me
              </Checkbox>
            </div>
            <Submit loading={submitting}>Log In</Submit>
            {/* <div className={styles.other}>
              <Link className={styles.register} to="/user/register">
                Sign-Up
              </Link>
            </div> */}
          </LoginFrom>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Login;
