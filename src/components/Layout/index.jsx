import React, { useState, useEffect, createContext, useMemo } from 'react';
import './index.less';
import Header from "../Header/index.js";
import { useLocation } from 'react-router-dom';
import { message } from 'antd';
import HTTP, { HTTPV2 } from "../../utils/api.js";
import baseUrl from '../../utils/config.js';
import { useHistory } from "react-router-dom";

const showHeaderList = [
  '/',
  '/transfer',
  '/home',
  '/dashboard',
  '/about',
  '/download',
  '/writingList',
  '/writingDetail',
  '/reciteWordsFallback',
  '/examAndWrite',
];

export const LayoutContext = createContext({});


export const Layout = ({ children }) => {
  const [userInfo, setUserInfo] = useState({});
  const [isLogin, setIsLogin] = useState(false);
  const [schoolList, setSchoolList] = useState([]);
  const { pathname } = useLocation();
  console.log('pathname', pathname);
  const showHeader = showHeaderList.some(item => item.toLowerCase() === pathname.toLowerCase());

  let history = useHistory();

  const notLogin = () => {
    // message.info("请登录后使用");
    window.location.href = `${baseUrl}/#/home`;
  }

  const getSchoolList = async () => {
    const res = await HTTPV2.get('/entity/list');
    const { schoolList = [] } = res?.data?.data;
    if (!schoolList.length) {
      history.push("/reciteWordsFallback");
      return;
    }
    const filteredSchoolLost = schoolList.filter(item => item.classStatus !== 0);
    setSchoolList(filteredSchoolLost);
  }

  const isToB = useMemo(() => {
    return schoolList.find(item => item.selected);
  }, [schoolList]);

  const getMes = () => {
    HTTP.get("/profile/role")
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
        if (res && res.data && res.data.data) {
          if (res.data.data.redirectUrl) {
            setIsLogin(true);
            getSchoolList();
            window.location.href = res.data.data.redirectUrl;
          }
        }
      })
      .catch((err) => {
        message.info("请先登录");
      });
  }

    // 获取用户信息
    const getUserInfo = () => {
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
          }
        })
        .catch((err) => {
          message.error("个人信息获取失败!");
        });
    }

  useEffect(() => {
    if (isLogin) {
      getUserInfo();
    }
  }, [isLogin])

  useEffect(() => {
    getMes();
  }, []);

  return (
    <LayoutContext.Provider value={{ schoolList, getSchoolList, isToB, getUserInfo, userInfo }}>
      <div className='app-layout'>
        {showHeader && <Header isLogin={isLogin} />}
        <div className={`app-content ${showHeader && 'with-header'}`}>
          {children}
        </div>
      </div>
    </LayoutContext.Provider>
  );
};