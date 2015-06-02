import {Container,ViewSlot,transient} from 'aurelia-framework';
import {Compiler} from 'gooy/aurelia-compiler';

/**
 * Element Selectors allows a similar functionality like content selectors
 * expect there are no `content` tags used.
 * instead the `select` attribute can be used on any tag and it will be filled with the
 * contents and attributes of the element found in the orginal content.
 */
@transient()
export class ElementSelectors{

  /**
   * Used to associate this instance with a certain element
   * @param container
   */
  init(container) {
    this.container = container;
    this.element = container.get(Element);
    this.compiler = container.get(Compiler);
  }

  /**
   * Apply element selectors
   * this requires the behavior to have an originalFragment property from which the source elements will be extracted
   */
  applySelectors(){
    let i,l, promise;

    var behavior = this.element.primaryBehavior;
    var fragment = behavior.originalFragment;

    if(!fragment) throw new Error("no originalFragment found for",this.element);

    var targets = this.element.querySelectorAll(`[select]`);
    this.unknownTargets = [].slice.call(targets);

    for(i = 0, l = targets.length; i < l; i++){
      var target = targets[i];
      var selector = target.getAttribute("select");

      //get the first matching element
      var source = fragment.querySelector(selector);

      if(!source) continue;

      //apply to target
      this.copyContentAndAttributes(source, target);

      //remove from unknown targets
      this.unknownTargets = this.unknownTargets.filter(el=>el!==target);
    }
  }

  /**
   * Create a compose for elements that have a `view` or `view-model` property
   */
  createCompositions(){
    var elements = this.element.querySelectorAll("[select]");
    //create compose elements if view-model or view is defined in one of the content elements
    for(var i = 0, l = elements.length; i < l; i++){
      var el = elements[i];

      let vm = el.getAttribute("view-model");
      let view = el.getAttribute("view");

      if(vm || view){
        var compose = document.createElement("compose");
        if(vm) compose.setAttribute("view-model",vm);
        if(view) compose.setAttribute("view",view);
        el.appendChild(compose);

        //this.compiler.compile(compose);
      }
    }
  }

  /**
   * Remove all compose elements
   *
   * @param remove    if true the compose tag itself will be removed otherwise it will just be emptied
   */
  destroyCompositions(remove=true){
    var compositions = this.element.querySelectorAll("compose");
    for(var i = 0, l = compositions.length; i < l; i++){
      var compose = compositions[i];
      compose.innerHTML = "";
      if(remove) compose.parentNode.removeChild(compose);
    }
  }

  /**
   * Copies the contents and all attributes from one node to another
   *
   * @param source      source node
   * @param target    target node
   */
  copyContentAndAttributes(source,target){
    for(var i = 0, l = source.attributes.length; i < l; i++){
      var attr = source.attributes[i];
      if(attr==="select") continue;
      target.setAttribute(attr.nodeName,attr.nodeValue);
    }
    target.textContent = source.textContent;
    target.innerHTML = source.innerHTML;
  }
}
