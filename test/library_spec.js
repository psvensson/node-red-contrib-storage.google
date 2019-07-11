/**
 * Copyright JS Foundation and other contributors, http://js.foundation
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 **/

var should = require("should");
var fs = require('fs-extra');
var path = require('path');
var googlefilesystem = require("../google-storage");


const {Storage} = require('@google-cloud/storage');

var googlefilesystem = require("../google-storage");
var log = console.log
let bucket


let settings = {
    googleStorageAppname: 'test-app',
    googleStorageBucket: 'something-2e584.appspot.com',
    googleProjectId: 'something-2e584',
    googleCredentials: {
        "type": "service_account",
        "project_id": "something-2e584",
        "private_key_id": "1185be71898b6dd0a4d42650a0089a943824bd98",
        "private_key": "-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQC+Msft8JAhhxLm\nzYZenruDS593pFytg6AOEfbROOpOiASlS91h5itvvHlQwWwJqf8mMqjmYrPtHKxP\n5JS8wVcAv2NlDwQe8+Uaxg1YWUMI9xsSNaaLsq4MjTY5WDjhSog6YM7jdtD132YN\npsP579B0UQWfauF6Tf6hYhMCNJSaE/r1cM0i3/Wj/85BBhdULXQMkF4Bt2GVf2Tv\nNhcQdtVS887GYo3CMyFk5Uzc59rCJoneD3ha6ACvdvehhk8BfzocBevDZ8jMJZuk\nSGHpeK+ug1CeCiFhkfFYsM4Eu+Yl7TwbEX1STZTzJz6sWxQn6RJSWzPJ9iyPQwJP\njS4s0qV9AgMBAAECggEACer+a/Fficx6zJ9jrSQcSRKKHUCzb5o0vIqltovxywT/\nLz4WgZDxZHaNNyh9IWqLmlHCn9ca5Mz2hfccAf/Chq0e6Eti8GcmVdATnktzExgM\n83GUiV7Kc/3FGcEU9Vff8uiyiD/5w4TuYjJMk92X17OUHV7KM2xhiR0NkAin4jMY\nrxzNgDAF4eiGC9khX/3xCmLi2PZNFjNYgIWagwzZ1IHHxKm1SV+NTaMZ5OvXtSRi\nn36MX+wiPadWzxcVGWw0SYFmxW+muVSk3/OoAR2NkB9IjctH9IRymWfkw8ilJI6P\nhS5mzX8RyjvkzvfWHNBX+lhYa3gt7k3y0QsyODoYTQKBgQD4Z1YAReBNaqaTrzUM\n9g3k7feHPUeVV7Mrycn1Bl7vC6lBPK3tThLhrmRUt1c7s2QTdah5Wvl3rUkgELDS\nWq6O+qosxcWWS9lZ6Wll4XUMvRcyd7SLg+iILOusrjiO4Ug5w3uePj7mtx6DMRlS\nBM02WsOCpyprf1xs6rdYMVR5bwKBgQDEA8bFqhIayosQV7LEwCxQ9iJ0pZq3q5Mj\nqDC3+forV+znQ2VtCvK2GQnBor4C2vLJ4gsAA2GTeF5EBQTQ0hk6VGDtaeeijQeq\nZp/UnNF0UtVMeLKPFLC1v4FQ1pg/CD1UB572LuSX2NgN8Uhz24+Pfa6KVpSMh9+k\nJLQIJgjh0wKBgClrkbuZ6zz9e6lEneP7Y3W4+H1kinsslIPIshRZa5sQprhqFdZs\nHlnjand12uXpk9Zq2BzkPpTmIDtojROGa3UL9zRgBgJ5w1Rqx1hlr87f+O5BZ6mb\n5TpPwzyYEHZCunhnUEWiu3pdLolRtpcmldFqcQ9oMHqcUh0XRls+XoehAoGAcfHE\nDcmkhqBxIInqaMdRu6qpMufFvblmalbuIzSUgbe2BmW+QxoXJ1X8vuxsyloews69\nGD/e7AwPuDi2qPFJKwg75CcpOOwEpcDMbprOg3FXfwG2wsgDRVPSx3xHunR+uidH\n99Ignki2p7w4IuliVcZ4vQBBkEO39MJFSWtaxHMCgYEAgx/+Uzo7WYuzF3+IMIuH\nUBcz+LrJ1rG3nql4f9wo6fMchHI1uCDaOqX3htcqLw6ykh5fX9WJGwhAHDT4GJmI\nSDKlqClR8t7un3wdEct5/Y4Y39/Y/PYRFaP1HGUvv88JadyTJmgN89q3YT6xyvE2\na7kvcau5235ThEopeUzSJYU=\n-----END PRIVATE KEY-----\n",
        "client_email": "firebase-adminsdk-d1xiy@something-2e584.iam.gserviceaccount.com",
        "client_id": "111162044118241348543",
        "auth_uri": "https://accounts.google.com/o/oauth2/auth",
        "token_uri": "https://oauth2.googleapis.com/token",
        "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
        "client_x509_cert_url": "https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk-d1xiy%40something-2e584.iam.gserviceaccount.com"
    }
}

let userDir = 'node-red/'+settings.googleStorageAppname

const getBucket = async (settings)=>{
    const opts = {
        projectId: settings.googleProjectId,
        credentials: settings.googleCredentials
    }
    storage    = new Storage(opts);
    if(bucket){
        return bucket
    } else {
        // Creates the new bucket
        //console.log('creating bucket with name "'+bucketName+'"')
        bucket = storage.bucket(settings.googleStorageBucket)
        return bucket
    }
}

const deleteStorage = async (path)=>{
    let b = await getBucket(settings)
    b.deleteFiles({
        prefix: path
    }, function(err) {
        if (err) {
            // All files in the `images` directory have been deleted.
            console.log('cloud storage delete got error: '+err)
        } else {
            console.log('cloud storage delete successfull for '+path)
        }
    });
}


describe('storage/googlefilesystem/library', function() {
    beforeEach(function(done) {
        deleteStorage(userDir).then(()=>{
            done()
        })
    });

    it('should return an empty list of library objects',function(done) {
        googlefilesystem.init(settings).then(function() {
            googlefilesystem.getLibraryEntry('object','').then(function(flows) {
                flows.should.eql([]);
                done();
            }).catch(function(err) {
                done(err);
            });
        }).catch(function(err) {
            done(err);
        });
    }).timeout(10000);

    it('should return an empty list of library objects (path=/)',function(done) {
        googlefilesystem.init({userDir:userDir}).then(function() {
            googlefilesystem.getLibraryEntry('object','/').then(function(flows) {
                flows.should.eql([]);
                done();
            }).catch(function(err) {
                done(err);
            });
        }).catch(function(err) {
            done(err);
        });
    });

    it('should return an error for a non-existent library object',function(done) {
        googlefilesystem.init({userDir:userDir}).then(function() {
            googlefilesystem.getLibraryEntry('object','A/B').then(function(flows) {
                should.fail(null,null,"non-existent flow");
            }).catch(function(err) {
                should.exist(err);
                done();
            });
        }).catch(function(err) {
            done(err);
        });
    });

    function createObjectLibrary(type) {
        type = type ||"object";
        var objLib = path.join(userDir,"lib",type);
        try {
            fs.mkdirSync(objLib);
        } catch(err) {
        }
        fs.mkdirSync(path.join(objLib,"A"));
        fs.mkdirSync(path.join(objLib,"B"));
        fs.mkdirSync(path.join(objLib,"B","C"));
        if (type === "functions" || type === "object") {
            fs.writeFileSync(path.join(objLib,"file1.js"),"// abc: def\n// not a metaline \n\n Hi",'utf8');
            fs.writeFileSync(path.join(objLib,"B","file2.js"),"// ghi: jkl\n// not a metaline \n\n Hi",'utf8');
        }
        if (type === "flows" || type === "object") {
            fs.writeFileSync(path.join(objLib,"B","flow.json"),"Hi",'utf8');
        }
    }

    it('should return a directory listing of library objects',function(done) {
        googlefilesystem.init({userDir:userDir}).then(function() {
            createObjectLibrary();

            googlefilesystem.getLibraryEntry('object','').then(function(flows) {
                flows.should.eql([ 'A', 'B', { abc: 'def', fn: 'file1.js' } ]);
                googlefilesystem.getLibraryEntry('object','B').then(function(flows) {
                    flows.should.eql([ 'C', { ghi: 'jkl', fn: 'file2.js' }, { fn: 'flow.json' } ]);
                    googlefilesystem.getLibraryEntry('object','B/C').then(function(flows) {
                        flows.should.eql([]);
                        done();
                    }).catch(function(err) {
                        done(err);
                    });
                }).catch(function(err) {
                    done(err);
                });
            }).catch(function(err) {
                done(err);
            });
        }).catch(function(err) {
            done(err);
        });
    });

    it('should load a flow library object with .json unspecified', function(done) {
        googlefilesystem.init({userDir:userDir}).then(function() {
            createObjectLibrary("flows");
            googlefilesystem.getLibraryEntry('flows','B/flow').then(function(flows) {
                flows.should.eql("Hi");
                done();
            }).catch(function(err) {
                done(err);
            });
        });

    });

    it('should return a library object',function(done) {
        googlefilesystem.init({userDir:userDir}).then(function() {
            createObjectLibrary();
            googlefilesystem.getLibraryEntry('object','B/file2.js').then(function(body) {
                body.should.eql("// not a metaline \n\n Hi");
                done();
            }).catch(function(err) {
                done(err);
            });
        }).catch(function(err) {
            done(err);
        });
    });

    it('should return a newly saved library function',function(done) {
        googlefilesystem.init({userDir:userDir}).then(function() {
            createObjectLibrary("functions");
            googlefilesystem.getLibraryEntry('functions','B').then(function(flows) {
                flows.should.eql([ 'C', { ghi: 'jkl', fn: 'file2.js' } ]);
                var ft = path.join("B","D","file3.js");
                googlefilesystem.saveLibraryEntry('functions',ft,{mno:'pqr'},"// another non meta line\n\n Hi There").then(function() {
                    setTimeout(function() {
                        googlefilesystem.getLibraryEntry('functions',path.join("B","D")).then(function(flows) {
                            flows.should.eql([ { mno: 'pqr', fn: 'file3.js' } ]);
                            googlefilesystem.getLibraryEntry('functions',ft).then(function(body) {
                                body.should.eql("// another non meta line\n\n Hi There");
                                done();
                            }).catch(function(err) {
                                done(err);
                            });
                        }).catch(function(err) {
                            done(err);
                        })
                    }, 50);
                }).catch(function(err) {
                    done(err);
                });
            }).catch(function(err) {
                done(err);
            });
        }).catch(function(err) {
            done(err);
        });
    });

    it('should return a newly saved library flow',function(done) {
        googlefilesystem.init({userDir:userDir}).then(function() {
            createObjectLibrary("flows");
            googlefilesystem.getLibraryEntry('flows','B').then(function(flows) {
                flows.should.eql([ 'C', {fn:'flow.json'} ]);
                var ft = path.join("B","D","file3");
                googlefilesystem.saveLibraryEntry('flows',ft,{mno:'pqr'},"Hi").then(function() {
                    setTimeout(function() {
                        googlefilesystem.getLibraryEntry('flows',path.join("B","D")).then(function(flows) {
                            flows.should.eql([ { mno: 'pqr', fn: 'file3.json' } ]);
                            googlefilesystem.getLibraryEntry('flows',ft+".json").then(function(body) {
                                body.should.eql("Hi");
                                done();
                            }).catch(function(err) {
                                done(err);
                            });
                        }).catch(function(err) {
                            done(err);
                        })
                    }, 50);
                }).catch(function(err) {
                    done(err);
                });
            }).catch(function(err) {
                done(err);
            });
        }).catch(function(err) {
            done(err);
        });
    });
});
