const IOTA = require('iota.lib.js');
const { isTags } = require('@iota/validators');
const TRAN = require('transliteration');

module.exports = function(RED) {
    function iotasearch(config) {
        RED.nodes.createNode(this,config);
        var node = this;
        node._sec = 2;
	      node._firstroot = '';
        var iota_value = '';
        this.iotaNode = RED.nodes.getNode(config.iotaNode);

        const iota = new IOTA({'host': this.iotaNode.host, 'port': this.iotaNode.port});
        node.readyIota = true;

        node.on('input', function(msg) {
            if (this.readyIota) {
              //let txt = JSON.stringify(msg.payload);
	            //let ascii = TRAN.transliterate(txt)
              //console.log("message payload: "+msg.payload)
	            //console.log("transliterated: "+ascii)
              console.log("Searching dataset via findTransactionObjects - please wait")

              this.readyIota = false;
              var self = this;
              this.status({fill:"red",shape:"ring",text:"connecting"});

              iota_value = config.iotaValue;
              if (iota.utils.isBundle(msg.payload)) {
                iota_value = msg.payload;
                console.log("searching bundle... : "+iota_value);
              } else {
                    if (iota.valid.isAddress(msg.payload)) {
                      iota_value = msg.payload;
                      console.log("searching address: "+iota_value);
                    } else {
                          if (isTags(msg.payload)) {
                            iota_value = msg.payload;
                            console.log("searching tag: "+iota_value);
                          }
                    }
              }

              var objeto;
              switch (config.iotaSelect){
                case 'addresses':
                        objeto = {addresses:[iota_value]};
                        break;
                case 'bundles':
                        objeto = {bundles:[iota_value]};
                        break;
                case 'tags':
                        objeto = {tags:[iota_value]};
                        break;
                case 'approvees':
                        objeto = {approvees:[iota_value]};
                        break;
                }

                console.log(objeto);
                iota.api.findTransactionObjects(objeto, (error, success) => {
                  console.log("Report from iota node:")
                  if (error) {
                     console.log(error);
                     msg.payload=error;
                     self.send(msg);
                  } else {
                     console.log(success);
                     msg.payload=success;
                     self.send(msg);
                  }
                  });

            }
        });
    }
    RED.nodes.registerType("iotasearch",iotasearch);
}
