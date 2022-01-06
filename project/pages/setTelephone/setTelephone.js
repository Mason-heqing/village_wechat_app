// pages/setTelephone/setTelephone.js
import WxValidate from '../../utils/WxValidate.js'
const util = require('../../utils/util.js')
const md5 = require('../../utils/md5.js')
const md5Key = util.md5Key
const dataUrl = util.dataUrl
const requestId = util.requestId()
const header = util.header
const timeStamp = Date.parse(new Date())
let count = 60
Page({

  /**
   * 页面的初始数据
   */
  data: {
    phoneContent:false,
    codeContent:false,
    sendCode: "获取验证码",
    codeColor:"#5656ED",
    buttonDisable: false,
    currentPhone:"",
    intervalId: null,
    preventDuplication:true,
    preventDuplicationCode:true,
    form:{ 
     phone:"",
     code:""
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const that = this;
    let telephone = wx.getStorageSync('telephone');
    let tele = telephone.substr(0, 3) + " ";
    let phone = telephone.substr(3, 4) + " ";
    let lastF = telephone.substr(7, 4);
    that.setData({
      currentPhone: tele + " " + phone + " " + lastF,
    })
  },
  
 //输入手机号码
  phone: function (e) {
    let that = this;
    let value = this.validateNumber(e.detail.value)
    that.setData({
      ["form.phone"]: value
    })
    if (11 == this.data.form.phone.length) {
      this.setData({
        phoneContent: true,
      });
    } else {
      this.setData({
        phoneContent: false,
      });
    }
  },


  code: function (e) {
    let that = this;
    let value = this.validateNumber(e.detail.value)
    that.setData({
      ["form.code"]: value
    })
    if (6 == this.data.form.code.length) {
      // this.setData({
      //   codeContent: true,
      // });
      that.checkCode(value)
    } else {
      this.setData({
        codeContent: false,
      });
    }
  },
  validateNumber(val) {
    return val.replace(/\D/g, '')
  },

  //验证函数
  initValidate() {
    const that = this;
    let messages = {};
    let rules = {};
    rules = {
      phone: {
        required: true,
        tel:true
      },
      code: {
        required: true,
      },
    }
    messages = {
      phone: {
        required: '请输入新的手机号码',
        tel:"请输入有效的11位手机号码",

      },
      code: {
        required: '请输入验证码',
      },
    }



    this.WxValidate = new WxValidate(rules, messages)
  },


  //报错 
  showModal(error) {
    wx.showModal({
      content: error,
      showCancel: false,
    })
  },


  //发送验证码请求
  sendCode() {
    const that = this;
    let phone = that.data.form["phone"];
    let changePhonetimestamp = Date.parse(new Date());
    if (!(/^1[3456789]\d{9}$/.test(phone))) {
      wx.showModal({
        content: "请输入正确的11位新手机号码",
        showCancel: false,
      })
      return false;
    } else {
      let buttonDisable = that.data.buttonDisable;
      if (!buttonDisable) {
        console.log("请求验证码");
        if (that.data.preventDuplicationCode){
          wx.request({
            url: dataUrl + "user/getCode",
            method: "POST",
            data: {
              phone: phone,
              timestamp: changePhonetimestamp,
              sign: md5.hexMD5(phone + changePhonetimestamp + 3 + md5Key).toUpperCase(), //正式环境
              //sign: md5.hexMD5(phone + timeStamp ).toUpperCase(), //开发测试
              type: 3
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
              console.log(res)
              if (200 == res.data.code && "SUCCESS" == res.data.msg) {
                // that.setData({
                //   ["form.code"]: res.data.data.code
                // })
                wx.setStorageSync("changePhonetimestamp", changePhonetimestamp)

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
          that.setData({
            intervalId: setInterval(function () {
              count -= 1;
              that.setData({
                sendCode: "(" + count + "s)" + '重新获取',
                buttonDisable: true,
                codeColor: "#999"
              })
              if (count == 0) {
                clearInterval(that.data.intervalId);  //倒计时结束，停止interval
                that.setData({
                  sendCode: '获取验证码',
                  buttonDisable: false,
                  codeColor: "#5656ED",
                  preventDuplicationCode: true
                })
                count = 60;
              }
            }, 1000)
          })
        }
        that.setData({
          preventDuplicationCode:false
        })
        
      }

    }

  },

  
  //校验验证码
  checkCode(value){
    const that = this;
    let token = wx.getStorageSync('token');
    let phone = that.data.form.phone;
    wx.request({
      url: dataUrl + "user/verifiCode",
      method: "POST",
      data: {
        phone: phone,
        code:value,
        timestamp: wx.getStorageSync("changePhonetimestamp"),
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
        wx.hideLoading();
        console.log(res)
        if (200 == res.data.code && "SUCCESS" == res.data.msg) {
          that.setData({
            codeContent: true,
          });
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
          that.setData({
            codeContent: true,
          });
        }
      }
    })
  },


 //发送表单信息
  formSubmit(e){
    const that = this;
    that.initValidate();
    let params = e.detail.value;
    let token = wx.getStorageSync('token');
    //校验表单
    if (!this.WxValidate.checkForm(params)) {
      const error = this.WxValidate.errorList[0];
      this.showModal(error.msg)
    } else {
      //发送post请求 校验手机验证码
      if (that.data.preventDuplication){
        wx.showLoading({
          title: '提交中',
        });
        wx.request({
          url: dataUrl + "user/changePhone",
          method: "POST",
          data: {
            phone: e.detail.value.phone,
            code: e.detail.value.code,
            // timestamp: wx.getStorageSync("changePhonetimestamp"),
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
            setTimeout(()=>{
               that.setData({
                 preventDuplication:true
               })
            },3000)
            wx.hideLoading();
            console.log(res)
            if (200 == res.data.code && "SUCCESS" == res.data.msg) {
              wx.showToast({
                title: "更换绑定手机号成功",
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