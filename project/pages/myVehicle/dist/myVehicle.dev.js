"use strict";

// pages/myVehicle/myVehicle.js
var app = getApp();

var util = require('../../utils/util.js');

var requestId = util.requestId;
var timeStamp = Date.parse(new Date());
var dataUrl = util.dataUrl;
var header = util.header;
Page({
  data: {
    dataList: [],
    token: wx.getStorageSync('token'),
    id: ''
  },
  bindingCard: function bindingCard() {
    wx.navigateTo({
      url: "../../pages/memberCrad/memberCrad?tag=4"
    });
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function onLoad(options) {
    this.getCardList();
  },
  getCardList: function getCardList() {
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
        type: 2
      },
      success: function success(res) {
        if (res.data.code == 200) {
          _this.setData({
            dataList: res.data.data
          });
        }

        console.log(res, '-----');
      }
    });
  },
  // 删除车牌信息
  deleteCar: function deleteCar(e) {
    console.log(e.target);
    this.setData({
      id: e.target.dataset.id
    });

    var _that = this;

    console.log(this.data.id, '222');
    wx.showModal({
      title: '提示',
      content: '是否删除此条信息',
      success: function success(res) {
        if (res.confirm) {
          wx.request({
            url: dataUrl + "park/mobile/user/car/delete/".concat(_that.data.id),
            method: "DELETE",
            header: {
              'content-type': 'application/json',
              // 默认值
              "token": _that.data.token,
              "type": 2,
              "requestId": requestId(),
              "timestamp": timeStamp,
              "market": 'Applet',
              "version": 'none'
            },
            success: function success(res) {
              if (res.data.code == 200) {
                wx.showToast({
                  title: '删除成功',
                  icon: 'success',
                  duration: 2000
                });

                _that.getCardList();
              }

              console.log(res, '-----');
            }
          });
        } else if (res.cancel) {
          console.log('用户点击取消');
        }
      }
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