import React from 'react';
import './index.less'
import { Link } from "react-router-dom";
import HTTP from '../../utils/api.js';
import { Form, Input, Button, Checkbox, Col, Row, Radio, message, Popconfirm } from 'antd';
import baseUrl from '../../utils/config.js';
import promise from './assets/promise.png';
import rightBg from './assets/rightBg.png';
import emailpng from './assets/email.png';
import phonepng from './assets/phone.png';
import chatpng from './assets/weChat.png';
import btBg from './assets/btBg.png';
import loginpng from './assets/login.png';
import cirBg from './assets/cirBg.png';
import useri from './assets/useri.png';
import passi from './assets/passi.png';
import inviti from './assets/inviti.png';
import codei from './assets/codei.png';
import emaili from './assets/emaili.png';
import wechat from './assets/wechat.jpeg';
import userIcon from './assets/userIcon.png';

export default class Login extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      mode: '',
      loginAd: '',
      loginPa: '',
      registerAd: '',
      registerPa: '',
      email: '',
      captcha: '',
      invitCode: '',
      viceInviteCode: '',
      isShowViceInviteCode: false,
      realName: '',
      phoneNum: '',
      emailReg: new RegExp("^[a-z0-9]+([._\\-]*[a-z0-9])*@([a-z0-9]+[-a-z0-9]*[a-z0-9]+.){1,63}[a-z0-9]+$")
    };
  }
  getCookie(name)
  {
      var arr,reg=new RegExp("(^| )"+name+"=([^;]*)(;|$)");
   
      if(arr=document.cookie.match(reg))
   
          return (arr[2]);
      else
          return null;
  }
  setCookie(cname, cvalue, exdays) {
    var d = new Date();
    d.setTime(d.getTime() + (exdays*24*60*60*1000));
    var expires = "expires="+d.toUTCString();
    document.cookie = cname + "=" + cvalue + "; " + expires;
  }

  notLogin() {
    message.info('请登录后使用');
  }
  // 获取用户身份及是否登录
  getMes() {
    HTTP.get("/api/role")
    .then(res => {
      if (!res && !res.data && res.data.state == null) {
        return
      }
      if (res.data.state == 401) {
        this.notLogin()
        return;
      } else if (res.data.state !== 0) {
        message.error('服务器开小差了')
        return;
      }
      if (res && res.data && res.data.data) {
        if (res.data.data.redirectUrl) {
          message.success('登录成功');
          window.location.href = res.data.data.redirectUrl;
        }
      }
    }).catch(err => {
        message.info('请先登录');
    });
  }
  // 切换登录注册
  handleModeChange(mode, e) {
    e.stopPropagation();
    this.setState({ mode });
  };
  rowLength(val) {
    val.length >= 254 ? true : false;
  }
  // 注册接口
  registerFinish() {
    const {registerAd, registerPa, email, captcha, invitCode, emailReg, isShowViceInviteCode, viceInviteCode, realName, phoneNum} = this.state;
    // 用户名检验
    if (!registerAd || registerAd.indexOf('@') !== -1 || this.rowLength(registerAd)) {
      message.error('用户名不可已带@且不能为空！');
      return;
    }
    // 密码检验
    if (!registerPa || this.rowLength(registerPa)) {
      message.error('密码不能为空！');
      return;
    }
    // 邮箱检验
    if (!emailReg.test(email)) {
      message.error('邮箱格式不正确！');
      return;
    }
    // 验证码检验
    if (!captcha || captcha.length !== 6 || this.rowLength(captcha)) {
      message.error('验证码为6位且不能为空！');
      return;
    }
    // 邀请码检验
    if (!invitCode || this.rowLength(invitCode)) {
      message.error('验证码不能为空！');
      return;
    }
    //邀请码为机构特殊码时，必填班级码
    if (isShowViceInviteCode && !viceInviteCode) {
      message.error('班级码不能为空！');
      return;
    }
    // 姓名检验
    if (!realName || this.rowLength(realName)) {
      message.error('称呼不能为空，仅用于教师管理');
      return;
    }
    //电话号码校验
    if (!phoneNum || phoneNum.length !== 11 || this.rowLength(phoneNum)) {
      message.error('请填写正确电话号码');
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
    }
    if(isShowViceInviteCode) {
      postData.viceInviteCode = viceInviteCode;
    }
    HTTP.post("/auth/register", postData).then(res => {
      if (!res && !res.data && res.data.state == null) {
        message.error('服务器开小差了');
        return;
      }
      if (res.data.state == 101) {
        message.error(res.data.msg);
        return;
      } else if (res.data.state !== 0) {
        message.error(res.data.msg);
        return;
      }
      message.success('注册成功!');
      if(viceInviteCode != null) {
        window.location.href = `${baseUrl}/#/Transfer`;
      } else {
        window.location.href = `${baseUrl}/admin/#/app/class/main`;
      }
      
    }).catch(err => {
      message.error('服务器开小差了');
    });
  }
  // 登录接口
  loginFinish() {
    const {loginAd, loginPa} = this.state;
    if (!loginAd || loginAd.indexOf('@') !== -1 || this.rowLength(loginAd)) {
      message.error('用户名不可已带@且不能为空！');
      return;
    }
    // 密码检验
    if (!loginPa || this.rowLength(loginPa)) {
      message.error('密码不能为空！');
      return;
    }
    HTTP.post("/auth/login", {
      userName: loginAd,
      password: loginPa
    }).then(res => {
      if (!res && !res.data && res.data.state == null) {
        message.error('服务器开小差了');
        return;
      }
      if (res.data.state == 101) {
        message.error(res.data.msg);
        return;
      } else if (res.data.state !== 0) {
        message.error(res.data.msg);
        return;
      }
      message.success('登录成功!');
      window.location.href = res.data.data;
    }).catch(err => {
      message.error('登录失败!');
    });
  }
  // 验证码接口
  sendEmail() {
    const { email, emailReg }  = this.state;
    if (!emailReg.test(email)) {
      message.error('邮箱格式不正确！');
      return;
    }
    HTTP.post("/auth/email", {
      email: email
    }).then(res => {
      if (!res && !res.data && res.data.state == null) {
        message.error('服务器开小差了');
        return;
      }
      if (res.data.state == 101) {
        message.error(res.data.msg);
        return;
      } else if (res.data.state !== 0) {
        message.error(res.data.msg);
        return;
      }
      message.success('验证码发送成功!');
    }).catch(err => {
      message.error('验证码发送失败!');
    });
  }
  // loginAd
  onInputLoginAd(event) {
    this.setState({
      loginAd: event.target.value
    });
  }
  // loginPa
  onInputLoginPa(event) {
    this.setState({
      loginPa: event.target.value
    });
  }
  // registerAd
  onInputRegisterAd(event) {
    this.setState({
      registerAd: event.target.value
    });
  }
  // registerPa
  onInputRegisterPa(event) {
    this.setState({
      registerPa: event.target.value
    });
  }
  // email
  onInputEmail(event) {
    this.setState({
      email: event.target.value
    });
  }
  // captcha
  onInputCaptcha(event) {
    this.setState({
      captcha: event.target.value
    });
  }
  // invitCode
  onInputInvitCode(event) {
    if(event.target.value.indexOf("org") == 0) {
      this.setState({
        invitCode: event.target.value,
        isShowViceInviteCode: true
      });
    } else {
      this.setState({
        invitCode: event.target.value,
        // isShowViceInviteCode: true
        isShowViceInviteCode: false  //暂时修改班级码为常驻
      });
    }
  }

  //班级码
  onInputViceInviteCode(event) {
    this.setState({
      viceInviteCode: event.target.value
    });
  }

  //真实姓名
  onInputRealName(event) {
    this.setState({
      realName: event.target.value
    });
  }

  //电话号码
  onInputTele(event) {
    this.setState({
      phoneNum: event.target.value
    });
  }
  // 记住密码check
  checkBoxChange(event) {
    console.log(event);
  }
  componentWillMount() {
    this.getMes();
  }
  componentDidMount() {
    // console.log('cookie', document.cookie);
    // this.setCookie('sessionID', "", -1); 
    // console.log('cookie', document.cookie);
  }

  render() {
    const { mode, loginAd, loginPa, registerAd, registerPa, email, captcha, invitCode, isShowViceInviteCode, viceInviteCode, realName, phoneNum} = this.state;
    return (
      <div className="main_container">
          <div className="fix_header">
              <div className="header_left">
                    <img className="main-img" src={promise}></img>
                    <div className="home-page check">首页</div>
                    <Link className="about-us" to="/about">关于我们</Link>
              </div>
              <div className="header_right">
                    <div className="register" onClick={this.handleModeChange.bind(this, 'register')}>注册</div>
                    <div className="login" onClick={this.handleModeChange.bind(this, 'login')}>登录</div>
              </div>
          </div>
          <div className="mid-floor">
            <img className="right-img" src={rightBg}></img>
            <div className="icon-list">
              <div className="icon-email">
                <Popconfirm placement="top" title="koihyman@qingchengword.onaliyun.com" icon={<img style={{position: 'absolute', top: '8px', width: '14px', height: '14px'}} src={userIcon}></img>}>
                  <img className="little-img" src={emailpng}></img>
                </Popconfirm>
              </div>
              <div className="icon-chat">
                <Popconfirm placement="top" icon={<img style={{width: '128px', height: '128px'}} src={wechat}></img>}>
                  <img className="little-img" src={chatpng}></img>
                </Popconfirm>
              </div>
            </div>
          </div>
          <div className="bottom-floor">
            <div className="sim-info">
                <img className="top-img" src={cirBg}></img>
                <div className="info-list-wrapper">
                  <div className="info-list">
                    <div className="info-title">倾心所选 成你所愿</div>
                    <div className="info-sub">We give our word, you have your words.</div>
                    {/* <div className="info-msg">Through our word recitation program, you can master at least 2000 words in 30 days. It is reasonable and scientific to ensure that you will not forget after reciting, and complete the learning plan efficiently and step by step.</div>
                    <div className="info-chi">通过我们的背词计划，您可已在30天内掌握至少2000个单词，合理而且科学，保证您不会背完即忘，高效完成学习计划，循序渐进，水滴石穿。</div> */}
                  </div>
                </div>
            </div>
            <div className="register-btn" onClick={this.handleModeChange.bind(this, 'register')}>立即注册体验</div>
            <div className="login-area" onClick={this.handleModeChange.bind(this, 'login')}>
                <img className="login-img" src={loginpng}></img>
                <div className="login-text">已有账号立即登录</div>
            </div>
            <img className="bottom-img" src={btBg}></img>
          </div>
          {
            mode === 'login'
            ?
            (
              <div className="login-bg" onClick={this.handleModeChange.bind(this, '')}>
                <div className="login-area-top" onClick={this.handleModeChange.bind(this, 'login')}>
                    <div className="title">
                      登录账号
                    </div>
                    <div className="form-area">
                      <Input 
                        size="large" 
                        placeholder="请输入您的账号" 
                        prefix={<div className="my-icon"><img className="input-icon" src={useri} /></div>} 
                        onChange={this.onInputLoginAd.bind(this)} 
                        value={loginAd}/>
                      <Input.Password 
                        className="pass-mar" 
                        size="large" 
                        placeholder="请输入您的密码" 
                        prefix={<div className="my-icon"><img className="input-icon" src={passi} /></div>} 
                        onChange={this.onInputLoginPa.bind(this)} 
                        value={loginPa}/>
                      <div className="rem-box">
                        <Checkbox onChange={this.checkBoxChange.bind(this)}>记住密码</Checkbox>
                      </div>
                      <div className="btn-box">
                        <div className="register-box" onClick={this.handleModeChange.bind(this, 'register')}>注册</div>
                        <div className="login-box" onClick={this.loginFinish.bind(this)}>登录</div>
                      </div>
                    </div>
                </div>
              </div>
            )
            :
            (
              mode === 'register'
              ?
              (
                <div className="register-bg" onClick={this.handleModeChange.bind(this, '')}>
                  <div className="register-area-top" onClick={this.handleModeChange.bind(this, 'register')}>
                      <div className="title">
                        注册账号
                      </div>
                      <div className="form-area">
                        <div className="main-row">
                          <div className="main-left">
                            <Input 
                              size="large" 
                              placeholder="请输入您的账号" 
                              prefix={<div className="my-icon"><img className="input-icon" src={useri} /></div>} 
                              onChange={this.onInputRegisterAd.bind(this)} 
                              value={registerAd}/>
                            <Input.Password 
                              className="pass-mar" 
                              size="large" 
                              placeholder="请输入您的密码" 
                              prefix={<div className="my-icon"><img className="input-icon" src={passi} /></div>} 
                              onChange={this.onInputRegisterPa.bind(this)} 
                              value={registerPa}/>
                            <Input 
                              className="pass-mar" 
                              size="large" 
                              placeholder="请输入电子邮箱地址" 
                              prefix={<div className="my-icon"><img className="input-icon" src={emaili} /></div>} 
                              onChange={this.onInputEmail.bind(this)} 
                              value={email}/>
                            <div className="code-area pass-mar">
                              <Input 
                                size="large" 
                                placeholder="请输入验证码" 
                                prefix={<div className="my-icon"><img className="input-icon" src={codei} /></div>} 
                                onChange={this.onInputCaptcha.bind(this)} 
                                value={captcha}/>
                              <div className="send-code" onClick={this.sendEmail.bind(this)}>发送验证码到邮箱</div>
                            </div>
                          
                          </div>
                          <div className="main-right">
                            <Input 
                              size="large" 
                              placeholder="请输入邀请码" 
                              prefix={<div className="my-icon"><img className="input-icon" src={inviti} /></div>} 
                              onChange={this.onInputInvitCode.bind(this)} 
                              value={invitCode}/>
                            {isShowViceInviteCode && 
                              <Input 
                              className="pass-mar" 
                              size="large" 
                              placeholder="请输入班级码" 
                              prefix={<div className="my-icon"><img className="input-icon" src={inviti} /></div>} 
                              onChange={this.onInputViceInviteCode.bind(this)} 
                              value={viceInviteCode}/>
                            }  
                              <Input 
                              className="pass-mar" 
                              size="large" 
                              placeholder="请输入称呼/姓名,仅供班级管理使用" 
                              prefix={<div className="my-icon"><img className="input-icon" src={inviti} /></div>} 
                              onChange={this.onInputRealName.bind(this)} 
                              value={realName}/>
                              <Input 
                              className="pass-mar" 
                              size="large" 
                              placeholder="请输入手机号" 
                              prefix={<div className="my-icon"><img className="input-icon" src={inviti} /></div>} 
                              onChange={this.onInputTele.bind(this)} 
                              value={phoneNum}/>
                          </div>
                          
                        </div>
                        <div className="btn-box">
                            <div 
                              className="register-com" 
                              onClick={this.registerFinish.bind(this)}>
                              确认信息并注册
                            </div>
                          </div>
                          <div className="join-area">
                            <span className="join-fir">已有账号，</span>
                            <span className="join-sec" onClick={this.handleModeChange.bind(this, 'login')}>马上登录</span>
                          </div>
                      </div>
                  </div>
                </div>
              )
              :
              <div></div>
            )
          }
      </div>
    )
  }
}
