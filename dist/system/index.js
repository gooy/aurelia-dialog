System.register(["./dialog", "./element-selectors"], function (_export) {
  "use strict";

  var Dialog;

  _export("configure", configure);

  function configure(aurelia, cb) {
    aurelia.globalizeResources("./dialog");

    if (cb !== undefined && typeof cb === "function") cb(Dialog.defaultConfig);
  }

  return {
    setters: [function (_dialog) {
      Dialog = _dialog.Dialog;

      _export("Dialog", _dialog.Dialog);
    }, function (_elementSelectors) {
      _export("ElementSelectors", _elementSelectors.ElementSelectors);
    }],
    execute: function () {}
  };
});
//# sourceMappingURL=index.js.map