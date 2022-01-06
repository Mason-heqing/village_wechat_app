// pages/noticeDetails/noticeDetails.js
const util = require('../../utils/util.js')
const dataUrl = util.dataUrl
const requestId = util.requestId
const timeStamp = Date.parse(new Date())
Page({

  /**
   * 页面的初始数据
   */
  data: {
    noticeTitle:"",
    createTime:"",
    noticeContent:"",
    id:"",
    idx:null,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options)
    const that = this;
    let content = wx.getStorageSync('noticeContent'); 
    if (options && options.id){
     that.setData({
       noticeTitle: options.noticetitle,
       createTime: options.createtime,
       noticeContent: content.replace("&nbsp;",""),
       id: options.id,
       idx: options.idx
     })
   }
    that.sendStatus();
  },


  //发送读取状态
  sendStatus(){
   const that = this;
   let token = wx.getStorageSync('token'); 
    let appId = wx.getStorageSync('appId'); 
   let id = that.data.id;
    wx.showLoading();
    wx.request({
      url: dataUrl + "property/notice/readNoticeDeail",
      method: "POST",
      data: {
        id: id,
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
        if(200 == res.data.code && "SUCCESS" == res.data.msg){

        } else if (304 == res.data.code) {
          wx.showToast({
            title: res.data.msg,
            icon: 'none',
            duration: 2000
          })
          util.verdueToken()
        }else{
          wx.showToast({
            title: res.data.msg,
            icon:'none',
            duration:2000
          })
        }
      }
    })
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
    const that = this;
    let idx = that.data.idx;
    let pages = getCurrentPages();
    if (pages.length > 1) {
      //上一个页面实例对象 
      let prePage = pages[pages.length - 2];
      //关键在这里,这里面是触发上个界面的方法 
      prePage.setReadStatus(idx) // 123
    }

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