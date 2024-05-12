import loadable from "@loadable/component";
import React, { useContext, useEffect, useState } from "react";
import promise from "../../pages/Transfer/assets/promise.png";
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


const Root = ({location, isLogin}) => {
  const [userInfo, setUserInfo] = useState();
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
  const [showOver, setShowOver] = useState(false);
  const [storeArr, setStoreArr] = useState([]);
  const [isSelectDisable, setIsSelectDisable] = useState(false);
  const [showTips, setShowTips] = useState(false);
  const [feedbackModalVisible, setFeedbackModalVisible] = useState(false);
  const [showRegister, setShowRegister] = useState(false);
  const [studentRegisterModalVisible, setStudentRegisterModalVisible] = useState(false);
  const [showTeacherLoginModal, setShowTeacherLoginModal] = useState(false);
  const [showStudentLoginModal, setShowStudentLoginModal] = useState(false);
  const [planSelectModalVisible, setPlanSelectModalVisible] = useState()

  const { schoolList, getSchoolList } = useContext(LayoutContext);



  // 蒙层s
  const handleModeChange = (showOver) => {
    setShowOver(showOver);
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
  // 获取用户信息
  const getMes = () => {
    console.log("getMes");
    HTTP.get("/profile/user")
      .then((res) => {
        if (!res && !res.data && res.data.state == null) {
          message.error("服务器开小差了");
          return;
        }
        let responseData = res.data.data;
        if (responseData) {
          const info = {
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
          };
          setUserInfo(info);
          setIsSelectDisable(responseData.reciteVersion === 0 ? false : true);
        }
      })
      .catch((err) => {
        message.error("个人信息获取失败!");
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

  useEffect(() => {
    if (isLogin) {
      getHomeMes();
    }
  }, [isLogin])

  const updateUserInfo = (info) => {
    setUserInfo(info);
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
  }



    
    return (
      <div className="layout_header">
        <div className={`fix_header_main ${ isLogin && 'login' }`}>
          <div className="header_left">
            <img className="main-img" src={promise}></img>
            {isLogin ? (
              <>
                {/* <Link className={`home-page ${location.pathname === '/transfer' && 'check'}`} to="/transfer">
                  首页
                </Link> */}
                <Link className={`exam ${location.pathname === '/examAndWrite' && 'check'}`} to="/examAndWrite">
                  考试&作文
                </Link>
                <Link className={`recite-words ${location.pathname === '/reciteWordsFallback' && 'check'}`} to="/reciteWordsFallback">
                  背词
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
                  onClick={() => handleModeChange(true)}
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
        {showOver && <UserInfoModal isSelectDisable={isSelectDisable} visible={showOver} close={() => setShowOver(false)} defaultUserInfo={userInfo} updateUserInfo={updateUserInfo} />}
        <FeedbackModal visible={feedbackModalVisible} close={hideFeedbackModal.bind(this)} />
        <TeacherLoginModal visible={showTeacherLoginModal} close={closeTeacherLogin} showRegister={showRegister} />
        <StudentLoginModal visible={showStudentLoginModal} close={closeStudentLogin} showRegister={showRegister} />
        <RegisterModal visible={showRegister} close={closeRegister} showLogin={showTeacherLogin} />
        <StudentRegisterModal visible={studentRegisterModalVisible} close={closeStudentRegister} showLogin={showStudentLogin} />
        <PlanSelectModal visible={planSelectModalVisible} close={() => setPlanSelectModalVisible(false)} confirm={planSelectConfirm} schoolList={schoolList} />
      </div>
    );
};

export default withRouter(Root);
