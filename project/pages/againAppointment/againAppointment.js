// pages/againAppointment/againAppointment.js
import WxValidate from '../../utils/WxValidate.js'
const util = require('../../utils/util.js')
const dataUrl = util.dataUrl
const requestId = util.requestId
const timeStamp = Date.parse(new Date())
const localImgUrl = "../images/faceImg.png";
const data = new Date().toLocaleDateString().replace(/\//g,'-');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    namesContent:false,
    phoneContent:false,
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
    form: {
      appId: "",//应用ID
      faceUrl: localImgUrl,//人脸图片
      checkType:'',
      name: '',//来访人姓名
      idNum: '',//身份证号
      phone: '',//手机号码
      numberPlate:'',//车牌号
      visitDate:"请选择到访时间",//访问日期
      visitAddress:"",//访问地址
      visitPerson:'',//被访人姓名
      visitPersonId:'',//访问单元
      houseId:"",//访问单元
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const that = this;
    // console.log("传参数---》",options)
    if('' != wx.getStorageSync('visitorName')){
      that.setData({
        namesContent:true,
      })
    }else{
      that.setData({
        namesContent:false,
      })
    }
    if('' != wx.getStorageSync('visitorPhone')){
      that.setData({
        phoneContent:true,
      })
    }else{
      that.setData({
        phoneContent:false,
      })
    }
    if(wx.getStorageSync('visitorVisitDate')){
      that.setData({
        visitorTimes:true
      })
    }else{
      that.setData({
        visitorTimes:false
      })
    }
    if('' != wx.getStorageSync('visitorfaceUrl')){
      that.setData({
        faceImg:true
      })
    }else{
      that.setData({
        faceImg:false
      })
    }
    that.setData({
      ["form.visitAddress"]: wx.getStorageSync('visitorVisitAddress'),
      ["form.visitPerson"]:wx.getStorageSync('visitorVisitPerson'),
      ["form.visitPersonId"]:wx.getStorageSync('visitorVisitPersonId'),
      ["form.houseId"]: wx.getStorageSync('visitorHouseId'),
      ["form.appId"]: wx.getStorageSync('visitorAppId'),
      ["form.faceUrl"]: wx.getStorageSync('visitorfaceUrl'),
      ["form.checkType"]: wx.getStorageSync('visitorCheckType'),
      ["form.name"]: wx.getStorageSync('visitorName'),
      ["form.phone"]: wx.getStorageSync('visitorPhone'),
      ["form.numberPlate"]: wx.getStorageSync('visitorNumberPlate'),
      ["form.visitDate"]: wx.getStorageSync('visitorVisitDate'),
      ["form.idNum"]: wx.getStorageSync('visitorIdNum'),
      timesColor:"#333"
    })
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
            isFaceImg: false
          })
        } else {
          that.setData({
            isFaceImg: true
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
      close: true,
      faceImg:false
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
        tel: true
      }
    }
    messages = {
      name: {
        required: '请填写姓名',
        maxlength: "姓名不能超过20个字"
      },
      phone: {
        required: '请输入11位手机号码',
        tel: '请填写正确的手机号'
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
    let oldData = e.detail.value.visitDate.replace(/-/g,'/');
      let newData = util.formatTime(new Date());
      let currentData = newData.substr(0,10).replace(/-/g,'/')
      if(Date.parse(oldData) < Date.parse(currentData)){ 
        wx.showToast({
          title: "到访时间不能小于当前时间",
          icon: 'none',
          duration: 2000
        })
      }else{
        if (that.data.preventDuplication){
          if(-1 == e.detail.value.faceImg.indexOf("file/download?path=")){
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
                if (200 == data.code && "SUCCESS" == data.msg) {
                  wx.request({
                    url: dataUrl + 'visit/submit',
                    method: "POST",
                    data: {
                      appId: appId,
                      faceUrl: data.data.files[0].filePath,
                      name: e.detail.value.name,
                      checkType:e.detail.value.checkType,
                      phone: e.detail.value.phone,
                      idNum:e.detail.value.idNum,
                      visitDate: e.detail.value.visitDate,
                      visitAddress: e.detail.value.visitAddress,
                      houseId: e.detail.value.houseId,
                      visitPerson:that.data.visitPerson,
                      visitPersonId:that.data.visitPersonId,
                      numberPlate:e.detail.value.numberPlate,
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
            let oneFaceImg = e.detail.value.faceImg.indexOf("=") + 1;
            let face_img = e.detail.value.faceImg.slice(oneFaceImg)
            if(-1 == face_img.indexOf('.jpg')){
              face_img = face_img.replace('.jp','.jpg');
            }
            wx.request({
              url: dataUrl + 'visit/submit',
              method: "POST",
              data: {
                appId: appId,
                faceUrl:face_img,
                name: e.detail.value.name,
                checkType:e.detail.value.checkType,
                phone: e.detail.value.phone,
                idNum:e.detail.value.idNum,
                visitDate: e.detail.value.visitDate,
                visitAddress: e.detail.value.visitAddress,
                houseId: e.detail.value.houseId,
                visitPerson:that.data.visitPerson,
                visitPersonId:that.data.visitPersonId,
                numberPlate:e.detail.value.numberPlate,
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
        }
        
        that.setData({
          preventDuplication: false
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