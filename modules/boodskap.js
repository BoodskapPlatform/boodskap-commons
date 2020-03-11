var request = require('request');
var moment = require('moment');
var async = require('async');
var _ = require('underscore');

var Utils = require("./utils")

var Boodskap = function (conf, obj) {
    this.API_URL = conf.apiUrl;
    this.DOMAIN_KEY = obj ? obj.domainKey : '',
    this.API_KEY = obj ? obj.apiKey : '',
    this.API_TOKEN = obj ? obj.token : '',
    this.utils = new Utils();
};
module.exports = Boodskap;


Boodskap.prototype.login = function (data, cbk) {

    const self = this;

    request.post({
        uri: self.API_URL + '/auth/push/token',
        headers: {'content-type': 'application/json'},
        body: JSON.stringify(data),
    }, function (err, res, body) {

        if(!err) {

            if (res.statusCode === 200) {
                cbk(true, JSON.parse(res.body))
            } else {
                self.error(res.body)
                cbk(false, JSON.parse(res.body))
            }
        }else{
            self.error(err)
            cbk(false,null)
        }

    });
};

Boodskap.prototype.logout = function () {

    const self = this;

    request.get({
        uri: self.API_URL + '/domain/logout/' + self.API_TOKEN,
        headers: {'content-type': 'application/json'},
    }, function (err, res, body) {

        if(!err) {

        }else{

        }

    });
};

Boodskap.prototype.elasticInsert = function (rid, data, cbk) {

    const self = this;

    request.post({
        uri: self.API_URL + '/record/insert/dynamic/' + self.API_TOKEN +'/'+rid ,
        headers: {'content-type': 'text/plain'},
        body: JSON.stringify(data),
    }, function (err, res, body) {

        if(!err) {

            if (res.statusCode === 200) {
                cbk(true, JSON.parse(res.body))
            } else {
                self.error("record insert error in platform =>",res.body)
                cbk(false, JSON.parse(res.body))
            }
        }else{
            self.error("record insert error in platform =>",err)
            cbk(false,null)
        }

    });
};

Boodskap.prototype.elasticUpdate = function (rid, rkey, data, cbk) {

    const self = this;

    request.post({
        uri: self.API_URL + '/record/insert/static/' + self.API_TOKEN +'/'+rid +'/'+rkey,
        headers: {'content-type': 'text/plain'},
        body: JSON.stringify(data),
    }, function (err, res, body) {

        if(!err) {

            if (res.statusCode === 200) {
                cbk(true, JSON.parse(res.body))
            } else {
                self.error("record update error in platform =>",res.body)
                cbk(false, JSON.parse(res.body))
            }
        }else{
            self.error("record update error in platform =>",err)
            cbk(false,null)
        }

    });
};

Boodskap.prototype.elasticUpdateByQuery = function (rid, query, cbk) {

    const self = this;

    var obj = {
        "type": 'RECORD',
        "query" : JSON.stringify(query)
    }

    if(rid){
        obj['specId'] = rid;
    }

    request.post({
        uri: self.API_URL + '/elastic/update/query/' + self.API_TOKEN ,
        headers: {'content-type': 'application/json'},
        body: JSON.stringify(obj),

    }, function (err, res, body) {

        if(!err) {

            if (res.statusCode === 200) {
                cbk(true, JSON.parse(res.body))
            } else {
                self.error("elastic record update error in platform =>",res.body)
                cbk(false, JSON.parse(res.body))
            }
        }else{
            self.error("elastic record update error in platform =>",err)
            cbk(false,null)
        }

    });
};

Boodskap.prototype.elasticDelete = function (rid, rkey, cbk) {

    const self = this;

    request.delete({
        uri: self.API_URL + '/record/delete/' + self.API_TOKEN +'/'+rid +'/'+rkey,
    }, function (err, res, body) {

        if(!err) {

            if (res.statusCode === 200) {
                cbk(true, JSON.parse(res.body))
            } else {
                self.error("record delete error in platform =>",res.body)
                cbk(false,JSON.parse(res.body))
            }
        }else{
            self.error("record delete error in platform =>",err)
            cbk(false,null)
        }

    });
};

Boodskap.prototype.elasticSearch = function (rid, query, cbk) {

    const self = this;

    var obj = {
        "type": 'RECORD',
        "query" : JSON.stringify(query)
    };

    if(rid){
        obj['specId'] = rid;
    }

    request.post({
        uri: self.API_URL + '/elastic/search/query/' + self.API_TOKEN ,
        headers: {'content-type': 'application/json'},
        body: JSON.stringify(obj),

    }, function (err, res, body) {

        if(!err) {

            if (res.statusCode === 200) {
                var resultObj = self.utils.elasticQueryFormatter(JSON.parse(res.body))
                cbk(true, resultObj)
            } else {
                self.error("record search error in platform =>",res.body)
                cbk(false, JSON.parse(res.body))
            }
        }else{
            self.error("record search error in platform =>",err)
            cbk(false,null)
        }

    });
};

Boodskap.prototype.elasticModelSearch = function (model,query, cbk) {

    const self = this;

    var obj = {
        "type": model,
        "query" : JSON.stringify(query)
    };

    request.post({
        uri: self.API_URL + '/elastic/search/query/' + self.API_TOKEN ,
        headers: {'content-type': 'application/json'},
        body: JSON.stringify(obj),

    }, function (err, res, body) {

        if(!err) {

            if (res.statusCode === 200) {
                var resultObj = self.utils.elasticQueryFormatter(JSON.parse(res.body))
                cbk(true, resultObj)
            } else {
                self.error("record search error in platform =>",res.body)
                cbk(false, JSON.parse(res.body))
            }
        }else{
            self.error("record search error in platform =>",err)
            cbk(false,null)
        }

    });
};

Boodskap.prototype.executeTemplateScript = function (templateName,data, cbk) {

    const self = this;

    var templateObj = {
        "sessionId" : self.utils.generateUUID(),
        "template": templateName,
        "templateArgs": JSON.stringify(data),
        "scriptArgs": "{}"
    };


    request.post({
        uri: self.API_URL + '/call/execute/template/' + self.API_TOKEN,
        headers: {'content-type': 'application/json'},
        body: JSON.stringify(templateObj),
    }, function (err, res, body) {

        if(!err) {

            if (res.statusCode === 200) {
                cbk(true,JSON.parse(res.body))
            } else {
                self.error("Error in Template Execute =>",res.body)
                cbk(false, JSON.parse(res.body))
            }
        }else{
            self.error("Error in Template Execute =>",err)
            cbk(false,null)
        }

    });
};

Boodskap.prototype.upsertUser = function (data, cbk) {

    const self = this;

    request.post({
        uri: self.API_URL + '/user/upsert/' + self.API_TOKEN,
        headers: {'content-type': 'application/json'},
        body: JSON.stringify(data),
    }, function (err, res, body) {

        if(!err) {

            if (res.statusCode === 200) {
                cbk(true, JSON.parse(res.body))
            } else {
                self.error("User creation error in platform =>",res.body)
                cbk(false, JSON.parse(res.body))
            }
        }else{
            self.error("User creation error in platform =>",err)
            cbk(false,null)
        }

    });
};

Boodskap.prototype.deleteUser = function (email, cbk) {

    const self = this;

    request.delete({
        uri: self.API_URL + '/user/delete/' + self.API_TOKEN + '/' + email,
        headers: {'content-type': 'application/json'},
    }, function (err, res, body) {

        if(!err) {

            if (res.statusCode === 200) {
                cbk(true, JSON.parse(res.body))
            } else {
                self.error("User delete error in platform =>",res.body)
                cbk(false,JSON.parse(res.body))
            }
        }else{
            self.error("User delete error in platform =>",err)
            cbk(false,null)
        }

    });
};

Boodskap.prototype.pushMessage = function (url, data, mid) {

    const self = this;
    var did = 'ANYWARE';
    var dmid = 'ANYWARE';
    var version = '1.0.0';

    request.post({
        uri: self.API_URL + '/push/raw/' + self.DOMAIN_KEY + '/' + self.API_KEY + '/' + did + '/' + dmid + '/' + version + '/' + mid + '?type=JSON',
        headers: {'content-type': 'text/plain'},
        body: JSON.stringify(data),
    }, function (err, res, body) {
        if(err){
            self.error("Error in broadcasting message to platform =>",err)
        }

    });
};

Boodskap.prototype.uploadFile = function (data, cbk) {

    const self = this;

    var req = request.post(self.API_URL + "/files/upload/" + self.API_TOKEN, function (err, resp, body) {
        if (err) {
            self.error("Error processing file  in platform=>",err)
            cbk(false,err)
        } else {
            var resultData = JSON.parse(resp.body);
            cbk(true,resultData.id)

        }
    });

    var form = req.form();
    form.append('binfile', data.buffer, {
        filename: data.filename,
        contentType: 'text/plain'
    });
    form.append("mediaType", 'text/plain');
    form.append("tags", 'batch');
    form.append("description", '');

};

Boodskap.prototype.upsertDomainProperty = function (name,val, cbk) {

    const self = this;

    var data = {
        name: name,
        value: val
    };

    request.post({
        uri: self.API_URL + "/domain/property/upsert/" + self.API_TOKEN,
        headers: {'content-type': 'application/json'},
        body: JSON.stringify(data),
    }, function (err, res, body) {
        if(!err) {
            if (res.statusCode === 200) {
                var resultData = JSON.parse(res.body)
                cbk(true, resultData)
            } else {
                self.error("Error setting domain property in platform=>",res.body)
                cbk(false, JSON.parse(res.body))
            }
        }else{
            self.error("Error setting domain property in platform=>",err)
            cbk(false,null)
        }
    });

};

Boodskap.prototype.getDomainProperty = function (name, cbk) {

    const self = this;

    request.get({
        uri: self.API_URL + "/domain/property/get/" + self.API_TOKEN+'/'+name,
    }, function (err, res, body) {
        if(!err) {
            if (res.statusCode === 200) {
                var resultData = JSON.parse(res.body)
                cbk(true, resultData.value)
            } else {
                self.error("Error get domain property in platform=>",res.body)
                cbk(false,JSON.parse(res.body))
            }
        }else{
            self.error("Error get domain property in platform=>",err)
            cbk(false,null)
        }
    });

};

Boodskap.prototype.upsertUserProperty = function (name,val, cbk) {

    const self = this;

    var data = {
        name: name,
        value: val
    };

    request.post({
        uri: self.API_URL + "/user/property/upsert/" + self.API_TOKEN,
        headers: {'content-type': 'application/json'},
        body: JSON.stringify(data),
    }, function (err, res, body) {
        if(!err) {
            if (res.statusCode === 200) {
                var resultData = JSON.parse(res.body)
                cbk(true, resultData)
            } else {
                self.error("Error setting domain property in platform=>",res.body)
                cbk(false, JSON.parse(res.body))
            }
        }else{
            self.error("Error setting domain property in platform=>",err)
            cbk(false,null)
        }
    });

};

Boodskap.prototype.getUserProperty = function (name, userid, cbk) {

    const self = this;

    request.get({
        uri: self.API_URL + "/user/property/get/" + self.API_TOKEN+'/'+userid+'/'+name,
    }, function (err, res, body) {
        if(!err) {
            if (res.statusCode === 200) {
                var resultData = JSON.parse(res.body)
                cbk(true, resultData.value)
            } else {
                self.error("Error get domain property in platform=>",res.body)
                cbk(false,JSON.parse(res.body))
            }
        }else{
            self.error("Error get domain property in platform=>",err)
            cbk(false,null)
        }
    });

};


Boodskap.prototype.log = function (message) {
    console.log(new Date() +" | "+message)
}

Boodskap.prototype.error = function (message) {
    console.error(new Date() +" | "+message)
}

Boodskap.prototype.uuid = function () {
    return self.utils.generateUUID();
}




