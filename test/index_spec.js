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
var sinon = require('sinon');

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

const fileExists = (path)=>{
    return new Promise((resolve)=>{
        let file = bucket.file(path)
        console.log('--- fileExists for '+path)
        file.exists().then((exists)=>{
            console.dir(exists)
            resolve(exists ? exists[0] : false)
        })
    })
}

const getFile = (fname)=>{
    return new Promise((resolve)=>
    {
        let file = bucket.file(fname)
        file.exists().then((exists) =>
        {
            console.log('getFile file ' + fname + ' exists = ' + exists[0])
            if (exists[0])
            {
                console.log('downloading file ' + fname)
                file.download().then((file) =>
                {
                    resolve(file.toString())
                })
            } else
            {
                console.log('getData returning undefined')
                resolve([])
            }
        })
    })
}

//---------------------------------------------------------------------------------------------------------------

describe('storage/googlefilesystem', function() {
    var mockRuntime = {
        log:{
            _:function() { return "placeholder message"},
            info: function() { },
            warn: function() { },
            trace: function() {}
        }
    };

    var testFlow = [{"type":"tab","id":"d8be2a6d.2741d8","label":"Sheet 1"}];
    beforeEach(function(done) {
       deleteStorage(userDir).then(()=>{
           done()
       })
    });


    it('should initialise the user directory',function(done) {
        googlefilesystem.init(settings, mockRuntime).then(function() {
            setTimeout(()=>{
                fileExists(userDir + "/lib/flows/flow.json").then((lexists)=>{
                    console.log('lexists = '+lexists)
                    lexists.should.be.true();
                    done()
                })
            }, 1000)
        }).catch(function(err) {
            done(err);
        });
    }).timeout(10000);

    /*
    it('should set userDir to NRH if .config.json presents',function(done) {
        var oldNRH = process.env.NODE_RED_HOME;
        process.env.NODE_RED_HOME = path.join(userDir,"NRH");
        fs.mkdirSync(process.env.NODE_RED_HOME);
        fs.writeFileSync(path.join(process.env.NODE_RED_HOME,".config.json"),"{}","utf8");
        var settings = {};
        googlefilesystem.init(settings, mockRuntime).then(function() {
            try {
                fs.existsSync(path.join(process.env.NODE_RED_HOME,"lib")).should.be.true();
                fs.existsSync(path.join(process.env.NODE_RED_HOME,"lib",'flows')).should.be.true();
                settings.userDir.should.equal(process.env.NODE_RED_HOME);
                done();
            } catch(err) {
                done(err);
            } finally {
                process.env.NODE_RED_HOME = oldNRH;
            }
        }).catch(function(err) {
            done(err);
        });
    });


    it('should set userDir to HOMEPATH/.node-red if .config.json presents',function(done) {
        var oldNRH = process.env.NODE_RED_HOME;
        process.env.NODE_RED_HOME = path.join(userDir,"NRH");
        var oldHOMEPATH = process.env.HOMEPATH;
        process.env.HOMEPATH = path.join(userDir,"HOMEPATH");
        fs.mkdirSync(process.env.HOMEPATH);
        fs.mkdirSync(path.join(process.env.HOMEPATH,".node-red"));
        fs.writeFileSync(path.join(process.env.HOMEPATH,".node-red",".config.json"),"{}","utf8");
        var settings = {};
        googlefilesystem.init(settings, mockRuntime).then(function() {
            try {
                fs.existsSync(path.join(process.env.HOMEPATH,".node-red","lib")).should.be.true();
                fs.existsSync(path.join(process.env.HOMEPATH,".node-red","lib",'flows')).should.be.true();
                settings.userDir.should.equal(path.join(process.env.HOMEPATH,".node-red"));
                done();
            } catch(err) {
                done(err);
            } finally {
                process.env.NODE_RED_HOME = oldNRH;
                process.env.NODE_HOMEPATH = oldHOMEPATH;
            }
        }).catch(function(err) {
            done(err);
        });
    });


    it('should set userDir to HOME/.node-red',function(done) {
        var oldNRH = process.env.NODE_RED_HOME;
        process.env.NODE_RED_HOME = path.join(userDir,"NRH");
        var oldHOME = process.env.HOME;
        process.env.HOME = path.join(userDir,"HOME");
        var oldHOMEPATH = process.env.HOMEPATH;
        process.env.HOMEPATH = path.join(userDir,"HOMEPATH");

        fs.mkdirSync(process.env.HOME);
        var settings = {};
        googlefilesystem.init(settings, mockRuntime).then(function() {
            try {
                fs.existsSync(path.join(process.env.HOME,".node-red","lib")).should.be.true();
                fs.existsSync(path.join(process.env.HOME,".node-red","lib",'flows')).should.be.true();
                settings.userDir.should.equal(path.join(process.env.HOME,".node-red"));
                done();
            } catch(err) {
                done(err);
            } finally {
                process.env.NODE_RED_HOME = oldNRH;
                process.env.HOME = oldHOME;
                process.env.HOMEPATH = oldHOMEPATH;
            }
        }).catch(function(err) {
            done(err);
        });
    });


    it('should set userDir to USERPROFILE/.node-red',function(done) {
        var oldNRH = process.env.NODE_RED_HOME;
        process.env.NODE_RED_HOME = path.join(userDir,"NRH");
        var oldHOME = process.env.HOME;
        process.env.HOME = "";
        var oldHOMEPATH = process.env.HOMEPATH;
        process.env.HOMEPATH = path.join(userDir,"HOMEPATH");
        var oldUSERPROFILE = process.env.USERPROFILE;
        process.env.USERPROFILE = path.join(userDir,"USERPROFILE");

        fs.mkdirSync(process.env.USERPROFILE);
        var settings = {};
        googlefilesystem.init(settings, mockRuntime).then(function() {
            try {
                fs.existsSync(path.join(process.env.USERPROFILE,".node-red","lib")).should.be.true();
                fs.existsSync(path.join(process.env.USERPROFILE,".node-red","lib",'flows')).should.be.true();
                settings.userDir.should.equal(path.join(process.env.USERPROFILE,".node-red"));
                done();
            } catch(err) {
                done(err);
            } finally {
                process.env.NODE_RED_HOME = oldNRH;
                process.env.HOME = oldHOME;
                process.env.HOMEPATH = oldHOMEPATH;
                process.env.USERPROFILE = oldUSERPROFILE;
            }
        }).catch(function(err) {
            done(err);
        });
    });


    it('should handle missing flow file',function(done) {
        googlefilesystem.init({userDir:userDir}, mockRuntime).then(function() {
            var flowFile = 'flows_'+require('os').hostname()+'.json';
            fileExists(userDir + "/"+flowFile).then((lexists)=>
            {
                googlefilesystem.getFlows().then(function(flows)
                {
                    flows.should.eql([]);
                    done();
                }).catch(function(err)
                {
                    done(err);
                });
            })
        }).catch(function(err) {
            done(err);
        });
    });



    it('should handle empty flow file, no backup',function(done) {
        googlefilesystem.init({userDir:userDir}, mockRuntime).then(function() {
            var flowFile = 'flows_'+require('os').hostname()+'.json';
            var flowFilePath = path.join(userDir,flowFile);
            var flowFileBackupPath = path.join(userDir,"."+flowFile+".backup");
            fs.closeSync(fs.openSync(flowFilePath, 'w'));
            fs.existsSync(flowFilePath).should.be.true();
            googlefilesystem.getFlows().then(function(flows) {
                flows.should.eql([]);
                done();
            }).catch(function(err) {
                done(err);
            });
        }).catch(function(err) {
            done(err);
        });
    });

    it('should handle empty flow file, restores backup',function(done) {
        googlefilesystem.init({userDir:userDir}, mockRuntime).then(function() {
            var flowFile = 'flows_'+require('os').hostname()+'.json';
            var flowFilePath = path.join(userDir,flowFile);
            var flowFileBackupPath = path.join(userDir,"."+flowFile+".backup");
            fs.closeSync(fs.openSync(flowFilePath, 'w'));
            fs.existsSync(flowFilePath).should.be.true();
            fs.existsSync(flowFileBackupPath).should.be.false();
            fs.writeFileSync(flowFileBackupPath,JSON.stringify(testFlow));
            fs.existsSync(flowFileBackupPath).should.be.true();
            setTimeout(function() {
                googlefilesystem.getFlows().then(function(flows) {
                    flows.should.eql(testFlow);
                    done();
                }).catch(function(err) {
                    done(err);
                });
            },50);
        }).catch(function(err) {
            done(err);
        });
    });

    it('should save flows to the default file',function(done) {
        googlefilesystem.init({userDir:userDir}, mockRuntime).then(function() {
            var flowFile = 'flows_'+require('os').hostname()+'.json';
            var flowFilePath = path.join(userDir,flowFile);
            var flowFileBackupPath = path.join(userDir,"."+flowFile+".backup");
            fs.existsSync(flowFilePath).should.be.false();
            fs.existsSync(flowFileBackupPath).should.be.false();
            googlefilesystem.saveFlows(testFlow).then(function() {
                fs.existsSync(flowFilePath).should.be.true();
                fs.existsSync(flowFileBackupPath).should.be.false();
                googlefilesystem.getFlows().then(function(flows) {
                    flows.should.eql(testFlow);
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
    });



    it('should save flows to the specified file',function(done) {
        var defaultFlowFile = 'flows_'+require('os').hostname()+'.json';
        var defaultFlowFilePath = path.join(userDir,defaultFlowFile);
        var flowFile = 'test.json';
        var flowFilePath = path.join(userDir,flowFile);

        googlefilesystem.init({userDir:userDir, flowFile:flowFilePath}, mockRuntime).then(function() {
            fs.existsSync(defaultFlowFilePath).should.be.false();
            fs.existsSync(flowFilePath).should.be.false();

            googlefilesystem.saveFlows(testFlow).then(function() {
                fs.existsSync(defaultFlowFilePath).should.be.false();
                fs.existsSync(flowFilePath).should.be.true();
                googlefilesystem.getFlows().then(function(flows) {
                    flows.should.eql(testFlow);
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
    });

     */

    it('should format the flows file when flowFilePretty specified',function(done) {
        settings.flowFilePretty = true
        googlefilesystem.init(settings).then(function() {
            googlefilesystem.saveFlows(testFlow).then(function() {
                getFile(userDir+'/flow.json').then((content)=>{
                    //console.log('got content... typeof = '+(typeof content))
                    //console.log(content)
                    let arr = content.split("\\n")
                    //console.log('------------------------')
                    //console.dir(arr)
                    arr.length.should.be.above(1);
                    googlefilesystem.getFlows().then(function(flows) {
                        flows.should.eql(testFlow);
                        done();
                    }).catch(function(err) {
                        done(err);
                    });
                })
            }).catch(function(err) {
                done(err);
            });
        }).catch(function(err) {
            done(err);
        });
    }).timeout(10000);

    /*
    it('should fsync the flows file',function(done) {
        var flowFile = 'test.json';
        var flowFilePath = path.join(userDir,flowFile);
        googlefilesystem.init({editorTheme:{projects:{enabled:false}},userDir:userDir, flowFile:flowFilePath}, mockRuntime).then(function() {
            sinon.spy(fs,"fsync");
            googlefilesystem.saveFlows(testFlow).then(function() {
                fs.fsync.callCount.should.be.greaterThan(0);
                fs.fsync.restore();
                done();
            }).catch(function(err) {
                fs.fsync.restore();
                done(err);
            });
        }).catch(function(err) {
            done(err);
        });
    });

    it('should log fsync errors and continue',function(done) {
        var flowFile = 'test.json';
        var flowFilePath = path.join(userDir,flowFile);
        googlefilesystem.init({userDir:userDir, flowFile:flowFilePath}, mockRuntime).then(function() {
            sinon.stub(fs,"fsync", function(fd, cb) {
                cb(new Error());
            });
            sinon.spy(log,"warn");
            googlefilesystem.saveFlows(testFlow).then(function() {
                fs.fsync.callCount.should.be.greaterThan(0);
                log.warn.restore();
                fs.fsync.callCount.should.be.greaterThan(0);
                fs.fsync.restore();
                done();
            }).catch(function(err) {
                done(err);
            });
        }).catch(function(err) {
            done(err);
        });
    });


    it('should backup the flows file', function(done) {
        var defaultFlowFile = 'flows_'+require('os').hostname()+'.json';
        var defaultFlowFilePath = path.join(userDir,defaultFlowFile);
        var flowFile = 'test.json';
        var flowFilePath = path.join(userDir,flowFile);
        var flowFileBackupPath = path.join(userDir,"."+flowFile+".backup");

        googlefilesystem.init({userDir:userDir, flowFile:flowFilePath}, mockRuntime).then(function() {
            fs.existsSync(defaultFlowFilePath).should.be.false();
            fs.existsSync(flowFilePath).should.be.false();
            fs.existsSync(flowFileBackupPath).should.be.false();

            googlefilesystem.saveFlows(testFlow).then(function() {
                fs.existsSync(flowFileBackupPath).should.be.false();
                fs.existsSync(defaultFlowFilePath).should.be.false();
                fs.existsSync(flowFilePath).should.be.true();
                var content = fs.readFileSync(flowFilePath,'utf8');
                var testFlow2 = [{"type":"tab","id":"bc5672ad.2741d8","label":"Sheet 2"}];

                googlefilesystem.saveFlows(testFlow2).then(function() {
                    fs.existsSync(flowFileBackupPath).should.be.true();
                    fs.existsSync(defaultFlowFilePath).should.be.false();
                    fs.existsSync(flowFilePath).should.be.true();
                    var backupContent = fs.readFileSync(flowFileBackupPath,'utf8');
                    content.should.equal(backupContent);
                    var content2 = fs.readFileSync(flowFilePath,'utf8');
                    content2.should.not.equal(backupContent);
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


    });

    it('should handle missing credentials', function(done) {
        var flowFile = 'test.json';
        var flowFilePath = path.join(userDir,flowFile);
        var credFile = path.join(userDir,"test_cred.json");
        googlefilesystem.init({userDir:userDir, flowFile:flowFilePath}, mockRuntime).then(function() {
            fs.existsSync(credFile).should.be.false();

            googlefilesystem.getCredentials().then(function(creds) {
                creds.should.eql({});
                done();
            }).catch(function(err) {
                done(err);
            });
        }).catch(function(err) {
            done(err);
        });
    });

    it('should handle credentials', function(done) {
        var flowFile = 'test.json';
        var flowFilePath = path.join(userDir,flowFile);
        var credFile = path.join(userDir,"test_cred.json");

        googlefilesystem.init({userDir:userDir, flowFile:flowFilePath}, mockRuntime).then(function() {

            fs.existsSync(credFile).should.be.false();

            var credentials = {"abc":{"type":"creds"}};

            googlefilesystem.saveCredentials(credentials).then(function() {
                fs.existsSync(credFile).should.be.true();
                googlefilesystem.getCredentials().then(function(creds) {
                    creds.should.eql(credentials);
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
    });


    it('should backup existing credentials', function(done) {
        var flowFile = 'test.json';
        var flowFilePath = path.join(userDir,flowFile);
        var credFile = path.join(userDir,"test_cred.json");
        var credFileBackup = path.join(userDir,".test_cred.json.backup");

        googlefilesystem.init({userDir:userDir, flowFile:flowFilePath}, mockRuntime).then(function() {

            fs.writeFileSync(credFile,"{}","utf8");

            fs.existsSync(credFile).should.be.true();
            fs.existsSync(credFileBackup).should.be.false();

            var credentials = {"abc":{"type":"creds"}};

            googlefilesystem.saveCredentials(credentials).then(function() {
                fs.existsSync(credFile).should.be.true();
                fs.existsSync(credFileBackup).should.be.true();
                done();
            }).catch(function(err) {
                done(err);
            });
        }).catch(function(err) {
            done(err);
        });
    });

    it('should format the creds file when flowFilePretty specified',function(done) {
        var flowFile = 'test.json';
        var flowFilePath = path.join(userDir,flowFile);
        var credFile = path.join(userDir,"test_cred.json");

        googlefilesystem.init({userDir:userDir, flowFile:flowFilePath, flowFilePretty:true}, mockRuntime).then(function() {

            fs.existsSync(credFile).should.be.false();

            var credentials = {"abc":{"type":"creds"}};

            googlefilesystem.saveCredentials(credentials).then(function() {
                fs.existsSync(credFile).should.be.true();
                var content = fs.readFileSync(credFile,"utf8");
                content.split("\n").length.should.be.above(1);
                googlefilesystem.getCredentials().then(function(creds) {
                    creds.should.eql(credentials);
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
    });

     */
});
