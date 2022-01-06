// pages/selectBuilding/selectBuilding.js
const util = require('../../utils/util.js')
const dataUrl = util.dataUrl
const header = util.header
Page({

  /**
   * 页面的初始数据
   */
  data: {
    searchBuildingName:"",
    type:"",
    id:"",
    list:[]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const that = this;
    if ('1' == options.type){
      that.setData({
        type: "1"
      })
      that.getBuilding(options.deviceGroupId);
    } else if ('2' == options.type){
      that.setData({
        id:options.id,
        type: "2"
      })
      that.getUnit(options.id)
    }else{
        that.setData({
          id: options.unitId,
          type: "3"
        })
        that.getRoom(options.unitId)
    }
    
  },

  
 //输入楼栋名称
  inputBind(e){
    console.log(e.detail.value);
    const that = this;
    let value = e.detail.value;
    that.setData({
      searchBuildingName: value,
    })
  },

  //搜索楼栋
  search(){
   const that = this;
    let names = that.data.searchBuildingName;
    if ("" != names){
     
    }else{
      wx.showToast({
        title: "请在搜索框里输入楼栋名称",
        icon: 'none',
        duration: 2000,
      })
    }
  },

  //选择楼栋
  selectBuilding(e){
   const that = this;
    console.log(e.currentTarget.dataset.info)
    let pages = getCurrentPages();   //当前页面
    let prevPage = pages[pages.length - 2];   //上一页面
    if("1" == that.data.type){
      prevPage.setData({
        //直接给上一个页面赋值
        isBuilding: true,
        ["form.buildingName"]: e.currentTarget.dataset.info.deviceGroupName,
        ["form.unitName"]: "请选择单元",
        ["form.roomName"]: "请选择房号",
        buildingId: e.currentTarget.dataset.info.deviceGroupId,
        isUnit: false,
        isRoom: false,
        unitId: "",
        ["form.houseId"]:"",
      });
    } else if ("2" == that.data.type){
      prevPage.setData({
        //直接给上一个页面赋值
        isUnit: true,
        ["form.unitName"]: e.currentTarget.dataset.info.deviceGroupName,
        ["form.roomName"]: "请选择房号",
        unitId: e.currentTarget.dataset.info.deviceGroupId,
        isRoom:false,
        ["form.houseId"]:"",
      });
    }else{
      prevPage.setData({
        //直接给上一个页面赋值
        isRoom: true,
        ["form.roomName"]: e.currentTarget.dataset.info.deviceGroupName,
        ["form.houseId"]: e.currentTarget.dataset.info.deviceGroupId
      });
    }
    
    wx.navigateBack({
      //返回
      delta: 1
    })
  },

  //获取楼栋列表信息
  getBuilding(deviceGroupId){
    const that = this;
    let token = wx.getStorageSync('token');
    wx.showLoading({
      title: '加载中',
    })
    wx.request({
      url: dataUrl + "house/manage/buildingsLikeList",
      method: "POST",
      data: {
        deviceGroupName: "", 
        deviceGroupId:deviceGroupId 
      },
      header:header(token),
      success(res) {
        wx.hideLoading();
        console.log(res)
        if (200 == res.data.code && "SUCCESS" == res.data.msg) {
          if (0 < res.data.data.length){
              that.setData({
                list: res.data.data
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

  //获取单元列表信息
  getUnit(id){
    const that = this;
    let token = wx.getStorageSync('token');
    let appId = wx.getStorageSync('appId');
    wx.showLoading({
      title: '加载中',
    })
    wx.request({
      url: dataUrl + "house/manage/units",
      method: "POST",
      data: {
         id:id
      },
      header:header(token),
      success(res) {
        wx.hideLoading();
        console.log(res)
        if (200 == res.data.code && "SUCCESS" == res.data.msg) {
          if (0 < res.data.data.length) {
            that.setData({
              list: res.data.data
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

  //获取房屋列表信息
  getRoom(id){
    const that = this;
    let token = wx.getStorageSync('token');
    let appId = wx.getStorageSync('appId');
    wx.showLoading({
      title: '加载中',
    })
    wx.request({
      url: dataUrl + "house/manage/houses",
      method: "POST",
      data: {
        id: id
      },
      header:header(token),
      success(res) {
        wx.hideLoading();
        console.log(res)
        if (200 == res.data.code && "SUCCESS" == res.data.msg) {
          if (0 < res.data.data.length) {
            that.setData({
              list: res.data.data
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