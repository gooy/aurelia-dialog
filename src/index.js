import {DialogCustomElement} from "./dialog";
export {DialogCustomElement} from "./dialog";
export {ElementSelectors} from "./element-selectors";

import {DialogConfig} from "./config";
export {DialogConfig} from "./config";

export function configure(aurelia,cb){
  aurelia.globalizeResources("./dialog");
  var config = DialogCustomElement.defaultConfig;
  if(cb !== undefined && typeof(cb) === 'function') cb(config);

}
