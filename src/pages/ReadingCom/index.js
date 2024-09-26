import React from "react";
import "./index.less";
import whiteBookBg from "../../assets/whiteBookBg.png";
import HTTP from "../../utils/api.js";
import { Button, message, Statistic } from "antd";
import { withRouter } from "react-router-dom";
import useBreakpoint from "antd/lib/grid/hooks/useBreakpoint.js";
import { useCallback } from "react/cjs/react.production.min.js";

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

let autoTimer = null

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

class ReadingCom extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      paperData: {},
      paperId: GetRequest()["paperId"],
      showCheck: false,
      topPos: 0,
      sectionIndex: 0,
    };
  }

  componentWillMount() {
    this.fetchTextPaper();
  }

  componentDidMount() {
    window.addEventListener("scroll", this.handleScroll.bind(this), true);
  }
  componentWillUnmount() {
    clearInterval(autoTimer)
  }

  handleScroll() {
    this.setState({
      topPos: window.pageYOffset || document.documentElement.scrollTop,
    });
  }
  // 自动保存试卷
  autoSyncText(){
    autoTimer = setInterval(()=>{
        this.onSubmit(false, 1)
    }, 60 * 1000)
  }
  /** 获取试题 */
  fetchTextPaper() {
    const { paperId } = this.state;
    HTTP.get(`/user-exam/exam-paper?paperId=${paperId}`)
      .then((res) => {
        let realRes = res.data.data;
        realRes.textTime = 90;
        this.setState({
            paperData: realRes,
        });
        if(!realRes.paperFinish){
            this.autoSyncText();
        }
      })
      .catch((err) => {
        message.error("服务器开小差了");
        console.log(err);
      });
  }

  scrollToView(id) {
    let element = document.getElementById(`#${id}`);
    let top = element.getBoundingClientRect().top + window.scrollY;
    window.scrollTo({
      top: top - 68,
      behavior: "smooth",
    });
  }

  /** 切换选项 */
  chooseAnswer(val, index, ceng) {
    let { paperData } = this.state;
    paperData.card[ceng][index].choiceKey = val;
    this.setState({
      paperData: JSON.parse(JSON.stringify(paperData)),
    });
  }

  /** 交卷 */
  onSubmit(submit, autoSync) {
    const { paperData } = this.state;
    if (!this.checkSubmit(submit)) {
      return;
    }
    let cards = [];
    paperData.card.forEach((item) => {
      cards = [...cards, ...item];
    });
    HTTP.post("/user-exam/submit-exam-paper", {
      paperId: paperData.id,
      cards,
      submit,
      autoSync, 
    })
      .then((res) => {
        if(!autoSync){
            if (submit) {
                message.success("交卷成功!");
            } else {
            message.success("保存成功!");
            }
            setTimeout(() => {
            this.props.history.push("/examAndWrite");
            }, 500);
        }
      })
      .catch((err) => {
        message.error(err);
      });
  }

  /** 漏答检测 */
  checkSubmit(submit) {
    if (!submit) {
      return true;
    }
    const { paperData } = this.state;
    this.setState({
      showCheck: true,
    });

    let cards = [];
    let ready = true;
    paperData.card.forEach((item) => {
      cards = [...cards, ...item];
    });
    for (let index = 0; index < cards.length; index++) {
      if (!cards[index].choiceKey) {
        ready = false;
        break;
      }
    }
    if (!ready) {
      message.error("还有题目没有作答！");
    }
    // else{
    //   message.success("所有题目均已作答！");
    // }
    return ready;
  }

  /** 侧边栏 */
  renderNav() {
    const {
      paperData: { part = [] },
      topPos,
    } = this.state;
    return (
      <div
        className="navBlock"
        style={{ top: `${topPos > 68 ? "68px" : 148 - topPos}px` }}
      >
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
                      onClick={this.scrollToView.bind(
                        this,
                        `${item.partName}${data.sectionName}`
                      )}
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

  /** 文章内容type=choice */
  renderSectionChoice(data, card, partName) {
    return (
      <div className="sectionChoice">
        <div id={`#${partName}${data.sectionName}`} className="sectionMain">
          <div className="directions">{data.directions}</div>
          <div className="paper">
            ({" "}
            <span
              style={{
                color: `${
					(card[0].rightKey ? card[0].rightKey === card[0].choiceKey : true) ? "#0076FF" : "#FF0000"
                }`,
                textDecoration: "underline",
              }}
            >
              {card[0].rightKey || card[0].choiceKey}
            </span>{" "}
            ){data.article}
          </div>
        </div>
        <div className="sectionRes">
          {data.answers.map((item) => {
            return (
              <div
                className="answer"
                style={
                  card[0].choiceKey === item.key
                    ? {
                        color: "#0076FF",
                        textDecoration: "underline",
                      }
                    : card[0].rightKey === item.key
                    ? {
                        color: "#FF0000",
                        textDecoration: "underline",
                      }
                    : {}
                }
              >
                <span style={{ marginRight: "8px" }}>{item.key})</span>
                {item.value}
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  findAnswerVal(answer, key) {
    if (!key) {
      return;
    }
    return answer.filter((item) => {
      return item.key === key;
    })[0];
  }

  /** 文章内容type=pack 阅读理解 */
  renderSectionTypeOne(data, card, partName) {
    let answersMap = data.answers;

    let article = data.article;

    card.forEach((item) => {
      const finVal = this.findAnswerVal(
        answersMap,
        item.rightKey || item.choiceKey
      );
      const right = item.rightKey ? item.choiceKey === item.rightKey : true;
      if (finVal) {
        article = article.replace(
          `__${item.index}__`,
          `( <span style="color: ${
            right ? "#0076FF" : "#FF0000"
          }; text-decoration: underline;">${finVal.value}</span> )`
        );
      }
    });

    return (
      <div className="sectionBlock">
        <div className="sectionMain">
          <div id={`#${partName}${data.sectionName}`} className="title">
            {data.sectionName}
          </div>
          <div className="directions">
            <b>Directions: </b>ln this section, there is a passage with several
            blanks. You are required to select one word for eachblank from a
            list of choices given in a word bank following the passage. Read the
            passage through carefully beforemaking your choices. Each choice in
            the bank is identified by a lefter.{" "}
            <b>You may not use any of the words in thebank more than once.</b>
          </div>
          <div
            className="paper"
            dangerouslySetInnerHTML={{ __html: article }}
          ></div>
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

  /** 文章内容type=cf_reading 仔细阅读 */
  renderSectionTypeTwo(data, card, partName) {
    return (
      <div className="sectionBlock">
        <div className="sectionMain">
          <div id={`#${partName}${data.sectionName}`} className="title">
            {data.sectionName}
          </div>
          <div className="directions">
            <b>Directions: </b>There are several passages in this section. Each
            passage is followed by some questions or unfinishedstatements For
            each of them there are four choices marked A. B. C and D. You should
            decide on the bestchoice.
          </div>
          <div className="paper">{data.article}</div>
        </div>
        <div className="sectionRes">
          <div className="sectionPos">
            {data.questions.map((item, index) => {
              return (
                <div key={index}>
                  <div className="question">
                    ({" "}
                    <span
                      style={{
                        color: `${
							(card[index].rightKey ? card[index].rightKey === card[index].choiceKey : true)
                            ? "#0076FF"
                            : "#FF0000"
                        }`,
                        textDecoration: "underline",
                      }}
                    >
                      {card[index].rightKey || card[index].choiceKey}
                    </span>{" "}
                    ){item.question}
                  </div>
                  <div className="questionAnswer">
                    {item.answers.map((value, number) => {
                      return (
                        <div
                          key={number}
                          className="answerItem"
                          style={
                            card[index].choiceKey === value.key
                              ? {
                                  color: "#0076FF",
                                  textDecoration: "underline",
                                }
                              : card[index].rightKey === value.key
                              ? {
                                  color: "#FF0000",
                                  textDecoration: "underline",
                                }
                              : {}
                          }
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

  /** 文章内容type=long_reading 长篇阅读*/
  renderSectionTypeThree(data, card, partName) {
    return (
      <div className="sectionBlock">
        <div className="sectionMain">
          <div id={`#${partName}${data.sectionName}`} className="title">
            {data.sectionName}
          </div>
          <div className="directions">
            <b>Directions: </b>In this section， you are going to read a passage
            with ten statements attached to it.Each statement contains
            information given in one of the paragraphs.Identify the paragraph
            from which the information is derived. You may choose a paragraph
            more than once.Each paragraph is marked with a letter.Answer the
            questions by marking the corresponding letter on{" "}
            <b>Answer Sheet.</b>
          </div>
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
                  ({" "}
                  <span
                    style={{
                      color: `${
                        (card[index]?.rightKey ? card[index]?.rightKey === card[index]?.choiceKey : true)
                          ? "#0076FF"
                          : "#FF0000"
                      }`,
                      textDecoration: "underline",
                    }}
                  >
                    {card[index]?.rightKey || card[index]?.choiceKey}
                  </span>{" "}
                  ){item}
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
    console.log('renderMain')
    const {
        paperData: { part = [], card = [] },
    } = this.state;
    const computedSection = (part, index) => {
        let res = 0;
        for (let i = 0; i < index; i++) {
            res += part[i].section.length
        }
        return res
    }
    return (
        <>
            {part.map((item, index) => {
                return (
                    <div className="mainItem">
                        <div className="titleBlock">
                            <div id={`#${item.partName}`} className="name">
                                {item.partName}
                            </div>
                            <div className="title">{item.title}</div>
                        </div>
                        <div className="section">
                            {
                                item.section.map((data, sectionIndex) => {
                                    if (data.type === BankType["pack"]) {
                                        return this.renderSectionTypeOne(
                                                data,
                                                card[computedSection(part, index) + sectionIndex],
                                                item.partName
                                            );
                                    } else if (data.type === BankType["cf_reading"]) {
                                        return this.renderSectionTypeTwo(
                                                data,
                                                card[computedSection(part, index) + sectionIndex],
                                                item.partName
                                            );
                                    } else if (data.type === BankType["long_reading"]) {
                                        return this.renderSectionTypeThree(
                                            data,
                                            card[computedSection(part, index) + sectionIndex],
                                            item.partName
                                        );
                                    } else {
                                        return this.renderSectionChoice(
                                            data,
                                            card[computedSection(part, index) + sectionIndex],
                                            item.partName
                                        );
                                    }
                                })
                            }
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
      showCheck,
      topPos,
    } = this.state;
    return (
      <>
        <div
          className="card"
          style={{ top: `${topPos > 68 ? "68px" : 148 - topPos}px` }}
        >
          <div className="headCon">
            <div className="leftTitle">答题卡</div>
            <div
              className="rightFind"
              onClick={this.checkSubmit.bind(this, true)}
            >
              漏答检测
            </div>
          </div>
          <div className="contentBlock">
            {card.map((item, index) => {
              return (
                <div key={index} className="itemBlock">
                  {item.map((val, num) => {
                    return (
                      <div
                        key={num}
                        className={
                          showCheck && !val.choiceKey
                            ? "blockLine blockLineActive"
                            : "blockLine"
                        }
                      >
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
                                onClick={this.chooseAnswer.bind(
                                  this,
                                  it,
                                  num,
                                  index
                                )}
                                key={count}
                              >
                                <span className="icon">[</span>
                                <span>{it}</span>
                                <span className="icon">]</span>
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

  renderFinishRes() {
    const {
      paperData: { card = [], score = 0 },
      topPos,
    } = this.state;
    return (
      <>
        <div
          className="card"
          style={{ top: `${topPos > 68 ? "68px" : 148 - topPos}px` }}
        >
          <div className="headCon">
            <div className="score">
              考试成绩:<span>{score}</span>
            </div>
          </div>
          <div className="headTips">
            <div className="text">序号</div>
            <div className="text">学生答案</div>
            <div className="text">正确答案</div>
          </div>
          <div className="contentBlock">
            {card.map((item, index) => {
              return (
                <div key={index} className="itemBlock padding0">
                  {item.map((val, num) => {
                    return (
                      <div
                        key={num}
                        className="blockLine blockLineFinish"
                        style={{
                          backgroundColor: `${
                            val.choiceKey !== val.rightKey ? "#FFF0F0" : "#FFF"
                          }`,
                        }}
                      >
                        <div
                          className="lineAns"
                          style={{ color: "#C3E2D5", fontWeight: 400 }}
                        >
                          {val.index}
                        </div>
                        <div
                          className="lineAns"
                          style={{
                            color:
                              val.rightKey === val.choiceKey
                                ? "#000"
                                : "#FF0000",
                          }}
                        >
                          {val.choiceKey}
                        </div>
                        <div className="lineAns">{val.rightKey}</div>
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

  exit() {
	this.props.history.push("/testList");
  }

  render() {
    const { paperData } = this.state;
    return (
      <div className="readingCom">
        <img className="background-img" src={whiteBookBg}></img>
        <div className="readingNameTitle">
          <div className="left">{paperData.paperName}</div>
          <div className="right">
            {paperData.paperFinish ? (
              <div className="nextSay" onClick={this.exit.bind(this)}>退出</div>
            ) : (
              <>
                <div
                  className="nextSay"
                  onClick={this.onSubmit.bind(this, false, 0)}
                >
                  下次再说
                </div>
                <Button
                  type="primary"
                  style={{ marginLeft: "16px", width: "88px" }}
                  onClick={this.onSubmit.bind(this, true, 0)}
                >
                  交卷
                </Button>
              </>
            )}
          </div>
        </div>
        <div className="readingContent">
          <div className="nav">{this.renderNav()}</div>
          <div className="main">{this.renderMain()}</div>
          <div className="response">
            {paperData.paperFinish ? this.renderFinishRes() : this.renderRes()}
          </div>
          <div className="time">
            {paperData.paperFinish ? (
              <></>
            ) : (
              <Countdown
                title="考试剩余时间"
                value={paperData.deadLine * 1000}
                onFinish={this.onSubmit.bind(this, false, 1)}
              />
            )}
          </div>
        </div>
      </div>
    );
  }
}

export default withRouter(ReadingCom);
