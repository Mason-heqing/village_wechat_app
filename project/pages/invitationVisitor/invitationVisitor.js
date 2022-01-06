// pages/invitationVisitor/invitationVisitor.js
import WxValidate from '../../utils/WxValidate.js'
const util = require('../../utils/util.js')
const dataUrl = util.dataUrl
const requestId = util.requestId
const timeStamp = Date.parse(new Date())
const imgShow = util.imgShow
const localImgUrl = "../images/faceImg.png";
const data = new Date().toLocaleDateString().replace(/\//g,'-')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    adressContent:false,
    // visitorTimes:false,
    // timesColor: "#999",
    villageName:'',
    houseId:'',
    date:data,
    form: {
      // date:"请选择到访时间",
      adress:"",//到访地址
      visitPerson:'',//邀请人
      visitPersonId:''//邀请人Id
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that = this;
    if(options && options.houseId){
     that.setData({
       ['form.adress']: options.villageName,
       houseId: options.houseId,
       adressContent:true
     })
    }
    that.getVisitorInfo();
  },

  //获取邀请信息
  getVisitorInfo(){
    const that = this;
    let token = wx.getStorageSync('token');
    wx.request({
      url: dataUrl + "visit/visitInfo",
      method: "POST",
      data: {id:that.data.houseId},
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
          that.setData({
            ['form.adress']:res.data.data.visitAddress,
            ['form.visitPerson']:res.data.data.visitPerson,
            ['form.visitPersonId']:res.data.data.visitPersonId,
          })
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

   //选择到访时间
  //  bindMultiPickerChange(e){
  //   console.log(e.detail.value)
  //   const that = this;
  //   that.setData({
  //     ["form.date"]: e.detail.value,
  //     timesColor:"#333",
  //     visitorTimes:true
  //   })
  // },

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
  onShareAppMessage: function() {
    let that = this;
    let visitAddress = that.data.form.adress;
    let visitPerson = that.data.form.visitPerson;
    let visitPersonId = that.data.form.visitPersonId;
    let houseId = that.data.houseId;
    let appId = wx.getStorageSync('appId');
    let wxAppId = wx.getAccountInfoSync().miniProgram.appId;
    let imageUrl = '';
    if('wxd519face30907864' == wxAppId){
      imageUrl = '/pages/images/share_bg.png';
    }else if('wx78a03393552c2ceb' == wxAppId){
      imageUrl = '/pages/images/other_share_bg.png';
    }
    return {
      title: '邀请您访问:' + visitAddress,
      path: '/pages/firmShare/firmShare?visitAddress=' + visitAddress + "&visitPerson=" + visitPerson + "&houseId=" + houseId + '&visitPersonId=' + visitPersonId + '&appId=' + appId,
      imageUrl: imageUrl
    }
    // wx.navigateTo({
    //   url: '../firmShare/firmShare?visitAddress=' + visitAddress + "&visitPerson=" + visitPerson + "&houseId=" + houseId + '&visitPersonId=' + visitPersonId + '&appId=' + appId,
    // })



  },
})