const util = require('../../utils/util.js')
const dataUrl = util.dataUrl
const requestId = util.requestId
const timeStamp = Date.parse(new Date())
const imgShow = util.imgShow
var app = getApp();
var x, y, x1, y1, x2, y2, index, currindex, n, yy;
let currentData = [];
Page({
  data: {
    switchChecked: false,
    houseId:'',
    mainx: 0,
    list: [],
    start: { x: 0, y: 0 }
  },

  //    * 生命周期函数--监听页面加载
//    */
  onLoad: function (options) {
    const that = this;
    if (options.houseId){
       that.setData({
         houseId: options.houseId
       })
    }
    that.getAllCallStatus();
    that.getCallPerson();
  },

  movestart: function (e) {
    currindex = e.currentTarget.dataset.index;
    x = e.touches[0].clientX;
    y = e.touches[0].clientY;
    x1 = e.currentTarget.offsetLeft;
    y1 = e.currentTarget.offsetTop;
  },
  move: function (e) {
    yy = e.currentTarget.offsetTop;
    x2 = e.touches[0].clientX - x + x1;
    y2 = e.touches[0].clientY - y + y1;
    console.log("y2-->",y2)
    this.setData({
      mainx: currindex,
      opacity: 0.7,
      start: { x: x2, y: y2 }
    })
  },
  moveend: function () {
    const that = this;
    if (y2 != 0) {
      var arr = [];
      for (var i = 0; i < this.data.list.length; i++) {
        arr.push(this.data.list[i]);
      }
      var nx = this.data.list.length;
      n = 1;
      for (var k = 2; k < nx; k++) {
        if (y2 > (72 * (k - 1) + k * 2 - 36)) {
          n = k;
        }
      }
      if (y2 > (72 * (nx - 1) + nx * 2 - 36)) {
        n = nx;
      }
      // console.log(arr);
      // console.log(arr1)
      arr.splice((currindex - 1), 1);
      arr.splice((n - 1), 0, currentData[currindex - 1]);
      currentData = [];
      for (var m = 0; m < this.data.list.length; m++) {
        // console.log(arr[m]);
        arr[m].id = m + 1;
        currentData.push(arr[m]);
      }
      let newOrderList = []; 
      arr.forEach((item,index)=>{
        let newJson = {};
        newJson.personHouseId = item.personHouseId;
        newJson.callOrder = index;
        item.callOrder = index;
        newOrderList.push(newJson);
      })
      console.log("修改排序-->",arr)
      this.setData({
        mainx: "",
        list: arr,
        opacity: 1
      }) 
      that.saveOrder(newOrderList)
    }
  },

  //设置群呼叫按钮
  switch1Change(){
    const that = this;
    let status = that.data.switchChecked;
    console.log("状态切换", status);
    if (status){
       that.setData({
         switchChecked:false
       })
      that.setCall(0)
    }else{
      that.setData({
        switchChecked: true
      })
      that.setCall(1)
    }
  },

  //   //获取群呼设置状态
  getAllCallStatus:function(){
    const that = this;
    let token = wx.getStorageSync('token');
    let houseId = that.data.houseId;
    wx.request({
      url: dataUrl + "resident/getHouseCallStatus",
      method: "POST",
      data: {
        houseId: houseId
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
          if (0 === res.data.data.groupCallStatus){
            that.setData({
              switchChecked: false
            })
         }else{
            that.setData({
              switchChecked: true
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

  //   //查询呼叫人员
  getCallPerson:function(){
    const that = this;
    let token = wx.getStorageSync('token');
    let appId = wx.getStorageSync('appId');
    let houseId = that.data.houseId;
    wx.showLoading({
      title: '加载中',
    })
    wx.request({
      url: dataUrl + "resident/queryCallPerson",
      method: "POST",
      data: {
        appId:appId,
        houseId: houseId
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
         if(0 < res.data.data.length){
           res.data.data.forEach((item,index)=>{
             item.id = index+1;
             if (item.faceUrl){
               item.faceUrl = imgShow + item.faceUrl
             }
           })
           currentData = res.data.data;
            that.setData({
              list: res.data.data
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
 
  //保存呼叫顺序
  saveOrder(value){
    const that = this;
    let token = wx.getStorageSync('token');
    let houseId = that.data.houseId;
    wx.showLoading({
      title: '加载中',
    })
    wx.request({
      url: dataUrl + "resident/saveCallOrder",
      method: "POST",
      data: {
        personList: value,
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
            title: "呼叫设置成功",
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
            duration: 2000
          })
        }
      }
    })
  },

 //群呼设置
 setCall(value){
   const that = this;
   let token = wx.getStorageSync('token');
   let houseId = that.data.houseId;
   wx.showLoading({
     title: '加载中',
   })
   wx.request({
     url: dataUrl + "resident/saveGroupCall",
     method: "POST",
     data: {
       groupCallStatus: value,
       houseId: houseId
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
           title:"群呼叫设置成功",
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
           duration: 2000
         })
       }
     }
   })
 }
 
})