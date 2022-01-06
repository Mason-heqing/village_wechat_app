// pages/reportList/reportList.js
const util = require('../../utils/util.js')
import WxValidate from '../../utils/WxValidate.js'
const dataUrl = util.dataUrl
const requestId = util.requestId
const timeStamp = Date.parse(new Date())
let pageNum = 1
const pageSize = 5
Page({

  /**
   * 页面的初始数据
   */
  data: {
    showMessage:true,
    noMessage:false,
    scrollHeight: 0,
    type: null,
    info:"",
    list:[]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const that = this;
    let title = "";
    pageNum = 1;
    wx.getSystemInfo({
      success: function (res) {
        // 可使用窗口宽度、高度
        // 计算主体部分高度,单位为px
        that.setData({
          // cameraHeight部分高度 = 利用窗口可使用高度 - 固定高度（这里的高度单位为px，所有利用比例将300rpx转换为px）
          scrollHeight: res.windowHeight - res.windowWidth / 750 * 60
        })
      }
    });
    if (options.type && "1" === options.type) {
      title = "举报投诉记录";
      that.setData({
        type: "1",
        info:"投诉内容"
        // placeHolderName: "报修物品名称",
      })
      that.getComplaintList();
    } else {
      title = "房屋报修记录";
      that.setData({
        type: "2",
        info: "报修内容"
        // placeHolderName: "举报内容",
      })
      that.getReportList();
    }

    wx.setNavigationBarTitle({
      title: title
    });
  },

  details(e){
    const that = this;
    let type = that.data.type;
    let title = e.currentTarget.dataset.title;
    let content = e.currentTarget.dataset.content
    let date = e.currentTarget.dataset.date
    let proposal = e.currentTarget.dataset.proposal
    let imgs = e.currentTarget.dataset.imgs
    wx.navigateTo({
      url: '../reportDetails/reportDetails?type=' + type + "&title=" + title + "&date=" + date + "&content=" + content + "&imgs=" + imgs + "&proposal=" + proposal,
    })
  },
  

  //获取举报投诉记录
  getComplaintList(){
    console.log("获取举报投诉记录");
    const that = this;
    let token = wx.getStorageSync('token');
    wx.showLoading({
      title: '加载中',
    });
    wx.request({
      url: dataUrl + "property/complaint/pageAll",
      method: "POST",
      data: {
        pageNum:pageNum,
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
        console.log(res)
        if (200 == res.data.code && "SUCCESS" == res.data.msg) {
          pageNum++
          if (pageNum >= res.data.data.total) {
            pageNum = res.data.data.total
          } 
          if (0 < res.data.data.records.length){
            let records = [];
            res.data.data.records.forEach((item,index)=>{
              let recordJson = {};
              recordJson.appId = item.appId;
              recordJson.id = item.id
              // recordJson.city = item.areaAddress;
              if (item.areaAddress && "" != item.areaAddress) {
                let cityName = item.areaAddress.split(",");
                recordJson.province = cityName[0];
                recordJson.area = cityName[1];
              }
              recordJson.date = item.createTime.slice(0, 16);
              recordJson.adress = item.houseAddress;
              recordJson.report = item.complainContent;
              recordJson.proposal = item.dealSuggestion;
              recordJson.title = item.complainTitle;
              recordJson.imgs = item.complainImageUrl;
              recordJson.dealStatus = item.dealStatus;
              records.push(recordJson);
            })
            let oldData = that.data.list;
            that.setData({
              showMessage: false,
              noMessage: true,
              list: oldData.concat(records),
            })
          } else {
            if (0 < that.data.list.length){
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


  //获取报修记录列表
  getReportList() {
    const that = this;
    let token = wx.getStorageSync('token');
    wx.showLoading({
      title: '加载中',
    });
    wx.request({
      url: dataUrl + "property/repair/pageAll",
      method: "POST",
      data: {
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
        console.log(res)
        if (200 == res.data.code && "SUCCESS" == res.data.msg) {
          pageNum++
          if (pageNum >= res.data.data.total) {
            pageNum = res.data.data.total
          } 
          if (0 < res.data.data.records.length) {
            let records = [];
            res.data.data.records.forEach((item, index) => {
              let recordJson = {};
              recordJson.appId = item.appId;
              recordJson.id = item.id
              if (item.areaAddress && "" != item.areaAddress) {
                let cityName = item.areaAddress.split(",");
                recordJson.province = cityName[0];
                recordJson.area = cityName[1];
              }
              // recordJson.city = item.areaAddress;
              recordJson.date = item.createTime.slice(0, 16);
              recordJson.adress = item.houseAddress;
              recordJson.report = item.resDesc;
              recordJson.proposal = item.dealSuggestion;
              recordJson.title = item.resRepair;
              recordJson.imgs = item.repairImage;
              recordJson.dealStatus = item.dealStatus;
              records.push(recordJson);
            })
            let oldData = that.data.list;
            that.setData({
              showMessage: false,
              noMessage: true,
              list: oldData.concat(records),
            })
          }else{
            if (0 == that.data.list.length){
              that.setData({
                showMessage: true,
                noMessage: false,
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
   let type = that.data.type;
    that.setData({
      list: []
    })
    if ('1' === type) {
      that.getComplaintList();
    } else {
      that.getReportList();
    }
    wx.stopPullDownRefresh();
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    const that = this;
    let type = that.data.type;
    if ('1' === type) {
      that.getComplaintList();
    } else {
      that.getReportList();
    }
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})