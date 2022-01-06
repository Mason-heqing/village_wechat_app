// pages/edit/edit.js
import WxValidate from '../../utils/WxValidate.js'
const util = require('../../utils/util.js')
const localImgUrl = "../images/faceImg.png";
// const data = (util.formatTime(new Date())).slice(0, 10);
const data = new Date().toLocaleDateString().replace(/\//g, '-')
const dataUrl = util.dataUrl
const imgShow = util.imgShow
const requestId = util.requestId
const timeStamp = Date.parse(new Date())
const tipsBuildingInfo = "请选择楼栋"
const tipsUnitInfo = "请选择单元"
const tipsRoomInfo = "请选择房号"
const message = "为保障本小区的住户都能享受高品质的服务，请务必填写正确信息，以便快速审核"
Page({

  /**
   * 页面的初始数据
   */
  data: {
    isRealName:false,//是否校验实名制权限
    isBuilding: false,
    isUnit: false,
    isRoom: false,
    isTimes:false,
    isCertificate:false,
    showImg: [],
    imgUrl:[],
    addFile: false,
    preventDuplication: true,
    showStatus:true, //显示隐藏身份信息
    date: data,
    houseHoldType: ["户主", "家属", "租客","其他"],
    personType:false,
    repairImage: "../images/faceImg.png",
    timesColor:"#999",
    message: "",
    deviceGroupId: "", //小区id
    buildingId: "", //楼栋Id
    unitId: "", //单元id
    id:"",  //房屋申请id
    certificate:"",  //身份证件
    form: {
      buildingName: tipsBuildingInfo,
      unitName: tipsUnitInfo,
      roomName: tipsRoomInfo,
      index: 0,
      date: "",
      showDate:"请选择有效时间",
      houseId: "" //房屋id
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
  onLoad: function(options) {
    const that = this;
    if (options && options.village) {
      wx.setNavigationBarTitle({
        title: options.village
      });
      that.setData({
        deviceGroupId: options.deviceGroupId,
      })
    }
    if (options && options.id){
      that.setData({
        id: options.id
      })
      that.getRecordInfo();
    }else{
      that.applyForInfo();
    }
    if(options && options.appId){
        that.setData({
          appId:options.appId
        })
    }
    that.getRealName();
    this.getPersonDeadTimeStatus();
  },

   //获取住户/家属/租客 失效时间
   getPersonDeadTimeStatus(){
    const that = this;
    let token = wx.getStorageSync('token');
    let appId = that.data.appId;
    wx.request({
      url: dataUrl + "house/manage/personDeadTimeStatus",
      method: "GET",
      data: {
        appId:appId
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


  //获取物业提示信息
  applyForInfo(){
    const that = this;
    let token = wx.getStorageSync('token');
    let id = that.data.deviceGroupId;
    wx.request({
      url: dataUrl + "house/manage/applyForInfo",
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
          if ("" != res.data.data.message){
             that.setData({
               message: res.data.data.message
             })
          }else{
            that.setData({
              message: message
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
          that.setData({
            showMessage: true,
            noMessage: false,
          })
          wx.showToast({
            title: res.data.msg,
            icon: 'none',
            duration: 2000
          })
        }
      }
    })
  },
  getNum(e) {
    if(this.data.isRealName){
      if('' != e.detail.value){
        this.setData({
         isCertificate:true
        }) 
     }else{
       this.setData({
         isCertificate:false
       })
     }
    }
    this.setData({
      certificate:e.detail.value
    })
  },

  //获取申请记录信息
  getRecordInfo(){
    const that = this;
    let token = wx.getStorageSync('token');
    let id = that.data.id;
    wx.showLoading({
      title: '加载中',
    });
    wx.request({
      url: dataUrl + "house/manage/personBindHouseInfo",
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
          that.setData({
            certificate:res.data.data.idNum
          })
          if (res.data.data.buildingName){
             that.setData({
               ["form.buildingName"]: res.data.data.buildingName,
               isBuilding: true,
             })
          }
          if (res.data.data.buildingId){
            that.setData({
              buildingId: res.data.data.buildingId,
            })
          }
          if (res.data.data.unitId) {
            that.setData({
              unitId: res.data.data.unitId,
            })
          }
          if (res.data.data.residenceId) {
            that.setData({
              deviceGroupId: res.data.data.residenceId,
            })
          }
          if (res.data.data.residenceName){
            wx.setNavigationBarTitle({
              title: res.data.data.residenceName
            });
          }
          if (res.data.data.unitName){
            that.setData({
              ["form.unitName"]: res.data.data.unitName,
              isUnit: true,
            })
          }
          if (res.data.data.houseName){
            that.setData({
              ["form.roomName"]: res.data.data.houseName,
              isRoom: true,
            })
          }
          if (res.data.data.personSubType){
            that.setData({
              ["form.index"]: parseInt(res.data.data.personSubType) - 1,
              personType:true
            })
          }
          if (res.data.data.effectiveTime){
            
            that.setData({
              ["form.date"]: res.data.data.effectiveTime,
              timesColor:"#333",
              isTimes:true
            })
            console.log(that.data.form.date)
          }
          if (res.data.data.message && "" != res.data.data.message){
            that.setData({
              message: res.data.data.message
            })
          }else{
            that.setData({
              message: message
            })
          }
          if (res.data.data.houseId){
            that.setData({
              ["form.houseId"]: res.data.data.houseId,
            })
          }
          if (res.data.data.id){
            that.setData({
              id: res.data.data.id,
            })
          }
          if (res.data.data.enclosureUrl && "" != res.data.data.enclosureUrl){
            let enclosure = [];
            let imgUrl = [];
            if (-1 === res.data.data.enclosureUrl.indexOf(",")) {
              enclosure.push(imgShow + res.data.data.enclosureUrl);
            }else{
              res.data.data.enclosureUrl.split(",").forEach((item, index) => {
                enclosure.push(imgShow + item);
              })
            }
            that.setData({
              showImg: enclosure,
              imgUrl: imgUrl
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
          that.setData({
            showMessage: true,
            noMessage: false,
          })
          wx.showToast({
            title: res.data.msg,
            icon: 'none',
            duration: 2000
          })
        }
      }
    })
  },


  //本地图片上传 
  chooseImage() {
    const that = this;
    const fileLength = that.data.showImg.length;
    if (6 > fileLength) {
      wx.chooseImage({
        count: 6 - fileLength,
        success(res) {
          console.log(res);
          const tempFilePaths = res.tempFilePaths
          if (6 === res.tempFilePaths.length) {
            that.setData({
              addFile: true
            })
          }
          if (0 === fileLength) {
            that.setData({
              showImg: tempFilePaths
            })

          } else {
            res.tempFilePaths.forEach((item, index) => {
              that.data.showImg.push(item)
            })
            if (6 === that.data.showImg.length) {
              that.setData({
                addFile: true
              })
            }
            that.setData({
              showImg: that.data.showImg
            })
          }
        }
      })
    } else {
      wx.showToast({
        title: "照片最多只能传6张!",
        icon: 'none',
        duration: 2000
      })
    }

  },

  //获取实名制认证权限
  getRealName(){
    const that = this;
    let appId = that.data.appId;
    let token = wx.getStorageSync('token');
    wx.request({
      url: dataUrl + "jn/api/status",
      method: "GET",
      data: {
        appId: appId,
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
           if(res.data.data){
              that.setData({
                isRealName:true,
                isCertificate:false
              })
           }else{
            that.setData({
              isRealName:false,
              isCertificate:true
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
          that.setData({
            showMessage: true,
            noMessage: false,
          })
          wx.showToast({
            title: res.data.msg,
            icon: 'none',
            duration: 2000
          })
        }
      }
    })
  },

  //删除图片
  close(e) {
    const that = this;
    const imglist = that.data.showImg;
    imglist.splice(e.currentTarget.dataset.index, 1);
    if (5 <= imglist.length) {
      that.setData({
        addFile: false
      })
    }
    that.setData({
      showImg: imglist
    })
  },

  selectBuilding() {
    const that = this;
    let deviceGroupId = that.data.deviceGroupId;
    wx.navigateTo({
      url: '../selectBuilding/selectBuilding?type=1' + "&deviceGroupId=" + deviceGroupId
    })
  },

  //选择单元详情
  selectUnit() {
    const that = this;
    let id = that.data.buildingId;
    if (tipsBuildingInfo != that.data.form.buildingName) {
      wx.navigateTo({
        url: '../selectBuilding/selectBuilding?type=2' + "&id=" + id,
      })
    } else {
      wx.showToast({
        title: "请先选择楼栋",
        icon: 'none',
        duration: 2000
      })
    }
  },

  //选择房号
  selectRoom() {
    const that = this;
    let unitId = that.data.unitId;
    if (tipsBuildingInfo != that.data.form.buildingName) {
      if (tipsUnitInfo != that.data.form.unitName) {
        wx.navigateTo({
          url: '../selectBuilding/selectBuilding?type=3' + "&unitId=" + unitId
        })
      } else {
        wx.showToast({
          title: "请先选择单元",
          icon: 'none',
          duration: 2000
        })
      }
    } else {
      wx.showToast({
        title: "请先选择楼栋",
        icon: 'none',
        duration: 2000
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
      ['form.index']: e.detail.value,
      personType: true
    })
  },

  //更改有效时间
  bindMultiPickerChange(e) {
    // this.setData({
    //   ['form.date']: e.detail.value,
    //   ['form.showDate']: e.detail.value,
    //   timesColor:"#333",
    //   isTimes:true
    // })
    const that = this;
    that.setData({
      isEffectiveTime:true,
      indexTime:e.detail.value,
      ["form.date"]:that.data.effectiveTime[e.detail.value].effectiveTime,
      timesColor: "#333",
      isTimes: true,
    })
  },

  //申请提交
  formSubmit(e) {
    // if(this.data.certificate.length < 18) {
    //   wx.showToast({
    //     title: "请输入正确的证件好号",
    //     icon: 'none',
    //     duration: 2000
    //   })
    //   return false;
    // }
    console.log(e.detail.value);

    const that = this;
    let token = wx.getStorageSync('token');
    let appId = that.data.appId;
    let fectImg = that.data.showImg;
    if ("请选择有效时间" == e.detail.value.date){
      wx.showToast({
        title: "请选择有效时间",
        icon: 'none',
        duration: 2000
      })
      return false;
    }
    // if (3 == e.detail.value.type){
    //   e.detail.value.type = 4; 
    // }
    let upfiles = [];
    if (tipsBuildingInfo != that.data.form.buildingName) {
      if (tipsUnitInfo != that.data.form.unitName) {
        if (tipsRoomInfo != that.data.form.roomName) {
          if (that.data.preventDuplication){
            wx.showLoading({
              title: '提交中',
            });
            if ("" != that.data.id) {
              let imgUrl = [];
              let urlData = [];
              that.data.showImg.forEach((item, index) => {
                if (-1 == item.indexOf("file/download?path=")) {
                  imgUrl.push(item);
                } else {
                  let starStr = item.indexOf("=") + 1;
                  urlData.push(item.substring(starStr))
                }
              })
              if (0 < imgUrl.length) {
                imgUrl.forEach((item, index) => {
                  wx.uploadFile({
                    url: dataUrl + "file/upload",
                    filePath: item,
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
                      type: 1
                    },
                    success(respon) {
                      const data = JSON.parse(respon.data)
                      if (200 == data.code && "SUCCESS" == data.msg) {
                        upfiles.push(data.data.files[0].filePath)
                        if (upfiles.length == imgUrl.length) {
                          let filesUrl = urlData.concat(upfiles)
                          wx.request({
                            url: dataUrl + "house/manage/usedSubmit",
                            method: "POST",
                            data: {
                              idNum: that.data.certificate,
                              id: that.data.id,
                              houseId: e.detail.value.houseId,
                              personSubType: parseInt(e.detail.value.type),
                              expireDate: e.detail.value.date,
              
                              files: filesUrl.toString()
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
                              }, 3000)
                              wx.hideLoading();
                              console.log(res)
                              if (200 == res.data.code && "SUCCESS" == res.data.msg) {
                                wx.showToast({
                                  title: "再次申请成功",
                                  icon: 'none',
                                  duration: 2000
                                })
                                setTimeout(() => {
                                  wx.navigateBack({
                                    delta: 2 //想要返回的层级
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
                                that.setData({
                                  showMessage: true,
                                  noMessage: false,
                                })
                                wx.showToast({
                                  title: res.data.msg,
                                  icon: 'none',
                                  duration: 2000
                                })
                              }
                            }
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
                      //do something

                    }
                  })
                })
              } else {
                if (0 < urlData.length) {
                  urlData = urlData.toString();
                } else {
                  urlData = ""
                }
                wx.request({
                  url: dataUrl + "house/manage/usedSubmit",
                  method: "POST",
                  data: {
                    id: that.data.id,
                    houseId: e.detail.value.houseId,
                    personSubType: parseInt(e.detail.value.type),
                    expireDate: e.detail.value.date,
                    files: urlData,
                    idNum:that.data.certificate
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
                    }, 3000)
                    wx.hideLoading();
                    console.log(res)
                    if (200 == res.data.code && "SUCCESS" == res.data.msg) {
                      wx.showToast({
                        title: "再次申请成功",
                        icon: 'none',
                        duration: 2000
                      })
                      setTimeout(() => {
                        wx.navigateBack({
                          delta: 2 //想要返回的层级
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
              if (0 < that.data.showImg.length) {
                that.data.showImg.forEach((item, index) => {
                  wx.uploadFile({
                    url: dataUrl + "file/upload",
                    filePath: item,
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
                      type: 1
                    },
                    success(respon) {
                      const data = JSON.parse(respon.data)
                      if (200 == data.code && "SUCCESS" == data.msg) {
                        upfiles.push(data.data.files[0].filePath)
                        if (upfiles.length == fectImg.length) {
                          wx.showLoading({
                            title: '提交中',
                          });
                          wx.request({
                            url: dataUrl + "house/manage/submit",
                            method: "POST",
                            data: {
                              houseId: e.detail.value.houseId,
                              personSubType: parseInt(e.detail.value.type),
                              expireDate: e.detail.value.date,
                              idNum: that.data.certificate,
                              files: upfiles.toString(),
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
                              }, 3000)
                              wx.hideLoading();
                              console.log(res)
                              if (200 == res.data.code && "SUCCESS" == res.data.msg) {
                                wx.showToast({
                                  title: "房屋申请提交成功",
                                  icon: 'none',
                                  duration: 2000
                                })
                                setTimeout(() => {
                                  wx.navigateBack({
                                    delta: 2 //想要返回的层级
                                  })
                                }, 2000)
                              } else {
                                that.setData({
                                  showMessage: true,
                                  noMessage: false,
                                })
                                wx.showToast({
                                  title: res.data.msg,
                                  icon: 'none',
                                  duration: 2000
                                })
                              }
                            }
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
                      //do something

                    }
                  })

                })
              } else {

                wx.request({
                  url: dataUrl + "house/manage/submit",
                  method: "POST",
                  data: {
                    houseId: e.detail.value.houseId,
                    personSubType: parseInt(e.detail.value.type),
                    expireDate: e.detail.value.date,
                    files: "",
                    idNum: that.data.certificate
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
                    }, 3000)
                    wx.hideLoading();
                    console.log(res)
                    if (200 == res.data.code && "SUCCESS" == res.data.msg) {
                      wx.showToast({
                        title: "房屋申请提交成功",
                        icon: 'none',
                        duration: 2000
                      })
                      setTimeout(() => {
                        wx.navigateBack({
                          delta: 2 //想要返回的层级
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
                      that.setData({
                        showMessage: true,
                        noMessage: false,
                      })
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
          
        } else {
          wx.showToast({
            title: "请选择房号",
            icon: 'none',
            duration: 2000
          })
        }
      } else {
        wx.showToast({
          title: "请选择单元",
          icon: 'none',
          duration: 2000
        })
      }
    } else {
      wx.showToast({
        title: "请选择楼栋",
        icon: 'none',
        duration: 2000
      })
    }
    
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  

  onShow: function() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  }
})