const querystring = require('querystring')
const request = require('./request')
const { appendParam, randomString } = require('./utils')
const { API } = require('./const')

function mibrain (operation, method, { cookie, deviceId }) {
  const param = {
    deviceId: deviceId,
    message: JSON.stringify(operation),
    method: method,
    path: 'mibrain',
    requestId: 'app_ios_' + randomString(30)
  }
  const url = appendParam(API.USBS, querystring.stringify(param))

  return request({
    url,
    method: 'POST',
    headers: {
      Cookie: cookie
    }
  })
}

function mibrain2 (operation, { cookie, deviceId }) {
  const param = {
    ...operation,
    requestId: 'app_ios_' + randomString(30),
    timestamp: Date.now()
  }
  const url = appendParam(API.USERPROFILE_V2, querystring.stringify(param))
  const Cookie = cookie + `;deviceId=${deviceId}`

  return request({
    url,
    method: 'GET',
    headers: {
      Cookie: Cookie
    }
  })
}

function nlpResult ({ cookie, deviceId, limit = 10, hardware }) {
  // https://userprofile.mina.mi.com/device_profile/conversation?limit=10&requestId=app_ios_0j8KzdD0HQsHRAehXcqqPeF3nL3AHq
  // https://userprofile.mina.mi.com/device_profile/v2/conversation?source=dialogu&hardware=LX06&timestamp=1647775964958&limit=10
  return mibrain2({
    source: 'dialogu',
    hardware,
    limit
  }, { cookie, deviceId })
}

module.exports = { nlpResult: nlpResult }
