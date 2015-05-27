import {bindable} from 'aurelia-framework';

export class Home{

  testtitle = "FooBar";

  transitions = [
    {value:"fade"},
    {value:"fade-right-left"},
    {value:"fade-left-right"},
    {value:"fade-top-bottom"},
    {value:"fade-bottom-top"},
    {value:"fade-zoom-in"},
    {value:"fade-zoom-out"}
  ];

  @bindable selectedTransition = "fade-top-bottom";

  static inject = [Element];
  constructor(element) {
    this.element = element;
  }

  attached(){

  }

  openDialog(name) {

    if(this[name]) {
      this[name].transition = "anim-"+this.selectedTransition;
      this[name].open();
    }
  }

  doSomething(){
    console.log('doing something !');
  }

  doSomethingElse(){
    console.log('doing something else !');
  }

  selectedTransitionChanged(newValue,oldValue){

    //console.log('this.dialog', this.dialog);

    /*var dialogs = this.element.querySelectorAll('dialog');
    for(var i = 0, l = dialogs.length; i < l; i++){
      var obj = dialogs[i].children[0];
      console.log('obj', obj);
      obj.classList.remove("anim-"+oldValue);
      obj.classList.add("anim-"+newValue);
    }*/

  }

}
