// pages/houseDetails/houseDetails.js
import WxValidate from '../../utils/WxValidate.js'
const util = require('../../utils/util.js')
const dataUrl = util.dataUrl
const requestId = util.requestId
const imgShow = util.imgShow
const timeStamp = Date.parse(new Date())
Page({

  /**
   * 页面的初始数据
   */
  data: {
    openDoorMessage:false,
    editWidth:8,
    textareaWidth:92,
    editIcon:false,
    showStatus:true,
    faceImg:"../images/faceImgDefault.png",
    name:"",
    idNo:"",
    phone:"",
    houseType:"",
    date:"",
    id:"",
    personSubtype:null,
    bindStatus:null,
    icNum:"",
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const that = this;
    if (options && options.id){
      that.setData({
        id: options.id
      })
    }
    if (options && options.showStatus){
      if ("true" == options.showStatus){
         that.setData({
           showStatus:false
         })
       }else{
        that.setData({
          showStatus: true
        })
       }
    } 
    that.getHouseDetails();
  },


  //点击拒绝按钮
  reject(){
   const that = this;
   that.setData({
     openDoorMessage:true
   })
  },

  //聚焦内容时
  bindTextAreaFocus(e){
    const that = this;
    if ("focus" == e.type){
      that.setData({
        editWidth: 0,
        textareaWidth: 100,
        editIcon: true,
      })
    }
  },
  
  //获取住户信息
  getHouseDetails(){
    const that = this;
    let token = wx.getStorageSync('token');
    let id = that.data.id;
    wx.showLoading({
      title: '加载中',
    })
    wx.request({
      url: dataUrl + "resident/detail",
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
            bindStatus: res.data.data.bindStatus
          })
          if (res.data.data.faceUrl && "" != res.data.data.faceUrl){
            that.setData({
              faceImg: imgShow + res.data.data.faceUrl
            })
          }else{
            that.setData({
              faceImg: "../images/faceImgDefault.png"
            })
          }
          if (res.data.data.effectiveTime){
            let currentDate = new Date().getFullYear();
            let selectData = res.data.data.effectiveTime.split('-')[0];
            if (parseInt(selectData) - parseInt(currentDate) > 70){
              that.setData({
                date: "永久"
              })
            }else{
              that.setData({
                date: res.data.data.effectiveTime
              })
            }
           }
          if (res.data.data.personName){
            that.setData({
              name: res.data.data.personName
            })
           }
          if (res.data.data.personSubtype){
            that.setData({
              personSubtype: res.data.data.personSubtype
            })
            if (1 === res.data.data.personSubtype) {
              that.setData({
                houseType: "户主"
              })
            } else if (2 === res.data.data.personSubtype) {
              that.setData({
                houseType: "家属"
              })
            } else if (3 === res.data.data.personSubtype) {
              that.setData({
                houseType: "租客"
              })
            }else if(5 === res.data.data.personSubtype){
              that.setData({
                houseType: "其他"
              })
            }
           }
          if (res.data.data.idNum){
            that.setData({
              idNo: res.data.data.idNum
            })
           }
           if (res.data.data.icNum){
            that.setData({
              icNum: res.data.data.icNum
            })
           }
          if (res.data.data.phone) {
            that.setData({
              phone: res.data.data.phone
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
  
  //提交拒绝审核
  modalConfirm(){
    console.log("提交审核信息 ");
    const that = this;
    that.submitExamine(2)
  },

  //提交同意审核
  ok(){
    const that = this;
    that.submitExamine(1)
  },

  //提交取消申请
  cancel(){
    const that = this;
    that.submitExamine(8)
  },
  
  //删除该用户
  deletes(){
    const that = this;
    let token = wx.getStorageSync('token');
    let id = that.data.id;
    wx.showLoading();
    wx.request({
      url: dataUrl + "resident/del",
      method: "POST",
      data: {
        id: id,
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
              delta: 1
            })
          }, 2000);
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

  //提交审核信息  根据状态提交审核 bindStatus
  //                             1 通过
  //                             2 未通过
  //                             8 取消
  submitExamine(value){
    const that = this;
    let token = wx.getStorageSync('token');
    let id = that.data.id;
    let appId = wx.getStorageSync('appId');
    wx.showLoading();
    wx.request({
      url: dataUrl + "resident/audit/tenement",
      method: "POST",
      data: {
        id:id,
        bindStatus:value,
        appId: appId
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
          if(1 == value){
            wx.showToast({
              title: "审核通过成功", 
              icon: 'none',
              duration: 2000
            })
          } else if (2 == value){
            wx.showToast({
              title: "审核拒绝成功",
              icon: 'none',
              duration: 2000
            })
          }else if(8 == value){
            wx.showToast({
              title: "取消申请成功",
              icon: 'none',
              duration: 2000
            })
          }
         setTimeout(()=>{
           wx.navigateBack({
             delta: 1
           })
         },2000);
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