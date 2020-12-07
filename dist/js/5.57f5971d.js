(window.webpackJsonp=window.webpackJsonp||[]).push([[5],{426:function(e,t,n){},432:function(e,t,n){"use strict";n.r(t),n.d(t,"default",(function(){return w}));var a=n(0),r=n.n(a),i=(n(426),n(423)),o=n(418),l=n(416),c=n(415),s=n(417),u=n(413),m=n(414),f=n(210),h=n(424);function p(e){return(p="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(e){return typeof e}:function(e){return e&&"function"==typeof Symbol&&e.constructor===Symbol&&e!==Symbol.prototype?"symbol":typeof e})(e)}function d(){return(d=Object.assign||function(e){for(var t=1;t<arguments.length;t++){var n=arguments[t];for(var a in n)Object.prototype.hasOwnProperty.call(n,a)&&(e[a]=n[a])}return e}).apply(this,arguments)}function b(e,t){for(var n=0;n<t.length;n++){var a=t[n];a.enumerable=a.enumerable||!1,a.configurable=!0,"value"in a&&(a.writable=!0),Object.defineProperty(e,a.key,a)}}function y(e,t){return(y=Object.setPrototypeOf||function(e,t){return e.__proto__=t,e})(e,t)}function g(e){return(g=Object.setPrototypeOf?Object.getPrototypeOf:function(e){return e.__proto__||Object.getPrototypeOf(e)})(e)}var E={labelCol:{span:4},wrapperCol:{span:20}},v={wrapperCol:{offset:4,span:20}},w=function(){!function(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function");e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,writable:!0,configurable:!0}}),t&&y(e,t)}(a,r.a.Component);var e,t,n=function(e){var t=function(){if("undefined"==typeof Reflect||!Reflect.construct)return!1;if(Reflect.construct.sham)return!1;if("function"==typeof Proxy)return!0;try{return Date.prototype.toString.call(Reflect.construct(Date,[],(function(){}))),!0}catch(e){return!1}}();return function(){var n,a,r,i=g(e);return a=this,!(r=t?(n=g(this).constructor,Reflect.construct(i,arguments,n)):i.apply(this,arguments))||"object"!==p(r)&&"function"!=typeof r?function(e){if(void 0!==e)return e;throw new ReferenceError("this hasn't been initialised - super() hasn't been called")}(a):r}}(a);function a(e){var t;return function(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}(this,a),(t=n.call(this,e)).state={mode:"login",email:""},t}return e=a,(t=[{key:"handleModeChange",value:function(e){var t=e.target.value;this.setState({mode:t})}},{key:"registerFinish",value:function(e){i.a.post("/auth/register",e).then((function(e){o.b.success("注册成功!"),window.location.href="".concat(h.a,"/#/chooseStore")})).catch((function(e){o.b.error("注册失败!")}))}},{key:"registerFinishFailed",value:function(e){o.b.error(e.errorFields[0].errors[0])}},{key:"loginFinish",value:function(e){i.a.post("/auth/login",e).then((function(e){o.b.success("登录成功!"),window.location.href="".concat(h.a,"/#/chooseStore")})).catch((function(e){o.b.error("登录失败!")}))}},{key:"loginFinishFailed",value:function(e){o.b.error(e.errorFields[0].errors[0])}},{key:"sendEmail",value:function(){i.a.post("/auth/email",{email:this.state.email}).then((function(e){o.b.success("验证码发送成功!")})).catch((function(e){o.b.error("验证码发送失败!")}))}},{key:"onInputEmail",value:function(e){this.setState({email:e.target.value})}},{key:"componentDidMount",value:function(){}},{key:"render",value:function(){var e=this.state,t=e.mode,n=e.email;return r.a.createElement("div",{className:"main_container"},r.a.createElement("div",{className:"page_header"},r.a.createElement("div",{className:"page_left"},r.a.createElement(l.a.Group,{onChange:this.handleModeChange.bind(this),value:t,style:{marginBottom:8}},r.a.createElement(l.a.Button,{value:"register"},"注册"),r.a.createElement(l.a.Button,{value:"login"},"登录"))),r.a.createElement("div",{className:"page_right"})),"register"===t?r.a.createElement("div",{className:"register_content"},r.a.createElement(c.a,d({},E,{name:"basic",initialValues:{remember:!0},onFinish:this.registerFinish.bind(this),onFinishFailed:this.registerFinishFailed.bind(this)}),r.a.createElement(c.a.Item,{label:"用户名",name:"userName",rules:[{required:!0,message:"请输入用户名"}]},r.a.createElement(s.a,null)),r.a.createElement(c.a.Item,{label:"密码",name:"password",rules:[{required:!0,message:"请输入密码"}]},r.a.createElement(s.a.Password,null)),r.a.createElement(c.a.Item,{label:"邮箱",name:"email",rules:[{required:!0,message:"请输入邮箱"}]},r.a.createElement(s.a,{type:"text",onChange:this.onInputEmail.bind(this),value:n})),r.a.createElement(c.a.Item,{label:"验证码"},r.a.createElement(u.a,{gutter:8},r.a.createElement(m.a,{span:12},r.a.createElement(c.a.Item,{name:"captcha",noStyle:!0,rules:[{required:!0,message:"请输入邮箱中的验证码"}]},r.a.createElement(s.a,null))),r.a.createElement(m.a,{span:12},r.a.createElement(f.a,{onClick:this.sendEmail.bind(this)},"获取验证码")))),r.a.createElement(c.a.Item,{label:"邀请码",name:"inviteCode",rules:[{required:!0,message:"请输入邀请码"}]},r.a.createElement(s.a,null)),r.a.createElement(c.a.Item,v,r.a.createElement(f.a,{type:"primary",htmlType:"submit"},"注册")))):r.a.createElement("div",{className:"login_content"},r.a.createElement(c.a,d({},E,{name:"basic",initialValues:{remember:!0},onFinish:this.loginFinish.bind(this),onFinishFailed:this.loginFinishFailed.bind(this)}),r.a.createElement(c.a.Item,{label:"用户名",name:"userName",rules:[{required:!0,message:"请输入用户名"}]},r.a.createElement(s.a,null)),r.a.createElement(c.a.Item,{label:"密码",name:"password",rules:[{required:!0,message:"请输入密码"}]},r.a.createElement(s.a.Password,null)),r.a.createElement(c.a.Item,v,r.a.createElement(f.a,{type:"primary",htmlType:"submit"},"登录")))))}}])&&b(e.prototype,t),a}()}}]);