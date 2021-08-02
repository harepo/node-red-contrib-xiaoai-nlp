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

  async checkStatus (deviceId) {
    const ss = await this.session

    if (deviceId) {
      return Promise.resolve(true)
    } else {
      if (this.liveDevice && !this.liveDevice.length) {
        this.liveDevice = await device(ss.cookie)
      }

      if (!this.liveDevice.length) {
        return Promise.resolve(false)
      }
      return Promise.resolve(true)
    }
  }

  async exec (deviceId, method) {
    const ss = await this.session
    const status = await this.checkStatus(deviceId)
    if (!status) {
      return Promise.resolve('无设备在线')
    }

    deviceId = this.valDeviceId(deviceId)

    return method({
      cookie: ss.cookie,
      deviceId: deviceId
    })
  }

  async nlpResult (deviceId) {
    return await this.exec(deviceId, nlpResult)
  }

  valDeviceId (deviceId) {
    if (deviceId) {
      return deviceId
    }
    return this.liveDevice[0].deviceID
  }
}

module.exports = XiaoAi
