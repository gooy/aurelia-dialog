import {skipContentProcessing,noView, bindable} from 'aurelia-framework';
import {Container,ViewSlot} from 'aurelia-framework';
import {Compiler} from 'gooy/aurelia-compiler';
import {CssAnimator} from "aaike/animator-css";

@noView
@skipContentProcessing
export class DialogCustomElement {

  @bindable view;

  contentElements = [];

  isAnimating = false;
  hasTitle = true;

  createBackdrop = true;

  closeOnContainerClick = true;

  transition = null;

  static inject = [Element,Compiler,Container,CssAnimator];
  constructor(element,compiler,container,animator) {
    this.element = element;
    this.compiler = compiler;
    this.container = container;
    this.animator = animator;
  }

  bind(executionContext) {
    this.executionContext = executionContext;
  }

  copyContentAndAttributes(node,target){
    if(!node) return;
    if(!target) return;

    for(var i = 0, l = node.attributes.length; i < l; i++){
      var attr = node.attributes[i];
      target.setAttribute(attr.nodeName,attr.nodeValue);
    }
    target.textContent = node.textContent;
    target.innerHTML = node.innerHTML;
  }

  cloneContentElements(el){
    for(var i = 0, l = el.children.length; i < l; i++){
      var child = el.children[i];
      var clone = child.cloneNode(true);

      if(clone) this.contentElements.push(clone);
      //this.title = this.element.querySelector(":scope > dialog-title").cloneNode(true) ;
    }
  }

  applyContentElements(){
    let i,l, promise;

    var refNodes = this.element.querySelectorAll(`[ref-id]`);
    var refs = [];

    for(i = 0, l = refNodes.length; i < l; i++){
      refs.push(refNodes[i].getAttribute("ref-id"));
    }

    var unusedRefs = [].concat(refs);
    var usedRefs = [];

    for(i = 0, l = this.contentElements.length; i < l; i++){
      var el = this.contentElements[i];
      let refName = camelize(el.nodeName.toLowerCase());
      let refNode = this.element.querySelector(`[ref-id=${refName}]`);

      usedRefs.push(refName);

      let vm = el.getAttribute("view-model");
      let view = el.getAttribute("view");

      if(vm){
        promise = this.compiler.loadVM(vm).then(viewModel=>{
          console.log('viewModel',viewModel);

          //return null;

          //var container = new Container();
          //var viewSlot = new ViewSlot(refNode,true);
          this.behaviorInstance = viewModel.metadata.create(this.container,{},refNode);

          console.log('refNode', refNode);
          console.log('behaviorInstance', this.behaviorInstance);
          return;

          viewSlot.bind(this.behaviorInstance.executionContext);

          setTimeout(()=>{
            this.behaviorInstance.view.attached();
            viewSlot.attached();
            this.behaviorInstance.bind(this.behaviorInstance.executionContext);
            this.behaviorInstance.attached();
          });

          console.log('behaviorInstance', this.behaviorInstance);

          //this.behaviorInstance.view.attached();

          /*var view = viewModel.metadata.viewFactory.create(,viewModel.value());

          for(var i = 0, l = view.fragment.children.length; i < l; i++){
            var child = view.fragment.children[i];

            if(child && child instanceof Node) {
              refNode.appendChild(child);
              i--;
            }
          }*/
        });
      }else if(view){
        promise = this.compiler.loadTemplate(view,refNode).then((result)=> {
          let {template,refNode:data} = result;

          refNode.innerHTML = "";
          for(var i = 0, l = template.content.children.length; i < l; i++){
            var child = template.content.children[i];

            if(child && child instanceof Node) {
              refNode.appendChild(child);
              i--;
            }
          }
          //var data = [0].outerHTML;
          //refNode.innerHTML = data;
        });

      }else{
        this.copyContentAndAttributes(el, refNode);

      }
    }

    for(i = 0, l = usedRefs.length; i < l; i++){
      var ref = usedRefs[i];
      var p = unusedRefs.indexOf(ref);
      unusedRefs.splice(p,1);
    }

    //remove unused dialog refs
    for(i = 0, l = unusedRefs.length; i < l; i++){
      var r = unusedRefs[i];
      if(r==="container"||r==="controls"||r==="dialog") continue;
      var refNode = this.element.querySelector(`[ref-id=${r}]`);
      if(refNode) {
        if(r==="title") this.hasTitle = false;
        refNode.parentNode.removeChild(refNode);
      }
    }

    return promise||Promise.resolve();

  }

  attached(){

    this.cloneContentElements(this.element);

    //this.oarticle = this.element.querySelector(":scope > article");
    //this.ofooter = this.element.querySelector(":scope > footer");

    //this.element.innerHTML = "";
    //this.compiler.composeBehavior(this.container,{view:this.view},this.executionContext).then(this.viewAttached.bind(this));

    //this.compiler.composeElement(this.element,this,{view:this.view}).then(this.viewAttached.bind(this));

    this.compiler.loadTemplate(this.view).then(result=>{
      let template = result.template;
      //replace this with the reference for this viewmodel
      var data = template.content.children[0].outerHTML;
      /*
      var re = /(.*)?(\${)(.*)?(this\.)?(.*)?(\})(.*)?/gm;

      var newData = "";

      //var lines = data.split("\n");
      //for(var i = 0, l = lines.length; i < l; i++){
        //var line = lines[i];
       // console.log('line', line);
        var m;
        while((m = re.exec(data)) !== null){
          if(m.index === re.lastIndex){
            re.lastIndex++;
          }
          for(var i2 = 0, l2 = m.length; i2 < l2; i2++){
            var p = m[i2];
            newData += p m[1] + m[2] + m[3] + viewModelRef + "." + m[5] + m[6] + m[7] + "\n";
          }

        }
      //}*/

      var viewModelRef = this.element.getAttribute("ref.view-model");

      data = data.replace(/this\./gm,viewModelRef+".");

      //data.replace(re,);

      //apply the template
      this.element.innerHTML = data;

      //apply the cloned content elements
      this.applyContentElements().then(()=>{
        console.log('contents applied');
        //compile the current behavior with the new template
        this.compiler.processBehavior(this.container);
        this.viewAttached();
      });

    });

    /*this.compiler.loadText(this.view).then(data=>{
      var template = document.createElement("template");

      this.element.innerHTML = data;

      var fragment = document.createDocumentFragment();
      fragment.appendChild(data);

      template.content.innerHTML = fragment.innerHTML;

      console.log('template.content', template.content);
      console.log('template.content.innerHTML', template.content.innerHTML);
    });*/

    /*this.compiler.loadViewFactory(this.view).then(viewFactory=>{
      console.log('viewFactory', viewFactory);

      for(var i = 0, l = viewFactory.instructions.length; i < l; i++){
        var instruction = viewFactory.instructions[i];

        if(instruction.contentExpression){

          for(var i2 = 0, l2 = instruction.contentExpression.parts.length; i2 < l; i2++){
            var part = instruction.contentExpression.parts[i2];
            console.log('part', part);
            if(part instanceof AccessScope){
              console.log('partSDS', part);
              if(part.name=="title") part.name == "testtitle";
            }
          }
        }
      }

      this.element.innerHTML = "";
      this.compiler.composeViewFactory(this.container,this.executionContext,viewFactory);
      this.viewAttached();
      //this.element.innerHTML = viewFactory.template.content.children[0].outerHTML;
    });*/

  }

  viewAttached(){
    this.container = this.element.querySelector("[ref-id=container]");
    this.dialog = this.element.querySelector("[ref-id=dialog]");
    this.dialog.classList.add('au-out');
    this.dialog.classList.add('au-animate');
    //if(this.transition) this.dialog.classList.add('anim-'+this.transition);

    if(this.container) {
      this.container.addEventListener("click",this.containerClick.bind(this));
    }


    this.dialog.addEventListener("click",e=>{e.stopPropagation()});

    this.element.dispatchEvent(new Event("done"));

    /*var defaultBtnClose = this.element.querySelector(`[ref-id=dialogCloseButton]`);
    if(defaultBtnClose){
      console.log('close',defaultBtnClose);
      defaultBtnClose.addEventListener("click",()=>{
        this.dialog = this.element.children[0];
        this.close();
      });
    }*/
  }

  containerClick(e) {
    if(this.closeOnContainerClick) this.close();
  }

  open(){
    if(this.backdrop) return;
    if(this.createBackdrop) this._createBackdrop();

    if(this.currentTransition) this.dialog.classList.remove(this.currentTransition);
    this.dialog.classList.add(this.transition);
    this.currentTransition = this.transition;
    this.container.setAttribute('aria-hidden', false);
    this.container.style.display = "block";
    //this.container.classList.add("in");
    this.dialog.scrollTop = 0;

    return this.enterAnimation().then(()=>{
      this.dialog.focus();
    });
  }

  close(){

    if(this.createBackdrop) this._destroyBackdrop();

    if(!this.container) return;
    this.container.setAttribute('aria-hidden', true);
    this.container.classList.remove("in");

    return this.leaveAnimation().then(()=>{
      this.element.dispatchEvent(new Event("close"));
      this.container.style.display = "none";
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

function camelize(str){
  return str.trim().replace(/[-_\s]+(.)?/g, (match, c)=>{
    return c ? c.toUpperCase() : "";
  });
}
