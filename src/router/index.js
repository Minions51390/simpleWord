import loadable from '@loadable/component'
import React, {Component} from 'react';
import {HashRouter, Route, Switch} from "react-router-dom";


// 页面异步chunk优化

const Index = loadable(() => import('../pages/Index'))
const Login = loadable(() => import('../pages/Login'))
const ChooseWord = loadable(() => import('../pages/ChooseWord'))
const userMes = loadable(() => import('../pages/userMes'))
const chooseStore = loadable(() => import('../pages/chooseStore'))
const reciteWords = loadable(() => import('../pages/ReciteWords'))
const Home = loadable(() => import('../pages/Home'))
const Transfer = loadable(() => import('../pages/Transfer'))
const AboutUS = loadable(() => import('../pages/AboutUs'))

export default class Root extends Component {
  render() {
    return (
        <HashRouter basename="/">
          <Switch>
            <Route path="/" exact component={Home}/>
            <Route path="/transfer" component={Transfer}></Route>
            <Route path="/home" component={Home}></Route>
            <Route path="/about" component={AboutUS}></Route>
            <Route path="/index"  component={Index}/>
            <Route path="/login" component={Login}/>
            <Route path="/chooseWord" component={ChooseWord}/>
            <Route path="/userMes" component={userMes}/>
            <Route path="/chooseStore" component={chooseStore}/>
            <Route path="/reciteWords" component={reciteWords}/>
          </Switch>
        </HashRouter>
    )
  }
}
