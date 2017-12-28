//app.js
var fileUtil = require('./utils/fileUtil.js')
App({
  onLaunch: function () {
    fileUtil.init()
  },
  getUserInfo:function(cb){
    var that = this
    if(this.globalData.userInfo){
      typeof cb == "function" && cb(this.globalData.userInfo)
    }else{
      //调用登录接口
      wx.login({
        success: function () {
          wx.getUserInfo({
            success: function (res) {
              that.globalData.userInfo = res.userInfo || {}
              typeof cb == "function" && cb(that.globalData.userInfo)
            }
          })
        }
      })
    }
  },
  getUid: function(cb) {
    var that = this
    if (this.globalData.uid) {
      typeof cb == "function" && cb(this.globalData.uid)
    } else {
      var uid = wx.getStorageSync('uid')
      if (!uid) {
        uid = `${new Date().getTime()}_${parseInt(Math.random() * 999999, 10)}`
        wx.setStorageSync('uid', uid)
      }
      that.globalData.uid = uid
      typeof cb == "function" && cb(uid)
    }
  },
  globalData:{
    userInfo:null,
    uid: null,
  }
})