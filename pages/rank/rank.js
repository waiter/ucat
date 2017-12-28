var app = getApp()

Page({
  data: {
    uid: '',
    userInfo: {},
    count: 0,
    selfRank: 'N',
    rank: []
  },
  uploadAndGet: function() {
    var that = this
    var a = 371
    var x = this.data.count
    var c = parseInt(Math.abs(a * Math.sin(x) + parseInt(x/a, 10)), 10)
    wx.request({
      url: `https://www.waitergame.top/index.php/rank/upload/A_6_LM_1000?uuid=${this.data.uid}&name=${this.data.userInfo.nickName}&score=${x}&c=${c}`,
      complete: function() {
        wx.request({
          url: `https://www.waitergame.top/index.php/rank/data/A_6_LM_1000/1?uuid=${that.data.uid}`,
          success: function(d) {
            const rd = d.data
            if (rd && rd.state == 1 && rd.msg) {
              that.setData({
                selfRank: rd.msg.user ? rd.msg.user.rank : 'N',
                rank: rd.msg.data || []
              })
            }
          },
          fail: function(err) {
            console.log(err)
          }
        })
      }
    })
  },
  onLoad: function() {
    var that = this
    const count = wx.getStorageSync('count')
    if (count) {
      this.setData({
        count
      })
    }
    app.getUserInfo(function (userInfo) {
      that.setData({
        userInfo: userInfo
      })
      app.getUid(function (uid) {
        that.setData({
          uid: uid
        })
        that.uploadAndGet()
      })
    })
    
  }
})