var cartObj = [{

}];
// 获取 letter
function letter() {
  var letterArrary = [];
  for (var i = 0; i < cartObj.length; i++) {
    letterArrary.push(cartObj[i].letter)
  }
  return letterArrary
}
module.exports = {
  letter: letter(),
  cartObj: cartObj
}