import {CssAnimator} from 'aaike/animator-css';
import 'gooy/aurelia-markdown';
import 'gooy/aurelia-dialog';
import 'gooy/aurelia-compiler';
import {SmoothScroll} from 'components/smooth-scroll';

//Fix Prism to allow dot character in html attribute names
Prism.languages.markup.tag.pattern = /<\/?[\w:-]+\s*(?:\s+[^=]+(?:=(?:("|')(\\?[\w\W])*?\1|[^\s'">=]+))?\s*)*\/?>/i;

export function configure(aurelia) {

  /*SmoothScroll.getOffset = function(){
    return 20 + document.querySelector(".page-host").offsetTop;
  }*/

  aurelia.use
  .standardConfiguration()
  .developmentLogging()
  .plugin('aaike/animator-css',instance=>{
    instance.useAnimationDoneClasses = true;
  })
  .plugin('gooy/aurelia-markdown')
  //.plugin('aurelia-computed')
  .plugin('gooy/aurelia-dialog',config=>{
    config.view = "gooy/aurelia-dialog/modal-bootstrap.html";
  })
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
  aurelia.globalizeResources("components/smooth-scroll");

  aurelia.start().then(a => a.setRoot());
}
