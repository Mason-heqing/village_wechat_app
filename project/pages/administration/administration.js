// pages/administration/administration.js
const util = require('../../utils/util.js')
const dataUrl = util.dataUrl
const requestId = util.requestId
const timeStamp = Date.parse(new Date())
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    scrollHeight: 0,
    showMessage:true,
    noMessage:false,
    scrollHeight:0,
    names:"",
    openDoorMessage:false,
    houseList:[]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const that = this;
    wx.getSystemInfo({
      success: function (res) {
        // 可使用窗口宽度、高度
        // 计算主体部分高度,单位为px
        that.setData({
          // cameraHeight部分高度 = 利用窗口可使用高度 - 固定高度（这里的高度单位为px，所有利用比例将300rpx转换为px）
          scrollHeight: res.windowHeight - res.windowWidth / 750 * 186
        })
      }
    });
  },

  //获取个人信息
  getUserInfo() {
    const that = this;
    let token = wx.getStorageSync('token');
    wx.showLoading({
      title: '加载中',
    })
    wx.request({
      url: dataUrl + "user/detail",
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
        wx.hideLoading();
        console.log(res)
        if (200 == res.data.code && "SUCCESS" == res.data.msg) {
          that.setData({
            names: res.data.data.name,
          })
        } else if (304 == res.data.code) {
          wx.showToast({
            title: res.data.msg,
            icon: 'none',
            duration: 2000
          })
          util.verdueToken()
        } else {
          wx.showToast({
            title: res.data.msg,
            icon: 'none',
            duration: 2000
          })
        }
      }
    })
  },

  details(e){
    console.log(e)
    let id = e.currentTarget.dataset.info.id;
    let bindStatus = e.currentTarget.dataset.info.bindStatus;
    let idSt = e.currentTarget.dataset.info.identityAudit
    wx.navigateTo({
      url: `../houseThrough/houseThrough?bindStatus=${bindStatus}&id=${id}&idT=${idSt}`,
    })
  },
 
  //添加房屋
  addVillage(){
    const that = this;
    let names = that.data.names;
    if("" != names){
      wx.navigateTo({
        url: '../selectVillage/selectVillage',
      })
    }else{
     that.setData({
       openDoorMessage:true
     })
    }
  },

  //提示信息(确定))
  modalConfirm() {
    const that = this;
    wx.navigateTo({
      url: '../personal/personal',
    })
  },
  
  //获取房屋列表
  getResidences(){
   const that = this;
   let token = wx.getStorageSync('token');
    wx.showLoading({
      title: '加载中',
    })
    wx.request({
      url: dataUrl + "house/manage/list",
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
        console.log(res)
        if (200 == res.data.code && "SUCCESS" == res.data.msg) {
          if (0 < res.data.data.length){
            let personStatus = [];
            res.data.data.forEach((item,index)=>{
              if (9 == item.bindStatus){
                personStatus.push(index);
              }
              item.date = item.date.slice(0, 10);
              if ("1" == item.personSubtype){
                item.personSubtype = "户主";
              } else if ("2" == item.personSubtype){
                item.personSubtype = "家属";
              } else if ("3" == item.personSubtype){
                item.personSubtype = "租客";
              }else {
                item.personSubtype = "其他";
              }
              if (item.address && "" != item.address){
                let currentAddress = item.address.split(",")
                item.country = currentAddress[0];
                item.province = currentAddress[1];
                item.city = currentAddress[2];
                item.areas = currentAddress[3];
              }
              if (item.date) {
                let currentDate = new Date().getFullYear();
                let selectData = item.date.split('-')[0];
                if (parseInt(selectData) - parseInt(currentDate) > 70){
                    item.date = "永久"
                }
              }
            })
            if (0 < personStatus.length){
              app.globalData.isLogin = true
            }else{
              app.globalData.isLogin = false
            }
            that.setData({
              showMessage: false,
              noMessage: true,
              houseList: res.data.data
            })
          }else{
            that.setData({
              showMessage: true,
              noMessage: false,
              houseList:[]
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
    const that = this;
    that.getUserInfo()
    that.getResidences();
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
    that.getResidences();
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