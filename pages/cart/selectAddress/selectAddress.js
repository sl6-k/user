// pages/me/user/addressList/addressList.js
var util = require('../../../utils/util.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    addressList: null, //地址列表
    totalCount: 0, //总记录数
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.bindGetAddressList();
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {
    this.bindGetAddressList();
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
    this.bindGetAddressList();
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
   * 打开编辑页面
   */
  bindAddAddress: function(e) {
    wx.navigateTo({
      url: '../addAddress/addAddress',
    })

  },

  /**
   * 获取收货地址列表
   */
  bindGetAddressList: function() {
    var that = this;
    wx.showLoading({
      title: '正在加载...',
    })
    var param = {
      UserID: wx.getStorageSync("UserID")
    }
    // console.log("传递的参数是：" + JSON.stringify(param));
    util.ajaxRequest('/AppApiUser/UserReceivingAddress/GetUserReceivingAddressList', 'POST', param,
      function(res) {
        if (res.data.ERROR_CODE == "-1") {
          // console.log("地址列表的返回值是：" + JSON.stringify(res.data));
          that.setData({
            addressList: res.data.DATA,
            // totalCount:res.data.DATA.
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
            content: res.ERROR_MESSAGE
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
    * 绑定删除
    */
  bindDeleteAdress: function (e) {
    var that = this;
    var id = e.currentTarget.dataset.id; //车型id
    wx.showModal({
      title: '提示',
      content: '是否确定删除',
      success: function (res) {
        if (res.confirm) {
          that.deleteAddress(id);
        } else if (res.cancel) {
          return false;
        }
      }
    })
  },

  /**
   * 删除收货地址
   */
  deleteAddress: function (id) {
    var that = this;
    wx.showLoading({
      title: '正在删除...',
    })
    var param = {
      ID: id
    }
    util.ajaxRequest('/AppApiUser/UserReceivingAddress/UserReceivingAddressDel', 'POST', param,
      function (res) {
        if (res.data.ERROR_CODE == "-1") {
          that.bindGetAddressList();
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
   * 打开编辑页面
   */
  bindEditAddress: function (e) {
    var id = e.currentTarget.dataset.id; //修改地址时需要的id
    console.log(JSON.stringify(e));
    wx.navigateTo({
      url: '../../me/user/addressEdit/addressEdit?id=' + id,
      success: function (res) { },
      fail: function (res) { },
      complete: function (res) { },
    })
  },
  /**
   * 设为默认
   */
  bindSetDefault: function(e) {
    var that = this;
    var index = e.currentTarget.dataset.index;
    var id = e.currentTarget.dataset.id; //获取地址ID
    var choseChange = "addressList[" + index + "].IsDefault"
    this.setData({
      [choseChange]: true
    });
    var param = {
      ID: id
    }
    // console.log("传递的参数是：" + JSON.stringify(param));
    util.ajaxRequest('/AppApiUser/UserReceivingAddress/SetDefault', 'POST', param,
      function(res) {
        if (res.data.ERROR_CODE == "-1") {
          // console.log("获取年份的返回值是：" + JSON.stringify(res.data));
          that.bindGetAddressList();
          
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
            content: res.ERROR_MESSAGE
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
   * 选择联系人信息
   */
  bindGetContactInfo: function(e) {
    var that = this;
    // console.log("选择联系人信息" + JSON.stringify(e.currentTarget.dataset));
    var info = e.currentTarget.dataset.info; //获取地址ID
    var pages = getCurrentPages(); // 获取页面栈
    var currPage = pages[pages.length - 1]; // 当前页面
    var prevPage = pages[pages.length - 2]; // 上一个页面
    // console.log("第几层" + JSON.stringify(pages.length))
    // console.log("当前页面" + JSON.stringify(currPage.route))
    if (currPage.route == "pages/cart/selectAddress/selectAddress") {
      wx.navigateBack({
        delta: 1
      })
    } 
    if (prevPage.route == "pages/cart/addAddress/addAddress"){
      wx.navigateBack({
        delta: 2
      })
    }

    prevPage.setData({
      UserAddress: info // 异步更新用户地址信息
    })
  }
})