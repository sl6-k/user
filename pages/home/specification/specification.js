// pages/home/specification/specification.js
var util = require("../../../utils/util.js");
Page({

  /**
   * 页面的初始数据
   */
  data: {
    specification: [
      ["175/70R14",
        "185/65R14",
        "195/60R14",
        "185/60R15",
        "185/65R15",
        "195/55R15",
        "195/60R15",
        "195/65R15",
        "215/65R15",
        "195/60R16",
        "205/50R16",
        "205/55R16",
        "205/60R16",
        "205/65R16",
        "215/55R16",
        "215/60R16",
        "215/65R16",
        "225/55R16",
        "225/60R16",
        "205/50R17",
        "215/45R17",
        "215/50R17",
        "215/55R17",
        "215/60R17",
        "225/45R17",
        "225/50R17",
        "225/55R17",
        "225/60R17",
        "225/65R17",
        "235/45R17",
        "235/50R17",
        "235/55R17",
        "235/65R17",
        "245/45R17",
        "245/65R17",
        "255/45R17",
        "265/65R17",
        "225/45R18",
        "225/60R18",
        "235/40R18",
        "235/45R18",
        "235/50R18",
        "235/55R18",
        "235/60R18",
        "245/40R18",
        "245/45R18",
        "245/50R18",
        "245/60R18",
        "255/40R18",
        "255/45R18",
        "255/55R18",
        "265/60R18",
        "235/50R19",
        "235/55R19",
        "245/40R19",
        "245/45R19",
        "245/55R19",
        "255/40R19",
        "255/45R19",
        "255/50R19",
        "255/55R19",
        "275/35R19",
        "275/40R19",
        "245/40R20",
        "255/45R20",
        "255/50R20",
        "255/55R20",
        "275/40R20"
      ],
    ], //总
    one: [], //一级
    two: [], //二级
    three: [], //三级
    specificationIndex: [0, 0, 0],
    options: null, //页面传参
    tyreType: [], //轮胎型号
    vehicleSystem: '', //搜索框显示的轮胎型号
    PageType:0,//页面类型
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    console.log(JSON.stringify(options.carID));
    if (options.type != undefined) {
      var type = options.type.split(",");
      this.setData({
        tyreType: type,
        options: options
      })
    }
    //页面类型
    if (options.PageType != undefined && options.PageType != "") {
      this.setData({ PageType: options.PageType });
    }
    if (options.type == undefined) {
      this.setData({
        options: options
      });
      this.getTypeByBrand(options.carID);
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
   * 根据车型查询轮胎型号
   */
  getTypeByBrand: function(carID) {
    var that = this;
    wx.showLoading({
      title: '加载中...',
    })
    var param = {
      CarID: carID
    }
    util.ajaxRequest('/appapiuser/BrandSpecification/GetTireSpecification', 'POST', param,
      function(res) {
        if (res.data.ERROR_CODE == "-1") {
          that.setData({
            tyreType: res.data.DATA
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
  },

  /**
   * 选择轮胎型号
   */
  selectTyreType: function(e) {
    var that = this;
    var index = e.currentTarget.dataset.index;
    var pages = getCurrentPages(); // 获取页面栈
    var currPage = pages[pages.length - 1]; // 当前页面
    var prevPageType = pages[pages.length - 2]; //上一个页面
    var prevPage = pages[pages.length - 3]; // 上上一个页面
    console.log("参数", that.data.PageType);
    console.log("页面参数", that.data.options);
    if(that.data.PageType==1)
    {
        var carName={
          brandType: that.data.options.pedar,
      }
      console.log("型号", that.data.tyreType)
      prevPage.setData({
        carName: carName,
        typeList: that.data.tyreType,
        vehicleSystem: that.data.tyreType[index],
      })
      wx.navigateBack({
        delta: 2
      })
    }else
    {
      
      prevPageType.setData({
        vehicleSystem: that.data.tyreType[index],
        ["carName.brandType"]: that.data.options.pedar,
        ["carName.VehicleSystem"]: that.data.options.name
      })
      wx.navigateBack({
        delta: 1
      })
    }
  },

  /**
   * 选择轮胎型号并查询
   */
  bindGetVehicleSystem: function(e) {
    var that = this;
    var index = e.detail.value
    var value = this.data.specification[0][index];

    //设置轮胎型号为选中的型号
    that.setData({
      vehicleSystem: value
    })
  },

  /**
   * 根据轮胎型号搜索轮胎
   */
  searchVehicleSystem: function() {
    var that = this;
    var pages = getCurrentPages(); // 获取页面栈
    var currPage = pages[pages.length - 1]; // 当前页面
    var prevPage = pages[pages.length - 2]; // 上一个页面


    //修改上一页面的轮胎型号
    prevPage.setData({
      vehicleSystem: that.data.vehicleSystem,
    })

    //点击搜索按钮，返回上一级
    wx.navigateBack()
  }
})