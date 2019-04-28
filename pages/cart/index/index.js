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
   * 刷新选中状态
   */
  RefreshCheck: function() {
    let that = this;
    //获取列表中的状态进行判断，是否选中
    if (that.data.SelectGoodsCarID.length > 0) {
      var GoodsList = that.data.GoodsList;
      var IsNotSelect = false;
      var IsSelect = false;
      for (let i = 0; i < that.data.SelectGoodsCarID.length; i++) {
        var GoodCarID = that.data.SelectGoodsCarID[i];
        for (let i = 0; i < GoodsList.length; i++) {
          if (GoodsList[i].ID == GoodCarID) {
            GoodsList[i].IsCheck = true;
          }
          // console.log("选中的列表的存储" + GoodsList[i].IsCheck);
          // if (GoodsList[i].IsCheck != true) {
          //   IsNotSelect = true;
          // } else {
          //   IsSelect = true;
          // }
        }
      }
      //重新为购物车商品列表赋值
      that.setData({
        GoodsList: GoodsList
      });
      var AllCheck = that.data.AllCheck; //是否全选
      if (AllCheck) {
        that.setData({
          AllCheck: true
        })
      } else {
        that.setData({
          AllCheck: false
        })
      }
      //   if (IsSelect) {
      //     if (IsNotSelect) {
      //       that.setData({
      //         AllCheck: false
      //       });
      //     } else {
      //       that.setData({
      //         AllCheck: true
      //       });
      //     }
      //   } else {
      //     that.setData({
      //       AllCheck: false
      //     });
      //   }
    }
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
    wx.navigateTo({
      url: '../submitOrder/submitOrder?SelectGoodsCarID=' + that.data.SelectGoodsCarID,
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
          SelectGoodsCarID.push(GoodsList[i].ID);
          totalPrice += parseFloat(GoodsList[i].GoodsPrice) * GoodsList[i].Number
        }
      }
    }
    that.setData({
      TotalPrice: totalPrice.toFixed(2),
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
    //重新为购物车商品列表赋值
    that.setData({
      GoodsList: GoodsList
    });
    if (IsSelect) {
      if (IsNotSelect) {
        that.setData({
          AllCheck: false
        });
      } else {
        that.setData({
          AllCheck: true
        });
      }
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
      // if (that.data.GoodsList != null) {
      //   var GoodsList = that.data.GoodsList;
      //   for (let i = 0; i < GoodsList.length; i++) {
      //     if (GoodCarID == GoodsList[i].ID) {
      //       delete GoodsList[i];
      //       break;
      //     }
      //   }
      //   //重新填充JSON对象
      //   that.setData({
      //     GoodsList: GoodsList
      //   });
      //   console.log("删除之后的数组列表：" + JSON.stringify(that.data.GoodsList));
      // }
      var param = {
        ID: GoodCarID
      }
      util.ajaxRequest('/AppApiUser/ShopCar/ShopCarDel', 'POST', param, function(res) {
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
      util.ajaxRequest('/AppApiUser/ShopCar/GetShopCarCount', 'POST', param, function(res) {
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
    var param = {
      UserID: wx.getStorageSync('UserID'), //用户ID
      PageNumber: 1, //页码
      PageSize: 100, //页数
    }
    util.ajaxRequest('/AppApiUser/ShopCar/ShopCarList', 'POST', param,
      function(res) {
        //隐藏-加载中
        wx.hideLoading();
        if (res.data.ERROR_CODE == "-1") {
          //填充商品列表对象
          that.setData({
            GoodsList: res.data.DATA.data
          });
          that.setData({
            NotData: false
          })
          //刷新商品选中状态
          that.RefreshCheck();
          //计算价格
          that.GetTotalPrice();
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
    this.getGoodsCount(); //获取商品数量
    this.GetGoodsCarList(); //获取购物车商品列表
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
    this.getGoodsCount(); //获取商品数量
    this.GetGoodsCarList(); //获取购物车商品列表
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
      util.ajaxRequest('/AppApiUser/ShopCar/ShopCarUpdate', 'POST', param, function(res) {
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
      util.ajaxRequest('/AppApiUser/ShopCar/ShopCarUpdate', 'POST', param, function(res) {
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
    // var carName = wx.getStorageSync("carName");
    if (util.whetherLogin()) {
      wx.navigateTo({
        url: '../../home/productList/productList',
      })
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