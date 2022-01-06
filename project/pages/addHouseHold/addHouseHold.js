// pages/addHouseHold/addHouseHold.js
import WxValidate from '../../utils/WxValidate.js'
const util = require('../../utils/util.js')
const localImgUrl = "../images/faceImg.png";
const header = util.header
// const data = (util.formatTime(new Date())).slice(0, 10);
const data = new Date().toLocaleDateString().replace(/\//g,'-')
const dataUrl = util.dataUrl
const requestId = util.requestId
const timeStamp = Date.parse(new Date())
Page({

  /**
   * 页面的初始数据
   */
  data: {
    namesContent:false,
    phoneContent:false,
    idNumContent:false,
    faceUrlContent:false,
    close:true,
    personInfo: false,
    camera: true,
    faceEnabled: true,
    position: 'back',
    uploadInfo: true,
    isIdcard: false,
    personType:false,
    timesColor: "#999",
    isTimes: false,
    showStatus:true,//身份证号和人脸图片是否显示隐藏
    date: data,
    houseHoldType: ["户主", "家属", "租客","其他"],
    // effectiveTime:["永久","一个月","半年","一年"],
    index: 0,
    multiIndex:0,
    form: {
      //faceImgUrl: "",
      faceImg: localImgUrl,
      name: '',
      type:'',
      idNo: '',
      phone: '',
      date:"",
      showDate:"请选择有效时间",
      adress: "",
      houseId:"",
    },
    indexTime:0,
    effectiveTime:[],
    isEffectiveTime:false,
    isHiddenTimes:false,
    isDisabled:false,
    defaultPersonTimes:[]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const that = this;
    if (options && options.houseId) {
      that.setData({
        ["form.houseId"]: options.houseId
      })
    }
    if (options && options.showStatus){
      if ("true" == options.showStatus){
        that.setData({
          showStatus:false,
          // idNumContent:false,
          // faceUrlContent:false
       })
       that.getRealName();
       that.getPersonDeadTimeStatus();
      }else{
        that.setData({
          showStatus: true,
          idNumContent:true,
          // faceUrlContent:true
        })
      }
    }
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

  //获取住户/家属/租客 失效时间
  getPersonDeadTimeStatus(){
    const that = this;
    let token = wx.getStorageSync('token');
    let appId = wx.getStorageSync('appId');
    wx.request({
      url: dataUrl + "house/manage/personDeadTimeStatus",
      method: "GET",
      data: {
        appId:appId
      },
      header:header(token),
      success(res) {
        console.log(res)
        if (200 == res.data.code && "SUCCESS" == res.data.msg) {
          console.log(res.data.data.personDeadTimeAppDto.deadTimeDictExtDtoList)
           if(res.data.data.personDeadTimeAppDto.deadTimeDictExtDtoList && 0 < res.data.data.personDeadTimeAppDto.deadTimeDictExtDtoList.length){
               that.setData({
                effectiveTime:res.data.data.personDeadTimeAppDto.deadTimeDictExtDtoList,
               })
           }else{
            that.setData({
              effectiveTime:[],
             })
           }
           if(res.data.data.personDeadTimeAppDto.personDeadTimeVoList && 0 < res.data.data.personDeadTimeAppDto.personDeadTimeVoList.length){
              that.setData({
                defaultPersonTimes:res.data.data.personDeadTimeAppDto.personDeadTimeVoList,
              })
           }else{
              that.setData({
                defaultPersonTimes:[],
              })
           }
           if(res.data.data.mobileTimeShow){
              that.setData({
                isHiddenTimes:false
              })
           }else{
              that.setData({
                isHiddenTimes:true
              })
           }
           if(res.data.data.mobileTimeShow && res.data.data.mobileTimeUpdate){
            that.setData({
              isDisabled:false
            })
           }else{
            that.setData({
              isDisabled:true
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
    if(11 === value.length){
       this.setData({
        phoneContent:true
       })
    }else{
      this.setData({
        phoneContent:false
      })
    }
    that.setData({
      ["form.phone"]: value
    })
  },
  validateNumber(val) {
    return val.replace(/\D/g, '')
  },

  //输入身份证号
  trimIdNo: function (e) {
    let that = this;
    let value = e.detail.value;
    if(that.data.isRealName){
      if('' != value){
        this.setData({
         idNumContent:true
        })
     }else{
       this.setData({
         idNumContent:false
        })
     }  
    }
    that.setData({
      ["form.idNo"]: value
    })
  },

  //输入IC卡号
  trimIcNum:function(e){
    let that = this;
    let value = e.detail.value;
    that.setData({
      ["form.icNum"]: value
    })
  },

  //通过住户身份获取默认有效期
  getDefaultTime(arr,type){
    const that = this;
    if(0 < arr.length){
      arr.forEach((item,index)=>{
         if(type == item.personSubtype){
           let showTimeIndex = (that.data.effectiveTime|| []).findIndex((list) => list.id === item .id);
            that.setData({
              ['form.date']:item.effectiveTime,
              indexTime:showTimeIndex
            })
         }
      })
    }
  },

  //选择住户身份
  bindType(e){
    console.log(e);
    console.log("选择住户类型", e.detail.value)
    const that = this;
    if(that.data.isHiddenTimes){
        that.setData({
          isEffectiveTime:false
        })  
    }else{
      that.setData({
        isEffectiveTime:true
      }) 
    }
    if ('0' === e.detail.value || '1' === e.detail.value){
      if('0' === e.detail.value){
        that.getDefaultTime(that.data.defaultPersonTimes,'1')
        that.setData({
          ["form.type"]:1,
        })
      }else{
        that.getDefaultTime(that.data.defaultPersonTimes,'2')
        that.setData({
          ["form.type"]:2,
        })
      }
      that.setData({
        timesColor: "#333",
        isTimes: true
      })
    } else if ('2' === e.detail.value){
      that.getDefaultTime(that.data.defaultPersonTimes,'3')
      that.setData({
        ["form.type"]:3,
        timesColor: "#333",
        isTimes: true
      })
    }else{
      that.getDefaultTime(that.data.defaultPersonTimes,'5')
      that.setData({
        ["form.type"]:5,
        timesColor: "#333",
        isTimes: true
      })
    }
    that.setData({
      index: e.detail.value,
      personType: true
    })
  },

  //选择到访时间
  bindMultiPickerChange(e) {
    console.log(e.detail.value)
    const that = this;
    that.setData({
      isEffectiveTime:true,
      indexTime:e.detail.value,
      ["form.date"]:that.data.effectiveTime[e.detail.value].effectiveTime,
      timesColor: "#333",
      isTimes: true,
      // ["form.date"]: e.detail.value,
      // ["form.showDate"]:e.detail.value,
      // timesColor: "#333",
      // isTimes: true,
    })
  },

  //上传人脸照片
  camera() {
    const that = this;
    // let token = wx.getStorageSync('token');
    wx.chooseImage({
      count: 1,
      sizeType: ['compressed'],
      success(res) {
        that.setData({
          ['form.faceImg']: res.tempFilePaths[0],
          faceUrlContent:true,
          close: false,
        })
        // wx.showToast({
        //   title: "请上传的人脸照片尺寸小于5M大小",
        //   icon: 'none',
        //   duration: 2000
        // })
      }
    })
  },

  //删除人脸照片
  closeFaceImg() {
    const that = this;
    that.setData({
      ['form.faceImg']: localImgUrl,
      faceUrlContent:false,
      close: true
    })
  },



  /*身份证验证输入是否正确
  
    *身份证号合法性验证
  
    *支持15位和18位身份证号
  
    *支持地址编码、出生日期、校验位验证*/

  getBirthAndSex: function (e) {

    let ts = this;

    let code = e //identity 为你输入的身份证


    let city = { 11: "北京", 12: "天津", 13: "河北", 14: "山西", 15: "内蒙古", 21: "辽宁", 22: "吉林", 23: "黑龙江 ", 31: "上海", 32: "江苏", 33: "浙江", 34: "安徽", 35: "福建", 36: "江西", 37: "山东", 41: "河南", 42: "湖北 ", 43: "湖南", 44: "广东", 45: "广西", 46: "海南", 50: "重庆", 51: "四川", 52: "贵州", 53: "云南", 54: "西藏 ", 61: "陕西", 62: "甘肃", 63: "青海", 64: "宁夏", 65: "新疆", 71: "台湾", 81: "香港", 82: "澳门", 91: "国外 " };

    let tip = "";

    let pass = true;

    let reg = /^\d{6}(18|19|20)?\d{2}(0[1-9]|1[012])(0[1-9]|[12]\d|3[01])\d{3}(\d|X)$/;
    console.log("身份证id");
    if (!code || !code.match(reg)) {

      tip = "身份证号格式错误";
      if ("" == e) {
        tip = "身份证号码不能为空";
      }
      ts.showModal(tip);

      pass = false;

    } else if (!city[code.substr(0, 2)]) {

      tip = "身份证地址编码错误";
      ts.showModal(tip);

      pass = false;

    } else {

      //18位身份证需要验证最后一位校验位

      if (code.length == 18) {

        code = code.split('');

        //∑(ai×Wi)(mod 11)

        //加权因子

        let factor = [7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2];

        //校验位

        let parity = [1, 0, 'X', 9, 8, 7, 6, 5, 4, 3, 2];

        let sum = 0;

        let ai = 0;

        let wi = 0;

        for (let i = 0; i < 17; i++) {

          ai = code[i];

          wi = factor[i];

          sum += ai * wi;

        }

        let last = parity[sum % 11];

        if (parity[sum % 11] != code[17]) {

          tip = "身份证校验位错误";
          ts.showModal(tip);

          pass = false;

        }

      }

    }
    if (!pass) {
      ts.setData({
        isIdcard: false
      })
    } else {
      ts.setData({
        isIdcard: true
      })
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
    let messages = {};
    let rules = {};

    rules = {
      name: {
        required: true,
        maxlength: 20,
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

  //提交表单
  formSubmit(e) {
    console.log(e.detail.value)
    const that = this;
    let token = wx.getStorageSync('token');
    let appId = wx.getStorageSync('appId');

    if (localImgUrl == e.detail.value.faceImg) {
      e.detail.value.faceImg = "";
    }
    that.initValidate();
    if ("" != e.detail.value.idNo){
      that.getBirthAndSex(e.detail.value.idNo);
      if (!that.data.isIdcard) {
        return false;
      }
    }
    let params = e.detail.value;
    if (that.data.namesContent){
      //校验表单
      if (!this.WxValidate.checkForm(params)) {
        const error = this.WxValidate.errorList[0];
        if ("idcard" != error.param) {
          this.showModal(error.msg)
        }
        return false
      } else {
        //发送post请求
        if("" != e.detail.value.faceImg){
          wx.showLoading({
            title: '提交中',
          })
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
               type: 0
            },
            success(respon) {
              wx.hideLoading();
              const data = JSON.parse(respon.data)
              if (200 == data.code && "SUCCESS" == data.msg) {
                wx.request({
                  url: dataUrl + "resident/submit",
                  method: "POST",
                  data: {
                    appId: appId,
                    houseId: e.detail.value.houseId,
                    name: e.detail.value.name,
                    personSubType: parseInt(e.detail.value.type),
                    expireDate: e.detail.value.date,
                    phone: e.detail.value.phone,
                    idNum: e.detail.value.idNo,
                    icNum:e.detail.value.icNum,
                    faceUrl: data.data.files[0].filePath,
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
                        title: "添加住户成功",
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
              }else{
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
          wx.showLoading({
            title: '提交中',
          });
          wx.request({
            url: dataUrl + "resident/submit",
            method: "POST",
            data: {
              appId: appId,
              houseId: e.detail.value.houseId,
              name: e.detail.value.name,
              personSubType: parseInt(e.detail.value.type),
              expireDate: e.detail.value.date,
              phone: e.detail.value.phone,
              idNum: e.detail.value.idNo,
              icNum:e.detail.value.icNum,
              faceUrl: e.detail.value.faceImg,
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
                  title: "添加住户成功",
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
        }
        
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