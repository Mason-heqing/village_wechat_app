"use strict";

// pages/memberCrad/memberCrad.js
var app = getApp();

var util = require('../../utils/util.js');

var requestId = util.requestId;
var timeStamp = Date.parse(new Date());
var dataUrl = util.dataUrl;
Page({
  tag: '',
  data: {
    // 省份简写
    provinces: [['京', '沪', '粤', '津', '冀', '晋', '蒙', '辽', '吉', '黑'], ['苏', '浙', '皖', '闽', '赣', '鲁', '豫', '鄂', '湘'], ['桂', '琼', '渝', '川', '贵', '云', '藏'], ['陕', '甘', '青', '宁', '新']],
    // 车牌输入
    numbers: [["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"], ["A", "B", "C", "D", "E", "F", "G", "H", "J", "K"], ["L", "M", "N", "P", "Q", "R", "S", "T", "U", "V"], ["W", "X", "Y", "Z", "港", "澳", "学"]],
    carnum: [],
    showNewPower: false,
    KeyboardState: true
  },
  // 选中点击设置
  bindChoose: function bindChoose(e) {
    if (!this.data.carnum[6] || this.data.showNewPower) {
      var arr = [];
      arr[0] = e.target.dataset.val;
      this.data.carnum = this.data.carnum.concat(arr);
      this.setData({
        carnum: this.data.carnum
      });
    }
  },
  bindDelChoose: function bindDelChoose() {
    if (this.data.carnum.length != 0) {
      this.data.carnum.splice(this.data.carnum.length - 1, 1);
      this.setData({
        carnum: this.data.carnum
      });
    }
  },
  showPowerBtn: function showPowerBtn() {
    this.setData({
      showNewPower: true,
      KeyboardState: true
    });
  },
  closeKeyboard: function closeKeyboard() {
    this.setData({
      KeyboardState: false
    });
  },
  openKeyboard: function openKeyboard() {
    this.setData({
      KeyboardState: true
    });
  },
  // 提交车牌号码
  // submitNumber() {
  //   if (this.data.carnum[6]) {
  //     // 跳转到tabbar页面
  //   }
  // },
  // 添加车牌
  nextStep: function nextStep() {
    var token = wx.getStorageSync('token');
    var arr = this.data.carnum.join('');
    console.log(arr);
    wx.showLoading({
      title: '车牌绑定中'
    });
    setTimeout(function () {
      wx.request({
        url: dataUrl + 'park/mobile/user/car/add',
        method: "POST",
        header: {
          'content-type': 'application/json',
          // 默认值
          "token": token,
          "type": 2,
          "requestId": requestId(),
          "timestamp": timeStamp,
          "market": 'Applet',
          "version": 'none'
        },
        data: {
          appId: '89f3d4ede44840f9a1f4e016454d8a80',
          plateNo: arr
        },
        success: function success(res) {
          if (res.data.code == 200) {
            wx.hideLoading();
            wx.showToast({
              title: '绑定成功',
              icon: "success",
              duration: 1000
            });
            setTimeout(function () {
              wx.redirectTo({
                url: '../../pages/myVehicle/myVehicle'
              });
            }, 2000);
          } else if (res.data.code != 200) {
            wx.showToast({
              title: '该车辆未录入',
              icon: "success",
              duration: 1000
            });
            wx.hideLoading();
          }
        }
      });
    }, 3000);
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function onLoad(options) {
    console.log(options.tag);
    this.setData({
      tag: options.tag
    });
    wx.setNavigationBarTitle({
      title: this.data.tag == 3 ? '添加会员卡' : '添加车辆'
    });
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