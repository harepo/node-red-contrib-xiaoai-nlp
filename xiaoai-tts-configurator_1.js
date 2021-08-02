module.exports = (RED) => {
  RED.nodes.registerType('xiaoai-tts-configurator_1', class {
    constructor (config) {
      RED.nodes.createNode(this, config)
      Object.assign(this, config)
    }
  },{
    credentials: {
      username: { type:"text" },
      password: { type: "password" }
    }
})
}
