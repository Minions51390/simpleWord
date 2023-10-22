import React from "react";
import "./index.less";
import HTTP from "../../../utils/api.js";
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
} from "antd";
import { LeftCircleOutlined, InfoCircleOutlined } from "@ant-design/icons";
import baseUrl from "../../../utils/config.js";
import { getQueryString } from "../../../utils/stringUtils";
import Header from "../../../components/Header/index.js";

const { TextArea } = Input;

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
        desc: "xxxx-xx-xx-xx:xxxxxx-xx-xx-xx:xxxxxx-xx-xx-xx:xxxxxx-xx-xx-xx:xxxxxx-xx-xx-xx:xxxxxx-xx-xx-xx:xxxxxx-xx-xx-xx:xxxxxx-xx-xx-xx:xxxxxx-xx-xx-xx:xxxxxx-xx-xx-xx:xxxxxx-xx-xx-xx:xxxxxx-xx-xx-xx:xxxxxx-xx-xx-xx:xxxxxx-xx-xx-xx:xxxxxx-xx-xx-xx:xxxxxx-xx-xx-xx:xxxxxx-xx-xx-xx:xxxxxx-xx-xx-xx:xxxxxx-xx-xx-xx:xxxxxx-xx-xx-xx:xx",
        title: "xx",
        creator: "xx",
        createTime: "xxxx-xx-xx-xx:xx",
        level: "cet4",
        maximum: 160,
        minimum: 120,
      },
    };
  }

  componentWillMount() {
    this.inited();
  }

  componentDidMount() {}
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
        });
      })
      .catch((err) => {
        message.error("获取作文失败!");
      });
  }
  // 保存作文
  handleWritingSave() {
    const { paperId, title, content } = this.state;
    HTTP.post("/stu-writing-exam/submit", {
      paperId,
      title,
      content,
    })
      .then((res) => {
        console.log(res);
      })
      .catch((err) => {
        message.error("个人信息获取失败!");
      });
  }

  render() {
    const { paperId, title, content, writing } = this.state;
    return (
      <div className="writing-detail-container">
        <Header />
        <div className="writing-header">
          <div className="header-back">
            <LeftCircleOutlined />
            <div
              className="back-text"
              onClick={this.handleWritingSave.bind(this)}
            >
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
                <div className="fir-word-num">词数统计：0词</div>
                <div className="fir-save">2023-09-09 12:13:32</div>
              </div>
              <div className="left-sec">
                <Input
                  placeholder="请输入标题"
                  size="large"
                  bordered={false}
                  value={title}
                  onChange={this.handleTitleChange.bind(this)}
                />
              </div>
              <div className="left-thr">
                <TextArea
                  placeholder="请输入正文"
                  size="middle"
                  value={content}
                  bordered={false}
                  onPaste={(e) => {
                    e.preventDefault();
                    return false;
                  }}
                  onChange={this.handleContentChange.bind(this)}
                />
              </div>
            </div>
            <div className="content-right">
              <div className="content-tab">
                <Tabs defaultActiveKey="2">
                  <Tabs.TabPane tab="评语" key="1">
                    Content of Tab Pane 1
                  </Tabs.TabPane>
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
              <div className="content-error">
                <div>纠错</div>
              </div>
            </div>
          </div>
          <div className="content-control">
            <Button
              className="btn"
              type="primary"
              onClick={this.handleWritingSave.bind(this)}
            >
              提交
            </Button>
          </div>
        </div>
      </div>
    );
  }
}