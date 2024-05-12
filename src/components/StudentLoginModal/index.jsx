import React, { useEffect, useState } from 'react';
import useri from "./assets/useri.png";
import passi from "./assets/passi.png";
import HTTP, { HTTPV2 } from "../../utils/api.js";
import baseUrl from '../../utils/config.js';
import './index.less';
import {
  Input,
  message,
} from "antd";



export const StudentLoginModal = ({ visible, close, showRegister }) => {
  const [loginAd, setLoginAd] = useState('');
  const [loginPa, setLoginPa] = useState('');
  const [loginPhoneNumber, setLoginPhoneNumber] = useState('');
  const [loginCaptcha, setLoginCaptcha] = useState('');
  const [loginType, setLoginType] = useState('captcha');

  const rowLength = (val) => {
    val.length >= 254 ? true : false;
  }

  const passwordLoginFinish = () => {
    if (!loginAd || loginAd.indexOf("@") !== -1 || rowLength(loginAd)) {
      message.error("用户名不可以带@且不能为空！");
      return;
    }
    // 密码检验
    if (!loginPa || rowLength(loginPa)) {
      message.error("密码不能为空！");
      return;
    }
    HTTP.post("/auth/login-sign", {
      accountSign: loginAd,
      password: loginPa,
    })
      .then((res) => {
        if (!res && !res.data && res.data.state == null) {
          message.error("服务器开小差了");
          return;
        }
        if (res.data.state == 101) {
          message.error(res.data.msg);
          return;
        } else if (res.data.state !== 0) {
          message.error(res.data.msg);
          return;
        }
        message.success("登录成功!");
        location.reload();
      })
      .catch((err) => {
        message.error("登录失败!");
      });
  }

  const captchaLoginFinish = () => {
    if (!loginPhoneNumber) {
      message.error("手机号不能为空！");
      return;
    }
    // 密码检验
    if (!loginCaptcha) {
      message.error("验证码不能为空！");
      return;
    }
    HTTPV2.post("/auth/login", {
      phone: loginPhoneNumber,
      code: loginCaptcha,
    })
      .then((res) => {
        if (!res && !res.data && res.data.state == null) {
          message.error("服务器开小差了");
          return;
        }
        if (res.data.state == 101) {
          message.error(res.data.msg);
          return;
        } else if (res.data.state !== 0) {
          message.error(res.data.msg);
          return;
        }
        message.success("登录成功!");
        location.reload();
      })
      .catch((err) => {
        message.error("登录失败!");
      });
  }

  const sendCaptcha = async () => {
    await HTTPV2.post("/auth/code", {
      phone: loginPhoneNumber.trim(),
    })
  };

  const changeLoginType = (type) => {
    setLoginType(type);
  };

  useEffect(() => {
    setLoginType('captcha');
  }, [visible])

  if (!visible) {
    return null;
  }

  return (
    <div
      className="login-bg"
      onClick={e => {
        e.stopPropagation();
        close();
      }}
    >
      <div
        className="login-area-top"
        onClick={e => e.stopPropagation()}
      >
        <div className="title">学生登录</div>
        {loginType === 'captcha' ? (
          <div className="form-area">
            <Input
              size="large"
              placeholder="请输入您的手机号"
              prefix={
                <div className="my-icon">
                  <img className="input-icon" src={useri} />
                </div>
              }
              onChange={e => setLoginPhoneNumber(e.target.value)}
              value={loginPhoneNumber}
            />
            <Input
              className="pass-mar"
              size="large"
              placeholder="请输入验证码"
              prefix={
                <div className="my-icon">
                  <img className="input-icon" src={passi} />
                </div>
              }
              suffix={
                <div className="send-captcha" onClick={sendCaptcha}>
                  发送验证码
                </div>
              }
              onChange={e => setLoginCaptcha(e.target.value)}
              value={loginCaptcha}
            />
            <div className='type-change' onClick={() => changeLoginType('password')}>使用账号密码登录</div>
            <div className="btn-box">
              <div
                className="register-box"
                onClick={showRegister}
              >
                注册
              </div>
              <div
                className="login-box"
                onClick={captchaLoginFinish}
              >
                登录
              </div>
            </div>
          </div>
        ) : (
          <div className="form-area">
            <Input
              size="large"
              placeholder="请输入您的账号"
              prefix={
                <div className="my-icon">
                  <img className="input-icon" src={useri} />
                </div>
              }
              onChange={e => setLoginAd(e.target.value)}
              value={loginAd}
            />
            <Input.Password
              className="pass-mar"
              size="large"
              placeholder="请输入您的密码"
              prefix={
                <div className="my-icon">
                  <img className="input-icon" src={passi} />
                </div>
              }
              onChange={e => setLoginPa(e.target.value)}
              value={loginPa}
            />
            <div className="btn-box">
              <div
                className="register-box"
                onClick={showRegister}
              >
                注册
              </div>
              <div
                className="login-box"
                onClick={passwordLoginFinish}
              >
                登录
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};