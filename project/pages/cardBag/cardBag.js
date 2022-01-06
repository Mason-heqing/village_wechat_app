// pages/cardBag/cardBag.js
var app =  getApp();
const util = require('../../utils/util.js')
const requestId = util.requestId
const timeStamp = Date.parse(new Date())
const dataUrl = util.dataUrl
Page({

  data: {
      bgImgUrl:app.globalData.bgImgUrl,
      token:'',
      clubCarList:[],
      showHie:false
  },
  // 去续费
  recharging(e) {
    console.log(e.target,'####')
    wx.navigateTo({
      url:`../../pages/renewMoney/renewMoney?type=1&id=${e.target.dataset.item.id}&cardName=${e.target.dataset.item.cardTypeName}&parkName=${e.target.dataset.item.parkName}&plateNo=${e.target.dataset.item.plateNo}&expireTime=${e.target.dataset.item.expireTime}`
    })
  },
  // 去充值
  valueCard(e) {
  
    console.log(e.target,'!@!@')
    let item = e.target.dataset.item
    wx.navigateTo({
      url:`../../pages/renewMoney/renewMoney?type=2&id=${item.id}&parkName=${item.parkName}&plateNo=${item.plateNo}&cardName=${item.cardTypeName}&balance=${item.balance}`
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      token:wx.getStorageSync('token')
    })
    
    this.getClubList();
  },
  // 获取会员卡
  getClubList() {
    let _that = this
    wx.request({
      url: dataUrl + 'park/mobile/user/car/list',
      method: "POST",
      header: {
        'content-type': 'application/json', // 默认值
        "token": _that.data.token,
        "type": 2,
        "requestId": requestId(),
        "timestamp": timeStamp,
        "market": 'Applet',
        "version": 'none'
      },
      data: {
        appId:wx.getStorageSync('appId'),
        type:1
      },
      success(res) {
        if(res.data.code == 200 && res.data.data != null) {
          _that.setData({
            clubCarList:res.data.data,
          })
          
        }else if(res.data.code == 200 && res.data.data == null){
            _that.setData({
              showHie:true
            })
          
        }
        console.log(res,'-----')

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