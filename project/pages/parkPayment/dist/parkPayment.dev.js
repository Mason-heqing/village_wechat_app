"use strict";

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
    background: ['demo-text-1', 'demo-text-2'],
    indicatorDots: true,
    vertical: false,
    autoplay: false,
    interval: 2000,
    duration: 500,
    tabNumberC: true,
    tabNumberA: false,
    tabNumberB: false,
    hsNam: '',
    token: wx.getStorageSync('token'),
    dalogBox: false,
    vehicleNumber: '',
    bgImgUrl: app.globalData.bgImgUrl,
    carNumberList: [],
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
  submitNumber: function submitNumber() {
    if (this.data.carnum[6]) {// 跳转到tabbar页面
    }
  },
  // 弹窗
  cancel: function cancel() {
    this.setData({
      dalogBox: false
    });
  },
  confirm: function confirm() {
    this.setData({
      dalogBox: false
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
            carNumberList: res.data.data
          });
        }

        console.log(res, '-----');
      }
    });
  },
  // 月卡充值
  recharging: function recharging() {
    wx.navigateTo({
      url: "../../pages/renewMoney/renewMoney?type=1"
    });
  },
  // 储值卡充值
  valueCard: function valueCard() {
    wx.navigateTo({
      url: "../../pages/renewMoney/renewMoney?type=2"
    });
  },
  // 添加会员卡
  addMemberCrad: function addMemberCrad() {
    wx.navigateTo({
      url: "../../pages/memberCrad/memberCrad?tag=3"
    });
  },
  // 查询车牌
  inquire: function inquire() {
    var arr = this.data.carnum.join('');
    wx.request({
      url: dataUrl + 'park/park/fee/query',
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
      data: {
        appId: '89f3d4ede44840f9a1f4e016454d8a80',
        plateNo: arr
      },
      success: function success(res) {
        // if(res.data.code == 200) {
        // }
        console.log(res, '-----');
      }
    });
    this.setData({
      dalogBox: true
    });
  },
  // 切换选择车牌
  switChover: function switChover() {
    this.setData({
      tabNumberA: !this.data.tabNumberA,
      tabNumberB: !this.data.tabNumberB,
      tabNumberC: !this.data.tabNumberC
    });
    console.log(999);
  },
  openIndex: function openIndex(e) {
    if (e.target.dataset.item.card) {
      this.setData({
        vehicleNumber: e.target.dataset.item.card
      });
    }
  },
  // 卡包中心
  cardList: function cardList() {
    console.log(88888);
    wx.navigateTo({
      url: "../../pages/cardBag/cardBag"
    });
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function onLoad(options) {
    this.setData({
      hsNam: app.globalData.housingNam
    });
    this.getClubList();
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