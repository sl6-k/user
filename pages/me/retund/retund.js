var util = require("../../../utils/util.js");
Page({
  /**
   * 页面的初始数据
   */
  data: {
    goosurl: '../../../image/icon/ic_camera.png', //商品图片
    imgurl: [], //上传的图片
    select: "", //选择申请原因
    textareavar: "", //问题描述
    add: "陕西省西安市雁塔区太白花园小区", //收货地址
    price: "99", //价格
    cargoway: "快递至卖家", //退货方式
    moneyway: "线下退款", //退款方式
    count1: "1", //购买数量
    count2: "1", //申请数量
    particulars: "山东莱州迈驰轮胎厂家直销充气轮胎 实心半实心 钢丝轮胎", //商品详情
    MemberOrderInfo: null, //会员订单
    OrderID: "", //订单ID
    GoodsList:null,//商品列表
  },

/**
 * 提交退货申请
 */
  SubReturn:function()
  {
    let that = this;
    if (that.data.select == "" || that.data.select==undefined)
    {
      wx.showToast({
        title: '请选择退货原因',
        icon: 'error',
        duration: 2000
      })
      return;
    }
    if (that.data.textareavar == "" || that.data.textareavar == undefined) {
      wx.showToast({
        title: '请输入问题描述',
        icon: 'error',
        duration: 2000
      })
      return;
    }
    var param = {
      MemberOrderID: that.data.OrderID,
      ReturnReason: that.data.select,//退货原因
      ApplicationReason: that.data.textareavar,//申请原因
    }
    wx.showLoading({
      title: '正在提交...',
    })
    console.log("参数", param);
    util.ajaxRequest('/AppApiUser/MemberOrder/MermberorderReturngGoods', 'POST', param,
      function (res) {
        //隐藏-加载中
        wx.hideLoading();
        if (res.data.ERROR_CODE==-1)
        {
          wx.showToast({
            title: '提交申请成功',
            icon: 'success',
            duration: 2000
          })
          wx.redirectTo({
            url: '../../me/returnGoods/returnGoodsList/returnGoodsList'
          })
        }else
        {
          wx.showToast({
            title: res.data.ERROR_MESSAGE ,
            icon: 'error',
            duration: 2000
          })
        }
      });
  },

  /**
   * 获取订单详情信息
   */
  GetOrderDetails: function() {
    let that = this;
    var param = {
      OrderNo: "",
      MemberOrderID: that.data.OrderID,
    }
    wx.showLoading({
      title: '正在加载...',
    })
    console.log("参数", param);
    util.ajaxRequest('/AppApiUser/MemberOrder/MemberOrderEdit', 'POST', param,
      function(res) {
        console.log("订单详情数据" + JSON.stringify(res.data.DATA));
        //隐藏-加载中
        wx.hideLoading();
        that.setData({
          MemberOrderInfo: res.data.DATA,//订单信息
          GoodsList: res.data.DATA.OrderItemList,//商品列表
        }); //订单信息
      });
  },
  /**
   * 获取收货地址
   */
  GetStoresAddress: function() {
    let that = this;
    var param = {
      Name: 'StoreAddress',
    }
    console.log("参数", param);
    util.ajaxRequest('/AppApiUser/MemberOrder/GetSystemConfig', 'POST', param,
      function(res) {
        if (res.data.ERROR_CODE == -1) {
          //隐藏-加载中
          that.setData({
            add: res.data.DATA
          }); //订单信息
        }
      });
  },
  // 请选择弹框
  selectFun: function() {
    var that = this;
    var itemList = ['不想买了', '买家发错货', '发票问题', '质量问题', '其它'];
    wx.showActionSheet({
      itemList: itemList,
      success(res) {
        // console.log(res.tapIndex)
        // console.log(itemList[0])
        that.setData({
          select: itemList[res.tapIndex]
        })
      },
      fail(res) {
        console.log(res.errMsg)
      },


    })
  },
  // 什么是原支付退还
  wayexplain: function() {
    wx.navigateTo({
      url: '',
    })

  },

  //文本框输入事件
  inputtap: function(event) {
    this.setData({
      textareavar: event.detail.value
    })

  },

  //调用上传图片方法
  add: function() {
    //将this赋值给that
    var that = this
    //调用wx.chooseImage方法从本地相册选择图片或使用相机拍照
    wx.chooseImage({
      count: 1, // 默认9
      sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有    //接口调用成功后的回调函数
      success: function(res) {
        console.log('这是返回的图片地址', res.tempFilePaths)
        var imglist = that.data.imgurl
        imglist.push(res.tempFilePaths)
        console.log('我是新建的数组2', imglist)
        that.setData({
          imgurl: imglist
        })
      }
    })
  },



  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    if (options.OrderID != "") {
      this.setData({
        OrderID: options.OrderID, //订单编号
      })
    }
    this.GetOrderDetails(); //获取订单详情
    this.GetStoresAddress(); //获取地址
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

})