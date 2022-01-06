//index.js
//获取应用实例
const util = require('../../utils/util.js')
import WxValidate from '../../utils/WxValidate.js'
const dataUrl = util.dataUrl
const requestId = util.requestId
const header = util.header
const timeStamp = Date.parse(new Date())
const app = getApp()

Page({
  data: {
    openDoorMessage: false,
    isLogin: false,
    villageName: "",
    houseId: "",
    noticeInfo: true,
    bannerImg: [
      "../images/banner.png",
      "../images/banner1.png"
    ],
    tool: [{
      name: "远程开门",
      toolIcon: "../images/longRange.png",
      events: "longRange",
      jurisdiction: true,
    },
    {
      name: "访客预约",
      toolIcon: "../images/authorization_icon.png",
      events: "authorization",
      jurisdiction: true,
    },
    {
      name: "住户管理",
      toolIcon: "../images/houseHold_icon.png",
      events: "houseHold",
      jurisdiction: true,
    },
      {
        name: "扫码开门",
        toolIcon: "../images/scanCode_icon.png",
        events: "scanCode",
        jurisdiction: true,
      },
      {
        name: "门前监视",
        toolIcon: "../images/monitor_icon.png",
        events: "monitor",
        jurisdiction: true,
      },
      

      {
        name: "房屋报修",
        toolIcon: "../images/repair_icon.png",
        events: "repair",
        jurisdiction: true,
      },
      {
        name: "联系物业",
        toolIcon: "../images/concat_icon.png",
        events: "contact",
        jurisdiction: true,
      },
      {
        name: "举报投诉",
        toolIcon: "../images/complaint_icon.png",
        events: "complaint",
        jurisdiction: true,
      },
      {
        name: "物业账单",
        toolIcon: "../images/bill_icon.png",
        events: "bill",
        jurisdiction: true,
      }
      ,
      // {
      //   name: "停车缴费",
      //   toolIcon: "../images/tingche.png",
      //   events: "payment",
      //   jurisdiction: true,
      // }
    ],
    indicatorDots: true,
    currentText: true,
    noContent: false,
    noticeContent: "",
    indicatorColor: "grey",
    indicatorActivecolor: "white",
    vertical: false,
    autoplay: true,
    interval: 5000,
    duration: 1000
  },

  //跳转到物业通知模块
  more() {
    const that = this;
    let token = wx.getStorageSync('token');
    let isLogin = that.data.isLogin;
    if (token) {
      if (isLogin) {
        wx.navigateTo({
          url: '../notice/notice'
        })
      } else {
        that.setData({
          openDoorMessage: true
        })
      }
    } else {
      util.notLogin(token);
    }
  },

// 停车缴费
payment() {
  const that = this;
    let token = wx.getStorageSync('token');
    if(token){
      wx.navigateTo({
        url:'../parkPayment/parkPayment'
      })
    }else {
      wx.showToast({
        title: '请先登录',
        icon: 'none',
        duration: 2000
      })
      setTimeout(function () {
        wx.navigateTo({
          url:'../login/login'
        })
      },2000)
    }

},
  //切换地址
  roomChange(e) {
    wx.navigateTo({
      url: '../roomChange/roomChange',
    })
  },


  //扫码
  scanCode() {
    const that = this;
    let token = wx.getStorageSync('token');
    let isLogin = that.data.isLogin;
    if (token) {
      if (isLogin) {
        console.log("扫码")
        wx.scanCode({
          success(res) {
            if (res.result){
              // that.decode("QYSN:" + that.getCaption(res.result, 1).substring(0, that.getCaption(res.result, 1).length - 1))
              if ("/" == (that.getCaption(res.result, 1)).substr((that.getCaption(res.result, 1)).length - 1, 1)){
                that.decode("QYSN:" + that.getCaption(res.result, 1).substring(0, that.getCaption(res.result, 1).length - 1))
              }else{
                that.decode("QYSN:" + that.getCaption(res.result, 1))
              }
            }
          }
        })
      } else {
        that.setData({
          openDoorMessage: true
        })
      }
    } else {
      util.notLogin(token);
    }
  },


  //解析字符串
  getCaption(obj, state) {
    var index = obj.lastIndexOf("\:");
    if (state == 0) {
      obj = obj.substring(0, index);
    } else {
      obj = obj.substring(index + 1, obj.length);
    }
    return obj;
  },

  //扫码开门接口调用
  decode(value) {
    const that = this;
    let token = wx.getStorageSync('token');
    wx.request({
      url: dataUrl + "qrcode/decode",
      method: "POST",
      data: {
        content: value
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
            title: "门锁已开",
            icon: 'none',
            duration: 2000
          })
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
            duration: 5000
          })
        }
      }
    })
  },

  //远程开门
  longRange() {
    const that = this;
    let token = wx.getStorageSync('token');
    let isLogin = that.data.isLogin;
    if (token) {
      if (isLogin) {
        wx.navigateTo({
          url: '../longRange/longRange'
        })
      } else {
        that.setData({
          openDoorMessage: true
        })
      }
    } else {
      util.notLogin(token);
    }
  },

  //门前监视
  monitor() {
    const that = this;
    let token = wx.getStorageSync('token');
    let isLogin = that.data.isLogin;
    if (token) {
      if (isLogin) {
        wx.navigateTo({
          url: '../monitor/monitor'
        })
        // wx.showToast({
        //   title:"该功能暂未开通",
        //   icon: 'none',
        //   duration: 2000
        // })
      } else {
        that.setData({
          openDoorMessage: true
        })
      }
    } else {
      util.notLogin(token);
    }
  },

  //访客授权
  authorization() {
    const that = this;
    let token = wx.getStorageSync('token');
    let isLogin = that.data.isLogin;
    let villageName = that.data.villageName;
    let houseId = that.data.houseId;
    if (token) {
      if (isLogin) {
        wx.navigateTo({
          url: '../visitorAuthorization/visitorAuthorization?villageName=' + villageName + "&houseId=" + houseId,
        })
      } else {
        that.setData({
          openDoorMessage: true
        })
      }
    } else {
      util.notLogin(token);
    }
  },

  //住户管理
  houseHold() {
    const that = this;
    let token = wx.getStorageSync('token');
    let isLogin = that.data.isLogin;
    let houseId = that.data.houseId;
    if (token) {
      if (isLogin) {
        wx.navigateTo({
          url: '../houseHold/houseHold?houseId='+houseId,
        })
      } else {
        that.setData({
          openDoorMessage: true
        })
      }
    } else {
      util.notLogin(token);
    }
  },

  //联系物业
  contact() {
    const that = this;
    let token = wx.getStorageSync('token');
    let isLogin = that.data.isLogin;
    if (token) {
      if (isLogin) {
        wx.navigateTo({
          url: '../contact/contact',
        })
      } else {
        that.setData({
          openDoorMessage: true
        })
      }
    } else {
      util.notLogin(token);
    }
  },

  //房屋报修
  repair() {
    const that = this;
    let token = wx.getStorageSync('token');
    let isLogin = that.data.isLogin;
    let houseId = that.data.houseId;
    if (token) {
      if (isLogin) {
        wx.navigateTo({
          url: '../repair/repair?type=1' + "&houseId=" + houseId,
        })
      } else {
        that.setData({
          openDoorMessage: true
        })
      }
    } else {
      util.notLogin(token);
    }
  },

  //举报投诉
  complaint() {
    const that = this;
    let token = wx.getStorageSync('token');
    let isLogin = that.data.isLogin;
    let houseId = that.data.houseId;
    if (token) {
      if (isLogin) {
        wx.navigateTo({
          url: '../repair/repair?type=2' + "&houseId=" + houseId,
        })
      } else {
        that.setData({
          openDoorMessage: true
        })
      }
    } else {
      util.notLogin(token);
    }
  },

  //物业账单
  bill() {
    const that = this;
    let token = wx.getStorageSync('token');
    let isLogin = that.data.isLogin;
    let houseId = that.data.houseId;
    if (token) {
      if (isLogin) {
        wx.navigateTo({
          url: '../bill/bill?houseId=' + houseId,
        })
      } else {
        that.setData({
          openDoorMessage: true
        })
      }
    } else {
      util.notLogin(token);
    }
  },

  //未登录 - 选择地址
  selectAdress() {
    let token = wx.getStorageSync('token');
    if (token) {
      // wx.navigateTo({
      //   url: '../administration/administration',
      // })
      wx.navigateTo({
        url: '../roomChange/roomChange',
      })

    } else {
      util.notLogin(token);
    }

  },

  modalConfirm() {
    const that = this;
    wx.navigateTo({
      url: '../administration/administration',
    })
  },
  
  //解析链接
  getQueryString: function (url, name) {
    var reg = new RegExp('(^|&|/?)' + name + '=([^&|/?]*)(&|/?|$)', 'i');
    var r = url.substr(1).match(reg);
    if (r != null) {
      return r[2];
    }
    return null;
  },

  onLoad: function(options) {
    // 89f3d4ede44840f9a1f4e016454d8a80
    // console.log(wx.getStorageSync('appId'),'剑道长存万古长！！！')
    const that = this;
    let token = wx.getStorageSync('token');
    let personSubtype = wx.getStorageSync('personSubtype');
    let wxAppId = wx.getAccountInfoSync().miniProgram.appId;
    if('wxd519face30907864' == wxAppId){
      wx.setNavigationBarTitle({
        title: '小Q安居管家'
      })
    }else if('wx78a03393552c2ceb' == wxAppId){
      wx.setNavigationBarTitle({
        title: '任脸行智慧社区'
      })
    }
    if (token) {
      that.reference()
    }
  },
  onShow: function() {
    
  },
  indexInfo(value) {
    const that = this;
    let person_type = false;
    let appId = wx.getStorageSync('appId');
    wx.showLoading({
      title: '加载中',
    })
    wx.request({
      url: dataUrl + "homepage/index",
      method: "POST",
      data: {
        appId: appId
      },
      header:header(value),
      // header: {
      //   'content-type': 'application/json', // 默认值
      //   "token": value,
      //   "type": 2,
      //   "requestId": requestId(),
      //   "timestamp": timeStamp,
      //   "market": 'Applet',
      //   "version": 'none'
      // },
      success(res) {
        wx.hideLoading()
        console.log(res,'888888')
        if (200 == res.data.code && "SUCCESS" == res.data.msg) {
          if (res.data.data.message) {
            if ("1" === res.data.data.message.readStatus || "" === res.data.data.message.readStatus) {
              that.setData({
                noticeInfo: true,
              })
            } else {
              that.setData({
                noticeInfo: false,
              })
            }
            if (res.data.data.message.noticeContent) {
              that.setData({
                noticeContent: res.data.data.message.noticeContent,
                currentText: false,
                noContent: true,
                isContent: false
              })
            } else {
              that.setData({
                noticeContent: "",
                currentText: true,
                noContent: false,
                isContent: true
              })
            }
          }
          if (res.data.data.apply && 0 < res.data.data.apply.length) {
            let names = "";
            let houseId = "";
            let id = "";
            res.data.data.apply.forEach((item, index) => {
              if (1 === item.defBind) {
                that.setData({
                  index: index,
                })
                if (1 === item.personSubtype) {
                  that.setData({
                    ["tool[2].jurisdiction"]: true,
                  })
                  person_type = true;
                } else {
                  that.setData({
                    ["tool[2].jurisdiction"]: false,
                  })
                  person_type = false
                }
                names = item.houseAddress;
                id = item.houseId;
              }
            })
            if ("" != names) {
              that.setData({
                villageName: names,
                houseId: id
              })
            } else {
              that.setData({
                villageName: res.data.data.apply[0].houseAddress,
                houseId: res.data.data.apply[0].houseId
              })
            }
            that.setData({
              isLogin: true,
              adress: res.data.data.apply
            })
            app.globalData.isLogin = true;
          } else {
            that.setData({
              isLogin: false,
              adress: []
            })
            app.globalData.isLogin = false;
          }
          if (res.data.data.modelSettings && person_type) {
            if (-1 != res.data.data.modelSettings.indexOf("bill")) {
              that.setData({
                ["tool[8].jurisdiction"]: true,
              })
            } else {
              that.setData({
                ["tool[8].jurisdiction"]: false,
              })
            }
            if (-1 != res.data.data.modelSettings.indexOf("complaints")) {
              that.setData({
                ["tool[7].jurisdiction"]: true,
              })
            } else {
              that.setData({
                ["tool[7].jurisdiction"]: false,
              })
            }
            if (-1 != res.data.data.modelSettings.indexOf("repairs")) {
              that.setData({
                ["tool[5].jurisdiction"]: true,
              })
            } else {
              that.setData({
                ["tool[5].jurisdiction"]: false,
              })
            }
          }
          if (-1 != res.data.data.modelSettings.indexOf("deviceRemoteOpen")) {
            that.setData({
              ["tool[0].jurisdiction"]: true,
            })
          } else {
            that.setData({
              ["tool[0].jurisdiction"]: false,
            })
          }
          if(-1 != res.data.data.modelSettings.indexOf("visitorOpen")){
            that.setData({
              ["tool[1].jurisdiction"]: true,
            })
          }else{
            that.setData({
              ["tool[1].jurisdiction"]: false,
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

  //刷新数据
  reference() {
    const that = this;
    let token = wx.getStorageSync('token');
    wx.request({
      url: dataUrl + "homepage/appInfo",
      method: "POST",
      data: {},
      header:header(token),
      // header: {
      //   'content-type': 'application/json', // 默认值
      //   "token": token,
      //   "type": 2,
      //   "requestId": requestId(),
      //   "timestamp": timeStamp,
      //   "market": 'Applet',
      //   "version": 'none'
      // },
      success(res) {
        wx.hideLoading()
        console.log(res)
        if (200 == res.data.code && "SUCCESS" == res.data.msg) {
          if (res.data.data && 0 < res.data.data.length) {
            res.data.data.forEach((item, index) => {
              if (1 == item.defBind) {
                wx.setStorageSync('appId', item.appId);
              }
            })
          }
          that.indexInfo(token)
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
  onPullDownRefresh() {
    const that = this;
    let token = wx.getStorageSync('token');
    let personSubtype = wx.getStorageSync('personSubtype');
    if (token) {
      that.reference()
    }
    wx.stopPullDownRefresh();
  }
})