
const fileUtil = {
  _paths: {},
  init: function() {
    fileUtil._paths = wx.getStorageSync('files') || {}
  },
  getPath: function(obj) {
    if (obj.key && obj.success) {
      if (fileUtil._paths[obj.key]) {
        obj.success({
          path: fileUtil._paths[obj.key]
        })
      } else {
        wx.downloadFile({
          url: `https://www.waitergame.top/static/${obj.key}`,
          success: function (res) {
            console.log(res)
            wx.saveFile({
              tempFilePath: res.tempFilePath,
              success: function(res1) {
                fileUtil._paths[obj.key] = res1.savedFilePath
                wx.setStorageSync('files', fileUtil._paths)
                obj.success({ path: res1.savedFilePath })
              },
              fail: function(err1) {
                obj.fail || obj.fail(err)
              }
            })
          },
          fail: function (err) {
            obj.fail || obj.fail(err)
          }
        })
      }
    } else {
      obj.fail || obj.fail({ errMsg: '必须传key和success' })
    }
  },
  deleteKey: function(key) {
    delete fileUtil._paths[key]
    wx.setStorageSync('files', fileUtil._paths)
  },
}

module.exports = fileUtil