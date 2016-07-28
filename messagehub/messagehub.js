module.exports = function(RED){
  /**
   * Write to Message Hub
   * Parameters:
   * - servers (example: servers="192.168.33.10:3000,192.168.33.11:3000")
   * - namespace
   * - set
   */
  function sendMessageToMessageHub(config){
    RED.nodes.createNode(this,config);
    var node = this;
    var mshub = require('message-hub-rest');
    var mhConfig= {messagehub:[]};
    var topic = config.topic;
    var bmx_conf = JSON.parse(node.credentials.bluemix_credentials);
    mhConfig.messagehub.push(bmx_conf);
    var instance = new mshub(mhConfig);
    try {
      this.on('input', function(msg){
        instance.produce(topic,{paylaod:msg.payload})
        .then(function(res){
          node.log(JSON.stringify(res));
        })
        .fail(function(e){
          node.error(e);
        });
      });
    } catch(e) {
      node.error(e);
    }
  };
  RED.nodes.registerType("messagehub",sendMessageToMessageHub,{
    credentials:{
      bluemix_credentials:{type:"text"}
    }
  });
};
