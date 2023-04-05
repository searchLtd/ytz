import util from '../../js/libs/util';
var offCanvas, offCtx, glImg, imageUrl = false;

const self = {
  getShareInfo(gl, game, databus, onlyPromise = false) {
    wx.showLoading({
      title: '处理中'
    })
    if (!offCanvas) {
      offCanvas = wx.createCanvas({
        type: '2d',
        antialias: true
      })
      offCanvas.width = 600
      offCanvas.height = 480
      offCtx = offCanvas.getContext('2d')
    }

    game.show()
    glImg = wx.createImage() // 图片对象
    glImg.src = gl.canvas.toDataURL()

    const promise = new Promise((resolve) => {
      glImg.onerror = err => {
        wx.hideLoading()
        console.log('err', err)
        resolve(util.shareAppMessage())
      }
      glImg.onload = () => {
        wx.hideLoading()
        imageUrl = self.imgLoaded(glImg, game, databus)
        resolve(util.shareAppMessage(imageUrl))
      }
    })

    return onlyPromise ? promise : util.shareAppMessage(false, promise)
  },
  imgLoaded: (img, game, databus) => {
    try {
      // 画背景
      offCtx.clearRect(0, 0, offCanvas.width, offCanvas.height);
      offCtx.fillStyle = databus.status.curBackground == 0 ? '#e59933' : '#008080';
      offCtx.fillRect(0, 0, offCanvas.width, offCanvas.width);
      let angle = Math.abs(game.angle())
      // 画webgl内容
      let cut_top = 0.1
      if (angle < 0.1) {
        cut_top = 0.24
      } else if (angle < 0.2) {
        cut_top = 0.2
      } else if (angle < 0.3) {
        cut_top = 0.16
      } else if (angle < 0.4) {
        cut_top = 0.14
      } else if (angle < 0.5) {
        cut_top = 0.12
      } else if (angle < 0.6) {
        cut_top = 0.11
      } else if (angle >= 0.6) {
        cut_top = 0.1
      }

      let sy = Math.ceil(canvas.height * cut_top)
      let sheight = canvas.height - sy - Math.ceil(canvas.height * 0.2)
      let ch = 480 // 要使用的图像的高度。（伸展或缩小图像）
      let cw = canvas.width * ch / sheight // 要使用的图像的宽度。（伸展或缩小图像）
      let x = (600 - cw) / 2 // 在画布上放置图像的 x 坐标位置
      let y = 0 // 在画布上放置图像的 y 坐标位置

      offCtx.drawImage(img, 0, sy, canvas.width, sheight, x, y, cw, ch)
      let tempFilePath = offCanvas.toTempFilePathSync({
        x: 0,
        y: 0,
        width: 600,
        height: 480,
      })
      wx.hideLoading()
      return tempFilePath
      // let dataURL = offCtx.canvas.toDataURL().replace('data:image/png;base64,', '')
      // let filePath = `${wx.env.USER_DATA_PATH}/${new Date().getTime()}.png`
      // wx.getFileSystemManager().writeFileSync(filePath, dataURL, 'base64')
      // return filePath;
    } catch (e) {
      console.info(e)
      return false
    }
  },
}

module.exports = self