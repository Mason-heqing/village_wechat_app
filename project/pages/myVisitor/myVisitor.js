// pages/myVisitor/myVisitor.js
const util = require('../../utils/util.js')
const dataUrl = util.dataUrl
const imgShow = util.imgShow
const requestId = util.requestId
const header = util.header
const timeStamp = Date.parse(new Date())
let pageNum = 1
let pageSize = 100
Page({

  /**
   * 页面的初始数据
   */
  data: {
    isFaceImg:true,
    showMessage:true,
    noMessage:false,
    active:true,
    currentAppointmentlist:[
      // {
      //   status:0,
      //   faceUrl:'../images/faceImgDefault.png',
      //   name:'张三',
      //   address:'前海湾',
      //   visitorTimes:''
      // },
      // {
      //   status:1,
      //   faceUrl:'../images/faceImgDefault.png',
      //   name:'李四',
      //   address:'后海地铁站',
      //   visitorTimes:''
      // },
      // {
      //   status:2,
      //   faceUrl:'../images/faceImgDefault.png',
      //   name:'王五',
      //   address:'人才公园',
      //   visitorTimes:'人才公园'
      // },
    ],
    historyAppointmentlist:[],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const that = this;
    pageNum = 1;
    this.isShowFace();
    that.getVisitorInfo('0')
  },

  //选中当前预约
  currentBtn(){
     const that = this;
     that.setData({
      active:true,
      currentAppointmentlist:[],
      // currentAppointmentlist:[
      //   {
      //     status:0,
      //     faceImg:'../images/faceImgDefault.png',
      //     person:'张三',
      //     address:'前海湾',
      //     visitorTimes:''
      //   },
      //   {
      //     status:1,
      //     faceImg:'../images/faceImgDefault.png',
      //     person:'李四',
      //     address:'后海地铁站',
      //     visitorTimes:''
      //   },
      //   {
      //     status:2,
      //     faceImg:'../images/faceImgDefault.png',
      //     person:'王五',
      //     address:'人才公园',
      //     visitorTimes:'人才公园'
      //   },
      // ],
      historyAppointmentlist:[],
     });
     pageNum = 1
     that.getVisitorInfo('0')
  },
  

  //选中历史预约
  historyBtn(){
    const that = this;
    that.setData({
     active:false,
     currentAppointmentlist:[],
     historyAppointmentlist:[],
    //  historyAppointmentlist:[
    //   {
    //     status:0,
    //     faceImg:'../images/faceImgDefault.png',
    //     person:'张三',
    //     address:'前海湾',
    //     visitorTimes:''
    //   },
    //   {
    //     status:1,
    //     faceImg:'../images/faceImgDefault.png',
    //     person:'李四',
    //     address:'后海地铁站',
    //     visitorTimes:''
    //   },
    //   {
    //     status:2,
    //     faceImg:'../images/faceImgDefault.png',
    //     person:'王五',
    //     address:'人才公园',
    //     visitorTimes:'人才公园'
    //   },
    //  ]
    })
    pageNum = 1;
    that.getVisitorInfo('1')
  },
   
  //获取访客信息  type值： 当前 0 历史 1
  getVisitorInfo(type){
    const that = this;
    let token = wx.getStorageSync('token');
    wx.showLoading({
      title: '加载中',
    });
    wx.request({
      url: dataUrl + "visit/authRecord",
      method: "POST",
      data: {
        pageNum: pageNum,
        pageSize: pageSize,
        type:type
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
            res.data.data.records.forEach((item,index)=>{
              if (!item.faceUrl || "" == item.faceUrl){
                item.faceUrl = "../images/faceImgDefault.png"
              }else{
                item.faceUrl = imgShow + item.faceUrl;
              }
              item.visitDate = item.visitDate.slice(0, 10);
              item.address = item.address.replace(/\//g, "")
            })
            if('0' === type){
              let oldData = that.data.currentAppointmentlist;
              that.setData({
                currentAppointmentlist: oldData.concat(res.data.data.records),
                showMessage:false,
                noMessage:true,
              })  
            }else{
              let oldData = that.data.historyAppointmentlist;
              that.setData({
                historyAppointmentlist: oldData.concat(res.data.data.records),
                showMessage:false,
                noMessage:true,
              }) 
            }
          }else{
            if('0' === type){
              if (0 === that.data.currentAppointmentlist.length){
                that.setData({
                  showMessage: true,
                  noMessage:false,
                  currentAppointmentlist:[]
                })
              }
            }else{
              if (0 === that.data.currentAppointmentlist.length){
                that.setData({
                  showMessage: true,
                  noMessage:false,
                  historyAppointmentlist:[]
                })
              }
            }
            
            // wx.showToast({
            //   title:"没有数据 !",
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

   //根据人员信息获取人脸图片权限
 isShowFace(){
  const that = this;
  let token = wx.getStorageSync('token');
  wx.request({
    url: dataUrl + "user/getShowStatus",
    method: "POST",
    data: {
      wxAppId:wx.getAccountInfoSync().miniProgram.appId,
    },
    header:header(token),
    success(res) {
      console.log(res)
      if (200 == res.data.code && "SUCCESS" == res.data.msg) {
        if ("true" == res.data.data.showStatus) {
          that.setData({
            isFaceImg: false
          })
        } else {
          that.setData({
            isFaceImg: true
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

//详情
details(e){
  const that = this;
  let id = e.currentTarget.dataset.id;
  wx.navigateTo({
    url: '../visitorPass/visitorPass?id='+ id + "&type=1",
  })
},

  //同意
  consent(e){
    const that = this;
    let token = wx.getStorageSync('token');
    let id = e.currentTarget.dataset.id;
    wx.showModal({
      title: '确定同意吗？',
      success(res) {
        if (res.confirm) {
          wx.showLoading({
            title: '正在处理中',
          })
          wx.request({
            url: dataUrl + "visit/checkPass",
            method: "POST",
            data: {
              id:id
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
                  title: '已同意',
                  icon: 'success',
                  duration: 2000
                })
                pageNum = 1
                that.setData({
                  active:true,
                  currentAppointmentlist:[],
                  historyAppointmentlist:[],
                })
                that.getVisitorInfo('0')
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
          
        } else if (res.cancel) {
          wx.hideLoading();
        }
      }
    })
  },

  //谢绝
  reject(e){
    const that = this;
    let token = wx.getStorageSync('token');
    let id = e.currentTarget.dataset.id;
    wx.showModal({
      title: '确定要谢绝吗？',
      success(res) {
        if (res.confirm) {
          wx.showLoading({
            title: '正在谢绝中',
          })
          wx.request({
            url: dataUrl + "visit/reject",
            method: "POST",
            data: {
              id:id
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
                  title: '该记录已谢绝处理',
                  icon: 'success',
                  duration: 2000
                })
                pageNum = 1
                that.setData({
                  active:true,
                  currentAppointmentlist:[],
                  historyAppointmentlist:[],
                })
                that.getVisitorInfo('0')
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
          
        } else if (res.cancel) {
          wx.hideLoading();
        }
      }
    })
  },

  //取消
  cancelBtn(e){
   const that = this;
   let token = wx.getStorageSync('token');
   let id = e.target.dataset.id;
   wx.showModal({
    title: '确定要取消吗？',
    success(res) {
      if (res.confirm) {
        wx.showLoading({
          title: '正在取消中。',
        })
        wx.request({
          url: dataUrl + "visit/cancel",
          method: "POST",
          data: {
            id:id
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
                title: '该记录已取消成功',
                icon: 'success',
                duration: 2000
              })
              pageNum = 1
              that.setData({
                active:true,
                currentAppointmentlist:[],
                historyAppointmentlist:[],
              })
              that.getVisitorInfo('0')
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
        
      } else if (res.cancel) {
        wx.hideLoading();
      }
    }
  })
  },

  //删除
  delete(e){
    const that = this;
    let token = wx.getStorageSync('token');
    let id = e.target.dataset.id;
    let type = e.target.dataset.type;
    wx.showModal({
      title: '确定要删除吗？',
      success(res) {
        if (res.confirm) {
          wx.showLoading({
            title: '正在删除。。。',
          })
          wx.request({
            url: dataUrl + "visit/delete",
            method: "POST",
            data: {
              id:id
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
                  title: '删除记录成功',
                  icon: 'success',
                  duration: 2000
                })
                pageNum = 1
                if('0' === type){
                  that.setData({
                    active:true,
                    currentAppointmentlist:[],
                    historyAppointmentlist:[],
                  })
                  that.getVisitorInfo('0')
                }else{
                  that.setData({
                    active:false,
                    currentAppointmentlist:[],
                    historyAppointmentlist:[],
                  })
                  that.getVisitorInfo('1')
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
          
        } else if (res.cancel) {
          wx.hideLoading();
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
    
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    const that = this;
    pageNum = 1
    that.setData({
      currentAppointmentlist:[],
      historyAppointmentlist:[],
     });
     if(that.data.active){
      that.getVisitorInfo('0')
     }else{
      that.getVisitorInfo('1')
     }
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function (e) {
    const that =this;
    console.log(e)
    let address = e.target.dataset.item.address;
    let appId = e.target.dataset.item.appId;
    let checkType = e.target.dataset.item.checkType;
    let faceUrl = e.target.dataset.item.faceUrl;
    let houserId = e.target.dataset.item.houserId;
    let numberPlate = e.target.dataset.item.numberPlate;
    let name = e.target.dataset.item.name;
    let phone = e.target.dataset.item.phone;
    let visitDate = e.target.dataset.item.visitDate;
    let visitPerson = e.target.dataset.item.visitPerson;
    let visitPersonId = e.target.dataset.item.visitPersonId;
    return {
      title: '邀请您访问:' + address,
      path: '/pages/firmShare/firmShare?address=' + address + "&checkType=" + checkType + "&appId=" + appId + "&faceUrl=" + faceUrl + "&houserId="  + houserId + "&phone=" + phone + "&name=" + name + "&visitDate=" + visitDate + '&numberPlate=' + numberPlate + '&visitPerson=' + visitPerson + '&visitPersonId=' + visitPersonId,
      imageUrl: '/pages/images/share_bg.png',
    }
    // return {
    //   title: '邀请您访问:',
    //   path:'/pages/index/index',
    //   imageUrl: '/pages/images/share_bg.png',
    // }
  }
})