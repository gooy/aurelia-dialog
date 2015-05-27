import {bindable} from 'aurelia-framework';
import {CssAnimator} from "aaike/animator-css";

export class Home{

  testtitle = "FooBar";
  title = "Foo";

  transitions = [
    {value:"fade"},
    {value:"fade-right-left"},
    {value:"fade-left-right"},
    {value:"fade-top-bottom"},
    {value:"fade-bottom-top"},
    {value:"fade-zoom-in"},
    {value:"fade-zoom-out"}
  ];

  events = [
    {label:"Bounce",value:"bounce"},
    {label:"Spin",value:"spin"},
    {label:"Spin Counter clockwise",value:"spinC"}
  ];

  behaviors = [
    {label:"Spin",value:"spin"},
    {label:"Spin Counter clockwise",value:"spinC"},
    {label:"Pulsate",value:"pulsate"}
  ];

  @bindable selectedTransition = "fade";

  isAnimating = false;

  static inject = [CssAnimator];
  constructor(animator) {
    this.animator = animator;
  }

  attached(){
    this.selectedTransitionChanged(this.selectedTransition);
  }

  enterAnimation(force) {
    if(this.isAnimating && !force) Promise.resolve();

    this.isAnimating = true;
    return this.animator.enter(this.bla).then(success=>{
      setTimeout(()=> {
        this.isAnimating = false;
      },100);
    });
  }

  leaveAnimation(force) {
    if(this.isAnimating && !force) Promise.resolve();

    this.isAnimating = true;
    return this.animator.leave(this.bla).then(success=>{
      setTimeout(()=> {
        this.isAnimating = false;
      },100);
    });
  }

  nextAnimation(force) {
    if(this.isAnimating && !force) Promise.resolve();

    this.isAnimating = true;
    if(this.bla.classList.contains("au-in")){
      return new Promise((resolve) => {
        this.animator.leave(this.bla).then(success=> {
          //this.bla.classList.remove('au-out');
          setTimeout(()=> {
            this.animator.enter(this.bla).then(success=> {

              setTimeout(()=> {
                this.isAnimating = false;
                resolve(true);
              }, 100);
            });
          }, 100);
        });
      });

    }else{
      return this.enterAnimation().then(()=>{
        setTimeout(()=> {
          this.isAnimating = false;
        },100);
      });
    }
  }

  triggerEvent(e,name){
    this._triggerEvent(this.bla,name);
  }

  toggleBehavior(e,name){
    this._toggleBehavior(this.bla,name);

    if(this.bla.classList.contains("anim-"+name)){
      e.currentTarget.classList.add("active");
    }else{
      e.currentTarget.classList.remove("active");
    }
  }


  _triggerEvent(el,name){
    this.animator.addClass(el,"anim-"+name).then(()=>{
      el.classList.remove("anim-"+name);
      setTimeout(()=> {
        el.classList.remove("anim-"+name);
      },100);
    });
  }

  _toggleBehavior(el,name){
    if(el.classList.contains("anim-"+name)){
      el.classList.remove("anim-"+name);

    }else{
      el.classList.add("anim-"+name);
    }
  }

  selectedTransitionChanged(newValue,oldValue){
    this.bla.classList.remove("anim-"+oldValue);
    this.bla.classList.add("anim-"+newValue);
  }

}
