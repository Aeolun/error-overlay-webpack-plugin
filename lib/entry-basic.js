"use strict";

var _reactErrorOverlay = require("react-error-overlay");

var _launchEditorEndpoint = _interopRequireDefault(require("react-dev-utils/launchEditorEndpoint"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

/* eslint-disable */
(0, _reactErrorOverlay.setEditorHandler)(function (errorLocation) {
  // Keep this sync with errorOverlayMiddleware.js
  fetch(_launchEditorEndpoint["default"] + '?fileName=' + window.encodeURIComponent(errorLocation.fileName) + '&lineNumber=' + window.encodeURIComponent(errorLocation.lineNumber || 1) + '&colNumber=' + window.encodeURIComponent(errorLocation.colNumber || 1));
});
(0, _reactErrorOverlay.startReportingRuntimeErrors)({
  onError: function onError() {
    if (module.hot) {
      module.hot.addStatusHandler(function (status) {
        if (status === 'apply') {
          window.location.reload();
        }
      });
    }
  }
});