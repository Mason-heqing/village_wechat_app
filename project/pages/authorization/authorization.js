// pages/authorization/authorization.js
import WxValidate from '../../utils/WxValidate.js'
const util = require('../../utils/util.js')
const dataUrl = util.dataUrl
const requestId = util.requestId
const header = util.header
const timeStamp = Date.parse(new Date())
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
    namesContent:false,
    phoneContent:false,
    idNumContent:false,
    faceUrlContent:false,
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
    houseId:"",
    existenceImg:"",
    id:"", //再次授权id
    form: {
      //faceImgUrl: "",
      faceImg: localImgUrl,
      name: '',
      idNo: '',
      idcard: '',
      phone: '',
      date:"请选择到访时间",
      adress:"",
      idNum:'',
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const that = this;
    if (options.villageName){
        that.setData({
          ["form.adress"]: options.villageName,
          houseId: options.houseId
        })
    }
    if(options.id){
       that.setData({
         id:options.id,
       })
      that.getBindVIsitor();
    }
    that.isShowFace()
    that.getRealName();
    that.initValidate()
  },

  
  //根据人员信息获取人脸图片权限
  isShowFace(){
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
              isFaceImg: false,
            })
            that.getRealName();
          } else {
            that.setData({
              isFaceImg: true,
              idNumContent:true,
              // faceUrlContent:true
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
              //  faceUrlContent:false
             })
           }else{
            that.setData({
              isRealName:false,
              idNumContent:true,
              // faceUrlContent:true
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

  //选择到访时间
  bindMultiPickerChange(e){
    console.log(e.detail.value)
    const that = this;
    that.setData({
      ["form.date"]: e.detail.value,
      timesColor:"#333",
      visitorTimes:true
    })
  },

  //身份证号
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
      ["form.idNum"]: e.detail.value,
    })
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
          ['form.faceImg']: res.tempFilePaths[0],
          faceUrlContent:true,
          close: false
        })
      }
    })
  },

  //删除人脸照片
  closeFaceImg(){
    const that =this;
    that.setData({
      ['form.faceImg']: localImgUrl,
      faceUrlContent:false,
      close: true
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

  //获取已绑定数据
  getBindVIsitor(){
    const that = this;
    let token = wx.getStorageSync('token');
    wx.showLoading({
      title: '加载中',
    });
    wx.request({
      url: dataUrl + "visit/passport",
      method: "POST",
      data: {
        id: that.data.id,
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
          if (res.data.data.faceUrl) {
            res.data.data.faceUrl = imgShow + res.data.data.faceUrl
            that.setData({
              close: false,
              existenceImg:res.data.data.faceUrl
            })
          } else {
            res.data.data.faceUrl = localImgUrl;
            that.setData({
              close: true,
            })
          }
          console.log("获取图片地址--->", res.data.data.faceUrl);
          that.setData({
            ['form.adress']: res.data.data.address.replace(/\//g, ""),
            ['form.faceImg']: res.data.data.faceUrl,
            ['form.name']: res.data.data.name,
            ['form.phone']: res.data.data.phone,
            ["form.date"]: res.data.data.visitDate.slice(0, 10),
            houseId: res.data.data.houserId,
            namesContent: true,
            phoneContent: true,
            visitorTimes: true,
            timesColor: "#333"
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
  


//提交表单
  formSubmit(e){
    console.log(e.detail.value)
    const that = this;
    let token = wx.getStorageSync('token');
    let appId = wx.getStorageSync('appId');
    if (localImgUrl == e.detail.value.faceImg) {
      e.detail.value.faceImg = "";
    }else{
      if (-1 == e.detail.value.faceImg.indexOf(".jpg")) {
        e.detail.value.faceImg = that.data.existenceImg;
      }
    }
    if("" != that.data.id){
       let currentDate = new Date(data).getTime();
      let oldData = new Date(e.detail.value.date).getTime();
       console.log(oldData, currentDate);
      if (oldData < currentDate){
        this.showModal("设置时间不能小于当前时间")
        return false
      }
    }
    let params = e.detail.value;
    if (that.data.namesContent && that.data.phoneContent){
      //校验表单
      if (!this.WxValidate.checkForm(params)) {
        const error = this.WxValidate.errorList[0];
        this.showModal(error.msg)
        return false
      } else {
        //发送post请求
        if (that.data.preventDuplication){
          let authorizationUrl;
          let faceImgUrl = "";
          if ("" != that.data.id) {
            authorizationUrl = "visit/againPassport";
            wx.showLoading(
              {
                title: '生成通行凭证中',
              }
            );
            if ("" != e.detail.value.faceImg) {
              console.log("smgui--->", e.detail.value.faceImg)
              if (-1 == e.detail.value.faceImg.indexOf("file/download?path=")) {
                faceImgUrl = e.detail.value.faceImg
                wx.uploadFile({
                  url: dataUrl + "file/upload",
                  filePath: faceImgUrl,
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
                   
                    const data = JSON.parse(respon.data)
                    console.log(11, data);
                    if (200 == data.code && "SUCCESS" == data.msg) {
                      wx.request({
                        url: dataUrl + authorizationUrl,
                        method: "POST",
                        data: {
                          appId: appId,
                          faceUrl: data.data.files[0].filePath,
                          name: e.detail.value.name,
                          phone: e.detail.value.phone,
                          visitDate: e.detail.value.date,
                          visitAddress: e.detail.value.adress,
                          houseId: that.data.houseId,
                          visitId: that.data.id
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
                            let id = that.data.id;
                            wx.showToast({
                              title: "再次授权成功",
                              icon: 'none',
                              duration: 2000
                            })
                            setTimeout(() => {
                              that.setData({
                                date: (util.formatTime(new Date())).slice(0, 10),
                                ['form.faceImg']: localImgUrl,
                                ['form.name']: '',
                                ['form.date']: (util.formatTime(new Date())).slice(0, 10),
                                ['form.phone']: '',
                                close: true
                              })
                              wx.navigateTo({
                                url: '../visitorPass/visitorPass?id=' + id,
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
              } else {
                let oneFaceImg = e.detail.value.faceImg.indexOf("=") + 1;
                let face_img = e.detail.value.faceImg.slice(oneFaceImg)
                console.log("hahha-->",oneFaceImg, face_img)
                wx.request({
                  url: dataUrl + authorizationUrl,
                  method: "POST",
                  data: {
                    appId: appId,
                    faceUrl: face_img,
                    name: e.detail.value.name,
                    phone: e.detail.value.phone,
                    visitDate: e.detail.value.date,
                    visitAddress: e.detail.value.adress,
                    houseId: that.data.houseId,
                    visitId: that.data.id
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
                      let id = res.data.data.id;
                      wx.showToast({
                        title: "再次授权成功",
                        icon: 'none',
                        duration: 2000
                      })
                      setTimeout(() => {
                        that.setData({
                          date: (util.formatTime(new Date())).slice(0, 10),
                          ['form.faceImg']: localImgUrl,
                          ['form.name']: '',
                          ['form.date']: (util.formatTime(new Date())).slice(0, 10),
                          ['form.phone']: '',
                          close: true
                        })
                        wx.navigateTo({
                          url: '../visitorPass/visitorPass?id=' + id,
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
              wx.request({
                url: dataUrl + authorizationUrl,
                method: "POST",
                data: {
                  appId: appId,
                  faceUrl: e.detail.value.faceImg,
                  name: e.detail.value.name,
                  phone: e.detail.value.phone,
                  visitDate: e.detail.value.date,
                  visitAddress: e.detail.value.adress,
                  houseId: that.data.houseId,
                  visitId: that.data.id
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
                    let id = res.data.data.id;
                    wx.showToast({
                      title: "再次授权成功",
                      icon: 'none',
                      duration: 2000
                    })
                    setTimeout(() => {
                      that.setData({
                        date: (util.formatTime(new Date())).slice(0, 10),
                        ['form.faceImg']: localImgUrl,
                        ['form.name']: '',
                        ['form.date']: (util.formatTime(new Date())).slice(0, 10),
                        ['form.phone']: '',
                        close: true
                      })
                      wx.navigateTo({
                        url: '../visitorPass/visitorPass?id=' + id,
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
            wx.showLoading({
              title: '生成通行凭证中',
            })
            authorizationUrl = "visit/submit"
            if ("" != e.detail.value.faceImg) {
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
                  const data = JSON.parse(respon.data)
                  setTimeout(() => {
                    that.setData({
                      preventDuplication: true
                    })
                  }, 2000)
                  console.log(11, data);
                  if (200 == data.code && "SUCCESS" == data.msg) {
                    wx.request({
                      url: dataUrl + authorizationUrl,
                      method: "POST",
                      data: {
                        appId: appId,
                        faceUrl: data.data.files[0].filePath,
                        name: e.detail.value.name,
                        phone: e.detail.value.phone,
                        visitDate: e.detail.value.date,
                        visitAddress: e.detail.value.adress,
                        houseId: that.data.houseId
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
                          let id = res.data.data.id;
                          wx.showToast({
                            title: "通行凭证生成成功",
                            icon: 'none',
                            duration: 2000
                          })
                          setTimeout(() => {
                            that.setData({
                              date: (util.formatTime(new Date())).slice(0, 10),
                              ['form.faceImg']: localImgUrl,
                              ['form.name']: '',
                              ['form.date']: (util.formatTime(new Date())).slice(0, 10),
                              ['form.phone']: '',
                              close: true
                            })
                            wx.navigateTo({
                              url: '../visitorPass/visitorPass?id=' + id,
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

            } else {
              wx.request({
                url: dataUrl + authorizationUrl,
                method: "POST",
                data: {
                  appId: appId,
                  faceUrl: e.detail.value.faceImg,
                  name: e.detail.value.name,
                  phone: e.detail.value.phone,
                  visitDate: e.detail.value.date,
                  visitAddress: e.detail.value.adress,
                  houseId: that.data.houseId
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
                    let id = res.data.data.id;
                    wx.showToast({
                      title: "通行凭证生成成功",
                      icon: 'none',
                      duration: 2000
                    })
                    setTimeout(() => {
                      that.setData({
                        date: (util.formatTime(new Date())).slice(0, 10),
                        ['form.faceImg']: localImgUrl,
                        ['form.name']: '',
                        ['form.date']: (util.formatTime(new Date())).slice(0, 10),
                        ['form.phone']: '',
                        close: true
                      })
                      wx.navigateTo({
                        url: '../visitorPass/visitorPass?id=' + id,
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
          }
        }
        that.setData({
          preventDuplication: false
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