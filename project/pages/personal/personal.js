// pages/personal/personal.js
import WxValidate from '../../utils/WxValidate.js'
const util = require('../../utils/util.js')
const dataUrl = util.dataUrl
const imgShow = util.imgShow
const requestId = util.requestId
const timeStamp = Date.parse(new Date())
const header = util.header
const localImgUrl = "../images/faceImg.png";
Page({

  /**
   * 页面的初始数据
   */
  data: {
    namesContent:false,
    closeIcon:true,
    preventDuplication: true,
    showStatus:true, //人脸是否显示隐藏
    form:{
      name:"",
      faceImg:localImgUrl
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
   const that = this;
    that.getUserInfo();
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
      header:header(token),
      success(res) {
        wx.hideLoading();
        console.log(res)
        if (200 == res.data.code && "SUCCESS" == res.data.msg) {
          if ("true" == res.data.data.showStatus){
            that.setData({
              showStatus: false
            })
          }else{
            that.setData({
              showStatus: true
            })
          }
          if ("" != res.data.data.name){
            that.setData({
              ["form.name"]: res.data.data.name,
              namesContent:true
            })
          }
          if ("" != res.data.data.faceUrl){

            that.setData({
              ["form.faceImg"]: imgShow + res.data.data.faceUrl,
              closeIcon:false
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

  //
  tirm(e){
    const that = this;
    let name = e.currentTarget.dataset.name;
    that.setData({
      ["form.name"]: e.detail.value.replace(/\s+/g, '')
    })
    if (0 < this.data.form.name.length) {
      this.setData({
        namesContent: true,
      });
    } else {
      this.setData({
        namesContent: false,
      });
    }
  },

  upfile(){
    const that = this;
    // let token = wx.getStorageSync('token');
    wx.chooseImage({
      count: 1,
      sizeType: ['compressed'],
      success(res) {
        that.setData({
          ['form.faceImg']: res.tempFilePaths[0],
          closeIcon: false,
        })
      }
    })
  },


  //删除人脸照片
  closeFaceImg() {
    const that = this;
    that.setData({
      ['form.faceImg']: localImgUrl,
      closeIcon: true,
    })
  },

  //报错 
  showModal(error) {
    wx.showModal({
      content: error,
      showCancel: false,
    })
  },

  //验证函数
  initValidate() {
    let messages = {};
    let rules = {};

    rules = {
      name: {
        required: true,
        maxlength: 20
      },
    }
    messages = {
      name: {
        required: '请填写姓名',
        maxlength: "最大支持20个字",
      },
    }
    this.WxValidate = new WxValidate(rules, messages)
  },

  //上传图片
  uploadFace(name,value){
    const that = this;
    let token = wx.getStorageSync('token');
    let appId = wx.getStorageSync('appId');
    let faceImg = "";
    wx.showLoading({
      title: '提交中',
    });
    if(-1 == value.indexOf("file/download?path=")){
      wx.uploadFile({
        url: dataUrl + "file/upload",
        filePath: value,
        name: 'file',
        header: {
          "token": token,
          "type": 2,
          "requestId": requestId(),
          "timestamp": timeStamp,
          "market": 'Applet',
          "version": 'none'
        },
        formData: {
          'appId': appId,
          type: 0
        },
        success(respon) {
          const data = JSON.parse(respon.data)
          if (200 == data.code && "SUCCESS" == data.msg) {
            console.log(data);
            // that.setData({
            //   ["form.faceImg"]: dataUrl + data.data.files[0].filePath
            // })
            that.sendInfo(name, data.data.files[0].filePath)
          }else{
            that.setData({
              preventDuplication: true
            })
            wx.hideLoading();
            wx.showToast({
              title:data.msg,
              icon: 'none',
              duration: 2000
            })
          }
          //do something

        }
      })
    }else{
      let starStr = value.indexOf("=") + 1;
      faceImg = value.substring(starStr);
      that.sendInfo(name,faceImg)
    }
    
  },

  sendInfo(name,value){
    const that = this;
    let token = wx.getStorageSync('token');
    wx.request({
      url: dataUrl + "user/submit",
      method: "POST",
      data: {
        name:name,
        filePath: value
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
        that.setData({
          preventDuplication:true
        })
        wx.hideLoading();
        console.log(res)
        if (200 == res.data.code && "SUCCESS" == res.data.msg) {
          wx.showToast({
            title: "完成设置",
            icon: 'none',
            duration: 2000
          })
          setTimeout(()=>{
            wx.navigateBack({
              delta: 1
            })
          },2000)
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

  //提交表单
  formSubmit(e){
    const that = this;
    let token = wx.getStorageSync('token');
    that.initValidate();
    let params = e.detail.value;
    console.log(e.detail.value);
    //校验表单
    if(that.data.namesContent){
      if (!that.WxValidate.checkForm(params)) {
        const error = this.WxValidate.errorList[0];
        that.showModal(error.msg)
        return false
      } else {
        //发送post请求
        if (that.data.preventDuplication){
          if (localImgUrl == e.detail.value.faceImg) {
            e.detail.value.faceImg = "";
            that.sendInfo(e.detail.value.name, e.detail.value.faceImg)
          } else {
            that.uploadFace(e.detail.value.name, that.data.form.faceImg)
          }
        }
        that.setData({
          preventDuplication:false,
        })
      }
    }
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