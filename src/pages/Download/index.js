import React, {useState, useEffect} from 'react';
import background from "./assets/background.png";
import app from "./assets/app.png";
import logo from "./assets/logo.png";
import IOS from './assets/Apple.svg';
import Android from './assets/Android.svg';
import HTTP from "../../utils/api.js";
import './index.less';
import { Popover } from 'antd';
const Download = () => {
  const [urlAndroid, setUrlAndroid] = useState("");
  const [urlIos, setUrlIos] = useState("")
  const getImgUrl = async () => {
    const res = await HTTP.get('/app-download-info/')
    setUrlAndroid(res?.data?.data?.apkQrCode)
    setUrlIos(res?.data?.data?.iosUrl)
  }
  getImgUrl()
  const contentAndroid = (
    <div style={{ height: '108px', width: '108px' }}>
      <img style={{ height: '100%', width: '100%' }} src={urlAndroid} />
    </div>
  );
  const contentIos = (
    <div style={{ height: '108px', width: '108px' }}>
      <img style={{ height: '100%', width: '100%' }} src={urlIos} />
    </div>
  );
  return (
    <div className="download-wrapper">
      <div className="content">
        <div className="left">
          <div className="logo" style={{ backgroundImage: `url(${logo})` }}></div>
          <div className="app" style={{ backgroundImage: `url(${app})` }}></div>
        </div>
        <div className="right">
          <div className="text">
            <div>背词功能已迁移至 “倾橙英语App”</div>
            <div>请前往App端继续学习</div>
          </div>

          <div>
            <div className="middle-text">
              <div>单词学习大杀器，</div>
              <div>完美cover住所有单词！</div>
            </div>

            <div className="download">
              <div className="download-action">
                <Popover content={contentIos}>
                  <div className="download-item">
                    <IOS className="os" />
                    <div>IOS版下载</div>
                  </div>
                </Popover>
                <Popover content={contentAndroid}>
                  <div className="download-item">
                    <Android className="os" />
                    <div>Android版下载</div>
                  </div>
                </Popover>
              </div>
              <div className="download-hint">各大应用商店均已上线，欢迎大家自行从官方渠道下载</div>
            </div>
          </div>
        </div>
      </div>
      <div className="background" style={{ backgroundImage: `url(${background})` }}></div>
    </div>
  );
};


export default Download;