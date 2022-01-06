// pages/decode/decode.js
const util = require('../../utils/util.js')
const dataUrl = util.dataUrl
const requestId = util.requestId
const timeStamp = Date.parse(new Date())
const app = getApp() 
Page({

  /**
   * 页面的初始数据
   */
  data: {

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const that = this;
    let token = wx.getStorageSync('token');
    if (options.q){
      let q = decodeURIComponent(options.q);
        if(token){
          if ("/" == (that.getCaption(q, 1)).substr((that.getCaption(q, 1)).length - 1, 1)){
            that.decode("QYSN:" + that.getCaption(q, 1).substring(0, that.getCaption(q, 1).length - 1))
          }else{
            that.decode("QYSN:" + that.getCaption(q, 1))
          }
        }else{
          app.globalData.decode = q;
          util.notLogin(token);
        }
     }else{
      if ("/" == (that.getCaption(app.globalData.decode, 1)).substr((that.getCaption(app.globalData.decode, 1)).length - 1, 1)){
        that.decode("QYSN:" + that.getCaption(app.globalData.decode, 1).substring(0, that.getCaption(app.globalData.decode, 1).length - 1))
       }else{
        that.decode("QYSN:" + that.getCaption(app.globalData.decode, 1))
       }
     }
  },


  //解析字符串
  getCaption(obj, state) {
    var index = obj.lastIndexOf("\:");
    if (state == 0) {
      obj = obj.substring(0, index);
    } else {
      obj = obj.substring(index + 1, obj.length);
    }
    return obj;
  },


  //扫码开门接口调用
  decode(value) {
    const that = this;
    let token = wx.getStorageSync('token');
    wx.request({
      url: dataUrl + "qrcode/decode",
      method: "POST",
      data: {
        content: value
      },
      header: {
        'content-type': 'application/json', // 默认值
        "token": token,
        "type": 2,
        "requestId": requestId(),
        "timestamp": timeStamp,
        "market": 'Applet',
        "version": 'none'
      },
      success(res) {
        wx.hideLoading();
        console.log(res)
        if (200 == res.data.code && "SUCCESS" == res.data.msg) {
          wx.showToast({
            title: "门锁已开",
            icon: 'none',
            duration: 2000
          })
          app.globalData.decode = "";
          setTimeout(()=>{
            wx.switchTab({
              url: '../index/index'
            })
          },2000)
        } else if (304 == res.data.code) {
          wx.showToast({
            title: res.data.msg,
            icon: 'none',
            duration: 2000
          })
          util.verdueToken()
        } else {
          wx.showToast({
            title: res.data.msg,
            icon: 'none',
            duration: 2000
          })
          setTimeout(() => {
            wx.switchTab({
              url: '../index/index'
            })
          }, 2000)
        }
      }
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})