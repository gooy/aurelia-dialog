import {bindable} from 'aurelia-framework';
import {CssAnimator} from "aaike/animator-css";

export class Home{

  static inject = [CssAnimator];
  constructor(animator) {
    this.animator = animator;
  }


}
