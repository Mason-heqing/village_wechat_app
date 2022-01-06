// pages/houseHold/houseHold.js
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
    changePasswordBtn:true,
    showModal:false,
    openDoorMessage:true,
    showStatus:"false",
    isFaceImg:true,
    scrollHeight:0,
    villageName: "",
    unitName: "",
    houseId:"",
    residenInfo:{
      address:"",
      devicePassword:"",
      id:"",
      residenceCallNo:"",
      unit:"",
      unitCallNo:""
    },
    tool:[
      {
        img:"../images/phone_icon.png",
        name:"呼叫顺序",
        events:"call"
      },
      {
        img: "../images/add.png",
        name: "添加住户",
        events: "add"
      },
      {
        img: "../images/openDoor_icon.png",
        name: "开门密码",
        events: "openDoor"
      },
    ],
    list:[]
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
          scrollHeight: res.windowHeight - res.windowWidth / 750 * 420
        })
      }
    });
    if(options.houseId){
       that.setData({
        houseId:options.houseId
       })
    }
  },

 //呼叫编号
  call(){
    const that = this;
    let houseId = that.data.houseId;
    wx.navigateTo({
      url: '../callOrder/callOrder?houseId=' + houseId ,
    })
    // that.setData({
    //   showModal:true
    // })
  },
 
  stopM(){
    this.setData({ openDoorMessage:false})
  },

  hiddenMask(){
    this.setData({ openDoorMessage: true })
  },

  clickMask(e) {
    this.setData({ openDoorMessage: true })
  },

  //添加住户
  add(){
    const that = this;
    let id = that.data.residenInfo.id;
    let showStatus = that.data.showStatus;
    wx.navigateTo({
      url: '../addHouseHold/addHouseHold?houseId=' + id + "&showStatus=" + showStatus,
    })
  },

  //输入密码
  inputPassword(e){
   console.log(e)
  },

  //开门密码
  openDoor(){
    const that = this;
    that.setData({
      openDoorMessage: false,
      changePasswordBtn:false,
    })
  },

  //跳转到详情页
  details(e){
    const that = this;
    let id = e.currentTarget.dataset.id;
    let showStatus = that.data.showStatus;
    wx.navigateTo({
      url: '../houseDetails/houseDetails?id=' + id + "&showStatus=" + showStatus,
    })
  },
 
  //获取住户列表
  getHouseList(){
     const that = this;
     let token = wx.getStorageSync('token');
     let appId = wx.getStorageSync('appId');
     let houseId = that.data.houseId;
    wx.showLoading({
      title: '加载中',
    })
    wx.request({
      url: dataUrl + "resident/list",
      method: "POST",
      data: {
        appId: appId,
        houseId:houseId
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
          if (res.data.data.showStatus && "true" == res.data.data.showStatus){
             that.setData({
               showStatus: res.data.data.showStatus,
               isFaceImg:false
             })
          }else{
            that.setData({
              showStatus:"false",
              isFaceImg:true
            })
          }
          if (0 < res.data.data.residens.records.length){
            res.data.data.residens.records.forEach((item, index)=>{
              if (item.faceUrl && "" != item.faceUrl){
                item.faceUrl = imgShow + item.faceUrl
              }else{
                item.faceUrl = "../images/faceImgDefault.png"
              }
            })
              that.setData({
                list: res.data.data.residens.records,
              })
            }
          if (res.data.data.residenInfo){
            // let array = res.data.data.residenInfo.address.split("/");
            // let unitName = [];
            // array.forEach((item,index)=>{
            //   if(0 != index){
            //     unitName.push(item)
            //   }
            // })
            // unitName = unitName.join("");
            that.setData({
              villageName: res.data.data.residenInfo.appName,
              unitName: res.data.data.residenInfo.address,
              residenInfo: res.data.data.residenInfo,
              houseId: res.data.data.residenInfo.id
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

  //更换开门密码
  changePasswrd(){
    const that = this;
    let token = wx.getStorageSync('token');
    let id = that.data.residenInfo.id;
    let doorPassword = that.data.residenInfo.devicePassword;
    let code = "";
    code =  Math.floor(Math.random() * 100000) + 100000
    wx.showLoading();
    wx.request({
      url: dataUrl + "door/uptpassword",
      method: "POST",
      data: {
        id:id,
        password: code
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
            title: "更换密码成功",
            icon: 'none',
            duration: 2000
          })
          that.setData({
            ["residenInfo.devicePassword"]: code
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
    that.getHouseList();
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