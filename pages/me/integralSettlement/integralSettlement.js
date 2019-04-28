// pages/me/integralSettlement/integralSettlement.js
var util = require("../../../utils/util.js");
Page({

  /**
   * 页面的初始数据
   */
  data: {
    UserAddress: null, //用户地址对象
    UserAddressID: null, //收货地址ID
    imgUrl: util.imgUrl, //
    userInfo: null, //用户信息
    BalanceIntegral: '',
    pic: util.imgUrl, //上传用户图片
    PageNumber: 1, //初始页码
    PageTotal: 0, //总行数
    PageSize: 1, //初始页行数
    AllPageNumber: 0, //总页数
    integralList: null,
    integral: '',
    GiftName: "",
    ValuePrice: '', //价格,
    Number: 1, //数量
    SelectGoodsCarID: "",

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
    // console.log("查询订单" + JSON.stringify(param));
    util.ajaxRequest('/AppApiUser/Integral/GetGiftList', 'POST', param,
      function(res) {
        // console.log("列表返回结果" + JSON.stringify(res));
        //隐藏-加载中
        wx.hideLoading();
        if (res.data.ERROR_CODE == "-1") {
          if (that.data.PageNumber == 1) {
            that.setData({
              integralList: res.data.DATA.data,
              Integral: res.data.DATA.data[0].Integral,
              ValuePrice: res.data.DATA.data[0].ValuePrice,
            });
          } else {
            that.setData({
              integralList: that.data.integralList.concat(res.data.DATA.data),
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
   * 订单提交
   */
  OrderSubmit: function(e) {
    let that = this;
    var BalanceIntegral = e.currentTarget.dataset.balanceintegral;
    var Integral = e.currentTarget.dataset.integral;
    if (BalanceIntegral == 0 && BalanceIntegral < Integral) {
      wx.showToast({
        title: '您的积分不足,马上返回兑换页面',
         icon: 'none',
         duration: 6000,
         success: function () {
           setTimeout(function () {
             wx.navigateBack({
                 url: '../../me/integralList/integralList'
             })
           }, 2000);

         }

      })
    }
    if (that.data.UserAddress == null) {
      wx.showToast({
        title: '请先添加收货地址',
        icon: 'none',
        duration: 2000,
        success: function () {
         
          }

      })
      return false;
    }
   
      var param = {
        UserID: wx.getStorageSync('UserID'), //用户ID
        GiftNumber: that.data.Number,
        GiftID: that.data.SelectGoodsCarID,
        Integral: that.data.Integral,
        Consignee: that.data.UserAddress == null ? "" : that.data.UserAddress.Linkmain, //联系人
        ConsigneePhone: that.data.UserAddress == null ? "" : that.data.UserAddress.Linkphone, //联系人电话
        Address: that.data.UserAddress == null ? "" : that.data.UserAddress.AddressDetail, //详细地址
      }
      wx.showLoading({
        title: '正在提交...',
      })
      // console.log("确认下单提交参数" + JSON.stringify(param));
      util.ajaxRequest('/AppApiUser/Integral/ExchangeRecordSubmit', 'POST', param,
        function(res) {
          if (res.data.ERROR_CODE == "-1") {
            wx.showToast({
              title: '兑换成功，正在跳转',
              icon: 'success',
              duration: 3000,
              complete: function() {
                wx.navigateBack()
                // wx.redirectTo({
                //   url: '../../me/integralList/integralList'
                // });
              }
            })
            //隐藏-加载中
            wx.hideLoading();
            //隐藏-加载中
            wx.hideNavigationBarLoading();
            //停止当前页面下拉刷新
            wx.stopPullDownRefresh();
          } else {
            //错误提示
            // console.log("提交不成功" + res.data.ERROR_CODE);
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
   * 收货地址
   */
  bindSelectStore: function(ecent) {
    wx.navigateTo({
      url: '../../cart/selectAddress/selectAddress',
    })
  },

  /**
   * 获取用户地址
   */
  bindGetUsrAddress: function(e) {
    var that = this;
    wx.showLoading({
      title: '加载中...',
    })
    var param = {
      UserID: wx.getStorageSync("UserID")
    }
    util.ajaxRequest('/AppApiUser/UserReceivingAddress/GetUserReceivingAddressList', 'POST', param,
      function(res) {
        if (res.data.ERROR_CODE == "-1") {
          // console.log(JSON.stringify(res.data.DATA));
          if (res.data.DATA.length > 0) {
            var isDefault = false;
            for (let i = 0; i < res.data.DATA.length; ++i) {
              if (res.data.DATA[i].IsDefault) {
                isDefault = true;
                that.setData({
                  UserAddress: res.data.DATA[i],
                  UserAddressID: res.data.DATA[i].ID,
                });
              }
            }
            if (!isDefault) {
              that.setData({
                UserAddress: res.data.DATA[0],
                UserAddressID: res.data.DATA[0].ID,
              });
            }
          }
          // console.log("获取用户地址" + JSON.stringify(that.data.UserAddress));
          //隐藏-加载中
          wx.hideLoading();
        } else {
          //错误提示
          wx.showModal({
            showCancel: false,
            content: res.data.ERROR_MESSAGE
          });
          //隐藏-加载中
          wx.hideLoading();
        }
      },
      function(res) {
        //错误提示
        wx.showModal({
          showCancel: false,
          content: res.data.ERROR_MESSAGE
        });
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
            BalanceIntegral: res.data.DATA.Integral
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
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    // console.log("提交订单页参数", JSON.stringify(options))
    if (options.OrderID.length > 0) {
      this.setData({
        SelectGoodsCarID: options.OrderID,
      });
      //获取积分信息-余额
      this.bindintegral();
      this.getintegralList();
    }

  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {
    //获取用户地址
    this.bindGetUsrAddress();
    
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
    this.bindGetUsrAddress
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