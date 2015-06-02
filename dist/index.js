System.register(["./dialog", "./config", "./element-selectors"], function (_export) {
  "use strict";

  var DialogCustomElement, DialogConfig;

  _export("configure", configure);

  function configure(aurelia, cb) {
    aurelia.globalizeResources("./dialog");
    var config = DialogCustomElement.defaultConfig;
    if (cb !== undefined && typeof cb === "function") cb(config);
  }

  return {
    setters: [function (_dialog) {
      DialogCustomElement = _dialog.DialogCustomElement;

      _export("DialogCustomElement", _dialog.DialogCustomElement);
    }, function (_config) {
      DialogConfig = _config.DialogConfig;

      _export("DialogConfig", _config.DialogConfig);
    }, function (_elementSelectors) {
      _export("ElementSelectors", _elementSelectors.ElementSelectors);
    }],
    execute: function () {}
  };
});
//# sourceMappingURL=index.js.map