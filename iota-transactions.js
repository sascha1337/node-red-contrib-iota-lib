const IOTA = require('iota.lib.js');
const TRAN = require('transliteration');

module.exports = function(RED) {
    function iotatransactions(config) {
        RED.nodes.createNode(this,config);
        var node = this;
        node._sec = 2;
	      node._firstroot = '';

	      console.log("Iota Api getTransactions: " + config.iotaNode);

	      const iota = new IOTA({ provider: config.iotaNode });
        node.readyIota = true;

        node.on('input', function(msg) {
            if (this.readyIota) {
              let txt = JSON.stringify(msg.payload);
	            let ascii = TRAN.transliterate(txt)

              console.log("message payload: "+msg.payload)
	            console.log("transliterated: "+ascii)

              console.log("Searching dataset via getTransactionsObjects - please wait")
	            //const iota_addr = config.iotaAddr; //'HELLOWORLDHELLOWORLDHELLOWORLDHELLOWORLDHELLOWORLDHELLOWORLDHELLOWORLDHELLOWORLDD'
	            const iota_hash = config.iotaHash; //'HELLOWORLDHELLOWORLDHELLOWORLDHELLOWORLDHELLOWORLDHELLOWORLDHELLOWORLDHELLOWORLDD'
              //const iota_tag = config.iotaTag; //Tag transaction

              this.readyIota = false;
              var self = this;
              iota.api.getTransactionsObjects([iota_hash], (error, success) => {
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
                self.readyIota = true;
	             });
            }
        });
    }
    RED.nodes.registerType("iotatransactions",iotatransactions);
}
