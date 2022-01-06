// component/showDlog/showDlog.js
Component({
  properties: {
    type: {
        type: Number,
        default: 1,
    },
    showDlog: {
        type: Boolean,
        default: false,
    },
    parkTimeA:{
      type:String,
      default:''
    },
    parkFee:{
      type:Number,
      default:''
    },
    numTg:{
      type:Number,
      default:0
    }
    
},

  data: {
    url1:'https://z3.ax1x.com/2021/06/05/2tgIJ0.png',
    url2:'https://z3.ax1x.com/2021/06/05/2tgbyF.png',
    url3:'https://z3.ax1x.com/2021/06/05/2tgjoR.png',
    url4:'https://z3.ax1x.com/2021/06/05/2t29SK.png'
  },
  methods:{
    closeShowDlog() {
      this.setData({
        showDlog:false
      })
    },
    childMethod() {
      this.triggerEvent('fatherMethod');
    
    },
    getNum() {
      console.log(this.showDlog,'+++++')
    },
    onLoad: function (options) {
      console.log(this.showDlog,'+++++')
    },
  }



})