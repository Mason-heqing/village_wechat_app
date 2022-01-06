// pages/repair/repair.js
const util = require('../../utils/util.js')
import WxValidate from '../../utils/WxValidate.js'
const dataUrl = util.dataUrl
const requestId = util.requestId
const timeStamp = Date.parse(new Date())
Page({

  /**
   * 页面的初始数据
   */
  data: {
    faceImg: "../images/upfile.png",
    cameraImg:true,
    siziNum:0,
    subBtn:120,
    namesContent:false,
    decContent:false,
    type: null,
    addFile: false,
    placeHolderName: "",
    inputColor:"#999",
    textareaPadding:60,
    textareaDec:false,
    showImg: [],
    houseId:"",
    preventDuplication: true,
    form: {
      resRepair: '',
      resDesc: "",
      repairImage: "../images/upfile.png",
      btnColor:null,
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    const that = this;
    let title = "";
    if (options.type && "1" === options.type) {
      title = "房屋报修";
      that.setData({
        type: "1",
        houseId: options.houseId,
        placeHolderName: "报修物品名称",
        btnColor:true
      })
    } else {
      title = "举报投诉";
      that.setData({
        type: "2",
        houseId: options.houseId,
        placeHolderName: "举报内容",
        btnColor:false
      })
    }

    wx.setNavigationBarTitle({
      title: title
    });
  },

  //输入物品名称
  trim(e) {
    var name = e.currentTarget.dataset.name;
    this.setData({
      ["form.resRepair"]: e.detail.value.replace(/\s+/g, '')
    })
    if ( 0 < this.data.form.resRepair.length) {
      this.setData({
        namesContent: true,
      });
    } else{
      this.setData({
        namesContent: false,
      });
    }
  },

  trimDec(e) {
    var num = e.detail.value.replace(/\s+/g, '').length;
    this.setData({
      ["form.resDesc"]: e.detail.value.replace(/\s+/g, ''),
      siziNum:num
    })
    if (0 < this.data.form.resDesc.length) {
      this.setData({
        decContent: true,
        inputColor:"#333",
        textareaPadding:30,
        textareaDec:true,
      });
    } else {
      this.setData({
        decContent: false,
        inputColor: "#999",
        textareaPadding:60,
        textareaDec:false,
      });
    }
  },

  //文本聚焦
  textareaFocus(e){
    const that = this;
    if ("focus" == e.type) {
      that.setData({
        textareaPadding: 30,
        textareaDec: true,
      })
    }
  },

  //文本失焦
  textareaBlur(e){
    const that = this;
    if ("blur" == e.type) {
      if (0 < that.data.form.resDesc.length) {
        that.setData({
          textareaPadding: 30,
          textareaDec: true,
        })
      } else {
        that.setData({
          textareaPadding: 60,
          textareaDec:false,
        })
      }
    }
  },

  //本地图片上传 
  chooseImage() {
    const that = this;
    // let token = wx.getStorageSync('token');
    const fileLength = that.data.showImg.length;
    if (6 > fileLength) {
      wx.chooseImage({
        count: 6 - fileLength,
        success(res) {
          console.log(res);
          const tempFilePaths = res.tempFilePaths
          that.setData({
            cameraImg: false
          })
          if (6 === res.tempFilePaths.length) {
            that.setData({
              addFile: true,
            })
          }
          if (3 <= that.data.showImg.length + tempFilePaths.length) {
            that.setData({
              subBtn:0
            })
          } else {
            that.setData({
              subBtn: 120
            })
          }
          if (0 === fileLength) {
            that.setData({
              showImg: tempFilePaths,
            })

          } else {
            res.tempFilePaths.forEach((item, index) => {
              that.data.showImg.push(item)
            })
            if (6 === that.data.showImg.length) {
              that.setData({
                addFile: true,
              })
            }
            if (3 <= that.data.showImg.length){
              that.setData({
                subBtn:0
              })
            }else{
              that.setData({
                subBtn: 120
              })
            }

            that.setData({
              showImg: that.data.showImg,
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

  //删除图片
  close(e) {
    const that = this;
    const imglist = that.data.showImg;
    imglist.splice(e.currentTarget.dataset.index, 1);
    if (0 < imglist.length){
      that.setData({
        cameraImg: false
      })
    }else{
      that.setData({
        cameraImg: true
      })
    }
    if (5 <= imglist.length) {
      that.setData({
        addFile: false
      })
    } 
    if (imglist.length < 3){
      console.log(123 , imglist.length);
      that.setData({
        subBtn:120
      })
    }else{
      that.setData({
        subBtn:0
      })
    }
    that.setData({
      showImg: imglist
    })
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
      resRepair: {
        required: true,
        maxlength: 20
      },
      resDesc: {
        required: true,
        maxlength: 300
      },
    }
    messages = {
      resRepair: {
        required: '请输入报修物品名称',
        maxlength: "报修物品名称不能超过20个字"

      },
      resDesc: {
        required: '请输入问题描述',
        maxlength: "问题描述不能超过300个字"
      },
    }



    this.WxValidate = new WxValidate(rules, messages)
  },


  //表单提交
  formSubmit(e) {
    console.log(e.detail.value);
    const that = this;
    let type = that.data.type;
    let token = wx.getStorageSync('token');
    let appId = wx.getStorageSync('appId');
    let houseId = that.data.houseId;
    let fectImg = that.data.showImg;
    that.initValidate();
    let params = e.detail.value;
    if (that.data.namesContent && that.data.decContent){
      //校验表单
      if (!this.WxValidate.checkForm(params)) {
        const error = this.WxValidate.errorList[0];
        this.showModal(error.msg)
        return false
      } else {
        //发送post请求
        let parameter = "";
        let title = "";
        let dec = "";
        let upfiles = [];
        if (that.data.preventDuplication){
          if (("" != e.detail.value.resRepair || "" != e.detail.value.resDesc) && 0 < fectImg.length) {
            wx.showLoading({
              title: '提交中',
            });
            fectImg.forEach((item, index) => {
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
                      if ("1" === type) {
                        parameter = "property/repair/houseRepair";
                        wx.request({
                          url: dataUrl + parameter,
                          method: "POST",
                          data: {
                            appId: appId,
                            houseId: houseId,
                            resRepair: e.detail.value.resRepair,
                            resDesc: e.detail.value.resDesc,
                            repairImage: upfiles.toString(),
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
                                title: "完成提交",
                                icon: 'none',
                                duration: 2000
                              })
                              setTimeout(() => {
                                wx.navigateBack({
                                  delta: 1
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

                      } else {
                        console.log("举报投诉")
                        parameter = "property/complaint/reportComplaint";
                        wx.request({
                          url: dataUrl + parameter,
                          method: "POST",
                          data: {
                            appId: appId,
                            houseId: houseId,
                            complainTitle: e.detail.value.resRepair,
                            complainContent: e.detail.value.resDesc,
                            complainImageUrl: upfiles.toString(),
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
                                title: "完成提交",
                                icon: 'none',
                                duration: 2000
                              })
                              setTimeout(() => {
                                wx.navigateBack({
                                  delta: 1
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
                  }else {
                    setTimeout(() => {
                      that.setData({
                        preventDuplication: true
                      })
                    }, 3000)
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

            })


          } else {
            if ("1" === type) {
              console.log("房屋报修")
              parameter = "property/repair/houseRepair";
              wx.showLoading({
                title: '提交中',
              });
              wx.request({
                url: dataUrl + parameter,
                method: "POST",
                data: {
                  appId: appId,
                  houseId: houseId,
                  resRepair: e.detail.value.resRepair,
                  resDesc: e.detail.value.resDesc,
                  repairImage: "",
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
                      title: "完成提交",
                      icon: 'none',
                      duration: 2000
                    })
                    setTimeout(() => {
                      wx.navigateBack({
                        delta: 1
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

            } else {
              console.log("举报投诉")
              parameter = "property/complaint/reportComplaint";
              wx.showLoading({
                title: '提交中',
              });
              wx.request({
                url: dataUrl + parameter,
                method: "POST",
                data: {
                  appId: appId,
                  houseId: houseId,
                  complainTitle: e.detail.value.resRepair,
                  complainContent: e.detail.value.resDesc,
                  complainImageUrl: "",
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
                      title: "完成提交",
                      icon: 'none',
                      duration: 2000
                    })
                    setTimeout(() => {
                      wx.navigateBack({
                        delta: 1
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