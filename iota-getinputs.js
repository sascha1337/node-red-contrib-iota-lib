const IOTA = require('iota.lib.js');
const TRAN = require('transliteration');

module.exports = function(RED) {
    function iotagetinputs(config) {
        RED.nodes.createNode(this,config);
        var node = this;
        var iota_seed = '';

        node._sec = 2;
	      node._firstroot = '';

	      console.log("Iota Api getinputs: " + config.iotaNode);
	      const iota = new IOTA({ provider: config.iotaNode });
        node.readyIota = true;

        node.on('input', function(msg) {
            if (this.readyIota) {
              let txt = JSON.stringify(msg.payload);
	            let ascii = TRAN.transliterate(txt)

              console.log("message payload: "+msg.payload)
	            console.log("transliterated: "+ascii)

              console.log("Get account dataset via getInputs - please wait")
              if (iota.valid.isTrytes(msg.payload,81)) {
                iota_seed = msg.payload;
              } else {
	              iota_seed = config.iotaSeed; //'HELLOWORLDHELLOWORLDHELLOWORLDHELLOWORLDHELLOWORLDHELLOWORLDHELLOWORLDHELLOWORLDD'
              }
              this.readyIota = false;
              var self = this;
              this.status({fill:"red",shape:"ring",text:"connecting"});
              iota.api.getInputs(iota_seed, (error, success) => {
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
                this.status({});
                self.readyIota = true;
	             });
            }
        });
    }
    RED.nodes.registerType("iotagetinputs",iotagetinputs);
}
