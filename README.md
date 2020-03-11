
### Getting Started
This plugin requires node `>= 6.0.0` and npm `>= 1.4.15` (latest stable is recommended).


### NPM Module Installation

```shell
> npm install boodskap-commonds --save
```

#### How it works?

```shell
var Boodskap = require('boodskap-commons');

var config = {
    "apiUrl": "",
    "mqtt": {
        "hostName": '',
        "portNo": 443,
        "ssl": true
    }

}

# new Boodskap(config, authResponse);
# if you have already logged in pass the response json to the boodskap module

```


