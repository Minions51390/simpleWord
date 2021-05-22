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

export default class About extends React.Component {
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
      emailReg: new RegExp("^[a-z0-9]+([._\\-]*[a-z0-9])*@([a-z0-9]+[-a-z0-9]*[a-z0-9]+.){1,63}[a-z0-9]+$"),
      isLogin: ''
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
    this.setState({
      isLogin: false
    });
  }
  // 获取用户信息
  getMes() {
    HTTP.get("/api/profile")
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
        if (res.data.data.email) {
          this.setState({
            isLogin: true
          });
        }
      }
    }).catch(err => {
        message.info('请先登录');
    });
  }
  

  componentWillMount() {
    this.getMes();
  }

  componentDidMount() {
  }

  render() {
    const { mode, loginAd, loginPa, registerAd, registerPa, email, captcha, invitCode, isLogin } = this.state;
    return (
      <div className="main_container">
          <div className="fix_header">
              <div className="header_left">
                    <img className="main-img" src={promise}></img>
                    {isLogin ? 
                      <Link className="home-page" to="/Transfer">首页</Link>
                      :
                      <Link className="home-page" to="/home">首页</Link>
                    }
                    <div className="about-us check">关于我们</div>
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
                    <div className="info-title">You have my word.</div>
                    <div className="info-sub">我们向您承诺</div>
                    <div className="info-msg">Through our word recitation program, you can master at least 2000 words in 30 days. It is reasonable and scientific to ensure that you will not forget after reciting, and complete the learning plan efficiently and step by step.</div>
                    <div className="info-chi">我们致力于给莘莘学子更好的背单词体验！！！</div>
                  </div>
                </div>
            </div>
            <img className="bottom-img" src={btBg}></img>
          </div>
      </div>
    );
  }
}
