import React from "react";
import "./index.less";
import { Link } from "react-router-dom";
import Axios from "axios";
import {
  Form,
  Input,
  Button,
  Checkbox,
  Col,
  Row,
  Radio,
  Progress,
  message,
  Popconfirm,
} from "antd";
import { ArrowLeftOutlined, ArrowRightOutlined } from "@ant-design/icons";
// import getQueryString from ''
import { getQueryString } from "../../utils/stringUtils";
import HTTP from "../../utils/api.js";

import promise from "../Home/assets/promise.png";
import whiteBookBg from "../../assets/whiteBookBg.png";
import faultImg from "./assets/fault.png";
import rightImg from "./assets/right.png";

import backIcon from "../../assets/backIcon.png";
import spaceIcon from "../../assets/spaceIcon.png";
// import audioIcon from './assets/audioIcon.png';
import baseUrl from "../../utils/config.js";

export default class TestWords extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      questionList: [],
      currentQuestion: {},
      count: 0,
      currentWordIndex: 0,
      whichKeyDown: null,
      whichKeyUp: null,
      isFinish: false,
    };
    this.testType = null;
    this.paperId = 1;
    this.recordWordList = [];
    this.postStrangeWordListLock = false;
  }

  componentWillMount() {
    var url = window.location.href.split("#")[0];
    if (url != document.referrer) {
      window.location.href = `${baseUrl}/#/Transfer`;
      window.location.reload();
    }
    this.testType = getQueryString("testType");
    this.paperId = +(getQueryString("paperId") || 0);
    this.loadQuestionsList();
  }

  componentDidMount() {
    document.onkeyup = this.onKeyUp.bind(this);
    document.onkeydown = this.onKeyDown.bind(this);
  }

  loadQuestionsList() {
    HTTP.get("/plan/test-paper", {
      params: {
        testType: this.testType,
        paperId: this.paperId,
      },
    })
      .then((res) => {
        console.log("test 请求成功:", res.data);
        var questionList = res.data.data.subjectDetail;
        var count = res.data.data.subjectCount;
        this.paperId = res.data.data.paperId;
        //   wordList.length = 20
        this.setState({
          questionList: questionList || [],
          count: count,
          currentWordIndex: res.data.data.startIndex,
        });
      })
      .catch((err) => {
        console.log("请求失败:", err);
      });
  }

  postStrangeWordList(fn, mid) {
    if (this.recordWordList.length == 0) {
      fn?.();
      return;
    }
    if (this.postStrangeWordListLock) {
      if (!mid) {
        message.success("无需重复提交");
      }
      return;
    }
    if (!mid) {
      message.success("正在上传...");
      this.postStrangeWordListLock = true;
    }
    const { count } = this.state;
    let values = {};
    values.testType = this.testType;
    values.paperId = this.paperId;
    values.testPaper = this.recordWordList;
    console.log("postStrangeWordList Success:", JSON.stringify(values));
    HTTP.patch("/plan/test-paper", values)
      .then((res) => {
        console.log("postStrangeWordList 请求成功:", res);
        fn?.();
        // window.location.href = `${baseUrl}/#/Transfer`;
        // window.location.reload()
        if (!mid) {
          message.success("新数据已同步");
          this.recordWordList = [];
          this.postStrangeWordListLock = true;
        }
      })
      .catch((err) => {
        this.postStrangeWordListLock = false;
        console.log("请求失败:", err);
        if (!mid) {
          message.error("上传失败，请重试");
        }
      });
  }

  onFinish(values) {
    console.log("Success:", values);
  }

  onFinishFailed(errorInfo) {
    console.log("Failed:", errorInfo);
  }
  onKeyDown(event) {
    if (event.keyCode == 32) {
      //空格键
      this.setState({
        whichKeyUp: null,
        whichKeyDown: "space",
      });
    }
  }

  onKeyUp(event) {
    const {
      currentWordIndex,
      currentAnswer,
      isShowAnswer,
      questionList,
      isFinish,
    } = this.state;
    if (event.keyCode == 32) {
      //空格键
      if (isFinish) {
        this.postStrangeWordList();
        this.setState({
          whichKeyDown: "space",
          whichKeyUp: "space",
        });
      } else if (isShowAnswer) {
        this.postStrangeWordList(() => {
          this.goNext();
        }, true);
      } else if (currentAnswer != null) {
        this.setState({
          isShowAnswer: true,
        });
        let isBingo = currentAnswer == questionList[currentWordIndex].solution;
        console.log("currentAnswer", currentAnswer);
        this.recordResult(
          questionList[currentWordIndex].sId,
          isBingo,
          currentAnswer
        );
      } else {
        return;
      }
    }
  }

  onClickOption(option) {
    const { isShowAnswer } = this.state;
    if (isShowAnswer) {
      return;
    }

    console.log("onClickOption", option);
    this.setState({
      currentAnswer: option,
    });
  }

  onClickButton() {
    const {
      currentWordIndex,
      currentAnswer,
      isShowAnswer,
      questionList,
      isFinish,
    } = this.state;
    if (isFinish) {
      this.postStrangeWordList();
      this.setState({
        whichKeyDown: "space",
        whichKeyUp: "space",
      });
    } else if (isShowAnswer) {
      this.postStrangeWordList(() => {
        this.goNext();
      }, true);
    } else if (currentAnswer != null) {
      this.setState({
        isShowAnswer: true,
      });
      let isBingo = currentAnswer == questionList[currentWordIndex].solution;
      console.log("currentAnswer", currentAnswer);
      this.recordResult(
        questionList[currentWordIndex].sId,
        isBingo,
        currentAnswer
      );
    } else {
      return;
    }
  }

  recordResult(sId, isBingo, choice) {
    this.recordWordList.push({ sId, result: isBingo, choice });
    console.log("recordResult", this.recordWordList);
  }

  backToTransfer() {
    /** 上报单词数 */
    this.postStrangeWordList(() => {
      message.info("当前进度已保存");
      setTimeout(() => {
        window.location.href = `${baseUrl}/#/Transfer`;
        window.location.reload();
      }, 500);
    });
  }

  goNext() {
    const count = this.state.count;
    if (this.state.currentWordIndex + 1 < count) {
      this.setState({
        isShowAnswer: false,
        currentWordIndex: this.state.currentWordIndex + 1,
        currentAnswer: null,
      });
      this.forceUpdate();
    } else {
      this.setState({
        currentAnswer: null,
        isShowAnswer: null,
        isFinish: true,
      });
    }
  }

  render() {
    const {
      currentWordIndex,
      questionList,
      currentAnswer,
      isShowAnswer,
      count,
      isFinish,
      whichKeyUp,
      whichKeyDown,
    } = this.state;
    let testTypeText = "";
    if (this.testType == "testPaper") {
      testTypeText = "当日小测";
    } else if (this.testType == "stageTestPaper") {
      testTypeText = "阶段考试";
    } else if (this.testType == "errorTestPaper") {
      testTypeText = "错词考试";
    } else {
      testTypeText = "试题考试";
    }
    let questionType = "";
    if (
      questionList[currentWordIndex] &&
      questionList[currentWordIndex].type == "en-to-ch"
    ) {
      questionType = "单选题（请选择所给单词的正确中文释义）";
    } else if (
      questionList[currentWordIndex] &&
      questionList[currentWordIndex].type == "ch-to-en"
    ) {
      questionType = "单选题（请选择所给中文释义的正确单词）";
    }
    return (
      <div className="test_wrapper">
        <img className="background-img" src={whiteBookBg}></img>
        <div className="fix_header">
          <div className="header_left">
            <img className="main-img" src={promise}></img>
            <div className="home-page">
              {/* <Link to="/home">首页</Link> */}
            </div>
            <div className="about-us">关于我们</div>
            <div className="use-msg">使用说明</div>
          </div>
        </div>
        <div className="choose_header">
          <div className="decoration"></div>
          <div className="choose_left">{"倾橙小考"}</div>
          <div className="choose_right">{testTypeText}</div>
        </div>
        {!isFinish &&
          questionList.length != 0 &&
          questionList[currentWordIndex] != null && (
            <div className="choose_content">
              <span className="question_type">{questionType}</span>
              <br />
              <span
                className={`word_text ${
                  questionList[currentWordIndex].stem.length > 70
                    ? "word_long_text"
                    : ""
                }`}
              >
                {questionList[currentWordIndex].stem}
              </span>
              <br />
              <Radio.Group
                className="radio_content_space_between"
                name="radiogroup"
                value={this.state.currentAnswer}
                defaultValue={this.state.currentAnswer}
              >
                {/* <div className="radio_content_space_between"> */}
                {/* //  <Button className={whichKeyDown == 'left' ? "style_button" : null } icon={<ArrowLeftOutlined />} shape="round" onClick={this.onClick.bind(this, "left")}>会
          //     <div className={whichKeyUp == 'left' ? "click-animating-node" : null }></div>
            
          //   </Button> */}
                {questionList[currentWordIndex].options &&
                  questionList[currentWordIndex].options.map((item, index) => {
                    return (
                      <div
                        className={
                          isShowAnswer &&
                          item.optionKey ==
                            questionList[currentWordIndex].solution
                            ? "radio_cover_solution"
                            : "radio_cover"
                        }
                        onClick={this.onClickOption.bind(this, item.optionKey)}
                        key={`RadioKey${index}`}
                      >
                        <Radio
                          className={
                            isShowAnswer &&
                            item.optionKey ==
                              questionList[currentWordIndex].solution &&
                            questionList[currentWordIndex].solution ==
                              currentAnswer
                              ? "radio_bingo"
                              : null
                          }
                          disabled={isShowAnswer}
                          value={item.optionKey}
                          checked={
                            currentAnswer == item.optionKey ? true : false
                          }
                        >
                          <span
                            className={
                              isShowAnswer &&
                              item.optionKey !=
                                questionList[currentWordIndex].solution
                                ? "radio_text_false"
                                : "radio_text"
                            }
                          >
                            {item.optionValue}
                          </span>
                          {isShowAnswer && item.optionKey == currentAnswer && (
                            <img
                              className="rightOrNot-img"
                              src={
                                item.optionKey !=
                                questionList[currentWordIndex].solution
                                  ? faultImg
                                  : rightImg
                              }
                            ></img>
                          )}
                        </Radio>
                      </div>
                    );
                  })}
              </Radio.Group>
            </div>
          )}
        {isFinish && (
          <div className="button_content_mid">
            <Button
              className={whichKeyDown == "space" ? "style_button" : null}
              shape="round"
              onClick={this.onClickButton.bind(this)}
            >
              space 完成
              <div
                className={
                  whichKeyUp == "space" ? "click-animating-node" : null
                }
              ></div>
            </Button>
          </div>
        )}
        <div className="progress_audio_content">
          <div className="progress_content">
            <div className="progress_before" />
            <span className="progress_text">{`${
              currentWordIndex + 1
            } / ${count}`}</span>
          </div>
        </div>
        {!isFinish && (
          <div
            className="space_content"
            onClick={this.onClickButton.bind(this)}
          >
            <img className="space_icon" src={spaceIcon}></img>
          </div>
        )}
        <Popconfirm
          title="是否确定退出"
          onConfirm={this.backToTransfer.bind(this)}
          okText="确认"
          cancelText="取消"
        >
          <div className="back_content">
            <img className="back_icon" src={backIcon}></img>
            <span className="back_text">退出</span>
          </div>
        </Popconfirm>
        {/* <div className="progress_content">
        <div className="progress_before"/>
        <span className="progress_text">{`${currentWordIndex + 1} / ${count}`}</span>
      </div> */}
      </div>
    );
  }
}
