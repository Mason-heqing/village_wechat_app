// pages/roomChange/roomChange.js
const util = require('../../utils/util.js')
const dataUrl = util.dataUrl
const requestId = util.requestId
const header = util.header
const timeStamp = Date.parse(new Date())
Page({

  /**
   * 页面的初始数据
   */
  data: {
    showMessage: true,
    noMessage: false,
    searchLeft:252,
    inputText: "center",
    villageName:'',
    inputValue:"",
    list:[]
  },


  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const that = this;
    that.getRoomList("");
  },


  //输入信息
  inputBind(e) {
    console.log(e.detail.value);
    const that = this;
    let token = wx.getStorageSync('token');
    that.setData({
      inputValue: e.detail.value.trim()
    })
    // wx.request({
    //   url: dataUrl + "homepage/queryAppHouse",
    //   method: "POST",
    //   data: {
    //     appName: e.detail.value.trim(),
    //     personId: ""
    //   },
    //   header: {
    //     'content-type': 'application/json', // 默认值
    //     "token": token,
    //     "type": 2,
    //     "requestId": requestId(),
    //     "timestamp": timeStamp,
    //     "market": 'Applet',
    //     "version": 'none'
    //   },
    //   success(res) {
    //     wx.hideLoading();
    //     console.log(res)
    //     if (200 == res.data.code && "SUCCESS" == res.data.msg) {
    //       if (0 < res.data.data.length) {
    //         that.setData({
    //           showMessage: false,
    //           noMessage:true,
    //           list: res.data.data
    //         })
    //       } else {
    //         that.setData({
    //           showMessage: true,
    //           noMessage: false,
    //           list: []
    //         })
    //       }
    //     } else if (304 == res.data.code) {
    //       wx.showToast({
    //         title: res.data.msg,
    //         icon: 'none',
    //         duration: 2000
    //       })
    //       util.verdueToken()
    //     } else {
    //       that.setData({
    //         showMessage: true,
    //         noMessage: false,
    //       })
    //       wx.showToast({
    //         title: res.data.msg,
    //         icon: 'none',
    //         duration: 2000
    //       })
    //     }
    //   }
    // })
  },

  //聚焦输入信息
  bindfocus(e) {
    const that = this;
    if ("focus" == e.type) {
      that.setData({
        inputText: "left",
        searchLeft: 60,
      })
    }
  },

  //失焦触发
  bindblur(e) {
    const that = this;
    if ("blur" == e.type) {
      if ("" != that.data.inputValue.trim()) {
        that.setData({
          searchLeft: 60,
          inputText: "left",
        })
      } else {
        that.setData({
          searchLeft: 252,
          inputText: "center",
        })
        that.blurRef("");
      }
    }
  },


  //失焦刷新
  blurRef(value){
   const that = this;
   let token = wx.getStorageSync('token');
   let id = that.data.id;
   wx.request({
     url: dataUrl + "homepage/queryAppHouse",
     method: "POST",
     data: {
       appName: value,
       personId: ""
     },
     header:header(token),
    //  header: {
    //    'content-type': 'application/json', // 默认值
    //    "token": token,
    //    "type": 2,
    //    "requestId": requestId(),
    //    "timestamp": timeStamp,
    //    "market": 'Applet',
    //    "version": 'none'
    //  },
     success(res) {
       wx.hideLoading();
       console.log(res)
       if (200 == res.data.code && "SUCCESS" == res.data.msg) {
         if (0 < res.data.data.length) {
           that.setData({
             showMessage: false,
             noMessage: true,
             list: res.data.data
           })
         } else {
           that.setData({
             showMessage: true,
             noMessage: false,
             list: []
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


  //按小区名称进行搜索
  search(){
    const that = this;
    let value = that.data.inputValue.trim();
    that.getRoomList(value)
  },

  //键盘搜索按钮
  bindconfirm(){
    const that = this;
    let value = that.data.inputValue.trim();
    that.getRoomList(value)
  },
 
  //获取户室列表
  getRoomList(value){
    const that = this;
    let token = wx.getStorageSync('token');
    let id = that.data.id;
    // let appId = wx.getStorageSync('appId');
    wx.showLoading({
      title: '加载中',
    })
    wx.request({
      url: dataUrl + "homepage/queryAppHouse",
      method: "POST",
      data: {
        appName:value,
        personId: ""
      },
      header:header(token),
      // header: {
      //   'content-type': 'application/json', // 默认值
      //   "token": token,
      //   "type": 2,
      //   "requestId": requestId(),
      //   "timestamp": timeStamp,
      //   "market": 'Applet',
      //   "version": 'none'
      // },
      success(res) {
        wx.hideLoading();
        console.log(res,'小区列表@@@@')
        if (200 == res.data.code && "SUCCESS" == res.data.msg) {
          if (0 < res.data.data.length){
             that.setData({
               showMessage: false,
               noMessage: true,
               list: res.data.data
             })
          }else{
            that.setData({
              showMessage: true,
              noMessage: false,
              list: []
            })
          }
        } else if (304 == res.data.code) {
          wx.showToast({
            title: res.data.msg,
            icon: 'none',
            duration: 2000
          })
          util.verdueToken()
        }else{
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
 
 

  roomChange(e){
    const that = this;
    let token = wx.getStorageSync('token');
    let houseId = e.currentTarget.dataset.houseid;
    wx.showLoading();
    wx.request({
      url: dataUrl + "homepage/changeApp",
      method: "POST",
      data: {
        houseId: houseId
      },
      header:header(token),
      // header: {
      //   'content-type': 'application/json', // 默认值
      //   "token": token,
      //   "type": 2,
      //   "requestId": requestId(),
      //   "timestamp": timeStamp,
      //   "market": 'Applet',
      //   "version": 'none'
      // },
      success(res) {
        wx.hideLoading();
        console.log(res)
        if (200 == res.data.code && "SUCCESS" == res.data.msg) {
          wx.showToast({
            title: "户室切换成功",
            icon: 'none',
            duration: 2000
          })
          if (res.data.data.token){
            wx.setStorageSync("token", res.data.data.token)
            wx.setStorageSync("appId", res.data.data.appId)
            wx.setStorageSync('personSubtype', res.data.data.personSubtype);
          }
          let pages = getCurrentPages();   //当前页面
          let prevPage = pages[pages.length - 2];   //上一页面
          wx.navigateBack({
            delta: 1
          })
          prevPage.onLoad();
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
    let value = that.data.inputValue.trim();
    that.getRoomList(value)
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