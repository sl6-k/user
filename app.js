//app.js
var util = require("/utils/util.js");
var bmap = require('/utils/bmap-wx.min.js');
App({


  /**
   * 当小程序初始化完成时，会触发 onLaunch（全局只触发一次）
   */
  onLaunch: function(options) {
    if (wx.canIUse('getUpdateManager')) {
      const updateManager = wx.getUpdateManager()
      updateManager.onCheckForUpdate(function(res) {
        if (res.hasUpdate) {
          updateManager.onUpdateReady(function() {
            wx.showModal({
              title: '更新提示',
              content: '新版本已经准备好，是否重启应用？',
              showCancel: false,
              success: function(res) {
                if (res.confirm) {
                  updateManager.applyUpdate()
                }
              }
            })
          })
          updateManager.onUpdateFailed(function() {
            wx.showModal({
              title: '已经有新版本了哟~',
              content: '新版本已经上线啦~，请您删除当前小程序，重新搜索打开哟~'
            })
          })
        }
      })
    } else {
      wx.showModal({
        title: '提示',
        content: '当前微信版本过低，无法使用该功能，请升级到最新微信版本后重试。'
      })
    }
  },

  /**
   * 当小程序启动，或从后台进入前台显示，会触发 onShow
   */
  onShow: function(options) {
    var that = this;
    /***
     * 获取手机状态栏高度  
     */
    wx.getSystemInfo({
      success: function(res) {
        // console.log(res)
        let totalTopHeight = 68
        if (res.model.indexOf('iPhone X') !== -1) {
          totalTopHeight = 88
        } else if (res.model.indexOf('iPhone') !== -1) {
          totalTopHeight = 64
        }
        wx.setStorageSync('windowHeight', res.windowHeight)
        wx.setStorageSync('statusBarHeight', res.statusBarHeight)
        wx.setStorageSync('titleBarHeight', totalTopHeight - res.statusBarHeight)
      },
      failure() {
        wx.setStorageSync('windowHeight', 0)
        wx.setStorageSync('statusBarHeight', 0)
        wx.setStorageSync('titleBarHeight', 0)
      }
    })

  },

  bindGetUserInfo: function(e) {
    console.log(e.detail.userInfo)
    return e.detail.userInfo;
  },

  /**
   * 当小程序从前台进入后台，会触发 onHide
   */
  onHide: function() {

  },

  /**
   * 当小程序发生脚本错误，或者 api 调用失败时，会触发 onError 并带上错误信息
   */
  onError: function(msg) {

  },

  /**
   * 判断是否已登录
   */
  isLogin: function() {
    var UserID = wx.getStorageSync("UserID");
    if (UserID) {
      return false;
    } else {
      return true;
    }
  },


  /**
   * 获取购物车中货物数量
   */
  GetGoodsCarNumber: function() {
    let that = this;
    var ShopCarNumber = 0;
    //var UserID = wx.getStorageSync("UserID");
    var UserID = 277;
    if (UserID != "" && UserID != undefined) {
      var param = {
        UserID: UserID
      }
      // console.log("参数", param);
      util.ajaxRequest('/AppApiUser/ShopCar/GetShopCarCount', 'POST', param, function(res) {
        if (res.data.ERROR_CODE == "-1") {
          ShopCarNumber = res.data.DATA;
        }
      });
    }
    return ShopCarNumber;
  },
})