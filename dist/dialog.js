System.register(['aurelia-framework', 'gooy/aurelia-compiler', 'aaike/animator-css'], function (_export) {
  'use strict';

  var skipContentProcessing, noView, bindable, Container, ViewSlot, Compiler, CssAnimator, DialogCustomElement;

  var _createDecoratedClass = (function () { function defineProperties(target, descriptors, initializers) { for (var i = 0; i < descriptors.length; i++) { var descriptor = descriptors[i]; var decorators = descriptor.decorators; var key = descriptor.key; delete descriptor.key; delete descriptor.decorators; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor || descriptor.initializer) descriptor.writable = true; if (decorators) { for (var f = 0; f < decorators.length; f++) { var decorator = decorators[f]; if (typeof decorator === 'function') { descriptor = decorator(target, key, descriptor) || descriptor; } else { throw new TypeError('The decorator for method ' + descriptor.key + ' is of the invalid type ' + typeof decorator); } } if (descriptor.initializer !== undefined) { initializers[key] = descriptor; continue; } } Object.defineProperty(target, key, descriptor); } } return function (Constructor, protoProps, staticProps, protoInitializers, staticInitializers) { if (protoProps) defineProperties(Constructor.prototype, protoProps, protoInitializers); if (staticProps) defineProperties(Constructor, staticProps, staticInitializers); return Constructor; }; })();

  function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

  function _defineDecoratedPropertyDescriptor(target, key, descriptors) { var _descriptor = descriptors[key]; if (!_descriptor) return; var descriptor = {}; for (var _key in _descriptor) descriptor[_key] = _descriptor[_key]; descriptor.value = descriptor.initializer.call(target); Object.defineProperty(target, key, descriptor); }

  function camelize(str) {
    return str.trim().replace(/[-_\s]+(.)?/g, function (match, c) {
      return c ? c.toUpperCase() : '';
    });
  }
  return {
    setters: [function (_aureliaFramework) {
      skipContentProcessing = _aureliaFramework.skipContentProcessing;
      noView = _aureliaFramework.noView;
      bindable = _aureliaFramework.bindable;
      Container = _aureliaFramework.Container;
      ViewSlot = _aureliaFramework.ViewSlot;
    }, function (_gooyAureliaCompiler) {
      Compiler = _gooyAureliaCompiler.Compiler;
    }, function (_aaikeAnimatorCss) {
      CssAnimator = _aaikeAnimatorCss.CssAnimator;
    }],
    execute: function () {
      DialogCustomElement = (function () {
        var _instanceInitializers = {};

        function DialogCustomElement(element, compiler, container, animator) {
          _classCallCheck(this, _DialogCustomElement);

          _defineDecoratedPropertyDescriptor(this, 'view', _instanceInitializers);

          this.contentElements = [];
          this.isAnimating = false;
          this.hasTitle = true;
          this.createBackdrop = true;
          this.closeOnContainerClick = true;
          this.transition = null;

          this.element = element;
          this.compiler = compiler;
          this.container = container;
          this.animator = animator;
        }

        var _DialogCustomElement = DialogCustomElement;

        _createDecoratedClass(_DialogCustomElement, [{
          key: 'view',
          decorators: [bindable],
          initializer: null,
          enumerable: true
        }, {
          key: 'bind',
          value: function bind(executionContext) {
            this.executionContext = executionContext;
          }
        }, {
          key: 'copyContentAndAttributes',
          value: function copyContentAndAttributes(node, target) {
            if (!node) return;
            if (!target) return;

            for (var i = 0, l = node.attributes.length; i < l; i++) {
              var attr = node.attributes[i];
              target.setAttribute(attr.nodeName, attr.nodeValue);
            }
            target.textContent = node.textContent;
            target.innerHTML = node.innerHTML;
          }
        }, {
          key: 'cloneContentElements',
          value: function cloneContentElements(el) {
            for (var i = 0, l = el.children.length; i < l; i++) {
              var child = el.children[i];
              var clone = child.cloneNode(true);

              if (clone) this.contentElements.push(clone);
            }
          }
        }, {
          key: 'applyContentElements',
          value: function applyContentElements() {
            var _this = this;

            var i = undefined,
                l = undefined,
                promise = undefined;

            var refNodes = this.element.querySelectorAll('[ref-id]');
            var refs = [];

            for (i = 0, l = refNodes.length; i < l; i++) {
              refs.push(refNodes[i].getAttribute('ref-id'));
            }

            var unusedRefs = [].concat(refs);
            var usedRefs = [];

            var _loop = function () {
              el = _this.contentElements[i];

              var refName = camelize(el.nodeName.toLowerCase());
              var refNode = _this.element.querySelector('[ref-id=' + refName + ']');

              usedRefs.push(refName);

              var vm = el.getAttribute('view-model');
              var view = el.getAttribute('view');

              if (vm) {
                promise = _this.compiler.loadVM(vm).then(function (viewModel) {
                  console.log('viewModel', viewModel);

                  _this.behaviorInstance = viewModel.metadata.create(_this.container, {}, refNode);

                  console.log('refNode', refNode);
                  console.log('behaviorInstance', _this.behaviorInstance);
                  return;

                  viewSlot.bind(_this.behaviorInstance.executionContext);

                  setTimeout(function () {
                    _this.behaviorInstance.view.attached();
                    viewSlot.attached();
                    _this.behaviorInstance.bind(_this.behaviorInstance.executionContext);
                    _this.behaviorInstance.attached();
                  });

                  console.log('behaviorInstance', _this.behaviorInstance);
                });
              } else if (view) {
                promise = _this.compiler.loadTemplate(view, refNode).then(function (result) {
                  var template = result.template;
                  var data = result.refNode;

                  refNode.innerHTML = '';
                  for (var i = 0, l = template.content.children.length; i < l; i++) {
                    var child = template.content.children[i];

                    if (child && child instanceof Node) {
                      refNode.appendChild(child);
                      i--;
                    }
                  }
                });
              } else {
                _this.copyContentAndAttributes(el, refNode);
              }
            };

            for (i = 0, l = this.contentElements.length; i < l; i++) {
              var el;

              _loop();
            }

            for (i = 0, l = usedRefs.length; i < l; i++) {
              var ref = usedRefs[i];
              var p = unusedRefs.indexOf(ref);
              unusedRefs.splice(p, 1);
            }

            for (i = 0, l = unusedRefs.length; i < l; i++) {
              var r = unusedRefs[i];
              if (r === 'container' || r === 'controls' || r === 'dialog') continue;
              var refNode = this.element.querySelector('[ref-id=' + r + ']');
              if (refNode) {
                if (r === 'title') this.hasTitle = false;
                refNode.parentNode.removeChild(refNode);
              }
            }

            return promise || Promise.resolve();
          }
        }, {
          key: 'attached',
          value: function attached() {
            var _this2 = this;

            this.cloneContentElements(this.element);

            this.compiler.loadTemplate(this.view).then(function (result) {
              var template = result.template;

              var data = template.content.children[0].outerHTML;

              var viewModelRef = _this2.element.getAttribute('ref.view-model');

              data = data.replace(/this\./gm, viewModelRef + '.');

              _this2.element.innerHTML = data;

              _this2.applyContentElements().then(function () {
                console.log('contents applied');

                _this2.compiler.processBehavior(_this2.container);
                _this2.viewAttached();
              });
            });
          }
        }, {
          key: 'viewAttached',
          value: function viewAttached() {
            this.container = this.element.querySelector('[ref-id=container]');
            this.dialog = this.element.querySelector('[ref-id=dialog]');
            this.dialog.classList.add('au-out');
            this.dialog.classList.add('au-animate');

            if (this.container) {
              this.container.addEventListener('click', this.containerClick.bind(this));
            }

            this.dialog.addEventListener('click', function (e) {
              e.stopPropagation();
            });

            this.element.dispatchEvent(new Event('done'));
          }
        }, {
          key: 'containerClick',
          value: function containerClick(e) {
            if (this.closeOnContainerClick) this.close();
          }
        }, {
          key: 'open',
          value: function open() {
            var _this3 = this;

            if (this.backdrop) return;
            if (this.createBackdrop) this._createBackdrop();

            if (this.currentTransition) this.dialog.classList.remove(this.currentTransition);
            this.dialog.classList.add(this.transition);
            this.currentTransition = this.transition;
            this.container.setAttribute('aria-hidden', false);
            this.container.style.display = 'block';

            this.dialog.scrollTop = 0;

            return this.enterAnimation().then(function () {
              _this3.dialog.focus();
            });
          }
        }, {
          key: 'close',
          value: function close() {
            var _this4 = this;

            if (this.createBackdrop) this._destroyBackdrop();

            if (!this.container) return;
            this.container.setAttribute('aria-hidden', true);
            this.container.classList.remove('in');

            return this.leaveAnimation().then(function () {
              _this4.element.dispatchEvent(new Event('close'));
              _this4.container.style.display = 'none';
            });
          }
        }, {
          key: 'enterAnimation',
          value: function enterAnimation(force) {
            var _this5 = this;

            if (this.isAnimating && !force) Promise.resolve();

            this.isAnimating = true;
            return this.animator.enter(this.dialog).then(function (success) {
              setTimeout(function () {
                _this5.isAnimating = false;
              }, 100);
            });
          }
        }, {
          key: 'leaveAnimation',
          value: function leaveAnimation(force) {
            var _this6 = this;

            if (this.isAnimating && !force) Promise.resolve();

            this.isAnimating = true;
            return this.animator.leave(this.dialog).then(function (success) {
              setTimeout(function () {
                _this6.isAnimating = false;
              }, 100);
            });
          }
        }, {
          key: '_createBackdrop',
          value: function _createBackdrop() {
            var _this7 = this;

            if (this.backdrop) return;

            this.backdrop = document.createElement('div');
            this.backdrop.className = 'modal-backdrop fade';

            document.body.appendChild(this.backdrop);

            setTimeout(function () {
              _this7.backdrop.classList.add('in');
            });
          }
        }, {
          key: '_destroyBackdrop',
          value: function _destroyBackdrop() {
            var _this8 = this;

            if (!this.backdrop) return;
            this.backdrop.classList.remove('in');

            setTimeout(function () {
              if (_this8.backdrop) _this8.backdrop.parentNode.removeChild(_this8.backdrop);
              _this8.backdrop = null;
            }, 400);
          }
        }], [{
          key: 'inject',
          value: [Element, Compiler, Container, CssAnimator],
          enumerable: true
        }], _instanceInitializers);

        DialogCustomElement = skipContentProcessing(DialogCustomElement) || DialogCustomElement;
        DialogCustomElement = noView(DialogCustomElement) || DialogCustomElement;
        return DialogCustomElement;
      })();

      _export('DialogCustomElement', DialogCustomElement);
    }
  };
});
//# sourceMappingURL=dialog.js.map