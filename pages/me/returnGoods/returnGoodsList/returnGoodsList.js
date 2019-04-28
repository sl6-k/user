// pages/me/returnGoods/returnGoodsList/returnGoodsList.js
var util = require("../../../../utils/util.js");
Page({

  /**
   * 页面的初始数据
   */
  data: {
    current: 0, //当前tab
    PageNumber: 1, //页码
    PageTotal: 0, //总行数
    PageSize: 10, //页行数
    AllPageNumber: 0, //总页数
    MemberOrderAll: null, //全部订单
    MemberOrder1: null, //申请
    MemberOrder2: null, //处理
    MemberOrder3: null, //完成
    selected1: true,
    selected2: false,
    selected3: false,
    selected4: false
  },
  selected1: function (e) {
    this.setData({
      current: parseInt(e.currentTarget.dataset.current),
      selected2: false,
      selected3: false,
      selected4: false,
      selected1: true,
      PageSize: 10, //初始显示的行数
      PageNumber: 1, //初始第几页
    })
    this.LoadMemberOrderList();

  },
  selected2: function (e) {
    this.setData({
      current: parseInt(e.currentTarget.dataset.current),
      selected1: false,
      selected3: false,
      selected4: false,
      selected2: true,
      PageSize: 10, //初始显示的行数
      PageNumber: 1, //初始第几页
    })
    this.LoadMemberOrderList();
  },
  selected3: function (e) {
    this.setData({
      current: parseInt(e.currentTarget.dataset.current),
      selected1: false,
      selected2: false,
      selected4: false,
      selected3: true,
      PageSize: 10, //初始显示的行数
      PageNumber: 1, //初始第几页
    })
    this.LoadMemberOrderList();
  },
  selected4: function (e) {
    this.setData({
      current: parseInt(e.currentTarget.dataset.current),
      selected1: false,
      selected2: false,
      selected3: false,
      selected4: true,
      PageSize: 10, //初始显示的行数
      PageNumber: 1, //初始第几页
    })
    this.LoadMemberOrderList();
  },

  /**
   * 已邮寄
   */
  MermberorderReturngGoodsTranslate: function(event) {
    let that = this;
    wx.showModal({
      title: '温馨提示',
      content: '是否确认已邮寄？',
      cancelText: "否",
      confirmText: "是",
      success(res) {
        if (res.confirm) {
          var MemberOrderID = event.currentTarget.dataset.memberorderid;
          var param = {
            MemberOrderID: MemberOrderID,
          }
          wx.showLoading({
            title: '正在提交...',
          })
          util.ajaxRequest('/AppApiUser/MemberOrder/MermberorderReturngGoodsTranslate', 'POST', param,
            function(res) {
              wx.showToast({
                title: '提交成功',
                icon: 'none',
                duration: 1000
              })
              //刷新当前订单列表
              that.LoadMemberOrderList();
            });
        } else if (res.cancel) {}
      }
    })
  },

  /**
   * 取消退货
   */
  MemberOrderReturnCancel: function() {
    let that = this;
    wx.showModal({
      title: '温馨提示',
      content: '是否取消退货？',
      cancelText: "否",
      confirmText: "是",
      success(res) {
        if (res.confirm) {
          var MemberOrderID = event.currentTarget.dataset.memberorderid;
          var param = {
            MemberOrderID: MemberOrderID,
          }
          wx.showLoading({
            title: '正在提交...',
          })
          util.ajaxRequest('/AppApiUser/MemberOrder/MermberorderReturngGoodsCancel', 'POST', param,
            function(res) {
              wx.showToast({
                title: '取消成功',
                icon: 'none',
                duration: 1000
              })
              //刷新当前订单列表
              that.LoadMemberOrderList();
            });
        } else if (res.cancel) {}
      }
    })
  },
  /**
   * 获取退货订单详情
   */
  MemberOrderDetails: function(event) {
    var MemberOrderID = event.currentTarget.dataset.memberorderid; //订单id
    var orderNo = event.currentTarget.dataset.orderno; //订单编号
    wx.navigateTo({
      url: '../../../me/returnGoods/returnGoodsDetail/returnGoodsDetail?OrderID=' + MemberOrderID + "&orderNo=" + orderNo,
    })
  },

  /**
   * 读取订单信息
   */
  LoadMemberOrderList: function() {
    let that = this;
    var OrderState = 0;
    var param = {
      PageNumber: that.data.PageNumber,
      PageSize: that.data.PageSize,
      UserID: wx.getStorageSync('UserID'), //用户ID
      OrderState: OrderState, //查询订单状态,
      ReturnState: that.data.current, //退货状态
    }
    wx.showLoading({
      title: '正在加载...',
    })
    // console.log("查询订单" + JSON.stringify(param));
    util.ajaxRequest('/AppApiUser/MemberOrder/GetMemberOrderReturnList', 'POST', param,
      function(res) {
        //隐藏-加载中
        wx.hideLoading();
        if (res.data.ERROR_CODE == "-1") {
          // console.log("订单列表返回结果" + JSON.stringify(res.data));
          if (that.data.current == 0) {
            if (that.data.PageNumber == 1) {
              that.setData({
                MemberOrderAll: res.data.DATA.data, //
              });
            } else {
              that.setData({
                MemberOrderAll: that.data.MemberOrderAll.concat(res.data.DATA.data), //
              });
            }
          }
          if (that.data.current == 1) {
            if (that.data.PageNumber == 1) {
              that.setData({
                MemberOrder1: res.data.DATA.data, //
              });
            } else {
              that.setData({
                MemberOrder1: that.data.MemberOrder1.concat(res.data.DATA.data), //
              });
            }
          }
          if (that.data.current == 2) {
            if (that.data.PageNumber == 1) {
              that.setData({
                MemberOrder2: res.data.DATA.data, //
              });
            } else {
              that.setData({
                MemberOrder2: that.data.MemberOrder2.concat(res.data.DATA.data), //
              });
            }
          }
          if (that.data.current == 3) {
            if (that.data.PageNumber == 1) {
              that.setData({
                MemberOrder3: res.data.DATA.data, //
              });
            } else {
              that.setData({
                MemberOrder3: that.data.MemberOrder3.concat(res.data.DATA.data), 
              });
            }
          }
          that.setData({
            AllPageNumber: res.data.DATA.pagecount, //总页数
            PageTotal: res.data.DATA.total, //总页数
          });

        }
      });
  },

  /**
   * 查看详情
   */
  bindViewDetails: function() {
    wx.navigateTo({
      url: '../returnGoodsDetail/returnGoodsDetail',
    })
  },


  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.LoadMemberOrderList();
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
    * 页面上拉触底事件的处理函数
    */
  onReachBottom: function () {
    let that = this;
    if (that.data.AllPageNumber > that.data.PageNumber) {
      this.setData({
        PageNumber: parseInt(that.data.PageNumber) + 1,
        PageSize: this.data.PageSize
      })

      this.LoadMemberOrderList();
    }

  },

  /**
    * 页面相关事件处理函数--监听用户下拉动作
    */
  onPullDownRefresh: function () {
    this.setData({
      PageNumber: 1,
    })
    this.LoadMemberOrderList();
  },

})