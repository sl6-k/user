// pages/me/discount/discount.js
var util = require("../../../utils/util.js");
Page({

  /**
   * 页面的初始数据
   */
  data: {
    swiperHeight: wx.getStorageSync('windowHeight') - wx.getStorageSync('titleBarHeight') - wx.getStorageSync('statusBarHeight'), //获取内容高度
    titleBarHeight: wx.getStorageSync('titleBarHeight'), //获取高度
    statusBarHeight: wx.getStorageSync('statusBarHeight'), //获取高度
    current: 0, //当前所在
    discountList: null, //优惠券列表数据存放
    pageNumber: 1,
    pageSize: 10,
    total: -1, //总记录数
    pageCount: 1, //设置总页数，默认为一页
    couponType: 1, //优惠券状态
    total: -1, //总记录数
  },

  /**
   * 立即使用跳转
   */
  bindImmediateUse: function() {
    wx.navigateTo({
      url: '../../home/productList/productList',
    })
  },

  /**
   * 禁止滑动
   */
  catchTouchMove: function(res) {
    return false
  },

  /**
   * tab切换
   */
  tabClick: function(event) {
    var current = event.currentTarget.dataset.current
    if (current == 0) {
      this.setData({
        couponType: 1,
        current: current
      });
    }
    if (current == 1) {
      this.setData({
        couponType: 2,
        current: current
      })
    }
    if (current == 2) {
      this.setData({
        couponType: 0,
        current: current
      })
    }
    this.getDiscountList();
  },

  /**
   * swiper 滑动
   */
  swiperAnmate: function(event) {
    this.setData({
      current: event.detail.current
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.getDiscountList();
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
    this.setData({
      pageNumber: 1,
      pageSize: 10,
      total: -1, //总记录数
      pageCount: 1, //设置总页数，默认为一页
    });
    this.getDiscountList();
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {
    var that = this;
    that.setData({
      pageNumber: that.data.pageNumber + 1
    });
    that.getDiscountList();
  },
  /**
   * 优惠券列表
   */
  getDiscountList: function() {
    var that = this;
    wx.showLoading({
      title: '正在加载...',
    })
    var param = {
      UserID: wx.getStorageSync("UserID"),
      PageNumber: that.data.pageNumber,
      PageSize: that.data.pageSize,
      CouponType: that.data.couponType
    }
    util.ajaxRequest('/AppApiUser/Account_Users/GetMyCouponReceiveList', 'POST', param,
      function(res) {
        if (res.data.ERROR_CODE == "-1") {
          var data = [];
          if (that.data.pageNumber == 1) {
            that.setData({
              discountList: res.data.DATA.data,
              pageCount: res.data.DATA.pagecount,
              total: res.data.DATA.total
            });
          } else {
            that.setData({
              discountList: that.data.discountList.concat(res.data.DATA.data),
              pageCount: res.data.DATA.pagecount,
              total: res.data.DATA.total
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
      })
  },

  /**
   * 点击加载更多
   */
  // loadMore: function() {
  //   var that = this;
  //   that.setData({
  //     pageNumber: that.data.pageNumber + 1
  //   });
  //   that.getDiscountList();
  // }
})