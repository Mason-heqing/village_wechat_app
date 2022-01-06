// pages/contact/contact.js
import WxValidate from '../../utils/WxValidate.js'
const util = require('../../utils/util.js')
const dataUrl = util.dataUrl
const requestId = util.requestId
const timeStamp = Date.parse(new Date())
Page({

  /**
   * 页面的初始数据
   */
  data: {
    showMessage:true,
    noMessage:false,
    list:[]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
   const that = this;
    that.getProperty();
  },
  
  //拨打电话
  callPhone(e){
    wx.makePhoneCall({
      phoneNumber: e.currentTarget.dataset.phone
    })
  },

  //获取物业信息
  getProperty(){
   const that = this;
    let token = wx.getStorageSync('token');
    let appId = wx.getStorageSync('appId');
    wx.showLoading({
      title: '加载中',
    })
    wx.request({
      url: dataUrl + "property/contact/getListByAppId",
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
          if (res.data.data.records && 0 < res.data.data.records.length){
            let num = 0;
            res.data.data.records.forEach((item,index)=>{
              if (num > 2){
                num = 0
              }
              num ++
              item.bgC = num
            })
            that.setData({
              showMessage: false,
              noMessage: true,
              list: res.data.data.records
            })
          }else{
            // wx.showToast({
            //   title:"没有数据 !",
            //   icon: 'none',
            //   duration: 2000
            // })
            that.setData({
              showMessage: true,
              noMessage: false,
              list:[]
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
  
  // again(){
  //  const that = this;
  //  that.getProperty();
  // },

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
    that.getProperty();
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