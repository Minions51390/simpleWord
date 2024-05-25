import loadable from '@loadable/component'
import React, {Component} from 'react';
import {HashRouter, Route, Switch} from "react-router-dom";
import { Layout } from '../components/Layout/index.jsx';


// 页面异步chunk优化
const Index = loadable(() => import('../pages/Index'))
const Login = loadable(() => import('../pages/Login'))
const ChooseWord = loadable(() => import('../pages/ChooseWord'))
const userMes = loadable(() => import('../pages/userMes'))
const chooseStore = loadable(() => import('../pages/chooseStore'))
const reciteWords = loadable(() => import('../pages/ReciteWords'))
const TestWord = loadable(() => import('../pages/TestWord'))
const WritingDetail = loadable(() => import('../pages/Writing/Detail'))
const WritingList = loadable(() => import('../pages/Writing/List'))
const Home = loadable(() => import('../pages/Home'))
const Transfer = loadable(() => import('../pages/Transfer'))
const AboutUS = loadable(() => import('../pages/AboutUs'))
const Download = loadable(() => import('../pages/Download'))
const Dashboard = loadable(() => import('../pages/Dashboard/index.jsx'))
const ExamAndWrite = loadable(() => import('../pages/ExamAndWrite/index.jsx'))
const ReadingCom = loadable(() => import("../pages/ReadingCom"))

export default class Root extends Component {
  render() {
    return (
      <HashRouter basename="/">
        <Layout>
          <Switch>
            <Route path="/" exact component={Home}/>
            <Route path="/transfer" component={Transfer}></Route>
            <Route path="/home" component={Home}></Route>
            <Route path="/dashboard" component={Dashboard}></Route>
            <Route path="/about" component={AboutUS}></Route>
            <Route path="/download" component={Download}></Route>
            <Route path="/reciteWordsFallback" component={Download}></Route>
            <Route path="/index"  component={Index}/>
            <Route path="/login" component={Login}/>
            <Route path="/chooseWord" component={ChooseWord}/>
            <Route path="/userMes" component={userMes}/>
            <Route path="/chooseStore" component={chooseStore}/>
            <Route path="/reciteWords" component={reciteWords}/>
            <Route path="/testWord" component={TestWord}/>
            <Route path="/writingList" component={WritingList}/>
            <Route path="/writingDetail" component={WritingDetail}/>
            <Route path="/examAndWrite" component={ExamAndWrite}/>
			<Route path="/readingCom" component={ReadingCom} />
          </Switch>
        </Layout>
      </HashRouter>
    )
  }
}
