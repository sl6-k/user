var util = require("../../../utils/util.js");
var bmap = require('../../../utils/bmap-wx.min.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    index: 0,
    pageNumber: 1,
    pageSize: 10,
    storeList: null, //门店列表
    queryCriteria: {
      shopRegion: '', //地址
      storeIndex: '', //门店
      sortIndex: '', //排序
      shopOrder: '',
      shopName: "全部门店",
    }, //门店的查询条件
    imgUrl: util.imgUrl,
    loadingComplete: false, //是否加载完成
    loading: false, //"上拉加载"的变量，默认false，隐藏

    //选择省和市
    loactionData: null, //当前地址信息
    site: [], //选择区
    province: '',
    cityName: '',
    Area: "", //区级id
    area: '',
    show: false,
    areaID: '',
  },

  /**
   * 选择地区
   */
  sureSelectAreaListener: function(e) {
    var that = this;
    that.setData({
      show: false,
      cityName: e.detail.currentTarget.dataset.city,
      index: 0
    });
    this.bindGetAreaList();
  },

  /**
   * 选择门店地址
   */
  bindCityChange: function() {
    var that = this;
    that.setData({
      show: true
    })
  },


  /**
   * 选择地址
   */
  bindRegionChange: function(e) {
    var index = e.detail.value
    var cityCode = this.data.loactionData[index].RegionID;
    this.setData({
      index: index,
      Area: cityCode,
    })
    this.bindGetStoresList();
  },

  /**
   * 选择市
   */
  bindCityChange: function(e) {
    this.setData({
      show: true
    })
  },

  /**
   * 获取市级下的所有区
   */
  bindGetAreaList: function() {
    var that = this;
    that.setData({
      loading: true
    });
    var param = {
      RegionName: that.data.cityName
    }
    util.ajaxRequest('/AppApiUser/BrandSpecification/CitySearch', 'POST', param,
      function(res) {
        if (res.data.ERROR_CODE == "-1") {
          var data = res.data.DATA[0]
          var cityArr = [{
            RegionID: '',
            RegionName: '全部县区'
          }]
          var arr = [];
          for (var i = 0; i < data.list.length; i++) {
            cityArr.push(data.list[i]);
          }
          for (var i = 0; i < cityArr.length; i++) {
            arr.push(cityArr[i].RegionName);
          }

          that.setData({
            site: arr,
            loactionData: cityArr,
            regionID: data.RegionID //存储市级id
          });

          //获取门店列表
          that.bindGetStoresList();

          that.setData({
            loading: false
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
   * 选择门店
   */
  getShop: function() {
    var that = this;
    var itemList = ["全部门店", "门头店", "非门头店"];
    wx.showActionSheet({
      itemList: itemList,
      success: function(res) {
        var index = res.tapIndex;
        if (index == 0) {
          index = ""
        }
        that.setData({
          ["queryCriteria.StoreClassification"]: itemList[res.tapIndex],
          ["queryCriteria.storeIndex"]: index
        });
        that.bindGetStoresList();
      }
    })
  },

  /**
   * 根据缓存的市区信息获取区级信息
   */
  getDistrictList: function() {
    var that = this;
    var data = wx.getStorageSync('cityInfo')[0];
    var cityArr = [{
      RegionID: '',
      RegionName: '全部县区'
    }]
    var arr = [];
    for (var i = 0; i < data.list.length; i++) {
      cityArr.push(data.list[i]);
    }
    for (var i = 0; i < cityArr.length; i++) {
      arr.push(cityArr[i].RegionName);
    }

    that.setData({
      site: arr,
      loactionData: cityArr,
      cityName: wx.getStorageSync('cityInfo')[0].RegionName,
      regionID: wx.getStorageSync('cityInfo')[0].RegionID
    });
    this.bindGetStoresList();
  },


  /**
   * 选择排序方式
   */
  getSortName: function() {
    var that = this;
    var itemList = ["距离最近", "评价极高"];
    wx.showActionSheet({
      itemList: itemList,
      success: function(res) {

        that.setData({
          ["queryCriteria.shopOrder"]: itemList[res.tapIndex],
          ["queryCriteria.sortIndex"]: res.tapIndex + 1
        });
        if (res.tapIndex == 0) {
          var latitude = that.data.latitude;
          var longitude = that.data.longitude;
          that.bindGetStoresList();
        }
        that.bindGetStoresList();
      }
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {
    var that = this;
    if (wx.getStorageSync('cityInfo') == '') {
      that.setData({
        regionID: ''
      })
      //查询所有门店
      this.bindGetStoresList();
    } else {
      //根据缓存的定位地址查询门店
      this.getDistrictList();
    }
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
    var that = this;
    if (wx.getStorageSync('cityInfo') == '') {
      that.setData({
        regionID: ''
      })
      //查询所有门店
      this.bindGetStoresList();
    } else {
      //根据缓存的定位地址查询门店
      this.getDistrictList();
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
    this.setData({
      pageNumber: 1,
      loadingComplete: false
    });
    this.bindGetStoresList();
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {
    this.setData({
      pageNumber: this.data.pageNumber + 1
    })
    this.bindGetStoresList()
  },

  /**
   * 获取门店列表
   */
  bindGetStoresList: function() {
    var that = this;
    that.setData({
      loading: true
    });
    var param = {
      RegionID: that.data.regionID,
      PageNumber: that.data.pageNumber,
      PageSize: that.data.pageSize,
      StoreType: '', //门店类型查询
      Sort: that.data.queryCriteria.sortIndex, //距离评价排序
      Latitude: wx.getStorageSync("latitude"), //经度
      Longitude: wx.getStorageSync("longitude"), //纬度
      Area: that.data.Area, //区级id
      StoreClassification: that.data.queryCriteria.storeIndex, //根据门头店非门头店排序
    }
    util.ajaxRequest('/AppApiUser/Stores/StoreList', 'POST', param,
      function(res) {
        if (res.data.ERROR_CODE == "-1") {
          var data = res.data.DATA.data;
          if (that.data.pageNumber == 1) {
            data = res.data.DATA.data;
          } else {
            data = that.data.storeList.concat(res.data.DATA.data);
          }
          that.setData({
            storeList: data,
            totalCount: res.data.DATA.pagecount,
          });

          if (that.data.totalCount == that.data.pageNumber) {
            that.setData({
              loadingComplete: true,
            })
          }

          that.setData({
            loading: false
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
   * 打开门店详情
   */
  bindSelectStore: function(e) {
    console.log(JSON.stringify(e));
    var storeID = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: '../selectStoreDetail/selectStoreDetail?storeID=' + storeID,
    })
  }
})