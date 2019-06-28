const { asciiToTrytes, trytesToAscii, trits, trytes, value, fromValue } = require('@iota/converter');
const { isTrytes } = require('@iota/validators');

module.exports = function(RED) {
    function iotaConverter(config) {
        RED.nodes.createNode(this,config);
        var node = this;
        node.fromconverter = config.fromconverter;
        node.toconverter = config.toconverter;
        node.packet = config.mesage;
        node.result = "";

        node.on('input', function(msg) {
            //const node.formconverter = config.fromconverter;
            //const toconverter = config.toconverter;
            //var packet = msg.payload;
            node.packet = msg.payload;
            switch (node.fromconverter) {
                  case 'string':
                    console.log('string: ' + node.packet);
                    switch (node.toconverter) {
                      case 'trytes':
                        node.result = asciiToTrytes(node.packet);
                        console.log({payload_trytes:node.result});
                        break;
                      case 'trits':
                        node.toint8array = node.packet.split(',').map(Number);
                        node.result = trits(node.toint8array);
                        console.log({payload_trits:node.result});
                        break;
                      case 'string':
                        node.result = node.packet;
                        console.log({payload_string:node.result});
                        break;
                    }
                  break;
                  case 'trytes':
                    console.log('trytes: ' + node.packet + " isTrytes: " + isTrytes(node.packet));
                    switch (node.toconverter) {
                      case 'trytes':
                        console.log({payload_trytes:node.packet});
                        node.result = node.packet;
                        });
                        break;
                      case 'trits':
                        node.result = trits(node.packet);
                        console.log({payload_trits:node.result});
                        break;
                      case 'string':
                        node.result = trytesToAscii((node.packet));
                        console.log({payload_string:node.result});
                        break;
                    }
                  break;
                  case 'trits':
                     node.toint8array = node.packet.split(',').map(Number);
                     console.log('trits: ' + node.toint8array);
                     switch (node.toconverter) {
                         case 'trytes':
                                 node.result = trytes(node.toint8array);
                                 console.log({payload_trytes:node.result});
                                 break;
                         case 'trits':
                                 console.log({payload_trits:node.toint8array});
                                 node.result = node.toint8array;
                                 break;
                         case 'string':
                                 node.result = trytesToAscii(trytes(node.toint8array));
                                 console.log({payload_string:node.result});
                                 break;
                     }
                   break;
                   default:
                      console.log('Lo lamentamos, por el momento no disponemos de ' + node.fromconverter + '.');
                }
              node.send({payload: node.result});
        });
    }
    RED.nodes.registerType("iotaConverter",iotaConverter);
}
