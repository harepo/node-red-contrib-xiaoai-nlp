const login = require('./login')
const device = require('./device')
const { nlpResult } = require('./mibrain')
const { isObject } = require('./utils')

class XiaoAi {
  constructor (user, pwd, sid) {
    if (isObject(user)) {
      const { userId, serviceToken } = user

      if (!userId || !serviceToken) throw new Error('参数不合法')
      this.session = login({ userId, serviceToken })
    } else {
      if (!user || !pwd) throw new Error('参数不合法')
      this.session = login(user, pwd, sid)
    }

    this.liveDevice = []
  }

  connect () {
    return this.session.then(ss => ({
      userId: ss.userId,
      serviceToken: ss.serviceToken
    }))
  }

  async getDevice (name) {
    return this.session.then(ss => device(ss.cookie))
  }

  async checkStatus () {
    const ss = await this.session

    if (this.liveDevice && !this.liveDevice.length) {
      this.liveDevice = await device(ss.cookie)
    }

    if (!this.liveDevice.length) {
      return Promise.resolve(false)
    }
    return Promise.resolve(true)
  }

  async nlpResult (deviceId, limit) {
    const ss = await this.session
    const status = await this.checkStatus(deviceId)
    if (!status) {
      return Promise.resolve('无设备在线')
    }

    const device = this.findDeviceById(deviceId)
    if (!device) {
      this.liveDevice = [] // 清空
      return Promise.resolve('没有找到匹配的设备')
    }

    return await nlpResult({
      cookie: ss.cookie,
      deviceId: deviceId,
      hardware: device.hardware,
      limit
    })
  }

  findDeviceById (deviceId) {
    if (!deviceId) {
      return false
    }
    return this.liveDevice.find(device => device.deviceID === deviceId)
  }
}

module.exports = XiaoAi
