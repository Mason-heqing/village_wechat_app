"use strict";

// pages/renewMoney/renewMoney.js
var util = require('../../utils/util.js');

var requestId = util.requestId;
var timeStamp = Date.parse(new Date());
var dataUrl = util.dataUrl;
var app = getApp();
Page({
  data: {
    bgImgUrl: app.globalData.bgImgUrl,
    idx: 0,
    FromType: '',
    carNumberList: [],
    parkName: '',
    plateNo: '',
    token: wx.getStorageSync('token'),
    valueNumber: '300',
    moneyList: [{
      month: '1个月',
      time: '2025.05.30',
      number: '300'
    }, {
      month: '3个月',
      time: '2025.05.30',
      number: '900'
    }, {
      month: '6个月',
      time: '2025.05.30',
      number: '1800'
    }, {
      month: '9个月',
      time: '2025.05.30',
      number: '2700'
    }, {
      month: '12个月',
      time: '2025.05.30',
      number: '3600'
    }]
  },
  // 选择充值的金额
  confirmIndex: function confirmIndex(data) {
    console.log(data, '$$$');
    this.setData({
      idx: data.target.dataset.index,
      valueNumber: data.target.dataset.item.number
    });
  },
  // 月卡充值
  toreCharge: function toreCharge() {
    wx.navigateTo({
      url: "../../pages/rechargeMsg/rechargeMsg?type=".concat(this.data.FromType, "&parkName=").concat(this.data.parkName, "&plateNo=").concat(this.data.plateNo, "&money=").concat(this.data.valueNumber)
    });
  },
  // 获取会员卡
  getClubList: function getClubList() {
    var _this = this;

    wx.request({
      url: dataUrl + 'park/mobile/user/car/list',
      method: "POST",
      header: {
        'content-type': 'application/json',
        // 默认值
        "token": _this.data.token,
        "type": 2,
        "requestId": requestId(),
        "timestamp": timeStamp,
        "market": 'Applet',
        "version": 'none'
      },
      data: {
        appId: '89f3d4ede44840f9a1f4e016454d8a80',
        type: 1
      },
      success: function success(res) {
        if (res.data.code == 200) {
          _this.setData({
            carNumberList: res.data.data,
            plateNo: res.data.data[0].plateNo,
            parkName: res.data.data[0].parkName
          });
        }

        console.log(_this.data.plateNo, '-----');
      }
    });
  },
  // 储值卡充值
  valueRecharge: function valueRecharge(e) {
    console.log(e.target, '999');
    wx.navigateTo({
      url: "../../pages/rechargeMsg/rechargeMsg?type=".concat(this.data.FromType, "$id=").concat(e.target.dataset.id, "&carNumber=").concat(e.target.dataset.item.plateNo)
    });
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function onLoad(options) {
    this.setData({
      FromType: options.type
    });
    this.getClubList();
    console.log(this.data.FromType);
    wx.setNavigationBarTitle({
      title: this.data.FromType == 1 ? '月卡充值' : '储值卡充值'
    }); // console.log(this.data.FromType)
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