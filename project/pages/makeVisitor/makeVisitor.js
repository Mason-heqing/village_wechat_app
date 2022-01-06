// pages/makeVisitor/makeVisitor.js
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
      //   person:'张三',
      //   address:'前海湾',
      //   visitorTimes:''
      // },
      // {
      //   status:1,
      //   faceUrl:'../images/faceImgDefault.png',
      //   person:'李四',
      //   address:'后海地铁站',
      //   visitorTimes:''
      // },
      // {
      //   status:2,
      //   faceUrl:'../images/faceImgDefault.png',
      //   person:'王五',
      //   address:'人才公园',
      //   visitorTimes:'人才公园'
      // },
    ],
    historyAppointmentlist:[]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const that = this;
    pageNum = 1;
    this.isShowFace();
    that.getVisitorInfo('0');
  },

  //选中当前预约
  currentBtn(){
     const that = this;
     that.setData({
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
      historyAppointmentlist:[]
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
     historyAppointmentlist:[
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
      //  {
      //   status:3,
      //   faceUrl:'../images/faceImgDefault.png',
      //   name:'王五',
      //   address:'人才公园',
      //   visitorTimes:'人才公园'
      //  }
     ]
    })
    pageNum = 1
     that.getVisitorInfo('1')
  },
 

  //获取访客信息 type值： 当前 0 历史 1
  getVisitorInfo(type){
    const that = this;
    let token = wx.getStorageSync('token');
    wx.showLoading({
      title: '加载中',
    });
    wx.request({
      url: dataUrl + "visit/appointmentPage",
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
              if (0 === that.data.historyAppointmentlist.length){
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
    url: '../orderDetails/orderDetails?id='+ id + "&type=1",
  })
},

  //取消预约 
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

  //删除预约
  delete(e){
    const that = this;
    let token = wx.getStorageSync('token');
    let type = e.target.dataset.type
    let id = e.target.dataset.id;
    wx.showModal({
      title: '确定要删除吗？',
      success(res) {
        if (res.confirm) {
          wx.showLoading({
            title: '正在删除中',
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
                  title: '删除成功',
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

  appointment(e){
    console.log(e)
    // const that = this;
    wx.setStorageSync('visitorAppId',e.target.dataset.item.appId);
    wx.setStorageSync('visitorCheckType',e.target.dataset.item.checkType);
    wx.setStorageSync('visitorfaceUrl',e.target.dataset.item.faceUrl);
    wx.setStorageSync('visitorHouseId',e.target.dataset.item.houserId);
    wx.setStorageSync('visitorName',e.target.dataset.item.name);
    wx.setStorageSync('visitorNumberPlate',e.target.dataset.item.numberPlate);
    wx.setStorageSync('visitorPhone',e.target.dataset.item.phone);
    wx.setStorageSync('visitorVisitAddress',e.target.dataset.item.address);
    wx.setStorageSync('visitorVisitDate',e.target.dataset.item.visitDate);
    wx.setStorageSync('visitorVisitPerson',e.target.dataset.item.visitPerson);
    wx.setStorageSync('visitorVisitPersonId',e.target.dataset.item.visitPersonId);
    wx.setStorageSync('visitorIdNum',e.target.dataset.item.idNum);
    // let appId = e.target.dataset.item.appId;
    // let checkType = e.target.dataset.item.checkType;
    // let faceUrl = e.target.dataset.item.faceUrl; 
    // let houseId = e.target.dataset.item.houseId;
    // let name = e.target.dataset.item.name;
    // let numberPlate = e.target.dataset.item.numberPlate;
    // let phone = e.target.dataset.item.phone;
    // let visitAddress = e.target.dataset.item.address;
    // let visitDate = e.target.dataset.item.visitDate;
    // let visitPerson = e.target.dataset.item.visitPerson;
    // let visitPersonId = e.target.dataset.item.visitPersonId;
    wx.showModal({
      title: '确定要再次预约吗？',
      success(res) {
        if (res.confirm) {
          wx.navigateTo({
            url: '../againAppointment/againAppointment',
          })
          // wx.navigateTo({
          //   url: '../againAppointment/againAppointment?visitAddress=' + visitAddress + '&appId=' + appId + '&checkType=' + checkType + '&faceUrl=' + faceUrl + '&houseId=' + houseId + '&name=' + name + '&numberPlate' + numberPlate + '&phone=' + phone + '&visitDate=' + visitDate + '&visitPerson=' + visitPerson + '&visitPersonId=' + visitPersonId,
          // })
         
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
    that.setData({
      currentAppointmentlist:[],
      historyAppointmentlist:[]
     });
     pageNum = 1
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
  onShareAppMessage: function () {
    
  }
})