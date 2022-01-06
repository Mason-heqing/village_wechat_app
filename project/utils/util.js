const formatTime = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  return [year, month, day].map(formatNumber).join('-') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}

const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : '0' + n
}


//随机值
const requestId = function requestId() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
    var r = Math.random() * 16 | 0,
      v = c == 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);

  });
}

//时间戳
const timeStamp = Date.parse(new Date())

//头部信息
// const  header = {
//   "wxAppId":wx.getAccountInfoSync().miniProgram.appId,
//   'content-type': 'application/json', // 默认值
//   "type": 2,
//   "requestId": requestId(),
//   "timestamp": timeStamp,
//   "market": 'Applet',
//   "version": 'none'
// }
const header = (value)=>{
  let headerJson = {};
  headerJson.wxAppId = wx.getAccountInfoSync().miniProgram.appId;
  headerJson.contentType = 'application/json';
  headerJson.token = value;
  headerJson.type = 2;
  headerJson.requestId = requestId();
  headerJson.timestamp = timeStamp;
  headerJson.market = 'Applet';
  headerJson.version = version;
  return headerJson;
}
//未登录
const notLogin = (value)=>{
  wx.showToast({
    title: '未登录',
    icon: 'none',
    duration: 2000
  })
  if (!value) {
    setTimeout(() => {
      wx.reLaunch({
        url: '../login/login',
      })
    }, 2000)
  }
}

//token值过期,重新登录
const verdueToken = ()=>{
  setTimeout(() => {
    wx.reLaunch({
      url: '../login/login',
    })
  }, 2000)
}

//版本号
const version = '13';


//请求地址
// const dataUrl = "http://192.168.1.227:9009/";
// const md5Key = "E000E465DBDE0E9A67F1D33CD968419A";
// const imgShow = "http://192.168.1.227:9009/file/download?path="
// const dataUrl = "http://192.168.1.27:9009/";

//测试环境
// const dataUrl = "https://pre.qy-rgs.com:9009/";
// const md5Key = "E000E465DBDE0E9A67F1D33CD968419A";
// const imgShow = "https://pre.qy-rgs.com:9009/file/download?path="

// const dataUrl = "https://prewx.qy-rgs.com/";
// const md5Key = "E000E465DBDE0E9A67F1D33CD968419A";
// const imgShow = "https://prewx.qy-rgs.com/file/download?path="

//线上环境
const dataUrl = "https://scenario.qy-rgs.com:9109/";
const md5Key = "E000E465DBDE0E9A67F1D33CD968419A";
const imgShow = "https://scenario.qy-rgs.com:9109/file/download?path="

module.exports = {
  formatTime: formatTime,
  notLogin: notLogin,
  verdueToken: verdueToken,
  dataUrl: dataUrl,
  requestId: requestId,
  md5Key: md5Key,
  imgShow: imgShow,
  header:header,
  version:version
}
