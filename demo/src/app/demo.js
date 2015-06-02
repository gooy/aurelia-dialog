import {bindable} from 'aurelia-framework';
import {SmoothScroll} from 'components/smooth-scroll';

export class Demo{

  testtitle = "FooBar";

  transitions = [
    {value:"fade"},
    {value:"left"},
    {value:"right"},
    {value:"top"},
    {value:"bottom"},
    {value:"zoom-in"},
    {value:"zoom-out"}
  ];

  @bindable selectedEnterAnimation = "zoom-in";
  @bindable selectedLeaveAnimation = "zoom-in";

  static inject = [Element];
  constructor(element) {
    this.element = element;
  }

  attached(){
    //this.selectedEnterAnimationChanged(this.selectedEnterAnimation);
    //this.selectedLeaveAnimationChanged(this.selectedLeaveAnimation);

    setTimeout(()=>SmoothScroll.scrollTo(window.location.hash),500);
  }

  openDialog(name) {

    if(this[name]) {
      this[name].transition = "anim-"+this.selectedEnterAnimation + " anim-leave-"+this.selectedLeaveAnimation;
      this[name].open();
    }
  }

  doSomething(){
    alert('doing something !');
  }

  doSomethingElse(){
    alert('doing something else !');
  }

  /*selectedEnterAnimationChanged(newValue,oldValue){
    var dialogs = this.element.querySelectorAll('dialog');
    for(var i = 0, l = dialogs.length; i < l; i++){
      var obj = dialogs[i].children[0];
      console.log('obj', obj);
      obj.classList.remove("anim-"+oldValue);
      obj.classList.add("anim-"+newValue);
    }
  }

  selectedLeaveAnimationChanged(newValue,oldValue){
    var dialogs = this.element.querySelectorAll('dialog');
    for(var i = 0, l = dialogs.length; i < l; i++){
      var obj = dialogs[i].children[0];
      console.log('obj', obj);
      obj.classList.remove("anim-leave-"+oldValue);
      obj.classList.add("anim-leave-"+newValue);
    }
  }*/

}
