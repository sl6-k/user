// pages/me/user/tell/tell.js
var util = require("../../../../utils/util.js");
Page({

  /**
   * 页面的初始数据
   */
  data: {
    userInfo: null, //用户信息
    newPhoneNum: null, //新手机号
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.bindGetUsrInfo();
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
   * 获取用户信息
   */
  bindGetUsrInfo: function(e) {
    var that = this;
    wx.showLoading({
      title: '加载中...',
    })
    var param = {
      UserID: wx.getStorageSync("UserID")
    }
    console.log("获取用户信息传参：" + JSON.stringify(param));
    util.ajaxRequest('/AppApiUser/Account_Users/Account_UsersSelet', 'POST', param,
      function(res) {
        if (res.data.ERROR_CODE == "-1") {
          console.log("获取用户信息返回值：" + JSON.stringify(res.data));
          that.setData({
            userInfo: res.data.DATA
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
   * 获取新手机号
   */
  getNewPhoneNum: function(e) {
    console.log(JSON.stringify(e));
    this.setData({
      newPhoneNum: e.detail.value
    });
  },

  /**
   * 提交修改手机号
   */
  submitModifyPhoneNum: function() {
    var that = this;
    var newPhoneNum = that.data.newPhoneNum;
    if (newPhoneNum == null || newPhoneNum == '' || newPhoneNum==null) {
      wx.showToast({
        title: '新手机号不能为空',
        icon: 'none',
        duration: 1000
      })
      return false;
    }
    if (!(/^1[34578]\d{9}$/.test(newPhoneNum))) {
      wx.showToast({
        title: '手机号格式不正确',
        icon: 'none',
        duration: 1000
      })
      return false;
    }
    wx.showLoading({
      title: '加载中...',
    })
    var param = {
      UserID: wx.getStorageSync("UserID"),
      Phone: newPhoneNum
    }
    console.log("获取用户信息传参：" + JSON.stringify(param));
    util.ajaxRequest('/AppApiUser/Account_Users/Updatephone', 'POST', param,
      function(res) {
        if (res.data.ERROR_CODE == "-1") {
          console.log("获取用户信息返回值：" + JSON.stringify(res.data));
          wx.showToast({
            title: '登录成功，跳转到登录页面',
            icon: 'none',
            duration: 1000
          })
          setTimeout(function() {
            wx.reLaunch({
              url: '../../../home/index/index'
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