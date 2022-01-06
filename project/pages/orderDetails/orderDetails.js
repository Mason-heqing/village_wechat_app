// pages/orderDetails/orderDetails.js
import WxValidate from '../../utils/WxValidate.js'
const util = require('../../utils/util.js')
const dataUrl = util.dataUrl
const imgShow = util.imgShow
const requestId = util.requestId
const header = util.header
const timeStamp = Date.parse(new Date())
Page({

  /**
   * 页面的初始数据
   */
  data: {
    id:"",
    type:null, //区分上一级
    address:"",
    doorPassword:"",
    phone:"",
    faceUrl:"",
    name:"",
    status:"",
    visitDate:"",
    outPage:false,
    cancelBtn:false,
    isFaceImg:true //是否显示隐藏人脸图片
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const that = this;
    console.log("传参书-->",options)
    if (options && options.id){
      that.setData({
        id: options.id
      })
   }
    if (options && options.type){
      that.setData({
        type:options.type
      })
   }
    that.isShowFace()
    that.getVisitor()
  },

  //根据人员信息获取人脸图片权限
  isShowFace() {
    const that = this;
    let token = wx.getStorageSync('token');
    wx.request({
      url: dataUrl + "user/detail",
      method: "POST",
      data: {},
      header:header(token),
      success(res) {
        console.log(res)
        if (200 == res.data.code && "SUCCESS" == res.data.msg) {
          if ("true" == res.data.data.showStatus) {
            that.setData({
              isFaceImg: false
            })
          } else {
            that.setData({
              isFaceImg: true
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
  

  //获取访客通行信息
  getVisitor(){
    const that = this;
    let token = wx.getStorageSync('token');
    wx.showLoading({
      title: '加载中',
    });
    wx.request({
      url: dataUrl + "visit/passport",
      method: "POST",
      data: {
        id:that.data.id,
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
          if (res.data.data.faceUrl){
            res.data.data.faceUrl = imgShow + res.data.data.faceUrl
          }else{
            res.data.data.faceUrl = "";
          }
          if (res.data.data.status && 1 == res.data.data.status){
            that.setData({
              cancelBtn:true
            })
          }
          that.setData({
            address: res.data.data.address.replace(/\//g, ""),
            doorPassword: res.data.data.doorPassword,
            faceUrl: res.data.data.faceUrl,
            name: res.data.data.name,
            phone: res.data.data.phone,
            status: res.data.data.status,
            visitDate: res.data.data.visitDate.slice(0, 10),
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

  //取消预约
  authorization(e){
    const that = this;
    let token = wx.getStorageSync('token');
    let url = e.currentTarget.dataset.url;
    let type = that.data.type;
    wx.showLoading();
    wx.request({
      url: dataUrl + url,
      method: "POST",
      data: {
        id: that.data.id,
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
          that.setData({
            outPage:true
          })
          if ("visit/cancel" == url){
            wx.showToast({
              title:"取消预约成功",
              icon: 'none',
              duration: 2000
            })
          }else{
            wx.showToast({
              title: "再次授权成功",
              icon: 'none',
              duration: 2000
            })
          }

          setTimeout(() => {
            wx.navigateBack({
              delta: 1,  // 返回上一级页面。
            })
          }, 2000)
          // if (type && "1" == type){
          //   setTimeout(() => {
          //     wx.navigateBack({
          //       delta: 1,  // 返回上一级页面。
          //     })
          //   }, 2000)
          // }else{
          //   setTimeout(() => {
          //     wx.switchTab({
          //       url: '../index/index'
          //     })
          //   }, 2000)
          // }
          
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

  //再次预约
  again(){
    const that = this;
    let id = that.data.id;
    console.log("id--->",id)
    wx.navigateTo({
      url: '../authorization/authorization?id=' + id
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
    const that = this;
    let type = that.data.type;
    let pages = getCurrentPages();
    let outPage = that.data.outPage
    let backPages = null;   
    if(type && "1" == type){
      if (!outPage){
        // wx.navigateBack({
        //    delta:0,  // 返回上一级页面。
        // })
      }else{
        
      }
    }else{
      if (that.data.cancelBtn){
        if (!outPage){
          pages.forEach((item, index) => {
            console.log("page-->item--->", item.route)
            if ("pages/authorizationRecord/authorizationRecord" == item.route) {
              backPages = index;
            }
          })
          wx.navigateBack({
            delta: backPages + 1,  // 返回上上一级页面。
          })
        }
      }else{
        wx.navigateBack({
          delta: 2,  // 返回上上一级页面。
        })
      }
    }
    
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