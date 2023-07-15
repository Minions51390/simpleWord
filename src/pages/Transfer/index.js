import React from "react";
import "./index.less";
import { Link } from "react-router-dom";
import HTTP from "../../utils/api.js";
import {
  Button,
  IconFont,
  Carousel,
  Form,
  Input,
  Select,
  Checkbox,
  Col,
  Row,
  Radio,
  message,
  Upload,
} from "antd";
import { LeftOutlined, RightOutlined } from "@ant-design/icons";
import baseUrl from "../../utils/config.js";
import promise from "./assets/promise.png";
import rightBg from "./assets/rightBg.png";
import emailpng from "./assets/email.png";
import phonepng from "./assets/phone.png";
import btBg from "./assets/btBg.png";
import cirBg from "./assets/cirBg.png";
import GET4 from "./assets/CET-4.png";
import userIcon from "./assets/userIcon.png";
import wechat from "./assets/qiyewechat.png";
const wordCountArr = [6, 9, 12, 15, 18, 21, 24, 27, 30];
const emailReg = new RegExp(
  "^[a-z0-9]+([._\\-]*[a-z0-9])*@([a-z0-9]+[-a-z0-9]*[a-z0-9]+.){1,63}[a-z0-9]+$"
);
const qqReg = /^[1-9][0-9]{4,14}$/;
const phoneReg = /^[1][1,2,3,4,5,7,8,9][0-9]{9}$/;
// const storeArr = []
const contentStyle = {
  height: "160px",
  color: "#fff",
  lineHeight: "160px",
  textAlign: "center",
  background: "#364d79",
};
const { TextArea } = Input;
export default class Login extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      userInfo: {
        realName: "",
        city: "",
        phone: "",
        province: "",
        email: "",
        area: "",
        qqNumber: "",
        school: "",
        newWord: "",
        grade: "",
      },
      currentDic: {
        count: "",
        dictionaryId: "",
        dictionaryName: "",
        describe: "",
        picture: "",
      },
      reciteWordInfo: {
        recitedWordsNumber: 0,
        todayWordsPlan: 6,
        canRecite: true,
      },
      errorWordInfo: {
        allCount: 100,
        recitedCount: 80,
        noRecitedTaskCount: 3,
      },
      wordsStatistics: {
        allChoice: "",
        currentAlreadyChoice: "",
        currentRecite: "",
        surplusChoice: "",
        choiceIndex: 0,
        choiceWordsMethod: "arbitrarily",
      },
      testInfo: [],
      showOver: false,
      storeArr: [],
      isSelectDisable: false,
      checkedTab: "home",
      actTab: 1,
      stale: false,
      errorStale: false,
      showTips: false,
      feedbackModal: false,
      upDataModal: false,
      weixin: "",
      qus: "",
      fileList: [],
    };
  }

  canErrorJump() {
    const { testInfo } = this.state;
    for (let index = 0; index < testInfo.length; index++) {
      if (testInfo[index].testType === "errorTestPaper") {
        return true;
      }
    }
    return false;
  }

  findTextType(testType) {
    const { testInfo } = this.state;
    for (let index = 0; index < testInfo.length; index++) {
      if (testInfo[index].testType === testType) {
        return true;
      }
    }
    return false;
  }

  jumpTextPage() {
    const { testInfo } = this.state;
    let errorTextObj = {};
    for (let index = 0; index < testInfo.length; index++) {
      if (testInfo[index].testType === "errorTestPaper") {
        errorTextObj = testInfo[index];
        break;
      }
    }
    if (!errorTextObj.paperId) {
      return;
    }
    window.location.href = `${baseUrl}/#/testWord?testType=${errorTextObj.testType}&paperId=${errorTextObj.paperId}`;
  }
  changeTab(val) {
    this.setState({
      actTab: val,
    });
  }
  // 蒙层s
  handleModeChange(showOver, e) {
    e.stopPropagation();
    this.setState({ showOver });
  }
  notLogin() {
    window.location.href = `${baseUrl}/#/home`;
    // message.info('请登录后使用');
  }
  onTabClick(tabName) {
    this.setState({
      checkedTab: tabName,
    });
  }
  // 开始背词
  handleStart(type) {
    const { stale } = this.state;
    const { canRecite } = this.state.reciteWordInfo;
    const { dictionaryName } = this.state.currentDic;
    if (this.findTextType("testPaper")) {
      message.info("请先完成测验~");
      return;
    }
    if (canRecite) {
      if (type === "restart") {
        window.location.href = `${baseUrl}/#/reciteWords?lib_name=${dictionaryName}&isStale=false`;
      } else {
        window.location.href = `${baseUrl}/#/reciteWords?lib_name=${dictionaryName}&isStale=${!!stale}`;
      }
    }
    return;
  }

  // 错词 开始背词
  jumpRecitePage(type) {
    const { dictionaryName } = this.state.currentDic;
    const { errorStale } = this.state;
    const { ewCanRecite } = this.state.errorWordInfo;
    if (ewCanRecite) {
      if (type === "restart") {
        window.location.href = `${baseUrl}/#/reciteWords?lib_name=${dictionaryName}&planType=error&isStale=false`;
      } else {
        window.location.href = `${baseUrl}/#/reciteWords?lib_name=${dictionaryName}&planType=error&isStale=${!!errorStale}`;
      }
    }
  }

  // 开始选词
  handleChoose(choiceIndex) {
    const { newWord } = this.state.userInfo;
    const { dictionaryId, dictionaryName } = this.state.currentDic;
    if (!newWord) {
      this.setState({
        showOver: true,
      });
      message.info("开始之前需要每日背词数哦~");
    } else {
      window.location.href = `${baseUrl}/#/chooseWord?lib_name=${dictionaryName}&lib_id=${dictionaryId}&choiceIndex=${choiceIndex}&wordcount=${newWord}`;
    }
  }

  // 开始测试
  handleTest(testType, paperId) {
    // const {newWord} = this.state.userInfo;
    // const {dictionaryId, dictionaryName} = this.state.currentDic;
    window.location.href = `${baseUrl}/#/testWord?testType=${testType}&paperId=${paperId}`;
    // if(!newWord) {
    //   this.setState({
    //     showOver: true
    //   });
    //   message.info("开始之前需要每日背词数哦~")
    // } else {

    // }
  }
  // 获取首页信息
  async getHomeMes(dicId) {
    return HTTP.get("/plan/info", {
      params: {
        dicId: dicId,
      },
    })
      .then((res) => {
        if (!res && !res.data && res.data.state == null) {
          return;
        }
        if (res.data.state == 401) {
          message.error("请登录后使用");
          this.notLogin();
          return;
        } else if (res.data.state == 403) {
          message.error("当前身份无法访问该页面，请登录学生账号");
          window.location.href = `${baseUrl}/#/home`;
          return;
        } else if (res.data.state !== 0) {
          message.error("服务器开小差了");
          return;
        }
        this.getMes();
        this.getLib();
        let responseData = res.data.data;
        if (responseData && responseData.currentDic) {
          const currentDic = responseData.currentDic;
          this.setState({
            currentDic: currentDic,
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
        if (responseData && responseData.errorWordInfo) {
          const errorWordInfo = responseData.errorWordInfo;

          this.setState({
            errorWordInfo: errorWordInfo,
          });
        }
        if (responseData && responseData.wordsStatistics) {
          const testInfo = responseData.testInfo;
          this.setState({
            testInfo: testInfo,
          });
        }
        console.log(res);
      })
      .catch((err) => {
        message.error("服务器开小差了");
        console.log(err);
      });
  }
  // 获取词库信息
  getLib() {
    HTTP.get("/material/dictionary/list")
      .then((res) => {
        if (!res && !res.data && res.data.state == null) {
          return;
        }
        if (res.data.state == 401) {
          this.notLogin();
          return;
        } else if (res.data.state !== 0) {
          message.error("服务器开小差了");
          return;
        }
        let responseData = res.data.data;
        if (responseData) {
          const datas = responseData;
          this.setState({
            storeArr: datas,
          });
        }
        console.log("/material/dictionary/list", res);
      })
      .catch((err) => {
        message.error("服务器开小差了");
        console.log(err);
      });
  }
  // 获取用户信息
  getMes() {
    HTTP.get("/profile/user")
      .then((res) => {
        if (!res && !res.data && res.data.state == null) {
          message.error("服务器开小差了");
          return;
        }
        let responseData = res.data.data;
        if (responseData) {
          if (responseData.reciteVersion > 0) {
            this.setState({
              userInfo: {
                area: responseData.area || "",
                city: responseData.city || "",
                email: responseData.email || "",
                realName: responseData.realName || "",
                school: responseData.school || "",
                phone: responseData.phone || "",
                province: responseData.province || "",
                qqNumber: responseData.qqNumber || "",
                newWord: responseData.reciteVersion || 0,
                grade: responseData.grade || "",
              },
              isSelectDisable: responseData.reciteVersion === 0 ? false : true,
              showOver: false,
            });
          } else {
            this.setState({
              userInfo: {
                area: responseData.area || "",
                city: responseData.city || "",
                email: responseData.email || "",
                realName: responseData.realName || "",
                school: responseData.school || "",
                phone: responseData.phone || "",
                province: responseData.province || "",
                qqNumber: responseData.qqNumber || "",
                newWord: responseData.reciteVersion || 0,
                grade: responseData.grade || "",
              },
              isSelectDisable: responseData.reciteVersion === 0 ? false : true,
              showOver: true,
            });
          }
        }
      })
      .catch((err) => {
        message.error("个人信息获取失败!");
      });
  }

  getWordList() {
    if (
      !this.findTextType("testPaper") &&
      this.state.reciteWordInfo.canRecite
    ) {
      HTTP.get(`/plan/recite-paper?planType=usual`)
        .then((res) => {
          this.setState({
            stale: res?.data?.data?.startIndex > 0,
          });
        })
        .catch((err) => {
          console.log("请求失败:", err);
        });
    }

    const { noRecitedTaskCount } = this.state.errorWordInfo;
    if (noRecitedTaskCount > 0 && !this.findTextType("errorTestPaper")) {
      HTTP.get(`/plan/recite-paper?planType=error`)
        .then((res) => {
          this.setState({
            errorStale: res.data.data.startIndex > 0,
          });
        })
        .catch((err) => {
          console.log("请求失败:", err);
        });
    }
  }

  //退出登录
  logOut() {
    HTTP.get("/auth/logout")
      .then((res) => {
        window.location.href = `${baseUrl}/#/home`;
        console.log(res);
      })
      .catch((err) => {
        console.log(err);
      });
  }

  rowLength(val) {
    val.length >= 254 ? true : false;
  }

  onChange(a, b, c) {
    console.log(a, b, c);
  }
  // 提交信息
  saveMes() {
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
      grade,
    } = this.state.userInfo;
    // 真名检验
    if (!realName || this.rowLength(realName)) {
      message.error("真实姓名不能为空！");
      return;
    }
    // 省份检验
    if (this.rowLength(province)) {
      message.error("省份过长！");
      return;
    }
    // 市份检验
    if (this.rowLength(city)) {
      message.error("市份过长！");
      return;
    }
    // 区县检验
    if (this.rowLength(area)) {
      message.error("区县过长！");
      return;
    }
    // 学校检验
    if (this.rowLength(school)) {
      message.error("学校名过长！");
      return;
    }
    // 年级检验
    if (this.rowLength(grade)) {
      message.error("年级过长！");
      return;
    }
    // 手机号检验
    if (!phoneReg.test(phone) || this.rowLength(phone)) {
      message.error("手机号格式错误！");
      return;
    }
    // qq检验
    if (!qqReg.test(qqNumber) || this.rowLength(qqNumber)) {
      message.error("QQ号格式错误！");
      return;
    }
    // 邮箱检验
    if (!emailReg.test(email)) {
      message.error("邮箱格式不正确！");
      return;
    }
    // 每日背词数检验
    if (parseInt(newWord) >= 1000) {
      message.error("每日背词数不能大于1000！");
      return;
    }
    HTTP.post("/profile/user", {
      realName: realName,
      province: province,
      city: city,
      area: area,
      school: school,
      grade: grade,
      phone: phone,
      qqNumber: qqNumber,
      email: email,
      latestAchievement: "100",
      reciteVersion: parseInt(newWord),
    })
      .then((res) => {
        if (!res || !res.data || res.data.state == null) {
          return;
        }
        if (res.data.state == 101) {
          message.error(res.data.msg);
          return;
        } else if (res.data.state !== 0) {
          message.error("服务器开小差了");
          return;
        }
        message.success("设置成功!");
        this.setState({
          showOver: false,
          realName: realName,
        });
      })
      .catch((err) => {
        message.error("设置失败!");
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
        realName: event.target.value,
      },
    });
  }
  // city
  onInputCity(event) {
    this.setState({
      userInfo: {
        ...this.state.userInfo,
        city: event.target.value,
      },
    });
  }
  // phone
  onInputPhone(event) {
    this.setState({
      userInfo: {
        ...this.state.userInfo,
        phone: event.target.value,
      },
    });
  }
  // province
  onInputProvince(event) {
    this.setState({
      userInfo: {
        ...this.state.userInfo,
        province: event.target.value,
      },
    });
  }
  // email
  onInputEmail(event) {
    this.setState({
      userInfo: {
        ...this.state.userInfo,
        email: event.target.value,
      },
    });
  }
  // area
  onInputArea(event) {
    this.setState({
      userInfo: {
        ...this.state.userInfo,
        area: event.target.value,
      },
    });
  }
  // qqNumber
  onInputQQNumber(event) {
    this.setState({
      userInfo: {
        ...this.state.userInfo,
        qqNumber: event.target.value,
      },
    });
  }
  // school
  onInputSchool(event) {
    this.setState({
      userInfo: {
        ...this.state.userInfo,
        school: event.target.value,
      },
    });
  }
  // newWord
  onInputNewWord(value) {
    this.setState({
      userInfo: {
        ...this.state.userInfo,
        newWord: value,
      },
    });
  }
  // grade
  onInputGrade(event) {
    this.setState({
      userInfo: {
        ...this.state.userInfo,
        grade: event.target.value,
      },
    });
  }

  hoverHeader() {
    this.setState({
      showTips: true,
    });
  }

  blurHeader() {
    this.setState({
      showTips: false,
    });
  }

  showFeedbackModal() {
    this.setState({
      feedbackModal: true,
    });
  }

  hideFeedbackModal() {
    this.setState({
      feedbackModal: false,
    });
  }

  confirmFeed(e) {
    e.stopPropagation();
    this.setState({
      upDataModal: true,
    });
  }

  canStopPropagation(e) {
    e.stopPropagation();
  }

  onWeixinChange(event) {
    this.setState({
      weixin: event.target.value,
    });
  }

  onQusChange(event) {
    this.setState({
      qus: event.target.value,
    });
  }

  doUpDataModal() {
    this.setState({
      upDataModal: false,
      feedbackModal: false,
    });
  }

  uploadDate() {
    const { weixin, qus } = this.state;
    HTTP.post("/feedback", {
      tp: 3,
      weixin,
      desc: qus,
      pictures: [
        "https://img0.baidu.com/it/u=4162443464,2854908495&fm=253&fmt=auto&app=138&f=JPEG?w=800&h=500",
      ],
    });
    message.info("已提交~");
  }

  moduleUpdate() {
    this.uploadDate();
    this.doUpDataModal();
  }

  //   onChange(fileList) {
  //     this.setState({
  //       fileList,
  //     });
  //   }

  //   async onPreview(file) {
  //     let src = file.url;
  //     if (!src) {
  //       src = await new Promise((resolve) => {
  //         const reader = new FileReader();
  //         reader.readAsDataURL(file.originFileObj);
  //         reader.onload = () => resolve(reader.result);
  //       });
  //     }
  //     const image = new Image();
  //     image.src = src;
  //     const imgWindow = window.open(src);
  //     imgWindow?.document.write(image.outerHTML);
  //   }

  //   customRequest(file) {
  //     console.log(file);
  //   }

  async componentDidMount() {
    await this.getHomeMes();
    setTimeout(() => {
      this.getWordList();
    });
  }

  _renderItem(testInfo) {
    var testListBox = [];
    testInfo.forEach((value, index) => {
      let testTypeText = "";
      if (value.testType == "testPaper") {
        testTypeText = "当日小测";
      } else if (value.testType == "stageTestPaper") {
        testTypeText = "阶段考试";
      } else if (value.testType == "errorTestPaper") {
        testTypeText = "错题考试";
      } else {
        testTypeText = "试题考试";
      }

      testListBox.push(
        <div key={"item" + index}>
          <div className="test-title">{testTypeText}</div>
          <div className="test-text">考核完成后方可继续背词</div>
          <div className="thr-line">
            <div
              className="test-btn"
              onClick={this.handleTest.bind(
                this,
                value.testType,
                value.paperId
              )}
            >
              开始测验
            </div>
          </div>
        </div>
      );
    });
    return testListBox;
  }

  render() {
    const {
      showOver,
      storeArr,
      isSelectDisable,
      testInfo,
      checkedTab,
      actTab,
      stale,
      errorStale,
      showTips,
      feedbackModal,
      upDataModal,
      weixin,
      qus,
      fileList,
    } = this.state;

    const { count, dictionaryId, dictionaryName, describe, picture } =
      this.state.currentDic;

    const { recitedWordsNumber, todayWordsPlan, choiceWordsMethod, canRecite } =
      this.state.reciteWordInfo;
    const { allCount, recitedCount, noRecitedTaskCount, ewCanRecite } =
      this.state.errorWordInfo;

    const {
      allChoice,
      currentAlreadyChoice,
      currentRecite,
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
      grade,
    } = this.state.userInfo;
    const choiceText =
      choiceWordsMethod == "arbitrarily"
        ? "选词已结束"
        : "老师已开启全词库背词，无需选词";
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
            <div
              className={`home-page  ${checkedTab == "home" ? "check" : null}`}
              onClick={this.onTabClick.bind(this, "home")}
            >
              首页
            </div>
            <div
              className={`dashboard-page  ${
                checkedTab == "dashboard" ? "check" : null
              }`}
              onClick={this.onTabClick.bind(this, "dashboard")}
            >
              数据中心
            </div>
            <Link className="about-us" to="/about">
              关于我们
            </Link>
          </div>
          <div
            className="header_right"
            onMouseEnter={this.hoverHeader.bind(this)}
            onMouseLeave={this.blurHeader.bind(this)}
          >
            <div className="div">
              <img className="login-icon" src={userIcon}></img>
              <div className="login div">Hi，{realName}</div>
            </div>
            <div className={showTips ? "right_hover" : "right_hover none"}>
              <div
                className="item"
                onClick={this.handleModeChange.bind(this, true)}
              >
                个人信息
              </div>
              <div className="item" onClick={this.showFeedbackModal.bind(this)}>
                建议&反馈
              </div>
            </div>
          </div>
        </div>
        {checkedTab == "home" ? (
          <div className="main_dom">
            <div className="content-dom">
              <div className="content-left">
                <div className="left-title">背单词</div>
                <div className="left-top">
                  <div className="left-top-shadow"></div>
                  <div className="top-line">
                    <div
                      className={`left-s ${actTab === 1 ? "act" : ""}`}
                      onClick={this.changeTab.bind(this, 1)}
                    >
                      学习计划
                    </div>
                    <div
                      className={`left-s ${actTab === 2 ? "act" : ""}`}
                      onClick={this.changeTab.bind(this, 2)}
                    >
                      消灭错词
                    </div>
                  </div>
                  {actTab === 1 ? (
                    <div className="sec-line">
                      <div className="sec-item">
                        <div className="day-count">
                          {todayWordsPlan ? todayWordsPlan : "0"}
                        </div>
                        <div className="day-text">今日计划背词数</div>
                      </div>
                      <div className="sec-item">
                        <div className="day-count">
                          {recitedWordsNumber ? recitedWordsNumber : "0"}
                        </div>
                        <div className="day-text">全部已背词数</div>
                      </div>
                    </div>
                  ) : (
                    <div className="sec-line">
                      <div className="sec-item sec-err">
                        <div className="err-i">
                          <div>累计错词数：</div>
                          <div className="wei">{allCount}</div>
                        </div>
                        <div className="err-i">
                          <div>待背任务数：</div>
                          <div className="wei">{noRecitedTaskCount}</div>
                        </div>
                        <div className="err-i">
                          <div>已背错词数：</div>
                          <div className="wei">{recitedCount}</div>
                        </div>
                      </div>
                      <div className="sec-item err-text">
                        <div className="tag">
                          每累计错词20个，为您自动生成一份背词任务；错词任务不会影响日常背词计划，要自觉加油哦~
                        </div>
                      </div>
                    </div>
                  )}

                  {actTab === 1 ? (
                    <div className="thr-line">
                      <div
                        className={
                          canRecite
                            ? "text-btn"
                            : "text-btn-none"
                        }
                        onClick={this.handleStart.bind(this, "restart")}
                      >
                        开始背词
                      </div>
                      {stale ? (
                        <div
                          className={
                            canRecite
                              ? "text-btn ml24"
                              : "text-btn-none ml24"
                          }
                          onClick={this.handleStart.bind(this, "continue")}
                        >
                          继续背词
                        </div>
                      ) : (
                        <div></div>
                      )}
                    </div>
                  ) : (
                    <div className="thr-line">
                      <div
                        className={
                          ewCanRecite
                            ? "text-btn"
                            : "text-btn-none"
                        }
                        onClick={this.jumpRecitePage.bind(this, "restart")}
                      >
                        开始背词
                      </div>
                      {errorStale ? (
                        <div
                          className={
                            ewCanRecite
                              ? "text-btn ml24"
                              : "text-btn-none ml24"
                          }
                          onClick={this.jumpRecitePage.bind(this, "continue")}
                        >
                          继续背词
                        </div>
                      ) : (
                        <div></div>
                      )}
                      <div
                        className={`checkit ${
                          !this.canErrorJump(testInfo) ? "disable" : ""
                        }`}
                        onClick={this.jumpTextPage.bind(this)}
                      >
                        开始检测
                      </div>
                    </div>
                  )}
                </div>
                <div className="left-title left-sec">考核测试</div>
                <div className="left-sec-area">
                  <div className="left-sec-shadow"></div>
                  {/* 暂无检测 */}
                  {testInfo.length == 0 ? (
                    <div className="thr-line">
                      <div className="test-btn-none">暂无检测</div>
                    </div>
                  ) : (
                    <div>
                      {testInfo.length >= 1 ? (
                        <div>
                          {/* 多个检测 */}

                          <Button
                            className="leftButton"
                            style={{ left: 26 }}
                            onClick={() => {
                              // 通过获取走马灯dom，调用Carousel的prev()方法
                              this.card.prev();
                            }}
                          >
                            <LeftOutlined />
                          </Button>
                          <Button
                            className="rightButton"
                            style={{ right: 26 }}
                            onClick={() => {
                              // 通过获取走马灯dom，调用Carousel的next()方法
                              this.card.next();
                            }}
                          >
                            <RightOutlined />
                          </Button>

                          <Carousel
                            ref={(e) => {
                              // 走马灯dom名card
                              this.card = e;
                            }}
                            infinite={false}
                            className="test-slider-box"
                            dots={"slider-dot"}
                          >
                            {this._renderItem(testInfo)}
                          </Carousel>
                        </div>
                      ) : (
                        <div>
                          {/* 一个检测 */}
                          <div className="test-title">当节小测</div>
                          <div className="test-text">
                            考核完成后方可继续背词
                          </div>
                          <div className="thr-line">
                            <div
                              className="test-btn"
                              onClick={this.handleChoose.bind(
                                this,
                                choiceIndex
                              )}
                            >
                              开始测验
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
              <div className="content-right">
                <div className="right-title">选词</div>
                <div className="right-top">
                  <div className="right-top-shadow"></div>
                  <div className="now-store">
                    当前词库
                    <div className="choose-store">
                      <span className="ant-input-affix-wrapper word-ant-input-affix-wrapper">
                        <div className="word-icon">
                          <span className="ant-input-prefix">
                            <div className="my-icon">选择词库</div>
                          </span>
                        </div>
                        {storeArr.length != 0 && storeArr[0] != null && (
                          <Select
                            defaultValue={dictionaryId}
                            disabled={true}
                            listHeight={100}
                            size="large"
                            style={{ width: 220 }}
                            onChange={this.onChangeStore.bind(this)}
                          >
                            {storeArr.map((val, i) => (
                              <Select.Option
                                value={val.dictionaryId}
                                key={i + "select"}
                              >{`${val.dictionaryName}`}</Select.Option>
                            ))}
                          </Select>
                        )}
                      </span>
                    </div>
                  </div>
                  <div className="main-place">
                    <img src={`${baseUrl}${picture}`}></img>
                    <div>
                      <div className="main-title">{dictionaryName}</div>
                      <div className="main-info">
                        <div className="main-t">总计：{count}词</div>
                        <div className="main-s">适合：{describe}</div>
                      </div>
                    </div>
                  </div>
                  <div className="choose-word">选择单词</div>
                  <div className="choose-detail">
                    <div className="de-row">
                      <div className="detail-item">
                        <div className="de-it-name">当前已选：</div>
                        <div className="de-it-num de-it-color1">
                          {currentAlreadyChoice ? currentAlreadyChoice : "0"}
                        </div>
                      </div>
                      <div className="detail-item">
                        <div className="de-it-name">剩余待背：</div>
                        <div className="de-it-num de-it-color2">
                          {currentRecite ? currentRecite : "0"}
                        </div>
                      </div>
                    </div>
                    <div className="de-row">
                      <div className="detail-item">
                        <div className="de-it-name">剩余待选：</div>
                        <div className="de-it-num">
                          {surplusChoice ? surplusChoice : "0"}
                        </div>
                      </div>
                      <div className="detail-item">
                        <div className="de-it-name">总计词数：</div>
                        <div className="de-it-num de-it-color3">
                          {allChoice ? allChoice : "0"}
                        </div>
                      </div>
                    </div>
                  </div>
                  {surplusChoice == 0 ? (
                    <div className="choose-tip">
                      {currentRecite !== 0 ? choiceText : "该词库已背完"}
                    </div>
                  ) : (
                    <div>
                      <div className="thr-line">
                        <div
                          className={"text-btn"}
                          onClick={this.handleChoose.bind(this, choiceIndex)}
                        >
                          开始选词
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
            <img className="bottom-img" src={btBg}></img>
          </div>
        ) : (
          <div className="dashboard-dom">
            <iframe
              className="dashboard-iframe"
              src="/admin/#/stu"
              // src="http://localhost:3006/admin/#/stu/"
              frameborder="no"
              border="0"
              marginwidth="0"
              marginheight="0"
              allowtransparency="yes"
            ></iframe>
          </div>
        )}
        {showOver ? (
          <div
            className="user-bg"
            onClick={this.handleModeChange.bind(this, false)}
          >
            <div
              className="user-area-top"
              onClick={this.handleModeChange.bind(this, true)}
            >
              <div className="title">个人信息</div>
              <div className="main-row">
                <div className="main-left">
                  <Input
                    className="pass-mar"
                    size="large"
                    placeholder="请输入您的姓名"
                    prefix={<div className="my-icon">姓名</div>}
                    onChange={this.onInputRealName.bind(this)}
                    value={realName}
                  />
                  <Input
                    className="pass-mar phone-icon"
                    size="large"
                    placeholder="请输入您的手机号"
                    prefix={<div className="my-icon">手机号</div>}
                    onChange={this.onInputPhone.bind(this)}
                    value={phone}
                  />
                  <Input
                    className="pass-mar"
                    size="large"
                    disabled
                    placeholder="请输入您的邮箱"
                    prefix={<div className="my-icon">邮箱</div>}
                    onChange={this.onInputEmail.bind(this)}
                    value={email}
                  />
                  <Input
                    className="pass-mar qq-icon"
                    size="large"
                    placeholder="请输入您的QQ号"
                    prefix={<div className="my-icon">QQ号</div>}
                    onChange={this.onInputQQNumber.bind(this)}
                    value={qqNumber}
                  />
                  {/* <Input 
                        className="pass-mar word-icon"
                        size="large" 
                        placeholder="请输入每日背词数" 
                        prefix={<div className="my-icon">每日背生词数</div>} 
                        onChange={this.onInputNewWord.bind(this)} 
                        value={newWord}/> */}
                  <span className="pass-mar ant-input-affix-wrapper word-ant-input-affix-wrapper">
                    <div className="word-icon">
                      <span className="ant-input-prefix">
                        <div className="my-icon">每日背词数</div>
                      </span>
                    </div>
                    <Select
                      defaultValue={`${newWord}个`}
                      // maxTagCount="3"
                      disabled={isSelectDisable}
                      listHeight={100}
                      size="large"
                      style={{ width: 220 }}
                      onChange={this.onInputNewWord.bind(this)}
                    >
                      {wordCountArr.map((val, i) => (
                        <Select.Option
                          value={val}
                          key={i + "select"}
                        >{`${val}个`}</Select.Option>
                      ))}
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
                    value={province}
                  />
                  <Input
                    className="pass-mar"
                    size="large"
                    placeholder="请输入您的市份"
                    prefix={<div className="my-icon">市份</div>}
                    onChange={this.onInputCity.bind(this)}
                    value={city}
                  />
                  <Input
                    className="pass-mar"
                    size="large"
                    placeholder="请输入您的区县"
                    prefix={<div className="my-icon">区县</div>}
                    onChange={this.onInputArea.bind(this)}
                    value={area}
                  />
                  <Input
                    className="pass-mar"
                    size="large"
                    placeholder="请输入您的学校"
                    prefix={<div className="my-icon">学校</div>}
                    onChange={this.onInputSchool.bind(this)}
                    value={school}
                  />
                  <Input
                    className="pass-mar"
                    size="large"
                    placeholder="请输入您的年级"
                    prefix={<div className="my-icon">年级</div>}
                    onChange={this.onInputGrade.bind(this)}
                    value={grade}
                  />
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
        ) : (
          <div></div>
        )}
        {feedbackModal ? (
          <div className="feed-bg" onClick={this.hideFeedbackModal.bind(this)}>
            <div
              className="feed-area-top"
              onClick={(e) => this.canStopPropagation(e)}
            >
              <div className="title">建议&反馈</div>
              {upDataModal ? (
                <div className="warp">
                  <div className="text">您的微信：</div>
                  <Input
                    style={{ width: 400 }}
                    value={weixin}
                    onChange={this.onWeixinChange.bind(this)}
                  />
                  <div className="text">描述您的问题:</div>
                  <TextArea
                    value={qus}
                    showCount
                    maxLength={400}
                    style={{ height: 80, width: 400, resize: "none" }}
                    onChange={this.onQusChange.bind(this)}
                  />
                  {/* <div className="text">相关图片:</div>
                  <Upload
                      action=""
                      listType="picture-card"
                      fileList={fileList}
                      method="post"
                      onChange={this.onChange.bind(this)}
                      onPreview={this.onPreview.bind(this)}
                      customRequest={this.customRequest.bind(this)}
                    >
                      {fileList.length < 10 && "+ Upload"}
                    </Upload> */}
                  <div className="tools">
                    <div
                      className="close"
                      onClick={this.doUpDataModal.bind(this)}
                    >
                      关闭
                    </div>
                    <div className="btn" onClick={this.moduleUpdate.bind(this)}>
                      提交
                    </div>
                  </div>
                </div>
              ) : (
                <div className="warp">
                  <div className="content">
                    如果您在使用本软件的过程中，遇到了什么问如果您在使用本软件的过程中，遇到了什么问题，请添加下方官方客服微信，并向客服描述您所遇到的问题，我们将积极为您解决。感谢您对支持！
                  </div>
                  <img className="wechat-icon" src={wechat}></img>
                  <div className="tips">微信扫一扫</div>
                  <div className="btn" onClick={(e) => this.hideFeedbackModal(e)}>
                    确定
                  </div>
                </div>
              )}
            </div>
          </div>
        ) : (
          null
        )}
      </div>
    );
  }
}
