// pages/shop/shopDetails/shopDetails.js
var util = require("../../../utils/util.js");
var bmap = require('../../../utils/bmap-wx.min.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    options: null, //存储页面传递的参数
    storeDetail: null, //门店详情信息
    imgUrl: util.imgUrl, //图片路径
    storesCommentList: null, //评论列表 
    loactionData: null, //当前地址信息
    PageSize: 3, //每页行数
    actId: '', //二维码链接的参数信息
    isHome: false, //是否显示回到首页按钮
    distance: 0,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var that = this;
    var userID = wx.getStorageSync('UserID');
    console.log(options)
    that.setData({
      options: options,
      isHome: options.isHome?options.isHome:false
    })
    //在此函数中获取扫描普通链接二维码参数
    if (options.q) {
      let q = decodeURIComponent(options.q);
      var storeID = util.getQueryString(q, 'StoreID');
      this.setData({
        ["options.StoreID"]: storeID,
        isHome: true,
      })
    } else {
      that.setData({
        options: options
      });
    }
    this.bindGetShopDetail();
  },

  /**
   * 拨打电话
   */
  bindMakePhone:function (e){
    console.log(JSON.stringify(e));
    var that =this;
    wx.makePhoneCall({
      phoneNumber: e.currentTarget.dataset.phone 
    })
  },

  /**
   * 点击图片跳转到首页
   */
  bindToHome: function(e) {
    var that = this;
    wx.switchTab({
      url: '../../home/index/index',
    })
    that.setData({
      isHome: false
    })
  },


  /**
   * 打开地图定位
   */
  bindOpenMap: function() {
    this.openLocation();
  },


  /**
   * 根据经纬度在地图上显示
   */
  openLocation: function(e) {
    wx.openLocation({
      longitude: Number(this.data.storeDetail.Longitude),
      latitude: Number(this.data.storeDetail.Latitude),
      scale:18,
      name: this.data.storeDetail.StoreName,
      address: this.data.storeDetail.StoreCoordinates
    })
  },

  /**
   * 选择位置
   */
  chooseLocation: function(e) {
    var that = this
    wx.chooseLocation({
      success: function(res) {
        that.setData({
          hasLocation: true,
          location: {
            longitude: res.longitude,
            latitude: res.latitude
          }
        })
      },
      fail: function() {
        // fail
      },
      complete: function() {
        // complete
      }
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
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  },

  /**
   * 门店评论
   */
  bindGetShopComment: function() {
    var that = this;
    var url = '/AppApiUser/Stores/StoresCommentList';
    wx.showLoading({
      title: '正在加载...',
    })
    var param = {
      StoreID: that.data.options.StoreID, //获取评论时的门店id
      PageSize: that.data.PageSize,
      PageNumber: 1,
    }
    // console.log("获取门店评论传参222222222222：" + JSON.stringify(param));
    util.ajaxRequest(url, 'POST', param,
      function(res) {
        if (res.data.ERROR_CODE == "-1") {
          // console.log("获取门店评论的返回值是：" + JSON.stringify(res.data))
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
   * 查看更多评论
   */
  bindOpenMore: function(e) {
    // console.log("============" + JSON.stringify(e));
    var storeID = e.currentTarget.dataset.storeid
    wx.navigateTo({
      url: '../evaluate/evaluate?storeID=' + storeID
    })
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
      StoreID: that.data.options.StoreID,
      Latitude: wx.getStorageSync('latitude'), //经度
      Longitude: wx.getStorageSync('longitude'), //纬度
    }
    console.log(JSON.stringify(param));
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
   * 买单
   */
  bindCheckFun: function(e) {
    // console.log(JSON.stringify(e));
    if (util.whetherLogin()) {
      var actId = e.currentTarget.dataset.storeid;
      wx.navigateTo({
        url: '../pay/pay?actId=' + actId,
      })
    } else {
      wx.navigateTo({
        url: '../../login/login/login?StoreID='+this.data.options.StoreID,
      })
    }

  }
})