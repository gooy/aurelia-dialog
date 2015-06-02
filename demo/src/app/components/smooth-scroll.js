import {bindable,noView,customAttribute} from 'aurelia-framework';
import Velocity from 'velocity';

@customAttribute("smooth-scroll")
@noView
export class SmoothScroll{

  @bindable duration = 400;
  @bindable easing = "ease-in";

  subs = [];

  static inject = [Element];
  constructor(element) {
    this.element = element;
  }

  attached(){
    var sub = this.onClick.bind(this);
    this.subs.push();
    this.element.addEventListener("click",sub);
  }

  detached(){
    if(this.subs) for(let sub of this.subs) sub();
  }

  onClick(event){
    event.preventDefault();
    SmoothScroll.scrollTo(this.element.getAttribute("href"));
    return false;
  }

  static getOffset(){
    return - 20 - document.querySelector(".page-host").offsetTop;
  }

  static scrollTo(elementOrHash,options={}){

    var target = elementOrHash;
    //find target by id or name
    if(typeof elementOrHash === "string"){
      var hash = elementOrHash;
      if(hash.indexOf("#")===0) hash = hash.slice(1,hash.length);
      target = document.querySelector(`[id="${hash}"`);
      if(!target) document.querySelector(`[name="${hash}"`);
    }

    // manually specify the height of the navbar
    var t = document.body.scrollTop;
    window.location.hash = hash;
    document.body.scrollTop = t;

    return new Promise((resolve) => {
      Velocity(target,"scroll", Object.assign({ duration: this.duration, offset:SmoothScroll.getOffset(),easing:this.easing, complete:resolve},options));
    });

  }

}

