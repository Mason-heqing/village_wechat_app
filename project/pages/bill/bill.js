// pages/bill/bill.js
const util = require('../../utils/util.js')
import WxValidate from '../../utils/WxValidate.js'
const dataUrl = util.dataUrl
const requestId = util.requestId
const imgShow = util.imgShow
const timeStamp = Date.parse(new Date())
let pageNum = 1
const pageSize = 20
Page({

  /**
   * 页面的初始数据
   */
  data: {
    bgColor:"rgb(242, 242, 242)",
    showMessage:true,
    noMessage:false,
    searchLeft:298,
    inputText:"center",
    inputValue:"",
    scrollHeight:0,
    list:[],
    houseId:""
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const that = this;
    pageNum = 1;
    wx.getSystemInfo({
      success: function (res) {
        // console.log(res);
        // 可使用窗口宽度、高度
        // 计算主体部分高度,单位为px
        that.setData({
          // cameraHeight部分高度 = 利用窗口可使用高度 - 固定高度（这里的高度单位为px，所有利用比例将300rpx转换为px）
          scrollHeight: res.windowHeight - res.windowWidth / 750 * 158
        })
      }
    });
    if (options && options.houseId){
       that.setData({
         houseId: options.houseId
       })
      that.getList("");
    }
  },
 
  //输入信息
  inputBind(e){
    const that = this;
    console.log(e.detail.value);
    let token = wx.getStorageSync('token');
    let appId = wx.getStorageSync('appId');
    let houseId = that.data.houseId;
    that.setData({
      inputValue: e.detail.value.trim(),
    })
    // that.getQuery()
  },

  //查询物业账单
  getQuery(){
    const that = this;
    let token = wx.getStorageSync('token');
    let appId = wx.getStorageSync('appId');
    let houseId = that.data.houseId;
    pageNum = 1;
    console.log("")
    that.setData({
      list: []
    })
    wx.request({
      url: dataUrl + "property/bill/getAllBill",
      method: "POST",
      data: {
        billName: that.data.inputValue,
        appId: appId,
        houseId: houseId,
        pageNum: pageNum,
        pageSize: pageSize
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
        console.log("122333");
        console.log(res)
        if (200 == res.data.code && "SUCCESS" == res.data.msg) {
          pageNum++
          if (pageNum >= res.data.data.total) {
            pageNum = res.data.data.total
          }
          if (0 < res.data.data.records.length) {
            let oldData = that.data.list;
            that.setData({
              showMessage: false,
              noMessage: true,
              list: oldData.concat(res.data.data.records),
              bgColor: "rgb(242, 242, 242)",
            })
          } else {
            if (0 === that.data.list.length) {
              that.setData({
                showMessage: true,
                noMessage: false,
                list: [],
                bgColor: "#fff",
              })
            }
            // wx.showToast({
            //   title: "没有数据 !",
            //   icon: 'none',
            //   duration: 2000
            // })
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
   
  //聚焦输入信息
  bindfocus(e){
    const that = this;
    if ("focus" == e.type) {
      console.log("聚焦焦点")
      that.setData({
        searchLeft: 60,
        inputText: "left",
      })
    }
  },

  //失焦触发
  bindblur(e){
    const that = this;
    if ("blur" == e.type) {
      console.log("失去焦点")
      if ("" != that.data.inputValue) {
        that.setData({
          searchLeft: 60,
          inputText: "left",
        })
      } else {
        that.setData({
          searchLeft:298,
          inputText: "center",
        })
        that.blurRef();
      }
    }
  },

  //失焦刷新
  blurRef(){
    const that = this;
    pageNum = 1;
    that.setData({
      list: []
    })
    if ("" == that.data.inputValue){
      that.getList("");
    }
  },

  //搜索内容
  search(){
    const that = this;
    pageNum = 1;
    let value = that.data.inputValue.trim();
    that.setData({
      list:[]
    })
    that.getList(value);
  },

  //键盘搜索按钮
  bindconfirm(){
    const that = this;
    pageNum = 1;
    let value = that.data.inputValue.trim();
    that.setData({
      list: []
    })
    that.getList(value);
  },
  
 //详情
  details(e){
    const that = this;
    let array = e.currentTarget.dataset.download.split(',');
    let downLoadFileArray = [];
    array.forEach((item,index)=>{
      downLoadFileArray.push(imgShow + item)
    })
    let downLoadFile = imgShow + e.currentTarget.dataset.download;
    wx.previewImage({
      current: downLoadFileArray[0], //当前图片地址
      urls: downLoadFileArray,  //所有要预览的图片的地址集合数组形式
      success: function (res) {},
      fail: function (res) { },
      complete: function (res) { },
    })
  }, 
  
  //获取列表信息
  getList(value){
    const that = this;
    let token = wx.getStorageSync('token');
    let appId = wx.getStorageSync('appId');
    let houseId = that.data.houseId;
    wx.showLoading({
      title: '加载中',
    })
    wx.request({
      url: dataUrl + "property/bill/getAllBill",
      method: "POST",
      data: {
        billName: value,
        houseId: houseId,
        appId:appId,
        pageNum:pageNum,
        pageSize:pageSize
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
          pageNum++
          if (pageNum >= res.data.data.total) {
            pageNum = res.data.data.total
          } 
          if (0 < res.data.data.records.length){
            let oldData = that.data.list;
            that.setData({
              showMessage: false,
              noMessage: true,
              list: oldData.concat(res.data.data.records),
              bgColor: "rgb(242, 242, 242)",
            })
          }else{
            if (0 === that.data.list.length){
              that.setData({
                showMessage: true,
                noMessage: false,
                list: [],
                bgColor: "#fff",
              })
            }
            // wx.showToast({
            //   title: "没有数据 !",
            //   icon: 'none',
            //   duration: 2000
            // })
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

  //重试
  again(){
   const that = this;
   that.getList();
  },

  //触底刷新
  upper(){
    const that = this;
    let value = that.data.inputValue;
    if ("" == value){
      that.getList("");
    }else{
      that.getList(value); 
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
    const that = this;
    pageNum = 1;
    that.setData({
      list:[]
    })
    that.getList("");
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    const that = this;
    let value = that.data.inputValue;
    if ("" == value) {
      that.getList("");
    } else {
      that.getList(value);
    }
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})