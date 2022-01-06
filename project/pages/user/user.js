// pages/user/user.js
const util = require('../../utils/util.js')
const dataUrl = util.dataUrl
const requestId = util.requestId
const header = util.header
const imgShow = util.imgShow
const timeStamp = Date.parse(new Date())
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    openDoorMessage:false,
    showStatus: true, //是否显示人脸图片
    tool:["访客授权记录","举报投诉记录","房屋修报记录"],
    personName:"",
    faceImg:"../images/faceImgDefault.png",
    service:[
      {
        image:"../images/user_houseHold_icon.png",
        text:"房屋管理",
        event:"house"
      },
      {
        image:"../images/user_complaint_icon.png",
        text:"我的二维码",
        event:"MyQrCode"
      },
      {
        image: "../images/user_visitor_icon.png",
        text: "我的预约",
        event:"visitorAppointment"
      },
      {
        image: "../images/user_visitor_icon.png",
        text: "我的访客",
        event:"myVisitor"
      },
      
      // {
      //   image: "../images/user_visitor_icon.png",
      //   text: "我的车辆",
      //   event:"myVehicle"
      // },
      {
        image: "../images/user_complaint_icon.png",
        text: "举报记录",
        event: "reportRecord"
      },
      {
        image: "../images/user_repair_icon.png",
        text: "报修记录",
        event: "repairRecord"
      },
      {
        image: "../images/user_set_icon.png",
        text: "我的设置",
        event: "mySet"
      },
    ]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.setNavigationBarTitle({
      title: '我的'
    })
    wx.setNavigationBarColor({
      frontColor: '#ffffff',
      backgroundColor: '#5656ED',
    })
  },

 //是否登录
  isLogin(){
    let token = wx.getStorageSync('token');
    // if (!token){
    //   wx.navigateTo({
    //     url: '../login/login',
    //   })
    // }
    wx.navigateTo({
      url: '../login/login',
    })
  },

  //个人中心
  personal(){
    let token = wx.getStorageSync('token');
    if (token){
      wx.navigateTo({
        url: '../personal/personal',
      })
    }else{
      util.notLogin(token);
    }
    
  },

 //房屋管理
  house() {
    const that = this;
    let token = wx.getStorageSync('token');
    if (token) {
      wx.navigateTo({
        url: '../administration/administration',
      })
    } else {
      util.notLogin(token);
    }
  },
  MyQrCode() {
    const that = this;
    let token = wx.getStorageSync('token');
    if (token) {
      wx.navigateTo({
        url: '../../pages/userQrCode/userQrCode',
      })
    } else {
      util.notLogin(token);
    }
  },
  //图片预览
  previewImg(e) {
    const that = this;
    let src = e.currentTarget.dataset.img;;//获取data-src
    let imgList = [src];//获取data-list
    //图片预览
    if ("../images/faceImgDefault.png" != src){
      wx.previewImage({
        current: src, // 当前显示图片的http链接
        urls: imgList // 需要预览的图片http链接列表
      })
    }
    
  },

  //访客预约
  visitorAppointment(){
    let token = wx.getStorageSync('token');
    if (token) {
      wx.navigateTo({
        url: '../makeVisitor/makeVisitor',
      })
    } else {
      util.notLogin(token);
    }
  },

  //我的访客
  myVisitor(){
    let token = wx.getStorageSync('token');
    if (token) {
      wx.navigateTo({
        url: '../myVisitor/myVisitor',
      })
    } else {
      util.notLogin(token);
    }
  },
// 我的车辆
myVehicle() {
  wx.navigateTo({
    url: '../myVehicle/myVehicle',
  })
},

//举报记录
  reportRecord(){
    let token = wx.getStorageSync('token');
    let isLogin = app.globalData.isLogin; 
    if (token){
      if (isLogin){
        wx.navigateTo({
          url: '../reportList/reportList?type=1',
        })
      }else{
        wx.navigateTo({
          url: '../administration/administration',
        })
      }
    }else{
      util.notLogin(token);
    }
  },

  //报修记录
  repairRecord(){
    let token = wx.getStorageSync('token');
    let isLogin = app.globalData.isLogin; 
    if (token){
      if (isLogin){
        wx.navigateTo({
          url: '../reportList/reportList?type=2',
        })
      }else{
        wx.navigateTo({
          url: '../administration/administration',
        })
      }
    }else{
      util.notLogin(token);
    }
  },

  //我的设置
  mySet(){
    let token = wx.getStorageSync('token');
    if (token){
      wx.navigateTo({
        url: '../mySet/mySet',
      })
    }else{
      util.notLogin(token);
    }
    
  },

  //提示信息(确定))
  modalConfirm(){
  const that = this;
    wx.navigateTo({
      url: '../personal/personal',
    })
  },
  
  //获取个人信息
  getUserInfo(){
    const that = this;
    let token = wx.getStorageSync('token');
    wx.showLoading({
      title: '加载中',
    })
    wx.request({
      url: dataUrl + "user/detail",
      method: "POST",
      data: {},
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
          if ("true" == res.data.data.showStatus){
            that.setData({
              showStatus:false
            })
          }else{
            that.setData({
              showStatus: true
            })
          }
          if ("" != res.data.data.faceUrl){
            console.log(imgShow + res.data.data.faceUrl)
            that.setData({
              faceImg: imgShow + res.data.data.faceUrl
            })
          }else{
            that.setData({
              faceImg: "../images/faceImgDefault.png"
            })
          }
          that.setData({
            personName:res.data.data.name,
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
    let token = wx.getStorageSync('token');
    if (token){
      that.getUserInfo();
    }
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