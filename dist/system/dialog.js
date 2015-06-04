System.register(['aurelia-framework', 'gooy/aurelia-compiler', 'gooy/aurelia-animator-velocity', './element-selectors'], function (_export) {
  'use strict';

  var skipContentProcessing, customElement, noView, bindable, Container, ViewSlot, Compiler, VelocityAnimator, ElementSelectors, Dialog;

  var _createDecoratedClass = (function () { function defineProperties(target, descriptors, initializers) { for (var i = 0; i < descriptors.length; i++) { var descriptor = descriptors[i]; var decorators = descriptor.decorators; var key = descriptor.key; delete descriptor.key; delete descriptor.decorators; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor || descriptor.initializer) descriptor.writable = true; if (decorators) { for (var f = 0; f < decorators.length; f++) { var decorator = decorators[f]; if (typeof decorator === 'function') { descriptor = decorator(target, key, descriptor) || descriptor; } else { throw new TypeError('The decorator for method ' + descriptor.key + ' is of the invalid type ' + typeof decorator); } } if (descriptor.initializer !== undefined) { initializers[key] = descriptor; continue; } } Object.defineProperty(target, key, descriptor); } } return function (Constructor, protoProps, staticProps, protoInitializers, staticInitializers) { if (protoProps) defineProperties(Constructor.prototype, protoProps, protoInitializers); if (staticProps) defineProperties(Constructor, staticProps, staticInitializers); return Constructor; }; })();

  function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

  function _defineDecoratedPropertyDescriptor(target, key, descriptors) { var _descriptor = descriptors[key]; if (!_descriptor) return; var descriptor = {}; for (var _key in _descriptor) descriptor[_key] = _descriptor[_key]; descriptor.value = descriptor.initializer.call(target); Object.defineProperty(target, key, descriptor); }

  return {
    setters: [function (_aureliaFramework) {
      skipContentProcessing = _aureliaFramework.skipContentProcessing;
      customElement = _aureliaFramework.customElement;
      noView = _aureliaFramework.noView;
      bindable = _aureliaFramework.bindable;
      Container = _aureliaFramework.Container;
      ViewSlot = _aureliaFramework.ViewSlot;
    }, function (_gooyAureliaCompiler) {
      Compiler = _gooyAureliaCompiler.Compiler;
    }, function (_gooyAureliaAnimatorVelocity) {
      VelocityAnimator = _gooyAureliaAnimatorVelocity.VelocityAnimator;
    }, function (_elementSelectors) {
      ElementSelectors = _elementSelectors.ElementSelectors;
    }],
    execute: function () {
      Dialog = (function () {
        var _instanceInitializers = {};

        function Dialog(element, compiler, container, animator, elementSelectors) {
          _classCallCheck(this, _Dialog);

          this.__initializeProperties();

          this.element = element;

          this.compiler = compiler;
          this.container = container;
          this.animator = animator;
          this.elementSelectors = elementSelectors;
          this.elementSelectors.init(this.container);

          this.config = Object.assign({}, Dialog.defaultConfig);
        }

        var _Dialog = Dialog;

        _createDecoratedClass(_Dialog, [{
          key: 'view',
          decorators: [bindable],
          initializer: null,
          enumerable: true
        }, {
          key: 'bind',
          value: function bind(executionContext) {
            this.executionContext = executionContext;

            this.view = this.view || this.config.view;
            if (!this.view) throw new Error('no view has been speified for the dialog');
          }
        }, {
          key: 'containerClick',
          value: function containerClick(e) {
            if (this.closeOnContainerClick) this.close();
          }
        }, {
          key: 'setTransitionClasses',
          value: function setTransitionClasses() {
            if (!this.transition) return;
            var i, l, _class, classes;

            if (this.currentTransition) {
              classes = this.currentTransition;
              for (i = 0, l = classes.length; i < l; i++) {
                _class = classes[i];
                this.dialog.classList.remove(_class);
              }
            }

            classes = this.transition;
            if (typeof this.transition === 'string') {
              classes = this.transition.split(' ');
            }
            for (i = 0, l = classes.length; i < l; i++) {
              _class = classes[i];
              this.dialog.classList.add(_class);
            }
            this.currentTransition = classes;
          }
        }, {
          key: 'open',
          value: function open() {
            var _this = this;

            if (this.backdrop) return;
            if (this.createBackdrop) this._createBackdrop();

            if (this.dialog) {
              this._open();
            } else {
              var transformer = function transformer(element, data) {
                var viewModelRef = element.getAttribute('ref.view-model');
                if (viewModelRef) data = data.replace(/self\./gm, viewModelRef + '.');
                return data;
              };

              return this.compiler.swapView(this.container, this.view, transformer).then(function (behavior) {
                _this.elementSelectors.applySelectors();

                for (var i = 0, l = _this.elementSelectors.unknownTargets.length; i < l; i++) {
                  var target = _this.elementSelectors.unknownTargets[i];
                  var selector = target.getAttribute('select');
                  if (selector === 'container' || selector === 'controls' || selector === 'dialog') continue;
                  if (target) {
                    if (selector === 'title') _this.hasTitle = false;
                    target.parentNode.removeChild(target);
                  }
                }

                _this._open();
              });
            }
          }
        }, {
          key: '_open',
          value: function _open() {
            var _this2 = this;

            this.elementSelectors.createCompositions();

            var behavior = this.compiler.processBehavior(this.container, this.executionContext);

            this.dialogContainer = this.element.querySelector('[select=container]');
            this.dialog = this.element.querySelector('[select=dialog]');

            if (this.dialogContainer) this.dialogContainer.addEventListener('click', this.containerClick.bind(this));
            this.dialog.addEventListener('click', function (e) {
              e.stopPropagation();
            });
            this.element.dispatchEvent(new Event('done'));

            this.dialog.scrollTop = 0;

            this.dialogContainer.setAttribute('aria-hidden', false);
            this.dialogContainer.classList.add('in');

            this.element.classList.add('open');

            this.setTransitionClasses();

            return this.enterAnimation().then(function () {
              _this2.dialog.focus();
            });
          }
        }, {
          key: 'close',
          value: function close() {
            var _this3 = this;

            if (this.createBackdrop) this._destroyBackdrop();

            if (!this.dialogContainer) return;
            this.dialogContainer.setAttribute('aria-hidden', true);
            this.dialogContainer.classList.remove('in');

            return this.leaveAnimation().then(function () {
              _this3.element.dispatchEvent(new Event('close'));
              _this3.element.classList.remove('open');

              var viewSlot = _this3.container.get(ViewSlot);
              viewSlot.unbind();
              viewSlot.detached();

              _this3.elementSelectors.destroyCompositions();
            });
          }
        }, {
          key: 'enterAnimation',
          value: function enterAnimation(force) {
            var _this4 = this;

            if (this.isAnimating && !force) Promise.resolve();

            this.isAnimating = true;
            return this.animator.enter(this.dialog).then(function (success) {
              setTimeout(function () {
                _this4.isAnimating = false;
              }, 100);
            });
          }
        }, {
          key: 'leaveAnimation',
          value: function leaveAnimation(force) {
            var _this5 = this;

            if (this.isAnimating && !force) Promise.resolve();

            this.isAnimating = true;
            return this.animator.leave(this.dialog).then(function (success) {
              setTimeout(function () {
                _this5.isAnimating = false;
              }, 100);
            });
          }
        }, {
          key: '_createBackdrop',
          value: function _createBackdrop() {
            var _this6 = this;

            if (this.backdrop) return;

            this.backdrop = document.createElement('div');
            this.backdrop.className = 'modal-backdrop fade';

            document.body.appendChild(this.backdrop);

            setTimeout(function () {
              _this6.backdrop.classList.add('in');
            });
          }
        }, {
          key: '_destroyBackdrop',
          value: function _destroyBackdrop() {
            var _this7 = this;

            if (!this.backdrop) return;
            this.backdrop.classList.remove('in');

            setTimeout(function () {
              if (_this7.backdrop) _this7.backdrop.parentNode.removeChild(_this7.backdrop);
              _this7.backdrop = null;
            }, 400);
          }
        }, {
          key: '__initializeProperties',
          value: function __initializeProperties() {
            _defineDecoratedPropertyDescriptor(this, 'view', _instanceInitializers);

            this.isAnimating = false;
            this.hasTitle = true;
            this.createBackdrop = true;
            this.elementSelectors = null;
            this.closeOnContainerClick = true;
            this.transition = null;
          }
        }], [{
          key: 'defaultConfig',
          value: {
            view: 'gooy/aurelia-dialog/modal-bootstrap.html',
            animations: 'zoom-in leave-zoom-in'
          },
          enumerable: true
        }, {
          key: 'inject',
          value: [Element, Compiler, Container, VelocityAnimator, ElementSelectors],
          enumerable: true
        }], _instanceInitializers);

        Dialog = skipContentProcessing(Dialog) || Dialog;
        Dialog = noView(Dialog) || Dialog;
        Dialog = customElement('dialog')(Dialog) || Dialog;
        return Dialog;
      })();

      _export('Dialog', Dialog);
    }
  };
});
//# sourceMappingURL=dialog.js.map