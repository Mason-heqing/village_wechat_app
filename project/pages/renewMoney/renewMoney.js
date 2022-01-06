// pages/renewMoney/renewMoney.js
const util = require('../../utils/util.js')
const requestId = util.requestId
const timeStamp = Date.parse(new Date())
const dataUrl = util.dataUrl
var app =  getApp();
Page({
  data: {
    bgImgUrl:app.globalData.bgImgUrl,
    idx:0,
    FromType:'',
    parkName:'',
    plateNo:'',
    expireTime:'',
    carId:'',
    monthCount:'',
    token:'',
    valueNumber:'',
    moneyList:[],
  
  },


  // 选择充值的金额

  confirmIndex(data) {
    console.log(data,'$$$')
    this.setData({
      idx:data.currentTarget.dataset.index,
      monthCount:data.currentTarget.dataset.item.monthCount,
      valueNumber:data.currentTarget.dataset.item.fee
    })
  
  },

  // 月卡充值
  toreCharge() {
    wx.navigateTo({
      url:`../../pages/rechargeMsg/rechargeMsg?type=${this.data.FromType}&parkName=${this.data.parkName}&plateNo=${this.data.plateNo}&money=${this.data.valueNumber}&monthCount=${this.data.monthCount}&carIdM=${this.data.carId}&tg=8`
    })
  },
   // 获取会员卡
  
  // 储值卡充值
  valueRecharge(e) {
    console.log(this.data.id,'999')
    wx.navigateTo({
      url:`../../pages/rechargeMsg/rechargeMsg?type=${this.data.FromType}&carIdM=${this.data.carId}&plateNo=${this.data.plateNo}&tg=8`
    })
  },
// 获取充值规则
getPayRule() {
  var _that = this;
  wx.request({
    url: dataUrl + 'park/park/fee/monthly_car_charge_infos',
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
      mobileUserCarId:_that.data.carId,
      monthArr:[1,3,6,9,12]
    },
    success(res) {
      if(res.data.code == 200) {
      _that.setData({
        moneyList:res.data.data,
        valueNumber:res.data.data[0].fee,
        monthCount:res.data.data[0].monthCount
      })
      }
      console.log(res,'！！！！！！')

    }
  })
},

  
  upper(e) {
    console.log(e)
  },

  lower(e) {
    console.log(e)
  },

  scroll(e) {
    console.log(e)
  },

  scrollToTop() {
    this.setAction({
      scrollTop: 0
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options,'()()()')
    this.setData({
      FromType:options.type,
      carId:options.id,
      cardName:options.cardName,
      parkName:options.parkName,
      plateNo:options.plateNo,
      balance:options.balance,
      expireTime:options.expireTime == 'null' ? '' : options.expireTime,
      token:wx.getStorageSync('token')
    })
    
    if(this.data.FromType == 1) {
      this.getPayRule();
    }
    console.log(this.data.FromType)
    wx.setNavigationBarTitle({
      title:this.data.FromType == 1 ? '月卡充值' : '储值卡充值'
    })
    // console.log(this.data.FromType)
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