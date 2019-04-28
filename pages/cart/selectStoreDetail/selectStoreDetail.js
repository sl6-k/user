// pages/shop/shopDetails/shopDetails.js
var util = require("../../../utils/util.js");
Page({

  /**
   * 页面的初始数据
   */
  data: {
    options: null, //存储页面传递的参数
    storeDetail: null, //门店详情信息
    imgUrl:util.imgUrl,//图片路径地址
    storesCommentList: null, //评论列表
    loactionData: null, //当前地址信息
    PageSize: 3,//每页行数
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    wx.setNavigationBarTitle({
      title: '门店详情',
    })
    console.log("options:" + JSON.stringify(options));
    this.setData({
      options: options
    });
    this.bindGetShopDetail();
  },

  /**
   * 打开地图定位
   */
  bindOpenMap: function () {
    this.openLocation();
  },


  /**
   * 根据经纬度在地图上显示
   */
  openLocation: function (e) {
    wx.openLocation({
      longitude: Number(this.data.storeDetail.Longitude),
      latitude: Number(this.data.storeDetail.Latitude),
      scale: 18,
      name: this.data.storeDetail.StoreName,
      address: this.data.storeDetail.StoreCoordinates
    })
  },


  /**
   * 门店评论
   */
  bindGetShopComment: function () {
    var that = this;
    var url = '/AppApiUser/Stores/StoresCommentList';
    wx.showLoading({
      title: '正在加载...',
    })
    var param = {
      StoreID: that.data.options.storeID,//获取评论时的门店id
      PageSize: that.data.PageSize,
      PageNumber: 1,
    }
    util.ajaxRequest(url, 'POST', param,
      function (res) {
        if (res.data.ERROR_CODE == "-1") {
          console.log("获取门店评论的返回值是：" + JSON.stringify(res.data))
          that.setData({
            storesCommentList: res.data.DATA,
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
      function (res) {
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
   * 查看更多评论
   */
  bindOpenMore: function (e) {
    console.log("============" + JSON.stringify(e));
    var storeID = e.currentTarget.dataset.storeid
    wx.navigateTo({
      url: '../evaluate/evaluate?storeID=' + storeID
    })
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
    //获取门店评论
    this.bindGetShopComment();
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
   * 门店详情
   */
  bindGetShopDetail: function() {
    var that = this;
    var url = '/AppApiUser/Stores/StoreDetail';
    wx.showLoading({
      title: '正在加载...',
    })
    var param = {
      StoreID: that.data.options.storeID,
      Latitude: wx.getStorageSync("latitude"), //经度
      Longitude: wx.getStorageSync("longitude"), //纬度
    }
    console.log("传递的参数是：" + JSON.stringify(param));
    util.ajaxRequest(url, 'POST', param,
      function(res) {
        if (res.data.ERROR_CODE == "-1") {
          console.log("获取门店详情的返回值是：" + JSON.stringify(res.data))
          var data = res.data.DATA;
          if (JSON.stringify(data) === '[]') {
            data = null;
          }
          that.setData({
            storeDetail: data,
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
   * 选择此门店
   */
  selectStore: function(e) {
    var store = this.data.storeDetail;
    var pages = getCurrentPages(); // 获取页面栈
    var currPage = pages[pages.length - 1]; // 当前页面
    var prevPage = pages[pages.length - 2]; // 上一个页面
    var prevPage2 = pages[pages.length - 3]; // 上上一个页面
    wx.navigateBack({
      delta: 2
    })
    prevPage2.setData({
      Store: store // 异步更新用户地址信息
    })
  }
})