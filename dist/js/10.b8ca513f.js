(window.webpackJsonp=window.webpackJsonp||[]).push([[10],{433:function(e,t,a){},440:function(e,t,a){"use strict";a.r(t),a.d(t,"default",(function(){return d}));var n=a(0),r=a.n(n),o=(a(433),a(421)),i=a(418),l=a(415),c=a(416),s=a(208),u=a(423);function m(e){return(m="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(e){return typeof e}:function(e){return e&&"function"==typeof Symbol&&e.constructor===Symbol&&e!==Symbol.prototype?"symbol":typeof e})(e)}function h(){return(h=Object.assign||function(e){for(var t=1;t<arguments.length;t++){var a=arguments[t];for(var n in a)Object.prototype.hasOwnProperty.call(a,n)&&(e[n]=a[n])}return e}).apply(this,arguments)}function f(e,t){var a,n=Object.keys(e);return Object.getOwnPropertySymbols&&(a=Object.getOwnPropertySymbols(e),t&&(a=a.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),n.push.apply(n,a)),n}function p(e,t){for(var a=0;a<t.length;a++){var n=t[a];n.enumerable=n.enumerable||!1,n.configurable=!0,"value"in n&&(n.writable=!0),Object.defineProperty(e,n.key,n)}}function v(e,t){return(v=Object.setPrototypeOf||function(e,t){return e.__proto__=t,e})(e,t)}function b(e){return(b=Object.setPrototypeOf?Object.getPrototypeOf:function(e){return e.__proto__||Object.getPrototypeOf(e)})(e)}var y={labelCol:{span:4},wrapperCol:{span:20}},d=function(){!function(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function");e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,writable:!0,configurable:!0}}),t&&v(e,t)}(n,r.a.Component);var e,t,a=function(e){var t=function(){if("undefined"==typeof Reflect||!Reflect.construct)return!1;if(Reflect.construct.sham)return!1;if("function"==typeof Proxy)return!0;try{return Date.prototype.toString.call(Reflect.construct(Date,[],(function(){}))),!0}catch(e){return!1}}();return function(){var a,n,r,o=b(e);return n=this,!(r=t?(a=b(this).constructor,Reflect.construct(o,arguments,a)):o.apply(this,arguments))||"object"!==m(r)&&"function"!=typeof r?function(e){if(void 0!==e)return e;throw new ReferenceError("this hasn't been initialised - super() hasn't been called")}(n):r}}(n);function n(e){var t;return function(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}(this,n),(t=a.call(this,e)).state={area:"",city:"",email:"",grade:"",latest_achievement:"",phone:"",province:"",qq_number:"",real_name:"",school:"",word_level:""},t}return e=n,(t=[{key:"onArea",value:function(e){this.setState({area:e.target.value})}},{key:"onCity",value:function(e){this.setState({city:e.target.value})}},{key:"onEmail",value:function(e){this.setState({email:e.target.value})}},{key:"onGrade",value:function(e){this.setState({grade:e.target.value})}},{key:"onLatestAchievement",value:function(e){this.setState({latest_achievement:e.target.value})}},{key:"onPhone",value:function(e){this.setState({phone:e.target.value})}},{key:"onProvince",value:function(e){this.setState({province:e.target.value})}},{key:"onQQ",value:function(e){this.setState({qq_number:e.target.value})}},{key:"onReal",value:function(e){this.setState({real_name:e.target.value})}},{key:"onSchool",value:function(e){this.setState({school:e.target.value})}},{key:"onWord",value:function(e){this.setState({word_level:e.target.value})}},{key:"subFinish",value:function(){var e=function(e){for(var t=1;t<arguments.length;t++){var a=null!=arguments[t]?arguments[t]:{};t%2?f(Object(a),!0).forEach((function(t){var n,r,o;n=e,o=a[r=t],r in n?Object.defineProperty(n,r,{value:o,enumerable:!0,configurable:!0,writable:!0}):n[r]=o})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(a)):f(Object(a)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(a,t))}))}return e}({},this.state);e.latestAchievement=this.state.latest_achievement,e.qqNumber=this.state.qq_number,e.wordLevel=this.state.word_level,e.realName=this.state.real_name,delete e.real_name,delete e.word_level,delete e.latest_achievement,delete e.qq_number,o.a.post("/api/profile",e).then((function(e){i.b.success("设置成功!"),window.location.href="".concat(u.a,"/#/chooseStore")})).catch((function(e){i.b.error("设置失败!")}))}},{key:"subFinishFailed",value:function(){}},{key:"componentWillMount",value:function(){var e=this;o.a.get("/api/profile").then((function(t){t&&t.data&&t.data.msg&&e.setState({area:t.data.msg.area||"",city:t.data.msg.city||"",email:t.data.msg.email||"",grade:t.data.msg.grade||"",latest_achievement:t.data.msg.latest_achievement||"",phone:t.data.msg.phone||"",province:t.data.msg.province||"",qq_number:t.data.msg.qq_number||"",real_name:t.data.msg.real_name||"",school:t.data.msg.school||"",word_level:t.data.msg.word_level||""})})).catch((function(e){i.b.error("个人信息获取失败!")}))}},{key:"componentDidMount",value:function(){}},{key:"render",value:function(){var e=this.state,t=e.area,a=e.city,n=(e.email,e.grade),o=e.latest_achievement,i=e.phone,u=e.province,m=e.qq_number,f=e.real_name,p=e.school;return e.word_level,r.a.createElement("div",{className:"user_container"},r.a.createElement(l.a,h({},y,{name:"basic",initialValues:{remember:!0}}),r.a.createElement("div",{className:"content_left"},r.a.createElement(l.a.Item,{label:"学校",rules:[{required:!0,message:"请输入学校"}]},r.a.createElement(c.a,{type:"text",onChange:this.onSchool.bind(this),value:p})),r.a.createElement(l.a.Item,{label:"年级",rules:[{required:!0,message:"请输入学校"}]},r.a.createElement(c.a,{type:"text",onChange:this.onGrade.bind(this),value:n})),r.a.createElement(l.a.Item,{label:"得分",rules:[{required:!0,message:"请输入得分"}]},r.a.createElement(c.a,{type:"text",onChange:this.onLatestAchievement.bind(this),value:o}))),r.a.createElement("div",{className:"content_right"},r.a.createElement(l.a.Item,{label:"姓名",rules:[{required:!0,message:"请输入姓名"}]},r.a.createElement(c.a,{type:"text",onChange:this.onReal.bind(this),value:f})),r.a.createElement(l.a.Item,{label:"省份",rules:[{required:!0,message:"请输入省份"}]},r.a.createElement(c.a,{type:"text",onChange:this.onProvince.bind(this),value:u})),r.a.createElement(l.a.Item,{label:"市份",rules:[{required:!0,message:"请输入市份"}]},r.a.createElement(c.a,{type:"text",onChange:this.onCity.bind(this),value:a})),r.a.createElement(l.a.Item,{label:"区",rules:[{required:!0,message:"请输入区"}]},r.a.createElement(c.a,{type:"text",onChange:this.onArea.bind(this),value:t})),r.a.createElement(l.a.Item,{label:"手机号",rules:[{required:!0,message:"请输入手机号"}]},r.a.createElement(c.a,{type:"text",onChange:this.onPhone.bind(this),value:i})),r.a.createElement(l.a.Item,{label:"QQ号",rules:[{required:!0,message:"请输入QQ号"}]},r.a.createElement(c.a,{type:"text",onChange:this.onQQ.bind(this),value:m})),r.a.createElement("div",{className:"confirm"},r.a.createElement(s.a,{type:"primary",htmlType:"submit",size:"large",block:!0,onClick:this.subFinish.bind(this)},"确认提交")))))}}])&&p(e.prototype,t),n}()}}]);