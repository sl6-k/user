// pages/me/index/index.js
var util = require("../../../utils/util.js");
Page({

  /**
   * 页面的初始数据
   */
  data: {
    statusBarHeight: wx.getStorageSync('statusBarHeight'),
    titleBarHeight: wx.getStorageSync('titleBarHeight'),
    userID: '',
    userInfo: null, //用户信息
    pic: util.imgUrl, //上传用户图片
    code: null, //存储小程序的code,
    phone: '', //电话号码
    NickName: '', //用户昵称
    cornerMarker:null,//存储角标显示的数量
  },

  /**
   * 打开退货页面
   */
  bindReturnGoods: function(e) {
    if (util.whetherLogin()) {
      wx.navigateTo({
        url: '../returnGoods/returnGoodsList/returnGoodsList',
      })
    } else {
      wx.navigateTo({
        url: '../../login/login/login',
      })
    }
  },

  /**
   * 获取角标数量
   */
  getCornerMarker: function() {
    var that = this;
    wx.showLoading({
      title: '加载中...',
    })
    var param = {
      UserID: wx.getStorageSync("UserID")
    }

    util.ajaxRequest('/AppApiUser/MemberOrder/MemberOrderNumber', 'POST', param,
      function(res) {
        if (res.data.ERROR_CODE == "-1") {
          that.setData({
            cornerMarker:res.data.DATA
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
   * 打开用户信息
   */
  openUserInfo: function() {
    wx.navigateTo({
      url: '../user/basics/basics'
    })
  },

  /**
   * 登录
   */
  bindLogin: function() {
    wx.navigateTo({
      url: '../../login/login/login',
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.getOpenId();
    this.setData({
      userID: wx.getStorageSync("UserID")
    });
    if (util.whetherLogin()) {
      this.bindGetUsrInfo();
      this.getCornerMarker();
    }
  },

  /**
   * 打开订单信息
   */
  openOrder: function(e) {
    var index = e.currentTarget.dataset.index;
    if (util.whetherLogin()) {
      wx.navigateTo({
        url: '../order/order?current=' + index,
      })
    } else {
      wx.navigateTo({
        url: '../../login/login/login',
      })
    }
  },

  /**
   * 
   */
  openCustomerService: function() {
    if (util.whetherLogin()) {
      wx.navigateTo({
        url: '/pages/me/service/service',
      })
    } else {
      wx.navigateTo({
        url: '../../login/login/login',
      })
    }
  },

  /**
   * 打开设置
   */
  openSetting: function(e) {
    var IsOneClick = e.currentTarget.dataset.isoneclick
    if (util.whetherLogin()) {
      wx.navigateTo({
        url: '/pages/me/user/index/index?IsOneClick=' + IsOneClick
      })
    } else {
      wx.navigateTo({
        url: '../../login/login/login',
      })
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
    this.setData({
      userID: wx.getStorageSync("UserID")
    });
    if (util.whetherLogin()) {
      this.bindGetUsrInfo();
      this.getCornerMarker();
    }
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
    this.onLoad();
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

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
            NickName: res.data.DATA.NickName,
            Phone: res.data.DATA.Phone
          })
          that.setData({
            userInfo: res.data.DATA
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
   *优惠券列表 
   */
  bindOpenDiscount: function() {
    if (util.whetherLogin()) {
      wx.navigateTo({
        url: '/pages/me/discount/discount',
      })
    } else {
      wx.navigateTo({
        url: '../../login/login/login',
      })
    }
  },
  bindCreditsExchange: function() {
    if (util.whetherLogin()) {
      wx.navigateTo({
        url: '/pages/me/integralList/integralList',
      })
    } else {
      wx.navigateTo({
        url: '../../login/login/login',
      })
    }
  },
  /**
   * 获取用户订单
   */
  getOrderList: function() {
    if (util.whetherLogin()) {
      wx.navigateTo({
        url: '../order/order?current=0',
      })
    } else {
      wx.navigateTo({
        url: '../../login/login/login',
      })
    }
  },


  /**
   * 微信一键登录
   */
  getPhoneNumber: function(e) {
    var that = this;
    var ency = e.detail.encryptedData;
    var iv = e.detail.iv;
    var code = that.data.code;
    if (e.detail.errMsg != "getPhoneNumber:ok") {} else {
      that.oneKeyLogon(code, ency, iv);
    }
  },

  /**
   * 一键登录方法
   */
  oneKeyLogon: function(code, ency, ivBytes) {
    var that = this;
    wx.showLoading({
      title: '正在登录...',
    })
    var param = {
      UserName: '',
      Password: '',
      code: code,
      toDecrypt: ency,
      ivBytes: ivBytes,
    }
    util.ajaxRequest('/AppApiUser/Account_Users/Account_UsersLogin', 'POST', param,
      function(res) {
        if (res.data.ERROR_CODE == "-1") {
          wx.setStorageSync("UserID", res.data.DATA.UserID);
          wx.showToast({
            title: '登录成功，跳转到登录页面',
            icon: 'none',
            duration: 1000
          })
          wx.reLaunch({
            url: '../../home/index/index'
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
          content: res.errMsg
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
   * 获取openID
   */
  getOpenId: function() {
    var that = this;
    // 获取openID
    wx.login({
      //获取code
      success: function(res) {
        var code = res.code; //返回code
        that.setData({
          code: res.code
        });
      }
    })
  }
})