// pages/reportDetails/reportDetails.js
const util = require('../../utils/util.js')
const dataUrl = util.dataUrl
const imgShow = util.imgShow
Page({

  /**
   * 页面的初始数据
   */
  data: {
    title:"",
    date:"",
    content:"",
    thingPic:[],
    opinion:""
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const that = this;
    let title = "";
    if (options.type && "1" === options.type) {
      title = "举报记录详情";
    } else {
      title = "报修记录详情";
    }
    if(options && options.title){
      let enclosure = [];
      if ("" != options.imgs){
        if (-1 === options.imgs.indexOf(",")) {
          enclosure.push(imgShow + options.imgs);
        } else {
          options.imgs.split(",").forEach((item,index)=>{
            enclosure.push(imgShow + item);
          })
        } 
      }
      if ("" == options.proposal){
        options.proposal = "暂无!"
      }
      that.setData({
        title:options.title,
        date: options.date,
        content: options.content,
        thingPic: enclosure,
        opinion: options.proposal,
      })
    }
    wx.setNavigationBarTitle({
      title: title
    });
  },

  //图片预览
  previewImg(e){
   const that = this;
   let src = e.currentTarget.dataset.img;;//获取data-src
    let imgList = that.data.thingPic;//获取data-list
    //图片预览
    wx.previewImage({
      current: src, // 当前显示图片的http链接
      urls: imgList // 需要预览的图片http链接列表
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