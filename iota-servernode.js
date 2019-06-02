module.exports = function(RED) {
    function IotaServerNode(n) {
        RED.nodes.createNode(this,n);
        this.host = n.host;
        this.port = n.port;
    }
    RED.nodes.registerType("iota-server",IotaServerNode);
}
