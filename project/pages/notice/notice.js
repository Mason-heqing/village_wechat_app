// pages/notice/notice.js
const util = require('../../utils/util.js')
const dataUrl = util.dataUrl
const requestId = util.requestId
const imgShow = util.imgShow
const timeStamp = Date.parse(new Date())
let pageNum = 1
const pageSize = 10
Page({

  /**
   * 页面的初始数据
   */
  data: {
    showMessage: true,
    noMessage: false,
    allReadBtn:true,
    scrollHeight:0,
    timer: null, // 保存定时器
    scrollTop:5,
    allReadAnimation:{},
    notice:[]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const that = this;
    pageNum = 1
    wx.getSystemInfo({
      success: function (res) {
        // 可使用窗口宽度、高度
        // 计算主体部分高度,单位为px
        that.setData({
          // cameraHeight部分高度 = 利用窗口可使用高度 - 固定高度（这里的高度单位为px，所有利用比例将300rpx转换为px）
          scrollHeight: res.windowHeight - res.windowWidth / 750 * 10
        })
      }
    });
    that.getNoticeList();
    // that.animationIn();
    // that.animation();
  //  setInterval(()=>{
  //    console.log(1);
  //    that.animation();
  //  },1000)
  },
  
  //跳转详情信息
  details(e){
    let noticetitle = e.currentTarget.dataset.noticetitle;
    let createtime = e.currentTarget.dataset.createtime;
    let content = e.currentTarget.dataset.content;
    let id = e.currentTarget.dataset.id;
    let idx = e.currentTarget.dataset.index;
    wx.setStorageSync('noticeContent', content);
    wx.navigateTo({
      url: '../noticeDetails/noticeDetails?noticetitle=' + noticetitle + "&createtime=" + createtime + "&id=" + id + "&idx=" + idx ,
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  animationInit(){
    const that = this;
    let animation = wx.createAnimation({
      duration:0,
      timingFunction: 'ease',
    })
    animation.translateX(140).step();
    that.setData({
      allReadAnimation: animation.export()
    })
  },

  animationOut(){
    const that = this;
    let animation = wx.createAnimation({
      duration: 2000,
    })
    animation.translateX(140).step({duration:3000});
    that.setData({
      allReadAnimation:animation.export()
    })

  },

  animationIn() {
    const that = this;
    let animation = wx.createAnimation({
      duration: 2000,
    })
    animation.translateX(0).step({ duration: 3000 });
    that.setData({
      allReadAnimation: animation.export()
    })

  },
  
  //置为全部已读
  allRead(){
    const that = this;
    let token = wx.getStorageSync('token'); 
    let appId = wx.getStorageSync('appId');
    wx.showLoading({
      title: '加载中',
    })
    wx.request({
      url: dataUrl + "property/notice/readAllNotice",
      method: "POST",
      data: {
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
        if (200 == res.data.code && "SUCCESS" == res.data.msg) {
          that.animationOut();
          that.setData({
            allReadBtn:true,
            notice:[]
          })
          // let refreshData = that.data.notice;
          // refreshData.forEach((item,index)=>{
          //   item.noticeInfo = true;
          //   item.readStatus = 1;  
          // })
          // that.setData({
          //   notice: refreshData
          // })

          pageNum = 0;
          wx.request({
            url: dataUrl + "property/notice/pageAll",
            method: "POST",
            data: {
              pageNum: pageNum,
              pageSize: pageSize,
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
              if (200 == res.data.code && "SUCCESS" == res.data.msg) {
                pageNum++
                if (pageNum >= res.data.data.total) {
                  pageNum = res.data.data.total
                }
                if (0 < res.data.data.records.length) {
                  res.data.data.records.forEach((item, index) => {
                    item.content = item.noticeContent.replace(/<img/gi, "<img class='richImg'style='width:auto!important;height:auto!important;max-height:100%;width:100%;'")
                      .replace(/<p/gi, "<p class='richtext'style='padding:30rpx 0;'");
                    if (item.noticeImage) {
                      item.noticeImage = item.noticeImage;
                    } else {
                      item.noticeImage = "../images/wuye.png"
                    }
                    if (item.noticeContent) {
                      item.noticeContent = item.noticeContent.replace(/(\n)/g, "");
                      item.noticeContent = item.noticeContent.replace(/(\t)/g, "");
                      item.noticeContent = item.noticeContent.replace(/(\r)/g, "");
                      item.noticeContent = item.noticeContent.replace(/<\/?[^>]*>/g, "");
                      item.noticeContent = item.noticeContent.replace(/\s*/g, "")
                    }
                    if (0 == item.readStatus) {
                      item.noticeInfo = false
                    } else {
                      item.noticeInfo = true
                    }
                  })
                  let oldData = that.data.notice;
                  that.setData({
                    showMessage: false,
                    noMessage: true,
                    notice: oldData.concat(res.data.data.records),
                  })
                } else {
                  if (0 == that.data.notice.length) {
                    that.setData({
                      showMessage: true,
                      noMessage: false,
                    })
                  }

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

  //获取物业通知列表
  getNoticeList(){
    const that = this;
    let token = wx.getStorageSync('token'); 
    let appId = wx.getStorageSync('appId'); 
    wx.showLoading({
      title: '加载中',
    })
    wx.request({
      url: dataUrl + "property/notice/pageAll",
      method: "POST",
      data: {
        pageNum:pageNum,
        pageSize:pageSize,
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
        var noRead = [];
        if (200 == res.data.code && "SUCCESS" == res.data.msg) {
          pageNum++
          if (pageNum >= res.data.data.total) {
            pageNum = res.data.data.total
          } 
          if (0 < res.data.data.records.length){
            res.data.data.records.forEach((item,index)=>{
              item.content = item.noticeContent.replace(/<img/gi, "<img class='richImg'style='width:auto!important;height:auto!important;max-height:100%;width:100%;'")
                .replace(/<p/gi, "<p class='richtext'style='padding:30rpx 0;'");
              if (item.noticeImage){
                item.noticeImage = item.noticeImage;
              }else{
                item.noticeImage = "../images/wuye.png"
              }
              if (item.noticeContent){
                item.noticeContent = item.noticeContent.replace(/(\n)/g, "");
                item.noticeContent = item.noticeContent.replace(/(\t)/g, "");
                item.noticeContent = item.noticeContent.replace(/(\r)/g, "");
                item.noticeContent = item.noticeContent.replace(/<\/?[^>]*>/g, "");
                item.noticeContent = item.noticeContent.replace(/\s*/g, "")
              }
              if (0 == item.readStatus){
                item.noticeInfo = false
                noRead.push(index);
              }else{
                item.noticeInfo = true
              }
            })
            if (0 < noRead.length){
              that.animationIn();
                that.setData({
                  allReadBtn:false
                })
            }else{
              // that.animationOut();
              that.animationInit()
              that.setData({
                allReadBtn: true
              })
            }
            let oldData = that.data.notice;
            that.setData({
              showMessage: false,
              noMessage: true,
              notice: oldData.concat(res.data.data.records), 
            })
          }else{
            if (0 == that.data.notice.length){
              that.animationInit()
              that.setData({
                showMessage: true,
                noMessage: false,
              })
            }
            
          }
        } else if (304 == res.data.code) {
          wx.showToast({
            title: res.data.msg,
            icon: 'none',
            duration: 2000
          })
          util.verdueToken()
        }else {
          wx.showToast({
            title: res.data.msg,
            icon: 'none',
            duration: 2000
          })
        }
      }
    })
       
  },

  setReadStatus(idx){
   const that = this;
   let oldNotice = that.data.notice;
   let noReadArr = [];
    oldNotice.forEach((item,index)=>{
      if (idx == index && 0 == item.readStatus){
        item.readStatus = 1;
        item.noticeInfo = true;
       }
      if(0 == item.readStatus){
        noReadArr.push(index); 
       }   
    })
    if(0 == noReadArr.length){
          that.animationOut();
          that.setData({
            allReadBtn:true
          })
    }
    that.setData({
      notice: oldNotice
    })
  },
   
  //重试
  // again(){
  // const that = this;
  //   that.setData({
  //     notice:[]
  //   })
  //   that.getNoticeList();
  // },
  refresh() { // 函数式触发开始下拉刷新。如可以绑定按钮点击事件来触发下拉刷新
    const that = this;
    wx.startPullDownRefresh({
      success(errMsg) {
        pageNum = 1;
        that.setData({
          notice: []
        })
        that.getNoticeList();
      },
      complete() {
        // console.log('下拉刷新完毕')
      }
    })
  },

  scrollFn(e){
    // 防抖，优化性能
    // 当滚动时，滚动条位置距离页面顶部小于设定值时，触发下拉刷新
    // 通过将设定值尽可能小，并且初始化scroll-view组件竖向滚动条位置为设定值。来实现下拉刷新功能，但没有官方的体验好
    clearTimeout(this.timer)
    if (e.detail.scrollTop < this.data.scrollTop) {
      this.timer = setTimeout(() => {
        this.refresh()
      }, 350)
    }
  },



  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    const that = this;
    pageNum = 1;
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
    let pages = getCurrentPages();   //当前页面
    let prevPage = pages[pages.length - 2];   //上一页面
    prevPage.onLoad();
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    const that = this;
    pageNum = 1;
    that.setData({
      notice: []
    })
    that.getNoticeList();
    wx.stopPullDownRefresh();
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    const that = this;
    that.getNoticeList();
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})