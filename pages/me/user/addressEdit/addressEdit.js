// pages/me/user/addressEdit/addressEdit.js
var util = require('../../../../utils/util.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    title: '新增收货地址',
    consignee: {}, //收货人信息
    options: null, //获取页面传递的参数

    //所在地区的选择
    province: '',
    city: '',
    area: '',
    show: false,
    areaID: '',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    console.log("==============" + JSON.stringify(options.id));
    if (options.id == undefined) {
      return;
    } else {
      this.setData({
        options: options
      });
      this.selectAddressInfo(this.data.options.id);
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
   * 收货人姓名
   */
  bindConsigneeName: function(e) {
    this.setData({
      ["consignee.name"]: e.detail.value
    });
  },

  /**
   * 收货人手机号
   */
  bindConsigneePhone: function(e) {
    this.setData({
      ["consignee.phone"]: e.detail.value
    });
  },


  /**
   * 详细地址
   */
  bindConsigneeAddress: function(e) {
    this.setData({
      ["consignee.address"]: e.detail.value
    });
  },

  /**
   * 选择地区
   */
  bindConsigneeRegion: function() {
    var that = this;
    that.setData({
      show: true
    })
  },

  /**
   * 选择地区
   */
  sureSelectAreaListener: function(e) {
    var that = this;
    that.setData({
      show: false,
      province: e.detail.currentTarget.dataset.province,
      city: e.detail.currentTarget.dataset.city,
      area: e.detail.currentTarget.dataset.area.name,
      areaID: e.detail.currentTarget.dataset.area.id,
      ["consignee.RegionString"]: e.detail.currentTarget.dataset.province + '-' + e.detail.currentTarget.dataset.city + '-' + e.detail.currentTarget.dataset.area.name,
      ["consignee.region"]: e.detail.currentTarget.dataset.area.id
    });
  },

  /**
   * 添加收货地址
   */
  saveAddressInfo: function() {
    var name = this.data.consignee.name; //联系人姓名
    var phone = this.data.consignee.phone; //联系人电话
    var region = this.data.consignee.region; //收件地区
    var address = this.data.consignee.address; //详细地址
    if (name == undefined) {
      wx.showToast({
        title: '收货人姓名不能为空',
        icon: 'none',
        duration: 1000
      })
      return false;
    }
    if (phone == undefined) {
      wx.showToast({
        title: '收货人手机号码不能为空',
        icon: 'none',
        duration: 1000
      })
      return false;
    }
    if (region == undefined) {
      wx.showToast({
        title: '收货人所在地区为选择',
        icon: 'none',
        duration: 1000
      })
      return false;
    }
    if (address == undefined) {
      wx.showToast({
        title: '请填写收货人详细地址',
        icon: 'none',
        duration: 1000
      })
      return false;
    }
    this.submitAddressInfo();
  },

  /**
   * 提交信息
   */
  submitAddressInfo: function() {
    var that = this;
    var id = that.options.id;
    if (id == undefined) {
      id = ""
    }
    var phoneNum = that.data.consignee.phone;
    var phoneReg = '/^1[34578]\d{9}$/'; //正则校验手机号码
    if (phoneNum == undefined || phoneNum == '' || phoneNum == null) {
      wx.showToast({
        title: '手机号不能为空',
        icon: 'none',
        duration: 1000
      })
      return false;
    }
    if (!(/^1[34578]\d{9}$/.test(phoneNum))) {
      wx.showToast({
        title: '手机号格式不正确',
        icon: 'none',
        duration: 1000
      })
      return false;
    }

    wx.showLoading({
      title: '正在加载...',
    })
    var param = {
      UserID: wx.getStorageSync("UserID"),
      ID: id, //收货地址ID
      Linkmain: that.data.consignee.name, //收件人姓名
      Linkphone: that.data.consignee.phone, //收件人电话
      AreaAddress: that.data.consignee.region, //地址
      AddressDetail: that.data.consignee.address, //详细地址
    }
    console.log("================传递的参数是：" + JSON.stringify(param));
    util.ajaxRequest('/AppApiUser/UserReceivingAddress/UserReceivingAddressAdd', 'POST', param,
      function(res) {
        if (res.data.ERROR_CODE == "-1") {
          console.log("获取年份的返回值是：" + JSON.stringify(res.data));
          wx.showToast({
            title: '添加成功',
            icon: 'none',
            duration: 1000
          })
          wx.navigateBack()

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
  },

  /**
   * 查询地址信息
   */
  selectAddressInfo: function(ID) {
    var that = this;
    wx.showLoading({
      title: '正在加载...',
    })
    var param = {
      ID: ID, //收货地址ID
    }
    console.log("传递的参数是：" + JSON.stringify(param));
    util.ajaxRequest('/AppApiUser/UserReceivingAddress/GetUserReceivingAddressDetal', 'POST', param,
      function(res) {
        if (res.data.ERROR_CODE == "-1") {
          console.log("获取年份的返回值是：" + JSON.stringify(res.data.DATA));
          var data = res.data.DATA;
          that.setData({
            ["consignee.name"]: data.Linkmain,
            ["consignee.phone"]: data.Linkphone,
            ["consignee.RegionString"]: data.AreaAddressString, //地址编号
            ["consignee.address"]: data.AddressDetail,
            ["consignee.region"]: data.AreaAddress //地址id
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
      })
  }
})