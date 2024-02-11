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
// 1 完 2 阅读 3 7/5
const response = {
  id: "xxx",
  paperName: "四六级完形填空",
  part: [
    {
      partName: "PartI",
      title: "Reading Comprehension",
      section: [
        {
          sectionName: "SectionA",
          type: 1,
          directions: `Directions: ln this section, there is a passage with several blanks. You are required to select one word for eachblank from a list of choices given in a word bank following the passage. Read the passage through carefully beforemaking your choices. Each choice in the bank is identified by a lefter. You may not use any of the words in thebank more than once.`,
          article: `Kindness may be a virtue, but that doesn't mean it's easy. Diego decided to start performing random acts of kindnessfor strangers, inspired by someone "who had lived a very dificult life, but despite this was able to maintain hist (1                   ) owards others." Diego gave out free movie (2                ) odd reactions. "Some people act really puzzled," he says. "A lot of people are uncomfortable getting a gift from a strangerSome people actually gave it back." Villaveces, 38, who works in marketing and lives in Sydney with his wife and childrengives out a card with each random act of kindness: it asks the receiver to pass on a good (3                ) decided I wanted to do something more for (4                ) around you." He set up a website to track the progress of the cards, but admits that so far the response has been (5                ) lt's also fair to say that there's some level of cynicism towards kindness. The label "do gooder" isn't a (6                ) We all like the idea of being kind, but at the same time, don't nice guys always finish last? Acting from the goodness of yourheart goes directly against the " (7                ) compete for existence quite (8                ) bystander effect" when someone needs help in a public place, they are less likely to receive help if there are more peoplearound. Researchers believe that the effect arises because everyone takes the hint from the crowd and (10                ) someone else will take responsibility.`,
          answers: [
            "sure1",
            "sure2",
            "sure3",
            "sure4",
            "sure5",
            "sure6",
            "sure7",
            "sure8",
            "sure9",
            "sure10",
          ],
        },
      ],
    },
    {
      partName: "PartII",
      title: "Reading Comprehension",
      section: [
        {
          sectionName: "SectionA",
          type: 2,
          directions: `Directions: There are several passages in this section. Each passage is followed by some questions or unfinishedstatements For each of them there are four choices marked A). B. C and D. You should decide on the bestchoice.`,
          article: `In managing information resources, the medium may be the key to aneffective system. The medium is a vehicle, a tool, or a container for holdincinformation; the information itself is the thing of value.Three popular categories of information media are paper, film, anoelectronic storage devices. The media choice must not be viewed as a choiceamong these three, however, it must be viewed as an opportunity to select froma multitude of media possibilities in combinations that build effective systems. lnmany instances the person responsible for information-resource management isnot the person who determines the medium in which information will be createdn such a case, the manager of a firm's information resources faces a challengein making a significant contribution to the organization's objectives.For effective management of information resources, media conversion maybe necessary. Examples include keying or scanning paper documents to convertthem to electronic media. Other processes convert electronic media from oneformat to another. For example, disk files created on one system may not becompatible with another system. Various hardware and software combinationscan be used to convert files to formats that equipment will accept. Folinformation generated within organizations, this necessity of making systemscompatible may be eliminated by cooperative planning. However, very littlecontrol can be exercised over the media used to generate information thatcomes to your organization from the outside.The medium for information may be selected to satisfy a need that existswhen information is created and communicated. For example, a paper recordmay be created because of its portability and because no special equipment isnecessary for later references to that information, electronic transmission mabe selected because it is the fastest means of communicating information. A firmmay use electronic mail because a network already exists for online computercommunication. The additional application may cost less than postage to mailpaper memos.`,
          questions: [
            {
              question: "11.Which of the following can bestsum up the passage?",
              answers: [
                "Media Selection in ManagingInformation Resources",
                "Media Selection in ManagingInformation Resources",
                "Media Selection in ManagingInformation Resources",
                "Media Selection in ManagingInformation Resources",
              ],
            },
            {
              question: "12.Which of the following can bestsum up the passage?",
              answers: [
                "Media Selection in ManagingInformation Resources",
                "Media Selection in ManagingInformation Resources",
                "Media Selection in ManagingInformation Resources",
                "Media Selection in ManagingInformation Resources",
              ],
            },
            {
              question: "13.Which of the following can bestsum up the passage?",
              answers: [
                "Media Selection in ManagingInformation Resources",
                "Media Selection in ManagingInformation Resources",
                "Media Selection in ManagingInformation Resources",
                "Media Selection in ManagingInformation Resources",
              ],
            },
            {
              question: "14.Which of the following can bestsum up the passage?",
              answers: [
                "Media Selection in ManagingInformation Resources",
                "Media Selection in ManagingInformation Resources",
                "Media Selection in ManagingInformation Resources",
                "Media Selection in ManagingInformation Resources",
              ],
            },
            {
              question: "15.Which of the following can bestsum up the passage?",
              answers: [
                "Media Selection in ManagingInformation Resources",
                "Media Selection in ManagingInformation Resources",
                "Media Selection in ManagingInformation Resources",
                "Media Selection in ManagingInformation Resources",
              ],
            },
          ],
        },
      ],
    },
    {
      partName: "PartIII",
      title: "Reading Comprehension",
      section: [
        {
          sectionName: "SectionA",
          type: 3,
          directions: `Directions: In this section， you are going to read a passage with ten statements attached to it.Each statement contains information given in one of the paragraphs.Identify the paragraph from which the information is derived. You may choose a paragraph more than once.Each paragraph is marked with a letter.Answer the questions by marking the corresponding letter on Answer Sheet 2.`,
          article: ``,
          questions: [
            "16.A new study found parents'a version to certain animals would pass on to their children.",
            "17.A new study found parents'a version to certain animals would pass on to their children.",
            "18.A new study found parents'a version to certain animals would pass on to their children.",
            "19.A new study found parents'a version to certain animals would pass on to their children.",
            "20.A new study found parents'a version to certain animals would pass on to their children.",
            "21.A new study found parents'a version to certain animals would pass on to their children.",
            "22.A new study found parents'a version to certain animals would pass on to their children.",
            "23.A new study found parents'a version to certain animals would pass on to their children.",
            "24.A new study found parents'a version to certain animals would pass on to their children.",
            "25.A new study found parents'a version to certain animals would pass on to their children.",
          ],
          answers: [
            "What do we lose when natural spaces and species disappear?Increasingly， research has shown that as species and ecosystems vanish， it also chipsaway at our ability to preserve what remains—because we no longer understand what we're losing",
            "What do we lose when natural spaces and species disappear?Increasingly， research has shown that as species and ecosystems vanish， it also chipsaway at our ability to preserve what remains—because we no longer understand what we're losing",
            "What do we lose when natural spaces and species disappear?Increasingly， research has shown that as species and ecosystems vanish， it also chipsaway at our ability to preserve what remains—because we no longer understand what we're losing",
            "What do we lose when natural spaces and species disappear?Increasingly， research has shown that as species and ecosystems vanish， it also chipsaway at our ability to preserve what remains—because we no longer understand what we're losing",
            "What do we lose when natural spaces and species disappear?Increasingly， research has shown that as species and ecosystems vanish， it also chipsaway at our ability to preserve what remains—because we no longer understand what we're losing",
            "What do we lose when natural spaces and species disappear?Increasingly， research has shown that as species and ecosystems vanish， it also chipsaway at our ability to preserve what remains—because we no longer understand what we're losing",
            "What do we lose when natural spaces and species disappear?Increasingly， research has shown that as species and ecosystems vanish， it also chipsaway at our ability to preserve what remains—because we no longer understand what we're losing",
            "What do we lose when natural spaces and species disappear?Increasingly， research has shown that as species and ecosystems vanish， it also chipsaway at our ability to preserve what remains—because we no longer understand what we're losing",
            "What do we lose when natural spaces and species disappear?Increasingly， research has shown that as species and ecosystems vanish， it also chipsaway at our ability to preserve what remains—because we no longer understand what we're losing",
            "What do we lose when natural spaces and species disappear?Increasingly， research has shown that as species and ecosystems vanish， it also chipsaway at our ability to preserve what remains—because we no longer understand what we're losing",
          ],
        },
      ],
    },
  ],
  card: [
    [
      {
        index: 1,
        key: [
          "A",
          "B",
          "C",
          "D",
          "E",
          "F",
          "G",
          "H",
          "I",
          "J",
          "K",
          "L",
          "M",
          "N",
          "O",
        ],
      },
      {
        index: 2,
        key: [
          "A",
          "B",
          "C",
          "D",
          "E",
          "F",
          "G",
          "H",
          "I",
          "J",
          "K",
          "L",
          "M",
          "N",
          "O",
        ],
      },
      {
        index: 3,
        key: [
          "A",
          "B",
          "C",
          "D",
          "E",
          "F",
          "G",
          "H",
          "I",
          "J",
          "K",
          "L",
          "M",
          "N",
          "O",
        ],
      },
      {
        index: 4,
        key: [
          "A",
          "B",
          "C",
          "D",
          "E",
          "F",
          "G",
          "H",
          "I",
          "J",
          "K",
          "L",
          "M",
          "N",
          "O",
        ],
      },
      {
        index: 5,
        key: [
          "A",
          "B",
          "C",
          "D",
          "E",
          "F",
          "G",
          "H",
          "I",
          "J",
          "K",
          "L",
          "M",
          "N",
          "O",
        ],
      },
      {
        index: 6,
        key: [
          "A",
          "B",
          "C",
          "D",
          "E",
          "F",
          "G",
          "H",
          "I",
          "J",
          "K",
          "L",
          "M",
          "N",
          "O",
        ],
      },
      {
        index: 7,
        key: [
          "A",
          "B",
          "C",
          "D",
          "E",
          "F",
          "G",
          "H",
          "I",
          "J",
          "K",
          "L",
          "M",
          "N",
          "O",
        ],
      },
      {
        index: 8,
        key: [
          "A",
          "B",
          "C",
          "D",
          "E",
          "F",
          "G",
          "H",
          "I",
          "J",
          "K",
          "L",
          "M",
          "N",
          "O",
        ],
      },
      {
        index: 9,
        key: [
          "A",
          "B",
          "C",
          "D",
          "E",
          "F",
          "G",
          "H",
          "I",
          "J",
          "K",
          "L",
          "M",
          "N",
          "O",
        ],
      },
      {
        index: 10,
        key: [
          "A",
          "B",
          "C",
          "D",
          "E",
          "F",
          "G",
          "H",
          "I",
          "J",
          "K",
          "L",
          "M",
          "N",
          "O",
        ],
      },
    ],
    [
      {
        index: 11,
        key: ["A", "B", "C", "D"],
      },
      {
        index: 12,
        key: ["A", "B", "C", "D"],
      },
      {
        index: 13,
        key: ["A", "B", "C", "D"],
      },
      {
        index: 14,
        key: ["A", "B", "C", "D"],
      },
      {
        index: 15,
        key: ["A", "B", "C", "D"],
      },
    ],
    [
      {
        index: 16,
        key: [
          "A",
          "B",
          "C",
          "D",
          "E",
          "F",
          "G",
          "H",
          "I",
          "J",
          "K",
          "L",
          "M",
          "N",
          "O",
        ],
      },
      {
        index: 17,
        key: [
          "A",
          "B",
          "C",
          "D",
          "E",
          "F",
          "G",
          "H",
          "I",
          "J",
          "K",
          "L",
          "M",
          "N",
          "O",
        ],
      },
      {
        index: 18,
        key: [
          "A",
          "B",
          "C",
          "D",
          "E",
          "F",
          "G",
          "H",
          "I",
          "J",
          "K",
          "L",
          "M",
          "N",
          "O",
        ],
      },
      {
        index: 19,
        key: [
          "A",
          "B",
          "C",
          "D",
          "E",
          "F",
          "G",
          "H",
          "I",
          "J",
          "K",
          "L",
          "M",
          "N",
          "O",
        ],
      },
      {
        index: 20,
        key: [
          "A",
          "B",
          "C",
          "D",
          "E",
          "F",
          "G",
          "H",
          "I",
          "J",
          "K",
          "L",
          "M",
          "N",
          "O",
        ],
      },
      {
        index: 21,
        key: [
          "A",
          "B",
          "C",
          "D",
          "E",
          "F",
          "G",
          "H",
          "I",
          "J",
          "K",
          "L",
          "M",
          "N",
          "O",
        ],
      },
      {
        index: 22,
        key: [
          "A",
          "B",
          "C",
          "D",
          "E",
          "F",
          "G",
          "H",
          "I",
          "J",
          "K",
          "L",
          "M",
          "N",
          "O",
        ],
      },
      {
        index: 23,
        key: [
          "A",
          "B",
          "C",
          "D",
          "E",
          "F",
          "G",
          "H",
          "I",
          "J",
          "K",
          "L",
          "M",
          "N",
          "O",
        ],
      },
      {
        index: 24,
        key: [
          "A",
          "B",
          "C",
          "D",
          "E",
          "F",
          "G",
          "H",
          "I",
          "J",
          "K",
          "L",
          "M",
          "N",
          "O",
        ],
      },
      {
        index: 25,
        key: [
          "A",
          "B",
          "C",
          "D",
          "E",
          "F",
          "G",
          "H",
          "I",
          "J",
          "K",
          "L",
          "M",
          "N",
          "O",
        ],
      },
    ],
  ],
  textTime: 90,
};

const { Countdown } = Statistic;

export default class ReadingCom extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      paperData: {},
    };
  }

  componentWillMount() {}

  componentDidMount() {
    this.setState({
      paperData: response,
    });
  }

  scrollToView(id) {
    let element = document.getElementById(id);
    element.scrollIntoView();
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

  /** 文章内容type=1 */
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
            {data.answers.map((item, index) => {
              return (
                <div className="answer">{`${this.num2abc(
                  index
                )}）${item}`}</div>
              );
            })}
          </div>
        </div>
      </div>
    );
  }

  /** 文章内容type=2 */
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
                        >{`${this.num2abc(number)}）${value}`}</div>
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

  /** 文章内容type=3 */
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
                <div className="answer">{`${this.num2abc(
                  index
                )}）${item}`}</div>
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
                  if (data.type === 1) {
                    return this.renderSectionTypeOne(data);
                  } else if (data.type === 2) {
                    return this.renderSectionTypeTwo(data);
                  } else {
                    return this.renderSectionTypeThree(data);
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
                              <div className="lineItem" key={count}>
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

  num2abc(num) {
    const CHAR_MAP = [
      "A",
      "B",
      "C",
      "D",
      "E",
      "F",
      "G",
      "H",
      "I",
      "J",
      "K",
      "L",
      "M",
      "N",
      "O",
      "P",
      "Q",
      "R",
      "S",
      "T",
      "U",
      "V",
      "W",
      "X",
      "Y",
      "Z",
    ];
    return CHAR_MAP[num];
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
