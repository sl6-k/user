// pages/me/integralList/IntegralList.js
var util = require("../../../utils/util.js");
Page({

  /**
   * 页面的初始数据
   */
  data: {
    userInfo: null, //用户信息
    UserName: '',
    integrals: null,
    pic: util.imgUrl, //上传用户图片
    PageNumber: 1, //初始页码
    PageTotal: 0, //总行数
    PageSize: 10, //初始页行数
    AllPageNumber: 0, //总页数
    integralList: null,
    Integral: 0,
    GiftName: "",
    number: 1,
    hidden: true,//模态框是否隐藏
  },
  // 积分兑换记录
  forRrecord: function() {
    wx.navigateTo({
      url: '../../me/forRecord/forRecord',
    })
  },
  /*
  * 查看积分兑换规则
  */
  changeRule: function(){
    this.setData({
      hidden: false
    })
  },
  /*
  * 取消显示模态框
  */
  confirm: function(){
    this.setData({
      hidden: true
    })
  },
  /**
   * 支付
   */
  MemberOrderPay: function(event) {
    var OrderID = event.currentTarget.dataset.orderid;
    var integrals = this.data.integrals.Integral;
    var Integral = this.data.Integral;
    if (integrals == 0 && integrals < Integral) {
      wx.showToast({
        title: '您的积分不足',
        duration: 2500,
        icon: 'none'
      })
    } 
    else {
      wx.navigateTo({
        url: '../../me/integralSettlement/integralSettlement?OrderID=' + OrderID,
      });
    }
    wx.navigateTo({
      url: '../../me/integralSettlement/integralSettlement?OrderID=' + OrderID,
    });
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
    util.ajaxRequest('/AppApiUser/Account_Users/Account_UsersSelet', 'POST', param,
      function(res) {
        if (res.data.ERROR_CODE == "-1") {
        
          that.setData({
            UserName: res.data.DATA.UserName,
            userInfo: res.data.DATA
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
   * 获取积分信息
   */
  bindintegral: function(e) {
    var that = this;
    wx.showLoading({
      title: '加载中...',
    })
    var param = {
      UserID: wx.getStorageSync("UserID")
    }
    util.ajaxRequest('/AppApiUser/Integral/IntegralBalance', 'POST', param,
      function(res) {
        if (res.data.ERROR_CODE == "-1") {
       
          that.setData({
            integrals: res.data.DATA
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
  //读取订单信息
  getintegralList: function() {
    let that = this;
    var param = {
      PageNumber: that.data.PageNumber,
      PageSize: that.data.PageSize,
      GiftName: that.data.GiftName,
    }

    wx.showLoading({
      title: '正在加载...',
    })
  
    util.ajaxRequest('/AppApiUser/Integral/GetGiftList', 'POST', param,
      function(res) {
        
        //隐藏-加载中
        wx.hideLoading();
        if (res.data.ERROR_CODE == "-1") {
          if (that.data.PageNumber == 1) {
            that.setData({
              integralList: res.data.DATA.data,
            });
          } else {
            that.setData({
              integralList: that.data.integralList.concat(res.data.DATA.data)
            });
          }
          that.setData({
            AllPageNumber: res.data.DATA.pagecount, //总页数
            PageTotal: res.data.DATA.total, //总页数
          });
        }
      });
  },


  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.getintegralList()
    this.bindintegral()
    if (wx.getStorageSync("UserID") != '') {
      this.bindGetUsrInfo();
    }
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
    let that = this;
    if (that.data.AllPageNumber > that.data.PageNumber) {
      this.setData({
        PageNumber: parseInt(that.data.PageNumber) + 1,
        PageSize: this.data.PageSize
      })

      this.getintegralList();
    }
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  }
})