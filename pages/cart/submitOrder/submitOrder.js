// pages/cart/submitOrder/submitOrder.js
var util = require("../../../utils/util.js");
Page({

  /**
   * 页面的初始数据
   */
  data: {
    UserAddress: null, //用户地址对象
    UserAddressID: null, //收货地址ID
    Store: null, //门店对象
    StoreID: null, //门店ID
    InstallationType: 1, //安装类型 0是无需安装 1是到店安装
    SelectGoodsCarID: [], //选择的购物车数据ID
    SelectGoods: null, //商品列表
    CouponID: null, //卡券ID
    Coupon: null, //卡券信息
    Invoice: null, //发票信息
    PayType: 0, //支付类型 1在线支付 2到店支付
    AllPrice: 0, //订单总金额
    GoodsAllPrice: 0, //商品总价
    InstallationPrice: 0, //安装费用
    FreightPrice: 0, //运费
    PreferentialPrice: 0, //优惠金额
    ActualPrice: 0, //实际付款
    GoodsNumber: 0, //商品数量
    imgUrl: util.imgUrl, //
    PageNumber: 1,
    PageSize: 1
  },

  /**
   * 订单提交
   */
  OrderSubmit: function() {
    let that = this;
    var address = that.data.UserAddress;
    var store = that.data.Store;
    var installationType = that.data.InstallationType;
    
    if (installationType == 1) {
      if (store == null || store == '' || store == undefined) {
        wx.showToast({
          title: '请选择门店',
          icon: 'none',
          duration: 1000
        })
        return false;
      }
    }

    if (address == null || address == '' || address == undefined) {
      wx.showToast({
        title: '请选择联系人',
        icon: 'none',
        duration: 1000
      })
      return false;
    }


    var param = {
      UserID: wx.getStorageSync('UserID'), //用户ID
      GoodsList: that.data.SelectGoods, //商品列表
      OrderPrice: that.data.AllPrice, //订单总金额
      IsInstall: that.data.InstallationType, //是否安装 1安装 0 不安装
      Linkmain: that.data.UserAddress == null ? "" : that.data.UserAddress.Linkmain, //联系人
      Linkphone: that.data.UserAddress == null ? "" : that.data.UserAddress.Linkphone, //联系人电话
      AreaAddress: that.data.UserAddress == null ? "" : that.data.UserAddress.AreaAddress, //省市区
      AddressDetail: that.data.UserAddress == null ? "" : that.data.UserAddress.AddressDetail, //详细地址
      StoreID: that.data.Store == null ? "" : that.data.Store.StoreID, //门店ID
      StoreName: that.data.Store == null ? "" : that.data.Store.StoreName, //门店名称
      StoreCoordinates: that.data.Store == null ? "" : that.data.Store.StoreCoordinates, //门店地址
      Invoice: that.data.Invoice, //发票信息
      CouponsID: that.data.Coupon == null ? "" : that.data.Coupon.CouponID, //优惠券ID
      CouponsMoney: that.data.Coupon == null ? "" : that.data.Coupon.CouponPrice, //优惠券金额
      CouponsName: that.data.Coupon == null ? "" : that.data.Coupon.CouponName, //优惠券名称
      DiscountAmount: that.data.PreferentialPrice, //优惠金额
      FreightMoney: that.data.FreightPrice, //运费
      RealAmount: that.data.ActualPrice, //实际付款
      PaymentMethod: that.data.PayType, //支付类型 0在线支付 1到店支付
      GoodsNumber: that.data.GoodsNumber, //商品数量
    }
    wx.showLoading({
      title: '正在提交...',
    })
    console.log("确认下单提交参数" + JSON.stringify(param));
    util.ajaxRequest('/AppApiUser/MemberOrder/MemberOrderSubmit', 'POST', param,
      function(res) {
        //隐藏-加载中
        wx.hideLoading();
        if (res.data.ERROR_CODE == "-1") {
          wx.redirectTo({
            url: '../cartCashier/cartCashier?OrderID=' + res.data.DATA.MemberOrderID,
          });
        }
      });
  },
  /**
   * 根据位置读取门店
   */
  GetStores: function() {
    // console.log("加载门店信息" + wx.getStorageSync('cityInfo')[0].RegionID)
    let that = this;
    var regionID;
    if (wx.getStorageSync('cityInfo')==''){
      regionID=''
    }else{
      regionID= wx.getStorageSync('cityInfo')[0].RegionID
    }
    var param = {
      RegionID: regionID ,
      PageNumber: 1,
      PageSize: 1,
      StoreType: '', //门店类型
      Sort: "", //距离评价排序
      Latitude: wx.getStorageSync("latitude"), //经度
      Longitude: wx.getStorageSync("longitude"), //纬度
      Area: '' //区级id
    }
    console.log("获取门店信息传参" + JSON.stringify(param));
    util.ajaxRequest('/AppApiUser/Stores/StoreList', 'POST', param,
      function(res) {
        //隐藏-加载中
        if (res.data.ERROR_CODE == "-1") {
          console.log("获取门店信息" + JSON.stringify(res.data.DATA.data));
          //填充商品列表对象
          if (res.data.DATA.data.length > 0) {
            that.setData({
              Store: res.data.DATA.data[0]
            });
          } else {
            that.setData({
              Store: null
            })
          }
          that.calculateActualPrice(); //计算金额
        }
      });
  },

  /**
   * 获取可使用优惠券
   */
  GetCoupon: function() {
    let that = this;
    var param = {
      UserID: wx.getStorageSync('UserID'), //用户ID
      GoodsList: that.data.SelectGoods, //商品列表
    }
    console.log("获取可使用的优惠券" + JSON.stringify(param));
    util.ajaxRequest('/AppApiUser/Account_Users/GetMyCouponAvailable', 'POST', param,
      function(res) {
        if (res.data.ERROR_CODE == "-1") {
          console.log("获取可用优惠券的返回值是：" + JSON.stringify(res.data));
          //填充优惠券对象
          that.setData({
            Coupon: res.data.DATA
          });
          //计算实付金额
          that.calculateActualPrice();
        }
      });
  },
  /**
   * 计算应付金额
   */
  calculateActualPrice: function() {
    let that = this;
    var GoodsAllPrice = 0; //商品总价
    var GoodsNumber = 0; //商品数量
    console.log("计算总价", that.data.SelectGoods)
    //计算总金额
    if (that.data.SelectGoods != null && that.data.SelectGoods.length > 0) {

      for (let i = 0; i < that.data.SelectGoods.length; i++) {
        GoodsAllPrice += parseFloat(that.data.SelectGoods[i].GoodsPrice) * parseFloat(that.data.SelectGoods[i].Number);
        GoodsNumber += parseFloat(that.data.SelectGoods[i].Number);
      }
      console.log("总金额", GoodsAllPrice)
      //填充商品价格
      that.setData({
        GoodsAllPrice: GoodsAllPrice,
        GoodsNumber: GoodsNumber
      });
    }
    //安装费用
    if (that.data.Store != null && that.data.InstallationType == 1) {
      if (that.data.Store.InstallationPrice > 0) {
        that.setData({
          InstallationPrice: that.data.Store.InstallationPrice
        });
      }
    }
    //优惠券金额
    console.log("3优惠券金额" + JSON.stringify(that.data.Coupon));
    if (that.data.Coupon != null) {
      console.log("1优惠券金额" + that.data.Coupon.CouponPrice)
      if (that.data.Coupon.CouponPrice > 0) {
        that.setData({
          PreferentialPrice: that.data.Coupon.CouponPrice
        });
      }
    }
    //计算总金额
    var AllPrice = 0
    AllPrice = parseFloat(GoodsAllPrice) + parseFloat(that.data.InstallationPrice);
    that.setData({
      AllPrice: AllPrice
    });
    //计算实际付款
    var ActualPrice = 0;
    console.log("商品总价" + GoodsAllPrice);
    console.log("安装费用" + that.data.InstallationPrice);
    console.log("2优惠券金额" + that.data.PreferentialPrice);
    ActualPrice = parseFloat(GoodsAllPrice) + parseFloat(that.data.InstallationPrice) - parseFloat(that.data.PreferentialPrice)
    console.log("实付金额" + ActualPrice);
    that.setData({
      ActualPrice: ActualPrice.toFixed(2)
    });
    console.log("写入页面的实付金额" + that.data.ActualPrice);
  },

  /**
   * 获取购物车商品列表
   */
  GetGoodsList: function() {
    let that = this;
    wx.showLoading({
      title: '正在加载...',
    })
    var param = {
      UserID: wx.getStorageSync('UserID'), //用户ID
      SelectGoodsCarID: that.data.SelectGoodsCarID, //购物车ID
    }
    console.log("购物车列表请求" + JSON.stringify(param));
    util.ajaxRequest('/AppApiUser/ShopCar/ShopCarGoodsList', 'POST', param,
      function(res) {
        //隐藏-加载中
        wx.hideLoading();
        if (res.data.ERROR_CODE == "-1") {
          console.log("购物车商品列表" + JSON.stringify(res.data.DATA.data));
          //填充商品列表对象
          that.setData({
            SelectGoods: res.data.DATA.data
          });

          that.GetCoupon(); //获取可使用的优惠券

          //计算商品总价
          that.calculateActualPrice();
        }
      });
  },

  /**
   * 安装类型选择按钮
   */
  installationTypeBtn: function(event) {

    let that = this;
    var typeVal = event.currentTarget.dataset.typeval;
    if (typeVal == 1) { //到店安装
      that.setData({
        PayType: 0
      }); //到店支付
    } else {
      that.setData({
        PayType: 0
      }); //在线支付
    }
    that.setData({
      InstallationType: typeVal
    });
    that.calculateActualPrice(); //计算总金额
  },
  /**
   * 选择安装门店
   */
  bindSelectStore: function(ecent) {
    wx.navigateTo({
      url: '../selectStore/selectStore',
    })
  },
  /**
   * 用户地址点击
   */
  UserAddressClick: function() {
    wx.navigateTo({
      url: '../selectAddress/selectAddress',
      success: function(res) {},
      fail: function(res) {},
      complete: function(res) {},
    })
  },

  /**
   * 获取用户地址
   */
  bindGetUsrAddress: function(e) {
    var that = this;
    wx.showLoading({
      title: '加载中...',
    })
    var param = {
      UserID: wx.getStorageSync("UserID")
    }
    util.ajaxRequest('/AppApiUser/UserReceivingAddress/GetUserReceivingAddressList', 'POST', param,
      function(res) {
        if (res.data.ERROR_CODE == "-1") {
          console.log(JSON.stringify(res.data.DATA));
          if (res.data.DATA.length > 0) {
            var isDefault = false;
            for (let i = 0; i < res.data.DATA.length; ++i) {
              if (res.data.DATA[i].IsDefault) {
                isDefault = true;
                that.setData({
                  UserAddress: res.data.DATA[i],
                  UserAddressID: res.data.DATA[i].ID,
                });
              }
            }
            if (!isDefault) {
              that.setData({
                UserAddress: res.data.DATA[0],
                UserAddressID: res.data.DATA[0].ID,
              });
            }
          }
          console.log("获取用户地址" + JSON.stringify(that.data.UserAddress));
          //隐藏-加载中
          wx.hideLoading();
        } else {
          //错误提示
          wx.showModal({
            showCancel: false,
            content: res.data.ERROR_MESSAGE
          });
          //隐藏-加载中
          wx.hideLoading();
        }
      },
      function(res) {
        //错误提示
        wx.showModal({
          showCancel: false,
          content: res.data.ERROR_MESSAGE
        });
      });
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    console.log("提交订单页参数", JSON.stringify(options))
    if (options.SelectGoodsCarID) {
      this.setData({
        SelectGoodsCarID: options.SelectGoodsCarID
      });
    }
    this.bindGetUsrAddress(); //获取用户地址
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {
    this.GetGoodsList(); //加载商品列表
    this.GetStores(); //加载门店信息
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
   * 选择优惠券
   */
  selectCoupon: function(e) {
    wx.navigateTo({
      url: '../SelectCoupon/SelectCoupon',
    })
  },

  /**
   * 添加地址
   */
  addAddress: function(e) {
    wx.navigateTo({
      url: '../addAddress/addAddress',
    })
  },

  /**
   * 获取发票信息
   */
  bindGetInvoice: function() {
    var that = this;
    console.log("获取发票信息")
    wx.chooseInvoiceTitle({
      success(res) {
        console.log(JSON.stringify(res));
        that.setData({
          Invoice: res
        });
      }
    })
  },

})