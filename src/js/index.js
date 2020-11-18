import React from "react";
import ReactDOM from "react-dom";
import App from "./app";
import "../app.css";

function renderReactDom() {
  ReactDOM.render(
    <React.StrictMode>
      <App />
    </React.StrictMode>,
    document.getElementById("react")
  );
}

function checkFs() {
  console.log("checkFs");

  // Read-only directory where the application is installed. (iOS, Android, BlackBerry 10, OSX, windows)
  console.log(cordova.file.applicationDirectory);
  // Root directory of the application's sandbox; on iOS & windows this location is read-only (but specific subdirectories [like /Documents on iOS or /localState on windows] are read-write). All data contained within is private to the app. (iOS, Android, BlackBerry 10, OSX)
  console.log(cordova.file.applicationStorageDirectory);

  // Persistent and private data storage within the application's sandbox using internal memory (on Android, if you need to use external memory, use .externalDataDirectory). On iOS, this directory is not synced with iCloud (use .syncedDataDirectory). (iOS, Android, BlackBerry 10, windows)
  console.log(cordova.file.dataDirectory);
}

function updateFs() {
  window.requestFileSystem(
    LocalFileSystem.PERSISTENT,
    0,
    function (fs) {
      console.log("file system open: " + fs.name);
      fs.root.getFile(
        "hello.json",
        { create: true, exclusive: false },
        function (fileEntry) {
          console.log("fileEntry is file?" + fileEntry.isFile.toString());
          // fileEntry.name == 'someFile.txt'
          // fileEntry.fullPath == '/someFile.txt'
          writeFile(fileEntry, null);
        },
        function onErrorCreateFile() {}
      );
    },
    function onErrorLoadFs() {}
  );
}

function displayFileData(v) {
  console.log(v);
  document.getElementById("debug").innerText = v;
}

function readFile(fileEntry) {
  fileEntry.file(
    function (file) {
      var reader = new FileReader();

      reader.onloadend = function () {
        console.log("Successful file read: " + this.result);
        displayFileData(fileEntry.fullPath + ": " + this.result);
      };

      reader.readAsText(file);
    },
    function onErrorReadFile() {}
  );
}

function writeFile(fileEntry, dataObj) {
  // Create a FileWriter object for our FileEntry (log.txt).
  fileEntry.createWriter(function (fileWriter) {
    fileWriter.onwriteend = function () {
      console.log("Successful file write...");
      readFile(fileEntry);
    };

    fileWriter.onerror = function (e) {
      console.log("Failed file write: " + e.toString());
    };

    // If data object is not passed in,
    // create a new Blob instead.
    if (!dataObj) {
      dataObj = new Blob([JSON.stringify({hello: "world"})], { type: "text/plain" });
    }

    fileWriter.write(dataObj);
  });
}

if (window.cordova) {
  document.addEventListener(
    "deviceready",
    () => {
      // Wait for the deviceready event before using any of Cordova's device APIs.
      // See https://cordova.apache.org/docs/en/latest/cordova/events/events.html#deviceready
      document.addEventListener("deviceready", onDeviceReady, false);

      function onDeviceReady() {
        // Cordova is now initialized. Have fun!

        console.log(
          "Running cordova-" + cordova.platformId + "@" + cordova.version
        );
        document.getElementById("deviceready").classList.add("ready");
        checkFs();
        updateFs();

        window.addEventListener(
          "filePluginIsReady",
          function () {
            console.log("File plugin is ready");
            checkFs();
          },
          false
        );
      }
      renderReactDom();
    },
    false
  );
} else {
  renderReactDom();
}
