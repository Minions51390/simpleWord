import React, { useState } from 'react';
import { Input, Select, message } from "antd";
import HTTP, { HTTPV2 } from "../../utils/api.js";
import './index.less';
import baseUrl from "../../utils/config.js";


const wordCountArr = [6, 9, 12, 15, 18, 21, 24, 27, 30];
const qqReg = /^[1-9][0-9]{4,14}$/;
const phoneReg = /^[1][1,2,3,4,5,7,8,9][0-9]{9}$/;
const emailReg = new RegExp(
  "^[a-z0-9]+([._\\-]*[a-z0-9])*@([a-z0-9]+[-a-z0-9]*[a-z0-9]+.){1,63}[a-z0-9]+$"
);

export const UserInfoModal = ({ visible, close, defaultUserInfo, updateUserInfo, isSelectDisable }) => {
  const [userInfo, setUserInfo] = useState(defaultUserInfo);
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
    userId,
  } = userInfo;
  const handleChange = (key, value) => {
    const newInfo = {
      ...userInfo,
      [key]: value,
    }
    setUserInfo(newInfo);
  };

  const rowLength = (val) => {
    val.length >= 254 ? true : false;
  }

  const saveMes = () => {
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
    } = userInfo;
    // 真名检验
    if (!realName || rowLength(realName)) {
      message.error("真实姓名不能为空！");
      return;
    }
    // 省份检验
    if (rowLength(province)) {
      message.error("省份过长！");
      return;
    }
    // 市份检验
    if (rowLength(city)) {
      message.error("市份过长！");
      return;
    }
    // 区县检验
    if (rowLength(area)) {
      message.error("区县过长！");
      return;
    }
    // 学校检验
    if (rowLength(school)) {
      message.error("学校名过长！");
      return;
    }
    // 年级检验
    if (rowLength(grade)) {
      message.error("年级过长！");
      return;
    }
    // 手机号检验
    if (!phoneReg.test(phone) || rowLength(phone)) {
      message.error("手机号格式错误！");
      return;
    }
    // qq检验
    if (!qqReg.test(qqNumber) || rowLength(qqNumber)) {
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
        updateUserInfo(userInfo);
        close();
      })
      .catch((err) => {
        console.log(err);
        message.error("设置失败!");
      });
  }

  const logOut = () => {
    HTTPV2.get("/auth/logout")
      .then((res) => {
        close();
        location.reload();
        window.location.href = `${baseUrl}/#/home`;
        console.log(res);
      })
      .catch((err) => {
        console.log(err);
      });
  }


  if (!visible) {
    return <></>;
  }
  return (
    <div
      className="user-bg"
      onClick={(e) => {
        e.stopPropagation();
        close();
      }}
    >
      <div
        className="user-area-top"
        onClick={e => e.stopPropagation()}
      >
        <div className="title">个人信息</div>
        <div className="main-row">
          <div className="main-left">
            <Input
              className="pass-mar"
              size="large"
              placeholder="请输入您的姓名"
              prefix={<div className="my-icon">姓名</div>}
              onChange={e => handleChange('realName', e.target.value)}
              value={realName}
            />
            <Input
              className="pass-mar phone-icon"
              size="large"
              placeholder="请输入您的手机号"
              prefix={<div className="my-icon">手机号</div>}
              onChange={e => handleChange('phone', e.target.value)}
              value={phone}
            />
            <Input
              className="pass-mar"
              size="large"
              disabled
              placeholder="请输入您的邮箱"
              prefix={<div className="my-icon">邮箱</div>}
              onChange={e => handleChange('email', e.target.value)}
              value={email}
            />
            <Input
              className="pass-mar qq-icon"
              size="large"
              placeholder="请输入您的QQ号"
              prefix={<div className="my-icon">QQ号</div>}
              onChange={e => handleChange('qqNumber', e.target.value)}
              value={qqNumber}
            />
            <span className="pass-mar ant-input-affix-wrapper word-ant-input-affix-wrapper">
              <div className="word-icon">
                <span className="ant-input-prefix">
                  <div className="my-icon">每日背词数</div>
                </span>
              </div>
              <Select
                defaultValue={`${newWord}个`}
                disabled={isSelectDisable}
                listHeight={100}
                size="large"
                style={{ width: 220 }}
                onChange={value => handleChange('newWord', value)}
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
              onChange={e => handleChange('province', e.target.value)}
              value={province}
            />
            <Input
              className="pass-mar"
              size="large"
              placeholder="请输入您的市份"
              prefix={<div className="my-icon">市份</div>}
              onChange={e => handleChange('city', e.target.value)}
              value={city}
            />
            <Input
              className="pass-mar"
              size="large"
              placeholder="请输入您的区县"
              prefix={<div className="my-icon">区县</div>}
              onChange={e => handleChange('area', e.target.value)}
              value={area}
            />
            <Input
              className="pass-mar"
              size="large"
              placeholder="请输入您的学校"
              prefix={<div className="my-icon">学校</div>}
              onChange={e => handleChange('school', e.target.value)}
              value={school}
            />
            <Input
              className="pass-mar"
              size="large"
              placeholder="请输入您的年级"
              prefix={<div className="my-icon">年级</div>}
              onChange={e => handleChange('grade', e.target.value)}
              value={grade}
            />
          </div>
        </div>
        <div className="save-btn" onClick={saveMes}>
          保存信息
        </div>
        <div className="log-out" onClick={logOut}>
          退出登录
        </div>
      </div>
    </div>
  );
}