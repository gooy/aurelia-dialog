
export function configure(aurelia) {

  aurelia.use
  .standardConfiguration()
  .developmentLogging()
  .plugin('aaike/animator-css')
  .plugin('gooy/aurelia-markdown')
  //.plugin('aurelia-computed')
  .plugin('gooy/aurelia-dialog')
  /*.plugin('aurelia-dialogs',instance=>{
      instance.setup({
        template: ""
      });
    })*/

  /*.plugin('aurelia-validation', instance=>{
      instance
      //.useLocale('nl-NL')
      .useViewStrategy(ValidateCustomAttributeViewStrategy.TWBootstrapAppendTo);
    })
  */
  ;

  //aurelia.globalizeResources("dist:index");
  //aurelia.globalizeResources("converters/json");

  aurelia.start().then(a => a.setRoot());
}
