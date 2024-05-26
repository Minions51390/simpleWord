import React from "react";
import "./index.less";
import Header from "../../components/Header/index";
import whiteBookBg from "../../assets/whiteBookBg.png";
import { Link } from "react-router-dom";
import HTTP from "../../utils/api.js";
import {
  Form,
  Input,
  Button,
  Checkbox,
  Col,
  Row,
  Radio,
  message,
  Popconfirm,
  Statistic,
} from "antd";
import baseUrl from "../../utils/config.js";

const BANK_TYPE_MAP = {
  choice: "单选",
  pack: "词汇理解",
  long_reading: "长篇阅读",
  cf_reading: "仔细阅读",
};

const BankType = {
  choice: "choice",
  pack: "pack",
  long_reading: "long_reading",
  cf_reading: "cf_reading",
};

/** 截取url */
const GetRequest = () => {
  const url = `?${window.location.href.split("?")[1]}`; //获取url中"?"符后的字串
  let theRequest = {};
  if (url.indexOf("?") !== -1) {
    let str = url.substr(1);
    let strs = str.split("&");
    for (let i = 0; i < strs.length; i++) {
      theRequest[strs[i].split("=")[0]] = unescape(strs[i].split("=")[1]);
    }
  }
  return theRequest;
};

const { Countdown } = Statistic;

export default class ReadingCom extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      paperData: {},
      paperId: GetRequest()["paperId"],
    };
  }

  componentWillMount() {}

  componentDidMount() {
    this.fetchTextPaper();
  }

  /** 获取试题 */
  fetchTextPaper() {
    const { paperId } = this.state;
    HTTP.get(`/user-exam/exam-paper?paperId=${paperId}`)
      .then((res) => {
        console.log(123123123, res.data.data);
        let realRes = res.data.data;
        realRes.textTime = 90;
        this.setState({
          paperData: res.data.data,
        });
      })
      .catch((err) => {
        message.error("服务器开小差了");
        console.log(err);
      });
  }

  scrollToView(id) {
    let element = document.getElementById(id);
    element.scrollIntoView();
  }

  /** 切换选项 */
  chooseAnswer(val, index, ceng) {
    let { paperData } = this.state;
    console.log(123123123, val, index, ceng);
    console.log(123123123, paperData.card);
    paperData.card[ceng][index].choiceKey = val;
    this.setState({
      paperData: JSON.parse(JSON.stringify(paperData)),
    });
  }

  /** 交卷 */
  onSubmit() {
    const { paperData } = this.state;
    let cards = [];
    paperData.card.forEach((item) => {
      cards = [...cards, ...item];
    });
    HTTP.post("/user-exam/submit-exam-paper", {
      paperId: paperData.id,
      cards,
      submit: true,
    })
      .then((res) => {
        console.log(123123, res);
        message.success("交卷成功!");
        setTimeout(() => {
          history.push("/examAndWrite");
        }, 2000);
      })
      .catch((err) => {
        message.error(err);
      });
  }

  /** 侧边栏 */
  renderNav() {
    const {
      paperData: { part = [] },
    } = this.state;
    return (
      <div className="navBlock">
        {part.map((item) => {
          return (
            <div className="part" key={item.partName}>
              <div
                className="partName"
                onClick={this.scrollToView.bind(this, item.partName)}
              >
                {item.partName}
              </div>
              <div className="section">
                {item.section.map((data) => {
                  return (
                    <div
                      className="sectionName"
                      key={data.sectionName}
                      onClick={this.scrollToView.bind(this, data.sectionName)}
                    >
                      {data.sectionName}
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    );
  }

  /** 文章内容type=pack */
  renderSectionTypeOne(data) {
    return (
      <div className="sectionBlock">
        <div className="sectionMain">
          <div id={`#${data.sectionName}`} className="title">
            {data.sectionName}
          </div>
          <div className="directions">{data.directions}</div>
          <div className="paper">{data.article}</div>
        </div>
        <div className="sectionRes">
          <div className="sectionPos">
            {data.answers.map((item) => {
              return (
                <div className="answer">{`${item.key}）${item.value}`}</div>
              );
            })}
          </div>
        </div>
      </div>
    );
  }

  /** 文章内容type=cf_reading */
  renderSectionTypeTwo(data) {
    return (
      <div className="sectionBlock">
        <div className="sectionMain">
          <div id={`#${data.sectionName}`} className="title">
            {data.sectionName}
          </div>
          <div className="directions">{data.directions}</div>
          <div className="paper">{data.article}</div>
        </div>
        <div className="sectionRes">
          <div className="sectionPos">
            {data.questions.map((item, index) => {
              return (
                <div key={index}>
                  <div className="question">（ ）{item.question}</div>
                  <div className="questionAnswer">
                    {item.answers.map((value, number) => {
                      return (
                        <div
                          key={number}
                          className="answerItem"
                        >{`${value.key}）${value.value}`}</div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    );
  }

  /** 文章内容type=long_reading */
  renderSectionTypeThree(data) {
    return (
      <div className="sectionBlock">
        <div className="sectionMain">
          <div id={`#${data.sectionName}`} className="title">
            {data.sectionName}
          </div>
          <div className="directions">{data.directions}</div>
          <div className="paper">
            {data.answers.map((item, index) => {
              return (
                <div className="answer">{`${item.key}）${item.value}`}</div>
              );
            })}
          </div>
        </div>
        <div className="sectionRes">
          <div className="sectionPos">
            {data.questions.map((item, index) => {
              return (
                <div key={index} className="answer">
                  （ ）{item}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    );
  }

  /** 文章内容 */
  renderMain() {
    const {
      paperData: { part = [] },
    } = this.state;
    return (
      <>
        {part.map((item) => {
          return (
            <div className="mainItem">
              <div className="titleBlock">
                <div id={`#${item.partName}`} className="name">
                  {item.partName}
                </div>
                <div className="title">{item.title}</div>
              </div>
              <div className="section">
                {item.section.map((data) => {
                  if (data.type === BankType["pack"]) {
                    return this.renderSectionTypeOne(data);
                  } else if (data.type === BankType["cf_reading"]) {
                    return this.renderSectionTypeTwo(data);
                  } else if (data.type === BankType["long_reading"]) {
                    return this.renderSectionTypeThree(data);
                  } else {
                    return <div>单选待开发</div>;
                  }
                })}
              </div>
            </div>
          );
        })}
      </>
    );
  }

  renderRes() {
    const {
      paperData: { card = [] },
    } = this.state;
    return (
      <>
        <div className="card">
          <div className="headCon">
            <div className="leftTitle">答题卡</div>
            <div className="rightFind">漏答检测</div>
          </div>
          <div className="contentBlock">
            {card.map((item, index) => {
              return (
                <div key={index} className="itemBlock">
                  {item.map((val, num) => {
                    return (
                      <div key={num} className="blockLine">
                        <div className="lineNum">{val.index}</div>
                        <div className="lineContent">
                          {val.key.map((it, count) => {
                            return (
                              <div
                                className={`${
                                  val.choiceKey === it
                                    ? "lineItemActive"
                                    : "lineItem"
                                }`}
                                key={count}
                                onClick={this.chooseAnswer.bind(
                                  this,
                                  it,
                                  num,
                                  index
                                )}
                              >
                                {it}
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    );
                  })}
                </div>
              );
            })}
          </div>
        </div>
      </>
    );
  }

  onFinish() {
    message.success("考试结束");
  }

  render() {
    const { paperData } = this.state;
    return (
      <div className="readingCom">
        <img className="background-img" src={whiteBookBg}></img>
        <Header />
        <div className="readingNameTitle">
          <div className="left">{paperData.paperName}</div>
          <div className="right">
            <div className="nextSay">下次再说</div>
            <Button
              type="primary"
              style={{ marginLeft: "16px", width: "88px" }}
              onClick={this.onSubmit.bind(this)}
            >
              交卷
            </Button>
          </div>
        </div>
        <div className="readingContent">
          <div className="nav">{this.renderNav()}</div>
          <div className="main">{this.renderMain()}</div>
          <div className="response">{this.renderRes()}</div>
          <div className="time">
            <Countdown
              title="考试剩余时间"
              value={Date.now() + paperData.textTime * 1000 * 60}
              onFinish={this.onFinish.bind(this)}
            />
          </div>
        </div>
      </div>
    );
  }
}
