// pages/login/login/login.js
var util = require("../../../utils/util.js");
Page({

  /**
   * 页面的初始数据
   */
  data: {
    statusBarHeight: wx.getStorageSync('statusBarHeight'),
    titleBarHeight: wx.getStorageSync('titleBarHeight'),
    deleBack: false, //返回突变是否显示
    login: {}, //登录信息
    AgentCode: '', //推广码
    StoreID: '', //详情页面传递过来的storeID
    options: null, //存储页面传递的参数
    agentUserCode: '', //代理编号
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    console.log(JSON.stringify(options));
    if (options.deleBack != undefined) {
      this.setData({
        deleBack: options.deleBack
      })
    }

    this.setData({
      options: options
    })
    console.log(options);
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {
    this.getOpenId();
    this.setData({
      ["login.phoneNum"]: wx.getStorageSync("phoneNum"),
      ["login.userPwd"]: wx.getStorageSync("userPwd")
    })
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
   * 获取登录手机号
   */
  getPhoneNum: function(e) {
    this.setData({
      ["login.phoneNum"]: e.detail.value
    });
  },

  /**
   * 获取登录密码
   */
  getUserPwd: function(e) {
    this.setData({
      ["login.userPwd"]: e.detail.value
    });
  },

  /**
   * 登录方法
   */
  login: function() {
    var that = this;
    var phoneNum = this.data.login.phoneNum; //登录名
    var userPwd = this.data.login.userPwd; //密码
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
    if (userPwd == undefined || userPwd == '' || userPwd==null) {
      wx.showToast({
        title: '密码不能为空',
        icon: 'none',
        duration: 1000
      })
      return false;
    }
    this.submitInfo(phoneNum, userPwd);
  },

  /**
   * 提交信息
   */
  submitInfo: function(phoneNum, userPwd) {
    var that = this;
    wx.showLoading({
      title: '正在登录...',
    })
    var param = {
      UserName: phoneNum,
      Password: userPwd,
      code: '',
      toDecrypt: '',
      ivBytes: '',
      AgentCode: that.data.AgentCode
    }
    console.log(JSON.stringify(param));
    util.ajaxRequest('/AppApiUser/Account_Users/Account_UsersLogin', 'POST', param,
      function(res) {
        if (res.data.ERROR_CODE == "-1") {
          // wx.clearStorage();
          wx.setStorageSync("UserID", res.data.DATA.UserID);
          wx.setStorageSync("phoneNum", that.data.login.phoneNum);
          wx.setStorageSync("userPwd", that.data.login.userPwd);
          var storeID = that.data.options.StoreID;
          console.log("登录时携带的门店ID是：" + storeID);
          var workerInstallOrderID = that.data.options.WorkerInstallOrderID
          if (storeID != '' && storeID != null && storeID != undefined) {
            wx.showToast({
              title: '登录成功，正在跳转',
              icon: 'success',
              duration: 1000,
              complete: function() {
                wx.reLaunch({
                  url: '../../shop/shopDetails/shopDetails?StoreID=' + storeID + '&isHome=' + true
                });
              }
            })
          } else if (workerInstallOrderID != '' && workerInstallOrderID != null && workerInstallOrderID != undefined) {
            wx.showToast({
              title: '登录成功，正在跳转',
              icon: 'success',
              duration: 1000,
              complete: function() {
                wx.reLaunch({
                  url: '../../me/workerEvaluation/workerEvaluation'
                });
              }
            })
          } else {
            wx.showToast({
              title: '登录成功，正在跳转',
              icon: 'success',
              duration: 1000,
              complete: function() {
                wx.reLaunch({
                  url: '../../home/index/index'
                });
              }
            })
          }

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
          //没有更多了
          that.setData({
            loadingComplete: true
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
   * 微信一键登录
   */
  getPhoneNumber: function(e) {
    var that = this;
    var ency = e.detail.encryptedData;
    var iv = e.detail.iv;
    var code = that.data.code;
    if (e.detail.errMsg != "getPhoneNumber:ok") {} else {
      that.oneKeyLogon(code, ency, iv);
    }
  },

  /**
   * 一键登录方法
   */
  oneKeyLogon: function(code, ency, ivBytes) {
    var that = this;
    wx.showLoading({
      title: '正在登录...',
    })
    var param = {
      UserName: '',
      Password: '',
      code: code,
      toDecrypt: ency,
      ivBytes: ivBytes,
      AgentCode: that.data.AgentCode, //代理商推广ID
    }
    console.log(JSON.stringify(param));
    util.ajaxRequest('/AppApiUser/Account_Users/Account_UsersLogin', 'POST', param,
      function(res) {
        if (res.data.ERROR_CODE == "-1") {
          console.log("一键登录返回值是" + JSON.stringify(res.data.DATA));
          wx.setStorageSync("UserID", res.data.DATA.UserID);
          wx.setStorageSync("phoneNum", that.data.login.phoneNum);
          wx.setStorageSync("userPwd", that.data.login.userPwd);
          var storeID = that.data.options.StoreID;
          if (that.data.options.StoreID != ''&&that.data.options.StoreID!=null&&that.data.options.StoreID!=undefined) {
            wx.showToast({
              title: '登录成功，正在跳转',
              icon: 'success',
              duration: 1000
            })
            wx.reLaunch({
              url: '../../shop/shopDetails/shopDetails?StoreID=' + storeID + '&isHome=' + true
            });
          } else {
            wx.showToast({
              title: '登录成功，正在跳转',
              icon: 'success',
              duration: 1000
            })
            wx.reLaunch({
              url: '../../home/index/index'
            });
          }
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
          content: res.errMsg
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
   * 获取openID
   */
  getOpenId: function() {
    var that = this;
    // 获取openID
    wx.login({
      //获取code
      success: function(res) {
        var code = res.code; //返回code
        that.setData({
          code: res.code
        });
      }
    })
  }
})