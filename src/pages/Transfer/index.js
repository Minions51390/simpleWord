import React from 'react';
import './index.less'
import { Link } from "react-router-dom";
import HTTP from '../../utils/api.js';
import { Form, Input, Select, Checkbox, Col, Row, Radio, message } from 'antd';
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
const wordCountArr = [6,9,12,15,18,21,24,27,30];
const emailReg = new RegExp("^[a-z0-9]+([._\\-]*[a-z0-9])*@([a-z0-9]+[-a-z0-9]*[a-z0-9]+.){1,63}[a-z0-9]+$");
const qqReg = /^[1-9][0-9]{4,14}$/;
const phoneReg = /^[1][1,2,3,4,5,7,8,9][0-9]{9}$/;
// const storeArr = []
export default class Login extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
        userInfo: {
          realName: '',
          city: '',
          phone: '',
          province: '',
          email: '',
          area: '',
          qqNumber: '',
          school: '',
          newWord: '',
          grade: '',
        },
        currentDic: {
          count: '',
          dictionaryId: '',
          dictionaryName: '',
          describe: '',
          picture: '',
          isRecite: false,
          haveRecite: false,
        },
        reciteWordInfo: {
          recitedWordsNumber: 0,
          todayWordsPlan: 6
        },
        wordsStatistics: {
          allChoice: '',
          currentAlreadyChoice: '',
          currentRecite: '',
          nextChoiceDay: '',
          surplusChoice: '',
          choiceIndex: 0,
        },
        showOver: false,
        storeArr: [],
        isSelectDisable: false,
        
    };
  }
  // 蒙层s
  handleModeChange(showOver, e) {
    e.stopPropagation();
    this.setState({ showOver });
  };
  notLogin() {
    window.location.href = `${baseUrl}/#/home`;
    // message.info('请登录后使用');
  }
  // 开始背词
  handleStart() {
    const {nextChoiceDay} = this.state.wordsStatistics;
    const {dictionaryName} = this.state.currentDic;
    
    if (nextChoiceDay > 0 ) {
      window.location.href = `${baseUrl}/#/reciteWords?lib_name=${dictionaryName}`;
    }
    return;
  }
  // 开始选词
  handleChoose(choiceIndex) {
    const {newWord} = this.state.userInfo;
    const {dictionaryId, dictionaryName} = this.state.currentDic;
    if(!newWord) {
      this.setState({ 
        showOver: true
      });
      message.info("开始之前需要每日背词数哦~")
    } else {
      window.location.href = `${baseUrl}/#/chooseWord?lib_name=${dictionaryName}&lib_id=${dictionaryId}&choiceIndex=${choiceIndex}`;
    }
  }
  // 获取首页信息
  getHomeMes(dicId) {
    HTTP.get("/api/home", {
      params: {
        dicId: dicId
      }
    }).then(res => {
      if (!res && !res.data && res.data.state == null) {
        return
      }
      if (res.data.state == 401) {
        this.notLogin()
        return
      } else if (res.data.state !== 0) {
        message.error('服务器开小差了')
        return
      }
      this.getMes();
      this.getLib();
      let responseData = res.data.data
      if (responseData && responseData.currentDic) {
        const currentDic = responseData.currentDic;
        this.setState({
          currentDic: currentDic
        });
      }
      if (responseData && responseData.wordsStatistics) {
        const wordsStatistics = responseData.wordsStatistics;
        this.setState({
          wordsStatistics: wordsStatistics,
        });
      }
      if (responseData && responseData.reciteWordInfo) {
        const reciteWordInfo = responseData.reciteWordInfo;

        this.setState({
          reciteWordInfo: reciteWordInfo,
        });
      }
      console.log(res);
    }).catch(err => {
      message.error('服务器开小差了')
      console.log(err);
    });
  }
  // 获取词库信息
  getLib() {
    HTTP.get("/api/dictionary/info").then(res => {
      if (!res && !res.data && res.data.state == null) {
        return
      }
      if (res.data.state == 401) {
        this.notLogin()
        return
      } else if (res.data.state !== 0) {
        message.error('服务器开小差了')
        return
      }
      let responseData = res.data.data
      if (responseData) {
        const datas = responseData;
        this.setState({
          storeArr: datas,
        })
      }
      console.log("/api/dictionary/info", res);
    }).catch(err => {
      message.error('服务器开小差了')
      console.log(err);
    });
  }
  // 获取用户信息
  getMes() {
    HTTP.get("/api/profile")
    .then(res => {
        if (!res && !res.data && res.data.state == null) {
          message.error('服务器开小差了')
          return
        } else if (res.data.state !== 0) {
          message.error('服务器开小差了')
          return
        }
        let responseData = res.data.data
        if (responseData) {
            if (responseData.reciteVersion > 0) {
              this.setState({
                userInfo: {
                  area: responseData.area || '',
                  city: responseData.city || '',
                  email: responseData.email || '',
                  realName: responseData.realName || '',
                  school: responseData.school || '',
                  phone: responseData.phone || '',
                  province: responseData.province || '',
                  qqNumber: responseData.qqNumber || '',
                  newWord: responseData.reciteVersion || 0,
                  grade: responseData.grade || '',
                },
                isSelectDisable: responseData.reciteVersion === 0 ? false : true,
                showOver: false
              });
            } else {
              this.setState({
                userInfo: {
                  area: responseData.area || '',
                  city: responseData.city || '',
                  email: responseData.email || '',
                  realName: responseData.realName || '',
                  school: responseData.school || '',
                  phone: responseData.phone || '',
                  province: responseData.province || '',
                  qqNumber: responseData.qqNumber || '',
                  newWord: responseData.reciteVersion || 0,
                  grade: responseData.grade || '',
                },
                isSelectDisable: responseData.reciteVersion === 0 ? false : true,
                showOver: true
              });
            }
        }
    }).catch(err => {
        message.error('个人信息获取失败!');
    });
  }

  //退出登录
  logOut() {
    HTTP.get("/auth/logout").then(res => {
      window.location.href = `${baseUrl}/#/home`;
      console.log(res);
    }).catch(err => {
      console.log(err);
    });
  }

  rowLength(val) {
    val.length >= 254 ? true : false;
  }

  // 提交信息
  saveMes() {
    const {realName, city, phone, province, email, area, qqNumber, school, newWord, grade} = this.state.userInfo;
    // 真名检验
    if (!realName || this.rowLength(realName)) {
      message.error('真实姓名不能为空！');
      return;
    }
    // 省份检验
    if (this.rowLength(province)) {
      message.error('省份过长！');
      return;
    }
    // 市份检验
    if (this.rowLength(city)) {
      message.error('市份过长！');
      return;
    }
    // 区县检验
    if (this.rowLength(area)) {
      message.error('区县过长！');
      return;
    }
    // 学校检验
    if (this.rowLength(school)) {
      message.error('学校名过长！');
      return;
    }
    // 年级检验
    if (this.rowLength(grade)) {
      message.error('年级过长！');
      return;
    }
    // 手机号检验
    if (!phoneReg.test(phone) || this.rowLength(phone)) {
      message.error('手机号格式错误！');
      return;
    }
    // qq检验
    if (!qqReg.test(qqNumber) || this.rowLength(qqNumber)) {
      message.error('QQ号格式错误！');
      return;
    }
    // 邮箱检验
    if (!emailReg.test(email)) {
      message.error('邮箱格式不正确！');
      return;
    }
    // 每日背词数检验
    if (parseInt(newWord) >= 1000) {
      message.error('每日背词数不能大于1000！');
      return;
    }
    HTTP.post("/api/profile", {
      realName: realName,
      province: province,
      city: city,
      area: area,
      school: school,
      grade: grade,
      phone: phone,
      qqNumber: qqNumber,
      email: email,
      latestAchievement: '100',
      reciteVersion: parseInt(newWord),
    }).then(res => {
        if (!res && !res.data && res.data.state == null) {
          return
        }
        if (res.data.state == 101) {
          message.error(res.data.msg)
          return
        } else if (res.data.state !== 0) {
          message.error('服务器开小差了')
          return
        }
        message.success('设置成功!');
        this.setState({ 
          showOver: false,
          realName: realName});
    }).catch(err => {
        message.error('设置失败!');
    });
  }
  // 选词库
  onChangeStore(value) {
    console.log(value);
    this.getHomeMes(value);
  }
  // realName
  onInputRealName(event) {
    this.setState({
      userInfo: {
        ...this.state.userInfo,
        realName: event.target.value
      }
    });
  }
  // city
  onInputCity(event) {
    this.setState({
      userInfo: {
        ...this.state.userInfo,
        city: event.target.value
      }
    });
  }
  // phone
  onInputPhone(event) {
    this.setState({
      userInfo: {
        ...this.state.userInfo,
        phone: event.target.value
      }
    });
  }
  // province
  onInputProvince(event) {
    this.setState({
      userInfo: {
        ...this.state.userInfo,
        province: event.target.value
      }
    });
  }
  // email
  onInputEmail(event) {
    this.setState({
      userInfo: {
        ...this.state.userInfo,
        email: event.target.value
      }
    });
  }
  // area
  onInputArea(event) {
    this.setState({
      userInfo: {
        ...this.state.userInfo,
        area: event.target.value
      }
    });
  }
  // qqNumber
  onInputQQNumber(event) {
    this.setState({
      userInfo: {
        ...this.state.userInfo,
        qqNumber: event.target.value
      }
    });
  }
  // school
  onInputSchool(event) {
    this.setState({
      userInfo: {
        ...this.state.userInfo,
        school: event.target.value
      }
    });
  }
  // newWord
  onInputNewWord(value) {
    this.setState({
      userInfo: {
        ...this.state.userInfo,
        newWord: value
      }
    });
  }
  // grade
  onInputGrade(event) {
    this.setState({
      userInfo: {
        ...this.state.userInfo,
        grade: event.target.value
      }
    });
  }

  componentDidMount() {
    this.getHomeMes();
  }

  render() {
    const {
      showOver,
      storeArr,
      isSelectDisable
    } = this.state;

    const {
      count,
      dictionaryId,
      dictionaryName,
      describe,
      picture,
      isRecite,
      haveRecite,
    } = this.state.currentDic;

    const {
      recitedWordsNumber,
      todayWordsPlan
    } = this.state.reciteWordInfo;

    const {
      allChoice,
      currentAlreadyChoice,
      currentRecite,
      nextChoiceDay,
      surplusChoice,
      choiceIndex,
    } = this.state.wordsStatistics;

    const {
      realName,
      city,
      phone,
      province,
      email,
      area,
      qqNumber,
      school,
      newWord,
      grade
    } = this.state.userInfo;

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
                    <Link className="about-us" to="/about">关于我们</Link>
              </div>
              <div className="header_right">
                <div onClick={this.handleModeChange.bind(this, true)}>
                  <img className="login-icon" src={userIcon}></img>
                  <div className="login">Hi，{realName}</div>
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
                  <div className="left-top-shadow"></div>
                  <div className="top-line">
                    <div className="left-s">学习计划</div>
                    
                  </div>
                  <div className="sec-line">
                    <div className="sec-item">
                      <div className="day-count">{todayWordsPlan ? todayWordsPlan : '0'}</div>
                      <div className="day-text">今日计划背词数</div>
                    </div>
                    <div className="sec-item">
                      <div className="day-count">{recitedWordsNumber ? recitedWordsNumber : '0'}</div>
                      <div className="day-text">全部已背词数</div>
                    </div>
                  </div>
                  <div className="thr-line">
                    <div className={nextChoiceDay > 0  ? 'text-btn' : 'text-btn-none'} onClick={this.handleStart.bind(this)}>
                      开始背词
                    </div>
                  </div>
                </div>
                <div className="left-title left-sec">
                  小测验
                </div>
                <div className="left-sec-area">
                  <div className="left-sec-shadow"></div>
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
                  <div className="right-top-shadow"></div>
                  <div className="now-store">
                    当前词库
                    <div className="choose-store">
                      <span className="ant-input-affix-wrapper word-ant-input-affix-wrapper">
                        <div className= "word-icon">
                          <span className="ant-input-prefix"><div className="my-icon">选择词库</div></span>
                        </div>
                        {storeArr.length != 0 && storeArr[0] != null &&
                        <Select 
                          defaultValue={dictionaryId}
                          disabled={false}
                          listHeight={100}
                          size="large"
                          style={{ width: 220 }}
                          onChange={this.onChangeStore.bind(this)}>
                          {storeArr.map((val, i) => <Select.Option value={val.dictionaryId} key={i + 'select'}>{`${val.dictionaryName}`}</Select.Option>)}
                        </Select>
                        }
                      </span>
                    </div>
                  </div>
                  <div className="main-place">
                    <img src={GET4}></img>
                    <div>
                      <div className="main-title">
                        {dictionaryName}
                      </div>
                      <div className="main-info">
                        <div className="main-t">
                          总计：{count}词
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
                          {currentAlreadyChoice ? currentAlreadyChoice : '0'}
                        </div>
                      </div>
                      <div className="detail-item">
                        <div className="de-it-name">
                          剩余待背：
                        </div>
                        <div className="de-it-num de-it-color2">
                          {currentRecite ? currentRecite : '0'}
                        </div>
                      </div>
                    </div>
                    <div className="de-row">
                      <div className="detail-item">
                        <div className="de-it-name">
                          剩余待选：
                        </div>
                        <div className="de-it-num">
                          {surplusChoice ? surplusChoice : '0'}
                        </div>
                      </div>
                      <div className="detail-item">
                        <div className="de-it-name">
                          总计词数：
                        </div>
                        <div className="de-it-num de-it-color3">
                          {allChoice ? allChoice : '0'}
                        </div>
                      </div>
                    </div>
                  </div>
                  {
                    surplusChoice == 0
                    ?
                    (
                      <div className="choose-tip">
                        {currentRecite !== 0
                            ?
                             "选词已结束"
                            :
                             "该词库以背完"
                        }
                        {/* <span className="big-text">{nextChoiceDay}</span>天 */}
                      </div>
                    )
                    :
                    (
                      <div>
                          <div className="thr-line">
                            <div className={isRecite == haveRecite ? 'text-btn' : 'text-btn-none'} onClick={this.handleChoose.bind(this, choiceIndex)}>
                              开始选词
                            </div>
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
                        value={realName}/>
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
                        value={qqNumber}/>
                      {/* <Input 
                        className="pass-mar word-icon"
                        size="large" 
                        placeholder="请输入每日背词数" 
                        prefix={<div className="my-icon">每日背生词数</div>} 
                        onChange={this.onInputNewWord.bind(this)} 
                        value={newWord}/> */}
                        <span className="pass-mar ant-input-affix-wrapper word-ant-input-affix-wrapper">
                          <div className= "word-icon">
                            <span className="ant-input-prefix"><div className="my-icon">每日背词数</div></span>
                          </div>
                          <Select 
                            defaultValue={`${newWord}个`} 
                            // maxTagCount="3"
                            disabled={isSelectDisable}
                            listHeight={100}
                            size="large"
                            style={{ width: 220 }}
                            onChange={this.onInputNewWord.bind(this)}>
                            {wordCountArr.map((val, i) => <Select.Option value={val} key={i + 'select'}>{`${val}个`}</Select.Option>)}
                          </Select>
                        </span>
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
                  <div className="log-out" onClick={this.logOut.bind(this)}>
                    退出登录
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
