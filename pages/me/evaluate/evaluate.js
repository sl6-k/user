// pages/me/evaluate/evaluate.js
var util = require("../../../utils/util.js");
Page({

  /**
   * 页面的初始数据
   */
  data: {
    evaluateALL: [1, 2, 3, 4, 5], //所有评分
    evaluateColor: 0, //商品评分
    storeColor: 0, //描述评分
    logisticsColor: 0, //物流评分
    attitudeColor: 0, //服务态度平分
    urlImg: '../../../image/icon/score-no.png', //灰色
    urlImgBright: '../../../image/icon/score-yes.png', //彩色
    evaluateText: '', //评论内容
    memberOrderID: '', //订单ID
    MemberOrderInfo: null, //订单详情
    images: [], //图片地址
    imgURL: util.imgUrl, //图片网络地址
    isAnonymous: false, //是否匿名评价
  },

  /**
   * 是否匿名评价
   */
  changeAnonymous: function(e) {
    console.log(JSON.stringify(e));
    this.setData({
      isAnonymous: !this.data.isAnonymous
    })
  },

  /**
   * 获取订单详情信息
   */
  GetOrderDetails: function() {
    let that = this;
    var param = {
      OrderNo: "",
      MemberOrderID: that.data.memberOrderID,
    }
    wx.showLoading({
      title: '正在加载...',
    })
    util.ajaxRequest('/AppApiUser/MemberOrder/MemberOrderEdit', 'POST', param,
      function(res) {
        console.log("订单详情数据", res)
        //隐藏-加载中
        wx.hideLoading();
        that.setData({
          MemberOrderInfo: res.data.DATA
        }); //订单信息
      });
  },

  // 点击商品评分
  showEvaluate: function(e) {
    let i = e.currentTarget.dataset.index;
    this.setData({
      evaluateColor: i
    });
  },

  // 描述评分
  describeEvaluate: function(e) {
    let i = e.currentTarget.dataset.index;
    this.setData({
      storeColor: i
    });
  },
  // 物流服务评分
  logisticsEvaluate: function(e) {
    let i = e.currentTarget.dataset.index;
    this.setData({
      logisticsColor: i
    });
  },

  // 服务态度评分
  attitudeEvaluate: function(e) {
    let i = e.currentTarget.dataset.index;
    this.setData({
      attitudeColor: i
    });
  },

  /*
   * 选择图片
   */
  uploadpic: function(e) {
    var that = this //获取上下文

    //选择图片
    wx.chooseImage({
      count: 8,
      sizeType: ['compressed'],
      sourceType: ['album', 'camera'],
      success: function(res) {
        console.log("选择图片的返回结果", res)
        if (res.errMsg == "chooseImage:ok") {
          var upload_picture_list = new Array();
          var tempFiles = res.tempFiles
          //把选择的图片 添加到集合里
          for (var i in tempFiles) {

            tempFiles[i]['upload_percent'] = 0
            tempFiles[i]['path_server'] = ''
            console.log("选择图片下标" + i)
            upload_picture_list.push(tempFiles[i])
          }
          //显示
          that.setData({
            upload_picture_list: upload_picture_list,
          });
          that.uploadimage();
        }
        console.log("选择图片保存的路径" + JSON.stringify(that.data.upload_picture_list));
      }
    })
  },
  /*
   * 上传图片
   */
  uploadimage() {
    let page = this
    let upload_picture_list = page.data.upload_picture_list
    //循环把图片上传到服务器 并显示进度 
    for (let j in upload_picture_list) {
      if (upload_picture_list[j]['upload_percent'] == 0) {
        console.log("循环要上传的图片路径" + JSON.stringify(upload_picture_list[j].path))
        //上传图片后端地址
        upload_file_server('https://api.user.fitfix.shop//AppApiUser/Upload/UploadUserPic', page, upload_picture_list[j].path, j)
      }
    }
  },

  // 获取评论内容
  getSubmit: function(e) {
    this.setData({
      ['evaluateText']: e.detail.value
    });
  },
  // 提交评价判断
  submitEvaluate: function() {
    var that = this;
    var StarLevel = this.data.evaluateColor; //获取商品评分
    var CommentConent = this.data.evaluateText; //获取评价内容
    var storeLevel = this.data.storeColor; //描述评分
    console.log(storeColor);
    var logisticsLevel = this.data.logisticsColor; //物流评分
    if (StarLevel == 0) {
      wx.showToast({
        title: '请先为商品打分',
        icon: 'none',
        duration: 1000
      })
      return false;
    }
    if (CommentConent == '') {
      wx.showToast({
        title: '请您留下对商品的评价',
        icon: 'none',
        duration: 1000
      })
      return false;
    }
    if (storeLevel == 0 || logisticsLevel == 0) {
      wx.showToast({
        title: '请为店铺评分',
        icon: 'none',
        duration: 1000
      })
      return false;
    }
    this.submitInfo(StarLevel, CommentConent, storeLevel, logisticsLevel);
  },

  //提交方法
  submitInfo: function(StarLevel, CommentConent, storeLevel, logisticsLevel) {
    var that = this;
    var memberOrderID = that.data.memberOrderID;
    console.log(this.data.storeLevel);
    const UserID = wx.getStorageSync('UserID');
    wx.showLoading({
      title: '正在提交...',
    })
    var param = {
      UserID: UserID,
      MemberOrderID: memberOrderID,
      StarLevel: StarLevel,
      CommentConent: CommentConent,
      ContentImage: that.data.images.join(','),
      StoreScore: storeLevel,
      LogisticsScore: logisticsLevel,
      IsAnonymous: that.data.isAnonymous, //是否匿名评论,默认为false
    }
    console.log(JSON.stringify(param));
    util.ajaxRequest('/AppApiUser/Goods/GoodsCommentAdd', 'POST', param,
      function(res) {
        if (res.data.ERROR_CODE == "-1") {
          wx.showToast({
            title: '评价成功',
            icon: 'success',
            duration: 1000,
            complete: function() {
              wx.redirectTo({
                url: '../order/order?current=0'
              });
            }
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
          //没有更多了
          that.setData({
            loadingComplete: true
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
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.setData({
      memberOrderID: options.OrderID
    })
    this.GetOrderDetails(); //加载订单详情
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
/*
 * 上传方法
 */
function upload_file_server(url, that, upload_picture_list, j) {
  console.log("接收到的图片路径是" + upload_picture_list)
  //上传返回值
  const upload_task = wx.uploadFile({
    // 模拟https
    url: url, //需要用HTTPS，同时在微信公众平台后台添加服务器地址  
    filePath: upload_picture_list, //上传的文件本地地址    
    name: 'file',
    formData: {
      param: JSON.stringify({
        UserID: wx.getStorageSync('UserID'), //用户ID
      })
    },
    //附近数据，这里为路径     
    success: (res) => {
      console.log(res);
      var data = JSON.parse(res.data);
      console.log("上传图片的返回值是：" + JSON.stringify(data));
      var imgUrl = data.DATA.PictureUrl; //图片网络地址
      var imgs = that.data.images;
      imgs.push(imgUrl);
      that.setData({
        images: imgs
      })
    }
  })
}