// pages/monitor/monitor.js
const util = require('../../utils/util.js')
const dataUrl = util.dataUrl
const requestId = util.requestId
const timeStamp = Date.parse(new Date())
Page({

  /**
   * 页面的初始数据
   */
  data: {
    showMessage: false,
    noMessage: true,
    list: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const that = this;
    that.getDoorList();
  },

  //重试
  again() {
    const that = this;
    that.getDoorList();
  },

  //获取门前监视列表
  getDoorList() {
    const that = this;
    let token = wx.getStorageSync('token');
    let appId = wx.getStorageSync('appId');
    wx.showLoading({
      title: '加载中',
    });
    wx.request({
      url: dataUrl + "door/doorList",
      method: "POST",
      data: {
        appId: appId
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
          if (0 < res.data.data.records.length) {
            that.setData({
              showMessage: false,
              noMessage: true,
              list: res.data.data.records
            })
          } else {
            that.setData({
              showMessage: true,
              noMessage: false,
              list: []
            })
            wx.showToast({
              title: "没有数据 !",
              icon: 'none',
              duration: 2000
            })
          }
        } else if (304 == res.data.code) {
          wx.showToast({
            title: res.data.msg,
            icon: 'none',
            duration: 2000
          })
          util.verdueToken()
        } else {
          that.setData({
            showMessage: true,
            noMessage: false,
          })
          wx.showToast({
            title: res.data.msg,
            icon: 'none',
            duration: 2000
          })
        }
      }
    })
  },

  video(e){
    const that = this;
    let deviceId = e.currentTarget.dataset.deviceid;
    let online = e.currentTarget.dataset.online;
    if (online){
      wx.navigateTo({
        url: '../video/video?deviceId=' + deviceId
      })
    }else{
      wx.showToast({
        title:"设备已离线",
        icon: 'none',
        duration: 2000
      })
    }
    
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
    const that = this;
    that.getDoorList();
    wx.stopPullDownRefresh();
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