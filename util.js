//公共js，以及基本方法封装
let imgArray = [
  'https://wx1.sinaimg.cn/mw690/77d4598fly1ghke5wrzazj20dw0b4411.jpg',
  'https://wx2.sinaimg.cn/mw690/77d4598fly1ghke5tafj0j20dw0b4di9.jpg',
  'https://wx1.sinaimg.cn/mw690/77d4598fly1ghke5pm1c5j20dw0b4q5b.jpg',
  'https://wx1.sinaimg.cn/mw690/77d4598fly1ghke5lu53ej20dw0b4acj.jpg',
  'https://wx1.sinaimg.cn/mw690/77d4598fly1ghke5ho7dkj20dw0b4tb2.jpg',
  'https://wx1.sinaimg.cn/mw690/77d4598fly1geupurwdxcj20d20a8juw.jpg',
  'https://wx3.sinaimg.cn/mw690/77d4598fly1geuqanp5p2j20d20a8why.jpg',
  'https://wx1.sinaimg.cn/mw690/77d4598fly1geuqaj4jitj20d20a8whz.jpg',
  'https://wx3.sinaimg.cn/mw690/77d4598fly1geuqaev4p9j20d20a8gp1.jpg'
]
let maxLen = imgArray.length - 1

module.exports = {
  // 激励视频错误code处理
  videoAdErrCodeHandle: function (err) {
    let content = ''
    console.info(err)
    switch (err.errCode) {
      case 1000: //后端接口调用失败;
        content = "暂无合适的广告可以播放"
        break;
      case 1001: //参数错误;
        content = "暂无合适的广告可以播放"
        break;
      case 1002: //广告单元无效;
        content = "暂无合适的广告可以播放"
        break;
      case 1003: //内部错误;
        content = "暂无合适的广告可以播放"
        break;
      case 1004: //无合适的广告;
        content = "暂无合适的广告可以播放"
        break;
      case 1005: //广告组件审核中;
        content = "暂无合适的广告可以播放"
        break;
      case 1006: //	广告组件被驳回;
        content = "暂无合适的广告可以播放。"
        break;
      case 1007: //	广告组件被封禁;
        content = "暂无合适的广告可以播放"
        break;
      case 1008: //广告单元已关闭;
        content = "暂无合适的广告可以播放"
        break;
      default:
        content = "广告播放失败，可能是因为播放中途退出的缘故。您可以通过进入手机后台任务列表，退出当前小程序，然后重新进入小程序，重新播放。播放结束后，点击屏幕上的关闭按钮即可获得奖励。"
        break;
    }
    wx.showModal({
      title: '提示',
      content: content,
      showCancel: false
    })
  },
  isCacheAvailable(key) {
    try {
      let res = wx.getStorageSync(key); // key 的值为 canUserSetGailv 或 canUserSetOpacity
      return res != '' && (Date.parse(new Date()) - res.time) / 1000 < 60 * 60 * 24 ? true : false // 24小时内有效
    } catch (e) { }
    return false
  },
  //返回数组中一个的随机值
  arrayRand: (arr) => {
    var len = arr.length
    var key = Math.floor(Math.random() * len)
    return arr[key]
  },

  // 绕Y轴旋转随机角度
  randomY: function () {
    var arr = Array.prototype.slice.apply(arguments);
    arr.forEach(function (obj) {
      if (typeof obj == 'object') {
        var rand = Math.floor(Math.random() * (360 - 1 + 1)) + 1
        obj.rotateY((Math.PI / 180) * rand)
      }
    })
  },
  shareAppMessage(title) {
    return {
      title: title == undefined ? '爱喝酒摇骰子小游戏，KTV喝酒摇骰子，大排档喝酒摇骰子，街边骰子游戏，骰盅游戏。' : title,
      imageUrl: imgArray[Math.floor(Math.random() * (maxLen + 1))]
    }
  },
  shareTimeline: (title) => {
    return {
      title: title == undefined ? '爱喝酒摇骰子小游戏，KTV喝酒摇骰子，大排档喝酒摇骰子，街边骰子游戏，骰盅游戏。' : title,
      query: 'pyq',
      imageUrl: imgArray[Math.floor(Math.random() * (maxLen + 1))]
    }
  },

  wxInit: () => {
    // 版本更新管理
    const updateManager = wx.getUpdateManager()
    if (updateManager && updateManager != undefined) {
      updateManager.onUpdateReady(function () {
        updateManager.applyUpdate() // 新的版本已经下载好，调用 applyUpdate 应用新版本并重启
      })
    }
    // 分享按钮
    wx.showShareMenu({
      menus: ['shareAppMessage', 'shareTimeline']
    })

    wx.onShareAppMessage(() => {
      return util.shareAppMessage()
    })

    if (wx.onShareTimeline) {
      wx.onShareTimeline(() => {
        return util.shareAppMessage()
      })
    }

    wx.cloud.init()
  },
}