// pages/home/index/index.js
var util = require("../../../utils/util.js");
var bmap = require('../../../utils/bmap-wx.min.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    statusBarHeight: wx.getStorageSync('statusBarHeight'),
    titleBarHeight: wx.getStorageSync('titleBarHeight'),
    isNewCustomer: false, //新客有礼弹出层
    guestCeremony: null, //新客有礼礼券数据
    carName: null, //车型名称
    cityName: null, //默认位置
    fittingTire: null, //适配轮胎列表
    recommendedTire: null, //推荐轮胎列表
    loadCompleted: false, //加载完成
    pageNumber: 1, //当前页码
    pageSize: 10, //当前页数量
    searchKey: '', //搜索关键字
    toItem: '', //滚动位置
    noMoreShow: false, //显示没有更多推荐轮胎
  },

  /*
   * 锚点滚动执行
   */
  jumpTo(e) {
    let target = e.currentTarget.dataset.opt;
    this.setData({
      toItem: target
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */

  onLoad: function(options) {
    var that = this;
    if (wx.getStorageSync("cityInfo") == '') {
      this.village_LBS();
    } else {
      this.setData({
        cityName: wx.getStorageSync("cityInfo")[0]
      })
    }
    if (options.q) {
      let q = decodeURIComponent(options.q);
      var AgentCode = util.getQueryString(q, 'AgentCode');
      wx.setStorageSync('AgentCode', AgentCode)
      this.setData({
        ["register.inviteCode"]: AgentCode
      });
    } else {
      this.setData({
        ["register.inviteCode"]: ''
      });
    }
    //获取推荐轮胎
    this.getRecommendedTire();
    //获取新手红包
    this.isNewCustomer();
  },

  /**
   * 滚动到锚点位置
   */
  scrollToViewFn(e) {
    this.setData({
      toView: 'inToViewShop'
    });
  },

  /**
   * 获取搜索关键字
   */
  getSearchKey: function(e) {
    this.setData({
      searchKey: e.detail.value
    })
  },

  /**
   * 跳转到搜索结果页面
   */
  searchResult: function() {
    var searchKey = this.data.searchKey;
    wx.navigateTo({
      url: '../productList/productList?searchKey=' + searchKey,
    })
  },


  /*
   * 打开商城
   */
  openShop: function() {
    wx.switchTab({
      url: '../../classify/index/index',
    })
  },
  /**
   * 打开门店
   */
  bindStoreSys: function() {
    wx.navigateToMiniProgram({
      appId: 'wxce5bc16545128121', // 要跳转的小程序的appid
      path: 'pages/login/login/login', // 跳转的目标页面
      extarData: {

      },
      success(res) {
        // 打开成功  
      }
    })
  },
  /*
   * 打开积分商城
   */
  openExchange: function() {
    wx.navigateTo({
      url: '../../me/integralList/integralList',
    })
  },
  /**
   * 打开工人端
   */
  bindWorkerSys: function() {
    wx.navigateToMiniProgram({
      appId: 'wxb1a138c89c8fbbc2', // 要跳转的小程序的appid
      path: 'pages/login/login/login', // 跳转的目标页面
      extarData: {

      },
      success(res) {
        // 打开成功  
      }
    })
  },

  /**
   * 打开推客端
   */
  bindSpreadSys: function() {
    wx.navigateToMiniProgram({
      appId: 'wxccbf5f0d98de9697', // 要跳转的小程序的appid
      path: 'pages/login/login/login', // 跳转的目标页面
      extarData: {

      },
      success(res) {
        // 打开成功  
      }
    })
  },
  /*
   * 打开领券弹层
   */
  openNewView: function() {
    this.setData({
      isNewCustomer: true
    })
  },
  /**
   * 地址定位授权
   */
  village_LBS: function() {
    var that = this;
    wx.getSetting({
      success: (res) => {
        //非初始化进入该页面
        if (res.authSetting['scope.userLocation'] != undefined && res.authSetting['scope.userLocation'] != true) {
          wx.showModal({
            title: '是否授权当前位置',
            content: '飞雳士需要获取您的地理位置，请确认授权，否则地图功能将无法使用',
            success: function(res) {
              if (res.cancel) {
                //再次授权，调用getLocationt的API
                that.getLoacation();
              } else if (res.confirm) {
                wx.openSetting({
                  success: function(data) {
                    if (data.authSetting["scope.userLocation"] == true) {
                      wx.showToast({
                        title: '授权成功',
                        icon: 'success',
                        duration: 1000,
                        complete: function() {
                          //再次授权，调用getLocationt的API
                          that.getLoacation();
                        }
                      })
                    } else {
                      wx.showToast({
                        title: '授权失败',
                        icon: 'success',
                        duration: 3000
                      })
                    }
                  }
                })
              }
            }
          })
        } else { //初始化进入
          that.getLoacation();
        }
      }
    })
  },

  /**
   * 打开产品详情
   */
  openGoodsDetail: function(e) {
    var goodsID = e.currentTarget.dataset.goodsid
    wx.navigateTo({
      url: '../goods/goods?GoodsID=' + goodsID,
    })
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
        wx.setStorageSync("latitude", res.latitude);
        wx.setStorageSync("longitude", res.longitude);
        BMap.regeocoding({
          success: function(res) {
            that.setData({
              loactionString: res.originalData.result.addressComponent,
              city: res.originalData.result.addressComponent.city
            })
            that.getCityInfo();
          },
          fail: function() {
            wx.showToast({
              title: '请检查位置服务是否开启',
              icon: 'none',
            })
          },
        });
      },
      fail: function() {
        wx.showToast({
          title: '请检查位置服务是否开启',
          icon: 'none',
        })
      }
    })

  },


  /**
   * 获取区县信息及城市id
   */
  getCityInfo: function() {
    var that = this;
    wx.showLoading({
      title: '正在加载...',
    })
    var param = {
      RegionName: this.data.city
    }
    util.ajaxRequest('/AppApiUser/BrandSpecification/CitySearch', 'POST', param,
      function(res) {
        if (res.data.ERROR_CODE == "-1") {
          wx.removeStorageSync('cityInfo');
          wx.setStorageSync('cityInfo', res.data.DATA);
          that.setData({
            cityName: res.data.DATA[0]
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
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {
    var that = this;
    that.setData({
      loadCompleted: true
    });
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
    if (util.whetherLogin()) {
      this.bindGetMyCar();
      //获取适配轮胎
      this.getFittingTire();
    } else {
      this.setData({
        carName: null
      })
      wx.setStorageSync("carName", null)
    }
    if (wx.getStorageSync("cityInfo")[0]) {
      this.setData({
        cityName: wx.getStorageSync("cityInfo")[0]
      })
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
    wx.stopPullDownRefresh();
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {
    if (this.data.AllPageNumber >= this.data.pageNumber) {
      this.getRecommendedTire();
      this.setData({
        pageNumber: this.data.pageNumber + 1
      })
    } else {
      this.setData({
        noMoreShow: true
      })
    }
  },
  /*
   * scroll-view触底事件
   */
  loadMore: function() {
    console.log('aaa');
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  },

  /**
   * 打开选择地址页面
   */
  bindSwitchCity: function() {
    wx.navigateTo({
      url: '../switchcity/switchcity',
    })
  },

  /**
   * 打开商品详情
   */
  bindGoodsDetail: function() {
    wx.navigateTo({
      url: '../goods/goods',
    })
  },

  /**
   * 添加爱车
   */
  addCarType: function() {
    if (util.whetherLogin()) {
      wx.navigateTo({
        url: '../selectCart/selectCart'
      })
    } else {
      wx.navigateTo({
        url: '../../login/login/login',
      })
    }
  },

  /**
   * 判断是否是新客户
   */
  isNewCustomer: function() {
    if (util.whetherLogin()) {
      this.bindNewGuestCeremony();
    } else {
      this.setData({
        isNewCustomer: true
      });
      this.bindNewGuestCeremony();
    }
  },

  /**
   * 打开车型管理
   */
  openCarModel: function() {
    if (util.whetherLogin()) {
      wx.navigateTo({
        url: '../model/model',
      })
    } else {
      wx.navigateTo({
        url: '../../login/login/login',
      })
    }
  },

  /**
   * 新客有礼
   */
  bindNewGuestCeremony: function() {
    var that = this;
    var userID = wx.getStorageSync("UserID");
    if (userID == undefined || userID == '' || userID == null) {
      userID = '';
    }
    wx.showLoading({
      title: '加载中...',
    })
    var param = {
      UserID: userID
    }
    util.ajaxRequest('/AppApiUser/NewMemberRecruitmentActivities/SNewMemberRecruitmentActivitiesList', 'POST', param,
      function(res) {
        if (res.data.ERROR_CODE == "-1") {
          // 判断是否有数据，有数据再判断是否已领取，未领取则显示弹出层，已领取则不显示
          if (res.data.DATA.data != null && res.data.DATA.dataCoupon != null) {
            if (res.data.DATA.data.isReceive) {
              that.setData({
                guestCeremony: res.data.DATA,
                isNewCustomer: false
              });
            } else {
              that.setData({
                guestCeremony: res.data.DATA,
                isNewCustomer: true
              });
            }
          } else {
            that.setData({
              guestCeremony: res.data.DATA,
              isNewCustomer: false
            });
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
      })
  },

  /**
   * 领取优惠券
   */
  collectImmediately: function(e) {
    var that = this;
    var userID = wx.getStorageSync("UserID");
    if (userID == '' || userID == null || userID == undefined) {
      wx.navigateTo({
        url: '../../login/login/login',
        success: function(res) {},
        fail: function(res) {},
        complete: function(res) {},
      })
    } else {
      wx.showLoading({
        title: '正在加载...',
      })
      var param = {
        UserID: userID,
        NewMemberRecruitmentActivityID: e.currentTarget.dataset.id
      }
      util.ajaxRequest('/AppApiUser/NewMemberRecruitmentActivities/UserCouponReceive', 'POST', param,
        function(res) {
          if (res.data.ERROR_CODE == "-1") {
            wx.showToast({
              title: '领取成功',
              icon: 'none',
              duration: 1000,
              complete: function() {
                that.setData({
                  isNewCustomer: false
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
            that.setData({
              isNewCustomer: false
            });
            //隐藏-加载中
            wx.hideLoading();
            //停止当前页面下拉刷新
            wx.stopPullDownRefresh();
            //隐藏-加载中
            wx.hideNavigationBarLoading();
          }
        })
    }
  },

  /**
   * 关闭新客有礼弹出层
   */
  closeCustomer: function() {
    this.setData({
      isNewCustomer: false
    });
  },

  /**
   * 品牌故事
   */
  bindOpenBrandStory: function() {
    wx.navigateTo({
      url: '../brandStory/brandStory',
    })
  },

  /**
   * 获取热门车型
   */
  bindGetMyCar: function() {
    var that = this;
    // wx.showLoading({
    //   title: '正在加载...',
    // })
    var param = {
      UserID: wx.getStorageSync("UserID")
    }
    util.ajaxRequest('/AppApiUser/Account_Users/GetMyCar', 'POST', param,
      function(res) {
        if (res.data.ERROR_CODE == "-1") {
          that.setData({
            carName: res.data.DATA
          });

          wx.removeStorageSync("carName");
          wx.setStorageSync("carName", res.data.DATA)

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
   * 适配轮胎列表
   */
  getFittingTire: function(e) {
    var that = this;
    var userID = wx.getStorageSync("UserID");
    // wx.showLoading({
    //   title: '正在加载...',
    // })
    var param = {
      UserID: userID,
    }
    util.ajaxRequest('/AppApiUser/Goods/GetGoodsInformationList', 'POST', param,
      function(res) {
        if (res.data.ERROR_CODE == "-1") {
          that.setData({
            fittingTire: res.data.DATA
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
      })
  },

  /**
   * 推荐轮胎列表
   */
  getRecommendedTire: function(e) {
    var that = this;
    // wx.showLoading({
    //   title: '正在加载...',
    // })
    var param = {
      IsRecommend: 1,
      PageNumber: that.data.pageNumber,
      PageSize: that.data.pageSize
    }
    util.ajaxRequest('/AppApiUser/Goods/GoodsList', 'POST', param,
      function(res) {
        if (res.data.ERROR_CODE == "-1") {

          if (that.data.pageNumber == 1) {
            that.setData({
              recommendedTire: res.data.DATA.data,
              AllPageNumber: res.data.DATA.pagecount,
            });
          } else {
            that.setData({
              recommendedTire: that.data.recommendedTire.concat(res.data.DATA.data),
              AllPageNumber: res.data.DATA.pagecount,
            });
          }

          //隐藏-加载中l9
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
      })
  },

  /**
   * 全部轮胎
   */
  bindMoreTire: function() {
    wx.navigateTo({
      url: '../productList/productList'
    })
  }
})