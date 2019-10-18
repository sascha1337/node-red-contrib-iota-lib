const MAM = require('@iota/mam');
const IOTA_CONVERTER = require('@iota/converter');

module.exports = function(RED) {
    function mamPublish(config) {
        RED.nodes.createNode(this,config);
        var node = this;
        node.iotaNode = RED.nodes.getNode(config.iotaNode);
      	//const iota = new IOTA({'host': this.iotaNode.host, 'port': this.iotaNode.port});
        //console.log("MAM publish INIT on iota node: " + node.iotaNode.host + ":" + node.iotaNode.port);
        node._state = MAM.init({ provider: node.iotaNode.host, 'port': node.iotaNode.port },config.channelseed,2);
        node._state = MAM.changeMode(node._state, config.mode, config.sidkey);
        node.tag = config.tag;
        node.readyMAM = true;
        node.arrayPackets = [];
        node.mamLink = 'https://mam-explorer.firebaseapp.com/?provider=' + node.iotaNode.host + ':' + node.iotaNode.port + '&mode=' + config.mode + '&root=';

        node.on('input', function(msg) {
            let trytestag = IOTA_CONVERTER.asciiToTrytes(JSON.stringify(node.tag));
            const packet = { time: Date.now(), tag: trytestag, data: msg.payload };
            this.arrayPackets.push(packet);
            //console.log(this.arrayPackets.length);
            console.log(JSON.stringify(this.arrayPackets));

            if (this.readyMAM) {
              let trytes = IOTA_CONVERTER.asciiToTrytes(JSON.stringify(this.arrayPackets));
              let message = MAM.create(this._state, trytes);
              // Update the mam state so we can keep adding messages.
              this._state = message.state;

              console.log("Uploading dataset via MAM Attach.");
              console.log(message.address);
              this.status({fill:"red",shape:"ring",text:"publishing"});
              let resp = MAM.attach(message.payload, message.address,4,14,trytestag);
              this.readyMAM = false;
              this.arrayPackets = [];
              resp.then(function(result) {
                 //console.log(result); //will log results.
                 console.log('Verify with MAM Explorer: '  + node.mamLink + message.address);
                 let link = node.mamLink + message.address;
                 this.readyMAM = true;
                 node.send({payload: {address:message.address, state:message.state, link:link}});
              });
              this.status({});;
            } else {

            }
        });
    }
    RED.nodes.registerType("mamPublish",mamPublish);
}
