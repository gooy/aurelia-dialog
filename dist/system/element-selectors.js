System.register(['aurelia-framework', 'gooy/aurelia-compiler'], function (_export) {
  'use strict';

  var Container, ViewSlot, transient, Compiler, ElementSelectors;

  var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

  function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

  return {
    setters: [function (_aureliaFramework) {
      Container = _aureliaFramework.Container;
      ViewSlot = _aureliaFramework.ViewSlot;
      transient = _aureliaFramework.transient;
    }, function (_gooyAureliaCompiler) {
      Compiler = _gooyAureliaCompiler.Compiler;
    }],
    execute: function () {
      ElementSelectors = (function () {
        function ElementSelectors() {
          _classCallCheck(this, _ElementSelectors);
        }

        var _ElementSelectors = ElementSelectors;

        _createClass(_ElementSelectors, [{
          key: 'init',
          value: function init(container) {
            this.container = container;
            this.element = container.get(Element);
            this.compiler = container.get(Compiler);
          }
        }, {
          key: 'applySelectors',
          value: function applySelectors() {
            var i = undefined,
                l = undefined,
                promise = undefined;

            var behavior = this.element.primaryBehavior;
            var fragment = behavior.originalFragment;

            if (!fragment) throw new Error('no originalFragment found for', this.element);

            var targets = this.element.querySelectorAll('[select]');
            this.unknownTargets = [].slice.call(targets);

            for (i = 0, l = targets.length; i < l; i++) {
              var target = targets[i];
              var selector = target.getAttribute('select');

              var source = fragment.querySelector(selector);

              if (!source) continue;

              this.copyContentAndAttributes(source, target);

              this.unknownTargets = this.unknownTargets.filter(function (el) {
                return el !== target;
              });
            }
          }
        }, {
          key: 'createCompositions',
          value: function createCompositions() {
            var elements = this.element.querySelectorAll('[select]');

            for (var i = 0, l = elements.length; i < l; i++) {
              var el = elements[i];

              var vm = el.getAttribute('view-model');
              var view = el.getAttribute('view');

              if (vm || view) {
                var compose = document.createElement('compose');
                if (vm) compose.setAttribute('view-model', vm);
                if (view) compose.setAttribute('view', view);
                el.appendChild(compose);
              }
            }
          }
        }, {
          key: 'destroyCompositions',
          value: function destroyCompositions() {
            var remove = arguments[0] === undefined ? true : arguments[0];

            var compositions = this.element.querySelectorAll('compose');
            for (var i = 0, l = compositions.length; i < l; i++) {
              var compose = compositions[i];
              compose.innerHTML = '';
              if (remove) compose.parentNode.removeChild(compose);
            }
          }
        }, {
          key: 'copyContentAndAttributes',
          value: function copyContentAndAttributes(source, target) {
            for (var i = 0, l = source.attributes.length; i < l; i++) {
              var attr = source.attributes[i];
              if (attr === 'select') continue;
              target.setAttribute(attr.nodeName, attr.nodeValue);
            }
            target.textContent = source.textContent;
            target.innerHTML = source.innerHTML;
          }
        }]);

        ElementSelectors = transient()(ElementSelectors) || ElementSelectors;
        return ElementSelectors;
      })();

      _export('ElementSelectors', ElementSelectors);
    }
  };
});
//# sourceMappingURL=element-selectors.js.map