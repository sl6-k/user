var util = require("../../../utils/util.js");
Page({

  /**
   * 页面的初始数据
   */
  data: {
    GoodsDataList: null, //商品列表
    pageNumber: 1, //当前页码
    pageSize: 10, //当前页数量
    AllPageNumber: 0, //总页数
    statusBarHeight: wx.getStorageSync('statusBarHeight'), //状态栏高度
    titleBarHeight: wx.getStorageSync('titleBarHeight'), //标题高度
    index: 0,
    storeList: null, //门店列表
    childrenhidden: false, //显示筛选页面
    isTop: true, //是否置顶
    carName: null, //热门车型
    vehicleSystem: '', //默认轮胎型号
    options: null, //页面携带的参数
    tyreSize: '',//轮胎尺寸
    tyreSizeArr: ['14寸', '15寸', '16寸', '17寸', '18寸', '19寸','20寸'],//轮胎所有的尺寸
    tyreSizeArrNum: ['14', '15', '16', '17', '18', '19', '20'],//数字
    tyreText: '选择尺寸',//尺寸的文本
    tyreSizeShow: false,//选择尺寸是否显示
  },

  /**
   * 获取搜索框内容
   */
  searchInput: function(e) {
    this.setData({
      vehicleSystem: e.detail.value,
    })
  },

  /**
   * 点击搜索按钮查询
   */
  SearchConfirm: function() {
    this.setData({
      pageNumber: 1,
      GoodsDataList: null
    })
    //根据搜索内容查询产品列表
    this.bindGoodsList();
  },


  /**
   * 选择门店
   */
  SelectOrderBy: function() {
    var that = this;
    var itemList = ["综合排序", "新品", "评论从高到底", "销量从高到底", "价格从高到底", "价格从高到底"];
    var that = this;
    wx.showActionSheet({
      itemList: itemList,
      success: function(res) {
      }
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var that = this;
    if (options.searchKey) {
      //有搜索关键字，则表明是从首页搜索商品进入商品列表页面
      that.setData({
        vehicleSystem: options.searchKey,
        searchValue: options.searchKey
      })
    }
    //无搜索关键字，则表明是从首页查看更多进入商品列表页面
    this.setData({
      options: options
    })
    if (options.GoodsTypeID == 25 || options.GoodsTypeID==41){
      that.setData({
        tyreSizeShow:true
      })
    }
    //获取车型信息
    // this.bindGetMyCar();
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {
    if (util.whetherLogin()) {
      // this.bindGetMyCar();
      this.bindGoodsList();
      // } else {
      //   this.setData({
      //     vehicleSystem: '型号',
      //     ["carName.brandType"]: '品牌',
      //     GoodsDataList: []
      //   });
    }
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
    var that = this;
    that.bindGoodsList(); //加载商品列表
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
      pageNumber: 1
    });
    this.bindGoodsList();
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {
    var that = this;
    that.setData({
      pageNumber: that.data.pageNumber + 1
    });
    this.bindGoodsList();
  },
  /*
  * 更改轮胎尺寸
  */
  bindPickerChange: function(e){
    this.setData({
      tyreSize: this.data.tyreSizeArrNum[e.detail.value],
      tyreText: this.data.tyreSizeArr[e.detail.value],
      pageNumber: 1,
      GoodsDataList: null
    })
    this.bindGoodsList();
  },

  /**
   * 获取商品列表
   */
  bindGoodsList: function() {
    var that = this;
    var GoodsTypeID = that.data.options.GoodsTypeID;
    if (GoodsTypeID == undefined || GoodsTypeID == null || GoodsTypeID == "") {
      GoodsTypeID = ''
    }
    wx.showLoading({
      title: '正在加载...',
    })
    var param = {
      IsRecommend: "",
      PageNumber: that.data.pageNumber,
      PageSize: that.data.pageSize,
      GoodsSpec: that.data.vehicleSystem,
      GoodsTypeID: GoodsTypeID,
      GoodsSize: that.data.tyreSize
    }
    util.ajaxRequest('/AppApiUser/Goods/GoodsList', 'POST', param,
      function(res) {
        if (res.data.ERROR_CODE == "-1") {
          if (that.data.pageNumber == 1) {
            that.setData({
              GoodsDataList: res.data.DATA.data,
              AllPageNumber: res.data.DATA.pagecount,
            });
          } else {
            that.setData({
              GoodsDataList: that.data.GoodsDataList.concat(res.data.DATA.data),
              AllPageNumber: res.data.DATA.pagecount,
            });
          }

          //隐藏-加载中
          wx.hideLoading();
          //隐藏-加载中
          wx.hideNavigationBarLoading();
          // if (that.pageNumber >= res.data.pagecount) {
          //停止当前页面下拉刷新
          wx.stopPullDownRefresh();
          // }
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
   * 获取品牌列表
   */
  getBrand: function() {

    var that = this;
    wx.showLoading({
      title: '正在加载...',
    })
    var param = {

    }
    util.ajaxRequest('/AppApiUser/Goods/GoodBrandList', 'POST', param,
      function(res) {
        if (res.data.ERROR_CODE == "-1") {
          that.setData({
            brandList: res.data.DATA
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
   * 打开筛选页面
   */
  openScreen: function() {
    this.setData({
      childrenhidden: true
    })
    this.getBrand();
  },

  /**
   * 关闭筛选页面
   */
  colseLayer: function() {
    this.setData({
      childrenhidden: false
    });
  },

  /**
   * 打开选择品牌和车型页面
   */
  selectCarBrand: function() {
    wx.navigateTo({
      url: '../selectBrand/selectBrand?PageType=1',
    })
  },

  /**
   * 获取我的车型
   */
  bindGetMyCar: function() {
    var that = this;
    wx.showLoading({
      title: '正在加载...',
    })
    var param = {
      UserID: wx.getStorageSync("UserID")
    }
    util.ajaxRequest('/AppApiUser/Account_Users/GetMyCar', 'POST', param,
      function(res) {
        if (res.data.ERROR_CODE == "-1") {
          var vehicleSystem = res.data.DATA;
          if (vehicleSystem == null) {
            that.setData({
              ["carName.brandType"]: '全部',
              vehicleSystem: '全部',
            });
          } else {
            vehicleSystem = res.data.DATA.TireSpecification.split(";");
            that.setData({
              carName: res.data.DATA,
              typeList: vehicleSystem,
              vehicleSystem: vehicleSystem[0],
            });
          }

          that.bindGoodsList(); //加载商品列表


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
   * 打开轮胎型号页面
   */
  bindOpenVehicleSystem: function() {
    wx.navigateTo({
      url: '../specification/specification',
    })
  },

  /**
   * 查询轮胎型号
   */
  selectTyreType: function(e) {
    var tireSpecification = e.currentTarget.dataset.type;
    var name = e.currentTarget.dataset.name;
    var pedar = e.currentTarget.dataset.pedar;
    wx.navigateTo({
      url: '../specification/specification?type=' + tireSpecification + "&name=" + name + "&pedar=" + pedar,
    })
  }

})