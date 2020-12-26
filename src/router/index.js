import loadable from '@loadable/component'
import React, {Component} from 'react';
import {HashRouter, Route, Switch} from "react-router-dom";


// 页面异步chunk优化

const Index = loadable(() => import('../pages/Index'))
const Login = loadable(() => import('../pages/Login'))
const ChooseWord = loadable(() => import('../pages/ChooseWord'))
const userMes = loadable(() => import('../pages/userMes'))
const chooseStore = loadable(() => import('../pages/chooseStore'))
const Home = loadable(() => import('../pages/Home'))

export default class Root extends Component {
  render() {
    return (
        <HashRouter basename="/">
          <Switch>
            <Route path="/" exact component={chooseStore}/>
            <Route path="/home" component={Home}></Route>
            <Route path="/index"  component={Index}/>
            <Route path="/login" component={Login}/>
            <Route path="/chooseWord" component={ChooseWord}/>
            <Route path="/userMes" component={userMes}/>
            <Route path="/chooseStore" component={chooseStore}/>
          </Switch>
        </HashRouter>
    )
  }
}
