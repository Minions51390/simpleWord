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
import cirBg from './assets/cirBg.png';
import GET4 from './assets/CET-4.png';

export default class Login extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
        todayCount: '20',
        alled: '2400',
        nowDay: '2',
        allDay: '40'
    };
  }

  componentDidMount() {
    
  }

  render() {
    const {todayCount, alled, nowDay, allDay} = this.state;
    return (
      <div className="main_container">
          {/* 动画Dom */}
          {/* <div className="mid-floor">
            <img className="right-img" src={rightBg}></img>
            <div className="icon-list">
                <img className="little-img" src={emailpng}></img>
                <img className="little-img" src={phonepng}></img>
                <img className="little-img" src={chatpng}></img>
            </div>
          </div>
          <div className="bottom-floor">
            <div className="fix_header">
                <div className="header_left">
                        <img className="main-img" src={promise}></img>
                        <div className="home-page check">首页</div>
                        <div className="about-us">关于我们</div>
                        <div className="use-msg">使用说明</div>
                </div>
            </div>
            <div className="sim-info">
                <img className="top-img" src={cirBg}></img>
                <div className="info-title">Hi, welcome!</div>
                <div className="info-sub">欢迎使用！</div>
            </div>
            <img className="bottom-img" src={btBg}></img>
          </div> */}
          {/* 承接主Dom */}
          <div className="fix_header_main">
              <div className="header_left">
                    <img className="main-img" src={promise}></img>
                    <div className="home-page check">首页</div>
                    <div className="about-us">关于我们</div>
                    <div className="use-msg">使用说明</div>
              </div>
              <div className="header_right"></div>
          </div>
          <div className="main_dom">
            <div className="content-dom">
              <div className="content-left">
                <div className="left-title">
                  背单词
                </div>
                <div className="left-top">
                  <div className="top-line">
                    <div className="left-s">学习计划</div>
                    <div className="right-s">进度：{nowDay}/{allDay}</div>
                  </div>
                  <div className="sec-line">
                    <div className="sec-item">
                      <div className="day-count">{allDay - nowDay}</div>
                      <div className="day-text">当前剩余天数</div>
                    </div>
                    <div className="sec-item">
                      <div className="day-count">{todayCount}</div>
                      <div className="day-text">今日计划背词数</div>
                    </div>
                    <div className="sec-item">
                      <div className="day-count">{alled}</div>
                      <div className="day-text">全部已背词数</div>
                    </div>
                  </div>
                  <div className="thr-line">
                    <div className="text-btn">
                      开始背词
                    </div>
                  </div>
                </div>
                <div className="left-title left-sec">
                  小测验
                </div>
                <div className="left-sec-area">
                  <div className="test-text">
                    敬请期待
                  </div>
                  <div className="test-btn">
                    开始检测
                  </div>
                </div>
              </div>
              <div className="content-right">
                <div className="right-title">
                  选词
                </div>
                <div className="right-top">
                  <div className="now-store">
                    当前词库
                  </div>
                  <div className="main-place">
                    <img src={GET4}></img>
                    <div>
                      <div className="main-title">
                        四级考纲词汇（2020版）
                      </div>
                      <div className="main-info">
                        <div className="main-t">
                          总计：2060词
                        </div>
                        <div className="main-s">
                          适合：大一、大二、大三、大四大一、大二、大三、大四大一、大二、大三、大四大一、大二、大三、大四大一、大二、大三、大四大一、大二、大三、大四
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="choose-word">
                    选择单词
                  </div>
                  <div className="choose-detail">
                    <div className="de-row">
                      <div className="detail-item">

                      </div>
                      <div className="detail-item">

                      </div>
                    </div>
                    <div className="de-row">
                      <div className="detail-item">

                      </div>
                      <div className="detail-item">

                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <img className="bottom-img" src={btBg}></img>
          </div>
      </div>
    );
  }
}
