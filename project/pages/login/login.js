//logs.js
import WxValidate from '../../utils/WxValidate.js'
const util = require('../../utils/util.js')
const dataUrl = util.dataUrl
const requestId = util.requestId()
const timeStamp = Date.parse(new Date())
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    wxAppId:'',
    phoneContent:false,
    passwordContent:false,
    preventDuplication:true,
    form:{
      phone:"",
      password:"",
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const that = this;
    // console.log("获取小程序信息---》",wx.getAccountInfoSync())
    let wxAppId = wx.getAccountInfoSync().miniProgram.appId;
    let title = '';
    if('wxd519face30907864' == wxAppId){
      title = '小Q安居管家';
    }else if('wx78a03393552c2ceb' == wxAppId){
      title = '任脸行智慧社区';
    }
    wx.setNavigationBarTitle({
      title:title
    })
    that.setData({
      wxAppId:wxAppId,
    })
    if (options && options.phone && options.password){
      that.setData({
        ["form.phone"]: options.phone,
        ["form.password"]: options.password,
        phoneContent: true,
        passwordContent: true,
      })
    }
  },


 //注册
  register(){
    wx.navigateTo({
      url: '../forgetPassword/forgetPassword?type=1' 
    })
  },

  //忘记密码
  forgetPassword(){
    wx.navigateTo({
      url: '../forgetPassword/forgetPassword?type=2'
    })
  },

  //输入手机号码
  phoneInput: function (e) {
    let that = this;
    let value = this.validateNumber(e.detail.value)
    that.setData({
      ["form.phone"]: value
    })
    if (11 === this.data.form.phone.length) {
      this.setData({
        phoneContent: true,
      });
    } else {
      this.setData({
        phoneContent: false,
      });
    }
  },
  validateNumber(val) {
    return val.replace(/\D/g, '')
  },

  //输入密码
  passwordInput(e){
    let that = this;
    that.setData({
      ["form.password"]: e.detail.value.replace(/\s+/g, '')
    })
    if (0 < this.data.form.password.length) {
      this.setData({
        passwordContent: true,
      });
    } else {
      this.setData({
        passwordContent: false,
      });
    }
  },


  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    
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
    rules = {
      phone: {
        required: true,
        
        // tel: true
      },
      password: {
        required: true,
        minlength: 6,
        maxlength: 12,
      },
    }
    messages = {
      phone: {
        required: '请输入手机号码',
        // tel:"请输入正确格式的手机号码"
      },
      password: {
        required: '请输入密码',
        minlength: "密码长度最短为6位",
        maxlength: "密码长度最长为12位"
      },
    }

    this.WxValidate = new WxValidate(rules, messages)
  },

  //提交表单
  formSubmit(e){
    const that = this;
    that.initValidate()
    let params = e.detail.value;
    if (that.data.phoneContent && that.data.passwordContent){
      //校验表单
      if (!this.WxValidate.checkForm(params)) {
        const error = this.WxValidate.errorList[0];
        this.showModal(error.msg)
        return false
      } else {
        //发送post请求
        if (that.data.preventDuplication){
          wx.showLoading({
            title: '登录中',
          })
          wx.login({
            success: data => {
              console.log(data);
              // wx.hideTabBar({})
              // 发送 res.code 到后台换取 openId, sessionKey, unionId
              if (data.code) {
                wx.request({
                  url: dataUrl + "user/login",
                  method: "POST",
                  data: {
                    phone: e.detail.value.phone,
                    password: e.detail.value.password,
                    // wxAppId:wx.getAccountInfoSync().miniProgram.appId,
                    appletCode:data.code
                  },
                  header: {
                    "wxAppId":wx.getAccountInfoSync().miniProgram.appId,
                    'content-type': 'application/json', // 默认值
                    "type": 2,
                    "requestId": requestId,
                    "timestamp": timeStamp,
                    "market": 'Applet',
                    "version": 'none'
                  },
                  success(res) {
                    setTimeout(()=>{
                      that.setData({
                        preventDuplication: true
                      })
                    },3000)
                    wx.hideLoading()
                    console.log(res)
                    if (200 == res.data.code && "SUCCESS" == res.data.msg) {
                      wx.setStorageSync('token', res.data.data.token);
                      wx.setStorageSync('telephone', e.detail.value.phone);
                      wx.setStorageSync('personSubtype', res.data.data.personSubtype);
                      wx.setStorageSync('appId', res.data.data.appId);
                      if ("" != app.globalData.decode){
                        wx.reLaunch({
                          url: '../decode/decode'
                        })
                      }else{
                        wx.switchTab({
                          url: '../index/index'
                        })
                      }
                    
                    } else {
                      wx.showToast({
                        title: res.data.msg,
                        icon: 'none',
                        duration: 2000
                      })
                    }
                  }
                })
              } else {
                wx.hideLoading();
                wx.showToast({
                  title: '登录失败！' + res.errMsg,
                  icon: 'none',
                  duration: 2000
                })
              }
            }
          })
          
        }
        that.setData({
          preventDuplication: false
        })
      }
    }
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
