//index.js
//获取应用实例
var catConfig = require("../../data/catConfig");
var fileUtil = require('../../utils/fileUtil')
var app = getApp()
Page({
  data: {
    userInfo: {},
    catConfig,
    count: 0,
    datas: [],
    pp: 'http://t.cn/',
    cur: '',
  },
  //事件处理函数
  bindQuanTap: function() {
    wx.navigateTo({
      url: '../logs/logs'
    })
  },
  bindRankTap: function () {
    // wx.navigateTo({
    //   url: '../rank/rank'
    // })
    wx.showToast({
      title: '敬请期待「逗喵榜」~',
      duration: 2000
    })
  },
  onShareAppMessage: function() {
    return {
      title: '逗逗喵，拿拿内部优惠券领取！'
    };
  },
  playSound: function(sound, needAdd) {
    var that = this
    fileUtil.getPath({
      key: sound,
      success: (res) => {
        wx.playVoice({
          filePath: res.path,
          success: r1 => console.log('打开文档成功'),
          fail: e1 => {
              console.log(e1);
              fileUtil.deleteKey(sound)
            }
        })
        if (needAdd) {
          const count = that.data.count + 1;
          that.setData({
            count
          })
          wx.setStorage({
            key: 'count',
            data: count,
          })
        }
      },
      fail: err => console.log(err)
    })
  },
  bindItemTap: function(event) {
    this.playSound(event.currentTarget.dataset.sound, true)
  },
  getLists: function (needStop) {
    var that = this
    wx.request({
      url: 'https://www.waitergame.top/index.php/config/we.cat',
      success: function (data) {
        const rd = data.data
        if (rd && rd.state == 1 && rd.msg) {
          that.setData({
            datas: JSON.parse(rd.msg.mgj),
            pp: rd.msg.pp
          })
        }
        needStop && wx.stopPullDownRefresh()
      },
      fail: function (err) {
        console.log(err)
        needStop && wx.stopPullDownRefresh()
      }
    })
  },
  showPic: function (event) {
    wx.previewImage({
      urls: [event.currentTarget.dataset.show],
      current: event.currentTarget.dataset.show
    })
  },
  bindCopy: function (event) {
    var that = this
    this.playSound('sound/m_001.silk', false)
    wx.setClipboardData({
      data: event.currentTarget.dataset.id,
      success: function () {
        that.setData({
          cur: event.currentTarget.dataset.id
        })
      },
      fail: function (err) {
        console.log(err)
      }
    })
  },
  onPullDownRefresh: function () {
    this.getLists(true)
  },
  onLoad: function () {
    var that = this
    //调用应用实例的方法获取全局数据
    app.getUserInfo(function(userInfo){
      //更新数据
      that.setData({
        userInfo:userInfo
      })
    })
    const count = wx.getStorageSync('count')
    this.setData({
      count: count || 0
    })
    this.getLists()
    setInterval(this.getLists.bind(this), 3600000)
  }
})
