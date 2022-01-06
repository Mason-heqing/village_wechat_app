// pages/rechargeMsg/rechargeMsg.js
const util = require('../../utils/util.js')
const requestId = util.requestId
const timeStamp = Date.parse(new Date())
const dataUrl = util.dataUrl
var app =  getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
      r1:'',
      fromType:'',     //会员卡id
      callbackUrl:'',  //支付成功页面地址
      monthCount:'',   //月卡充值
      payType:'',      //支付方式
      totalAmount:'',  //金额
      plateNo:'',      //车牌
      plateNoB:'',
      parkName:'',
      mMoney:'',
      orderId:'',   //临时卡
      id:'',
      tg:'',
      payStatus:false,
      affirm:true,
      token:'',
      dalogBox:false,
      infos: {
        fee: '',                   // 当前支付显示的金额，单位为分，必传
        queryUrl: '',             // 验证支付的请求url；为请求下单（pay_method=MINIPAY）时，响应里面的 trade_url 字段
        style: {                  // 组件内支付按钮样式，可以设置以下属性，非必传
          width: '80%',
          height: '40px',
          lineHeight: '25px',
          fontSize: '18px',
          borderRadius: '4px',
          color: '#fff',
          background: '#5656ED'
        }
        },
      dataLis:[]
  },

   //json引入支付文件
  //  "usingComponents": {
  //   "pay-ment":"plugin://pay-ment/pay"
  // },
  

    // 准备支付
    // inputedit(e) {
    //     this.setData({
    //       mMoney:e.detail.value
    //     })
    //     console.log(this.data.mMoney)
    // },
    // 临时卡充值
    // temporaryPayMoney() {
    //   console.log('....')
    //   let _that = this
    //   let temporaryMsg = {
    //     orderId:this.data.orderId,
    //     payType:'WECHAT'
    //   }
    //   wx.request({
    //     url: dataUrl + `park/park/fee/interim_pay?orderId=${this.data.orderId}&payType=${temporaryMsg.payType}`,
    //     method:'POST',
    //     header: {
    //       'content-type': 'application/json', // 默认值
    //       "token": _that.data.token,
    //       "type": 2,
    //       "requestId": requestId(),
    //       "timestamp": timeStamp,
    //       "market": 'Applet',
    //       "version": 'none'
    //     },
        
    //     data:{...temporaryMsg},
    //     success(res) {
    //       if(res.data.code == 200) {
    //         _that.setData({
    //           ['infos.queryUrl']:res.data.data.url,
    //           ['infos.fee']:_that.data.mMoney * 100,
    //           payStatus:true,
    //           affirm:false
    //         })
    //         console.log(_that.data.infos.queryUrl,_that.data.infos.fee,'----!!!')
    //       }
    //     }
    //   })
    // },
    // 月卡充值
    // payMoney() {
    //   // return
    //   let payMsg = {
    //     appId:wx.getStorageSync('appId'),
    //     callbackUrl:'../../pages/successPage/successPage',
    //     payType:'WECHAT',
    //     totalAmount:this.data.mMoney * 100,
    //     monthCount:this.data.monthCount,
    //     plateNo:this.data.plateNo,
    //     mobileUserCarId:this.data.id,
    //   }
    //   let _that = this
    //     wx.request({
    //       url: dataUrl + 'park/park/fee/vip_card_top_up',
    //       method: "POST",
    //       header: {
    //         'content-type': 'application/json', // 默认值
    //         "token": _that.data.token,
    //         "type": 2,
    //         "requestId": requestId(),
    //         "timestamp": timeStamp,
    //         "market": 'Applet',
    //         "version": 'none'
    //       },
    //       data: {...payMsg},
    //       success(res) {
    //         if(res.data.code == 200) {
    //           _that.setData({
    //             ['infos.queryUrl']:res.data.data.url,
    //             ['infos.fee']:_that.data.mMoney * 100,
    //             payStatus:true,
    //             affirm:false
    //           })
    //           console.log(_that.data.infos.queryUrl,_that.data.infos.fee,'----++++++')
              
    //         }else {
    //           wx.showToast({
    //             title: res.data.msg,
    //             icon: 'none',
    //             duration: 2000
    //           })
    //         }
          
    //       }
    //     })
    
    // },
    // 拉起微信支付
    // payback: function(data) {
    //   console.log(this.data.mMoney,'mimi')
    //   if( data.detail.type === 'success') {
    //     wx.navigateBack({
    //       delta:2
    //     })
    //   }
    //   console.log(data.detail,'支付！！！')
    
    // },
      // data.detail.detail.errMsg === 'requestPayment:ok'  支付成功 (data.detail.type === 'success')
      // data.detail.type === 'fail'  支付失败 (data.detail.detail 为支付失败信息)
      // data.detail.type === 'cancel'  取消支付
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options,'传递的参数')
    this.setData({
      tg:options.tg
    })
    if(options.orderId) {
      this.setData({
        orderId:options.orderId,
      })
    }
    console.log(this.data.tg,'期间')
    wx.setNavigationBarTitle({
      title:this.data.tg == 0 ? '缴费确认' : '充值确认'
    })
    this.setData({
      fromType:options.type,
      id:options.carIdM,
      plateNoB:options.plateNo,
      parkName:options.parkName,
      mMoney:options.money,
      monthCount:options.monthCount,
      token:wx.getStorageSync('token')
    })

    // console.log(options.monthCount)
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