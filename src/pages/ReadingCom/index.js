import React from "react";
import "./index.less";
import Header from "../../components/Header/index";
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
} from "antd";
import baseUrl from "../../utils/config.js";

const response = {
	id: "xxx",
	paperName: "四六级完形填空",
	part: [
		{
			partName: "part1",
			section: [
				{
					sectionName: "sectionA",
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
				{
					sectionName: "sectionB",
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
				}
			]
		},
		{
			partName: "part2",
			section: [
				{
					sectionName: "sectionA",
					type: 2,
					directions: `Directions: There are several passages in this section. Each passage is followed by some questions or unfinishedstatements For each of them there are four choices marked A). B. C and D. You should decide on the bestchoice.`,
					article: `In managing information resources, the medium may be the key to aneffective system. The medium is a vehicle, a tool, or a container for holdincinformation; the information itself is the thing of value.Three popular categories of information media are paper, film, anoelectronic storage devices. The media choice must not be viewed as a choiceamong these three, however, it must be viewed as an opportunity to select froma multitude of media possibilities in combinations that build effective systems. lnmany instances the person responsible for information-resource management isnot the person who determines the medium in which information will be createdn such a case, the manager of a firm's information resources faces a challengein making a significant contribution to the organization's objectives.For effective management of information resources, media conversion maybe necessary. Examples include keying or scanning paper documents to convertthem to electronic media. Other processes convert electronic media from oneformat to another. For example, disk files created on one system may not becompatible with another system. Various hardware and software combinationscan be used to convert files to formats that equipment will accept. Folinformation generated within organizations, this necessity of making systemscompatible may be eliminated by cooperative planning. However, very littlecontrol can be exercised over the media used to generate information thatcomes to your organization from the outside.The medium for information may be selected to satisfy a need that existswhen information is created and communicated. For example, a paper recordmay be created because of its portability and because no special equipment isnecessary for later references to that information, electronic transmission mabe selected because it is the fastest means of communicating information. A firmmay use electronic mail because a network already exists for online computercommunication. The additional application may cost less than postage to mailpaper memos.`,
					questions: [
						{
							question: "Which of the following can bestsum up the passage?",
							answers: [
								"Media Selection in ManagingInformation Resources",
								"Media Selection in ManagingInformation Resources",
								"Media Selection in ManagingInformation Resources",
								"Media Selection in ManagingInformation Resources",
							],
						}
					]
				},
			]
		},
		{
			partName: "part3",
			section: [
				{
					sectionName: "sectionA",
					type: 3,
					directions: `Directions: In this section， you are going to read a passage with ten statements attached to it.Each statement contains information given in one of the paragraphs.Identify the paragraph from which the information is derived. You may choose a paragraph more than once.Each paragraph is marked with a letter.Answer the questions by marking the corresponding letter on Answer Sheet 2.`,
					article: ``,
					questions: [
						"Which of the following can bestsum up the passage?",
						"Which of the following can bestsum up the passage?",
						"Which of the following can bestsum up the passage?",
						"Which of the following can bestsum up the passage?",
						"Which of the following can bestsum up the passage?",
						"Which of the following can bestsum up the passage?",
						"Which of the following can bestsum up the passage?",
						"Which of the following can bestsum up the passage?",
						"Which of the following can bestsum up the passage?",
						"Which of the following can bestsum up the passage?",
					],
					answers: [
						"Media Selection in ManagingInformation Resources",
						"Media Selection in ManagingInformation Resources",
						"Media Selection in ManagingInformation Resources",
						"Media Selection in ManagingInformation Resources",
						"Media Selection in ManagingInformation Resources",
						"Media Selection in ManagingInformation Resources",
						"Media Selection in ManagingInformation Resources",
						"Media Selection in ManagingInformation Resources",
						"Media Selection in ManagingInformation Resources",
						"Media Selection in ManagingInformation Resources",
					]
				},
			]
		},
	]
}



export default class About extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
		paperData: {},
	};
  }

  componentWillMount() {

  }

  componentDidMount() {
	this.setState({
		paperData: response,
	});
  }

  render() {
	const { paperData } = this.state;
    return (
      <div>
        <Header />
		<div className="readingNameTitle">
			<div className="left">
				{ paperData.paperName }
			</div>
			<div className="right">
				<div className="nextSay">下次再说</div>
				<Button type="primary" style={{marginLeft: "16px", width: "88px"}}>交卷</Button>
			</div>
		</div>
		<div className="readingContent">
			<div className="left"></div>
			<div className="mid"></div>
			<div className="right"></div>
		</div>
      </div>
    );
  }
}
