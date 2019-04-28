// pages/classify/index/index.js
var util = require("../../../utils/util.js");
Page({

  /**
   * 页面的初始数据
   */
  data: {
    height: wx.getStorageSync('windowHeight'), //窗口高度
    currentTab: 0, //导航栏选中id
    lastActive: 0,
    contentActive: '', // 内容栏选中id
    screenArray: [], //左侧导航栏内容
    childrenArray: [], //右侧内容
    heightArr: [],
    containerH: 0,
    details: [], //存储二级分类
    isView: '', //锚点名称
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    wx.showLoading({
      title: '正在加载...',
    })
    var s_height = wx.getSystemInfoSync().windowHeight;
    this.setData({
      s_height: s_height
    });
    //获取分类信息
    this.getClassifyFun();
  },

  /**
   * 获取分类
   */
  getClassifyFun: function() {
    var that = this;
    var param = {

    }
    // console.log("获取区级信息传递的参数：" + JSON.stringify(param));
    util.ajaxRequest('/AppApiUser/Goods/GetGoodsTypeJson', 'POST', param,
      function(res) {
        if (res.data.ERROR_CODE == "-1") {
          console.log("获取分类信息：" + JSON.stringify(res.data));
          var data = res.data.DATA;
          var detail = [];
          //获取二级分类
          for (var i = 0; i < data.length; i++) {
            detail.push(data[i].children);
          }

          //绑定数据
          that.setData({
            screenArray: data,
            details: detail,
            childrenArray: data[that.data.currentTab],
          })

          //获取元素高度
          that.getHeightArr();

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
   * 按钮切换
   */
  navbarTap: function(e) {
    var index = e.currentTarget.dataset.index;
    var screenID = e.currentTarget.dataset.screenid;
    this.setData({
      currentTab: index, //按钮CSS变化
      isView: "s" + screenID,
      // scrollTop: 0, //切换导航后，控制右侧滚动视图回到顶部
      // childrenArray: e.currentTarget.dataset.children
    })
    console.log(this.data.currentTab)
  },

  /**
   * 调用滚动方法
   */
  scroll: function(e) {
    var self = this;
    self.scrollmove(self, e, e.detail.scrollTop);
  },

  /**
   * 滚动
   */
  scrollmove: function(self, e, scrollTop) {
    var scrollArr = self.data.height_arr;
    if (scrollTop > scrollArr[scrollArr.length - 1] - self.data.s_height) {
      return;
    } else {
      for (var i = 0; i < scrollArr.length; i++) {
        if (scrollTop >= 0 && scrollTop < scrollArr[0]) {
          if (0 != self.data.lastActive) {
            self.setData({
              currentTab: 0,
              lastActive: 0
            });
          }
        } else if (scrollTop >= scrollArr[i - 1] && scrollTop <= scrollArr[i]) {
          if (i != self.data.lastActive) {
            self.setData({
              currentTab: i,
              lastActive: i
            });
          }
        }
      }
    }
  },

  /**
   * 获取元素高度
   */
  getHeightArr: function() {
    var self = this;
    var height = 0,
      height_arr = [], //存储高度的数组初始化
      details = self.data.details, //所有的元素
      s_height = self.data.s_height; //获取元素的高度
    for (var i = 0; i < details.length; i++) {
      //获取每行的高度
      var last_height = 50 + Math.ceil(details[i].length / 3) * 107;
      //判断是否是最后一个元素
      if (i == details.length - 1) {
        last_height = last_height > s_height ? last_height : s_height + 50;
      }
      //获取累加的高度
      height += last_height;

      //将高度存储在高度的数组中
      height_arr.push(height);
    }
    self.setData({
      height_arr: height_arr
    });
  },

  /**
   * 根据分类查询产品
   */
  toSearchResult: function(e) {
    var goodsTypeID = e.currentTarget.dataset.typeid; //类型id
    wx.navigateTo({
      url: '../../home/productList/productList?GoodsTypeID=' + goodsTypeID,
    })
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
    //获取分类信息
    this.getClassifyFun();
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
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  }
})