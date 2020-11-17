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
      }
      renderReactDom();
    },
    false
  );
} else {
  renderReactDom();
}
