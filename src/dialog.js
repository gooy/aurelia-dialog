import {skipContentProcessing,customElement,noView, bindable} from 'aurelia-framework';
import {Container,ViewSlot} from 'aurelia-framework';
import {Compiler} from 'gooy/aurelia-compiler';
import {CssAnimator} from "aaike/animator-css";
import {ElementSelectors} from "./element-selectors";
import {DialogConfig} from './config';

//import $ from 'zepto';

@customElement('dialog')
@noView
@skipContentProcessing
export class DialogCustomElement {

  /**
   * Allow view to be set dynamically
   */
  @bindable view;

  isAnimating = false;
  hasTitle = true;

  createBackdrop = true;
  elementSelectors = null;

  closeOnContainerClick = true;

  transition = null;

  contentElementData;

  static defaultConfig = new DialogConfig();

  static inject = [Element,Compiler, Container, CssAnimator, ElementSelectors];

  constructor(element, compiler, container, animator, elementSelectors) {
    this.element = element;
    //this.config = config;
    this.compiler = compiler;
    this.container = container;
    this.animator = animator;
    this.elementSelectors = elementSelectors;
    this.elementSelectors.init(this.container);

    return new Promise((resolve, reject) => {

    });

    this.config = Object.assign({},DialogCustomElement.defaultConfig);
  }

  bind(executionContext) {
    this.executionContext = executionContext;

    this.view = this.view||this.config.view;

    if(!this.view) throw new Error("no view has been speified for the dialog");
  }

  containerClick(e) {
    if(this.closeOnContainerClick) this.close();
  }

  setTransitionClasses() {
    var i, l, _class, classes;

    if(this.currentTransition){
      classes = this.currentTransition;
      for(i = 0, l = classes.length; i < l; i++){
        _class = classes[i];
        this.dialog.classList.remove(_class);
      }
    }

    classes = this.transition;
    if(typeof this.transition === "string"){
      classes = this.transition.split(" ");
    }
    for(i = 0, l = classes.length; i < l; i++){
      _class = classes[i];
      this.dialog.classList.add(_class);
    }
    this.currentTransition = classes;
  }

  open() {
    if(this.backdrop) return;
    if(this.createBackdrop) this._createBackdrop();

    if(this.dialog){
      this._open();
    }else{

      //swap this. with view-model references
      var transformer = function(element,data){
        //replace `this.` with the reference for this viewmodel
        var viewModelRef = element.getAttribute("ref.view-model");
        if(viewModelRef) data = data.replace(/self\./gm, viewModelRef + ".");
        return data;
      };


      return this.compiler.swapView(this.container, this.view,transformer).then(behavior=> {
        this.elementSelectors.applySelectors();

        //remove unused element selector targets
        for(var i = 0, l = this.elementSelectors.unknownTargets.length; i < l; i++){
          var target = this.elementSelectors.unknownTargets[i];
          var selector = target.getAttribute("select");
          if(selector === "container" || selector === "controls" || selector === "dialog") continue;
          if(target){
            if(selector === "title") this.hasTitle = false;
            target.parentNode.removeChild(target);
          }
        }

        this._open();
      });
    }
  }

  _open() {

    this.elementSelectors.createCompositions();

    //compile the current behavior with the new template
    var behavior = this.compiler.processBehavior(this.container,this.executionContext);

    this.dialogContainer = this.element.querySelector("[select=container]");
    this.dialog = this.element.querySelector("[select=dialog]");


    if(this.dialogContainer) this.dialogContainer.addEventListener("click", this.containerClick.bind(this));
    this.dialog.addEventListener("click", e=> {e.stopPropagation()});
    this.element.dispatchEvent(new Event("done"));

    //this.container.classList.add("in");
    this.dialog.scrollTop = 0;

    this.dialogContainer.setAttribute('aria-hidden', false);
    this.dialogContainer.classList.add("in");

    this.element.classList.add("open");

    /*if(){
      this.dialog.classList.add('au-animate');
      this.dialog.classList.add('au-left');
    }*/

    this.setTransitionClasses();

    return this.enterAnimation().then(()=> {
      this.dialog.focus();
    });
  }

  close() {

    if(this.createBackdrop) this._destroyBackdrop();

    if(!this.dialogContainer) return;
    this.dialogContainer.setAttribute('aria-hidden', true);
    this.dialogContainer.classList.remove("in");

    return this.leaveAnimation().then(()=> {
      this.element.dispatchEvent(new Event("close"));
      this.element.classList.remove("open");

      //unbind and detach the viewSlot for this VM
      var viewSlot = this.container.get(ViewSlot);
      viewSlot.unbind();
      viewSlot.detached();

      //destroy the composed elements
      this.elementSelectors.destroyCompositions();

    });
  }

  enterAnimation(force) {
    if(this.isAnimating && !force) Promise.resolve();

    this.isAnimating = true;
    return this.animator.enter(this.dialog).then(success=> {
      setTimeout(()=> {
        this.isAnimating = false;
      }, 100);
    });
  }

  leaveAnimation(force) {
    if(this.isAnimating && !force) Promise.resolve();

    this.isAnimating = true;
    return this.animator.leave(this.dialog).then(success=> {
      setTimeout(()=> {
        this.isAnimating = false;
      }, 100);
    });
  }

  _createBackdrop() {
    if(this.backdrop) return;

    this.backdrop = document.createElement("div");
    this.backdrop.className = "modal-backdrop fade";

    document.body.appendChild(this.backdrop);

    setTimeout(()=> {
      this.backdrop.classList.add("in");
    });
  }

  _destroyBackdrop() {
    if(!this.backdrop) return;
    this.backdrop.classList.remove("in");

    setTimeout(()=> {
      if(this.backdrop) this.backdrop.parentNode.removeChild(this.backdrop);
      this.backdrop = null;
    }, 400);

  }

}

