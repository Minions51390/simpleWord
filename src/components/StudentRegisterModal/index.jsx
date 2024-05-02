import React from 'react';
import { Modal, Button } from 'antd';
import { useHistory } from "react-router-dom";
import './index.less';


export const StudentRegisterModal = ({ visible, showLogin, close }) => {
  let history = useHistory();
  const jumpToDownload = () => {
    close();
    history.push('/download');
  };

  const goToLogin = () => {
    close();
    showLogin();
  }
  return (
    <Modal maskStyle={{backgroundColor: 'rgba(3,13,60,0.2)'}} width={540} className="student-register" visible={visible} onCancel={close} closable closeIcon={null} footer={null}>
      <div className='title'>注册学生账号</div>
      <div className='content'>学生账号请前往“倾橙英语App”进行注册</div>

      <div className='bottom'>
        <div className='button' onClick={jumpToDownload}>前往下载</div>
        <div className='login-text'>
          已有账号，
          <span onClick={goToLogin}>马上登录</span>
        </div>
      </div>
    </Modal>
  );
};