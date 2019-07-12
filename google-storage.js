const {Storage} = require('@google-cloud/storage');
let util = require('util');
let fs = require('fs');
let nodered = require('@node-red/runtime')
let admin = require('firebase-admin')

let settings;
let projectId
let credentials
let appname = 'default';
let storage
let bucketName = 'node-red-storage'
let bucket

let currentFlowRev = {};
let currentSettingsRev = null;
let currentCredRev = null;

let libraryCache = {};
let flowFile = 'flow'


let googleStorage = {

  init: (_settings, runtime)=> {
    return new Promise((resolve,reject)=>{
      //console.log('google-storage init adminApi is '+runtime.adminApi)
      //console.dir(runtime.adminApi.httpAdmin)
      //console.dir(_settings)
      googleStorage.settings = _settings;
      googleStorage.runtime = runtime

      if(!_settings.googleStorageBucket || !_settings.googleProjectId || !_settings.googleCredentials){
        reject('Cannot initialize without Google Cloud settings')
      } else {
        //console.log('---- *** node-red google cloud storage got all needed settings! *** ---')
        if(_settings.flowFile){
          flowFile = _settings.flowFile.replace('.json','')
        }
        googleStorage.getBucket().then(()=>{
          if(_settings.googleFirebaseReload === true){
            googleStorage.setupFirebaseListener()
          }
          googleStorage.prepopulateFlows(resolve)
        })
      }
    })
  },

  setupFirebaseListener: ()=>{
    //console.log('setting up firebase listener for flow reloading')
    admin.initializeApp({
      credential: admin.credential.cert(googleStorage.settings.googleCredentials),
      databaseURL: googleStorage.settings.googleDbUrl
    });
    setTimeout(()=>{
      console.log('-------------------------------------- firebase admin SDK initialized. listening on "'+googleStorage.appname+'"')
      admin.database().ref(googleStorage.appname).on('value', (flowref)=>{
        if(googleStorage.settingFlow !== true){
          console.log('firebase listener got update for new flow')
          let flows = flowref.val()
          googleStorage.runtime.nodes.loadFlows(true).then(function()
          {
            console.log('--- flow reloaded from google cloud storage plugin')
          })
        } else {
          googleStorage.settingFlow = false
        }
      })
    }, 5000)
  },

  prepopulateFlows: (resolve)=> {
    //console.log('google-storage prepopulateFlows called')
    googleStorage.getBucket().then((bucket) => {
      googleStorage.getFlows().then((existing_flows)=> {
        //console.log('existing flows is')
        //console.dir(existing_flows)
        if (!existing_flows) {
            console.log(">> No default flow found");
            let default_flow = [{
              "id": "7b9c5129.e9e8",
              "type": "tab",
              "label": "Flow 1",
              "disabled": false,
              "info": ""
            }]
          googleStorage.saveFlows(default_flow).then(()=>{
            googleStorage.saveLibraryEntry('flows', 'flow', undefined, default_flow).then(()=>{
                resolve()
              })
            })
          } else {
            resolve()
          }
        })
      })
  },

  getBucket: ()=> {
    return new Promise(function(resolve,reject) {
      //console.log('getBucket called')
      if (this.bucket)  {
        //console.log('getBucket found bucket')
        //console.dir(this.bucket)
        resolve(this.bucket)
      } else {
        bucketName  = googleStorage.settings.googleStorageBucket;
        projectId   = googleStorage.settings.googleProjectId
        credentials = googleStorage.settings.googleCredentials
        //email       = googleStorage.settings.googleEmail
        appname     = googleStorage.settings.googleStorageAppname || 'default';
        googleStorage.appname = 'node-red/'+appname
        const opts = {
          projectId: projectId,
          credentials: credentials
        }
        storage    = new Storage(opts);
        //console.dir(opts)
        try {
          // Creates the new bucket
          //console.log('creating bucket with name "'+bucketName+'"')
          this.bucket = storage.bucket(bucketName)
          resolve(this.bucket)
        }
        catch (ex) {
          console.log('google-storage caught exception!')
          console.dir(ex)
        }
      }
    }.bind(this))
  },

  getFlows: function() {
    console.log('------------------------------------------- getFlow called')
    return this.getArrayData(flowFile) ;
  },

  saveFlows: function(flows) {
    console.log('------------------------------------------- saveFlow called for')
    //console.dir(flows)
    let flowData
    if (googleStorage.settings.flowFilePretty) {
      flowData = JSON.stringify(flows,null,4);
    } else {
      flowData = JSON.stringify(flows);
    }
    if(googleStorage.settings.googleFirebaseReload === true){
      googleStorage.settingFlow = true
      this.saveData(flowFile, flowData, true).then(()=>{
        console.log('updating flows through firebase')
        let dbref = admin.database().ref(googleStorage.appname)
        //console.log('dbref = '+dbref+' typeof = '+(typeof dbref))
        let setref = dbref.set(flows)
        //console.log('setref = '+setref+' typeof = '+(typeof setref))
        if(setref){
          setref.then(()=>{
            console.log('updated flows through firebase')
          })
        }
      })
    } else {
      this.saveData(flowFile, flowData, true) ;
    }
  },
  getCredentials: function() {
    console.log('------------------------------------------- getCredentials')
    return this.getData("credential") ;
  },
  saveCredentials: function(creds) {
    console.log('------------------------------------------- saveCredentials')
    return this.saveData("credential", creds) ;
  },
  getSettings: function() {
    return new Promise(function(resolve,reject)  {
      //console.log('google-storage.getSettings called')

      this.getData("settings").then((ssettings) => {
        if (ssettings) {
          resolve(ssettings)
        }
      }, (err)=>{
        console.log('**** settings file not found i google cloud storage so returning boot settings.js')
        resolve(googleStorage.settings)
      })

      //resolve(googleStorage.settings)
    }.bind(this))
  },

  saveSettings: function(settings) {
    //console.log('------------------------------------------- saveSettings')
    let props = ['functionGlobalContext', 'userDir', 'storageModule']
    var s = {}
    for(var p in settings){
      if((typeof settings[p] !== 'function') && !props.includes(p)){
        //console.log(p+' includes = '+(props.includes(p)))
        s[p] = settings[p]
      }
    }
    //let s = {nodes: settings.nodes}
    return this.saveData("settings", s, ) ;
  },

  getData: function(entryType) {
    //console.log('------------------------------------------- getData reading single file from path "'+entryType+'"')
    return new Promise(function(resolve,reject) {
      this.getBucket().then((bucket)=>{
        let fname = googleStorage.appname + '/' + entryType+'.json'
        //console.log('getData checking if file '+fname+' exists')
        let file = bucket.file(fname)
        file.exists().then((exists)=>{
          //console.log('getData file '+entryType+' exists = '+exists[0])
          if(exists[0]){
            //console.log('downloading file '+entryType)
            file.download().then((file)=>{
              //console.log('storage-read.getData got file '+entryType)
              //console.dir(file)
              let rv = JSON.parse(file.toString())
              //console.log('getData returning: '+rv)
              //console.dir(rv)
              resolve(rv)
            })
          }else {
            console.log('googe-storage getData returning undefined for "'+entryType+'"')
            resolve([])
          }
        })
      })
    }.bind(this))
  },

  getArrayData: function(entryType) {
    return this.getData(entryType)
  },

  saveData: function(entryType, dataEntry, bypass) {
    console.log('------------------------------------------- google-storage saveData for "'+entryType+'" bypass = '+bypass)
    //console.dir(dataEntry)
    return new Promise(function(resolve,reject) {
      if(!dataEntry){
        dataEntry = ''
      }
      this.getBucket().then((bucket) => {
        //console.log('-----------------------saveData saving file "'+entryType+'"')
        //console.dir(dataEntry)
        //console.log('-----------------------saveData')
        let f    = googleStorage.appname + '/' + entryType + (entryType.indexOf('.js') > -1 ? '' : '.json')
        //console.log('f = "'+f+'"')
        let file = bucket.file(f);
        let data = Buffer.from(bypass === true ? dataEntry : JSON.stringify(dataEntry));
        file.save(data, function(err) {
          if (err) {
            console.log('save ERROR: ' + err)
            reject(err.toString());
          } else {
            console.log('saved OK')
            resolve();
          }
        });
      })
    }.bind(this))
  },

  saveLibraryEntry: function(type,path,meta,body) {
    //console.log('------------------------------------------- saveLibrary called for type='+type+', path='+path+', meta='+meta+', body='+body)
    let key =  "lib/" + type + (path.substr(0) != "/" ? "/" : "") + path;
    //console.log('saveLibraryEntry for key "'+key+'"')
    return this.saveData(key, body)
  },

  getLibraryEntry: function(type,path) {
    return new Promise(function(resolve,reject)
    {
      let key = "lib/" + type + (path.substr(0) != "/" ? "/" : "") + path;
      //console.log("------------------------------------------- get library entry: " + type + ":" + path);
      if(key.lastIndexOf('.') > key.length-4){
        return this.getSingleLibraryFile(key)
      } else {
        return this.getLibraryDirectoryListing(key)
      }
    }.bind(this))
  },

  getSingleLibraryFile: function(key){
    return new Promise(function(resolve,reject) {
      this.getBucket().then((bucket) => {
        let file = bucket.file(key)
        file.exists().then((exists) => {
          //console.log('getLibraryEntry file ' + key + ' exists = ' + exists[0])
          if (exists[0]) {
            //console.log('downloading file ' + key)
            file.get().then((res) => {
              //console.log('storage-read.getLibraryEntry got file info ' + res)
              //console.dir(res)
              let file = res[0]
              //console.dir(file)
              let rv   = JSON.parse(file.toString())
              //console.log('getLibraryEntry returning: ' + rv)
              resolve(rv)
            })
          } else {
            console.log('getLibraryEntry returning undefined for "'+key+'"')
            resolve([])
          }
        })
      })
    }.bind(this))
  },

  getLibraryDirectoryListing: function(key){
    return new Promise(function(resolve,reject) {
      this.getBucket().then((bucket) => {
        const options = {
          prefix: key
        };

        if(this.delimiter){
          options.delimiter = '/'
        }

        bucket.getFiles(options).then((files)=>{
          //console.log('got file listing')
          //console.dir(files[0])
          let f = files[0].filter((e)=>{ return e.name[e.name.length-1] !== '/' })
          //console.log('getLibraryDirectoryListing for path '+key)
          //console.dir(f)
          resolve(f)
        })
      })
    }.bind(this))
  }
};

module.exports = googleStorage;