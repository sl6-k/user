// pages/me/discount/discount.js
var util = require("../../../utils/util.js");
Page({
  /**
   * 页面的初始数据
   */
  data: {
    swiperHeight: wx.getStorageSync('windowHeight'), //获取内容高度
    titleBarHeight: wx.getStorageSync('titleBarHeight'), //获取高度
    statusBarHeight: wx.getStorageSync('statusBarHeight'), //获取高度
    current: 0, //当前所在
    duration: 0, //切换动画时间
    PageNumber: 1, //页码
    PageTotal: 0, //总行数
    PageSize: 5, //页行数
    AllPageNumber: 0, //总页数
    MemberOrderAll: null, //全部订单
    MemberOrder1: null, //待付款
    MemberOrder2: null, //待收货
    MemberOrder3: null, //待安装
    MemberOrder4: null, //带评价
    MemberOrder5: null, //退货
    viewLogistics: false, //查看物流信息弹出层
    MemberOrderInfo: null, //订单信息
  },
  /**
   * 支付
   */
  MemberOrderPay: function(event) {
    var MemberOrderID = event.currentTarget.dataset.memberorderid;
    wx.redirectTo({
      url: '../../cart/cartCashier/cartCashier?OrderID=' + MemberOrderID,
    });
  },

  /**
   * 点击图片跳转到首页
   */
  bindToHome: function(e) {
    var that = this;
    wx.switchTab({
      url: '../../home/index/index',
    })
  },

  /**
   * 取消订单
   */
  MemberOrderCancel: function(event) {
    let that = this;
    wx.showModal({
      title: '温馨提示',
      content: '是否取消订单？',
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
          util.ajaxRequest('/AppApiUser/MemberOrder/MemberOrderCancel', 'POST', param,
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
   * 订单退货
   */
  MemberOrderReturn: function(event) {
    var MemberOrderID = event.currentTarget.dataset.memberorderid;
    wx.navigateTo({
      url: '../../me/retund/retund?OrderID=' + MemberOrderID,
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
              // console.log("确认收货返回", res);
              //隐藏-加载中
              wx.hideLoading();
              if (res.data.ERROR_CODE == -1) {
                wx.showToast({
                  title: '已确认收货',
                  icon: 'none',
                  duration: 1000
                });
                //刷新当前订单列表
                that.LoadMemberOrderList();
              }
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
  getLogisticsInfo: function(event) {
    var MemberOrderID = event.currentTarget.dataset.memberorderid;
    let that = this;
    var param = {
      MemberOrderID: MemberOrderID,
      OrderNo: "",
    }
    wx.showLoading({
      title: '正在加载...',
    })
    util.ajaxRequest('/AppApiUser/MemberOrder/MemberOrderEdit', 'POST', param,
      function(res) {;
        that.setData({
          MemberOrderInfo: res.data.DATA
        });
        //隐藏-加载中
        wx.hideLoading();
      });

    this.setData({
      viewLogistics: true
    })
  },

  /**
   * 关闭弹出层
   */
  closeViewLogistics: function() {
    this.setData({
      viewLogistics: false
    })
  },


  /**
   * 禁止滑动
   */
  catchTouchMove: function(res) {
    return false
  },

  /**
   * 跳转至订单详情
   */
  MemberOrderDetails: function(event) {
    var MemberOrderID = event.currentTarget.dataset.memberorderid;
    wx.navigateTo({
      url: '../../cart/orderDetail/orderDetail?OrderID=' + MemberOrderID,
    })
  },
  // 跳转至评价页面
  toEvaluate: function(event) {
    var MemberOrderID = event.currentTarget.dataset.memberorderid;
    wx.navigateTo({
      url: '../evaluate/evaluate?OrderID=' + MemberOrderID,
    })
  },
  //下一页
  NextPage: function() {
    let that = this;
    that.setData({
      PageNumber: that.data.PageNumber + 1
    });
    if (that.data.PageNumber <= that.data.AllPageNumber) {
      //加载
      this.LoadMemberOrderList();
    }
  },

  //读取订单信息
  LoadMemberOrderList: function() {
    let that = this;
    var OrderState = 0;
    if (parseInt(that.data.current) >= 2) {
      OrderState = parseInt(that.data.current) + 1;
    } else {
      OrderState = parseInt(that.data.current);
    }
    var param = {
      PageNumber: that.data.PageNumber,
      PageSize: that.data.PageSize,
      UserID: wx.getStorageSync('UserID'), //用户ID
      OrderState: OrderState, //查询订单状态
    }
    wx.showLoading({
      title: '正在加载...',
    })
    util.ajaxRequest('/AppApiUser/MemberOrder/GetMemberOrderList', 'POST', param,
      function(res) {
        //隐藏-加载中
        wx.hideLoading();
        if (res.data.ERROR_CODE == "-1") {
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
                MemberOrder3: that.data.MemberOrder3.concat(res.data.DATA.data), //
              });
            }
          }
          if (that.data.current == 4) {
            if (that.data.PageNumber == 1) {
              that.setData({
                MemberOrder4: res.data.DATA.data, //
              });
            } else {
              that.setData({
                MemberOrder4: that.data.MemberOrder4.concat(res.data.DATA.data), //
              });
            }
          }
          if (that.data.current == 5) {
            if (that.data.PageNumber == 1) {
              that.setData({
                MemberOrder5: res.data.DATA.data, //
              });
            } else {
              that.setData({
                MemberOrder5: that.data.MemberOrder5.concat(res.data.DATA.data), //
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

  //tab切换
  tabClick: function(event) {
    var that = this;

    this.setData({
      current: event.currentTarget.dataset.current,
      PageNumber: 1,
      MemberOrderAll: null, //全部订单
      MemberOrder1: null, //待付款
      MemberOrder2: null, //待收货
      MemberOrder3: null, //待安装
      MemberOrder4: null, //待评价
      MemberOrder5: null, //退货
    });
    this.LoadMemberOrderList(); //加载订单
  },
  //swiper 滑动
  swiperAnmate: function(event) {
    this.setData({
      current: event.detail.current
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.setData({
      current: options.current
    })
    this.LoadMemberOrderList(); //加载用户订单列表
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {
    this.setData({
      duration: 500
    })
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
    this.LoadMemberOrderList(); //加载用户订单列表
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
    this.LoadMemberOrderList();
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {
    // // 加载下一页
    this.NextPage();
  },

})