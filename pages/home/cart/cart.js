// pages/cart/index/index.js
var util = require("../../../utils/util.js");
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    GoodsList: null, //商品列表
    GoodsCount: 0, //商品数量
    SelectGoodsCarID: [], //选择的购物车列ID
    AllCheck: false, //全选
    TotalPrice: 0, //商品总价格
    TotalGoodsNumber: 0, //商品总数
    NotData: true, //是否显示无数据
    NotMore: false, //显示更多
  },

  /**
   * 结算
   */

  Settlement: function() {
    let that = this;
    if (that.data.TotalGoodsNumber <= 0) {
      wx.showToast({
        title: '请选择结算商品',
        icon: 'none',
        duration: 1000
      })
      return;
    }
    console.log("选择的商品", that.data.SelectGoodsCarID)
    wx.navigateTo({
      url: '../../cart/submitOrder/submitOrder?SelectGoodsCarID=' + that.data.SelectGoodsCarID,
    })
  },

  /**
   * 计算购物车的已选中的商品总价
   */

  GetTotalPrice: function() {
    let that = this;
    var GoodsList = that.data.GoodsList;
    var GoodsNumber = 0;
    var totalPrice = 0;
    var SelectGoodsCarID = new Array();
    if (GoodsList != null && GoodsList.length > 0) {
      for (let i = 0; i < GoodsList.length; i++) {
        if (GoodsList[i].IsCheck) {
          GoodsNumber++;
          console.log()
          SelectGoodsCarID.push(GoodsList[i].ID);
          totalPrice += parseFloat(GoodsList[i].GoodsPrice) * GoodsList[i].Number
        }
      }
    }
    console.log("选中的购物车ID", SelectGoodsCarID);
    that.setData({
      TotalPrice: totalPrice,
      TotalGoodsNumber: GoodsNumber,
      SelectGoodsCarID: SelectGoodsCarID, //选择的购物车ID
    }); //填充商品价格
  },
  /**
   * 单选
   */
  BindCheck: function(e) {
    let that = this;
    var GoodCarID = e.currentTarget.dataset.goodscarid;
    var IsCheck = e.currentTarget.dataset.ischeck;
    var NewIsCheck = !IsCheck;
    var IsSelect = false;
    var IsNotSelect = false;

    console.log("选择的ID", GoodCarID)
    console.log("新的选择状态", NewIsCheck)
    var GoodsList = that.data.GoodsList;
    if (GoodCarID != "" && GoodCarID != undefined) {
      if (GoodsList != null && GoodsList.length > 0) {
        for (let i = 0; i < GoodsList.length; i++) {
          if (GoodsList[i].ID == GoodCarID) {
            GoodsList[i].IsCheck = NewIsCheck;
          }

          if (!GoodsList[i].IsCheck) {
            IsNotSelect = true;
          } else {
            IsSelect = true;
          }
        }
      }
    }

    console.log("购物车商品列表集合", GoodsList)
    //重新为购物车商品列表赋值
    that.setData({
      GoodsList: GoodsList
    });
    if (IsSelect) {
      console.log("是否选中", IsSelect);
      console.log("是否不选中", IsNotSelect);
      if (IsNotSelect) {
        that.setData({
          AllCheck: false
        });
      } else {
        that.setData({
          AllCheck: true
        });
      }
      console.log("全选状态", that.data.AllCheck);
    } else {
      that.setData({
        AllCheck: false
      });
    }
    //刷新价格
    this.GetTotalPrice();
  },

  /**
   * 全选
   */
  AllCheck: function() {
    let that = this;
    if (that.data.AllCheck) {
      that.setData({
        AllCheck: false
      });
    } else {
      that.setData({
        AllCheck: true
      });
    }

    var GoodsList = that.data.GoodsList;
    if (GoodsList != null && GoodsList.length > 0) {
      for (let i = 0; i < GoodsList.length; i++) {
        GoodsList[i].IsCheck = that.data.AllCheck;
      }
    }
    console.log("购物车商品列表集合", GoodsList)
    //重新为购物车商品列表赋值
    that.setData({
      GoodsList: GoodsList
    });
    //刷新价格
    this.GetTotalPrice();
  },

  /**
   * 删除购物车某个商品
   */
  RemoveGoods: function(e) {
    var that = this;
    var GoodCarID = e.currentTarget.dataset.goodcarid;
    if (GoodCarID != "" && GoodCarID != undefined) {
      if (that.data.GoodsList != null) {
        var GoodsList = that.data.GoodsList;
        for (let i = 0; i < GoodsList.length; i++) {
          if (GoodCarID == GoodsList[i].ID) {
            delete GoodsList[i];
            break;
          }
        }
        //重新填充JSON对象
        that.setData({
          GoodsList: GoodsList
        });
      }
      var param = {
        ID: GoodCarID
      }
      console.log("参数", param);
      util.ajaxRequest('/AppApiUser/ShopCar/ShopCarDel', 'POST', param, function(res) {
        console.log("获取购物车数量返回结果", res)
        if (res.data.ERROR_CODE == "-1") {
          that.GetGoodsCarList(); //刷新购物车商品列表 
          that.getGoodsCount(); //重新获取商品数量
        }
      });
    }
  },

  /**
   * 获取商品数量
   */
  getGoodsCount: function() {
    let that = this;
    var UserID = wx.getStorageSync('UserID');
    if (UserID != "" && UserID != undefined) {
      var param = {
        UserID: UserID
      }
      console.log("参数", param);
      util.ajaxRequest('/AppApiUser/ShopCar/GetShopCarCount', 'POST', param, function(res) {
        console.log("获取购物车数量返回结果", res)
        if (res.data.ERROR_CODE == "-1") {
          that.setData({
            GoodsCount: res.data.DATA
          })
        }
      });
    }
  },
  //获取购物车商品列表
  GetGoodsCarList: function() {
    let that = this;
    wx.showLoading({
      title: '正在加载...',
    })
    var param = {
      UserID: wx.getStorageSync('UserID'), //用户ID
      PageNumber: 1, //页码
      PageSize: 100, //页数
    }
    console.log("购物车列表请求", param)
    util.ajaxRequest('/AppApiUser/ShopCar/ShopCarList', 'POST', param,
      function(res) {
        //隐藏-加载中
        wx.hideLoading();
        if (res.data.ERROR_CODE == "-1") {
          console.log("购物车商品列表", res.data.DATA)
          //填充商品列表对象
          that.setData({
            GoodsList: res.data.DATA.data
          });
          that.setData({
            NotData: false
          })
        } else {
          that.setData({
            NotData: true
          })
        }
      });
  },

  /**
   * 获取购物车中货物数量
   */
  GetGoodsCarNumber: function() {
    let that = this;
    var ShopCarNumber = 0;
    //var UserID = wx.getStorageSync("UserID");

    return ShopCarNumber;
  },




  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    wx.setNavigationBarTitle({
      title: '购物车',
    })
    this.getGoodsCount(); //获取商品数量
    this.GetGoodsCarList(); //获取购物车商品列表
    wx.setNavigationBarTitle({
      title: '购物车'
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {
    this.onLoad(); //获取购物车商品列表
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
    this.onLoad(); //获取购物车商品列表
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
    this.GetGoodsCarList();
    //停止当前页面下拉刷新
    wx.stopPullDownRefresh();
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  /**
   * 购物车商品数量减
   */
  bindSubtraction: function(e) {
    let that = this;
    var goodcarid = e.currentTarget.dataset.goodcarid;
    var number = 0;
    if (goodcarid != "" && goodcarid != undefined) {
      if (that.data.GoodsList != null) {
        var GoodsList = that.data.GoodsList;
        for (let i = 0; i < GoodsList.length; i++) {

          if (goodcarid == GoodsList[i].ID) {
            number = GoodsList[i].Number - 1;
            if (number < 1) {
              number = 1;
              return;
            }
            GoodsList[i].Number = number
          }
        }
        that.setData({
          GoodsList: GoodsList
        });

      }

      var param = {
        ID: goodcarid,
        Number: number, //商品数量
      }
      console.log("参数", param);
      util.ajaxRequest('/AppApiUser/ShopCar/ShopCarUpdate', 'POST', param, function(res) {
        console.log("获取购物车数量返回结果", res)
        if (res.data.ERROR_CODE == "-1") {
          that.GetGoodsCarList(); //刷新购物车商品列表 
        }
      });
    }
  },

  /**
   * 购物车商品数量加
   */
  addition: function(e) {
    let that = this;
    var goodcarid = e.currentTarget.dataset.goodcarid;
    var number = 0;
    if (goodcarid != "" && goodcarid != undefined) {
      if (that.data.GoodsList != null) {
        var GoodsList = that.data.GoodsList;
        for (let i = 0; i < GoodsList.length; i++) {
          if (goodcarid == GoodsList[i].ID) {
            number = GoodsList[i].Number + 1;
            GoodsList[i].Number = number
          }
        }
        that.setData({
          GoodsList: GoodsList
        });
      }

      var param = {
        ID: goodcarid,
        Number: number, //商品数量
      }
      console.log("参数", param);
      util.ajaxRequest('/AppApiUser/ShopCar/ShopCarUpdate', 'POST', param, function(res) {
        console.log("获取购物车数量返回结果", res)
        if (res.data.ERROR_CODE == "-1") {
          that.GetGoodsCarList(); //刷新购物车商品列表 
        }
      });
    }
  },

  /**
   * 去逛逛
   */
  goProductList: function() {
    var carName = wx.getStorageSync("carName");
    if (util.whetherLogin()) {
      if (carName == null || carName == undefined || carName == "") {
        wx.showModal({
          title: '温馨提示',
          content: '您还未添加车型,前去添加车型',
          success: function(res) {
            if (res.confirm) {
              wx.navigateTo({
                url: '../selectCart/selectCart',
              })
            } else {
              return;
            }
          }
        })
      } else {
        wx.navigateTo({
          url: '../../home/productList/productList',
        })
      }
    } else {
      wx.showModal({
        title: '温馨提示',
        content: '您还未登录，请先登录',
        success: function(res) {
          if (res.confirm) {
            wx.navigateTo({
              url: '../../login/login/login',
            })
          } else {
            return;
          }
        }
      })
    }
  }
})