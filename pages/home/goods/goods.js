var util = require("../../../utils/util.js");
var wxParse = require('../../../wxParse/wxParse.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    layer: true, //规格选择弹窗
    GoodsData: null, //商品对象
    GoodsID: "", //商品ID
    GoodsTag: [], //商品标签
    GoodsSpec: null, //商品规格
    GoodsPrice: 0, //商品价格
    GoodsSpecPrice: 0, //商品选择规格后的价格
    Spec1: null, //规格组1
    Spec2: null, //规格组2
    Spec3: null, //规格组3
    Spec1Value: "", //规格值
    Spec2Value: "", //规格值
    Spec3Value: "", //规格值
    SpecJson: {}, //选择的规格
    GoodsNumber: 1, //商品数量
    GoodsImage: [], //商品图片
    GoodsImagePath: util.imgUrl, //商品图片域名
    buyCount: 1, //弹出层中的购买数量
    productImage: null, //加入购物车时显示的图片路径
    GoodsCommontList: null, //评论列表
    imgUrl: util.imgUrl, //图片路径
    PageSize: 3, //每页行数
    isImmediate: false, //是否立即购买
  },

  /**
   * 打开客服
   */
  bindServer: function() {
    if (util.whetherLogin()) {
      wx.navigateTo({
        url: '/pages/me/service/service',
      })
    } else {
      wx.navigateTo({
        url: '/pages/login/login/login',
      })
    }
  },


  /**
   * 打开车型选择
   */
  openSelectCar: function() {
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
   * 获取商品评论
   */
  bindGetGoodsCommontList: function() {
    var that = this;
    var param = {
      GoodsID: that.data.GoodsData.GoodsID, //商户ID
      PageNumber: 1, //页数
      PageSize: that.data.PageSize, //每页条数
    }
    util.ajaxRequest('/AppApiUser/Goods/GetGoodsCommontList', 'POST', param,
      function(res) {
        if (res.data.ERROR_CODE == "-1") {
          that.setData({
            GoodsCommontList: res.data.DATA
          });
        } else {
          wx.showToast({
            title: res.data.ERROR_MESSAGE,
            icon: 'error',
            duration: 1000
          })
        }
      });
  },

  /**
   * 获取更多评论
   */
  bindGetMoreCommont: function(e) {
    console.log(JSON.stringify(e));
    var goodsID = e.currentTarget.dataset.id
    wx.navigateTo({
      url: '../evaluate/evaluate?goodsID=' + goodsID,
    })
  },

  //加入购物车--确定
  AddShopCar: function() {
    var that = this;
    //如果商品有规格，则需判断是否选择规格
    if (that.data.GoodsData.IshaveSKU == true && (that.data.SpecJson == "" || that.data.SpecJson == undefined)) {
      wx.showToast({
        title: '请选择规格',
        icon: 'error',
        duration: 1000
      })
      return;
    }
    if (that.data.GoodsNumber <= 0) {
      wx.showToast({
        title: '请选择购买数量',
        icon: 'error',
        duration: 1000
      })
      return;
    }
    if (this.data.GoodsData.RestrictionVolume > 0 && that.data.GoodsNumber >= this.data.GoodsData.RestrictionVolume) {
      wx.showToast({
        title: '购买数量不能超过限购数量',
        icon: 'error',
        duration: 1000
      })
      return;
    }

    wx.showLoading({
      title: '正在加载...',
    })

    var param = {
      UserID: wx.getStorageSync('UserID'), //用户ID
      Specifications: that.data.SpecJson, //规格
      GoodsID: that.data.GoodsData.GoodsID, //商品ID
      Number: that.data.GoodsNumber, //
    }
    console.log("加入购物车参数" + JSON.stringify(param));
    util.ajaxRequest('/AppApiUser/ShopCar/ShopCarAdd', 'POST', param,
      function(res) {
        if (res.data.ERROR_CODE == "-1") {
          console.log("加入购物车返回值：" + JSON.stringify(res.data));
          if (that.data.isImmediate) {
            //获取购物车id并存储
            that.setData({
              SelectGoodsCarID: res.data.DATA
            })
            if (res.data.DATA == null) {
              //购物车
              wx.redirectTo({
                url: '../cart/cart'
              });
            } else {
              wx.navigateTo({
                url: '../../cart/submitOrder/submitOrder?SelectGoodsCarID=' + that.data.SelectGoodsCarID,
              })
            }
          } else {
            //获取购物车id并存储
            that.setData({
              SelectGoodsCarID: res.data.DATA
            })
            wx.showToast({
              title: '加入购物车成功',
              icon: 'success',
              duration: 1000
            });
            that.close();
          }
        } else {
          wx.showToast({
            title: '加入购物车失败！' + res.data.ERROR_MESSAGE,
            icon: 'error',
            duration: 1000
          })
        }
      });
  },
  //

  //商品数量加
  GoodsNumberAdd: function() {
    let GoodsNumber = this.data.GoodsNumber;
    if (this.data.GoodsData.RestrictionVolume > 0 && GoodsNumber >= this.data.GoodsData.RestrictionVolume) {
      wx.showToast({
        title: '已达限购数量',
        icon: 'none',
        duration: 1000
      })
      return;
    }
    this.setData({
      GoodsNumber: GoodsNumber + 1
    });
  },
  //商品数量减
  GoodsNumberReduction: function() {
    let GoodsNumber = this.data.GoodsNumber;
    if (GoodsNumber > 1) {
      this.setData({
        GoodsNumber: GoodsNumber - 1
      });
    }
  },
  /**
   * 选择规格
   */
  selectSpec: function(event) {
    let specname = event.currentTarget.dataset.specname;
    let index = event.currentTarget.dataset.specindex;
    let specvalue = event.currentTarget.dataset.specvalue;
    //将选择的规格存在规格对象中，通过此对象进行查询
    var SpecJson = this.data.SpecJson;
    console.log("选择的规格", SpecJson);
    if (this.data.Spec1 != null && this.data.Spec1.SpecName != "" && this.data.Spec1.SpecName != undefined) {
      if (SpecJson[this.data.Spec1.SpecName] == "" || SpecJson[this.data.Spec1.SpecName] == undefined) {
        SpecJson[this.data.Spec1.SpecName] = "";
      }
      console.log("进入规格组1")
    }
    if (this.data.Spec2 != null && this.data.Spec2.SpecName != "" && this.data.Spec2.SpecName != undefined) {
      if (SpecJson[this.data.Spec2.SpecName] == "" || SpecJson[this.data.Spec2.SpecName] == undefined) {
        SpecJson[this.data.Spec2.SpecName] = "";
      }
    }
    if (this.data.Spec3 != null && this.data.Spec3.SpecName != "" && this.data.Spec3.SpecName != undefined) {
      if (SpecJson[this.data.Spec3.SpecName] == "" || SpecJson[this.data.Spec3.SpecName] == undefined) {
        SpecJson[this.data.Spec3.SpecName] = "";
      }
    }
    if (index == 1) {
      this.setData({
        Spec1Value: specvalue
      });
    }
    if (index == 2) {
      this.setData({
        Spec2Value: specvalue
      });
    }
    if (index == 3) {
      this.setData({
        Spec3Value: specvalue
      });
    }
    SpecJson[specname] = specvalue;
    this.setData({
      SpecJson: SpecJson
    });
    console.log("选择后的规格", SpecJson);
    //刷新价格
    this.BindSpecPrice();
  },
  //刷新价格
  BindSpecPrice: function() {
    let that = this;
    console.log("选择的规格", that.data.SpecJson);
    if (that.data.SpecJson == undefined) {
      console.log("没选择的规格", that.data.GoodsSpec[0]);
      var GoodsSpecModel = that.data.GoodsSpec[0];
      console.log("默认规格", GoodsSpecModel);
      if (GoodsSpecModel != null && GoodsSpecModel.Price > 0) {

        var SpecJson = JSON.parse(GoodsSpecModel.Specs);
        that.setData({
          SpecJson: SpecJson, //设置默认的规格
          GoodsPrice: GoodsSpecModel.Price,
          GoodsSpecPrice: GoodsSpecModel.Price,
        }); //商品价格
        //设置规格值的默认选择
        if (this.data.Spec1 != null && this.data.Spec1.SpecName != "" && this.data.Spec1.SpecName != undefined) {
          this.setData({
            Spec1Value: SpecJson[this.data.Spec1.SpecName]
          });
        }
        if (this.data.Spec2 != null && this.data.Spec2.SpecName != "" && this.data.Spec2.SpecName != undefined) {
          this.setData({
            Spec2Value: SpecJson[this.data.Spec2.SpecName]
          });
        }
        if (this.data.Spec3 != null && this.data.Spec3.SpecName != "" && this.data.Spec3.SpecName != undefined) {
          this.setData({
            Spec3Value: SpecJson[this.data.Spec3.SpecName]
          });
        }


      } else {
        if (that.data.GoodsData != null) {
          that.setData({
            GoodsPrice: that.data.GoodsData.GoodsPrice,
            GoodsSpecPrice: that.data.GoodsData.GoodsPrice,
          });
        }
      }
    } else {
      console.log("没选择规格");
      var GoodsSpec = that.data.GoodsSpec;
      console.log("规格组", GoodsSpec)
      if (GoodsSpec.length > 0) {
        if (that.data.SpecJson.length > 0) {
          for (let i = 0; i < GoodsSpec.length; ++i) {
            console.log("当前规格", GoodsSpec[i].Specs)
            if (JSON.stringify(that.data.SpecJson) == GoodsSpec[i].Specs) {
              this.setData({

                GoodsSpecPrice: GoodsSpec[i].Price
              }); //商品规格价格
            }
          }
        } else {
          var GoodsSpecModel = that.data.GoodsSpec[0];
          if (GoodsSpecModel != null && GoodsSpecModel.Price > 0) {
            var SpecJson = JSON.parse(GoodsSpecModel.Specs);
            console.log("选中的规格", SpecJson);
            console.log("选中的规格", SpecJson.length);

            if (SpecJson[that.data.Spec1.SpecName] != "" && SpecJson[that.data.Spec1.SpecName] != undefined) {
              this.setData({
                Spec1Value: SpecJson[that.data.Spec1.SpecName]
              });
            }

            if (SpecJson[that.data.Spec2.SpecName] != "" && SpecJson[that.data.Spec2.SpecName] != undefined) {
              this.setData({
                Spec2Value: SpecJson[that.data.Spec2.SpecName]
              });
            }
            if (SpecJson[that.data.Spec3.SpecName] != "" && SpecJson[that.data.Spec3.SpecName] != undefined) {
              this.setData({
                Spec3Value: SpecJson[that.data.Spec3.SpecName]
              });
            }
            console.log("规格名称1" + that.data.Spec1.SpecName);
            console.log("规格名称2" + that.data.Spec2.SpecName);
            console.log("规格名称3" + that.data.Spec3.SpecName);
            this.setData({
              SpecJson: SpecJson, //设置默认的规格
              GoodsPrice: GoodsSpec[0].Price,
              GoodsSpecPrice: GoodsSpec[0].Price
            }); //商品规格价格
          }
        }
      } else {
        console.log("进入商品价格设置")
        if (that.data.GoodsData != null) {
          that.setData({
            GoodsPrice: that.data.GoodsData.GoodsPrice,
            GoodsSpecPrice: that.data.GoodsData.GoodsPrice,
          });
        }
      }
    }

  },

  /**
   * 关闭弹出层
   */
  close: function() {
    this.setData({
      layer: true
    })
  },


  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    if (options != null) {
      this.setData({
        GoodsID: options.GoodsID
      }); //商品ID
    }
    this.bindGoods(); //加载商品信息
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {
    this.bindGoods(); //加载商品信息
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
    this.bindGoods(); //加载商品信息
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

  },

  //跳转至购物车
  bindSelectCar() {
    //购物车
    wx.navigateTo({
      url: '../cart/cart'
    });
  },


  /**
   * 加入购物车
   */
  open: function() {
    if (util.whetherLogin()) {
      this.setData({
        layer: false,
        isImmediate: false
      })
    } else {
      wx.navigateTo({
        url: '../../login/login/login',
      })
    }
  },


  /**
   * 立即购买
   */
  bindImmediatePurchase: function(e) {
    if (util.whetherLogin()) {
      this.setData({
        layer: false,
        isImmediate: true
      })
    } else {
      wx.navigateTo({
        url: '../../login/login/login',
      })
    }
  },

  /**
   * 获取商品对象
   */
  bindGoods: function() {
    var that = this;
    wx.showLoading({
      title: '正在加载...',
    })
    var param = {
      GoodsID: that.data.GoodsID,
    }
    util.ajaxRequest('/AppApiUser/Goods/GoodsEdit', 'POST', param,
      function(res) {
        if (res.data.ERROR_CODE == "-1") {
          console.log("获取商品的返回值是：" + JSON.stringify(res.data))
          that.setData({
            GoodsData: res.data.DATA,
            GoodsSpec: res.data.DATA.GoodsSpecificationsItem,
            Spec1: JSON.parse(res.data.DATA.Spec1),
            Spec2: JSON.parse(res.data.DATA.Spec2),
            Spec3: JSON.parse(res.data.DATA.Spec3),
          });

          console.log("规格", that.data.Spec1);
          that.bindGetGoodsCommontList(); //加载商品评论信息
          //详情图文
          if (that.data.GoodsData.GoodsContent != "") {
            wxParse.wxParse('dkcontent', 'html', that.data.GoodsData.GoodsContent, that, 15);
          }
          //商品图片
          if (res.data.DATA.GoodsImage != "" && res.data.DATA.GoodsImage != undefined) {
            var goodsImage = res.data.DATA.GoodsImage.split(",");
            //设置商品图片对象
            that.setData({
              GoodsImage: goodsImage, //商品图片
              productImage: goodsImage[0]
            });
          }

          //整理商品标签
          if (res.data.GoodsTag != "" && res.data.GoodsTag != null) {
            var GoodsTag = res.data.GoodsTag.split(',');
            that.setData({
              GoodsTag: GoodsTag,
            });
          }
          //显示价格
          that.BindSpecPrice();

          //隐藏-加载中
          wx.hideLoading();
          //停止当前页面下拉刷新
          wx.stopPullDownRefresh();
          //隐藏-加载中
          wx.hideNavigationBarLoading();
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
  }
})