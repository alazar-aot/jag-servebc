'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

var _reactLoadingOverlay = require('react-loading-overlay');

var _reactLoadingOverlay2 = _interopRequireDefault(_reactLoadingOverlay);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; } /* eslint no-return-assign: 0 */


exports.default = function (options) {
  return function (loading) {
    var _class, _temp;

    return _temp = _class = function (_React$Component) {
      _inherits(TableLoadingOverlayWrapper, _React$Component);

      function TableLoadingOverlayWrapper() {
        _classCallCheck(this, TableLoadingOverlayWrapper);

        return _possibleConstructorReturn(this, (TableLoadingOverlayWrapper.__proto__ || Object.getPrototypeOf(TableLoadingOverlayWrapper)).apply(this, arguments));
      }

      _createClass(TableLoadingOverlayWrapper, [{
        key: 'componentDidMount',
        value: function componentDidMount() {
          if (loading) {
            var wrapper = this.overlay.wrapper;

            var masker = wrapper.current.firstChild;
            var headerDOM = wrapper.current.parentElement.querySelector('thead');
            var bodyDOM = wrapper.current.parentElement.querySelector('tbody');
            var captionDOM = wrapper.current.parentElement.querySelector('caption');

            var marginTop = window.getComputedStyle(headerDOM).height;
            if (captionDOM) {
              marginTop = parseFloat(marginTop.replace('px', ''));
              marginTop += parseFloat(window.getComputedStyle(captionDOM).height.replace('px', ''));
              marginTop = marginTop + 'px';
            }

            masker.style.marginTop = marginTop;
            masker.style.height = window.getComputedStyle(bodyDOM).height;
          }
        }
      }, {
        key: 'render',
        value: function render() {
          var _this2 = this;

          return _react2.default.createElement(
            _reactLoadingOverlay2.default,
            _extends({
              ref: function ref(n) {
                return _this2.overlay = n;
              }
            }, options, {
              active: loading
            }),
            this.props.children
          );
        }
      }]);

      return TableLoadingOverlayWrapper;
    }(_react2.default.Component), _class.propTypes = {
      children: _propTypes2.default.element.isRequired
    }, _temp;
  };
};