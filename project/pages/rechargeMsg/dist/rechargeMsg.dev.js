"use strict";

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

// pages/rechargeMsg/rechargeMsg.js
var util = require('../../utils/util.js');

var requestId = util.requestId;
var timeStamp = Date.parse(new Date());
var dataUrl = util.dataUrl;
var app = getApp();
Page({
  /**
   * 页面的初始数据
   */
  data: {
    r1: '',
    fromType: '',
    mobileUserCarId: '',
    //会员卡id
    callbackUrl: '',
    //支付成功页面地址
    monthCount: '',
    //月卡充值
    payType: '',
    //支付方式
    totalAmount: '',
    //金额
    plateNo: '',
    //车牌
    plateNoB: '',
    parkName: '',
    mMoney: '',
    id: '',
    token: wx.getStorageSync('token'),
    dataLis: [{
      name: '长城外古道边荒草碧连天',
      number: '123456789',
      sum: '1000'
    }]
  },
  // 准备支付
  inputedit: function inputedit(e) {
    this.setData({
      totalAmount: e.detail.value
    });
  },
  payMoney: function payMoney() {
    if (this.data.totalAmount == '') {
      wx.showToast({
        title: '金额不能为空',
        icon: 'none',
        duration: 1500
      });
    }

    var id = this.data.id;

    var payMsg = _defineProperty({
      appId: '89f3d4ede44840f9a1f4e016454d8a80',
      mobileUserCarId: '',
      callbackUrl: '../../pages/renewMoney',
      payType: 'WECHAT',
      totalAmount: this.data.totalAmount,
      monthCount: this.data.monthCount,
      plateNo: this.data.plateNo
    }, "mobileUserCarId", '23c60fbfc7e0483392491d3785356932');

    wx.request({
      url: dataUrl + 'park/park/fee/vip_card_top_up',
      method: "POST",
      header: {
        'content-type': 'application/json',
        // 默认值
        "token": this.data.token,
        "type": 2,
        "requestId": requestId(),
        "timestamp": timeStamp,
        "market": 'Applet',
        "version": 'none'
      },
      data: payMsg,
      success: function success(res) {
        // if(res.data.code == 200) {
        // }
        console.log(res, '-----');
      }
    });
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function onLoad(options) {
    console.log(options, '&&&');
    this.setData({
      fromType: options.type,
      id: options.id,
      plateNoB: options.plateNo,
      parkName: options.parkName,
      mMoney: options.money
    });
    console.log(options);
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function onReady() {},

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function onShow() {},

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function onHide() {},

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function onUnload() {},

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function onPullDownRefresh() {},

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function onReachBottom() {},

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function onShareAppMessage() {}
});