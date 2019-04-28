// pages/cart/orderDetail/orderDetail.js
var util = require("../../../utils/util.js");
Page({

  /**
   * 页面的初始数据
   */
  data: {
    OrderNo: null, //订单编号
    OrderID: null, //订单ID
    MemberOrderInfo: null, //订单信息
    MyCar: null, //车型列表
    hiddenmodalput: true, //弹框是否显示
    ticketMail: '', //发票的邮箱地址
    moreSubMail: true, //是否可以提交邮箱地址
  },

  /**
   * 打开客服
   */
  bindService: function() {
    wx.navigateTo({
      url: '/pages/me/service/service',
    })
  },
  /*
   * 保存邮箱地址
   */
  saveTicketMail: function() {
    var param = {
      MemberOrderID: this.data.OrderID,
      InvoiceEmail: this.data.ticketMail
    }
    console.log(JSON.stringify(param))
    util.ajaxRequest('/AppApiUser/MemberOrder/UserInvoiceEmail', 'POST', param,
      (res) => {
        console.log(res);
        if (res.data.ERROR_CODE == -1) {
          wx.showToast({
            title: res.data.ERROR_MESSAGE,
            duration: 1500,
          })
          this.setData({
            hiddenmodalput: true,
            moreSubMail: false
          })
        } else {
          wx.showToast({
            title: res.data.ERROR_MESSAGE,
            icon: 'none',
            duration: 1000
          })
        }
      })
  },
  /*
   * 申请开票输入邮箱弹框
   */
  applyTicket: function() {
    this.setData({
      hiddenmodalput: !this.data.hiddenmodalput
    })
  },
  //取消按钮  
  cancel: function() {
    this.setData({
      hiddenmodalput: true
    });
  },
  //确认  
  confirm: function() {
    let ticMail = this.data.ticketMail;
    if (ticMail == '') {
      wx.showToast({
        title: '请输入邮箱~~',
        icon: 'none',
        duration: 1500
      })
      return false
    }
    if (!(/^([0-9A-Za-z\-_\.]+)@([0-9a-z]+\.[a-z]{2,3}(\.[a-z]{2})?)$/.test(ticMail))) {
      wx.showToast({
        title: '请输入正确的邮箱地址',
        icon: 'none',
        duration: 1500
      })
      return false
    }
    if (this.data.moreSubMail) {
      this.saveTicketMail();
    } else {
      wx.showToast({
        title: '请勿重复提交',
        icon: 'none',
        duration: 1000
      })
    }
  },
  /*
   * 获取输入的邮箱地址
   */
  applyMailAddress: function(e) {
    this.setData({
      ticketMail: e.detail.value
    })
  },
  /**
   * 拨打电话
   */
  bindMakePhone: function() {
    var phoneNumber = this.data.MemberOrderInfo.StoresPhone;
    if (phoneNumber == "" || phoneNumber == undefined) {
      wx.showToast({
        title: '此门店无联系电话',
        icon: 'error',
        duration: 2000
      })
    } else {
      wx.makePhoneCall({
        phoneNumber: phoneNumber // 仅为示例，并非真实的电话号码
      });
    }
  },

  // 跳转至评价页面
  toEvaluate: function(event) {
    console.log("评价所携带的id" + JSON.stringify(event));
    var MemberOrderID = event.currentTarget.dataset.memberorderid;
    wx.navigateTo({
      url: '../../me/evaluate/evaluate?OrderID=' + MemberOrderID,
    })
  },
  /**
   * 订单退货
   */
  MemberOrderReturn: function(event) {
    var MemberOrderID = event.currentTarget.dataset.memberorderid;
    wx.navigateTo({
      url: '../../me/refund/refund?OrderID=' + MemberOrderID,
    })
  },
  /*
   * 打开商品详情
   */
  openGoodsInfo: function(e) {
    wx.navigateTo({
      url: '../../home/goods/goods?GoodsID=' + e.currentTarget.dataset.goodsid,
    })
  },
  /**
   * 确认收货
   */
  ConfirmReceipt: function(event) {
    let that = this;
    wx.showModal({
      title: '温馨提示',
      content: '是否确认收到商品？',
      cancelText: "否",
      confirmText: "是",
      success(res) {
        if (res.confirm) {
          var MemberOrderID = event.currentTarget.dataset.memberorderid;
          var param = {
            MemberOrderID: MemberOrderID,
            UserID: wx.getStorageSync('UserID'), //用户ID
          }
          wx.showLoading({
            title: '正在提交...',
          })
          util.ajaxRequest('/AppApiUser/MemberOrder/ConfirmReceipt', 'POST', param,
            function(res) {
              wx.showToast({
                title: '已确认收货',
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
   * 查看物流信息
   */
  bindViewLogistics: function() {
    //物流信息的弹出层打开
    this.getLogisticsInfo();
  },

  /**
   * 获取物流名称和物流单号
   */
  getLogisticsInfo: function() {
    this.setData({
      viewLogistics: true
    })
  },

  /**
   * 查看物流信息
   */
  bindViewLogistics: function() {
    //物流信息的弹出层打开
    this.getLogisticsInfo();
  },
  /**
   * 关闭弹出层
   */
  closeViewLogistics: function() {
    this.setData({
      viewLogistics: false
    })
  },

  //订单支付
  OrderPay: function() {
    let that = this;
    wx.redirectTo({
      url: '../../cart/cartCashier/cartCashier?OrderID=' + that.data.OrderID,
    });
  },
  //取消订单
  CancelOrder: function() {
    let that = this;
    var param = {
      MemberOrderID: that.data.OrderID,
    }
    wx.showLoading({
      title: '正在加载...',
    })
    util.ajaxRequest('/AppApiUser/MemberOrder/MemberOrderCancel', 'POST', param,
      function(res) {
        //隐藏-加载中
        wx.hideLoading();
        wx.showToast({
          title: '取消成功',
          icon: 'success',
          duration: 1000
        });
        that.onLoad(); //重新加载

      });
  },
  /**
   * 获取订单详情信息
   */
  GetOrderDetails: function() {
    let that = this;
    var param = {
      OrderNo: that.data.OrderNo,
      MemberOrderID: that.data.OrderID,
    }
    wx.showLoading({
      title: '正在加载...',
    })
    util.ajaxRequest('/AppApiUser/MemberOrder/MemberOrderEdit', 'POST', param,
      function(res) {
        // console.log("订单详情" + JSON.stringify(res.data));
        //隐藏-加载中
        wx.hideLoading();
        that.setData({
          MemberOrderInfo: res.data.DATA
        }); //订单信息
      });
  },
  /**
   * 获取我的车型
   */
  GetMyCar: function() {
    let that = this;
    var param = {
      UserID: wx.getStorageSync('UserID'),
    }
    wx.showLoading({
      title: '正在加载...',
    })
    util.ajaxRequest('/AppApiUser/Account_Users/GetMyCar', 'POST', param,
      function(res) {
        //隐藏-加载中
        wx.hideLoading();
        that.setData({
          MyCar: res.data.DATA
        }); //我的车型
      });
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    if (options.OrderNo != "" && options.OrderNo != undefined) {
      this.setData({
        OrderNo: options.OrderNo, //订单编号
      })
    }
    if (options.OrderID != "") {
      this.setData({
        OrderID: options.OrderID, //订单编号
      })
    }
    this.GetOrderDetails(); //加载订单信息
    this.GetMyCar(); //加载我的车型
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


})