import React from 'react';
import './index.less'
import { Link } from "react-router-dom";
import HTTP from '../../utils/api.js';
import { Form, Input, Button, Checkbox, Col, Row, Radio, message } from 'antd';
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
  // 获取用户信息
  getMes() {
    HTTP.get("/api/profile")
    .then(res => {
        console.log(res);
        if (res && res.data && res.data.data) {
          if (res.data.data.area) {
            window.location.href = `${baseUrl}/#/Transfer`;
          }
        }
        message.success('登录成功');
    }).catch(err => {
        message.info('请先登录');
    });
  }
  // 切换登录注册
  handleModeChange(mode, e) {
    e.stopPropagation();
    this.setState({ mode });
  };
  // 注册接口
  registerFinish(values) {
    console.log('Success:', values);
    HTTP.post("/auth/register", values).then(res => {
      message.success('注册成功!');
      window.location.href = `${baseUrl}/#/Transfer`;
    }).catch(err => {
      message.error('注册失败!');
    });
  }
  // 登录接口
  loginFinish() {
    const {loginAd, loginPa} = this.state;
    HTTP.post("/auth/login", {
      userName: loginAd,
      password: loginPa
    }).then(res => {
      message.success('登录成功!');
      window.location.href = `${baseUrl}/#/Transfer`;
    }).catch(err => {
      message.error('登录失败!');
    });
  }
  // 验证码接口
  sendEmail() {
    HTTP.post("/auth/email", {
      email: this.state.email
    }).then(res => {
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
    this.setState({
      invitCode: event.target.value
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
    const { mode, loginAd, loginPa, registerAd, registerPa, email, captcha, invitCode } = this.state;
    return (
      <div className="main_container">
          <div className="fix_header">
              <div className="header_left">
                    <img className="main-img" src={promise}></img>
                    <div className="home-page check">首页</div>
                    <div className="about-us">关于我们</div>
                    <div className="use-msg">使用说明</div>
              </div>
              <div className="header_right">
                    <div className="register" onClick={this.handleModeChange.bind(this, 'register')}>注册</div>
                    <div className="login" onClick={this.handleModeChange.bind(this, 'login')}>登录</div>
              </div>
          </div>
          <div className="mid-floor">
            <img className="right-img" src={rightBg}></img>
            <div className="icon-list">
                <img className="little-img" src={emailpng}></img>
                <img className="little-img" src={phonepng}></img>
                <img className="little-img" src={chatpng}></img>
            </div>
          </div>
          <div className="bottom-floor">
            <div className="sim-info">
                <img className="top-img" src={cirBg}></img>
                <div className="info-list">
                  <div className="info-title">We have your word.</div>
                  <div className="info-sub">我们向您承诺</div>
                  <div className="info-msg">Through our word recitation program, you can master at least 2000 words in 30 days. It is reasonable and scientific to ensure that you will not forget after reciting, and complete the learning plan efficiently and step by step.</div>
                  <div className="info-chi">通过我们的背词计划，您可以在30天内掌握至少2000个单词，合理而且科学，保证您不会背完即忘，高效完成学习计划，循序渐进，水滴石穿。</div>
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
                        <Input 
                          className="pass-mar" 
                          size="large" 
                          placeholder="请输入邀请码" 
                          prefix={<div className="my-icon"><img className="input-icon" src={inviti} /></div>} 
                          onChange={this.onInputInvitCode.bind(this)} 
                          value={invitCode}/>
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
    );
  }
}
