import loadable from "@loadable/component";
import React, { useContext, useEffect, useState } from "react";
import Logo from "../../assets/appLogo.png";
import userIcon from "../../pages/Transfer/assets/userIcon.png";
import "./index.less";
import HTTP, { HTTPV2 } from "../../utils/api.js";
import { message, Popover, Divider } from "antd";
import baseUrl from "../../utils/config.js";
import FeedbackModal from "../FeedbackModal/index.js";
import { UserInfoModal } from "../UserInfoModal/index.jsx";
import { Link } from "react-router-dom";
import { withRouter } from "react-router";
import { TeacherLoginModal } from "../TeacherLoginModal/index.jsx";
import { RegisterModal } from "../RegisterModal/index.jsx";
import { StudentRegisterModal } from "../StudentRegisterModal/index.jsx";
import { StudentLoginModal } from "../StudentLoginModal/index.jsx";
import { PlanSelectModal } from "../PlanSelectModal/index.jsx";
import { LayoutContext } from "../Layout/index.jsx";
import { ToCUserInfoModal } from "../toCUserInfoModal/index.jsx";


const Root = ({location, isLogin}) => {
  const [currentDic, setCurrentDic] = useState();
  const [reciteWordInfo, setReciteWordInfo] = useState({
    recitedWordsNumber: 0,
    todayWordsPlan: 6,
    canRecite: true,
  });

  const [errorWordInfo, setErrorWordInfo] = useState({
    allCount: 100,
    recitedCount: 80,
    noRecitedTaskCount: 3,
  });

  const [wordsStatistics, setWordsStatistics] = useState({
    allChoice: "",
    currentAlreadyChoice: "",
    currentRecite: "",
    surplusChoice: "",
    choiceIndex: 0,
    choiceWordsMethod: "arbitrarily",
  });

  const [testInfo, setTestInfo] = useState([]);
  const [tobUserInfoModalVisible, setTobUserInfoModalVisible] = useState(false);
  const [storeArr, setStoreArr] = useState([]);
  const [showTips, setShowTips] = useState(false);
  const [feedbackModalVisible, setFeedbackModalVisible] = useState(false);
  const [showRegister, setShowRegister] = useState(false);
  const [studentRegisterModalVisible, setStudentRegisterModalVisible] = useState(false);
  const [showTeacherLoginModal, setShowTeacherLoginModal] = useState(false);
  const [showStudentLoginModal, setShowStudentLoginModal] = useState(false);
  const [planSelectModalVisible, setPlanSelectModalVisible] = useState();
  const [toCUserInfoModalVisible, setToCUserInfoModalVisible] = useState(false);

  const { schoolList, getSchoolList, isToB, userInfo, getUserInfo } = useContext(LayoutContext);



  const showUserInfoModal = () => {
    if (isToB) {
      setTobUserInfoModalVisible(true);
    } else {
      setToCUserInfoModalVisible(true);
    }
  }

  const notLogin = () => {
    window.location.href = `${baseUrl}/#/home`;
    // message.info('请登录后使用');
  }


  // 获取首页信息
  const getHomeMes = async (dicId) => {
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
          notLogin();
          return;
        } else if (res.data.state == 403) {
          message.error("当前身份无法访问该页面，请登录学生账号");
          window.location.href = `${baseUrl}/#/home`;
          return;
        } else if (res.data.state !== 0) {
          message.error("服务器开小差了");
          return;
        }
        getMes();
        getLib();
        let responseData = res.data.data;
        if (responseData && responseData.currentDic) {
          const currentDic = responseData.currentDic;
          setCurrentDic(currentDic);
        }
        if (responseData && responseData.wordsStatistics) {
          const wordsStatistics = responseData.wordsStatistics;
          setWordsStatistics(wordsStatistics);
        }
        if (responseData && responseData.reciteWordInfo) {
          const reciteWordInfo = responseData.reciteWordInfo;
          setReciteWordInfo(reciteWordInfo);
        }
        if (responseData && responseData.errorWordInfo) {
          const errorWordInfo = responseData.errorWordInfo;
          setErrorWordInfo(errorWordInfo);
        }
        if (responseData && responseData.wordsStatistics) {
          //   const testInfo = responseData.testInfo.filter(item=>item.testType !== 'errorTestPaper');
          const testInfo = responseData.testInfo;
          setTestInfo(testInfo);
        }
        console.log(res);
      })
      .catch((err) => {
        message.error("服务器开小差了");
        console.log(err);
      });
  }
  // 获取词库信息
  const getLib = () => {
    HTTP.get("/material/dictionary/list")
      .then((res) => {
        if (!res && !res.data && res.data.state == null) {
          return;
        }
        if (res.data.state == 401) {
          notLogin();
          return;
        } else if (res.data.state !== 0) {
          message.error("服务器开小差了");
          return;
        }
        let responseData = res.data.data;
        if (responseData) {
          const datas = responseData;
          setStoreArr(datas);
        }
        console.log("/material/dictionary/list", res);
      })
      .catch((err) => {
        message.error("服务器开小差了");
        console.log(err);
      });
  }


  const hoverHeader = () => {
    setShowTips(true);
  }

  const blurHeader = () => {
    setShowTips(false);
  }

  const showFeedbackModal = () => {
    setFeedbackModalVisible(true);
  }

  const hideFeedbackModal = () => {
    setFeedbackModalVisible(false);
  }

  const showTeacherLogin = () => {
    setShowTeacherLoginModal(true);
  }

  const closeTeacherLogin = () => {
    setShowTeacherLoginModal(false);
  }



  const showStudentLogin = () => {
    setShowStudentLoginModal(true);
  }

  const closeStudentLogin = () => {
    setShowStudentLoginModal(false);
  }

  const showTeacherRegister = () => {
    setShowTeacherLoginModal(false);
    setShowRegister(true);
  }

  const closeRegister = () => {
    setShowRegister(false);
  }

  const closeStudentRegister = () => {
    setStudentRegisterModalVisible(false);
  }

  const showStudentRegister = () => {
    setStudentRegisterModalVisible(true);
  }

  const planSelectConfirm = async planId => {
    await HTTPV2.post('/entity/select', {
      planId
    });
    message.success('切换成功');
    setPlanSelectModalVisible(false);
    getSchoolList();
    getUserInfo();
  }

  const logOut = () => {
    HTTPV2.get("/auth/logout")
      .then((res) => {
        location.reload();
      })
      .catch((err) => {
        console.log(err);
      });
  }



    
    return (
      <div className="layout_header">
        <div className={`fix_header_main ${ isLogin && 'login' }`}>
          <div className="header_left">
            <img className="main-img" src={Logo}></img>
            {isLogin ? (
              <>
                {/* <Link className={`home-page ${location.pathname === '/transfer' && 'check'}`} to="/transfer">
                  首页
                </Link> */}
                <Link className={`header-tab-item exam ${location.pathname === '/examAndWrite' && 'check'}`} to="/examAndWrite">
                  考试&作文
                </Link>
                <Link className={`header-tab-item recite-words ${location.pathname === '/reciteWordsFallback' && 'check'}`} to="/reciteWordsFallback">
                  背词
                </Link>
                {isToB && (
                  <Link className={`header-tab-item dashboard-page ${location.pathname === '/dashboard' && 'check'}`} to="/dashboard">
                    数据中心
                  </Link>
                )}
              </>
            ) : (
              <Link className={`header-tab-item home-page ${location.pathname === '/home' || location.pathname === '/' && 'check'}`} to="/">
                首页
              </Link>
            )}
            <Link className={`header-tab-item about-us ${location.pathname === '/about' && 'check'}`} to="/about">
              关于我们
            </Link>
            <Link className={`header-tab-item app-download ${location.pathname === '/download' && 'check'}`} to="/download">
              App下载
            </Link>
          </div>
          {!isLogin ? (
            <div className={`header_right unLogin ${location.pathname === '/download' && 'download'}`}>
              <Popover
                content={(
                  <div className="login-popover">
                    <div className="login-item" onClick={showTeacherRegister}>教师注册</div>
                    <Divider style={{ margin: 0 }} />
                    <div className="login-item" onClick={showStudentRegister}>学生注册</div>
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
                    <div className="login-item" onClick={() => showTeacherLogin()}>教师登录</div>
                    <Divider style={{ margin: 0 }} />
                    <div className="login-item" onClick={() => showStudentLogin()}>学生登录</div>
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
              onMouseEnter={hoverHeader}
              onMouseLeave={blurHeader}
            >
              <div className="div">
                <img className="login-icon" src={userIcon}></img>
                <div className="login div">Hi，{userInfo?.realName}</div>
              </div>
              <div className={showTips ? "right_hover" : "right_hover none"}>
                <div
                  className="item"
                  onClick={() => setPlanSelectModalVisible(true)}
                >
                  切换计划
                </div>
                <div
                  className="item"
                  onClick={showUserInfoModal}
                >
                  个人信息
                </div>
                <div className="item" onClick={showFeedbackModal}>
                  建议&反馈
                </div>
              </div>
            </div>
          )}
        </div>
        {tobUserInfoModalVisible && <UserInfoModal logOut={logOut} visible={tobUserInfoModalVisible} close={() => setTobUserInfoModalVisible(false)} defaultUserInfo={userInfo} />}
        <FeedbackModal visible={feedbackModalVisible} close={hideFeedbackModal.bind(this)} />
        <TeacherLoginModal visible={showTeacherLoginModal} close={closeTeacherLogin} showRegister={() => setShowRegister(true)} />
        <StudentLoginModal visible={showStudentLoginModal} close={closeStudentLogin} showRegister={() => setStudentRegisterModalVisible(true)} />
        <RegisterModal visible={showRegister} close={closeRegister} showLogin={showTeacherLogin} />
        <StudentRegisterModal visible={studentRegisterModalVisible} close={closeStudentRegister} showLogin={showStudentLogin} />
        <PlanSelectModal visible={planSelectModalVisible} close={() => setPlanSelectModalVisible(false)} confirm={planSelectConfirm} schoolList={schoolList} />
        <ToCUserInfoModal visible={toCUserInfoModalVisible} close={() => setToCUserInfoModalVisible(false)} userInfo={userInfo} logOut={logOut} />
      </div>
    );
};

export default withRouter(Root);
