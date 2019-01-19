const IOTA = require('iota.lib.js');
const TRAN = require('transliteration');

module.exports = function(RED) {
    function iotasendtransfer(config) {
        RED.nodes.createNode(this,config);
        var node = this;
        node._sec = 2;
	      node._firstroot = '';

	      console.log("Iota Api sendtransfer: " + config.iotaNode);

	      const iota = new IOTA({ provider: config.iotaNode });
        node.readyIota = true;

        node.on('input', function(msg) {
            if (this.readyIota) {
              let txt = JSON.stringify(msg.payload);
	            let ascii = TRAN.transliterate(txt)
              let trytes = iota.utils.toTrytes(ascii)

              console.log("message payload: "+msg.payload)
	            console.log("transliterated: "+ascii)
              console.log("trytes: "+trytes)

              console.log("Uploading dataset via sendTransfer - please wait...")
	            const iota_addr = config.iotaAddr; //'HELLOWORLDHELLOWORLDHELLOWORLDHELLOWORLDHELLOWORLDHELLOWORLDHELLOWORLDHELLOWORLDD'
	            const iota_seed = config.iotaSeed; //'HELLOWORLDHELLOWORLDHELLOWORLDHELLOWORLDHELLOWORLDHELLOWORLDHELLOWORLDHELLOWORLDD'
              const iota_tag = config.iotaTag; //Tag transaction
              //const iota_value = config.iotaValue; //Value to transfer
              const iota_value = iota.utils.convertUnits(config.iotaValue, "Ki", "i");
              console.log("sending founds Ki:"+iota_value)
              const transfers = [
		              {
    			             value: iota_value,
    			             address: iota_addr,
    			             message: trytes,
                       tag: iota_tag
  		            }
	            ]
              this.readyIota = false;
              var self = this;
              iota.api.sendTransfer(iota_seed, 14, 14, transfers, (error, success) => {
                console.log("Report from iota node:")
  		            if (error) {
    	 	             console.log(error);
                     node.send(error[0]);
  		               } else {
    		                 console.log(success);
                         node.send(success[0]);
  		                   }
                self.readyIota = true;
	             });
            }
        });
    }
    RED.nodes.registerType("iotasendtransfer",iotasendtransfer);
}
