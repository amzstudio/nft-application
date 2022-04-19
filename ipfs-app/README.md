https://www.youtube.com/watch?v=RMlo9_wfKYU
https://docs.ipfs.io/reference/js/api/#hands-on-examples
https://docs.ipfs.io/how-to/mint-nfts-with-ipfs/#how-minty-works 

```
$ cd ipfs-app
$ node app.js
```
open webpage : http://localhost:3000/


### IPFS CORS
export IPFS_PATH=$HOME/.ipfs
ipfs config --json API.HTTPHeaders.Access-Control-Allow-Origin '["http://yoursite.localhost:8080",
"http://127.0.0.1:8080","http://localhost:3000", "http://127.0.0.1:5001",
"http://127.0.0.1:48084", "https://gateway.ipfs.io", "https://webui.ipfs.io"]'
ipfs config --json API.HTTPHeaders.Access-Control-Allow-Origin '["*"]'
ipfs config --json API.HTTPHeaders.Access-Control-Allow-Methods '["POST", "PUT", "GET", "DELETE"]'

# if you want to make sure "restart" your daemon :
ipfs shutdown
screen -dmS IPFS ipfs daemon
screen -list
ipfs config API.HTTPHeaders.Access-Control-Allow-Origin
ipfs config API.HTTPHeaders.Access-Control-Allow-Methods


