// pages/home/motorcycleType/motorcycleType.js
var util = require('../../../utils/util.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    statusBarHeight: wx.getStorageSync('statusBarHeight'),
    titleBarHeight: wx.getStorageSync('titleBarHeight'),
    title: '请选择发动机排量', //标题名称
    options: null, //页面传递过来的参数存储
    carInfo: null, //车辆信息
    motorycle: null, //车排量数据存储
    productionYearList: null, //车辆年份列表
    isSelectYear: false, //判断是否显示年份
    isMotorycle: false, //判断是否显示排量
    Displacement: null, //排量
    ProductionYear: null, //年份
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    console.log(JSON.stringify(options));
    this.setData({
      options: options
    })
    this.bindSelectDis();
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
   *  根据排量查询
   */
  bindSelectDis: function() {
    var that = this;
    wx.showLoading({
      title: '正在加载...',
    })
    var param = {
      ID: this.data.options.carID
    }
    console.log("传递的参数是：" + JSON.stringify(param));
    util.ajaxRequest('/AppApiUser/BrandSpecification/GetVehicleList', 'POST', param,
      function(res) {
        if (res.data.ERROR_CODE == "-1") {
          console.log("返回值是：" + JSON.stringify(res.data));
          that.setData({
            motorycle: res.data,
            isMotorycle: true,
            isSelectYear: false
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
          content: res.ERROR_MESSAGE
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
   * 获取排量ID
   */
  getMotorycleType: function(e) {
    console.log("获取到的数据是：" + JSON.stringify(e));
    var id = e.currentTarget.dataset.id; //排量ID
    wx.setNavigationBarTitle({
      title: '请选择年份'
    })
    this.setData({
      carInfo: e.currentTarget.dataset.name,
      Displacement: e.currentTarget.dataset.name
    });
    this.getProductionYearList(id);
  },

  /**
   * 获取车辆年份
   */
  getMotorycleYear: function(e) {
    console.log("获取车辆年份" + JSON.stringify(e))
    var name = this.data.options.name;
    let pages = getCurrentPages();
    let prevPage = pages[pages.length - 2];
    this.setData({
      ProductionYear: e.currentTarget.dataset.name
    });
    //新增车型
    this.addMotorycleType();
  },

  /**
   * 新增车型
   */
  addMotorycleType: function() {
    var that = this;
    wx.showLoading({
      title: '正在添加...',
    })
    var param = {
      UserID: wx.getStorageSync("UserID"),
      BrandSpecificationID: that.data.options.carID, //车型id
      Displacement: that.data.Displacement, //排量
      ProductionYear: that.data.ProductionYear, //年份
      IsDefault: true, //是否默认
    }
    console.log("传递的参数是：" + JSON.stringify(param));
    util.ajaxRequest('/AppApiUser/UserVehicleType/UserVehicleTypeAdd', 'POST', param,
      function(res) {
        if (res.data.ERROR_CODE == "-1") {
          console.log("添加车型的返回值是：" + JSON.stringify(res.data));
          wx.showToast({
            title: '添加成功',
            icon: 'none',
            duration: 1000
          })
          var pages = getCurrentPages();
          var currPage = pages[pages.length - 1]; //当前页面
          var prevPage = pages[pages.length - 2]; //上一个页面
          wx.navigateBack({
            delta: 2
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
  },

  /**
   * 根据排量获取年份
   */
  getProductionYearList: function(id) {
    var that = this;
    wx.showLoading({
      title: '正在加载...',
    })
    var param = {
      ID: id
    }
    console.log("传递的参数是：" + JSON.stringify(param));
    util.ajaxRequest('/AppApiUser/BrandSpecification/GetProductionYearList', 'POST', param,
      function(res) {
        if (res.data.ERROR_CODE == "-1") {
          console.log("获取年份的返回值是：" + JSON.stringify(res.data));
          var data = res.data.DATA;
          var array = [];
          console.log("转换后的值是：" + JSON.stringify(data));
          if (data != null) {
            data = data.split(',');
            var len = data.length;
            for (var i = 0; i < len; i++) {
              console.log(data[i]);
              array.push({
                "name": data[i],
              });
            }
          } else {
            array = null;
          }

          that.setData({
            productionYearList: array,
            isSelectYear: true,
            isMotorycle: false
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