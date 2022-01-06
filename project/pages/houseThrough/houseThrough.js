// pages/houseThrough/houseThrough.js
const util = require('../../utils/util.js')
const dataUrl = util.dataUrl
const requestId = util.requestId
const timeStamp = Date.parse(new Date())
Page({

  /**
   * 页面的初始数据
   */
  data: {
    bindStatus:null, //状态
    id:"", //房屋申请记录id
    residenceName:"", //小区名称
    buildingName:"", //楼栋名称
    unitName:"",  //单元名称
    deviceGroupName:"", //房号名称
    effectiveTime:"", //有效期
    bindFailReseaon:"", //拒绝原因,
    idT:'',
    idNum:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options)
    const that = this;
    that.setData({
      id: options.id,
      bindStatus: options.bindStatus,
      houseId: options.houseId,
      personSubType: options.personSubType,
      expireDate: options.expireDate,
      idT:options.idT == "true" ? '1' : '2'
    })
    
      if ((0 == options.bindStatus || 1 == options.bindStatus || 5 == options.bindStatus) &&  this.data.idT == 2){
        wx.setNavigationBarTitle({
          title: '房屋详情 (待审核)'
        })
      }else if ((0 == options.bindStatus || 1 == options.bindStatus || 5 == options.bindStatus) && this.data.idT == 1){
        wx.setNavigationBarTitle({
          title: '房屋详情 (待人证核验)'
        })
      }else if (8 == options.bindStatus){
        wx.setNavigationBarTitle({
          title: '房屋详情 (已取消)'
        })
      } else if (2 == options.bindStatus){
        wx.setNavigationBarTitle({
          title: '房屋详情 (审核拒绝)'
        })
      } else if (4 == options.bindStatus){
        wx.setNavigationBarTitle({
          title: '房屋详情 (审核拒绝)'
        })
      }else {
        wx.setNavigationBarTitle({
          title: '房屋详情 (已通过)'
        })
      }
  
    that.getHouseDetails();
  },
  
  //取消申请
  cancel(){
    const that = this;
    let token = wx.getStorageSync('token');
    let id = that.data.id;
    wx.showLoading();
    wx.request({
      url: dataUrl + "house/manage/cancel",
      method: "POST",
      data: {
        id:id
      },
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
          wx.showToast({
            title: "取消申请成功",
            icon: 'none',
            duration: 2000
          })
          setTimeout(() => {
            wx.navigateBack({
              delta: 1 //想要返回的层级
            })
          }, 2000)
        } else if (304 == res.data.code) {
          wx.showToast({
            title: res.data.msg,
            icon: 'none',
            duration: 2000
          })
          util.verdueToken()
        } else {
          that.setData({
            showMessage: true,
            noMessage: false,
          })
          wx.showToast({
            title: res.data.msg,
            icon: 'none',
            duration: 2000
          })
        }
      }
    })
  },

  //删除记录
  delect(){
    const that = this;
    let token = wx.getStorageSync('token');
    let id = that.data.id;
    wx.showLoading();
    wx.request({
      url: dataUrl + "house/manage/delete",
      method: "POST",
      data: {
        id: id
      },
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
          wx.showToast({
            title: "删除成功",
            icon: 'none',
            duration: 2000
          })
          setTimeout(() => {
            wx.navigateBack({
              delta: 1 //想要返回的层级
            })
          }, 2000)
        } else if (304 == res.data.code) {
          wx.showToast({
            title: res.data.msg,
            icon: 'none',
            duration: 2000
          })
          util.verdueToken()
        } else {
          that.setData({
            showMessage: true,
            noMessage: false,
          })
          wx.showToast({
            title: res.data.msg,
            icon: 'none',
            duration: 2000
          })
        }
      }
    })
  },

  //再次申请
  again(){
    const that = this;
    let token = wx.getStorageSync('token');
    let id = that.data.id;
    wx.navigateTo({
      url: '../edit/edit?id=' + id,
    })
    
  },
  
  getHouseDetails(){
    const that = this;
    let token = wx.getStorageSync('token');
    let id = that.data.id;
    wx.showLoading({
      title: '加载中',
    })
    wx.request({
      url: dataUrl + "house/manage/personBindHouseInfo",
      method: "POST",
      data: {
        id: id
      },
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
            residenceName: res.data.data.residenceName,
            buildingName: res.data.data.buildingName,
            unitName: res.data.data.unitName,
            deviceGroupName: res.data.data.houseName,
            effectiveTime: res.data.data.effectiveTime.slice(0, 10),
            bindFailReseaon: res.data.data.bindFailReseaon,
            idNum:res.data.data.idNum
          })
        } else if (304 == res.data.code) {
          wx.showToast({
            title: res.data.msg,
            icon: 'none',
            duration: 2000
          })
          util.verdueToken()
        } else {
          that.setData({
            showMessage: true,
            noMessage: false,
          })
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