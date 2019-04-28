// pages/home/model/model.js
var util = require('../../../utils/util.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    brandList: null, //我的车型列表
  },
  checkboxChange(e) {
    wx.setStorageSync("site", e.detail.value)
  },
  // console.log('radio发生change事件，携带value值为：', e.detail.value)
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.bindGetBrandJson();
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {
    this.onLoad();
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
    this.onPullDownRefresh();
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
    this.bindGetBrandJson();
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },



  /**
   * 我的车型库
   */
  bindGetBrandJson: function() {
    var that = this;
    var param = {
      UserID: wx.getStorageSync("UserID")
    }
    util.ajaxRequest('/AppApiUser/Account_Users/GetMyVehicleTypeList', 'POST', param,
      function(res) {
        if (res.data.ERROR_CODE == "-1") {
          console.log("车型" + JSON.stringify(res.data));
          var data = res.data.DATA
          var carName = [];
          for (var i = 0; i < data.length; i++) {
            if (data[i].IsDefault) {
              carName = data[i];
            }
          }
          that.setData({
            brandList: res.data,
            carName: carName
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
      })
  },

  /**
   * 设置默认车型
   */
  setDefaultType: function(e) {
    var id = e.currentTarget.dataset.id; //车型id
    var that = this;
    wx.showLoading({
      title: '正在修改...',
    })
    var param = {
      ID: id
    }
    util.ajaxRequest('/AppApiUser/UserVehicleType/SetDefault', 'POST', param,
      function(res) {
        if (res.data.ERROR_CODE == "-1") {
          wx.navigateBack({
            delta: 2
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
      })
  },

  /**
   * 是否确定删除
   */
  bindDeleteType: function(e) {
    var id = e.currentTarget.dataset.id; //车型id
    var that = this;
    var id = e.currentTarget.dataset.id; //车型id
    wx.showModal({
      title: '提示',
      content: '是否确定删除',
      success: function(res) {
        if (res.confirm) {
          that.deleteCarType(id);
        } else if (res.cancel) {
          return false;
        }
      }
    })
  },

  /**
   * 删除车型
   */
  deleteCarType: function(id) {
    var that = this;
    wx.showLoading({
      title: '正在删除...',
    })
    var param = {
      ID: id
    }
    util.ajaxRequest('/AppApiUser/UserVehicleType/UserVehicleTypeDel', 'POST', param,
      function(res) {
        if (res.data.ERROR_CODE == "-1") {
          that.bindGetBrandJson();
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
      })
  }

})