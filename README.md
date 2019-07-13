# node-red-contrib-storage-google
A node red storage module which uses Google Storage  (loosely based on the AWS S3 storage module)

This module supports automatic reloading of flows.

## Installation

    npm i --save node-red-contrib-storage-google
    
Inside the settings.js file, add a line for storagemodule, like this

    storageModule: require('node-red-contrib-storage-google')

## New properties for settings.js

You must also set the following new settings to be able to make use of the storage module

    googleStorageAppname: 'mycoolapp',
    googleStorageBucket: 'something-12345.appspot.com',
    googleProjectId: 'something-12345',
    googleFirebaseReload: true,         // optional
    googleDbUrl: 'https://something-12345.firebaseio.com',  // optional
    googleCredentials: {
      "type": "service_account",
      "project_id": "something-12345",
      "private_key_id": "x0i822bae71898b6d00bb0011bbzz0a0089a901010111d98",
      "private_key": "-----BEGIN PRIVATE KEY-----\nOP0PLLL....5ThEUz...\n-----END PRIVATE KEY-----\n",
      "client_email": "firebase-adminsdk-abc123y@something-12345.iam.gserviceaccount.com",
      "client_id": "88484848484848484848",
      "auth_uri": "https://accounts.google.com/o/oauth2/auth",
      "token_uri": "https://oauth2.googleapis.com/token",
      "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
      "client_x509_cert_url": "https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk-d1xiy%40something-2e584.iam.gserviceaccount.com"
    }

The plugin works by using a service account certificate for a given google cloud project.
A good way to get is to create a firebase project, and then from the firebase web console download the project service account certificate.

Firebase service accounts already have the proper rights for cloud storage (among other things)

1. Create a Firebase project (or go to one you already have)
2. Go the firebase web console
3. Click the blue cogwheel icon at the top left
4. Go to the 'Service Account' tab
5. Download a new private key. The content of the file is the property 'googleCredenttials' above.

The other google* settings can be found in the very first tab. 

## Usage

Any node-red instance running with the google cloud storage plugin set to a specific configuration will
share settings, flows, library entities, et.c. with all others with the same setup.

This means that a developer can develop locally with the google cloud storage plugin, and be able to have the changes shared to other node-red instances
running in the cloud, perhaps in docker containers, long running or as cloud functions/lambdas.

To also enable live reloading of all instances, you must use a serivce account certificate from firebase and also set
the properties 'googleFirebaseReload' and 'googleDbUrl'.

This will let the plugin register listeners for a specific path in the reactive firebase service, so that they will get a callback whenever 
the flows have changed (been deployed by the developer). Firebase Rtdb support up to 100000 simultaneous connections, which is then the upper limit for cloud instances.

This usage of firebase is well below the free tier so moderate use (100 instance perhaps?) will never cost anything.
 
 
