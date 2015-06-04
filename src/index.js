import {Dialog} from "./dialog";
export {Dialog} from "./dialog";
export {ElementSelectors} from "./element-selectors";

export function configure(aurelia,cb){
  aurelia.globalizeResources("./dialog");

  if(cb !== undefined && typeof(cb) === 'function') cb(Dialog.defaultConfig);

}
