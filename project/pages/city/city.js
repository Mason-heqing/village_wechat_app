// pages/city/city.js
const QQMapWX = require('../../utils/qqmap-wx-jssdk.js'); //先引用城市数据文件
const qqmapsdk = new QQMapWX({
  key: 'DD7BZ-DPEWU-QTRVS-2JCOB-YB3IO-3HFOE' // 必填
});  // 实例化API核心类
const util = require('../../utils/util.js')
const dataUrl = util.dataUrl
const requestId = util.requestId
const timeStamp = Date.parse(new Date())
const city = require('../../utils/city.js')
let lineHeight = 0;
let endWords = "";
let isNum;
Page({
  data: {
    "hidden": true,
    showMessage:true,
    noMessage:false,
    searchLeft:218,
    inputValue:"",
    inputText:"center",
    cityName: "", //获取选中的城市名
    currentCityId:"",//获取城市id

  },
  onLoad: function (options) {
    const that = this;
    that.adress();
    that.cityList();
  },


  //输入信息
  inputBind(e) {
    const that = this;
    let token = wx.getStorageSync('token');
    that.setData({
      inputValue: e.detail.value.trim()
    })
    if ("" != e.detail.value.trim()) {
      wx.request({
        url: dataUrl + "house/manage/likeAreaName",
        method: "POST",
        data: {
          areaName: e.detail.value.trim()
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
            if (res.data.data && "" != res.data.data) {
              let cityChild = res.data.data;
              wx.getSystemInfo({
                success: function (res) {
                  lineHeight = (res.windowHeight - 100) / 22;
                  console.log(res.windowHeight - 100)
                  that.setData({
                    showMessage: false,
                    noMessage: true,
                    city: cityChild,
                    winHeight: res.windowHeight - 128,
                    lineHeight: lineHeight
                  })
                }
              })
            } else {
              that.setData({
                showMessage: true,
                noMessage: false,
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
    } else {
      wx.request({
        url: dataUrl + "house/manage/areaSort",
        method: "POST",
        data: {},
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
            if (res.data.data && "" != res.data.data) {
              let cityChild = res.data.data;
              wx.getSystemInfo({
                success: function (res) {
                  lineHeight = (res.windowHeight - 100) / 22;
                  console.log(res.windowHeight - 100)
                  that.setData({
                    showMessage: false,
                    noMessage: true,
                    city: cityChild,
                    winHeight: res.windowHeight - 128,
                    lineHeight: lineHeight
                  })
                }
              })
            } else {
              that.setData({
                showMessage: true,
                noMessage: false,
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
    }
  },

  //定位跳转
  location(){
     const that = this;
     console.log(123456);
    var cityName = that.data.cityName;
    var cityId = that.data.currentCityId;
    console.log("定位跳转--->",cityId, cityName);
    if (cityId && "" != cityId){
      var cityIds = cityId.substring(-1,4) + "00"
      var pages = getCurrentPages();
      var prevPage = pages[pages.length - 2];
      prevPage.setData({
        cityId: cityIds,
        cityName: cityName
      })
      prevPage.selectCity();
      wx.navigateBack({
        delta: 1,  // 返回上一级页面。
      })
    }else{
      wx.navigateBack({
        delta: 1,  // 返回上一级页面。
      })
    }
  },

  //聚焦输入信息
  bindfocus(e) {
    const that = this;
    if ("focus" == e.type) {
      that.setData({
        searchLeft: 25,
        inputText: "left",
      })
    }
  },

  //失焦触发
  bindblur(e) {
    const that = this;
    if ("blur" == e.type) {
      if ("" != that.data.inputValue) {
        that.setData({
          searchLeft:25,
          inputText: "left",
        })
      } else {
        that.setData({
          searchLeft: 218,
          inputText: "center",
        })
        that.blurRef();
      }
    }
  },

  //失焦刷新
  blurRef(){
    const that = this;
    let token = wx.getStorageSync('token');
    wx.request({
      url: dataUrl + "house/manage/areaSort",
      method: "POST",
      data: {},
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
          if (res.data.data && "" != res.data.data) {
            let cityChild = res.data.data;
            wx.getSystemInfo({
              success: function (res) {
                lineHeight = (res.windowHeight - 100) / 22;
                console.log(res.windowHeight - 100)
                that.setData({
                  showMessage: false,
                  noMessage: true,
                  city: cityChild,
                  winHeight: res.windowHeight - 128,
                  lineHeight: lineHeight
                })
              }
            })
          } else {
            that.setData({
              showMessage: true,
              noMessage: false,
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

  //按城市内容搜索
  search(){
    const that = this;
    let name = that.data.inputValue;
    if ("" != name){
      that.searchName(name);
    }else{
      that.cityList();
    }
  },

  //键盘搜索
  bindconfirm(){
    const that = this;
    let name = that.data.inputValue;
    if ("" != name) {
      that.searchName(name);
    } else {
      that.cityList();
    }
  },
   
  //根据名称搜索
  searchName(name){
    const that = this;
    let token = wx.getStorageSync('token');
    wx.showLoading({
      title: '加载中',
    })
    wx.request({
      url: dataUrl + "house/manage/likeAreaName",
      method: "POST",
      data: {
        areaName: name
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
          if (res.data.data && "" != res.data.data) {
            let cityChild = res.data.data;
            wx.getSystemInfo({
              success: function (res) {
                lineHeight = (res.windowHeight - 100) / 22;
                console.log(res.windowHeight - 100)
                that.setData({
                  showMessage: false,
                  noMessage: true,
                  city: cityChild,
                  winHeight: res.windowHeight - 128,
                  lineHeight: lineHeight
                })
              }
            })
          } else {
            that.setData({
              showMessage: true,
              noMessage: false,
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


  //获取城市列表
  cityList(){
   const that = this;
    let token = wx.getStorageSync('token');
    wx.showLoading({
      title: '加载中',
    })
    wx.request({
      url: dataUrl + "house/manage/areaSort",
      method: "POST",
      data: {},
      header: {
        'content-type': 'application/json', // 默认值
        "token":token,
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
          if (res.data.data && "" != res.data.data){
            let cityChild = res.data.data;
            wx.getSystemInfo({
              success: function (res) {
                lineHeight = (res.windowHeight - 100) / 22;
                console.log(res.windowHeight - 100)
                that.setData({
                  showMessage:false,
                  noMessage:true,
                  city: cityChild,
                  winHeight: res.windowHeight - 128,
                  lineHeight: lineHeight
                })
              }
            })
          }else{
            that.setData({
              showMessage: true,
              noMessage: false,
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


  onReady: function () {
    const that = this;
    that.cityList();
    // 生命周期函数--监听页面初次渲染完成
  },
  onShow: function () {
    // 生命周期函数--监听页面显示
  
  },

  adress(){
    let _this = this;
    //调用获取城市列表接口
    wx.getLocation({
      type: 'wgs84',
      success: function (res) {
        let latitude = res.latitude
        let longitude = res.longitude
        // 调用接口
        qqmapsdk.reverseGeocoder({
          location: {
            latitude: latitude,
            longitude: longitude
          },
          success: function (res) {
            _this.setData({
              cityName: res['result']['address_component']['city'],
              currentCityId: res['result']['ad_info']['adcode']
            })
            console.log(res['result']['address_component']['city']);//获取市名称
          },
          fail: function (res) {
            console.log(res);
          },
          complete: function (res) {
            console.log(res);
          }
        })
      }
    })
  },

  onHide: function () {
    // 生命周期函数--监听页面隐藏

  },
  onUnload: function () {
    // 生命周期函数--监听页面卸载

  },
  //触发全部开始选择
  chStart: function () {
    const that = this;
    that.setData({
      trans: ".1",
      hidden: false
    })
  },
  //触发结束选择
  chEnd: function () {
    const that = this;
    setTimeout(function(){
      that.setData({
        trans: "0",
        hidden: true,
        scrollTopId: this.endWords
      })
    },1000)
    
  },
  //获取文字信息
  // getWords: function (e) {
  //   var id = e.target.id;
  //   this.endWords = id;
  //   isNum = id;
  //   this.setData({
  //     showwords: this.endWords
  //   })
  // },
  //设置文字信息
  // setWords: function (e) {
  //   var id = e.target.id;
  //   this.setData({
  //     scrollTopId: id
  //   })
  // },

  // 滑动选择城市
  chMove: function (e) {
    var y = e.touches[0].clientY;
    var offsettop = e.currentTarget.offsetTop;
    var height = 0;
    var that = this;
    var cityarr = ["A", "B", "C", "D", "E", "F", "G", "H", "J", "K", "L", "M", "N", "P", "Q", "R", "S", "T", "W", "X", "Y", "Z"];
    // 获取y轴最大值
    wx.getSystemInfo({
      success: function (res) {
        height = res.windowHeight - 10;
      }
    });

    //判断选择区域,只有在选择区才会生效
    if (y > offsettop && y < height) {
      // console.log((y-offsettop)/lineHeight)
      var num = parseInt((y - offsettop) / lineHeight);
      endWords = cityarr[num];
      // 这里 把endWords 绑定到this 上，是为了手指离开事件获取值
      that.endWords = endWords;
    };


    //去除重复，为了防止每次移动都赋值 ,这里限制值有变化后才会有赋值操作，
    //DOTO 这里暂时还有问题，还是比较卡，待优化
    if (isNum != num) {
      // console.log(isNum);
      isNum = num;
      that.setData({
        showwords: that.endWords
      })
    }
  },
  //选择城市，并让选中的值显示在文本框里
  bindCity: function (e) {
    console.log(e);
    var cityName = e.currentTarget.dataset.city;
    var cityId = e.currentTarget.dataset.cityid;
    // this.setData({ cityName: cityName })
    // wx.setStorageSync('cityName', cityName)
    // wx.setStorageSync('cityId', cityId)
    var that = this
    var pages = getCurrentPages();
    var prevPage = pages[pages.length - 2];
    prevPage.setData({
      cityId: cityId,
      cityName: cityName
    })
    prevPage.selectCity();
    wx.navigateBack({
      delta: 1,  // 返回上一级页面。
    })
  }
})