// pages/cart/SelectCoupon/SelectCoupon.js
var util = require('../../../utils/util.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    pageNumber: 1,
    pageSize: 10,
    total: -1, //总记录数
    pageCount: 1, //设置总页数，默认为一页
    discountList: null, //优惠券列表数据存放
    total: -1, //总记录数
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.selectCoupon();
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
   * 查询可使用的优惠券
   */
  selectCoupon: function() {
    var that = this;
    wx.showLoading({
      title: '正在加载...',
    })
    var param = {
      UserID: wx.getStorageSync("UserID"),
      PageNumber: that.data.pageNumber,
      PageSize: that.data.pageSize,
      CouponType: 1
    }
    util.ajaxRequest('/AppApiUser/Account_Users/GetMyCouponReceiveList', 'POST', param,
      function(res) {
        if (res.data.ERROR_CODE == "-1") {
          console.log("查询未使用的优惠券有：" + JSON.stringify(res.data));
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
   * 使用优惠券
   */
  bindClipCoupons: function(e) {
    var that = this;
    console.log("优惠券信息是：" + JSON.stringify(e.currentTarget.dataset));
    var couponInfo = e.currentTarget.dataset.info; //获取地址ID
    var pages = getCurrentPages(); // 获取页面栈
    var currPage = pages[pages.length - 1]; // 当前页面
    var prevPage = pages[pages.length - 2]; // 上一个页面
    wx.navigateBack({
      delta: 1
    })

    prevPage.setData({
      Coupon: couponInfo // 异步更新用户地址信息
    })
  }
})