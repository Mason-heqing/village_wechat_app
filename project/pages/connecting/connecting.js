// pages/connecting/connecting.js
const util = require('../../utils/util.js')
var total_micro_second = 60 * 1000;
const recorderManager = wx.getRecorderManager();
let options = {
  duration: 10000,
  sampleRate: 44100,
  numberOfChannels: 1,
  encodeBitRate: 192000,
  format: 'aac',
  frameSize: 50
}

/* 毫秒级倒计时 */
function countdown(that) {
  // 渲染倒计时时钟
  that.setData({
    clock: dateformat(total_micro_second)
  });

  if (total_micro_second <= 0) {
    that.setData({
      clock: "已经截止"
    });
    // timeout则跳出递归
    return;
  }
  setTimeout(function () {
    // 放在最后--
    total_micro_second -= 10;
    countdown(that);
  }
  ,10)
}

// 时间格式化输出，如3:25:19 86。每10ms都会调用一次
function dateformat(micro_second) {
  // 秒数
  var second = Math.floor(micro_second / 1000);
  // 小时位
  var hr = Math.floor(second / 3600);
  // 分钟位
  var min = Math.floor((second - hr * 3600) / 60);
  // 秒位
  var sec = (second - hr * 3600 - min * 60);// equal to => var sec = second % 60;

  // 毫秒位，保留2位
  var micro_sec = Math.floor((micro_second % 1000) / 10);
  if (sec < 10){
    return min + " : " +"0"+sec;
  }else{
    return min + " : " + sec;
  }
  
}

Page({

  /**
   * 页面的初始数据
   */
  data: {
    scrollHeight:0,
    times:true,
    countdown:"",
    silenceName:"",
    silenceSetIcon: "../images/call_silence_open.png",
    camera: "../images/camera.png",
    microphone:"../images/microphone.png",
    silence:"../images/silence.png",
    connectStatus:false,
    flag:true
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const that = this;
    wx.getSystemInfo({
      success: function (res) {
        // console.log(res);
        // 可使用窗口宽度、高度
        // 计算主体部分高度,单位为px
        that.setData({
          // cameraHeight部分高度 = 利用窗口可使用高度 - 固定高度（这里的高度单位为px，所有利用比例将300rpx转换为px）
          scrollHeight: res.windowHeight - res.windowWidth / 750 * 605
        })
      }
    });

    recorderManager.onError(function () {
      that.tip("录音失败！")
    });
    recorderManager.onPause(function () {
      that.tip("录音暂停！")
    })
    recorderManager.onResume(function () {
      that.tip("录音继续！")
    })
    recorderManager.onStop(function (res) {
      console.log(res);
      that.tip("录音停止！")
      // that.setData({
      //   src: res.tempFilePath
      // })
    })

    
    // recorderManager.start(options)
  },

  //提示信息
  tip: function (msg) {
    wx.showModal({
      title: '提示',
      content: msg,
      showCancel: false
    })
  },

  //静音设置
  silenceSet(){
    const that = this;
    if (that.data.flag){
      that.setData({
        silenceSetIcon: "../images/call_silence_stop.png",
        silenceName: "静音",
        flag:false
      })
    }else{
      that.setData({
        silenceSetIcon: "../images/call_silence_open.png",
        silenceName: "",
        flag:true
      })
    }
  },

  //接听
  facetalkAnswer(){
    const that = this;
    that.setData({
      connectStatus:true,
      times:false
    })
    countdown(this);
    recorderManager.onStart((res) => {
      console.log('开始录音')
    });
    recorderManager.start({
      format: 'mp3',
      duration: 300000,
    })
    setTimeout(()=>{
      recorderManager.stop()
      console.log("结束录音--->")
      that.facetalkAnswer();
    },5000)

  },

  //计时器
  countDown() {
    var that = this
    var starttime = '2020/09/03 15:50:00'
    var start = new Date(starttime.replace(/-/g, "/")).getTime()
    var endTime = start + 15 * 60000

    var date = new Date(); //现在时间
    var now = date.getTime(); //现在时间戳

    var allTime = endTime - now
    var m, s;
    if (allTime > 0) {
      m = Math.floor(allTime / 1000 / 60 % 60);
      s = Math.floor(allTime / 1000 % 60);
      that.setData({
        countdown: m + "：" + s,
      })
      setTimeout(that.countDown, 1000);
    } else {
      console.log('已截止')
      that.setData({
        countdown: '00:00'
      })
    }
  },


  //点击开始拍照(手指触摸开始)
  cameraDownStart(){
   const that = this;
   that.setData({
     camera:"../images/camera_down.png"
   })
  },

  //点击开始拍照(手指离开触摸按钮)
  cameraDownEnd() {
    const that = this;
    that.setData({
      camera: "../images/camera.png"
    })
  },

  //点击麦克风(手指触摸开始)
  microOhoneDownStart(){
   const that = this;
   that.setData({
     microphone:"../images/microphone_down.png"
   })
  },

  //点击麦克风(手指离开触摸按钮)
  microOhoneDownEnd() {
    const that = this;
    that.setData({
      microphone: "../images/microphone.png"
    })
  },

  //点击静音(手指触摸开始)
  silenceDownStart(){
    const that = this;
    that.setData({
      silence: "../images/silence_down.png"
    })
  },

  //点击静音(手指离开触摸按钮)
  silenceDownEnd() {
    const that = this;
    that.setData({
      silence: "../images/silence.png"
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