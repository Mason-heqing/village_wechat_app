const util = require('../../utils/util.js')
const requestId = util.requestId
const timeStamp = Date.parse(new Date())
const dataUrl = util.dataUrl
var app =  getApp();
Page({
  data: {
      background: ['demo-text-1', 'demo-text-2'],
      indicatorDots: true,
      vertical: false,
      autoplay: false,
      interval: 2000,
      duration: 500,
      tabNumberC:true,
      tabNumberA:false,
      tabNumberB:false,
      orderId:'',   //临时车订单号
      parkFee:'',   //停车费用（分）
      parTime:'', //停车时长
      hsNam:'',
      token:'',
      showTit:false,
      dalogBox:false,
      vehicleNumber:'',
      numTg:'',
      showDlogA:false,
      bgImgUrl:app.globalData.bgImgUrl,
      carNumberList:[],
    // 省份简写
    provinces: [
      ['京', '沪', '粤', '津', '冀', '晋', '蒙', '辽', '吉', '黑'],
      ['苏', '浙', '皖', '闽', '赣', '鲁', '豫', '鄂', '湘'],
      ['桂', '琼', '渝', '川', '贵', '云', '藏',],
      ['陕', '甘', '青', '宁', '新'],
  
    ],
    // 车牌输入
    numbers: [
      ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"],
      ["A", "B", "C", "D", "E", "F", "G", "H", "J", "K"],
      ["L", "M", "N", "P", "Q", "R", "S", "T", "U", "V"],
      ["W", "X", "Y", "Z", "港", "澳", "学"]
    ],
    carnum: [],
    showNewPower: false,
    KeyboardState: false
  },
  // 选中点击设置
  bindChoose(e) {
    console.log(e,'eeeee')
    if (!this.data.carnum[6] || this.data.showNewPower) {
      var arr = [];
      arr[0] = e.target.dataset.val;
      this.data.carnum = this.data.carnum.concat(arr)
      this.setData({
        carnum: this.data.carnum
      })
    }
  },
  bindDelChoose() {
    if (this.data.carnum.length != 0) {
      this.data.carnum.splice(this.data.carnum.length - 1, 1);
      this.setData({
        carnum: this.data.carnum
      })
    }
  },
  showPowerBtn() {
    this.setData({
      showNewPower: true,
      KeyboardState: true
    })
  },
  closeKeyboard() {
    this.setData({
      KeyboardState: false
    })
  },
  openKeyboard() {
    console.log(2222)
    this.setData({
      KeyboardState: true
    })
  },
  // 弹窗
  cancel() {
    this.setData({
      dalogBox:false
    })
  },
  // 临时卡充值
  fatherMethod() {
    console.log('我是子组件 我要调用父亲的方法')
    this.confirm();
  },
  confirm() {
    this.setData({
      dalogBox:false
    })
    wx.navigateTo({
      url:`../../pages/rechargeMsg/rechargeMsg?type=2&orderId=${this.data.orderId}&money=${this.data.parkFee}&tg=0`
    })
  },
  // 获取会员卡
  getClubList(tagMsg) {
    let _that = this
    let clubMsg = {
      appId:wx.getStorageSync('appId'),
      type:tagMsg
    }
    wx.request({
      url: dataUrl + 'park/mobile/user/car/list',
      method: "POST",
      header: {
        'content-type': 'application/json', // 默认值
        "token": _that.data.token,
        "type": 2,
        "requestId": requestId(),
        "timestamp": timeStamp,
        "market": 'Applet',
        "version": 'none'
      },
      data: {...clubMsg},
      success(res) {
        if(res.data.code == 200) {
          _that.setData({
            carNumberList:res.data.data,
          })
        }
        console.log(res,'会员卡&车牌号')

      }
    })
  },
  // 秒转换成时分秒
  getDuration (time) {
    let second = Math.floor(time % 60); // 秒
    let minute = Math.floor(time % 3600 / 60); // 分
    let hour = Math.floor(time / 3600); // 时
    let str = '';
    if (hour > 0) {
        str = hour + '时';
    }
    if (minute > 0) {
        str = str + minute + '分';
    }
    if (second > 0) {
        str = str + second + '秒';
    }
    return str;
},

  

  // 月卡充值
  recharging(e) {
    console.log(e,'6666')
    let item = e.target.dataset.item
    wx.navigateTo({
      url:`../../pages/renewMoney/renewMoney?type=1&id=${item.id}&cardName=${item.cardTypeName}&expireTime=${item.expireTime}&parkName=${item.parkName}&plateNo=${item.plateNo}&balance=${item.balance}`
    })
  },
  // 储值卡充值
  valueCard(e) {
    console.log(e.target)
    let item = e.target.dataset.item
    wx.navigateTo({
      url:`../../pages/renewMoney/renewMoney?type=2&cardName=${item.cardTypeName}&balance=${item.balance}&parkName=${item.parkName}&plateNo=${item.plateNo}&id=${item.id}`
    })
  },
  // 添加会员卡
  addMemberCrad() {
    wx.navigateTo({
      url:`../../pages/memberCrad/memberCrad?tag=3`
    })
  },
  // 查询车牌
  inquire() {
    this.setData({
      KeyboardState:false,
    })
    let arr = '';
    if(this.data.vehicleNumber == '') {
        arr = this.data.carnum.join('')
    }else {
        arr = this.data.vehicleNumber
    }
    if(arr == '') {
      wx.showToast({
        title:'请输入完整的车牌号',
        icon: "none",
        duration: 1500
      })
    }else {
      let _that = this
        wx.request({
          url: dataUrl + 'park/park/fee/query',
          method: "POST",
          header: {
            'content-type': 'application/json', // 默认值
            "token": _that.data.token,
            "type": 2,
            "requestId": requestId(),
            "timestamp": timeStamp,
            "market": 'Applet',
            "version": 'none'
          },
          data: {
            appId:wx.getStorageSync('appId'),
            plateNo:arr
          },
          success(res) {
            console.log(res,'提示')
            if(res.data.code == 200 && res.data.data.parkFee > 0) {
              let numberM = res.data.data.parkTime 
              let numTime = _that.getDuration(numberM) 
              let parMoney = res.data.data.parkFee / 100
    
              _that.setData({
                    dalogBox:true,
                    orderId:res.data.data.orderId,
                    parkFee:parMoney,
                    parTime:numTime,
                    numTg:3,
                    showDlogA:true
              })
              console.log(_that.data.parkTimeA,'numTime')
            }else if(res.data.code != 200) {
                _that.setData({
                    numTg:0,
                    showDlogA:true
                })
              } else if( res.data.code == 200 && res.data.data.status == 204 && res.data.data.parkFee == 0) {
                _that.setData({
                    numTg:1,
                    showDlogA:true
                })
                  
              }else if( res.data.code == 200 && res.data.data.status == 200 && res.data.data.parkFee == 0) {
                  _that.setData({
                    numTg:2,
                    showDlogA:true
                  })
              
              }
          }
        })
    }
  
  },
  // 切换选择车牌
  switChover() {
    this.getClubList(2)
    this.setData({
      tabNumberC:false,
      tabNumberA:true
    })
    if(this.data.carNumberList == null) {
      this.setData({
        showTit:true
      })
    }
    
    console.log(999)
  },

  // 选择车牌
  openIndex(e) {
    console.log(222)
    if(e.target.dataset.item.plateNo) {
      this.setData({
        vehicleNumber:e.target.dataset.item.plateNo,
        tabNumberA:false,
        tabNumberB:true
      
      })
    }
  },
  // 隐藏车牌弹窗
  concealView() {
    console.log(1111)
    this.setData({
      tabNumberB:false,
      tabNumberA:false,
      tabNumberC:true,
      carnum:[],
      vehicleNumber:''
    })
  },
  // 卡包中心
  cardList() {
    console.log(88888)
    wx.navigateTo({
      url:`../../pages/cardBag/cardBag`
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      hsNam:app.globalData.housingNam,
      token:wx.getStorageSync('token')
    })
    this.getClubList(1);

    console.log(wx.getStorageSync('token'),'token')
    
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
    this.onLoad();
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