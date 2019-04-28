// pages/shop/evaluate/evaluate.js
var util = require("../../../utils/util.js");
Page({

  /**
   * 页面的初始数据
   */
  data: {
    storesCommentList: null, //评论列表
    PageNumber: 10, //每页行数
    PageSize: 1, //第几页
    imgUrl: util.imgUrl
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.setData({
      options: options
    })
    this.bindGetShopComment();
  },

  /**
   * 商品评论
   */
  bindGetShopComment: function() {
    var that = this;
    var PageNumber = that.data.PageNumber;
    var PageSize = that.data.PageSize
    var url = '/AppApiUser/Stores/StoresCommentList';
    wx.showLoading({
      title: '正在加载...',
    })
    var param = {
      StoreID: that.data.options.storeID,
      PageSize: PageNumber,
      PageNumber: PageSize,
    }
    util.ajaxRequest(url, 'POST', param,
      function(res) {
        if (res.data.ERROR_CODE == "-1") {
          console.log("获取门店评论的返回值是：" + JSON.stringify(res.data))
          var data = res.data.DATA;
          if (PageSize == 1) {
            that.setData({
              storesCommentList: data.data,
              commentData:data
            });
          }
          if (PageSize > 1) {
            that.setData({
              storesCommentList: that.data.storesCommentList.concat(data.data),
              commentData: data
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
    this.setData({
      PageNumber: this.data.PageNumber+1
    })
    this.bindGetShopComment();
  },

})