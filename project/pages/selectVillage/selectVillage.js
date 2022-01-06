// pages/selectVillage/selectVillage.js
const QQMapWX = require('../../utils/qqmap-wx-jssdk.js'); //先引用城市数据文件
const qqmapsdk = new QQMapWX({
  key: 'DD7BZ-DPEWU-QTRVS-2JCOB-YB3IO-3HFOE' // 必填
});  // 实例化API核心类
const util = require('../../utils/util.js')
import WxValidate from '../../utils/WxValidate.js'
const dataUrl = util.dataUrl
const requestId = util.requestId
const header = util.header
const timeStamp = Date.parse(new Date())
Page({

  /**
   * 页面的初始数据
   */
  data: {
    showMessage:true,
    noMessage:false,
    scrollHeight:0,
    searchLeft:248,
    inputText:"center",
    currentCity:"",
    searchVillage:"",
    cityId:"",
    list:[]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const that = this;
    let currentCity = that.data.currentCity;
    wx.getSystemInfo({
      success: function (res) {
        // 可使用窗口宽度、高度
        // 计算主体部分高度,单位为px
        that.setData({
          // cameraHeight部分高度 = 利用窗口可使用高度 - 固定高度（这里的高度单位为px，所有利用比例将300rpx转换为px）
          scrollHeight: res.windowHeight - res.windowWidth / 750 * 260
        })
      }
    });
    that.adress();
  },
  
 //文本聚焦
  bindfocus(e){
    const that = this;
    if ("focus" == e.type){
      that.setData({
        searchLeft: 40,
        inputText: "left",
      })
   }
  },
  //文本失焦
  bindblur(e){
    const that = this;
    let villageName = that.data.searchVillage.trim();
    let cityId = that.data.cityId;
    if ("blur" == e.type) {
      if ("" != villageName){
        that.setData({
          searchLeft: 40,
          inputText: "left",
        })
     }else{
        that.setData({
          searchLeft: 248,
          inputText: "center",
        })
        // that.blurRef("", cityId)
     }
    }
  },

  //失焦刷新
  blurRef(name, value){
    const that = this;
    let token = wx.getStorageSync('token');
    wx.request({
      url: dataUrl + "house/manage/getResidences",
      method: "POST",
      data: {
        residenceName: name,
        cityId: value
      },
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
              if (item.areaName && "" != item.areaName) {
                let currentAddress = item.areaName.split(",")
                item.country = currentAddress[0];
                item.province = currentAddress[1];
                item.city = currentAddress[2];
                item.area = currentAddress[3];
              }
            })
            that.setData({
              showMessage: false,
              noMessage: true,
              list: res.data.data
            })
          } else {
            that.setData({
              showMessage: true,
              noMessage: false,
              list: []
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

 //跳转详情
  details(e){
    const that = this;
    let village = e.currentTarget.dataset.info.deviceGroupName;
    let deviceGroupId = e.currentTarget.dataset.info.deviceGroupId;
    let appId = e.currentTarget.dataset.info.appId;
    wx.navigateTo({
      url: '../edit/edit?village=' + village + "&deviceGroupId=" + deviceGroupId + "&appId=" + appId,
    })
  },
  

  //获取城市地址
  adress() {
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
            console.log(res)
            let cityId = res['result']['ad_info']['city_code'].substring(res['result']['ad_info']['city_code'].length - 6)
            _this.setData({
              currentCity: res['result']['address_component']['city'],
              cityId: cityId
            })
            let villageName = _this.data.searchVillage.trim();
            _this.getResidences(villageName, cityId);
            console.log("res--->",res);//获取市名称
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

  city(){
    wx.navigateTo({
      url: '../city/city',
    })
  },

  //搜索小区名
  inputBind(e){
    const that = this;
    let cityId = that.data.cityId;
    // let cityId = wx.getStorageSync('cityId');
    let token = wx.getStorageSync('token');
    let value = e.detail.value.replace(/\s+/g, '');
    that.setData({
      searchVillage: value
    })
    if ("" != value){
      wx.request({
        url: dataUrl + "house/manage/getResidences",
        method: "POST",
        data: {
          residenceName: value,
          cityId: ""
        },
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
          if (200 == res.data.code && "SUCCESS" == res.data.msg) {
            if (res.data.data && 0 < res.data.data.length) {
              res.data.data.forEach((item, index) => {
                if (item.areaName && "" != item.areaName) {
                  let currentAddress = item.areaName.split(",")
                  item.country = currentAddress[0];
                  item.province = currentAddress[1];
                  item.city = currentAddress[2];
                  item.area = currentAddress[3];
                }
              })
              that.setData({
                showMessage: false,
                noMessage: true,
                list: res.data.data
              })
            } else {
              that.setData({
                showMessage: true,
                noMessage: false,
                list: []
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
    }else{
      that.blurRef("", cityId)
    }
  },
  
  //获取小区列表
  getResidences(name,value){
   const that = this;
    let token = wx.getStorageSync('token');
    wx.showLoading({
      title: '加载中',
    })
    wx.request({
      url: dataUrl + "house/manage/getResidences",
      method: "POST",
      data: {
        residenceName: name,
        cityId: value,
        WxAppId:wx.getAccountInfoSync().miniProgram.appId,
      },
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
          if (res.data.data && 0 < res.data.data.length){
            res.data.data.forEach((item,index)=>{
              if (item.areaName && "" != item.areaName){
                let currentAddress = item.areaName.split(",")
                item.country = currentAddress[0];
                item.province = currentAddress[1];
                item.city = currentAddress[2];
                item.area = currentAddress[3];
               }
            })
            that.setData({
              showMessage: false,
              noMessage: true,
              list: res.data.data
            })
          }else{
            that.setData({
              showMessage: true,
              noMessage: false,
              list:[]
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
  
  search(){
    const that = this;
    let villageName = that.data.searchVillage.trim();
    // let currentCity = that.data.currentCity;
    let cityId = that.data.cityId;
    let token = wx.getStorageSync('token');
    if ("" != villageName){
      wx.showLoading({
        title: '加载中',
      })
      wx.request({
        url: dataUrl + "house/manage/getResidences",
        method: "POST",
        data: {
          residenceName: villageName,
          cityId: ""
        },
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
              that.setData({
                showMessage: false,
                noMessage: true,
                list: res.data.data
              })
            } else {
              that.setData({
                showMessage: true,
                noMessage: false,
                list: []
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
    }else{
      that.getResidences("", cityId)
    }
    
  },

  //键盘搜索
  bindconfirm(){
    const that = this;
    let villageName = that.data.searchVillage.trim();
    // let currentCity = that.data.currentCity;
    let cityId = that.data.cityId;
    let token = wx.getStorageSync('token');
    if ("" != villageName) {
      wx.showLoading({
        title: '加载中',
      })
      wx.request({
        url: dataUrl + "house/manage/getResidences",
        method: "POST",
        data: {
          residenceName: villageName,
          cityId: ""
        },
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
              that.setData({
                showMessage: false,
                noMessage: true,
                list: res.data.data
              })
            } else {
              that.setData({
                showMessage: true,
                noMessage: false,
                list: []
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
    } else {
      that.getResidences("", cityId)
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
    const that = this;
    // let cityName = wx.getStorageSync('cityName');
    let cityName = that.data.cityName;
    if (""  != cityName){
       that.setData({
         currentCity: cityName
       })
    }
  },

  selectCity(){
    const that = this;
    // let cityName = wx.getStorageSync('cityName');
    let cityName = that.data.cityName;
    let cityId = that.data.cityId;
    // let cityId = wx.getStorageSync('cityId');
    that.getResidences("", cityId);
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
    const that = this;
    let villageName = that.data.searchVillage.trim();
    // let cityName = that.data.currentCity;
    let cityId = that.data.cityId;
    if ("" != villageName){
      that.getResidences(villageName, cityId);
    }else{
      that.getResidences("", cityId);
    }
    wx.stopPullDownRefresh();
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