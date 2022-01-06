// pages/setPassword/setPassword.js
import WxValidate from '../../utils/WxValidate.js'
const util = require('../../utils/util.js')
const md5 = require('../../utils/md5.js')
const md5Key = util.md5Key
const dataUrl = util.dataUrl
const requestId = util.requestId()
const header = util.header
const timeStamp = Date.parse(new Date())
Page({

  /**
   * 页面的初始数据
   */
  data: {
    oldPasswordContent:false,
    newPasswordContent:false,
    againPasswordContent:false,
    preventDuplication: true,
    form:{
      oldPassword:"",
      newPassword:"",
      againPassword:""
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const that = this;
  },
  
  //输入旧密码
  oldPassword(e){
    const that = this;
    that.setData({
      ["form.oldPassword"]: e.detail.value.replace(/\s+/g, '')
    })
    if (0 < this.data.form.oldPassword.length) {
      this.setData({
        oldPasswordContent: true,
      });
    } else {
      this.setData({
        oldPasswordContent: false,
      });
    }
    
  },

  //输入新密码
  newPassword(e){
    const that = this;
    that.setData({
      ["form.newPassword"]: e.detail.value.replace(/\s+/g, '')
    })
    if (0 < this.data.form.newPassword.length) {
      this.setData({
        newPasswordContent: true,
      });
    } else {
      this.setData({
        newPasswordContent: false,
      });
    }
  },

  //再次确认密码
  againPassword(e) {
    const that = this;
    that.setData({
      ["form.againPassword"]: e.detail.value.replace(/\s+/g, '')
    })
    if (0 < this.data.form.againPassword.length) {
      this.setData({
        againPasswordContent: true,
      });
    } else {
      this.setData({
        againPasswordContent: false,
      });
    }
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
    const that = this;
    let messages = {};
    let rules = {};
    let newPassword = that.data.form["newPassword"];
    let againPassword = that.data.form["againPassword"];
    rules = {
      oldPassword: {
        required: true,
      },
      newPassword: {
        required: true,
        minlength: 6,
        maxlength: 12
      },
      againPassword: {
        required: true,
        minlength: 6,
        maxlength: 12,
        equalTo: newPassword
      },
    }
    messages = {
      oldPassword: {
        required: '请输入旧密码',
      },
      newPassword: {
        required: '请输入新密码',
        minlength:"新密码长度最短为6位",
        maxlength: "新密码长度最长为12位"
      },
      againPassword: {
        required: '再次输入新密码',
        minlength: "再次输入的新密码长度最短为6位",
        maxlength: "再次输入的新密码长度最长为12位",
        equalTo:"您输入的新密码和再次输入新密码不一致,请重新设置"
      },
    }



    this.WxValidate = new WxValidate(rules, messages)
  },

 

  //提交表单
  formSubmit(e){
    console.log(111,e.detail.value);
    const that = this;
    let token = wx.getStorageSync('token');
    that.initValidate();
    let params = e.detail.value;
    //校验表单
    if (!this.WxValidate.checkForm(params)) {
      const error = this.WxValidate.errorList[0];
      this.showModal(error.msg)
    } else {
      //发送post请求
      if (that.data.preventDuplication){
        wx.showLoading({
          title: '提交中',
        });
        wx.request({
          url: dataUrl + "user/modifyPassword",
          method: "POST",
          data: {
            oldPassword: e.detail.value.oldPassword,
            password: e.detail.value.againPassword,
          },
          header:header(token),
          // header: {
          //   'content-type': 'application/json', // 默认值
          //   "token": token,
          //   "type": 2,
          //   "requestId": requestId,
          //   "timestamp": timeStamp,
          //   "market": 'Applet',
          //   "version": 'none'
          // },
          success(res) {
            setTimeout(() => {
              that.setData({
                preventDuplication: true
              })
            }, 3000)
            wx.hideLoading();
            console.log(res)
            if (200 == res.data.code && "SUCCESS" == res.data.msg) {
              wx.showToast({
                title: "密码修改成功",
                icon: 'none',
                duration: 2000
              })
              setTimeout(() => {
                wx.reLaunch({
                  url: '../login/login'
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
              wx.showToast({
                title: res.data.msg,
                icon: 'none',
                duration: 2000
              })
            }
          }
        })
      }
      that.setData({
        preventDuplication:false
      })
      
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