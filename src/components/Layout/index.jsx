import React, { useState, useEffect, createContext } from 'react';
import './index.less';
import Header from "../Header/index.js";
import { useLocation } from 'react-router-dom';
import { message } from 'antd';
import HTTP, { HTTPV2 } from "../../utils/api.js";
import baseUrl from '../../utils/config.js';

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
  const [isLogin, setIsLogin] = useState(false);
  const [schoolList, setSchoolList] = useState([]);
  const { pathname } = useLocation();
  console.log('pathname', pathname);
  const showHeader = showHeaderList.some(item => item.toLowerCase() === pathname.toLowerCase());

  const notLogin = () => {
    // message.info("请登录后使用");
    window.location.href = `${baseUrl}/#/home`;
  }

  const getSchoolList = async () => {
    const res = await HTTPV2.get('/entity/list');
    const { schoolList = [] } = res?.data?.data;
    const filteredSchoolLost = schoolList.filter(item => item.classStatus !== 0);
    setSchoolList(filteredSchoolLost);
  }

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
            if (process.env.NODE_ENV === "development") {
              window.location.href = `${baseUrl}/#/examAndWrite`;
            } else {
              window.location.href = res.data.data.redirectUrl;
            }
          }
        }
      })
      .catch((err) => {
        message.info("请先登录");
      });
  }

  useEffect(() => {
    getMes();
  }, []);

  return (
    <LayoutContext.Provider value={{ schoolList, getSchoolList }}>
      <div className='app-layout'>
        {showHeader && <Header isLogin={isLogin} />}
        <div className={`app-content ${showHeader && 'with-header'}`}>
          {children}
        </div>
      </div>
    </LayoutContext.Provider>
  );
};