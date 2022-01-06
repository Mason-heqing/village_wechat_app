// pages/firmShare/firmShare.js
import WxValidate from '../../utils/WxValidate.js'
const util = require('../../utils/util.js')
const dataUrl = util.dataUrl
const requestId = util.requestId
const timeStamp = Date.parse(new Date())
const header = util.header
const imgShow = util.imgShow
const localImgUrl = "../images/faceImg.png";
// const data = (util.formatTime(new Date())).slice(0, 10);
const data = new Date().toLocaleDateString().replace(/\//g,'-')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    isRealName:false,
    isModalShow:false,
    namesContent:false,
    phoneContent:false,
    idNumContent:false,
    faceImg:false,
    personInfo: false,
    camera: true,
    faceEnabled: true,
    isFaceImg:true, //是否显示人脸图片
    position: 'back',
    uploadInfo: true,
    isIdcard: false,
    close:true,
    preventDuplication:true,
    timesColor: "#999",
    visitorTimes:false,
    date: data,
    existenceImg:"",
    visitPersonId:'',
    appId:'',
    visitPerson:'',
    isFaceUrl:'',
    form: {
      appId: "",//应用ID
      faceUrl: localImgUrl,//人脸图片
      name: '',//来访人姓名
      idNum: '',//身份证号
      phone: '',//手机号码
      numberPlate:'',//车牌号
      visitDate:"请选择到访时间",//访问日期
      visitAddress:"",//访问地址
      visitPerson:'',//被访人姓名
      visitPersonId:'',//访问单元
      houseId:"",//访问单元
      code:'',
      WxAppId:''
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const that = this;
    console.log("传参数---》",options)
    if (options.visitAddress){
        that.setData({
          ["form.visitAddress"]: options.visitAddress,
          visitPerson:options.visitPerson,
          visitPersonId:options.visitPersonId,
          ["form.houseId"]: options.houseId,
          appId:options.appId,
        })
    }
    that.isShowFace()
    that.initValidate()
    
  },

  //选择到访时间
  bindMultiPickerChange(e){
    console.log(e.detail.value)
    const that = this;
    that.setData({
      ["form.visitDate"]: e.detail.value,
      timesColor:"#333",
      visitorTimes:true
    })
  },

  trimIdNum(e){
    if(this.data.isRealName){
      if('' != e.detail.value){
        this.setData({
          idNumContent:true
        })
      }else{
        this.setData({
          idNumContent:false
        })
      }
    }
    this.setData({
      ['form.idNum']:e.detail.value
    })
  },

  stopM(){
    this.setData({isModalShow:false})
  },

  hiddenMask(){
    this.setData({isModalShow: true })
  },

  clickMask(e) {
    this.setData({isModalShow:true })
  },

  cancels(){
    this.setData({isModalShow:true })
  },

  getPhoneNumber: function(e) {
    let that = this;
    console.log("数据：",e);
    wx.showLoading({
      title: '请等待。。。',
    })
    that.login(e);
    // if (e.detail.userInfo) {
    //   console.log(e.detail.userInfo)
    //   // 登录
    //   that.login();
    // }
  },

  login: function(value) {
    let that = this;
    wx.login({
      success: data => {
        console.log(data);
        // wx.hideTabBar({})
        // 发送 res.code 到后台换取 openId, sessionKey, unionId
        if (data.code) {
          that.getuserInfo(data.code,value)
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
  },

  

  getuserInfo(code,value){
     const that = this;
     let token = wx.getStorageSync('token');
      wx.request({
        url: dataUrl + "visit/wxVisitorInfo",
        method: "POST",
        data: {
          appletCode:code,
          wxAppId:wx.getAccountInfoSync().miniProgram.appId,
          houseId:that.data.form.houseId,
          encryptedDate:value.detail.encryptedData,
          iv:value.detail.iv,
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
          console.log(res)
          wx.hideLoading();
          that.setData({
            isModalShow:true,
          })
          if (200 == res.data.code) {

            if(that.data.isRealName && '' != res.data.data.idNum){
              that.setData({
                idNumContent:true
              })
            }else if(that.data.isRealName && '' == res.data.data.idNum){
              that.setData({
                idNumContent:false
              })
            }else if(!that.data.isRealName){
              that.setData({
                idNumContent:true
              })
            }
            if("" != res.data.data.name){
              that.setData({
                ["form.name"]:res.data.data.name,
                namesContent:true,
              })
            }else{
              that.setData({
                ["form.name"]:'',
                namesContent:false,
              })
            }
            if('' != res.data.data.phone){
              that.setData({
                ["form.phone"]:res.data.data.phone,
                phoneContent:true,
              })
            }else{
              that.setData({
                ["form.phone"]:'',
                phoneContent:false,
              })
            }
            if('' != res.data.data.day){
              that.setData({
                ["form.visitDate"]:res.data.data.day,
                visitorTimes:true,
                timesColor:'#333'
              })
            }else{
              that.setData({
                ["form.visitDate"]:'',
                visitorTimes:false,
              })
            }
            that.setData({
              // isModalShow:true,
              ["form.idNum"]:res.data.data.idNum,
              ["form.numberPlate"]:res.data.data.numberPlate,
            })
            if("" != res.data.data.imgUrl){
               that.setData({
                ["form.faceUrl"]:imgShow + res.data.data.imgUrl,
                isFaceUrl:res.data.data.imgUrl,
                close:false,
                faceImg:true
               })
            }else{
              that.setData({
                ["form.faceUrl"]:localImgUrl,
                faceImg:false,
                close:true
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


 //根据人员信息获取人脸图片权限
 isShowFace(){
  const that = this;
  let token = wx.getStorageSync('token');
  wx.request({
    url: dataUrl + "user/getShowStatus",
    method: "POST",
    data: {
      wxAppId:wx.getAccountInfoSync().miniProgram.appId,
    },
    header:header(token),
    success(res) {
      console.log(res)
      if (200 == res.data.code && "SUCCESS" == res.data.msg) {
        if ("true" == res.data.data.showStatus) {
          that.setData({
            isFaceImg: false,
            // faceImg:false,
            // idNumContent:false
          })
          that.getRealName();
        } else {
          that.setData({
            isFaceImg: true,
            // faceImg:true,
            idNumContent:true
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

//获取实名制权限
getRealName(){
  const that = this;
  let token = wx.getStorageSync('token');
  let appId = wx.getStorageSync('appId');
  wx.request({
    url: dataUrl + "jn/api/status",
    method: "GET",
    data: {
      appId:appId
    },
    header:header(token),
    success(res) {
      console.log(res)
      if (200 == res.data.code && "SUCCESS" == res.data.msg) {
         if(res.data.data){
           that.setData({
             isRealName:true,
             idNumContent:false,
           })
         }else{
          that.setData({
            isRealName:false,
            idNumContent:true
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


  
  //输入姓名
  //去除输入框前后空格
  trim: function (e) {
    var name = e.currentTarget.dataset.name;
    this.setData({
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

  //输入手机号
  trimPhone: function (e) {
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
  
  //上传人脸照片
  camera(){
    const that = this;
    // let token = wx.getStorageSync('token');
    wx.chooseImage({
      count: 1,
      sizeType: ['compressed'],
      success(res) {
        that.setData({
          ['form.faceUrl']: res.tempFilePaths[0],
          close: false,
          faceImg:true
        })
      }
    })
  },

  //删除人脸照片
  closeFaceImg(){
    const that =this;
    that.setData({
      ['form.faceUrl']: localImgUrl,
      faceImg:false,
      close: true,
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
      phone: {
        required: true,
        // tel: true
      }
    }
    messages = {
      name: {
        required: '请填写姓名',
        maxlength: "姓名不能超过20个字"
      },
      phone: {
        required: '请输入11位手机号码',
        // tel: '请填写正确的手机号'
      }
    }



    this.WxValidate = new WxValidate(rules, messages)
  },

  //微信你授权获取code值
  // getUserInfo(){
    
  // },


//提交表单
  formSubmit(e){
    console.log(e.detail.value)
    const that = this;
    let token = wx.getStorageSync('token');
    let appId = wx.getStorageSync('appId');
    wx.showLoading({
      title: '正在提交中',
    });
    if (that.data.preventDuplication){
            
      //微信登陆获取code值
      wx.login({
        success (res) {
          if (res.code) {
            //发起网络请求
            that.setData({
              code:res.code
            })
            if(-1 == e.detail.value.faceImg.indexOf('download?path=')){
              
              wx.uploadFile({
                url: dataUrl + "file/upload",
                filePath: e.detail.value.faceImg,
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
                  'type': 0
                },
                success(respon) {
                  wx.hideLoading();
                  const data = JSON.parse(respon.data)
                    setTimeout(() => {
                      that.setData({
                        preventDuplication: true
                      })
                    }, 2000)
                  if (200 == data.code && "SUCCESS" == data.msg) {
                    console.log("手动上传图片路径---->",data.data.files[0].filePath);
                    wx.request({
                      url: dataUrl + 'visit/v2/submit',
                      method: "POST",
                      data: {
                        appId: appId,
                        faceUrl: data.data.files[0].filePath,
                        name: e.detail.value.name,
                        phone: e.detail.value.phone,
                        visitDate: e.detail.value.visitDate,
                        visitAddress: e.detail.value.visitAddress,
                        houseId: e.detail.value.houseId,
                        visitPerson:that.data.visitPerson,
                        visitPersonId:that.data.visitPersonId,
                        idNum:e.detail.value.idNum,
                        appId:that.data.appId,
                        numberPlate:e.detail.value.numberPlate,
                        code:res.code,
                        WxAppId:wx.getAccountInfoSync().miniProgram.appId,
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
                        setTimeout(() => {
                          that.setData({
                            preventDuplication: true
                          })
                        }, 2000)
                        wx.hideLoading();
                        console.log(res)
                        if (200 == res.data.code && "SUCCESS" == res.data.msg) {
                          wx.showToast({
                            title: "邀请成功",
                            icon: 'none',
                            duration: 2000
                          })
                          setTimeout(() => {
                            wx.switchTab({
                              url: '../index/index'
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
                  }else{
                    wx.hideLoading();
                    wx.showToast({
                      title: data.msg,
                      icon: 'none',
                      duration: 2000
                    })
                  }
                  //do something
                }
              })
            }else{
              wx.request({
                url: dataUrl + 'visit/v2/submit',
                method: "POST",
                data: {
                  appId: appId,
                  faceUrl: that.data.isFaceUrl,
                  name: e.detail.value.name,
                  phone: e.detail.value.phone,
                  visitDate: e.detail.value.visitDate,
                  visitAddress: e.detail.value.visitAddress,
                  houseId: e.detail.value.houseId,
                  visitPerson:that.data.visitPerson,
                  visitPersonId:that.data.visitPersonId,
                  idNum:e.detail.value.idNum,
                  appId:that.data.appId,
                  numberPlate:e.detail.value.numberPlate,
                  code:res.code,
                  WxAppId:wx.getAccountInfoSync().miniProgram.appId,
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
                  setTimeout(() => {
                    that.setData({
                      preventDuplication: true
                    })
                  }, 2000)
                  wx.hideLoading();
                  console.log(res)
                  if (200 == res.data.code && "SUCCESS" == res.data.msg) {
                    wx.showToast({
                      title: "邀请成功",
                      icon: 'none',
                      duration: 2000
                    })
                    setTimeout(() => {
                      wx.switchTab({
                        url: '../index/index'
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
            
          } else {
            console.log('登录失败！' + res.errMsg)
          }
        }
      })
     

      
    }
    that.setData({
      preventDuplication: false
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