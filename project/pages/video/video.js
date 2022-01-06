// pages/video/video.js
const util = require('../../utils/util.js')
const dataUrl = util.dataUrl
const requestId = util.requestId
const header = util.header
const timeStamp = Date.parse(new Date())
let socketOpen = false
let socketMsgQueue = []
let count = 60
Page({

  /**
   * 页面的初始数据
   */
  data: {
    deviceId:"",
    times:60,
    intervalId: null,
    playStreamWssAddress:"",
    videoImg:"../images/videoDefault.png",
    minute:"00",
    second:"00"
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const that = this;
    if (options && options.deviceId){
        that.setData({
          deviceId: options.deviceId
        })
    }
    wx.getSystemInfo({
      success: function (res) {
        // 可使用窗口宽度、高度
        // 计算主体部分高度,单位为px
        that.setData({
          // cameraHeight部分高度 = 利用窗口可使用高度 - 固定高度（这里的高度单位为px，所有利用比例将300rpx转换为px）
          scrollHeight: res.windowHeight - res.windowWidth / 750 * 258
        })
      }
    });
    
    
  },


  //获取视频流地址
  getVideoUrl(){
   const that = this;
    let deviceId = that.data.deviceId;
    let token = wx.getStorageSync('token');
    wx.showLoading({
      title: '正在连接中',
    })
    wx.request({
      url: dataUrl + "monitoring/getDeviceMediaStream",
      method: "POST",
      data: {
        id: deviceId,
      },
      header:header(token),
      success(res) {
        wx.hideLoading();
        console.log(res)
        if (200 == res.data.code && "SUCCESS" == res.data.msg) {
          that.setData({
            playStreamWssAddress: res.data.data.playStreamWssAddress
          })
          if (res.data.data.playStreamWssAddress){
            that.videoWebsocket(res.data.data.playStreamWssAddress);
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


  //websocket 
  videoWebsocket(value){
    const that = this;
    let url = that.data.playStreamWssAddress;
    wx.connectSocket({
      url: value
    })
    
    //建立连接
    wx.onSocketOpen(function (res) {
      console.log("websocket已连接")
      socketOpen = true
      for (var i = 0; i < socketMsgQueue.length; i++) {
        that.sendSocketMessage(socketMsgQueue[i])
      }
      socketMsgQueue = []
      that.countDown();
      wx.showLoading({
        title: '连接中',
      });
    })

    //连接失败
    wx.onSocketError(function (res) {
      console.log('WebSocket连接打开失败，请检查！')
    })
    
    //服务器返回消息
    wx.onSocketMessage(function (res) {
      // console.log('收到服务器内容：' + wx.arrayBufferToBase64(res.data))
      if(res.data){
        wx.hideLoading();
         that.setData({
           videoImg: "data:image/png;base64," +  wx.arrayBufferToBase64(res.data)
         })
      }
    })
    
    //关闭
    wx.onSocketClose(function (res) {
      console.log('WebSocket 已关闭！')
    })
  },

  //画布图片
  drawimage(img){
    console.log("img-->",img);
    let context = wx.createCanvasContext('imageCanvas')
    let path = img;
    context.drawImage(path, 0, 0, 686, 686)
  },
 

  //计时器
  countDown(){
   let that = this;
    that.setData({
      intervalId: setInterval(function () {
        count -= 1;
        that.setData({
          times: count,
        })
        if (count == 0) {
          clearInterval(that.data.intervalId);  //倒计时结束，停止interval
          // wx.closeSocket();
          count = 60;
          wx.navigateBack({
                delta: 1,  // 返回上一级页面。
          })
        }
      }, 1000)
    })
  }, 


  //计时器
  timing: function (that) {
    // var second = that.data.second
    var time = setTimeout(function () {
      if ((parseInt(that.data.second) + 1) > 59) {
        if (9 > that.data.minute){
          that.setData({
            minute: "0" + parseInt(parseInt(that.data.minute) + 1),
            second:0
          });
        }else{
          that.setData({
            minute: parseInt(that.data.minute + 1),
            second: 0
          });
        }
        
      }
      else {
        if (9 > parseInt(that.data.second)){
          that.setData({
            second:"0" +  parseInt(parseInt(that.data.second) + 1)
          });
        }else{
          that.setData({
            second: parseInt(parseInt(that.data.second) + 1)
          });
        }
       
      }
      that.timing(that);
    }
      , 1000)
  },
   

  //发送消息 
  sendSocketMessage(msg){
    if (socketOpen) {
      wx.sendSocketMessage({
        data: msg
      })
    } else {
      socketMsgQueue.push(msg)
    }
  }, 



 
  //拍照
  camera(){
    const that = this;
    let imgSrc = that.data.videoImg.slice(22);//base64编码
    let save = wx.getFileSystemManager();
    let number = Math.random();
    save.writeFile({
      filePath: wx.env.USER_DATA_PATH + '/pic' + number + '.png',
      data: imgSrc,
      encoding: 'base64',
      success: res => {
        wx.saveImageToPhotosAlbum({
          filePath: wx.env.USER_DATA_PATH + '/pic' + number + '.png',
          success: function (res) {
            wx.showToast({
              title: '拍照成功',
            })
          },
          fail: function (err) {
            console.log(err)
          }
        })
        console.log(res)
      }, fail: err => {
        console.log(err)
      }
    })
  },

  //开门
  openDoor(e) {
    const that = this;
    let token = wx.getStorageSync('token');
    let appId = wx.getStorageSync('appId');
    let deviceId = that.data.deviceId;
    wx.request({
      url: dataUrl + "door/open",
      method: "POST",
      data: {
        deviceId: deviceId
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
            duration: 2000
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
    const that = this;
    count = 60;
    that.getVideoUrl();
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
    // const that = this;
    // wx.closeSocket();
    // clearInterval(that.data.intervalId); 
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
    // wx.closeSocket();
    const that = this;
    wx.closeSocket();
    clearInterval(that.data.intervalId); 
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