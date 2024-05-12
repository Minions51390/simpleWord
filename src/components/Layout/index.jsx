import React, { useState, useEffect } from 'react';
// import './index.less';
import Header from "../Header/index.js";
import { useLocation } from 'react-router-dom';
import { message } from 'antd';
import HTTP from "../../utils/api.js";
import baseUrl from '../../utils/config.js';

const showHeaderList = [
  '/',
  '/transfer',
  '/home',
  '/dashboard',
  '/about',
  '/download',
  '/writingList',
  '/writingDetail'
];


export const Layout = ({ children }) => {
  const [isLogin, setIsLogin] = useState(false);
  const { pathname } = useLocation();
  console.log('pathname', pathname);
  const showHeader = showHeaderList.some(item => item.toLowerCase() === pathname.toLowerCase());

  const notLogin = () => {
    message.info("请登录后使用");
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
            // message.success("登录成功");
            if (process.env.NODE_ENV === "development") {
              window.location.href = `${baseUrl}/#/transfer`;
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
    <div>
      {showHeader && <Header isLogin={isLogin} />}
      {children}
    </div>
  );
};