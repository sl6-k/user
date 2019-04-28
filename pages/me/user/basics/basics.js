// pages/me/user/basics/basics.js
var util = require("../../../../utils/util.js");
Page({

  /**
   * 页面的初始数据
   */
  data: {
    sex: "请选择性别",
    userInfo: {}, //存储用户信息
    pic: util.imgUrl, //上传用户图片
    PictureUrl: null, //上传后的图片路径
  },

  /**
   * 选择性别
   */
  getSex: function() {
    var itemList = ["男", "女"];
    var that = this;
    wx.showActionSheet({
      itemList: itemList,
      success: function(res) {
        that.setData({
          ["userInfo.Sex"]: res.tapIndex
        })

      }
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.bindGetUsrInfo();
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
   * 获取用户名称
   */
  bindGetNickName: function(e) {
    this.setData({
      ["userInfo.NickName"]: e.detail.value
    });
  },

  /**
   * 获取真实姓名
   */
  bindGetTrueName: function(e) {
    this.setData({
      ["userInfo.TrueName"]: e.detail.value
    });
  },

  /**
   * 获取手机号
   */
  bindGetPhoneNum: function(e) {
    this.setData({
      ["userInfo.Phone"]: e.detail.value
    });
  },

  /**
   * 选择图片并上传（单张）
   */
  chooseImage: function() {
    var that = this;
    wx.chooseImage({
      success(res) {
        var tempFilePaths = res.tempFilePaths;
        wx.showLoading({
          title: '正在上传...',
        })
        wx.uploadFile({
          url: util.apiUrl + '/AppApiUser/Upload/UploadUserPic',
          filePath: tempFilePaths[0],
          name: 'img',
          header: {
            "Content-Type": "multipart/form-data",
            'accept': 'application/json',
          },
          formData: {
            param: JSON.stringify({
              UserID: wx.getStorageSync('UserID'), //用户ID
            })
          },

          success(res) {
            var data = JSON.parse(res.data);
            console.log(data);
            that.setData({
              ["userInfo.PictureUrl"]: data.DATA.PictureUrl
            });
            console.log(that.data.PictureUrl);
            wx.showToast({
              title: '图片上传成功',
              icon: 'succes',
              duration: 1000,
              mask: true
            })
          },
          fail: function(res) {
            wx.showToast({
              title: '图片上传失败',
              icon: 'fail',
              duration: 1000,
              mask: true
            })
          },
        })
      }
    })
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
          // console.log("获取用户信息的返回值是："+JSON.stringify(res.data))
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
   * 修改用户信息
   */
  saveUserInfo: function() {
    var Phone = this.data.userInfo.phone; //手机号
    var NickName = this.data.userInfo.NickName; //昵称
    var TrueName = this.data.userInfo.TrueName; //真实姓名
    this.submitUserInfo();
  },

  /***
   * 提交用户信息
   */
  submitUserInfo: function() {
    var that = this;
    wx.showLoading({
      title: '加载中...',
    })
    var param = {
      UserID: wx.getStorageSync("UserID"),
      PictureUrl: that.data.userInfo.PictureUrl,
      UsedPassword: '',
      Password: '',
      NickName: that.data.userInfo.NickName,
      TrueName: that.data.userInfo.TrueName,
      Sex: that.data.userInfo.Sex
    }
    util.ajaxRequest('/AppApiUser/Account_Users/Account_UsersModify', 'POST', param,
      function(res) {
        if (res.data.ERROR_CODE == "-1") {
          wx.showToast({
            title: '修改成功',
            icon: 'none',
            duration: 1000,
            complete: function() {
              wx.reLaunch({
                url: '../../index/index'
              });
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
      })
  }
})