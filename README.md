# Node-Red IOTA library module ( in progress )

## Requirements

Install node-red globally and install ui packages

```
sudo npm install -g --unsafe-perm node-red
```

in your ~/.node-red installation directory type:
```
npm install node-red-dashboard
```

# IOTA-lib module installation

Run the following command in your NODE-RED install
```
npm install node-red-contrib-iota-lib // not yet published to npm
```

# Usage

There is one function node available

**tx0 publish** (=upload data to tangle)

Drag tx0 function node into a flow and wire it accordingly


## tx0 publish

Deploy some node input data source.

wire its output to
-> tx0Publish node

and wire this node's output to an
-> (optional) output for logging

The tx0 publish gets input data from sensorTag, uploads this data and upon
tx confirmation is ready to take new data from the input.


