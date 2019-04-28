/**
 * 接口地址
 */
var apiUrl = "https://api.user.fitfix.shop/";

var imgUrl = "https://image.fitfix.shop/";

/**
 * 判断是否登录
 */
function whetherLogin() {
  //从缓存中获取MemberID
  var userID = wx.getStorageSync('UserID');
  if (userID == "" || userID == null || userID == undefined) {
    return false;
  }
  return true;
}

/**
 * 异步调用接口
 */
function ajaxRequest(url, method, param, success, fail) {
  //从第三方平台自定义的数据字段获取商户ID
  if (wx.getExtConfig) {
    wx.getExtConfig({
      success: function(resExtConfig) {
        //调用接口
        wx.request({
          url: apiUrl + url, //开发者服务器接口地址
          method: method, //默认为 GET，有效值：OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT,必须大写
          data: {
            param: JSON.stringify(param) //接口参数
          },
          header: {
            'content-type': 'application/json'
          },
          success: function(res) {
            //收到开发者服务成功返回的回调函数，res = {data: '开发者服务器返回的内容'}
            success(res);
          },
          fail: function(res) {
            //接口调用失败的回调函数
            fail(res);
          }
        });
      },
      fail: function(res) {
        wx.showModal({
          title: '提示',
          content: '获取自定义数据失败，请退出小程序重试。'
        })
      }
    })
  } else {
    // 如果希望用户在最新版本的客户端上体验您的小程序，可以这样子提示
    wx.showModal({
      title: '提示',
      content: '当前微信版本过低，无法使用该功能，请升级到最新微信版本后重试。'
    })
  }
}

const formatTime = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}

const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : '0' + n
}


/**
 * 解析二维码参数
 */
let getQueryString = function (url, name) {
  console.log("url = " + url)
  console.log("name = " + name)
  var reg = new RegExp('(^|&|/?)' + name + '=([^&|/?]*)(&|/?|$)', 'i')
  var r = url.substr(1).match(reg)
  if (r != null) {
    console.log("r = " + r)
    console.log("r[2] = " + r[2])
    return r[2]
  }
  return null;
}

module.exports = {
  formatTime: formatTime,
  whetherLogin: whetherLogin,
  ajaxRequest: ajaxRequest,
  imgUrl: imgUrl,
  getQueryString: getQueryString,
  apiUrl: apiUrl
}