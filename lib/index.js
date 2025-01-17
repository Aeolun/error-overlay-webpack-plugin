"use strict";

var _errorOverlayMiddleware = _interopRequireDefault(require("react-dev-utils/errorOverlayMiddleware"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var chunkPathBasic = require.resolve('./entry-basic');

var chunkPathDevServer = require.resolve('./entry-devserver');

var ErrorOverlayPlugin = /*#__PURE__*/function () {
  function ErrorOverlayPlugin() {
    _classCallCheck(this, ErrorOverlayPlugin);
  }

  _createClass(ErrorOverlayPlugin, [{
    key: "apply",
    value: function apply(compiler) {
      var className = this.constructor.name;
      if (compiler.options.mode !== 'development') return;
      var devServerEnabled = !!compiler.options.devServer;
      var sockOptions = {};

      if (devServerEnabled) {
        sockOptions.sockHost = compiler.options.devServer.sockHost;
        sockOptions.sockPath = compiler.options.devServer.sockPath;
        sockOptions.sockPort = compiler.options.devServer.sockPort;
      }

      compiler.hooks.entryOption.tap(className, function (context, entry) {
        adjustEntry(entry, devServerEnabled, sockOptions);
      });
      compiler.hooks.afterResolvers.tap(className, function (_ref) {
        var options = _ref.options;

        if (devServerEnabled) {
          var originalBefore = options.devServer.before;

          options.devServer.onBeforeSetupMiddleware = function (app, server) {
            if (originalBefore) {
              originalBefore(app, server, compiler);
            }

            app.use((0, _errorOverlayMiddleware["default"])());
          };
        }
      });
    }
  }]);

  return ErrorOverlayPlugin;
}();

function adjustEntry(entry, enableDevServer, sockOptions) {
  if (typeof entry === 'string') {
    entry = [entry]; // for anonymous single entry points
  }

  if (Array.isArray(entry)) {
    if (enableDevServer) {
      var sockHost = sockOptions.sockHost ? "&sockHost=".concat(sockOptions.sockHost) : '';
      var sockPath = sockOptions.sockPath ? "&sockPath=".concat(sockOptions.sockPath) : '';
      var sockPort = sockOptions.sockPort ? "&sockPort=".concat(sockOptions.sockPort) : '';
      var chunkPathDevServerWithParams = "".concat(chunkPathDevServer, "?").concat(sockHost).concat(sockPath).concat(sockPort);

      if (!entry.includes(chunkPathDevServerWithParams)) {
        entry.unshift(chunkPathDevServerWithParams);
      }
    }

    if (!entry.includes(chunkPathBasic)) {
      entry.unshift(chunkPathBasic);
    }
  } else {
    Object.keys(entry).forEach(function (entryName) {
      entry[entryName] = adjustEntry(entry[entryName], enableDevServer, sockOptions);
    });
  }

  return entry;
}

module.exports = ErrorOverlayPlugin;