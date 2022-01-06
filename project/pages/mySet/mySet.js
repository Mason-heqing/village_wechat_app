// pages/mySet/mySet.js
const util = require('../../utils/util.js')
import WxValidate from '../../utils/WxValidate.js'
const dataUrl = util.dataUrl
const requestId = util.requestId
const timeStamp = Date.parse(new Date())
Page({

  /**
   * 页面的初始数据
   */
  data: {
    openDoorMessage: false,
    preventDuplication: true
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },

  //跳转到修稿密码页面
  setPassword() {
    wx.navigateTo({
      url: '../setPassword/setPassword',
    })
  },

  //跳转到重新绑定手机号页面
  setPhone() {
    wx.navigateTo({
      url: '../setTelephone/setTelephone',
    })
  },

  //退出登录
  signOut() {
    const that = this;
    // that.setData({
    //   openDoorMessage: true
    // })
    if (that.data.preventDuplication){
      that.modalConfirm();
    }
    that.setData({
      preventDuplication:false
    })
  },

  //提示信息(确定))
  modalConfirm() {
    const that = this;
    let token = wx.getStorageSync('token');
    wx.showLoading();
    wx.request({
      url: dataUrl + "user/loginout",
      method: "POST",
      data: {},
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
        wx.hideLoading()
        that.setData({
          preventDuplication:true
        })
        console.log(res)
        if (200 == res.data.code && "SUCCESS" == res.data.msg) {
          wx.removeStorageSync('token');
          wx.reLaunch({
            url: '../login/login',
          })
        } else if (304 == res.data.code){
          wx.showToast({
            title: res.data.msg,
            icon: 'none',
            duration: 2000
          })
          util.verdueToken()
        }else{
          wx.showToast({
            title: res.data.msg,
            icon: 'none',
            duration: 2000
          })
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