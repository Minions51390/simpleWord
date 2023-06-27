import React, { useState } from 'react';
import { Input, Upload } from 'antd';
import wechat from "./assets/qiyewechat.png";
import './index.less';

const FeedbackModal = ({ visible, close }) => {
  const [upDataModal, setUpDataModal] = useState(false);
  const [question, setQuestion] = useState('');
  const [weixin, setWeixin] = useState('');
  const [uploadFileList, setUploadFileList] = useState([]);

  const doUpDataModal = () => {
    setUpDataModal(false);
    close();
  };

  const questionChange = e => {
    setQuestion(e.target.value);
  }

  const wxChange = e => {
    setWeixin(e.target.value);
  }

  const uploadDate = () => {
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

  const moduleUpdate = () => {
    uploadDate();
    doUpDataModal();
  };

  const confirmFeed = e => {
    e.stopPropagation();
    setUpDataModal(true);
  };

  const customRequest = () => {};

  const uploadChange = ({ file, fileList }) => {
    console.log(file, fileList);
    setUploadFileList(fileList);
  };

  if (!visible) {
    return null;
  }

  return (
    <div className="feed-bg" onClick={close}>
      <div
        className="feed-area-top"
        onClick={e => e.stopPropagation()}
      >
        <div className="title">建议&反馈</div>
        {upDataModal ? (
          <div className="warp">
            <div className="text">您的微信：</div>
            <Input
              style={{ width: 400 }}
              value={weixin}
              onChange={wxChange}
            />
            <div className="text">描述您的问题:</div>
            <Input.TextArea
              value={question}
              showCount
              maxLength={400}
              style={{ height: 80, width: 400, resize: "none" }}
              onChange={questionChange}
            />
            <div className="text">相关图片:</div>
            <Upload
              action=""
              listType="picture-card"
              fileList={uploadFileList}
              method="post"
              onChange={uploadChange}
              customRequest={customRequest}
            >
              {uploadFileList.length < 10 && "+ Upload"}
            </Upload>
            <div className="tools">
              <div
                className="close"
                onClick={doUpDataModal}
              >
                关闭
              </div>
              <div className="btn" onClick={moduleUpdate}>
                提交
              </div>
            </div>
          </div>
        ) : (
          <div className="warp">
            <div className="content">
              如果您在使用本软件的过程中，遇到了什么问如果您在使用本软件的过程中，遇到了什么问题，请添加下方官方客服微信，并向客服描述您所遇到的问题，我们将积极为您解决。感谢您对支持！
            </div>
            <img className="wechat-icon" src={wechat}></img>
            <div className="tips">微信扫一扫</div>
            <div className="btn" onClick={(e) => confirmFeed(e)}>
              确定
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default FeedbackModal;