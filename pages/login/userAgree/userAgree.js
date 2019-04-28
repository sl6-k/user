// pages/login/userAgree/userAgree.js
var util = require("../../../utils/util.js");
var wxParse = require('../../../wxParse/wxParse.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    Description: null,//协议内容
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getUserAgree();
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },
  /*
  * 获取用户协议内容
  */
  getUserAgree(){
    let param = {
      ContentID: 2
    }
    util.ajaxRequest('/AppApiUser/ContentManager/GetCMS_ContentDetail','POST',param,
    (res)=>{
      console.log(res)
      if(res.data.ERROR_CODE==-1){
        this.setData({
          Description: res.data.DATA.Description
        })
        if (this.data.Description != "") {
          wxParse.wxParse('dkcontent', 'html', this.data.Description, this, 15);
        }
      }else{
        wx.showToast({
          title: res.data.ERROR_MESSAGE,
          icon: 'none',
          duration: 1000
        })
      }
    })
  }
})