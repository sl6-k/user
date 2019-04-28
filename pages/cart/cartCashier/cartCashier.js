// pages/cart/cartCashier/cartCashier.js
var util = require("../../../utils/util.js");
Page({

  /**
   * 页面的初始数据
   */
  data: {
    OrderID: null, //订单ID
    MemberOrderInfo: null, //订单信息
    RealAmount: "", //实付金额,
    timeStamp: "", //时间戳
    nonceStr: "", //支付串
    paySign: "", //签名
    package: "", //包
    PayState:"",//支付状态
    code:"",//
    count:0,//计时
  },
  /**
   * 获取openID
   */
  getOpenId: function () {
    var that = this;
    // 获取openID
    wx.login({
      //获取code
      success: function (res) {
        console.log(JSON.stringify(res.code));
        var code = res.code; //返回code
        that.setData({
          code: res.code
        });
      }
    })
  },

  TimeCheck:function()
  {
    let that=this;
    var count = that.data.count;
    var timer = setInterval(() => {
      count += 5000;
      that.setData({ count: count});//时间自增
      if (count > 120000){
        clearInterval(loadFile);
      }
      if (that.data.PayState==3)
      {
        clearInterval(loadFile);
      }
      that.SelectPayState();//查询订单状态
      clearInterval(timer);
    }, 5000)
  },
  /**
   * 检查支付状态
   */
  SelectPayState: function() {
    
    let that = this;
    var param = {
      MemberOrderID: that.data.OrderID
    }
    wx.showLoading({
      title: '返回结果中...',
    });
    console.log("执行检查")
    util.ajaxRequest('/AppApiUser/Payment/UnifiedEnquiryOrder', 'POST', param,
      function(res) {
        console.log("执行检查返回结果",res);
        if (res.data.ERROR_CODE = "-1") {
          if (res.data.DATA.payState == 1 || res.data.DATA.payState == 2)//已付款
          {
            return ;
          }
          if (res.data.DATA.payState==3)//已付款
          {
            that.setData({ PayState: res.data.DATA.payState});
            //隐藏-加载中
            wx.hideLoading();
            
            wx.showToast({
              title: '付款成功',
              icon: 'success',
              duration: 1000
            });
            var MemberOrderID = that.data.OrderID;
            wx.redirectTo({
              url: '../orderDetail/orderDetail?OrderID=' + MemberOrderID,
            })
          }
          if (res.data.DATA.payState == -2)//已付款
          {
            //隐藏-加载中
            wx.hideLoading();
            wx.showToast({
              title: '支付失败',
              icon: 'error',
              duration: 1000
            });
          }
          if (res.data.DATA.payState == -1)//已付款
          {
            //隐藏-加载中
            wx.hideLoading();
            wx.showToast({
              title: '已取消',
              icon: 'error',
              duration: 1000
            });
          }
        }
      });
  },

  /**
   * 确认支付
   */
  bindConfirmPayment: function() {
    let that = this;
    var param = {
      OrderNo: that.data.MemberOrderInfo.OrderNo,//订单号
      code:that.data.code,//获取openID的code
    }
    wx.showLoading({
      title: '正在加载...',
    });
    console.log("统一下单请求参数", param);
    util.ajaxRequest('/AppApiUser/Payment/UnifiedPayment', 'POST', param,
      function(res) {
        //隐藏-加载中
        wx.hideLoading();
        console.log("统一下单返回",res);
        if (res.data.ERROR_CODE = -1) {
          that.setData({
            timeStamp: res.data.DATA.timeStamp, //时间戳
            nonceStr: res.data.DATA.nonceStr, //支付串
            paySign: res.data.DATA.paySign, //签名
            package: res.data.DATA.package //包
          })
          wx.requestPayment({
            'timeStamp': res.data.DATA.timeStamp.toString(),
            'nonceStr': res.data.DATA.nonceStr,
            'package': res.data.DATA.package,
            'signType': 'RSA',
            'paySign': res.data.DATA.paySign,
            'success': function (res) {
              if(res.errMsg=="requestPayment:ok")
              {
                wx.showToast({
                  title: '付款成功',
                  icon: 'success',
                  duration: 1000
                });
                var MemberOrderID = that.data.OrderID;
                wx.redirectTo({
                  url: '../orderDetail/orderDetail?OrderID=' + MemberOrderID,
                })
              }
            },
            'fail': function (res) {
              wx.showToast({
                title: '付款失败',
                icon: 'error',
                duration: 2000
              });
              return;
            },
            'complete': function (res) {
            }
          })
        }
      });
  },
  /**
   * 获取订单详情信息
   */
  GetOrderDetails: function() {
    let that = this;
    var param = {
      MemberOrderID: that.data.OrderID,
      OrderNo: ''
    }
    wx.showLoading({
      title: '正在加载...',
    });
    util.ajaxRequest('/AppApiUser/MemberOrder/MemberOrderEdit', 'POST', param,
      function(res) {
        console.log("订单详情", res);
        //隐藏-加载中
        wx.hideLoading();
        if (res.data.ERROR_CODE == -1) {
          that.setData({
            MemberOrderInfo: res.data.DATA, //订单信息
            RealAmount: res.data.DATA.RealAmount, //实付金额
          }); //订单信息
        }

      });
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    if (options.OrderID != "" && options.OrderID != undefined) {
      this.setData({
        OrderID: options.OrderID, //订单编号
      })
    }
    this.GetOrderDetails(); //订单详情

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {
    this.getOpenId();
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