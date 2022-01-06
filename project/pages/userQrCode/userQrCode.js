// pages/userQrCode/userQrCode.js
const util = require('../../utils/util.js')
import WxValidate from '../../utils/WxValidate.js'
const dataUrl = util.dataUrl
const requestId = util.requestId
const timeStamp = Date.parse(new Date())
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    codeImg:'',
    timeNumber:1
  },




    // 获取二维码
    getQrcode() {
      let that = this;
      let token = wx.getStorageSync('token');
      wx.request({
        url:dataUrl + "qrcode/generate",
        method:"GET",
        responseType: 'arraybuffer',
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
          let url ='data:image/png;base64,'+ wx.arrayBufferToBase64(res.data)
          that.setData({
            codeImg:url
          })
        }
      })
    },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getQrcode();
    
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
    
    setInterval(function () {
      this.onLoad();
    },3000000)
    
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