'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _indexOf2 = require('lodash/indexOf');

var _indexOf3 = _interopRequireDefault(_indexOf2);

var _uniqueId2 = require('lodash/uniqueId');

var _uniqueId3 = _interopRequireDefault(_uniqueId2);

var _omit2 = require('lodash/omit');

var _omit3 = _interopRequireDefault(_omit2);

var _forEach2 = require('lodash/forEach');

var _forEach3 = _interopRequireDefault(_forEach2);

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _children = require('./types/children');

var _children2 = _interopRequireDefault(_children);

var _map = require('./types/map');

var _map2 = _interopRequireDefault(_map);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var BLACKLIST = ['tile', 'shadow', 'overlay', 'map', 'marker', 'tooltip', 'popup'];

var Pane = function (_Component) {
  _inherits(Pane, _Component);

  function Pane() {
    _classCallCheck(this, Pane);

    var _this = _possibleConstructorReturn(this, (Pane.__proto__ || Object.getPrototypeOf(Pane)).call(this));

    _this.state = {
      name: null
    };
    return _this;
  }

  _createClass(Pane, [{
    key: 'getChildContext',
    value: function getChildContext() {
      return {
        pane: this.state.name
      };
    }
  }, {
    key: 'componentWillMount',
    value: function componentWillMount() {
      var map = this.context.map || this.props.map;

      if (this.state.name && map && map.createPane) {
        var existing = this.getPane();

        if (!existing) {
          map.createPane(this.state.name, this.getParentPane());
        }
      }
    }
  }, {
    key: 'componentWillReceiveProps',
    value: function componentWillReceiveProps(props) {
      this.setStyle(props);
    }
  }, {
    key: 'setStyle',
    value: function setStyle() {
      var _ref = arguments.length <= 0 || arguments[0] === undefined ? this.props : arguments[0];

      var style = _ref.style;
      var zIndex = _ref.zIndex;

      var pane = this.getPane();

      if (pane) {
        pane.style.zIndex = zIndex || 'initial';

        if (style) {
          (0, _forEach3.default)(style, function (value, key) {
            pane.style[key] = value;
          });
        }
      }
    }
  }, {
    key: 'componentDidMount',
    value: function componentDidMount() {
      this.setState({
        name: this.props.name || 'pane-' + (0, _uniqueId3.default)()
      });

      this.setStyle();
    }
  }, {
    key: 'componentWillUnmount',
    value: function componentWillUnmount() {
      var name = this.props.name;


      if (name) {
        var _name = (name + '').replace(/-*pane/gi, '');

        if ((0, _indexOf3.default)(BLACKLIST, _name) >= 0) {
          // Don't remove panes created by leaflet
          return;
        }
      }

      // Remove the created pane
      var pane = this.getPane();
      pane && pane.remove && pane.remove();

      var map = this.context.map || this.props.map;

      if (this.state.name && map && map._panes) {
        map._panes = (0, _omit3.default)(map._panes, this.state.name);
        map._paneRenderers = (0, _omit3.default)(map._paneRenderers, this.state.name);
      }
    }
  }, {
    key: 'getParentPane',
    value: function getParentPane() {
      var pane = this.props.pane || this.context.pane;

      if (pane) {
        var map = this.context.map || this.props.map;

        if (map) {
          return map.getPane(pane) || null;
        }
      }

      return null;
    }
  }, {
    key: 'getPane',
    value: function getPane() {
      var map = this.context.map || this.props.map;

      if (this.state.name && map && map) {
        return map.getPane(this.state.name);
      }

      return null;
    }
  }, {
    key: 'getChildren',
    value: function getChildren() {
      var _this2 = this;

      return _react2.default.Children.map(this.props.children, function (child) {
        if (child.type === Pane) {
          return child;
        }

        return child ? _react2.default.cloneElement(child, _this2.props) : null;
      });
    }
  }, {
    key: 'render',
    value: function render() {
      return this.state.name ? _react2.default.createElement(
        'div',
        { style: {
            position: 'absolute',
            top: 0,
            right: 0,
            bottom: 0,
            left: 0
          } },
        this.getChildren()
      ) : null;
    }
  }]);

  return Pane;
}(_react.Component);

Pane.propTypes = {
  name: _react.PropTypes.string,
  children: _children2.default,
  map: _map2.default,
  zIndex: _react.PropTypes.number,
  className: _react.PropTypes.string,
  style: _react.PropTypes.object,
  pane: _react.PropTypes.string
};
Pane.contextTypes = {
  map: _map2.default,
  pane: _react.PropTypes.string
};
Pane.childContextTypes = {
  pane: _react.PropTypes.string
};
exports.default = Pane;