var Rangebar = (function () {
'use strict';

var commonjsGlobal = typeof window !== 'undefined' ? window : typeof global !== 'undefined' ? global : typeof self !== 'undefined' ? self : {};





function createCommonjsModule(fn, module) {
	return module = { exports: {} }, fn(module, module.exports), module.exports;
}

var performanceNow = createCommonjsModule(function (module) {
// Generated by CoffeeScript 1.7.1
(function() {
  var getNanoSeconds, hrtime, loadTime;

  if ((typeof performance !== "undefined" && performance !== null) && performance.now) {
    module.exports = function() {
      return performance.now();
    };
  } else if ((typeof process !== "undefined" && process !== null) && process.hrtime) {
    module.exports = function() {
      return (getNanoSeconds() - loadTime) / 1e6;
    };
    hrtime = process.hrtime;
    getNanoSeconds = function() {
      var hr;
      hr = hrtime();
      return hr[0] * 1e9 + hr[1];
    };
    loadTime = getNanoSeconds();
  } else if (Date.now) {
    module.exports = function() {
      return Date.now() - loadTime;
    };
    loadTime = Date.now();
  } else {
    module.exports = function() {
      return new Date().getTime() - loadTime;
    };
    loadTime = new Date().getTime();
  }

}).call(commonjsGlobal);
});

var now = performanceNow;
var root = typeof window === 'undefined' ? commonjsGlobal : window;
var vendors = ['moz', 'webkit'];
var suffix = 'AnimationFrame';
var raf = root['request' + suffix];
var caf = root['cancel' + suffix] || root['cancelRequest' + suffix];

for(var i = 0; !raf && i < vendors.length; i++) {
  raf = root[vendors[i] + 'Request' + suffix];
  caf = root[vendors[i] + 'Cancel' + suffix]
      || root[vendors[i] + 'CancelRequest' + suffix];
}

// Some versions of FF have rAF but not cAF
if(!raf || !caf) {
  var last = 0
    , id = 0
    , queue = []
    , frameDuration = 1000 / 60;

  raf = function(callback) {
    if(queue.length === 0) {
      var _now = now()
        , next = Math.max(0, frameDuration - (_now - last));
      last = next + _now;
      setTimeout(function() {
        var cp = queue.slice(0);
        // Clear queue here to prevent
        // callbacks from appending listeners
        // to the current frame's queue
        queue.length = 0;
        for(var i = 0; i < cp.length; i++) {
          if(!cp[i].cancelled) {
            try{
              cp[i].callback(last);
            } catch(e) {
              setTimeout(function() { throw e }, 0);
            }
          }
        }
      }, Math.round(next));
    }
    queue.push({
      handle: ++id,
      callback: callback,
      cancelled: false
    });
    return id
  };

  caf = function(handle) {
    for(var i = 0; i < queue.length; i++) {
      if(queue[i].handle === handle) {
        queue[i].cancelled = true;
      }
    }
  };
}

var index = function(fn) {
  // Wrap in a new function to prevent
  // `cancel` potentially being assigned
  // to the native rAF function
  return raf.call(root, fn)
};
var cancel = function() {
  caf.apply(root, arguments);
};
var polyfill = function() {
  root.requestAnimationFrame = raf;
  root.cancelAnimationFrame = caf;
};

index.cancel = cancel;
index.polyfill = polyfill;

function appendNode ( node, target ) {
	target.appendChild( node );
}

function insertNode ( node, target, anchor ) {
	target.insertBefore( node, anchor );
}

function detachNode ( node ) {
	node.parentNode.removeChild( node );
}

function teardownEach ( iterations, detach, start ) {
	for ( var i = ( start || 0 ); i < iterations.length; i += 1 ) {
		iterations[i].teardown( detach );
	}
}

function createElement ( name ) {
	return document.createElement( name );
}

function createComment () {
	return document.createComment( '' );
}

function addEventListener ( node, event, handler ) {
	node.addEventListener ( event, handler, false );
}

function removeEventListener ( node, event, handler ) {
	node.removeEventListener ( event, handler, false );
}

function setAttribute ( node, attribute, value ) {
	node.setAttribute ( attribute, value );
}

function get ( key ) {
	return key ? this._state[ key ] : this._state;
}

function fire ( eventName, data ) {
	var handlers = eventName in this._handlers && this._handlers[ eventName ].slice();
	if ( !handlers ) return;

	for ( var i = 0; i < handlers.length; i += 1 ) {
		handlers[i].call( this, data );
	}
}

function observe ( key, callback, options ) {
	var group = ( options && options.defer ) ? this._observers.pre : this._observers.post;

	( group[ key ] || ( group[ key ] = [] ) ).push( callback );

	if ( !options || options.init !== false ) {
		callback.__calling = true;
		callback.call( this, this._state[ key ] );
		callback.__calling = false;
	}

	return {
		cancel: function () {
			var index = group[ key ].indexOf( callback );
			if ( ~index ) group[ key ].splice( index, 1 );
		}
	};
}

function on ( eventName, handler ) {
	var handlers = this._handlers[ eventName ] || ( this._handlers[ eventName ] = [] );
	handlers.push( handler );

	return {
		cancel: function () {
			var index = handlers.indexOf( handler );
			if ( ~index ) handlers.splice( index, 1 );
		}
	};
}

function set ( newState ) {
	this._set( newState );
	( this._root || this )._flush();
}

function _flush () {
	if ( !this._renderHooks ) return;

	while ( this._renderHooks.length ) {
		var hook = this._renderHooks.pop();
		hook.fn.call( hook.context );
	}
}

function dispatchObservers ( component, group, newState, oldState ) {
	for ( var key in group ) {
		if ( !( key in newState ) ) continue;

		var newValue = newState[ key ];
		var oldValue = oldState[ key ];

		if ( newValue === oldValue && typeof newValue !== 'object' ) continue;

		var callbacks = group[ key ];
		if ( !callbacks ) continue;

		for ( var i = 0; i < callbacks.length; i += 1 ) {
			var callback = callbacks[i];
			if ( callback.__calling ) continue;

			callback.__calling = true;
			callback.call( component, newValue, oldValue );
			callback.__calling = false;
		}
	}
}

function applyComputations ( state, newState, oldState, isInitial ) {
	if ( isInitial || ( 'style' in newState && typeof state.style === 'object' || state.style !== oldState.style ) ) {
		state.buttonSize = newState.buttonSize = template.computed.buttonSize( state.style );
	}
	
	if ( isInitial || ( 'min' in newState && typeof state.min === 'object' || state.min !== oldState.min ) || ( 'max' in newState && typeof state.max === 'object' || state.max !== oldState.max ) ) {
		state.range = newState.range = template.computed.range( state.min, state.max );
	}
}

var template = (function () {
return {
  data() {
    return {
      defaultStyle: {
        len: '8em',
        width: '4px',
        barBackgroundColor: '#222',
        buttonBackgroundColor: '#cb1b45'
      },
      horizontal: true,
      // horizontal: false,
      min: 0,
      max: 100,
      active: null,
      style: null,
      buttons: null,
      zIndex: 0,
      zIndexes: [],
      buttonPositions: []
    };
  },
  computed: {
    buttonSize(style) {
      if (!(style || {}).width) {
        return;
      }
      const width = getNumber(style.width);
      return width * 2.414;

      function getNumber(cssVal) {
        const matches = cssVal.match(/^\d+/);
        if (matches !== null) {
          return Number(matches[0]);
        } else {
          return null;
        }
      }
    },
    range(min, max) {
      if (typeof min !== 'number' && typeof max !== 'number') {
        return;
      }

      return max - min;
    }
  },
  methods: {
    handleMousedown(ev, idx) {
      ev.preventDefault();
      const {active} = this.get();
      if (active !== null) {
        return;
      }

      this.set({active: idx});
    },
    handleMouseup() {
      const {active, range, horizontal, buttonPositions, buttonSize,
             zIndex, zIndexes, onChange} = this.get();

      if (active === null) {
        return;
      }

      const barWidth = this.refs.bar[
        horizontal ? 'clientWidth' : 'clientHeight'
      ];
      if (typeof onChange === 'function') {
        onChange(buttonPositions.map(pos => {
          const val = Math.round(pos / (barWidth / range));
          return val;
        }));
      }

      const z = zIndex + 1;
      zIndexes[active] = z;
      this.set({
        active: null,
        zIndexes,
        zIndex: z
      });
    },
    handleMousemove(ev) {
      const {active, range, horizontal, buttonPositions} = this.get();
      if (active === null) {
        return;
      }

      const barWidth = this.refs.bar[
        horizontal ? 'clientWidth' : 'clientHeight'
      ];
      const position = buttonPositions[active];
      const prev = buttonPositions[active - 1] || 0;
      const next = buttonPositions[active + 1] || barWidth;
      buttonPositions[active] = (() => {
        const pos = position + ev[horizontal ? 'movementX' : 'movementY'];
        if (pos < prev) {
          return prev;
        } else if (pos > next) {
          return next;
        }
        return pos;
      })();

      this.set({buttonPositions});
    }
  },
  oncreate() {
    const {style, defaultStyle, buttons} = this.get();

    const calcPos = () => {
      const {bar} = this.refs;
      const {horizontal, buttons, buttonSize, zIndex} = this.get();
      const size = bar[horizontal ? 'clientWidth' : 'clientHeight'];
      const zIndexes = [];
      const buttonPositions = buttons.map((btn, idx) => {
        zIndexes.push(zIndex + idx + 1);
        return size / (100 / btn);
      });
      this.set({
        buttonPositions,
        zIndexes,
        zIndex: zIndex + buttons.length
      });
    };

    if (!Array.isArray(buttons)) {
      throw new Error('Required data `buttons`');
    } else {
      index(calcPos);
    }

    if (style === null) {
      this.set({style: Object.assign({}, this.defaultStyle)});
    }

    this.observe('style', newStyle => {
      const {defaultStyle} = this.get();

      if (typeof newStyle === 'undefined') {
        this.set({
          style: defaultStyle
        });
        return;
      }

      if (typeof newStyle !== 'object' ||
          Array.isArray(newStyle)) {
        throw new Error('`style` must be Object');
      }

      this.set({
        style: Object.assign({}, defaultStyle, newStyle)
      });
    });

    this.observe('buttons', buttons => {
      if (!Array.isArray(buttons)) {
        throw new Error('`button` must be Array');
      }

      this.set({buttons});
      index(calcPos);
    });

    document.body.addEventListener(
      'mouseup',
      this.handleMouseup.bind(this)
    );
    document.body.addEventListener(
      'mouseleave',
      this.handleMouseup.bind(this)
    );
    document.body.addEventListener(
      'mousemove',
      this.handleMousemove.bind(this)
    );
  },
  ondestroy() {
    document.body.removeEventListener(
      'mouseup',
      this.handleMouseup.bind(this)
    );
    document.body.removeEventListener(
      'mouseleave',
      this.handleMouseup.bind(this)
    );
    document.body.removeEventListener(
      'mousemove',
      this.handleMousemove.bind(this)
    );
  }
};
}());

let addedCss = false;
function addCss () {
	var style = createElement( 'style' );
	style.textContent = "\n[svelte-298887152].bar, [svelte-298887152] .bar {\n  margin: 1em;\n  position: relative;\n  border-radius: 3px;\n  display: -webkit-box;\n  display: -ms-flexbox;\n  display: flex;\n  -webkit-box-align: center;\n  -ms-flex-align: center;\n  align-items: center;\n  -webkit-box-pack: center;\n  -ms-flex-pack: center;\n  justify-content: center;\n}\n\n[svelte-298887152].button, [svelte-298887152] .button {\n  position: absolute;\n  border-radius: 50%;\n  cursor: pointer;\n}\n\n";
	appendNode( style, document.head );

	addedCss = true;
}

function renderMainFragment ( root, component ) {
	var ifBlock_anchor = createComment();
	
	function getBlock ( root ) {
		if ( root.style ) return renderIfBlock_0;
		return null;
	}
	
	var currentBlock = getBlock( root );
	var ifBlock = currentBlock && currentBlock( root, component );

	return {
		mount: function ( target, anchor ) {
			insertNode( ifBlock_anchor, target, anchor );
			if ( ifBlock ) ifBlock.mount( ifBlock_anchor.parentNode, ifBlock_anchor );
		},
		
		update: function ( changed, root ) {
			var __tmp;
		
			var _currentBlock = currentBlock;
			currentBlock = getBlock( root );
			if ( _currentBlock === currentBlock && ifBlock) {
				ifBlock.update( changed, root );
			} else {
				if ( ifBlock ) ifBlock.teardown( true );
				ifBlock = currentBlock && currentBlock( root, component );
				if ( ifBlock ) ifBlock.mount( ifBlock_anchor.parentNode, ifBlock_anchor );
			}
		},
		
		teardown: function ( detach ) {
			if ( ifBlock ) ifBlock.teardown( detach );
			
			if ( detach ) {
				detachNode( ifBlock_anchor );
			}
		}
	};
}

function renderIfBlock_0 ( root, component ) {
	var div = createElement( 'div' );
	setAttribute( div, 'svelte-298887152', '' );
	component.refs.bar = div;
	div.className = "rangebar bar";
	div.style.cssText = "\n    width: " + ( root.horizontal ? root.style.len : root.style.width ) + ";\n    height: " + ( root.horizontal ? root.style.width : root.style.len ) + ";\n    background-color: " + ( root.style.barBackgroundColor ) + ";\n  ";
	
	var eachBlock_anchor = createComment();
	appendNode( eachBlock_anchor, div );
	var eachBlock_value = root.buttons;
	var eachBlock_iterations = [];
	
	for ( var i = 0; i < eachBlock_value.length; i += 1 ) {
		eachBlock_iterations[i] = renderEachBlock( root, eachBlock_value, eachBlock_value[i], i, component );
		eachBlock_iterations[i].mount( eachBlock_anchor.parentNode, eachBlock_anchor );
	}

	return {
		mount: function ( target, anchor ) {
			insertNode( div, target, anchor );
		},
		
		update: function ( changed, root ) {
			var __tmp;
		
			div.style.cssText = "\n    width: " + ( root.horizontal ? root.style.len : root.style.width ) + ";\n    height: " + ( root.horizontal ? root.style.width : root.style.len ) + ";\n    background-color: " + ( root.style.barBackgroundColor ) + ";\n  ";
			
			var eachBlock_value = root.buttons;
			
			for ( var i = 0; i < eachBlock_value.length; i += 1 ) {
				if ( !eachBlock_iterations[i] ) {
					eachBlock_iterations[i] = renderEachBlock( root, eachBlock_value, eachBlock_value[i], i, component );
					eachBlock_iterations[i].mount( eachBlock_anchor.parentNode, eachBlock_anchor );
				} else {
					eachBlock_iterations[i].update( changed, root, eachBlock_value, eachBlock_value[i], i );
				}
			}
			
			teardownEach( eachBlock_iterations, true, eachBlock_value.length );
			
			eachBlock_iterations.length = eachBlock_value.length;
		},
		
		teardown: function ( detach ) {
			if ( component.refs.bar === div ) component.refs.bar = null;
			
			teardownEach( eachBlock_iterations, false );
			
			if ( detach ) {
				detachNode( div );
			}
		}
	};
}

function renderEachBlock ( root, eachBlock_value, button, idx, component ) {
	var div = createElement( 'div' );
	setAttribute( div, 'svelte-298887152', '' );
	div.className = "rangebar button";
	div.style.cssText = "\n        width: " + ( root.buttonSize ) + "px;\n        height: " + ( root.buttonSize ) + "px;\n        background-color: " + ( root.style.buttonBackgroundColor ) + ";\n        " + ( root.horizontal && `left: ${root.buttonPositions[idx] - root.buttonSize / 2}px` ) + ";\n        " + ( root.horizontal || `top: ${root.buttonPositions[idx] - root.buttonSize / 2}px` ) + ";\n        z-index: " + ( root.zIndexes[idx] || 0 ) + ";\n      ";
	
	function mousedownHandler ( event ) {
		var eachBlock_value = this.__svelte.eachBlock_value, idx = this.__svelte.idx, button = eachBlock_value[idx];
		
		component.handleMousedown(event, idx);
	}
	
	addEventListener( div, 'mousedown', mousedownHandler );
	
	div.__svelte = {
		eachBlock_value: eachBlock_value,
		idx: idx
	};

	return {
		mount: function ( target, anchor ) {
			insertNode( div, target, anchor );
		},
		
		update: function ( changed, root, eachBlock_value, button, idx ) {
			var __tmp;
		
			div.style.cssText = "\n        width: " + ( root.buttonSize ) + "px;\n        height: " + ( root.buttonSize ) + "px;\n        background-color: " + ( root.style.buttonBackgroundColor ) + ";\n        " + ( root.horizontal && `left: ${root.buttonPositions[idx] - root.buttonSize / 2}px` ) + ";\n        " + ( root.horizontal || `top: ${root.buttonPositions[idx] - root.buttonSize / 2}px` ) + ";\n        z-index: " + ( root.zIndexes[idx] || 0 ) + ";\n      ";
			
			div.__svelte.eachBlock_value = eachBlock_value;
			div.__svelte.idx = idx;
		},
		
		teardown: function ( detach ) {
			removeEventListener( div, 'mousedown', mousedownHandler );
			
			if ( detach ) {
				detachNode( div );
			}
		}
	};
}

function Rangebar$1 ( options ) {
	options = options || {};
	this.refs = {};
	this._state = Object.assign( template.data(), options.data );
	applyComputations( this._state, this._state, {}, true );
	
	this._observers = {
		pre: Object.create( null ),
		post: Object.create( null )
	};
	
	this._handlers = Object.create( null );
	
	this._root = options._root;
	this._yield = options._yield;
	
	this._torndown = false;
	if ( !addedCss ) addCss();
	
	this._fragment = renderMainFragment( this._state, this );
	if ( options.target ) this._fragment.mount( options.target, null );
	
	if ( options._root ) {
		options._root._renderHooks.push({ fn: template.oncreate, context: this });
	} else {
		template.oncreate.call( this );
	}
}

Rangebar$1.prototype = template.methods;

Rangebar$1.prototype.get = get;
Rangebar$1.prototype.fire = fire;
Rangebar$1.prototype.observe = observe;
Rangebar$1.prototype.on = on;
Rangebar$1.prototype.set = set;
Rangebar$1.prototype._flush = _flush;

Rangebar$1.prototype._set = function _set ( newState ) {
	var oldState = this._state;
	this._state = Object.assign( {}, oldState, newState );
	applyComputations( this._state, newState, oldState, false );
	
	dispatchObservers( this, this._observers.pre, newState, oldState );
	if ( this._fragment ) this._fragment.update( newState, this._state );
	dispatchObservers( this, this._observers.post, newState, oldState );
};

Rangebar$1.prototype.teardown = Rangebar$1.prototype.destroy = function destroy ( detach ) {
	this.fire( 'teardown' );
template.ondestroy.call( this );

	this._fragment.teardown( detach !== false );
	this._fragment = null;

	this._state = {};
	this._torndown = true;
};

return Rangebar$1;

}());