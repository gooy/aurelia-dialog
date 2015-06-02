import {skipContentProcessing,noView, bindable} from 'aurelia-framework';
import {Container,ViewSlot} from 'aurelia-framework';
import {Compiler} from 'gooy/aurelia-compiler';
import {CssAnimator} from "aaike/animator-css";
import {ContentElements} from "gooy/aurelia-dialog/content-elements";

@noView
@skipContentProcessing
export class DialogCustomElement {

  /**
   * Allow view to be set dynamically
   */
  @bindable view;

  contentElements = [];

  isAnimating = false;
  hasTitle = true;

  createBackdrop = true;

  closeOnContainerClick = true;

  transition = null;

  contentElementData;

  static inject = [Element,Compiler,Container,CssAnimator,ContentElements];
  constructor(element,compiler,container,animator,contentElements) {
    this.element = element;
    this.compiler = compiler;
    this.container = container;
    this.animator = animator;
    this.contentElements = contentElements;

    this.contentElementData = this.element.innerHTML;
  }

  bind(executionContext) {
    this.executionContext = executionContext;
  }

  attached(){
    this.contentElements.cloneContentElements(this.element);
  }

  containerClick(e) {
    if(this.closeOnContainerClick) this.close();
  }

  createDialogTemplate(){
    return this.compiler.loadTemplate(this.view).then(entry=>{
      let template = entry.template;

      //replace `this.` with the reference for this viewmodel
      var data = template.content.children[0].outerHTML;
      var viewModelRef = this.element.getAttribute("ref.view-model");
      data = data.replace(/this\./gm,viewModelRef+".");

      //this.templateData = data;
      //apply the template
      this.element.innerHTML = data;

      //console.log('apply the template',data);

      //apply the cloned content elements
      this.contentElements.applyContentElements(this.element);

      //remove unused refs
      for(var key in this.contentElements.unknownRefs){
        if(key==="container"||key==="controls"||key==="dialog") continue;
        var el = this.contentElements.unknownRefs[key];
        if(el) {
          if(key==="title") this.hasTitle = false;
          el.parentNode.removeChild(el);
        }
      }

      //compile the current behavior with the new template
      //this.compiler.processBehavior(this.container);

    });
  }

  templateAttached(){
    this.dialogContainer = this.element.querySelector("[ref-id=container]");
    this.dialog = this.element.querySelector("[ref-id=dialog]");
    this.dialog.classList.add('au-animate');
    this.dialog.classList.add('au-left');

    if(this.dialogContainer) this.dialogContainer.addEventListener("click",this.containerClick.bind(this));
    this.dialog.addEventListener("click",e=>{e.stopPropagation()});
    this.element.dispatchEvent(new Event("done"));
  }

  setTransitionClasses(){
    var i,l,_class, classes;

    if(this.currentTransition) {
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

  open(){
    if(this.backdrop) return;
    if(this.createBackdrop) this._createBackdrop();

    if(this.dialog){
      this._open();
    }else{
      this.createDialogTemplate().then(()=>{
        this._open();
      });
    }
  }

  _open(){

    if(!this.composed){
      this.composed = true;
      this.contentElements.createComposeElements(this.element.querySelectorAll("[ref-id]"), this);

      //compile the current behavior with the new template
      this.compiler.processBehavior(this.container);

      this.templateAttached();
    }

    //this.container.classList.add("in");
    this.dialog.scrollTop = 0;
    this.dialog.classList.add('au-left');
    this.dialogContainer.setAttribute('aria-hidden', false);
    this.dialogContainer.style.display = "block";
    this.element.classList.add("open");

    this.setTransitionClasses();

    return this.enterAnimation().then(()=>{
      this.dialog.focus();
    });
  }

  close(){

    if(this.createBackdrop) this._destroyBackdrop();

    if(!this.dialogContainer) return;
    this.dialogContainer.setAttribute('aria-hidden', true);
    this.dialogContainer.classList.remove("in");

    return this.leaveAnimation().then(()=>{
      this.element.dispatchEvent(new Event("close"));
      this.element.classList.remove("open");
      this.dialogContainer.style.display = "none";

      //destroy composed VMs

      if(this.composed){

        //unbind and detach the viewSlot for this VM
        var viewSlot = this.container.get(ViewSlot);
        viewSlot.unbind();
        viewSlot.detached();

        //destroy the composed elements
        this.contentElements.destroyCompositions(this.element);

        this.composed = false;
      }


    });
  }

  enterAnimation(force) {
    if(this.isAnimating && !force) Promise.resolve();

    this.isAnimating = true;
    return this.animator.enter(this.dialog).then(success=>{
      setTimeout(()=> {
        this.isAnimating = false;
      },100);
    });
  }

  leaveAnimation(force) {
    if(this.isAnimating && !force) Promise.resolve();

    this.isAnimating = true;
    return this.animator.leave(this.dialog).then(success=>{
      setTimeout(()=> {
        this.isAnimating = false;
      },100);
    });
  }

  _createBackdrop() {
    if(this.backdrop) return;

    this.backdrop = document.createElement("div");
    this.backdrop.className = "modal-backdrop fade";

    document.body.appendChild(this.backdrop);

    setTimeout(()=>{
      this.backdrop.classList.add("in");
    });
  }

  _destroyBackdrop() {
    if(!this.backdrop) return;
    this.backdrop.classList.remove("in");

    setTimeout(()=>{
      if(this.backdrop) this.backdrop.parentNode.removeChild(this.backdrop);
      this.backdrop = null;
    },400);

  }

}

