import React, { useState } from 'react';
import HTTP from "../../utils/api.js";
import inviti from "./assets/inviti.png";
import useri from "./assets/useri.png";
import passi from "./assets/passi.png";
import emaili from "./assets/email.png";
import codei from "./assets/codei.png";
import './index.less';



import {
  Form,
  Input,
  Button,
  Checkbox,
  Col,
  Row,
  Radio,
  message,
  Popconfirm,
} from "antd";


const emailReg = new RegExp(
  "^[a-z0-9]+([._\\-]*[a-z0-9])*@([a-z0-9]+[-a-z0-9]*[a-z0-9]+.){1,63}[a-z0-9]+$"
)

export const RegisterModal = ({ visible, close, showLogin }) => {
  const [registerInfo, setRegisterInfo] = useState({});
  const [isShowViceInviteCode, setIsShowViceInviteCode] = useState(false);

  const handleInfoChange = (key, value) => {
    if (key === 'invitCode') {
      if (value.indexOf("org") == 0) {
        setIsShowViceInviteCode(true);
      } else {
        setIsShowViceInviteCode(false);
      }
    }
    setRegisterInfo({
      ...registerInfo,
      [key]: value
    });
  };
  const sendEmail = () => {
    const { email } = registerInfo;
    if (!emailReg.test(email)) {
      message.error("邮箱格式不正确！");
      return;
    }
    HTTP.post("/auth/email", {
      email: email,
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
        message.success("验证码发送成功!");
      })
      .catch((err) => {
        message.error("验证码发送失败!");
      });
  }

  const rowLength = (val) => {
    val.length >= 254 ? true : false;
  }

  const registerFinish = () => {
    const {
      registerAd,
      registerPa,
      email,
      captcha,
      invitCode,
      emailReg,
      isShowViceInviteCode,
      viceInviteCode,
      realName,
      phoneNum,
    } = registerInfo;
    // 用户名检验
    if (
      !registerAd ||
      registerAd.indexOf("@") !== -1 ||
      rowLength(registerAd)
    ) {
      message.error("用户名不可以带@且不能为空！");
      return;
    }
    // 密码检验
    if (!registerPa || rowLength(registerPa)) {
      message.error("密码不能为空！");
      return;
    }
    // 邮箱检验
    if (!emailReg.test(email)) {
      message.error("邮箱格式不正确！");
      return;
    }
    // 验证码检验
    if (!captcha || captcha.length !== 6 || rowLength(captcha)) {
      message.error("验证码为6位且不能为空！");
      return;
    }
    // 邀请码检验
    if (!invitCode || rowLength(invitCode)) {
      message.error("验证码不能为空！");
      return;
    }
    //邀请码为机构特殊码时，必填班级码
    if (isShowViceInviteCode && !viceInviteCode) {
      message.error("班级码不能为空！");
      return;
    }
    // 姓名检验
    if (!realName || rowLength(realName)) {
      message.error("称呼不能为空，仅用于教师管理");
      return;
    }
    //电话号码校验
    if (!phoneNum || phoneNum.length !== 11 || rowLength(phoneNum)) {
      message.error("请填写正确电话号码");
      return;
    }
    let postData = {
      name: registerAd,
      password: registerPa,
      email: email,
      captcha: captcha,
      inviteCode: invitCode,
      realName: realName,
      phone: phoneNum,
    };
    if (isShowViceInviteCode) {
      postData.viceInviteCode = viceInviteCode;
    }
    HTTP.post("/auth/register", postData)
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
        message.success("注册成功!");
        if (viceInviteCode != null) {
          window.location.href = `${baseUrl}/#/examAndWrite`;
        } else {
          window.location.href = `${baseUrl}/admin/#/app/class/main`;
        }
      })
      .catch((err) => {
        message.error("服务器开小差了");
      });
  }

  if (!visible) {
    return null;
  }

  return (
    <div
      className="register-bg"
      onClick={e => {
        e.stopPropagation();
        close();
      }}
    >
      <div
        className="register-area-top"
        onClick={e => e.stopPropagation()}
      >
        <div className="title">注册教师账号</div>
        <div className="form-area">
          <div className="main-row">
            <div className="main-left">
              <Input
                size="large"
                placeholder="请输入您的账号"
                prefix={
                  <div className="my-icon">
                    <img className="input-icon" src={useri} />
                  </div>
                }
                onChange={e => handleInfoChange('loginAd', e.target.value)}
                value={registerInfo.registerAd}
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
                onChange={e => handleInfoChange('registerPa', e.target.value)}
                value={registerInfo.registerPa}
              />
              <Input
                className="pass-mar"
                size="large"
                placeholder="请输入电子邮箱地址"
                prefix={
                  <div className="my-icon">
                    <img className="input-icon" src={emaili} />
                  </div>
                }
                onChange={e => handleInfoChange('email', e.target.value)}
                value={registerInfo.email}
              />
              <div className="code-area pass-mar">
                <Input
                  size="large"
                  placeholder="请输入验证码"
                  prefix={
                    <div className="my-icon">
                      <img className="input-icon" src={codei} />
                    </div>
                  }
                  onChange={e => handleInfoChange('captcha', e.target.value)}
                  value={registerInfo.captcha}
                />
                <div
                  className="send-code"
                  onClick={sendEmail}
                >
                  发送验证码到邮箱
                </div>
              </div>
            </div>
            <div className="main-right">
              <Input
                size="large"
                placeholder="请输入邀请码"
                prefix={
                  <div className="my-icon">
                    <img className="input-icon" src={inviti} />
                  </div>
                }
                onChange={e => handleInfoChange('invitCode', e.target.value)}
                value={registerInfo.invitCode}
              />
              {isShowViceInviteCode && (
                <Input
                  className="pass-mar"
                  size="large"
                  placeholder="请输入班级码"
                  prefix={
                    <div className="my-icon">
                      <img className="input-icon" src={inviti} />
                    </div>
                  }
                  onChange={e => handleInfoChange('viceInviteCode', e.target.value)}
                  value={registerInfo.viceInviteCode}
                />
              )}
              <Input
                className="pass-mar"
                size="large"
                placeholder="请输入称呼/姓名,仅供班级管理使用"
                prefix={
                  <div className="my-icon">
                    <img className="input-icon" src={inviti} />
                  </div>
                }
                onChange={e => handleInfoChange('realName', e.target.value)}
                value={registerInfo.realName}
              />
              <Input
                className="pass-mar"
                size="large"
                placeholder="请输入手机号"
                prefix={
                  <div className="my-icon">
                    <img className="input-icon" src={inviti} />
                  </div>
                }
                onChange={e => handleInfoChange('phoneNum', e.target.value)}
                value={registerInfo.phoneNum}
              />
            </div>
          </div>
          <div className="btn-box">
            <div
              className="register-com"
              onClick={registerFinish}
            >
              确认信息并注册
            </div>
          </div>
          <div className="join-area">
            <span className="join-fir">已有账号，</span>
            <span
              className="join-sec"
              onClick={() => {
                close();
                showLogin();
              }}
            >
              马上登录
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};