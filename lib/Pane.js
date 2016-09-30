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

    _this.setStyle = _this.setStyle.bind(_this);
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
    key: 'componentDidMount',
    value: function componentDidMount() {
      this.createPane();
    }
  }, {
    key: 'componentWillReceiveProps',
    value: function componentWillReceiveProps(nextProps) {
      // If the 'name' prop has changed the current pane is unmounted and a new
      // pane is created.
      if (nextProps.name !== this.props.name) {
        this.removePane();
        this.createPane(nextProps);
      } else if (!this.isDefaultPane()) {
        // Remove the previous css class name from the pane if it has changed.
        // setStyle will take care of adding in the updated className
        if (nextProps.className !== this.props.className) {
          var pane = this.getPane();
          pane && pane.classList.remove(this.props.className);
        }

        // Update the pane's DOM node style and class
        this.setStyle(nextProps);
      }
    }
  }, {
    key: 'componentWillUnmount',
    value: function componentWillUnmount() {
      this.removePane();
    }

    /**
     * isDefaultPane - Returns true if this.props.name matches the name
     * of a default leaflet pane.
     *
     * @param   {object}  props  Component props, defaults to this.props
     * @returns {boolean}        True if the pane is a default leaflet pane
     */

  }, {
    key: 'isDefaultPane',
    value: function isDefaultPane() {
      var name = arguments.length <= 0 || arguments[0] === undefined ? this.props.name : arguments[0];

      if (name) {
        var _name = (name + '').replace(/-*pane/gi, '');

        if ((0, _indexOf3.default)(BLACKLIST, _name) >= 0) {
          return true;
        }
      }

      return false;
    }

    /**
     * createPane - Creates a new pane for the map if it does not exist yet.
     * Existing panes are allowed only if they are a default leaflet pane like
     * 'popupPane' or 'tilePane'
     *
     * @param   {object} props  Component props, defaults to this.props
     */

  }, {
    key: 'createPane',
    value: function createPane() {
      var props = arguments.length <= 0 || arguments[0] === undefined ? this.props : arguments[0];

      var map = this.context.map || props.map;
      var name = props.name || 'pane-' + (0, _uniqueId3.default)();

      if (map && map.createPane) {
        var existing = this.getPane(name);
        var isDefault = this.isDefaultPane(name);

        if (!existing) {
          map.createPane(name, this.getParentPane());
          var pane = map.getPane(name);

          if (pane) {
            pane.att;
          }
        } else if (!isDefault) {
          throw new Error('A pane with this name already exists. (' + name + ')');
        }

        this.setState({
          name: name
        }, isDefault ? this.setStyle : undefined);
      }
    }

    /**
     * removePane - Removes the pane from the DOM and it's references in
     * map._pane and map._paneRenderers if the pane is not a default
     * leaflet pane.
     */

  }, {
    key: 'removePane',
    value: function removePane() {
      if (!this.isDefaultPane()) {
        // Remove the created pane
        var pane = this.getPane();
        pane && pane.remove && pane.remove();

        var map = this.context.map || this.props.map;

        if (this.state.name && map && map._panes) {
          map._panes = (0, _omit3.default)(map._panes, this.state.name);
          map._paneRenderers = (0, _omit3.default)(map._paneRenderers, this.state.name);
        }
      }
    }

    /**
     * setStyle - Updates the style attr of the pane's DOM node
     *
     * @param   {object} style  Style object
     */

  }, {
    key: 'setStyle',
    value: function setStyle() {
      var _ref = arguments.length <= 0 || arguments[0] === undefined ? this.props : arguments[0];

      var style = _ref.style;
      var className = _ref.className;

      var pane = this.getPane();

      if (pane) {
        if (style) {
          (0, _forEach3.default)(style, function (value, key) {
            pane.style[key] = value;
          });
        }

        if (className) {
          pane.classList.add(className);
        }
      }
    }

    /**
     * getParentPane - Returns the DOM node of a parent pane if existing
     *
     * @param   {string} name     The name of the parent pane
     * @returns {HTMLDivElement}  The DOM node that is the parent pane
     */

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

    /**
     * getPane - Returns the DOM node returned by map.getPane
     *
     * @param   {string} name     The name of the pane
     * @returns {HTMLDivElement}  The DOM node that is the pane
     */

  }, {
    key: 'getPane',
    value: function getPane() {
      var name = arguments.length <= 0 || arguments[0] === undefined ? this.state.name : arguments[0];

      var map = this.context.map || this.props.map;

      if (name && map && map) {
        return map.getPane(name);
      }

      return null;
    }

    /**
     * getChildren - Returns a clone of any children with props passed down unless
     * the child is an instance of Pane as well in which case the child is returned
     * as is.
     *
     * @returns {node}  Component children
     */

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
  className: _react.PropTypes.string,
  style: _react.PropTypes.object,
  pane: _react.PropTypes.string
};
Pane.contextTypes = {
  map: _map2.default,
  // Reference to a possible parent pane
  pane: _react.PropTypes.string
};
Pane.childContextTypes = {
  pane: _react.PropTypes.string
};
exports.default = Pane;