// var city = require('../../../utils/city.js');
var util = require('../../../utils/util.js');
var bmap = require('../../../utils/bmap-wx.min.js');
var app = getApp()
Page({
  data: {
    searchLetter: [],
    showLetter: "",
    winHeight: 0,
    // tHeight: 0,
    // bHeight: 0,
    cityList: null,
    isShowLetter: false,
    scrollTop: 0, //置顶高度
    scrollTopId: '', //置顶id
    city: '',
    searchLetter: ["A", "B", "C", "D", "E", "F", "G", "H", "J", "K", "L", "M", "N", "P", "Q", "R", "S", "T", "W", "X", "Y", "Z"], //字母查询索引
    hotcityList: null, //热门城市列表
    searchValue: '', //搜索的关键字
    searchCity: null, //搜索结果存储
  },

  onLoad: function() {
    // 生命周期函数--监听页面加载
    this.getHotCityList();
    this.getLoacation();
    this.getCityList();
    var searchLetter = this.data.searchLetter;
    var cityList = this.data.cityList;
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
      searchLetter: tempObj,
      cityList: cityList,
    })
  },

  /**
   * 获取城市列表
   */
  getCityList: function() {
    var that = this;
    wx.showLoading({
      title: '正在加载...',
    })
    var param = {

    }
    console.log("传递的参数是：" + JSON.stringify(param));
    util.ajaxRequest('/appapiuser/BrandSpecification/AddressJson', 'POST', param,
      function(res) {
        if (res.data.ERROR_CODE == "-1") {
          var cityData = res.data.DATA;
          that.setData({
            cityList: res.data.DATA
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
    this.getHotCityList();
    this.getLoacation();
    this.getCityList();
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
   * 获取当前位置
   */
  getLoacation: function() {
    var that = this;
    var BMap = new bmap.BMapWX({
      ak: 'jerbOTL6vRfi6ZdXLjNCeosanYD7WehB'
    });

    //请求百度地图api并返回模糊位置
    wx.getLocation({
      type: 'wgs84',
      success: function(res) {
        that.setData({
          latitude: res.latitude, //经度
          longitude: res.longitude //纬度
        })
        BMap.regeocoding({
          location: that.data.latitude + ',' + that.data.longitude,
          success: function(res) {
            console.log("获取地理位置的返回值是：" + JSON.stringify(res));
            that.setData({
              loactionString: res.originalData.result.addressComponent,
              city: res.originalData.result.addressComponent.city
            })
          },
          fail: function() {
            wx.showToast({
              title: '请检查位置服务是否开启',
            })
          },
        });
      },
      fail: function() {
        console.log('小程序得到坐标失败')
      }
    })

  },

  /**
   * 获取区县信息及城市id
   */
  getCityInfo: function() {
    wx.showLoading({
      title: '正在加载...',
    })
    var param = {
      RegionName: this.data.city
    }
    util.ajaxRequest('/AppApiUser/BrandSpecification/CitySearch', 'POST', param,
      function(res) {
        if (res.data.ERROR_CODE == "-1") {
          console.log("获取区县列表：" + JSON.stringify(res.data));
          wx.removeStorageSync('cityInfo');
          console.log("清空缓存" + JSON.stringify(wx.getStorageSync('cityInfo')));
          wx.setStorageSync('cityInfo', res.data.DATA);
          console.log("重新获取缓存" + JSON.stringify(wx.getStorageSync('cityInfo')));
          var pages = getCurrentPages(); // 获取页面栈
          var currPage = pages[pages.length - 1]; // 当前页面
          var prevPage = pages[pages.length - 2]; // 上一个页面

          //返回上一页
          wx.navigateBack({
            delta: 1
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
      });
  },

  /**
   * 点击字母跳转
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
   * 选择城市
   */
  bindCity: function(e) {
    var city = e.currentTarget.dataset.city
    this.setData({
      city: e.currentTarget.dataset.city
    })

    // //获取城市信息并缓存
    this.getCityInfo();
  },

  /**
   * 选择定位城市
   */
  locationCity: function(e) {
    console.log("获取城市信息" + JSON.stringify(e));
    var city = e.currentTarget.dataset.city
    console.log("=========" + city);
    if (city != "") {
      this.setData({
        city: e.currentTarget.dataset.city
      })
      //获取城市信息并缓存
      this.getCityInfo();
    }else{
      wx.showToast({
        title: '您还未授权地理定位',
        icon: 'none',
        duration: 1000
      })
    }
  },

  /**
   * 选择热门城市
   */
  bindHotCity: function(e) {
    var city = e.currentTarget.dataset.city;
    console.log("选择热门城市：" + city);
    this.setData({
      city: city
    })

    //获取城市信息并缓存
    this.getCityInfo();
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
   * 获取热门城市列表
   */
  getHotCityList: function() {
    var that = this;
    wx.showLoading({
      title: '正在加载...',
    })
    var param = {

    }
    util.ajaxRequest('/AppApiUser/BrandSpecification/HotCoty', 'POST', param,
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
      });
  },

  /**
   * 获取查询内容
   */
  getSearchValue: function(e) {
    var searchValue = e.detail.value;
    this.setData({
      searchValue: searchValue
    });
  },

  /**
   * 查询内容
   */
  search: function() {
    var that = this;
    wx.showLoading({
      title: '正在加载...',
    })
    var param = {
      RegionName: this.data.searchValue
    }
    util.ajaxRequest('/appapiuser/BrandSpecification/CitySearch', 'POST', param,
      function(res) {
        if (res.data.ERROR_CODE == "-1") {
          that.setData({
            searchCity: res.data.DATA
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
      });
  },

  /**
   * 选择查询结果中的城市
   */
  bindSearchCity: function(e) {
    var city = e.currentTarget.dataset.name;
    this.setData({
      city: city
    })

    //获取城市信息并缓存
    this.getCityInfo();
  },

})