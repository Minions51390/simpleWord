import React from "react";
import "./index.less";
import HTTP from "../../../utils/api.js";
import moment from 'moment';
import {
  Form,
  Input,
  Tabs,
  Button,
  Checkbox,
  Col,
  Row,
  Radio,
  message,
  Progress,
} from "antd";
import { LeftCircleOutlined, InfoCircleOutlined } from "@ant-design/icons";
import baseUrl from "../../../utils/config.js";
import { getQueryString } from "../../../utils/stringUtils";
import Header from "../../../components/Header/index.js";

const { TextArea } = Input;
const dateFormat = 'YYYY-MM-DD HH:mm:ss';
let autoSaveTimer = {};

export default class WritingDetail extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      paperId: getQueryString("paperId"),
      title: "",
      content: "",
      writing: {
        writingId: 1,
        writingCode: "000032",
        name: "xx",
        desc: "xx",
        title: "xx",
        creator: "xx",
        createTime: "xxxx-xx-xx-xx:xx",
        level: "cet4",
        maximum: 160,
        minimum: 120,
      },
      aiDetectionTimes: 1, // 可使用的ai检测次数，为0时禁止使用
      isSubmit: false, // 是否已提交
      aiReview: {
            "aiComment": "作者词汇量稍有不足，请注意高级词汇积累；复杂句使用不错，句法规范；文章衔接不够流畅内容逻辑顺畅；作文内容点跟作文要求相去甚远，请注意内容覆盖作文要求。请注意方法，勤加练习。",
            "aiContentScore": 74.85,
            "aiDetectionTimes": 1,
            "aiScore": 59.53,
            "aiSentenceScore": 73.91,
            "aiStructureScore": 38.46,
            "aiVocabularyScore": 58.93,
            "sentenceComments": [
                {
                    "sentence": "That is my grandfather's traditional Chinese medicine pharmacy, affectionately referred to by patients as the 'apricot forest'.",
                    "suggestions": [
                        "请检查the 'apricot，可能存在大小写拼写建议或空格错误，建议替换为the'apricot。"
                    ]
                },
                {
                    "sentence": "I can feel as if there is an apricot forest behind this pharmacy, shining brightly under the sunlight.",
                    "suggestions": [
                        "请检查under，可能存在介词错误，建议替换为in。"
                    ]
                },
                {
                    "sentence": "Grandfather said, \"This is saving people, and it's also saving oneself\".",
                    "suggestions": [
                        "请检查, \"This，可能存在大小写拼写建议或空格错误，建议替换为,\" This。"
                    ]
                },
                {
                    "sentence": "I think this medicine juice, which is boiled into three mouthfuls with three bowls of water, is exactly where the precious essence of Chinese medicine lies: redemption and self redemption",
                    "suggestions": [
                        "请检查是否有标点错误，建议新增.。"
                    ]
                }
            ]
        },
      score:12, // -1 为未考试
      examType: "", // practice
      submitTimes: 1, // 提交次数
      autoSaveTime: "",
    };
  }

  componentWillMount() {
    this.inited();
  }

  componentWillUnmount() {
    clearInterval(autoSaveTimer) 
  }
  // 初始化
  inited() {
    this.getWritingDetail();
  }

  // 作文标题修改
  handleTitleChange(event) {
    this.setState({
      title: event.target.value,
    });
  }
  // 作文正文修改
  handleContentChange(event) {
    this.setState({
      content: event.target.value,
    });
  }

  // 获取作文内容
  getWritingDetail() {
    const { paperId } = this.state;
    HTTP.get(`/stu-writing-exam/paper-detail?paperId=${paperId}`)
      .then((res) => {
        console.log(res);
        this.setState({
          writing: res?.data?.data?.writingBaseInfo,
          title: res?.data?.data?.writingAnswer?.title,
          content: res?.data?.data?.writingAnswer?.content,
          aiReview: res?.data?.data?.aiReview,
          examType: res?.data?.data?.examType,
          aiDetectionTimes: res?.data?.data?.aiDetectionTimes, // 可使用的ai检测次数，为0时禁止使用
          isSubmit: res?.data?.data?.isSubmit, // 是否已提交
        },);
        if(!res?.data?.data?.isSubmit){
            autoSaveTimer = setInterval(this.handleWritingSave.bind(this), 1000 * 60);
        }
      })
      .catch((err) => {
        message.error("获取作文失败!");
      });
  }
  // 提交作文
  handleWritingSubmit() {
    const { paperId, title, content } = this.state;
    return HTTP.post("/stu-writing-exam/submit", {
      paperId,
      title,
      content,
      isSubmit: true
    })
      .then((res) => {
        this.getWritingDetail();
      })
      .catch((err) => {
        message.error("提交失败!");
      });
  }
  // 保存作文
  handleWritingSave(){
    console.log('handleWritingSave')
    const { paperId, title, content } = this.state;
    this.setState({
        autoSaveTime: moment().format(dateFormat)
    })
    return HTTP.post("/stu-writing-exam/submit", {
      paperId,
      title,
      content,
      isSubmit: false
    })
  }
  // 保存并退出
  handleWritingSaveBack(){
    this.handleWritingSave().then((res) => {
        clearInterval(autoSaveTimer)
        window.history.go(-1)
      })
      .catch((err) => {
        message.error("保存失败!");
      });
  }
  // ai阅卷
  getAiReview(){
    const { paperId, title, content } = this.state;
    HTTP.post(`/stu-writing-exam/ai-review`, {
        paperId,
        title,
        content,
    })
      .then((res) => {
        this.setState({
          aiReview: res?.data?.data,
          aiDetectionTimes: res?.data?.data?.aiDetectionTimes
        });
      })
      .catch((err) => {
        message.error("ai阅卷失败!");
      });
  }

  computedTextCount(str) {
    let value = str;
    // 替换中文字符为空格
    value = value.replace(/[\u4e00-\u9fa5]+/g, " ");
    // 将换行符，前后空格不计算为单词数
    value = value.replace(/\n|\r|^\s+|\s+$/gi, "");
    // 多个空格替换成一个空格
    value = value.replace(/\s+/gi, " ");
    // 更新计数
    let length = 0;
    let match = value.match(/\s/g);
    if (match) {
      length = match.length + 1;
    } else if (value) {
      length = 1;
    }
    return length;
  }

  errorItem() {
    const { aiReview } = this.state;
    return (
      <div>
        {aiReview.sentenceComments.map((item) => {
          return (
            <div className="errorItem">
              <span className="errorItemCount"></span>
              <div className="errorItemContent">
                <div className="errorItemContent">{item.sentence}</div>
                {item.suggestions.map((suggestion) => {
                    return (<div className="errorItemContent">{suggestion}</div>)
                })}
              </div>
            </div>
          );
        })}
      </div>
    );
  }

  render() {
    const { paperId, title, content, writing, examType, aiDetectionTimes,isSubmit, aiReview, autoSaveTime } = this.state;
    return (
      <div className="writing-detail-container">
        <Header />
        <div className="writing-header">
          <div className="header-back" onClick={this.handleWritingSaveBack.bind(this)}>
            <LeftCircleOutlined />
            <div className="back-text">
              保存并退出
            </div>
          </div>
          <div className="header-tips">
            <InfoCircleOutlined />
            <div className="tips-text">温馨提示</div>
          </div>
        </div>
        <div className="writing-detail">
          <div className="detail-content">
            <div className="content-left">
              <div className="left-fir">
                <div className="fir-word-num">
                  词数统计：{this.computedTextCount(content)}词
                </div>
                <div className="fir-save">{autoSaveTime ? `${autoSaveTime}已自动保存` : ''} </div>
              </div>
              <div className="left-sec">
                <Input
                  placeholder="请输入标题"
                  size="large"
                  bordered={false}
                  value={title}
                  disabled={isSubmit}
                  onChange={this.handleTitleChange.bind(this)}
                />
              </div>
              <div className="left-thr">
                <TextArea
                  placeholder="请输入正文"
                  size="middle"
                  value={content}
                  bordered={false}
                  disabled={isSubmit}
                  onPaste={(e) => {
                    // e.preventDefault();
                    return false;
                  }}
                  onChange={this.handleContentChange.bind(this)}
                />
              </div>
            </div>
            <div className="content-right">
              {
                examType === 'practice' ? 
                  <div className="ai-review">
                    <Button
                      className="btn"
                      type="primary"
                      shape="round"
                      onClick={this.getAiReview.bind(this)}
                      disabled={aiDetectionTimes === 0}
                    >
                      智能批改({aiDetectionTimes}/3)
                    </Button>
                  </div> : ''
              }
              <div className="content-tab">
                <Tabs defaultActiveKey="1">
                  {
                    aiReview.aiComment?(
                    <Tabs.TabPane tab="评语" key="1">
                        <div className="content-demand-commit">
                        <div className="commit-left">
                            {aiReview.aiComment}
                        </div>
                        <div className="pp">
                            <Progress
                            type="dashboard"
                            percent={aiReview.aiScore}
                            format={(percent) => `${percent}`}
                            />
                        </div>
                        </div>
                    </Tabs.TabPane>
                    ):''
                  }
                  <Tabs.TabPane tab="写作要求" key="2">
                    <div className="content-demand">
                      <div className="demand-fir">
                        <div className="demand-level">
                          <span className="demand-sec">作文等级：</span>
                          {writing.level}
                        </div>
                        <div className="demand-num">
                          <span className="demand-sec">词数限制：</span>
                          {writing.minimum}-{writing.maximum}
                        </div>
                      </div>
                      <div className="demand-title">
                        <span className="demand-sec">作文标题：</span>
                        {writing.title}
                      </div>
                      <div className="demand-desc">
                        <span className="demand-sec">写作要求：</span>
                        {writing.desc}
                      </div>
                    </div>
                  </Tabs.TabPane>
                </Tabs>
              </div>
              <div className="commit-error">
                <div className="fir-line">
                <div className="title">纠错</div>
                <div className="count">{aiReview.sentenceComments.length}</div>
                </div>
                <div className="error-content">{this.errorItem()}</div>
            </div>
            </div>
          </div>
          <div className="content-control">
            <Button
              className="btn"
              type="primary"
              disabled={isSubmit}
              onClick={this.handleWritingSubmit.bind(this)}
            >
              提交
            </Button>
          </div>
        </div>
      </div>
    );
  }
}
