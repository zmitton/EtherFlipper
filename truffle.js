module.exports = {
  build: {
    "index.html": "index.html",
    "app.js": [
      "javascripts/app.js",
      "javascripts/bigNumber.js"
    ],
    "app.css": [
      "stylesheets/app.css"
    ],
    "images/": "images/"
  },
  networks: {
    "live": { network_id: 1 },
    "ropsten": { network_id: 3 },
  },
  rpc: {
    host: "localhost",
    port: 8545
  }
};
