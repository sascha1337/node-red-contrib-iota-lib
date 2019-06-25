const MAM = require('@iota/mam');
const IOTA_CONVERTER = require('@iota/converter');

module.exports = function(RED) {
    function mamPublish(config) {
        RED.nodes.createNode(this,config);
        var node = this;
        node.iotaNode = RED.nodes.getNode(config.iotaNode);
      	//const iota = new IOTA({'host': this.iotaNode.host, 'port': this.iotaNode.port});
        console.log("MAM publish INIT on iota node: " + node.iotaNode.host + ":" + node.iotaNode.port);
        node._state = MAM.init({ provider: node.iotaNode.host, 'port': node.iotaNode.port });
        node._state = MAM.changeMode(node._state, config.mode, config.sidkey);
        node.tag = config.tag;
        node.readyMAM = true;
        node.arrayPackets = [];
        node.mamLink = 'https://mam-explorer.firebaseapp.com/?provider=' + node.iotaNode.host + ':' + node.iotaNode.port + '&mode=' + config.mode + '&root=';

        node.on('input', function(msg) {
            const packet = { time: Date.now(), tag: node.tag, data: msg.payload };
            this.arrayPackets.push(packet);
            console.log(this.arrayPackets.length);
            console.log(JSON.stringify(this.arrayPackets));

            if (this.readyMAM) {
              let trytes = IOTA_CONVERTER.asciiToTrytes(JSON.stringify(this.arrayPackets));
              let trytestag = IOTA_CONVERTER.asciiToTrytes(JSON.stringify(node.tag));
              let message = MAM.create(this._state, trytes);
              // Update the mam state so we can keep adding messages.
              this._state = message.state;

              console.log("Uploading dataset via MAM - please wait");
              console.log(message.address);
              node.status({fill:"red",shape:"ring",text:"publishing"});
              let resp = MAM.attach(message.payload, message.address,4,14,trytestag);
              this.readyMAM = false;
              node.status({});
              this.arrayPackets = [];
              resp.then(function(result) {
                 console.log(result); //will log results.
                 console.log('Verify with MAM Explorer: '  + node.mamLink + message.address);
                 node.readyMAM = true;
                 node.send({payload: message.address, channel:message.state});
              });
            } else {

            }
        });
    }
    RED.nodes.registerType("mamPublish",mamPublish);
}
