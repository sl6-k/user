// pages/me/user/index/index.js
var util = require("../../../../utils/util.js");
Page({

  /**
   * 页面的初始数据
   */
  data: {
    options: null, //页面传值
  },

  /**
   * 打开用户端 
   */
  bindUserSys: function() {
    wx.navigateToMiniProgram({
      appId: 'wxb16e70ee139561f1', // 要跳转的小程序的appid
      path: 'pages/login/login/login', // 跳转的目标页面
      extarData: {

      },
      success(res) {
        // 打开成功  
      }
    })
  },

  /**
   * 打开门店
   */
  bindStoreSys: function() {
    wx.navigateToMiniProgram({
      appId: 'wxce5bc16545128121', // 要跳转的小程序的appid
      path: 'pages/login/login/login', // 跳转的目标页面
      extarData: {

      },
      success(res) {
        // 打开成功  
      }
    })
  },

  /**
   * 打开工人端
   */
  bindWorkerSys: function() {
    wx.navigateToMiniProgram({
      appId: 'wxb1a138c89c8fbbc2', // 要跳转的小程序的appid
      path: 'pages/login/login/login', // 跳转的目标页面
      extarData: {

      },
      success(res) {
        // 打开成功  
      }
    })
  },

  /**
   * 打开推客端
   */
  bindSpreadSys: function() {
    wx.navigateToMiniProgram({
      appId: 'wxccbf5f0d98de9697', // 要跳转的小程序的appid
      path: 'pages/login/login/login', // 跳转的目标页面
      extarData: {

      },
      success(res) {
        // 打开成功  
      }
    })
  },

  // 收货地址
  address: function() {
    if (util.whetherLogin()) {
      wx.navigateTo({
        url: '../addressList/addressList',
        success: function(res) {},
        fail: function(res) {},
        complete: function(res) {},
      })
    } else {
      wx.navigateTo({
        url: '../../../login/login/login',
        success: function(res) {},
        fail: function(res) {},
        complete: function(res) {},
      })
    }
  },
  // 发票
  invoice: function() {
    if (wx.chooseInvoiceTitle) {
      wx.chooseInvoiceTitle({
        success: function(res) {
          console.log(JSON.stringify(res))
        },
        fail: function(err) {
          console.log(JSON.stringify(err))
        }
      })
    } else {
      wx.showToast({
        title: '当前微信版本不支持',
        icon: 'none',
        duration: 2000
      })
      console.log('当前微信版本不支持');
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    console.log("=========" + JSON.stringify(options))
    this.setData({
      options: options
    });
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


  /**
   * 退出登录
   */
  Logout: function(e) {

    wx.showModal({
      title: '提示',
      content: '是否确定退出登录',
      success: function(res) {
        if (res.confirm) {
          //清除缓存
          wx.removeStorageSync("UserID");
          wx.showToast({
            title: '正在退出登录，请稍后',
            icon: 'none',
            duration: 2000,
            success: function() {
              wx.reLaunch({
                url: '../../../home/index/index'
              });
            }
          })
        } else {

        }
      }
    })
  },

  /**
   * 修改手机号
   */
  modifyTell: function() {
    if (util.whetherLogin()) {
      wx.navigateTo({
        url: '../tell/tell',
        success: function(res) {},
        fail: function(res) {},
        complete: function(res) {},
      })
    } else {
      wx.navigateTo({
        url: '../../../login/login/login',
        success: function(res) {},
        fail: function(res) {},
        complete: function(res) {},
      })
    }
  },

  /**
   * 修改密码
   */
  modifyPassword: function() {
    if (util.whetherLogin()) {
      wx.navigateTo({
        url: '../password/password?IsOneClick=' + this.data.options.IsOneClick,
        success: function(res) {},
        fail: function(res) {},
        complete: function(res) {},
      })
    } else {
      wx.navigateTo({
        url: '../../../login/login/login',
        success: function(res) {},
        fail: function(res) {},
        complete: function(res) {},
      })
    }
  },


  /**
   * 关于飞雳士
   */
  // /pages/me/about/about
  aboutUs: function() {
    wx.navigateTo({
      url: '../../about/about',
      success: function(res) {},
      fail: function(res) {},
      complete: function(res) {},
    })
  }
})