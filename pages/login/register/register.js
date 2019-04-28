// pages/login/register/register.js
var util = require("../../../utils/util.js");
var interval = null //倒计时函数
Page({

  /**
   * 页面的初始数据
   */
  data: {
    statusBarHeight: wx.getStorageSync('statusBarHeight'),
    titleBarHeight: wx.getStorageSync('titleBarHeight'),
    deleBack: false, //返回突变是否显示
    register: {}, //注册信息
    currentTime: 61, //获取短信验证码时的倒计时
    time: '获取验证码',
    disabled: false,
    checkBoxBol: false,//复选框选中状态
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    if (options.deleBack != undefined) {
      this.setData({
        deleBack: options.deleBack,
      })
    }
    console.log("index 生命周期 onload" + JSON.stringify(options))
    // if (options.q) {
    //   let q = decodeURIComponent(options.q);
    //   var AgentCode = util.getQueryString(q, 'AgentCode');
    //   console.log("获取的推广码是：" + AgentCode);
    //   this.setData({
    //     ["register.inviteCode"]: AgentCode
    //   });
    // } else {
    this.setData({
      ["register.inviteCode"]: wx.getStorageSync('AgentCode')
    });
    // }
  },
  /*
  * 获取复选框状态
  */
  updateBol(){
    let checkBox = this.data.checkBoxBol == false?true:false
    this.setData({
      checkBoxBol: checkBox
    })
    console.log(this.data.checkBoxBol)
  },
  /**
   * 获取验证码
   */
  getCode: function(options) {
    var that = this;
    var currentTime = that.data.currentTime
    interval = setInterval(function() {
      currentTime--;
      that.setData({
        time: currentTime + '秒'
      })
      if (currentTime <= 0) {
        clearInterval(interval)
        that.setData({
          time: '重新发送',
          currentTime: 61,
          disabled: false
        })
      }
    }, 1000)
  },

  /**
   * 点击获取验证码的按钮
   */
  getVerificationCode() {
    var that = this
    var phoneNum = this.data.register.phoneNum;
    if (phoneNum == undefined || phoneNum == '' || phoneNum==null) {
      wx.showToast({
        title: '手机号不能为空',
        icon: 'none',
        duration: 1000
      })
      return false;
    }

    if (!(/^1[34578]\d{9}$/.test(phoneNum))) {
      wx.showToast({
        title: '手机号格式不正确',
        icon: 'none',
        duration: 1000
      })
      return false;
    }

    that.setData({
      disabled: true
    })
    this.getCode();
    this.verifyCode();
  },

  /**
   * 调用获取验证码的接口
   */
  verifyCode: function() {
    var that = this;
    var phoneNum = that.data.register.phoneNum;
    var param = {
      UserName: phoneNum,
    }
    console.log(JSON.stringify(param));
    util.ajaxRequest('/AppApiUser/Account_Users/SendSMS', 'POST', param,
      function(res) {
        console.log("返回值是：" + JSON.stringify(res))
        if (res.data.ERROR_CODE == "-1") {
          console.log("获取的userid是：" + JSON.stringify(res.data))
          that.setData({
            ["register.getVerifyCode"]: res.data.DATA.Code
          });
          //隐藏-加载中
          wx.hideLoading();
          //隐藏-加载中
          wx.hideNavigationBarLoading();
          //停止当前页面下拉刷新
          wx.stopPullDownRefresh();
        } else {
          //错误提示
          wx.showModal({
            showCancel: false,
            content: res.data.ERROR_MESSAGE
          });
          //隐藏-加载中
          wx.hideLoading();
          //停止当前页面下拉刷新
          wx.stopPullDownRefresh();
          //隐藏-加载中
          wx.hideNavigationBarLoading();
        }
      },
      function(res) {
        //错误提示
        wx.showModal({
          showCancel: false,
          content: res.data.ERROR_MESSAGE
        });
        //隐藏-加载中
        wx.hideLoading();
        //停止当前页面下拉刷新
        wx.stopPullDownRefresh();
        //隐藏-加载中
        wx.hideNavigationBarLoading();
      });
  },


  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },
  /*
  * 输入姓名
  */
  name: function (e) {
    this.setData({
      ['register.name']: e.detail.value
    })
  },
  /**
   * 获取手机号码
   */
  bindGetPhoneNum: function(e) {
    this.setData({
      ["register.phoneNum"]: e.detail.value
    });
  },

  /**
   * 获取密码
   */
  bindGetPassword: function(e) {
    this.setData({
      ["register.password"]: e.detail.value
    });
  },

  /**
   * 获取验证码
   */
  bindGetVerifyCode: function(e) {
    this.setData({
      ["register.verifyCode"]: e.detail.value
    });
  },

  /**
   * 获取邀请码
   */
  bindGetInviteCode: function(e) {
    this.setData({
      ["register.inviteCode"]: e.detail.value
    });
  },
  /*
  * 打开用户协议
  */
  openUserAgree(){
    wx.navigateTo({
      url: '../userAgree/userAgree',
    })
  },
  /**
   * 注册方法
   */
  register: function() {
    var that = this;
    var name = that.data.register.name;
    var phoneNum = this.data.register.phoneNum;
    var password = this.data.register.password;
    var verifyCode = this.data.register.verifyCode;
    var getVerifyCode = this.data.register.getVerifyCode;
    var inviteCode = this.data.register.inviteCode; //邀请码
    if (name == undefined || name == '' || name == null) {
      wx.showToast({
        title: '姓名不能为空',
        icon: 'none',
        duration: 1000
      })
      return false;
    }
    if (phoneNum == undefined || phoneNum == '' || phoneNum==null) {
      wx.showToast({
        title: '手机号不能为空',
        icon: 'none',
        duration: 1000
      })
      return false;
    }

    if (!(/^1[34578]\d{9}$/.test(phoneNum))) {
      wx.showToast({
        title: '手机号格式不正确',
        icon: 'none',
        duration: 1000
      })
      return false;
    }

    if (password == undefined || password == '' || password==null) {
      wx.showToast({
        title: '密码不能为空',
        icon: 'none',
        duration: 1000
      })
      return false;
    }
    if (verifyCode == undefined || verifyCode == '' || verifyCode==null) {
      wx.showToast({
        title: '验证码不能为空',
        icon: 'none',
        duration: 1000
      })
      return false;
    }
    if (verifyCode != getVerifyCode) {
      wx.showToast({
        title: '验证码错误',
        icon: 'none',
        duration: 1000
      })
      return false;
    }
    if (inviteCode == undefined || inviteCode == '' || inviteCode==null) {
      wx.showToast({
        title: '邀请码不能为空',
        icon: 'none',
        duration: 1000
      })
      return false;
    }
    if(!this.data.checkBoxBol){
      wx.showToast({
        title: '请确认已阅读飞雳士商城用户协议',
        icon: 'none',
        duration: 1000
      })
      return false
    }
    wx.showLoading({
      title: '正在注册...',
    })
    var param = {
      TrueName: name,
      UserName: phoneNum,
      Password: password,
      AgentCode: inviteCode,
    }
    console.log(JSON.stringify(param));
    util.ajaxRequest('/AppApiUser/Account_Users/UsersRegister', 'POST', param,
      function(res) {
        console.log("返回值是：" + JSON.stringify(res))
        if (res.data.ERROR_CODE == "-1") {
          console.log("获取的userid是：" + JSON.stringify(res.data))
          wx.setStorageSync("UserID", res.data.DATA.UserID);
          wx.showToast({
            title: '注册成功，正在跳转',
            icon: 'none',
            duration: 1000
          })
          wx.reLaunch({
            url: '../../home/index/index'
          });

          //隐藏-加载中
          wx.hideLoading();
          //隐藏-加载中
          wx.hideNavigationBarLoading();
          //停止当前页面下拉刷新
          wx.stopPullDownRefresh();
        } else {
          //错误提示
          wx.showModal({
            showCancel: false,
            content: res.data.ERROR_MESSAGE
          });
          //隐藏-加载中
          wx.hideLoading();
          //停止当前页面下拉刷新
          wx.stopPullDownRefresh();
          //隐藏-加载中
          wx.hideNavigationBarLoading();
        }
      },
      function(res) {
        //错误提示
        wx.showModal({
          showCancel: false,
          content: res.data.ERROR_MESSAGE
        });
        //隐藏-加载中
        wx.hideLoading();
        //停止当前页面下拉刷新
        wx.stopPullDownRefresh();
        //隐藏-加载中
        wx.hideNavigationBarLoading();
      });
  },
})