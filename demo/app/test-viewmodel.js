System.register(['aurelia-framework'], function (_export) {
  'use strict';

  var computedFrom, TestViewModel, UpperValueConverter;

  var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

  var _createDecoratedClass = (function () { function defineProperties(target, descriptors, initializers) { for (var i = 0; i < descriptors.length; i++) { var descriptor = descriptors[i]; var decorators = descriptor.decorators; var key = descriptor.key; delete descriptor.key; delete descriptor.decorators; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor || descriptor.initializer) descriptor.writable = true; if (decorators) { for (var f = 0; f < decorators.length; f++) { var decorator = decorators[f]; if (typeof decorator === 'function') { descriptor = decorator(target, key, descriptor) || descriptor; } else { throw new TypeError('The decorator for method ' + descriptor.key + ' is of the invalid type ' + typeof decorator); } } if (descriptor.initializer !== undefined) { initializers[key] = descriptor; continue; } } Object.defineProperty(target, key, descriptor); } } return function (Constructor, protoProps, staticProps, protoInitializers, staticInitializers) { if (protoProps) defineProperties(Constructor.prototype, protoProps, protoInitializers); if (staticProps) defineProperties(Constructor, staticProps, staticInitializers); return Constructor; }; })();

  function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

  return {
    setters: [function (_aureliaFramework) {
      computedFrom = _aureliaFramework.computedFrom;
    }],
    execute: function () {
      TestViewModel = (function () {
        function TestViewModel() {
          _classCallCheck(this, TestViewModel);

          this.heading = 'Welcome to the Aurelia Navigation App!';
          this.firstName = 'John';
          this.lastName = 'Doe';
        }

        _createDecoratedClass(TestViewModel, [{
          key: 'fullName',
          decorators: [computedFrom('firstName', 'lastName')],
          get: function () {
            return '' + this.firstName + ' ' + this.lastName;
          }
        }, {
          key: 'bind',
          value: function bind() {
            console.log('VIEWMODEL bind');
          }
        }, {
          key: 'attached',
          value: function attached() {
            console.log('VIEWMODEL attached');
          }
        }, {
          key: 'detached',
          value: function detached() {
            console.log('VIEWMODEL detached');
          }
        }, {
          key: 'unbind',
          value: function unbind() {
            console.log('VIEWMODEL unbind');
          }
        }, {
          key: 'welcome',
          value: function welcome() {
            alert('Welcome, ' + this.fullName + '!');
          }
        }]);

        return TestViewModel;
      })();

      _export('TestViewModel', TestViewModel);

      UpperValueConverter = (function () {
        function UpperValueConverter() {
          _classCallCheck(this, UpperValueConverter);
        }

        _createClass(UpperValueConverter, [{
          key: 'toView',
          value: function toView(value) {
            return value && value.toUpperCase();
          }
        }]);

        return UpperValueConverter;
      })();

      _export('UpperValueConverter', UpperValueConverter);
    }
  };
});
//# sourceMappingURL=test-viewmodel.js.map