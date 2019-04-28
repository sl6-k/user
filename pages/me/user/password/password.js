// pages/me/user/password/password.js
var util = require("../../../../utils/util.js");
var interval = null //倒计时函数
Page({

  /**
   * 页面的初始数据
   */
  data: {
    forgetPwd: {}, //忘记密码需要提交的信息
    options: null, //页面传递的参数
    currentTime: 61, //获取短信验证码时的倒计时
    time: '获取验证码',
    disabled: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    console.log("+++++++++++++" + JSON.stringify(options));
    this.setData({
      options: options
    });
    if (options.IsOneClick == 2) {
      wx.setNavigationBarTitle({
        title: '设置密码'
      })
    }
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
    var phoneNum = this.data.forgetPwd.phoneNum;
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
    var phoneNum = that.data.forgetPwd.phoneNum;
    var param = {
      UserName: phoneNum,
    }
    console.log(JSON.stringify(param));
    util.ajaxRequest('/AppApiAgent/Account_Users/SendSMS', 'POST', param,
      function(res) {
        console.log("返回值是：" + JSON.stringify(res))
        if (res.data.ERROR_CODE == "-1") {
          console.log("获取的userid是：" + JSON.stringify(res.data))
          that.setData({
            ["forgetPwd.getVerifyCode"]: res.data.DATA.Code
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
   * 获取手机号码
   */
  bindGetPhoneNum: function(e) {
    this.setData({
      ["forgetPwd.phoneNum"]: e.detail.value
    });
  },

  /**
   * 获取原密码
   */
  bindGetOldPassword: function(e) {
    this.setData({
      ["forgetPwd.oldPassword"]: e.detail.value
    });
  },

  /**
   * 获取新密码
   */
  bindGetNewPassword: function(e) {
    this.setData({
      ["forgetPwd.newPassword"]: e.detail.value
    });
  },

  /**
   * 获取确认密码
   */
  bindGetRepeatPassword: function(e) {
    this.setData({
      ["forgetPwd.repeatPassword"]: e.detail.value
    });
  },
  /**
   * 获取验证码
   */
  bindGetVerifyCode: function(e) {
    this.setData({
      ["forgetPwd.verifyCode"]: e.detail.value
    });
    console.log(this.data.forgetPwd.verifyCode);
  },

  /**
   * 设置微信一键登录后的密码
   */
  setWeChatPassword: function() {
    var Password = this.data.forgetPwd.newPassword;
    if (Password == undefined || Password == '' || Password==null) {
      wx.showToast({
        title: '密码不能为空',
        icon: 'none',
        duration: 1000
      })
      return false;
    }
    this.submitWeChatPwd(Password);
  },

  /**
   * 提交修改密码的信息
   */
  saveForgetPassword: function(e) {
    var that = this;
    var oldPwd = this.data.forgetPwd.oldPassword; //原密码
    var newPwd = this.data.forgetPwd.newPassword; //新密码
    var repeatPwd = this.data.forgetPwd.repeatPassword; //确认密码
    var verifyCode = this.data.forgetPwd.verifyCode;
    var getVerifyCode = this.data.forgetPwd.getVerifyCode; //验证码
    console.log(verifyCode + getVerifyCode)
    var phoneNum = this.data.forgetPwd.phoneNum; //手机号
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
    if (oldPwd == undefined || oldPwd == '' || oldPwd==null) {
      wx.showToast({
        title: '原密码不能为空',
        icon: 'none',
        duration: 1000
      })
      return false;
    }
    if (newPwd == undefined || newPwd == '' || newPwd==null) {
      wx.showToast({
        title: '新密码不能为空',
        icon: 'none',
        duration: 1000
      })
      return false;
    } else if (newPwd.length < 6) {
      wx.showToast({
        title: '新密码不能少于6位',
        icon: 'none',
        duration: 1000
      })
      return false;
    }
    if (repeatPwd == undefined || repeatPwd == '' || repeatPwd==null) {
      wx.showToast({
        title: '重复密码不能为空',
        icon: 'none',
        duration: 1000
      })
      return false;
    } else if (repeatPwd != newPwd) {
      wx.showToast({
        title: '两次输入的密码不匹配',
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
    wx.showLoading({
      title: '正在修改...',
    })
    var param = {
      UserID: wx.getStorageSync("UserID"),
      PictureUrl: '',
      NickName: '',
      TrueName: '',
      Sex: '',
      UsedPassword: this.data.forgetPwd.oldPassword,
      Password: this.data.forgetPwd.newPassword
    }
    console.log("修改密码传参：" + JSON.stringify(param));
    util.ajaxRequest('/AppApiUser/Account_Users/Account_UsersModify', 'POST', param,
      function(res) {
        if (res.data.ERROR_CODE == "-1") {
          console.log("修改密码返回值：" + JSON.stringify(res.data));
          wx.showToast({
            title: '修改成功',
            icon: 'none',
            duration: 1000
          })

          wx.switchTab({
            url: '../../index/index',
          })

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
          content: res.ERROR_MESSAGE
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
   * 提交信息
   */
  // submitInfo: function() {
  //   var that = this;
  //   wx.showLoading({
  //     title: '正在修改...',
  //   })
  //   var param = {
  //     UserID: wx.getStorageSync("UserID"),
  //     PictureUrl: '',
  //     NickName: '',
  //     TrueName: '',
  //     Sex: '',
  //     UserName: this.data.forgetPwd.phoneNum,
  //     UsedPassword: this.data.forgetPwd.oldPassword,
  //     Password: this.data.forgetPwd.newPassword
  //   }
  //   util.ajaxRequest('/AppApiUser/Account_Users/Account_UsersModify', 'POST', param,
  //     function(res) {
  //       if (res.data.ERROR_CODE == "-1") {
  //         wx.showToast({
  //           title: '修改成功',
  //           icon: 'none',
  //           duration: 1000
  //         })

  //         wx.switchTab({
  //           url: '../../index/index',
  //         })

  //         //隐藏-加载中
  //         wx.hideLoading();
  //         //隐藏-加载中
  //         wx.hideNavigationBarLoading();
  //         //停止当前页面下拉刷新
  //         wx.stopPullDownRefresh();
  //       } else {
  //         //错误提示
  //         wx.showModal({
  //           showCancel: false,
  //           content: res.data.ERROR_MESSAGE
  //         });
  //         //隐藏-加载中
  //         wx.hideLoading();
  //         //停止当前页面下拉刷新
  //         wx.stopPullDownRefresh();
  //         //隐藏-加载中
  //         wx.hideNavigationBarLoading();
  //       }
  //     },
  //     function(res) {
  //       //错误提示
  //       wx.showModal({
  //         showCancel: false,
  //         content: res.ERROR_MESSAGE
  //       });
  //       //隐藏-加载中
  //       wx.hideLoading();
  //       //停止当前页面下拉刷新
  //       wx.stopPullDownRefresh();
  //       //隐藏-加载中
  //       wx.hideNavigationBarLoading();
  //     });
  // },

  /**
   * 微信一键登录修改密码
   */
  submitWeChatPwd: function(pwd) {
    var that = this;
    wx.showLoading({
      title: '正在修改...',
    })
    var param = {
      UserID: wx.getStorageSync("UserID"),
      Password: pwd
    }
    util.ajaxRequest('/AppApiUser/Account_Users/SetPassword', 'POST', param,
      function(res) {
        if (res.data.ERROR_CODE == "-1") {
          wx.showToast({
            title: '修改成功',
            icon: 'none',
            duration: 1000
          })
          wx.navigateBack();

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
          content: res.ERROR_MESSAGE
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