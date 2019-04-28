
var util = require("../../../utils/util.js");
Page({

  /**
   * 页面的初始数据
   */
  data: {
    swiperHeight: wx.getStorageSync('windowHeight') - wx.getStorageSync('titleBarHeight') - wx.getStorageSync('statusBarHeight'), //获取内容高度
    titleBarHeight: wx.getStorageSync('titleBarHeight'), //获取高度
    statusBarHeight: wx.getStorageSync('statusBarHeight'), //获取高度
    PageNumber: 1, //初始页码
    PageTotal: 0, //总行数
    PageSize: 10, //初始页行数
    AllPageNumber: 0, //总页数
    forRecordList:null,
  },

  //下一页
  NextPage: function () {
    let that = this;
    if (that.data.PageNumber < that.data.AllPageNumber) {
      that.setData({
        PageNumber: that.data.PageNumber + 1
      });
    }
    //加载
    this.getforRecordList();
  },

  //读取订单信息
  getforRecordList: function () {
    let that = this;
    var param = {
      PageNumber: that.data.PageNumber,
      PageSize: that.data.PageSize,
      UserID: wx.getStorageSync('UserID'), //用户ID
    }

    wx.showLoading({
      title: '正在加载...',
    })
    util.ajaxRequest('/AppApiUser/Integral/GetExchangeRecordList', 'POST', param,
      function (res) {
        // console.log("兑换列表返回结果" + JSON.stringify(res));
        //隐藏-加载中
        wx.hideLoading();
        if (res.data.ERROR_CODE == "-1") {
            if (that.data.PageNumber == 1) {
              that.setData({
                forRecordList: res.data.DATA.data, //
              });
            } else {
              that.setData({
                forRecordList: that.data.forRecordList.concat(res.data.DATA.data), 
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
  onLoad: function (options) {
    this.getforRecordList()
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
    this.getforRecordList();
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    this.NextPage(); //加载下一页
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})