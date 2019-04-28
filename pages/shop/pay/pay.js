// pages/shop/pay/pay.js
var util = require("../../../utils/util.js");
var timer = null; //定时器
Page({

  /**
   * 页面的初始数据
   */
  data: {
    store: null, //门店信息存储
    code: null, //微信code存储
    options: '', //二维码中携带的storeID
    checkInfo: {}, //买单信息
    loading: '', //等待显示后面效果
    isOrder: false, //是否提交订单
    isPay: true, //支付模块是否显示
    count: 0, //计数器
    loadNum: 0, //控制效果显示
    moneyNum: 120, //支付金额
    GoodsCount: 1, //购买数量
    minusStatus: 'disabled', // 使用data数据对象设置样式名  
    endDisplay: false, //控制超时信息显示
    MinPayAmount: null, //买单的最小金额
    text: 0,
    typeArray: [
      ["14寸", "15寸", "16寸", "17寸", "18寸", "19寸", "20寸"],
      [
        ["175/70R14", "185/65R14", "195/60R14"],
        ["185/60R15", "185/65R15", "195/55R15", "195/60R15", "195/65R15", "215/65R15"],
        ["195/60R16", "205/50R16", "205/55R16", "205/60R16", "205/65R16", "215/55R16", "215/60R16", "215/65R16", "225/55R16", "225/60R16"],
        ["205/50R17", "215/45R17", "215/50R17", "215/55R17", "215/60R17", "225/45R17", "225/50R17", "225/55R17", "225/60R17", "225/65R17", "235/45R17", "235/50R17", "235/55R17", "235/65R17", "245/45R17", "245/65R17", "255/45R17", "265/65R17"],
        ["225/45R18", "225/60R18", "235/40R18", "235/45R18", "235/50R18", "235/55R18", "235/60R18", "245/40R18", "245/45R18", "245/50R18", "245/60R18", "255/40R18", "255/45R18", "255/55R18", "265/60R18"],
        ["235/50R19", "235/55R19", "245/40R19", "245/45R19", "245/55R19", "255/40R19", "255/45R19", "255/50R19", "255/55R19", "275/35R19", "275/40R19"],
        ["245/40R20", "255/45R20", "255/50R20", "255/55R20", "275/40R20"]
      ]
    ],
    multiArray: [
      ["14寸", "15寸", "16寸", "17寸", "18寸", "19寸", "20寸"],
      ["175/70R14", "185/65R14", "195/60R14"]
    ], // 三维数组数据
    size: null, //页面显示的尺寸
    multiIndex: [0, 0], // 默认的下标
    step: 0, // 默认显示请选择
    typeString: null, //轮胎型号字符串
    remarks: '', //备注

    //textarea穿透问题
    onFocus: false, //textarea焦点是否选中
    isShowText: false, //控制显示 textarea 还是 text

    labels: [{
        name: "换胎",
        isCheck: false
      },
      {
        name: "保养",
        isCheck: false
      },
      {
        name: "装潢",
        isCheck: false
      },
      {
        name: "维修",
        isCheck: false
      },
      {
        name: "其他",
        isCheck: false
      },
    ], //标签
    label: '', //选中的标签
    labelIndex: null, //选中的标签的下标
    labelText: '其他', //标签选中时显示为其他
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.setData({
      options: options
    });
  },

  /**
   * 选择标签
   */
  selectLabel: function(e) {
    var index = e.currentTarget.dataset.index;
    var labels = this.data.labels;
    for (var i = 0; i < labels.length; i++) {
      if (i == index) {
        labels[i].isCheck = !this.data.labels[index].isCheck
      } else {
        labels[i].isCheck = false;
      }
    }
    this.setData({
      labels: labels
    })
    if (this.data.labels[index].isCheck) {
      this.setData({
        label: this.data.labels[index].name,
      })
    } else {
      this.setData({
        label: '',
      })
    }
  },

  /* 点击减号 */
  bindMinus: function() {
    var num = this.data.GoodsCount;
    // 如果大于1时，才可以减  
    if (num > 1) {
      num--;
    }
    // 只有大于一件的时候，才能normal状态，否则disable状态  
    var minusStatus = num <= 1 ? 'disabled' : 'normal';
    // 将数值与状态写回  
    this.setData({
      GoodsCount: num,
      minusStatus: minusStatus
    });
  },
  /* 点击加号 */
  bindPlus: function() {
    var num = this.data.GoodsCount;
    // 不作过多考虑自增1  
    num++;
    // 只有大于一件的时候，才能normal状态，否则disable状态  
    var minusStatus = num < 1 ? 'disabled' : 'normal';
    // 将数值与状态写回  
    this.setData({
      GoodsCount: num,
      minusStatus: minusStatus
    });
  },
  /* 输入框事件 */
  bindManual: function(e) {
    var num = e.detail.value;
    // 将数值与状态写回  
    this.setData({
      GoodsCount: num
    });
  },

  /**
   * 获取店铺介绍并将内容保存在remark中
   */
  bindIntroduceStoreInfo: function(e) {
    var that = this;
    // 获取输入框的内容
    var value = e.detail.value;
    // 获取输入框内容的长度
    var len = parseInt(value.length);
    that.setData({
      remarks: value,
      isShowText: false,
      onFacus: true
    });
  },


  /**
   * 显示文本框textarea
   */
  onShowTextare: function(e) {
    this.setData({
      isShowText: false,
      onFacus: false
    })
  },

  /**
   * 显示text
   */
  onShowText: function() {
    this.setData({
      isShowText: true,
      onFacus: true
    })
  },


  /*
   * 获取轮胎型号
   */
  bindMultiPickerChange: function(e) {
    var index1 = e.detail.value[0];
    var index2 = e.detail.value[1];
    if (this.data.multiArray[1][index2] == null || this.data.multiArray[1][index2] == undefined || this.data.multiArray[1][index2] == "") {
      this.setData({
        multiIndex: e.detail.value,
        size: this.data.multiArray[0][index1],
      })
    } else {
      this.setData({
        multiIndex: e.detail.value,
        size: this.data.multiArray[0][index1],
        typeString: this.data.multiArray[1][index2]
      })
    }
  },

  /**
   * 选择轮胎型号，列改变的时候
   */
  bindMultiPickerColumnChange: function(e) {
    var that = this;
    var data = {
      multiArray: this.data.multiArray,
      multiIndex: this.data.multiIndex,
    };
    data.multiIndex[e.detail.column] = e.detail.value;
    switch (e.detail.column) {
      case 0:
        switch (data.multiIndex[0]) {
          case 0:
            data.multiArray[1] = that.data.typeArray[1][0];
            break;
          case 1:
            data.multiArray[1] = that.data.typeArray[1][1];
            break;
          case 2:
            data.multiArray[1] = that.data.typeArray[1][2];
            break;
          case 3:
            data.multiArray[1] = that.data.typeArray[1][3];
            break;
          case 4:
            data.multiArray[1] = that.data.typeArray[1][4];
            break;
          case 5:
            data.multiArray[1] = that.data.typeArray[1][5];
            break;
          case 6:
            data.multiArray[1] = that.data.typeArray[1][6];
            break;
          case 7:
            data.multiArray[1] = that.data.typeArray[1][7];
            break;
        }
        data.multiIndex[1] = 0;
        break;
    }
    this.setData(data);
    if (that.data.multiArray[1][data.multiIndex[e.detail.column]] == null || that.data.multiArray[1][data.multiIndex[e.detail.column]] == undefined || that.data.multiArray[1][data.multiIndex[e.detail.column]] == "") {
      this.setData({
        typeString: '',
        size: that.data.multiArray[0][data.multiIndex[0]]
      })
    } else {
      this.setData({
        typeString: that.data.multiArray[1][data.multiIndex[e.detail.column]],
        size: that.data.multiArray[0][data.multiIndex[0]]
      })
    }
  },


  /**
   * 获取最小付款金额
   */
  GetMinPayAmount: function() {
    let that = this;
    var param = {
      Name: 'MinPayAmount',
    }
    util.ajaxRequest('/AppApiUser/MemberOrder/GetSystemConfig', 'POST', param,
      function(res) {
        if (res.data.ERROR_CODE == -1) {
          //隐藏-加载中
          that.setData({
            MinPayAmount: res.data.DATA
          }); //订单信息
        }
      });
  },

  /**
   * 获取openID
   */
  getOpenId: function() {
    var that = this;
    // 获取openID
    wx.login({
      //获取code
      success: function(res) {
        var code = res.code; //返回code
        that.setData({
          code: res.code
        });
      }
    })
  },

  /**
   * 确认买单
   */
  submitCheck: function() {
    var that = this;
    //获取code
    this.getOpenId();
    var minPayAmount = that.data.MinPayAmount; //接口获取的最小支付金额
    var amount = that.data.checkInfo.amount; //支付金额
    var typeString = that.data.size + that.data.typeString; //轮胎型号字符串
    var remarks = that.data.remarks; //备注
    if (amount == '' || amount == null || amount == undefined) {
      wx.showToast({
        title: '买单金额不能为空',
        icon: 'none',
        duration: 1000
      })
      return false;
    }
    if (amount < minPayAmount) {
      wx.showToast({
        title: '支付金额不能小于' + minPayAmount,
        icon: 'none',
        duration: 1000
      })
      return false;
    }

    if (typeString == '' || typeString == null || typeString == undefined) {
      wx.showToast({
        title: '未选择轮胎型号',
        icon: 'none',
        duration: 1000
      })
      return false;
    }

    var url = '/AppApiUser/Payment/MemberPayingOrder';
    wx.showLoading({
      title: '正在支付...',
    })
    var param = {
      UserID: wx.getStorageSync("UserID"), //用户id
      StoreID: that.data.store.StoreID, //门店id
      Amount: that.data.checkInfo.amount, //买单金额
      code: that.data.code, //微信code
      GoodsSpac: typeString, //轮胎尺寸
      Remarks: that.data.remarks, //备注
      GoodsCount: that.data.GoodsCount, //购买数量
      PayingOrderLable: that.data.label, //标签
    }
    // console.log("买单传递的参数是：" + JSON.stringify(param));
    util.ajaxRequest(url, 'POST', param,
      function(res) {
        console.log(JSON.stringify(res.data));
        if (res.data.ERROR_CODE == "-1") {
          console.log("买单接口返回值" + JSON.stringify(res.data))
          wx.requestPayment({
            'timeStamp': res.data.DATA.timeStamp.toString(),
            'nonceStr': res.data.DATA.nonceStr,
            'package': res.data.DATA.package,
            'signType': 'RSA',
            'paySign': res.data.DATA.paySign,
            'success': function(res) {
              wx.showToast({
                title: '付款成功',
                icon: 'success',
                duration: 3000,
                complete: function() {
                  wx.redirectTo({
                    url: '../shopDetails/shopDetails?StoreID=' + that.data.store.StoreID + '&',
                  })
                }
              });
            },
            'fail': function(res) {
              wx.showToast({
                title: '取消付款',
                icon: 'none',
                duration: 3000
              });
              return;
            },
            'complete': function(res) {

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
            content: res.data.DATA
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

    var loadNum = that.data.loadNum;
    var i = setInterval(function() {
      loadNum++;
      if (loadNum == 1) {
        that.setData({
          loading: '。'
        })
      }
      if (loadNum == 2) {
        that.setData({
          loading: '。。'
        })
      }
      if (loadNum == 3) {
        that.setData({
          loading: '。。。'
        })
      }
      if (loadNum > 3) {
        loadNum = 0;
      }
      if (loadNum == 0) {
        that.setData({
          loading: ''
        })
      }
    }, 750)
  },

  /**
   * 查询订单状态
   */
  checkOrder: function() {
    var that = this;
    var url = '/AppApiUser/Payment/EnquiryPayingOrder';
    wx.showLoading({
      title: '正在加载...',
    })
    var param = {
      OrderNo: '919030116480652037004',
    }
    // console.log("传递的参数是：" + JSON.stringify(param));
    util.ajaxRequest(url, 'POST', param,
      function(res) {
        if (res.data.ERROR_CODE == "-1") {
          // console.log("获取门店详情的返回值是：" + JSON.stringify(res.data))
          if (res.data.payState == 3) {
            wx.showToast({
              title: '支付成功，页面跳转',
            })
            wx.navigateBack()
          } else {
            that.bindTimerQuery();
          }
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
   * 门店详情
   */
  bindGetShopDetail: function() {
    var that = this;
    var url = '/AppApiUser/Stores/StoreDetail';
    wx.showLoading({
      title: '正在加载...',
    })
    var param = {
      StoreID: that.data.options.actId,
      Latitude: wx.getStorageSync("latitude"), //经度
      Longitude: wx.getStorageSync("longitude"), //纬度
    }
    // console.log("传递的参数是：" + JSON.stringify(param));
    util.ajaxRequest(url, 'POST', param,
      function(res) {
        if (res.data.ERROR_CODE == "-1") {
          // console.log("获取门店详情的返回值是：" + JSON.stringify(res.data))
          var data = res.data.DATA;
          if (JSON.stringify(data) === '[]') {
            data = null;
          }
          that.setData({
            store: data,
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
   * 获取消费金额
   */
  bindGetAmount: function(e) {
    var text = this.checkInputText(e.detail.value);
    this.setData({
      ["checkInfo.amount"]: text
    });

    // this.GetMinPayAmount();
  },
  //检查输入文本，限制只能为数字并且数字最多带2位小数
    checkInputText:   function(text) {
    var reg = /^(\.*)(\d+)(\.?)(\d{0,2}).*$/g;   
    if  (reg.test(text))  {  //正则匹配通过，提取有效文本
            
      text  =  text.replace(reg,  '$2$3$4');    
    }    
    else  {  //正则匹配不通过，直接清空
            
      text  =  '';    
    }    
    return  text;  //返回符合要求的文本（为数字且最多有带2位小数）
      
  },
  /**
   * 定时器
   */
  bindTimerQuery: function() {
    var that = this;
    timer = setInterval(function() {
      that.setData({
        endDisplay: true
      })
    }, 120000)
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {
    // this.bindTimerQuery(); //每5秒查询一次
    this.bindGetShopDetail();
    this.getOpenId();
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