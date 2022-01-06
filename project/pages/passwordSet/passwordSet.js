// pages/passwordSet/passwordSet.js
import WxValidate from '../../utils/WxValidate.js'
const util = require('../../utils/util.js')
const dataUrl = util.dataUrl
const requestId = util.requestId()
const timeStamp = Date.parse(new Date())
Page({

  /**
   * 页面的初始数据
   */
  data: {
    wxAppId:'',
    tipsInfo:false,
    preventDuplication:true,
    headerTitle:"",
    type:null,
    code:"",
    appletCode:"",
    encryptedData:"",
    iv:"",
    wxFaceUrl:"",
    form: {
      phone:"",
      newPassword: "",
      againPassword: ""
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const that = this;
    let title = "";
    let wxAppId = wx.getAccountInfoSync().miniProgram.appId;
    that.setData({
      wxAppId:wxAppId
    })
    if (options.type && "1" === options.type) {
      title = "设置密码";
      that.setData({
        ["form.phone"]: options.phone,
        type: "1",
        headerTitle: "设置密码",
        tipsInfo:false,
        code: options.code
      })
    } else {
      title = "设置新密码";
      that.setData({
        ["form.phone"]: options.phone,
        type: "2",
        headerTitle: "设置新密码",
        tipsInfo: true,
        code: options.code
      })
    }

    wx.setNavigationBarTitle({
      title: title
    });

  },

  //输入新密码
  newPassword(e) {
    const that = this;
    that.setData({
      ["form.newPassword"]: e.detail.value.replace(/\s+/g, '')
    })
  },

  //再次确认密码
  againPassword(e) {
    const that = this;
    that.setData({
      ["form.againPassword"]: e.detail.value.replace(/\s+/g, '')
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
    const that = this;
    let messages = {};
    let rules = {};
    let newPassword = that.data.form["newPassword"];
    let againPassword = that.data.form["againPassword"];
    rules = {
      // oldPassword: {
      //   required: true,
      // },
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
      // oldPassword: {
      //   required: '请输入旧密码',
      // },
      newPassword: {
        required: '请输入密码',
        minlength: "密码长度最短为6位",
        maxlength: "密码长度最长为12位"
      },
      againPassword: {
        required: '再次输入密码',
        minlength: "再次输入的密码长度最短为6位",
        maxlength: "再次输入的密码长度最长为12位",
        equalTo: "您输入的密码和再次输入密码不一致,请重新设置"
      },
    }

    this.WxValidate = new WxValidate(rules, messages)
  },



  //提交表单
  formSubmit(e) {
    console.log(111, e.detail.value);
    const that = this;
    that.initValidate();
    let params = e.detail.value;
    //校验表单
    if (!this.WxValidate.checkForm(params)) {
      const error = this.WxValidate.errorList[0];
      this.showModal(error.msg)
    } else {
      //发送post请求
      let type = that.data.type;
      let parameter = "";
      if('1' == type){
        parameter = "user/miniprogram/register";
        if (that.data.preventDuplication){
          wx.showLoading({
            title: '注册中',
          });
          wx.request({
            url: dataUrl + parameter,
            method: "POST",
            data: {
              phone: e.detail.value.phone,
              password: e.detail.value.againPassword,
              code: that.data.code,
              appletCode: that.data.appletCode,
              wxFaceUrl: that.data.wxFaceUrl,
              encryptedData: that.data.encryptedData,
              iv: that.data.iv,
              WxAppId:wx.getAccountInfoSync().miniProgram.appId,
            },
            header: {
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
                  preventDuplication: true,
                })
              },3000)
              wx.hideLoading()
              console.log(res)
              if (200 == res.data.code && "SUCCESS" == res.data.msg) {
                wx.navigateTo({
                  url: '../login/login?phone=' + e.detail.value.phone + "&password=" + e.detail.value.againPassword
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
        }
      }else{
        parameter = "user/settingPassword";
        if (that.data.preventDuplication){
          wx.showLoading({
            title: '提交中',
          });
          wx.request({
            url: dataUrl + parameter,
            method: "POST",
            data: {
              phone: e.detail.value.phone,
              password: e.detail.value.againPassword,
              code: that.data.code,
            },
            header: {
              'content-type': 'application/json', // 默认值
              "type": 2,
              "requestId": requestId,
              "timestamp": timeStamp,
              "market": 'Applet',
              "version": 'none'
            },
            success(res) {
              that.setData({
                preventDuplication: true,
              })
              console.log(res)
              if (200 == res.data.code && "SUCCESS" == res.data.msg) {
                wx.navigateTo({
                  url: '../login/login?phone=' + e.detail.value.phone + "&password=" + e.detail.value.againPassword
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
        }
      }
      that.setData({
        preventDuplication: false,
      })
     
    }
  },


  // 登录
  login: function () {
    let that = this;
    wx.login({
      success: data => {
        console.log(data);
        // wx.hideTabBar({})
        // 发送 res.code 到后台换取 openId, sessionKey, unionId
        if (data.code) {
          that.setData({
            appletCode: data.code
          })
          let json = {};
          let jsonC = {}
          let jsonData = {};
          jsonData.phone = that.data.form["phone"];
          jsonData.newPassword = that.data.form["newPassword"];
          jsonData.againPassword = that.data.form["againPassword"];
          json.detail = jsonC;
          jsonC.value = jsonData;
          that.formSubmit(json)
        }
      }
    })
  },
  getUserProfile: function () {

    let that = this;
    wx.getUserProfile({
      desc: '用于完善资料', 
      success:(res)=>{
        console.log(res)
        // wx.setStorageSync('avatarUrl',res.userInfo.avatarUrl);
        // 登录
        // let userInfo = res.userInfo;
        // let encryptedData = res.encryptedData;
        // let iv = res.iv;
        that.setData({
          wxFaceUrl:res.userInfo.avatarUrl,
          encryptedData: res.encryptedData,
          iv:res.iv
        })
        that.login();
      },
      fail:(res)=>{
        wx.showToast({
          title: "获取用户信息失败",
          icon: 'none',
          duration: 2000
        })
      }
  })


    // if (e.detail.userInfo) {
    //   console.log(e.detail.userInfo)
    //   // 登录
    //   that.login();
    // }
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
    let pages = getCurrentPages();   //当前页面
    let prevPage = pages[pages.length - 2];   //上一页面
    prevPage.setData({
      sendCode: '获取验证码',
      buttonDisable: false,
      preventDuplicationCode: true
    })
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