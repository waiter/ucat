//logs.js
var util = require('../../utils/util.js')
Page({
  data: {
    logs: [],
    ignore: [],
    show: [],
    pp: 'http://t.cn/',
    datas: {
      mgj: [],
      tb: [],
      other: []
    },
    cur: {
      tb: true,
      mgj: true,
      other: true
    },
    word: {
      tb: '淘宝',
      mgj: '蘑菇街',
      other: '其他'
    },
    len: 0
  },
  bindCopy: function (event) {
    wx.setClipboardData({
      data: event.currentTarget.dataset.id,
      success: function() {
        wx.showToast({
          title: '复制成功，请在浏览器中打开',
          duration: 2000
        })
      },
      fail: function (err) {
        console.log(err)
      }
    })
  },
  bindCopyT: function (event) {
    wx.setClipboardData({
      data: event.currentTarget.dataset.id,
      success: function () {
        wx.showToast({
          title: '复制成功，请在淘宝中打开',
          duration: 2000
        })
      },
      fail: function (err) {
        console.log(err)
      }
    })
  },
  bindDel: function (event) {
    var that = this
    const cid = event.currentTarget.dataset.id
    wx.showModal({
      title: '确定吗？',
      content: '确认后将不再展示改商品！',
      success: function (res) {
        if (res.confirm) {

        }
      }
    })
  },
  showPic: function (event) {
    wx.previewImage({
      urls: [event.currentTarget.dataset.show],
      current: event.currentTarget.dataset.show
    })
  },
  checkChange: function (e) {
    const cur = {}
    let len = 0
    e.detail.value.forEach(it => {
      cur[it] = true
      len += this.data.datas[it].length
    })
    this.setData({
      cur,
      len
    })
  },
  getLists: function (needStop) {
    var that = this
    wx.request({
      url: 'https://www.waitergame.top/index.php/config/we.cat.v2',
      success: function (data) {
        const rd = data.data
        if (rd && rd.state == 1 && rd.msg) {
          const cur = {
            tb: true,
            mgj: true,
            other: true
          }
          const show = JSON.parse(rd.msg.show)
          const tb = show.indexOf('tb') > -1 ? JSON.parse(rd.msg.tb) : []
          const mgj = show.indexOf('mgj') > -1 ? JSON.parse(rd.msg.mgj) : []
          const other = show.indexOf('other') > -1 ? JSON.parse(rd.msg.other) : []
          const datas = {
            tb,
            mgj,
            other
          }
          that.setData({
            show,
            datas,
            cur,
            len: tb.length + mgj.length + other.length,
            pp: rd.msg.pp
          })
        }
        needStop && wx.stopPullDownRefresh()
      },
      fail: function (err) {
        console.log(err)
        wx.stopPullDownRefresh()
      }
    })
  },
  onShareAppMessage: function () {
    return {};
  },
  onPullDownRefresh: function () {
    this.getLists(true)
  },
  onLoad: function () {
    var that = this
    const ignore = wx.getStorageSync('ignore');
    if (ignore) {
      this.setData({
        ignore
      })
    }
    this.getLists()
  }
})
