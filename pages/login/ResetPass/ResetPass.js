// pages/login/ResetPass/ResetPass.js
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
    resetPwd: {}, //重置密码参数存储
    currentTime: 61, //获取短信验证码时的倒计时
    time: '获取验证码',
    disabled: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    if (options.deleBack != undefined) {
      this.setData({
        deleBack: options.deleBack
      })
    }
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
    var phoneNum = this.data.resetPwd.phoneNum;
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
    var phoneNum = that.data.resetPwd.phoneNum;
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
            ["resetPwd.getVerifyCode"]: res.data.DATA.Code
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


  /**
   * 获取手机号码
   */
  bindGetPhoneNum: function(e) {
    this.setData({
      ["resetPwd.phoneNum"]: e.detail.value
    });
  },

  /**
   * 获取验证码
   */
  bindGetVerifyCode: function(e) {
    this.setData({
      ["resetPwd.verifyCode"]: e.detail.value
    });
    console.log(this.data.resetPwd.verifyCode);
  },

  /**
   * 获取新密码
   */
  bindGetNewPassword: function(e) {
    this.setData({
      ["resetPwd.newPassword"]: e.detail.value
    });
  },

  /**
   * 重置密码方法
   */
  resetPwd: function() {
    var that = this;
    var phoneNum = this.data.resetPwd.phoneNum;
    var newPassword = this.data.resetPwd.newPassword;
    var verifyCode = this.data.resetPwd.verifyCode;
    var getVerifyCode = this.data.resetPwd.getVerifyCode;
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
    if (verifyCode == undefined || verifyCode == '' || verifyCode==null) {
      wx.showToast({
        title: '验证码不能为空',
        icon: 'none',
        duration: 1000
      })
      return false;
    }
    console.log(verifyCode);
    if (newPassword == undefined || newPassword == '' || newPassword==null) {
      wx.showToast({
        title: '密码不能为空',
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
    wx.showLoading({
      title: '正在修改...',
    })
    var param = {
      UserName: phoneNum,
      Password: newPassword
    }
    util.ajaxRequest('/AppApiUser/Account_Users/ForgetThePassword', 'POST', param,
      function(res) {
        if (res.data.ERROR_CODE == "-1") {
          wx.showToast({
            title: '修改成功，跳转到登录页面',
            icon: 'none',
            duration: 1000
          })
          setTimeout(function() {
            wx.reLaunch({
              url: '../login/login'
            });
          }, 2000)

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
  }
})