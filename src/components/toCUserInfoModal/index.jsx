import React from 'react';
import { Modal, Input } from 'antd';
import './index.less';

export const ToCUserInfoModal = ({ visible, close, userInfo, logOut }) => {

  return (
    <Modal visible={visible} onCancel={close} closable={false} centered footer={null} wrapClassName="toc-user-info-modal">
      <div className='toc-user-info-modal-content'>
        <div className='title'>个人信息</div>
        <div className='content'>
          <div className='info-item'>
            <span>姓名/昵称：</span>
            <span>{userInfo?.realName}</span>
          </div>
          <div className='info-item'>
            <span>手机号：</span>
            <span>{userInfo?.phone}</span>
          </div>
        </div>
        <div className='logout' onClick={logOut}>退出登录</div>
      </div>
    </Modal>
  );
};