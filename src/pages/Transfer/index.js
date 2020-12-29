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
import userIcon from './assets/userIcon.png';

export default class Login extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
        showOver: false,
        todayCount: '20',
        alled: '2400',
        nowDay: '2',
        allDay: '40',
        staticName: '',
        real_name: '',
        city: '',
        phone: '',
        province: '',
        email: '',
        area: '',
        qq_number: '',
        school: '',
        newWord: '6',
        grade: '',
        DictionaryName: '',
        DictionaryId: '',
        Count: '',
        describe: '',
        picture: '',
        allChoice: '',
        currentAlreadyChoice: '',
        currentRecite: '',
        nextChoiceDay: '',
        surplusChoice: '',
        currentDay: '',
        currentStageAllDays: '',
        currentStage: '',
        overStage: '',
        recitedWordsNumber: '',
        todayWordsPlan: ''
    };
  }
  // 蒙层
  handleModeChange(showOver, e) {
    e.stopPropagation();
    this.setState({ showOver });
  };
  // 开始背词
  handleStart() {
    const {currentStageAllDays, DictionaryName} = this.state;
    if (currentStageAllDays) {
      window.location.href = `${baseUrl}/#/reciteWords?lib_name=${DictionaryName}`;
    }
    return;
  }
  // 开始选词
  handleChoose() {
    const {DictionaryName, DictionaryId} = this.state;
    window.location.href = `${baseUrl}/#/chooseWord?lib_name=${DictionaryName}&lib_id=${DictionaryId}`;
  }
  // 获取首页信息
  getHomeMes() {
    HTTP.get("/api/home").then(res => {
      if (res && res.data && res.data.data && res.data.data.currentDic) {
        const currentDic = res.data.data.currentDic;
        this.setState({
          Count: currentDic.Count,
          DictionaryId: currentDic.DictionaryId,
          DictionaryName: currentDic.DictionaryName,
          describe: currentDic.describe,
          picture: currentDic.picture
        });
      }
      if (res && res.data && res.data.data && res.data.data.wordsStatistics) {
        const wordsStatistics = res.data.data.wordsStatistics;
        this.setState({
          allChoice: wordsStatistics.allChoice,
          currentAlreadyChoice: wordsStatistics.currentAlreadyChoice,
          currentRecite: wordsStatistics.currentRecite,
          nextChoiceDay: wordsStatistics.nextChoiceDay,
          surplusChoice: wordsStatistics.surplusChoice
        });
      }
      if (res && res.data && res.data.data && res.data.data.reciteWordInfo) {
        const reciteWordInfo = res.data.data.reciteWordInfo;
        this.setState({
          currentDay: reciteWordInfo.currentDay,
          currentStageAllDays: reciteWordInfo.currentStageAllDays,
          currentStage: reciteWordInfo.currentStage,
          overStage: reciteWordInfo.overStage,
          recitedWordsNumber: reciteWordInfo.recitedWordsNumber,
          todayWordsPlan: reciteWordInfo.todayWordsPlan
        });
      }
      console.log(res);
    }).catch(err => {
      console.log(err);
    });
  }
  // 获取词库信息
  getLib() {
    HTTP.get("/api/dictionary/info").then(res => {
      if (res.data.data) {
        const datas = res.data.data[0];
        this.setState({
          Count: datas.Count,
          DictionaryId: datas.DictionaryId,
          DictionaryName: datas.DictionaryName
        })
      }
      console.log(res);
    }).catch(err => {
      console.log(err);
    });
  }
  // 获取用户信息
  getMes() {
    HTTP.get("/api/profile")
    .then(res => {
        console.log(res);
        if (res && res.data && res.data.data) {
            if (res.data.data.area) {
              this.setState({
                area: res.data.data.area || '',
                city: res.data.data.city || '',
                email: res.data.data.email || '',
                grade: res.data.data.grade || '',
                phone: res.data.data.phone || '',
                province: res.data.data.province || '',
                qq_number: res.data.data.qqNumber || '',
                real_name: res.data.data.realName || '',
                school: res.data.data.school || '',
                staticName: res.data.data.realName || '',
                newWord: res.data.data.reciteVersion || '',
                showOver: false
              });
            } else {
              this.setState({
                area: res.data.data.area || '',
                city: res.data.data.city || '',
                email: res.data.data.email || '',
                grade: res.data.data.grade || '',
                phone: res.data.data.phone || '',
                province: res.data.data.province || '',
                qq_number: res.data.data.qqNumber || '',
                real_name: res.data.data.realName || '',
                school: res.data.data.school || '',
                staticName: res.data.data.realName || '',
                newWord: res.data.data.reciteVersion || '',
                showOver: true
              });
            }
        }
    }).catch(err => {
        message.error('个人信息获取失败!');
    });
  }
  // 提交信息
  saveMes() {
    const {real_name, city, phone, province, email, area, qq_number, school, newWord, grade} = this.state;
    HTTP.post("/api/profile", {
      realName: real_name,
      province: province,
      city: city,
      area: area,
      school: school,
      grade: grade,
      phone: phone,
      qqNumber: qq_number,
      email: email,
      latestAchievement: '100',
      reciteVersion: newWord,
      wordLevel: ''
    }).then(res => {
        message.success('设置成功!');
        this.setState({ showOver: false });
    }).catch(err => {
        message.error('设置失败!');
    });
  }
  // real_name
  onInputRealName(event) {
    this.setState({
      real_name: event.target.value
    });
  }
  // city
  onInputCity(event) {
    this.setState({
      city: event.target.value
    });
  }
  // phone
  onInputPhone(event) {
    this.setState({
      phone: event.target.value
    });
  }
  // province
  onInputProvince(event) {
    this.setState({
      province: event.target.value
    });
  }
  // email
  onInputEmail(event) {
    this.setState({
      email: event.target.value
    });
  }
  // area
  onInputArea(event) {
    this.setState({
      area: event.target.value
    });
  }
  // qq_number
  onInputQQNumber(event) {
    this.setState({
      qq_number: event.target.value
    });
  }
  // school
  onInputSchool(event) {
    this.setState({
      school: event.target.value
    });
  }
  // newWord
  onInputNewWord(event) {
    this.setState({
      newWord: event.target.value
    });
  }
  // grade
  onInputGrade(event) {
    this.setState({
      grade: event.target.value
    });
  }

  componentDidMount() {
    this.getHomeMes();
    this.getMes();
    this.getLib();
  }

  render() {
    const {staticName, showOver, todayCount, alled, nowDay, allDay, real_name, city, phone, province, email, area, qq_number, school, newWord, grade, DictionaryName, Count, DictionaryId, describe, picture,
      allChoice,
      currentAlreadyChoice,
      currentRecite,
      nextChoiceDay,
      surplusChoice,
      currentDay,
      currentStageAllDays,
      currentStage,
      overStage,
      recitedWordsNumber,
      todayWordsPlan
    } = this.state;
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
              <div className="header_right">
                <div onClick={this.handleModeChange.bind(this, true)}>
                  <img className="login-icon" src={userIcon}></img>
                  <div className="login">Hi，{staticName}</div>
                </div>
              </div>
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
                    <div className="right-s">
                      {
                        currentStageAllDays && currentDay && currentStageAllDays - currentDay < 0 ? 
                        '开始新阶段'
                        :
                        `当前阶段进度：${currentDay ? currentDay : '--'}/${currentStageAllDays ? currentStageAllDays : '--'}天`
                      }
                      &nbsp;&nbsp;
                      总进度：{currentStage ? currentStage : '--'}/{overStage ? overStage : '--'}阶段
                    </div>
                  </div>
                  <div className="sec-line">
                    <div className="sec-item">
                      <div className="day-count">{currentStageAllDays && currentDay ? currentStageAllDays - currentDay + 1 : '--'}</div>
                      <div className="day-text">当前阶段剩余天数</div>
                    </div>
                    <div className="sec-item">
                      <div className="day-count">{todayWordsPlan ? todayWordsPlan : '--'}</div>
                      <div className="day-text">今日计划背词数</div>
                    </div>
                    <div className="sec-item">
                      <div className="day-count">{recitedWordsNumber ? recitedWordsNumber : '--'}</div>
                      <div className="day-text">全部已背词数</div>
                    </div>
                  </div>
                  <div className="thr-line">
                    <div className={currentStageAllDays ? 'text-btn' : 'text-btn-none'} onClick={this.handleStart.bind(this)}>
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
                        {DictionaryName}
                      </div>
                      <div className="main-info">
                        <div className="main-t">
                          总计：{Count}词
                        </div>
                        <div className="main-s">
                          适合：{describe}
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
                        <div className="de-it-name">
                          当前已选：
                        </div>
                        <div className="de-it-num de-it-color1">
                          {currentAlreadyChoice ? currentAlreadyChoice : '--'}
                        </div>
                      </div>
                      <div className="detail-item">
                        <div className="de-it-name">
                          当前在背：
                        </div>
                        <div className="de-it-num de-it-color2">
                          {currentRecite ? currentRecite : '--'}
                        </div>
                      </div>
                    </div>
                    <div className="de-row">
                      <div className="detail-item">
                        <div className="de-it-name">
                          剩余待选：
                        </div>
                        <div className="de-it-num">
                          {surplusChoice ? surplusChoice : '--'}
                        </div>
                      </div>
                      <div className="detail-item">
                        <div className="de-it-name">
                          总计词数：
                        </div>
                        <div className="de-it-num de-it-color3">
                          {allChoice ? allChoice : '--'}
                        </div>
                      </div>
                    </div>
                  </div>
                  {
                    nextChoiceDay
                    ?
                    (
                      <div className="choose-tip">
                        距离下次选词还剩<span className="big-text">{nextChoiceDay}</span>天
                      </div>
                    )
                    :
                    (
                      <div className="thr-line">
                        <div className="text-btn" onClick={this.handleChoose.bind(this)}>
                          开始选词
                        </div>
                      </div>
                    )
                  }
                </div>
              </div>
            </div>
            <img className="bottom-img" src={btBg}></img>
          </div>
          {
            showOver
            ?
            (
              <div className="user-bg" onClick={this.handleModeChange.bind(this, false)}>
                <div className="user-area-top" onClick={this.handleModeChange.bind(this, true)}>
                  <div className="title">
                    个人信息
                  </div>
                  <div className="main-row">
                    <div className="main-left">
                      <Input 
                        className="pass-mar"
                        size="large" 
                        placeholder="请输入您的姓名" 
                        prefix={<div className="my-icon">姓名</div>} 
                        onChange={this.onInputRealName.bind(this)} 
                        value={real_name}/>
                      <Input 
                        className="pass-mar phone-icon"
                        size="large" 
                        placeholder="请输入您的手机号" 
                        prefix={<div className="my-icon">手机号</div>} 
                        onChange={this.onInputPhone.bind(this)} 
                        value={phone}/>
                      <Input 
                        className="pass-mar"
                        size="large" 
                        placeholder="请输入您的邮箱" 
                        prefix={<div className="my-icon">邮箱</div>} 
                        onChange={this.onInputEmail.bind(this)} 
                        value={email}/>
                      <Input 
                        className="pass-mar qq-icon"
                        size="large" 
                        placeholder="请输入您的QQ号" 
                        prefix={<div className="my-icon">QQ号</div>} 
                        onChange={this.onInputQQNumber.bind(this)} 
                        value={qq_number}/>
                      <Input 
                        className="pass-mar word-icon"
                        size="large" 
                        placeholder="请输入每日背词数" 
                        prefix={<div className="my-icon">每日背生词数</div>} 
                        onChange={this.onInputNewWord.bind(this)} 
                        value={newWord}/>
                    </div>
                    <div className="main-right">
                      <Input 
                        className="pass-mar"
                        size="large" 
                        placeholder="请输入您的省份" 
                        prefix={<div className="my-icon">省份</div>} 
                        onChange={this.onInputProvince.bind(this)} 
                        value={province}/>
                      <Input 
                        className="pass-mar"
                        size="large" 
                        placeholder="请输入您的市份" 
                        prefix={<div className="my-icon">市份</div>} 
                        onChange={this.onInputCity.bind(this)} 
                        value={city}/>
                      <Input 
                        className="pass-mar"
                        size="large" 
                        placeholder="请输入您的区县" 
                        prefix={<div className="my-icon">区县</div>} 
                        onChange={this.onInputArea.bind(this)} 
                        value={area}/>
                      <Input 
                        className="pass-mar"
                        size="large" 
                        placeholder="请输入您的学校" 
                        prefix={<div className="my-icon">学校</div>} 
                        onChange={this.onInputSchool.bind(this)} 
                        value={school}/>
                      <Input 
                        className="pass-mar"
                        size="large" 
                        placeholder="请输入您的年级" 
                        prefix={<div className="my-icon">年级</div>} 
                        onChange={this.onInputGrade.bind(this)} 
                        value={grade}/>
                    </div>
                  </div>
                  <div className="save-btn" onClick={this.saveMes.bind(this)}>
                    保存信息
                  </div>
                </div>
              </div>
            )
            :
            (
              <div></div>
            )
          }
      </div>
    );
  }
}
