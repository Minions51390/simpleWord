import React, { useState, useRef, useEffect } from 'react';
import { Input, message, Button } from 'antd';
import wechat from "./assets/qiyewechat.png";
import AddSvg from './assets/add.svg';
import './index.less';
import HTTP from "../../utils/api.js";

const PreviewItem = ({ file }) => {
  const [src, setSrc] = useState('');
  useEffect(() => {
    let reader = new FileReader();
    reader.onload = function(){
      setSrc(reader.result)
    };
    reader.readAsDataURL(file);
  }, []);

  return (
    <div className="previewItem" style={{ backgroundImage: `url(${src})` }}></div>
  );
}

const FeedbackModal = ({ visible, close }) => {
  const [upDataModal, setUpDataModal] = useState(false);
  const [question, setQuestion] = useState('');
  const [weixin, setWeixin] = useState('');
  const [uploadFileList, setUploadFileList] = useState([]);
  const [uploadLoading, setUploadLoading] = useState(false);
  const uploadRef = useRef();

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

  const uploadDate = async () => {
    setUploadLoading(true);
    const imageList = [];
    for(let i = 0; i < uploadFileList.length; i++) {
      const data = new FormData();
      data.append('file',  uploadFileList[i]);
      const res = await HTTP.post("/feedback/picture", data, {
        headers: {
          'Content-Type': 'multipart/form-data'
        },
      });
      imageList.push(res?.data?.data);
    }
    await HTTP.post("/feedback/", {
      tp: 3,
      weixin,
      desc: question,
      pictures: imageList,
    });
    setUploadLoading(false);
    message.info("已提交~");
  }

  const moduleUpdate = async () => {
    await uploadDate();
    doUpDataModal();
  };

  const confirmFeed = e => {
    e.stopPropagation();
    setUpDataModal(true);
  };

  const uploadChange = (e) => {
    console.log(e.target.files);
    if (uploadFileList.concat(Array.from(e.target.files)).length > 10) {
      message.error('最多上传10张图片');
      return;
    }
    setUploadFileList(uploadFileList.concat(Array.from(e.target.files)));
  };

  const handleClickUpload = () => {
    uploadRef?.current?.click();
  }

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
              style={{ width: 400, resize: "none" }}
              onChange={questionChange}
              rows={4}
            />
            <div className="text">相关图片:</div>
            <div className="uploadContent">
              {uploadFileList?.map(item => {
                return <PreviewItem key={item.name} file={item} />;
              })}
              {uploadFileList.length <= 10 && (
                <div className="uploadBtn" onClick={handleClickUpload}>
                  <input accept=".jpeg,.png,.jpg" ref={uploadRef} multiple type="file" onChange={uploadChange} />
                  <AddSvg className="addIcon" />
                  <span>({uploadFileList.length} / 10)</span>
                </div>
              )}
            </div>
            <div className="tools">
              <div
                className="close"
                onClick={doUpDataModal}
              >
                关闭
              </div>
              <Button className="btn" type="primary" loading={uploadLoading} onClick={moduleUpdate}>
                提交
              </Button>
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