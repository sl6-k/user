var cart = require('../../../utils/cart.js');
var util = require('../../../utils/util.js');
var app = getApp()
Page({
  data: {
    statusBarHeight: wx.getStorageSync('statusBarHeight'), //状态栏高度
    titleBarHeight: wx.getStorageSync('titleBarHeight'), //标题高度
    childrenhidden: false, //自弹窗是否显示
    letter: [], //A - Z 字母
    showLetter: "",
    winHeight: 0,
    children: [], //品牌下面的车型号
    cartList: [],
    isShowLetter: false,
    scrollTop: 0, //置顶高度
    scrollTopId: '', //置顶id
    hotcityList: null, //热门车型
    vehicleList: null, //车型库数据
    brandName: '', //搜索内容
  },


  onLoad: function() {
    //初始化车型库数据
    this.bindGetVehicleList();
    this.bindGetHotCar();
    var searchLetter = cart.letter;
    var cityList = this.data.cartList;
    var sysInfo = wx.getSystemInfoSync();
    var winHeight = sysInfo.windowHeight;
    var itemH = winHeight / searchLetter.length;
    var tempObj = [];
    for (var i = 0; i < searchLetter.length; i++) {
      var temp = {};
      temp.name = searchLetter[i];
      temp.tHeight = i * itemH;
      temp.bHeight = (i + 1) * itemH;
      tempObj.push(temp)
    }

    this.setData({
      winHeight: winHeight,
      itemH: itemH,
      letter: cart.letter,
      cartList: this.data.cartList
    })

  },
  onReady: function() {
    // 生命周期函数--监听页面初次渲染完成

  },
  onShow: function() {
    // 生命周期函数--监听页面显示

  },
  onHide: function() {
    // 生命周期函数--监听页面隐藏

  },
  onUnload: function() {
    // 生命周期函数--监听页面卸载

  },
  onPullDownRefresh: function() {
    // 页面相关事件处理函数--监听用户下拉动作

  },
  onReachBottom: function() {
    // 页面上拉触底事件的处理函数

  },

  /**
   * 点击字母进行锚点定位
   */
  clickLetter: function(e) {
    var showLetter = e.currentTarget.dataset.letter;
    this.setData({
      showLetter: showLetter,
      isShowLetter: true,
      scrollTopId: showLetter,
    })
    var that = this;
    setTimeout(function() {
      that.setData({
        isShowLetter: false
      })
    }, 1000)
  },

  /**
   * 选择车型弹出层
   */
  bindCity: function(e) {
    var carCode = e.currentTarget.dataset.carcode;
    this.getCarType(carCode);
    this.setData({
      childrenhidden: true
    })
  },

  /**
   * 获取二级数据
   */
  getCarType: function(carCode) {
    var that = this;
    var param = {
      ID: carCode,
    }
    util.ajaxRequest('/appapiuser/BrandSpecification/GetbrandTypeList', 'POST', param,
      function(res) {
        if (res.data.ERROR_CODE == "-1") {
          that.setData({
            children: res.data.DATA
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
   * 关闭选择车型的弹出层
   */
  colseLayer: function(e) {
    this.setData({
      childrenhidden: false
    })
  },

  /**
   * 选择车型
   */
  bindGetCarID: function(e) {
    var id = e.currentTarget.dataset.id;
    var name = e.currentTarget.dataset.name;
    var pedar = e.currentTarget.dataset.pedar;
    wx.navigateTo({
      url: '../motorcycleType/motorcycleType?carID=' + id + "&name=" + name + "&pedar=" + pedar,
    })
  },

  /**
   * 选择热门车型
   */
  bindHotCar: function(e) {
    console.log("热门车型" + JSON.stringify(e));
    var carID = e.currentTarget.dataset.carcode;
    this.getCarType(carID);
    this.setData({
      childrenhidden: true
    })
  },

  /**
   * 点击热门城市回到顶部
   */
  hotCity: function() {
    this.setData({
      scrollTop: 0,
    })
  },

  /**
   * 获取搜索车型
   */
  getSearchValue: function(e) {
    var brandName = e.detail.value;
    this.setData({
      brandName: brandName
    });
    this.bindGetVehicleList();
  },

  /**
   * 获取查询结果
   */
  search: function() {
    //获取查询的车型列表
    this.bindGetVehicleList();
  },

  /**
   * 通过查询获取车型列表
   */
  bindGetList: function() {
    var that = this;
    wx.showLoading({
      title: '正在加载...',
    })
    var param = {
      brandName: that.data.brandName
    }
    console.log("获取车型列表的参数：" + JSON.stringify(param));
    util.ajaxRequest('/AppApiUser/BrandSpecification/GetBrandJson', 'POST', param,
      function(res) {
        if (res.data.ERROR_CODE == "1") {
          console.log("获取车型列表的结果：" + JSON.stringify(res.data));
          var carObj = res.data.DATA;
          that.setData({
            searchList: carObj, //所有的车型数据
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
   * 获取车型列表
   */
  bindGetVehicleList: function() {
    var that = this;
    wx.showLoading({
      title: '正在加载...',
    })
    var param = {
      brandName: that.data.brandName
    }
    console.log("获取车型列表的参数：" + JSON.stringify(param));
    util.ajaxRequest('/AppApiUser/BrandSpecification/GetBrandJson', 'POST', param,
      function(res) {
        if (res.data.ERROR_CODE == "1") {
          console.log("获取车型列表的结果：" + JSON.stringify(res.data));
          var carObj = res.data.DATA;
          var letterArrary = [];
          if (carObj != null) {
            for (var i = 0; i < carObj.length; i++) {
              letterArrary.push(carObj[i].Letter)
            }
          } else {
            that.bindGetVehicleList();
          }

          that.setData({
            cartList: carObj, //所有的车型数据
            letter: letterArrary //字母数组
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
   * 获取热门车型列表
   */
  bindGetHotCar: function() {
    var that = this;
    wx.showLoading({
      title: '正在加载...',
    })
    var param = {

    }
    util.ajaxRequest('/AppApiUser/BrandSpecification/HotCar', 'POST', param,
      function(res) {
        if (res.data.ERROR_CODE == "-1") {
          that.setData({
            hotcityList: res.data.DATA
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

})