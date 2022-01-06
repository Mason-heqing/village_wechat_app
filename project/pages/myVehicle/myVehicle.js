// pages/myVehicle/myVehicle.js
var app =  getApp();
const util = require('../../utils/util.js')
const requestId = util.requestId
const timeStamp = Date.parse(new Date())
const dataUrl = util.dataUrl
const header = util.header
Page({
  data: {
    dataList:[],
    token:'',
    id:'',
    showHie:false
  },
  bindingCard() {
    wx.navigateTo({
      url: `../../pages/memberCrad/memberCrad?tag=4`
      
    });
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    
    this.setData({
      token:wx.getStorageSync('token')
    })
    this.getCardList();
  },
  getCardList() {
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
        type:2
      },
      success(res) {
        if(res.data.code == 200 && res.data.data == null) {
          _that.setData({
            showHie:true,
            dataList:[]
          })
          
        }else if(res.data.code == 200 && res.data.data){
          _that.setData({
            dataList:res.data.data,
            showHie:false
          })
        }
        console.log(res,'车辆列表')

      }
    })
  },
  // 删除车牌信息
  deleteCar(e) {
    console.log(e.target)
    this.setData({
      id:e.target.dataset.id
    })
    var _that = this
    console.log(this.data.id,'222')
    wx.showModal({
      title: '提示',
      content: '是否删除此条信息',
      success (res) {
        if (res.confirm) {
          wx.request({
            url: dataUrl + `park/mobile/user/car/delete/${_that.data.id}`,
            method: "DELETE",
            header: {
              'content-type': 'application/json', // 默认值
              "token": _that.data.token,
              "type": 2,
              "requestId": requestId(),
              "timestamp": timeStamp,
              "market": 'Applet',
              "version": 'none'
            },
            
            success(res) {
              if(res.data.code == 200) {
                wx.showToast({
                  title: '删除成功',
                  icon: 'success',     
                  duration: 2000,      
                })
                _that.getCardList();
              }
              console.log(res,'-----')
      
            }
          })
        } else if (res.cancel) {
          console.log('用户点击取消')
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
    this.onLoad();
    // this.getCardList();
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