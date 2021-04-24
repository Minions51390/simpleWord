import React from 'react';
import './index.less'
import { Link } from "react-router-dom";
import Axios from 'axios';
import { Form, Input, Button, Checkbox, Col, Row, Radio, Progress, message} from 'antd';
import { ArrowLeftOutlined, ArrowRightOutlined} from '@ant-design/icons';
// import getQueryString from ''
import {getQueryString} from '../../utils/stringUtils';
import HTTP from '../../utils/api.js';

import promise from '../home/assets/promise.png';
import whiteBookBg from '../../assets/whiteBookBg.png';
import backIcon from '../../assets/backIcon.png';
import spaceIcon from '../../assets/spaceIcon.png';
// import audioIcon from './assets/audioIcon.png';
import baseUrl from '../../utils/config.js';

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
    this.testType = null
    this.recordWordList = [];
  }

  componentWillMount() {
    this.testType = getQueryString('testType')
    this.loadQuestionsList()
  }
  
  componentDidMount() {
    document.onkeyup = this.onKeyUp.bind(this);
    document.onkeydown = this.onKeyDown.bind(this);
  }

  loadQuestionsList() {
    HTTP.get("/api/test", {
		params: {
			testType: this.testType,
			}
	}).then(res => {
      console.log("test 请求成功:", res.data);
      var questionList = res.data.data.subjectDetail
      var count = res.data.data.subjectCount
    //   wordList.length = 20
      this.setState({
        questionList: questionList || [],
        count: count
	  });
    }).catch(err => {
      console.log("请求失败:", err);
    });
  }

  postStrangeWordList() {
	const {count} = this.state;
    let values = {};
    values.testType = this.testType;
    values.testPaper = this.recordWordList;
    values.subjectCount = count;
    console.log('postStrangeWordList Success:', JSON.stringify(values));
    HTTP.post("/api/test",values).then(res => {
      console.log("postStrangeWordList 请求成功:", res);
        // window.location.href = `${baseUrl}/#/Transfer`;
        // window.location.reload()
    }).catch(err => {
      console.log("请求失败:", err);
    });
    this.recordWordList = []
  }

  onFinish(values) {
    console.log('Success:', values);
  }

  onFinishFailed(errorInfo) {
    console.log('Failed:', errorInfo);
  }
  onKeyDown(event) {
    if(event.keyCode == 32) { //空格键
      this.setState({
        whichKeyUp: null,
        whichKeyDown: 'space'
      });
    }
  }

  onKeyUp(event) {
    const {currentWordIndex, currentAnswer, isShowAnswer, questionList, isFinish} = this.state;
	if(event.keyCode == 32) { //空格键
      if (isFinish) {
        this.postStrangeWordList()
        this.setState({
          whichKeyDown: 'space',
          whichKeyUp: 'space',
        });
        // this.backToTransfer()
        message.success('新数据以同步');
	  } else if(isShowAnswer){
		  this.goNext()
	  }  else if(currentAnswer != null){
      this.setState({
        isShowAnswer: true
      });
      let isBingo = currentAnswer == questionList[currentWordIndex].solution
      console.log('currentAnswer', currentAnswer )
      this.recordResult(questionList[currentWordIndex].wordId, isBingo)
    } else {
      return
    }
    }
  }

  onClickOption(option) {
	const {isShowAnswer} = this.state;
	if (isShowAnswer) {
		return
	}

	console.log('onClickOption', option)
	this.setState({
		currentAnswer: option,
	});
  }

  onClickButton() {
    const {currentWordIndex, currentAnswer, isShowAnswer, isFinish} = this.state;
	if (isFinish) {
        this.postStrangeWordList()
        this.setState({
          whichKeyDown: 'space',
          whichKeyUp: 'space',
        });
        this.backToTransfer()
        message.success('新数据以同步');
	  } else if(isShowAnswer){
		  this.goNext()
	  } else if(currentAnswer != null){
      this.setState({
        isShowAnswer: true
      });
      let isBingo = currentAnswer == questionList[currentWordIndex].solution
      console.log('currentAnswer', currentAnswer )
      this.recordResult(questionList[currentWordIndex].wordId, isBingo)
    } else {
      return
    }
  }

  recordResult(wordid, isBingo){
	this.recordWordList.push(
		{wordid, result: isBingo}
	)
	console.log("recordResult" , this.recordWordList)
  }

  backToTransfer() {
    window.location.href = `${baseUrl}/#/Transfer`;
    window.location.reload()
  }
  

  goNext() {
    const count = this.state.count
    if(this.state.currentWordIndex + 1 < count) {
      this.setState({
		    isShowAnswer: false,
        currentWordIndex: this.state.currentWordIndex + 1,
        currentAnswer: null,
      });
      this.forceUpdate()
    } else {
      this.setState({
		currentAnswer: null,
		isShowAnswer: null,
        isFinish: true
      });
    }
  }


  render() {
    const {currentWordIndex, questionList, currentAnswer, isShowAnswer} = this.state;
	let testTypeText = '' 
      if(this.testType == 'dailyTest') {
        testTypeText = '当日小测'
      } else if(this.testType == 'specialTest') {
        testTypeText = '阶段考试'
	  }
	let questionType = ''
	if (questionList[currentWordIndex] && questionList[currentWordIndex].type == 'en-to-ch') {
		questionType = '单选题（请选择所给单词的正确中文释义）'
	} else if (questionList[currentWordIndex] && questionList[currentWordIndex].type == 'ch-to-en') {
		questionType = '单选题（请选择所给中文释义的正确单词）'
	}
	return (
      <div className="recite_wrapper">
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
			<div className="choose_left">{testTypeText}</div>
			<div className="choose_right">{'ddddd'}</div>
		</div>
			{questionList.length != 0  && questionList[currentWordIndex] != null && 
			<div className="choose_content">
				<span className="question_type">{questionType}</span><br/>
				<span className="word_text">{questionList[currentWordIndex].stem}</span><br/>
				<Radio.Group 
					className="button_content_space_between"
					name="radiogroup"
					value={this.state.currentAnswer}
					defaultValue={this.state.currentAnswer}> 
				{/* <div className="button_content_space_between"> */}
				{/* //  <Button className={whichKeyDown == 'left' ? "style_button" : null } icon={<ArrowLeftOutlined />} shape="round" onClick={this.onClick.bind(this, "left")}>会
				//     <div className={whichKeyUp == 'left' ? "click-animating-node" : null }></div>
					
				//   </Button> */}
					{questionList[currentWordIndex].options && 
					questionList[currentWordIndex].options.map((item, index) => {
						return (
							<div className={isShowAnswer && item.optionKey == questionList[currentWordIndex].solution ? "radio_cover_solution" : "radio_cover"} 
								onClick={this.onClickOption.bind(this, item.optionKey)}
								key = {`RadioKey${index}`}>
								<Radio 
									className={isShowAnswer && 
										item.optionKey == questionList[currentWordIndex].solution && 
										questionList[currentWordIndex].solution == currentAnswer ?  "radio_bingo" : null}
									disabled = {isShowAnswer}
									value = {item.optionKey}
									checked={currentAnswer ==item.optionKey ? true : false}
									>
									<span className={
										isShowAnswer && item.optionKey != questionList[currentWordIndex].solution 
										?"radio_text_false" 
										: "radio_text"}>{item.optionValue}</span>
								</Radio>
							</div>)
					})
						
					}
					
					{/* // <Button className={whichKeyDown == 'right' ? "style_button" : null } icon={<ArrowRightOutlined />} shape="round" onClick={this.onClick.bind(this, "right")}>不会
					// <div className={whichKeyUp == 'right' ? "click-animating-node" : null }></div></Button> */}
				{/* </div> */}
				</Radio.Group>
			</div>
			}
      <div className="progress_content">
        <div className="progress_before"/>
        <span className="progress_text">{`${currentWordIndex + 1} / ${totalCount}`}</span>
      </div>
	</div>	
    );
  }
}