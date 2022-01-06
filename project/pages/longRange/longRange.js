// pages/longRange/longRange.js
const util = require('../../utils/util.js')
const dataUrl = util.dataUrl
const requestId = util.requestId
const timeStamp = Date.parse(new Date())
Page({

  /**
   * 页面的初始数据
   */
  data: {
    noContent:false,
    showMessage: true,
    noMessage: false,
    buildingShowMessage:true,
    buildingNoMessage: false,
    unitShowMessage:true,
    unitNoMessage: false,
    list:[],//大门门禁数据
    buildingList:[],//楼栋门禁数据
    unitList:[],//单元门禁数据
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const that = this;
    that.getDoorList();
  },
  
  //重试
  again(){
    const that = this;
    that.getDoorList();
  },

  //获取远程开门列表
  getDoorList(){
    const that = this;
    let token = wx.getStorageSync('token');
    let appId = wx.getStorageSync('appId');
    wx.showLoading({
      title: '加载中',
    })
    wx.request({
      url: dataUrl + "door/openDeviceList",
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
          if (0 < res.data.data.appList.length){
              that.setData({
                showMessage: false,
                noMessage: true,
                list: res.data.data.appList
              })
          }else{
          that.setData({
            showMessage: true,
            noMessage: false,
            list: []
          })
          }
          if(0 < res.data.data.buildingList.length){
            that.setData({
              buildingShowMessage:false,
              buildingNoMessage: true,
              buildingList: res.data.data.buildingList
            })
          }else{
            that.setData({
              buildingShowMessage:true,
              buildingNoMessage: false,
              buildingList:[]
            })
          }
          if(0 < res.data.data.unitList.length){
            that.setData({
              unitShowMessage:false,
              unitNoMessage: true,
              unitList: res.data.data.unitList
            })
          }else{
            that.setData({
              unitShowMessage:true,
              unitNoMessage: false,
              unitList:[]
            })
          }
          if(0 == res.data.data.appList.length && 0 == res.data.data.buildingList.length && 0 == res.data.data.unitList.length){
            that.setData({
              noContent:false
            })
            wx.showToast({
              title: "没有数据 !",
              icon: 'none',
              duration: 2000
            })
          }else{
            that.setData({
              noContent:true
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

  openDoor(e){
    const that = this;
    let token = wx.getStorageSync('token');
    let appId = wx.getStorageSync('appId');
    let deviceId = e.currentTarget.dataset.deviceid;
    let online = e.currentTarget.dataset.online;
    if (online){
      wx.showLoading();
      wx.request({
        url: dataUrl + "door/open",
        method: "POST",
        data: {
          deviceId: deviceId
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
    }else{
      wx.showToast({
        title: "设备已离线",
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