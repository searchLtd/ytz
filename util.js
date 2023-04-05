//公共js，以及基本方法封装
let imgArray = [
  'https://wx1.sinaimg.cn/mw690/77d4598fly1ghke5wrzazj20dw0b4411.jpg',
  'https://wx2.sinaimg.cn/mw690/77d4598fly1ghke5tafj0j20dw0b4di9.jpg',
  'https://wx1.sinaimg.cn/mw690/77d4598fly1ghke5pm1c5j20dw0b4q5b.jpg',
  'https://wx1.sinaimg.cn/mw690/77d4598fly1ghke5lu53ej20dw0b4acj.jpg',
  'https://wx1.sinaimg.cn/mw690/77d4598fly1ghke5ho7dkj20dw0b4tb2.jpg'
]
let maxImgLen = imgArray.length - 1

let titleArray = [
  '六个一，要不要？',
  '加一个，六个六，到你！',
  '加两个，十个五，给你！',
  '摇骰子五个一斋，到你',
  '摇骰子三个一四个斋五个起，来不来？',
  '4个1、5个斋、6个起',
  '摇到六个一算你厉害！',
  '摇到叠骰算你厉害！',
  '看你能不能摇到叠骰？',
  '看你能不能摇到六个一？',
]
let maxTitleLen = titleArray.length - 1

const self = {
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
    } catch (e) {}
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
  shareAppMessage(imageUrl = false, promise = false) {
    return {
      title: titleArray[Math.floor(Math.random() * (maxTitleLen + 1))],
      imageUrl: imageUrl ? imageUrl : imgArray[Math.floor(Math.random() * (maxImgLen + 1))],
      promise
    }
  },
  shareTimeline: () => {
    return {
      title: titleArray[Math.floor(Math.random() * (maxTitleLen + 1))],
      imageUrl: imgArray[Math.floor(Math.random() * (maxImgLen + 1))],
      query: 'pyq',
    }
  },
  isInArray(arr, obj) {
    var i = arr.length;
    while (i--) {
      if (arr[i] === obj) {
        return true;
      }
    }
    return false;
  },

  wxInit: () => {
    // 分享按钮
    wx.showShareMenu({
      menus: ['shareAppMessage', 'shareTimeline']
    })

    // wx.onShareAppMessage(() => {
    //   return self.shareAppMessage()
    // })

    if (wx.onShareTimeline) {
      wx.onShareTimeline(() => {
        return self.shareAppMessage()
      })
    }

  },

  background: (gl) => {
    var verts = [
      1, -1, 0,
      -1, -1, 0,
      1, 1, 0,
      -1, 1, 0
    ];

    var width = window.innerWidth;
    var height = window.innerHeight;

    gl.viewport(0, 0, width, height);
    var vrt_shader = gl.createShader(gl.VERTEX_SHADER);
    var vertex = `attribute vec4 coords; void main() { gl_Position = coords; gl_PointSize = 10.0; }`
    var fragment = `precision mediump float; uniform float time; uniform vec2 resolution; void main() { vec2 uv = gl_FragCoord.xy / resolution.xy; gl_FragColor = vec4(uv,0.5+0.5*sin(time),1.0);}`

    gl.shaderSource(vrt_shader, vertex);
    gl.compileShader(vrt_shader);

    var fra_shader = gl.createShader(gl.FRAGMENT_SHADER);
    gl.shaderSource(fra_shader, fragment);
    gl.compileShader(fra_shader);

    var shaderProgram = gl.createProgram();
    gl.attachShader(shaderProgram, vrt_shader);
    gl.attachShader(shaderProgram, fra_shader);

    gl.linkProgram(shaderProgram);
    gl.useProgram(shaderProgram);

    var buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(verts), gl.STATIC_DRAW);

    var coords = gl.getAttribLocation(shaderProgram, 'coords');
    gl.vertexAttribPointer(coords, 3, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(coords);

    var resolution = gl.getUniformLocation(shaderProgram, 'resolution');
    gl.uniform2f(resolution, width, height);
    var time = gl.getUniformLocation(shaderProgram, 'time');
    return time
  },

}

module.exports = self