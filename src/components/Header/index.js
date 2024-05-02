import loadable from "@loadable/component";
import React, { Component } from "react";
import promise from "../../pages/Transfer/assets/promise.png";
import userIcon from "../../pages/Transfer/assets/userIcon.png";
import wechat from "../../pages/Transfer/assets/qiyewechat.png";
import "./index.less";
import HTTP from "../../utils/api.js";
import { Input, Select, message, Popover, Divider } from "antd";
import baseUrl from "../../utils/config.js";
import FeedbackModal from "../FeedbackModal/index.js";
import { UserInfoModal } from "../UserInfoModal/index.jsx";
import { Link } from "react-router-dom";
import { withRouter } from "react-router";
import { LoginModal } from "../LoginModal/index.jsx";
import Login from "../../pages/Home/index.js";
import { RegisterModal } from "../RegisterModal/index.jsx";
import { StudentRegisterModal } from "../StudentRegisterModal/index.jsx";



const wordCountArr = [6, 9, 12, 15, 18, 21, 24, 27, 30];
const emailReg = new RegExp(
  "^[a-z0-9]+([._\\-]*[a-z0-9])*@([a-z0-9]+[-a-z0-9]*[a-z0-9]+.){1,63}[a-z0-9]+$"
);
const qqReg = /^[1-9][0-9]{4,14}$/;
const phoneReg = /^[1][1,2,3,4,5,7,8,9][0-9]{9}$/;
const { TextArea } = Input;

class Root extends Component {
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
        userId: 0,
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
      actTab: 1,
      stale: false,
      errorStale: false,
      showTips: false,
      feedbackModal: false,
      upDataModal: false,
      weixin: "",
      qus: "",
      fileList: [],
      writingList: [],
      showLogin: false,
      showRegister: false,
      showStudentRegister: false,
      loginType: 'student',
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
    window.location.href = `${baseUrl}/#/transfer`;
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
      headers: {
        mode: "dev",
      },
    })
      .then(async (res) => {
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
          //   const testInfo = responseData.testInfo.filter(item=>item.testType !== 'errorTestPaper');
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
    console.log("getMes");
    HTTP.get("/profile/user")
      .then((res) => {
        if (!res && !res.data && res.data.state == null) {
          message.error("服务器开小差了");
          return;
        }
        let responseData = res.data.data;
        if (responseData) {
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
              userId: responseData.userId || 0,
            },
            isSelectDisable: responseData.reciteVersion === 0 ? false : true,
            // showOver: responseData.reciteVersion > 0 ? false : true,
          });
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

  getWritingExamList() {
    HTTP.get(`/stu-writing-exam/list2?status=1&submit=0&pageNo=1&pageSize=10`)
      .then((res) => {
        this.setState({
          writingList: res?.data?.data?.data,
        });
      })
      .catch((err) => {
        console.log("请求失败:", err);
      });
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
  handleWritingClick(val) {
    window.location.href = `${baseUrl}/#/writingDetail?paperId=${val.paperId}`;
  }
  jumpHis() {
    window.location.href = `${baseUrl}/#/writingList`;
  }
  jumpAbout() {
    window.location.href = `${baseUrl}/#/about`;
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

  async componentDidMount() {
    // await this.getHomeMes();
    // setTimeout(() => {
    //   this.getWordList();
    // });
  }

  componentDidUpdate(prevProps) {
    if (this.props.isLogin !== prevProps.isLogin && this.props.isLogin) {
      this.getHomeMes();
    }
  }

  updateUserInfo = (info) => {
    this.setState({
      userInfo: info
    })
  }

  showLogin = (type) => {
    this.setState({
      showLogin: true,
      loginType: type,
      showRegister: false,
    });
  }

  closeLogin = () => {
    this.setState({
      showLogin: false,
    });
  }

  showRegister = () => {
    this.setState({
      showLogin: false,
      showRegister: true,
    });
  }

  closeRegister = () => {
    this.setState({
      showRegister: false,
    });
  }

  closeStudentRegister = () => {
    this.setState({
      showStudentRegister: false,
    });
  }

  showStudentRegister = () => {
    this.setState({
      showStudentRegister: true,
    });
  }

  render() {
    const { location, isLogin } = this.props;
    const {
      showOver,
      isSelectDisable,
      showTips,
      feedbackModal,
      upDataModal,
      weixin,
      qus,
      activeTab,
      showLogin,
      showRegister,
      showStudentRegister,
      loginType,
    } = this.state;

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
    return (
      <div className="layout_header">
        <div className={`fix_header_main ${ isLogin && 'login' }`}>
          <div className="header_left">
            <img className="main-img" src={promise}></img>
            {isLogin ? (
              <>
                <Link className={`home-page ${location.pathname === '/transfer' && 'check'}`} to="/transfer">
                  首页
                </Link>
                <Link className={`dashboard-page ${location.pathname === '/dashboard' && 'check'}`} to="/dashboard">
                  数据中心
                </Link>
              </>
            ) : (
              <Link className={`home-page ${location.pathname === '/home' || location.pathname === '/' && 'check'}`} to="/">
                首页
              </Link>
            )}
            <Link className={`about-us ${location.pathname === '/about' && 'check'}`} to="/about">
              关于我们
            </Link>
            <Link className={`app-download ${location.pathname === '/download' && 'check'}`} to="/download">
              App下载
            </Link>
          </div>
          {!isLogin ? (
            <div className={`header_right unLogin ${location.pathname === '/download' && 'download'}`}>
              <Popover
                content={(
                  <div className="login-popover">
                    <div className="login-item" onClick={this.showRegister}>教师注册</div>
                    <Divider style={{ margin: 0 }} />
                    <div className="login-item" onClick={this.showStudentRegister}>学生注册</div>
                  </div>
                )}
              >
                <div
                  className="register"
                >
                  注册
                </div>
              </Popover>
              <Popover
                content={(
                  <div className="login-popover">
                    <div className="login-item" onClick={() => this.showLogin('teacher')}>教师登录</div>
                    <Divider style={{ margin: 0 }} />
                    <div className="login-item" onClick={() => this.showLogin('student')}>学生登录</div>
                  </div>
                )}
              >
                <div
                  className="login"
                >
                  登录
                </div>
              </Popover>
              
            </div>
          ): (
            <div
            className="header_right isLogin"
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
          )}
        </div>
        {showOver && <UserInfoModal isSelectDisable={isSelectDisable} visible={showOver} close={() => this.setState({showOver: false })} defaultUserInfo={this.state.userInfo} updateUserInfo={this.updateUserInfo} />}
        <FeedbackModal visible={feedbackModal} close={this.hideFeedbackModal.bind(this)} />
        <LoginModal loginType={loginType} visible={showLogin} close={this.closeLogin} showRegister={this.showRegister} />
        <RegisterModal visible={showRegister} close={this.closeRegister} showLogin={this.showLogin} />
        <StudentRegisterModal visible={showStudentRegister} close={this.closeStudentRegister} showLogin={this.showLogin} />
      </div>
    );
  }
}

export default withRouter(Root);
