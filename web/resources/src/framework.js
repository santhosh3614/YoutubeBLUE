
/*!
Math.uuid.js (v1.4)
http://www.broofa.com
mailto:robert@broofa.com

Copyright (c) 2009 Robert Kieffer
Dual licensed under the MIT and GPL licenses.
*/

/*
 * Generate a random uuid.
 * http://www.broofa.com/2008/09/javascript-uuid-function/
 * 
 * 
 * USAGE: Math.uuid(length, radix)
 *   length - the desired number of characters
 *   radix  - the number of allowable values for each character.
 *
 * EXAMPLES:
 *   // No arguments  - returns RFC4122, version 4 ID
 *   >>> Math.uuid()
 *   "92329D39-6F5C-4520-ABFC-AAB64544E172"
 * 
 *   // One argument - returns ID of the specified length
 *   >>> Math.uuid(15)     // 15 character ID (default base=62)
 *   "VcydxgltxrVZSTV"
 *
 *   // Two arguments - returns ID of the specified length, and radix. (Radix must be <= 62)
 *   >>> Math.uuid(8, 2)  // 8 character ID (base=2)
 *   "01001010"
 *   >>> Math.uuid(8, 10) // 8 character ID (base=10)
 *   "47473046"
 *   >>> Math.uuid(8, 16) // 8 character ID (base=16)
 *   "098F4D35"
 */
; Math.uuid = (function() {
  // Private array of chars to use
  var CHARS = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'.split(''); 

  return function (len, radix) {
    var chars = CHARS, uuid = [];
    radix = radix || chars.length;

    if (len) {
      // Compact form
      for (var i = 0; i < len; i++) uuid[i] = chars[0 | Math.random()*radix];
    } else {
      // rfc4122, version 4 form
      var r;

      // rfc4122 requires these characters
      uuid[8] = uuid[13] = uuid[18] = uuid[23] = '-';
      uuid[14] = '4';

      // Fill in random data.  At i==19 set the high bits of clock sequence as
      // per rfc4122, sec. 4.1.5
      for (var i = 0; i < 36; i++) {
        if (!uuid[i]) {
          r = 0 | Math.random()*16;
          uuid[i] = chars[(i == 19) ? (r & 0x3) | 0x8 : r];
        }
      }
    }

    return uuid.join('');
  };
})();

// A more compact, but less performant, RFC4122v4 compliant solution:
Math.uuid2 = function() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        var r = Math.random()*16|0, v = c == 'x' ? r : (r&0x3|0x8);
            return v.toString(16);
  }).toUpperCase();
};

if (!Object.prototype.extend) {
    Object.defineProperty(Object.prototype, "extend", {
        enumerable : false,
        configurable : true,
        writable : true,
        value : function(source) {
            for (var property in source) {
                this[property] = source[property];}
            return this;
        }
    });
};

if (!Object.prototype.watch) {
    Object.defineProperty(Object.prototype, "watch", {
        enumerable : false,
        configurable : true,
        writable : false,
        value : function(prop, handler) {
            var oldval = this[prop], newval = oldval, getter = function() {
                return newval;
            }, setter = function(val) {
                oldval = newval;
                return newval = handler.call(this, prop, oldval, val);
            };
            if (delete this[prop]) {// can't watch constants
                Object.defineProperty(this, prop, {
                    get : getter,
                    set : setter,
                    enumerable : true,
                    configurable : true
                });
            }
        }
    });
}

// object.unwatch
if (!Object.prototype.unwatch) {
    Object.defineProperty(Object.prototype, "unwatch", {
        enumerable : false,
        configurable : true,
        writable : false,
        value : function(prop) {
            var val = this[prop];
            delete this[prop];
            // remove accessors
            this[prop] = val;
        }
    });
}


toQueryString = function(obj, prefix) {
  var str = [];
  for(var p in obj) {
    if (obj.hasOwnProperty(p)) {
      var k = prefix ? prefix + "[" + p + "]" : p, v = obj[p];
      str.push(typeof v == "object" ?
        toQueryString(v, k) :
        encodeURIComponent(k) + "=" + encodeURIComponent(v));
    }
  }
  return str.join("&");
}

if(!String.prototype.toHtmlElement){
    String.prototype.toHtmlElement = function(){
        var el;
        var _root = document.createElement('div');
            _root.style.display = "none";
            _root.innerHTML = this;
            if(!_root.firstChild || _root.firstChild.nodeType != 1) {
                el = _root;
                el.removeAttribute("style");
            } else {el = _root.firstChild;}
            return el;
    };
}

//Uses createDocumentFragment()
if(!String.prototype.toDomElement){
    String.prototype.toDomElement = function () {
        var wrapper = document.createElement('div');
        wrapper.innerHTML = this.toString();
        var df= document.createDocumentFragment();
            df.appendChild(wrapper);
        return df.firstChild;
    }
}

function getVendorPrefixed(prop){
    var i, 
    s = window.getComputedStyle(document.documentElement, ''), 
    v = ['ms','O','Moz','Webkit'];
    if( prop in s) return prop;
    prop = prop[0].toUpperCase() + prop.slice(1);
    for( i = v.length; i--; )
        if( v[i] + prop in s) return (v[i] + prop);
}

if(!String.prototype.toVendorPrefix){
    String.prototype.toVendorPrefix = function(){
        return getVendorPrefixed(this.toString());
    }
}

if(!String.prototype.htmlEscape){
    String.prototype.htmlEscape = function(){
      return String(this)
                .replace(/&/g, '&amp;',"g")
                .replace(/"/g, '&quot;',"g")
                .replace(/'/g, '&#39;',"g")
                .replace(/</g, '&lt;',"g")
                .replace(/>/g, '&gt;',"g"); 
    }
}

if(!String.prototype.htmlUnescape){
    String.prototype.htmlUnescape = function(){
      return String(this)
                .replace(/&amp;/g, '&',"g")
                .replace(/&quot;/g, '\"',"g")
                .replace(/&#39;/g, '\'',"g")
                .replace(/&lt;/g, '<',"g")
                .replace(/&gt;/g, '>',"g"); 
    }
}

document.createComponent = function(namespace, element, model){
    var Klass = NSRegistry[namespace];
    return new Klass(model,element);
};


/* inspired by https://gist.github.com/1129031 */
/*global document, DOMParser*/
//https://developer.mozilla.org/en-US/docs/Web/API/DOMParser
/*
    parser = new DOMParser();
    doc = parser.parseFromString("<div>asdsda</div>", "text/html");
 */
(function(DOMParser) {
    "use strict";

    var
      proto = DOMParser.prototype
    , nativeParse = proto.parseFromString
    ;

    // Firefox/Opera/IE throw errors on unsupported types
    try {
        // WebKit returns null on unsupported types
        if ((new DOMParser()).parseFromString("", "text/html")) {
            // text/html parsing is natively supported
            return;
        }
    } catch (ex) {}

    proto.parseFromString = function(markup, type) {
        if (/^\s*text\/html\s*(?:;|$)/i.test(type)) {
            var
              doc = document.implementation.createHTMLDocument("")
            ;
                if (markup.toLowerCase().indexOf('<!doctype') > -1) {
                    doc.documentElement.innerHTML = markup;
                }
                else {
                    doc.body.innerHTML = markup;
                }
            return doc;
        } else {
            return nativeParse.apply(this, arguments);
        }
    };
}(DOMParser));

if (!Function.prototype.bind) {
  Function.prototype.bind = function (oThis) {
    if (typeof this !== "function") {
      // closest thing possible to the ECMAScript 5 internal IsCallable function
      throw new TypeError("Function.prototype.bind - what is trying to be bound is not callable");
    }

    var aArgs = Array.prototype.slice.call(arguments, 1), 
        fToBind = this, 
        fNOP = function () {},
        fBound = function () {
            return fToBind.apply(
                        (this instanceof fNOP && oThis) ? this : oThis,
                        aArgs.concat(Array.prototype.slice.call(arguments))
                   );
        };

    fNOP.prototype = this.prototype;
    fBound.prototype = new fNOP();

    fBound.isBound = true;
    fBound.boundedFunction = fToBind;
    return fBound;
  };
};

if (!Function.prototype.debounce) {
    Function.prototype.debounce = function(wait, immediate) {
        var func = this;
        // 'private' variable for instance
        // The returned function will be able to reference this due to closure.
        // Each call to the returned function will share this common timer.
        var timeout;           
    
        // Calling debounce returns a new anonymous function
        return function() {
            // reference the context and args for the setTimeout function
            var context = this, 
            args = arguments;
    
            // this is the basic debounce behaviour where you can call this 
            // function several times, but it will only execute once [after
            // a defined delay]. 
            // Clear the timeout (does nothing if timeout var is undefined)
            // so that previous calls within the timer are aborted.
            clearTimeout(timeout);   
    
            // Set the new timeout
            timeout = setTimeout(function() {
    
                 // Inside the timeout function, clear the timeout variable
                 timeout = null;
    
                 // Check if the function already ran with the immediate flag
                 if (!immediate) {
                   // Call the original function with apply
                   // apply lets you define the 'this' object as well as the arguments 
                   //    (both captured before setTimeout)
                   func.apply(context, args);
                 }
            }, wait);
    
            // If immediate flag is passed (and not already in a timeout)
            //  then call the function without delay
            if (immediate && !timeout) 
                func.apply(context, args);  
         }; 
    }
};

if (!Array.prototype.indexOf) {
    Array.prototype.indexOf = function (searchElement /*, fromIndex */ ) {
        "use strict";
        if (this == null) {
            throw new TypeError();
        }
        var t = Object(this);
        var len = t.length >>> 0;
        if (len === 0) {
            return -1;
        }
        var n = 0;
        if (arguments.length > 1) {
            n = Number(arguments[1]);
            if (n != n) { // shortcut for verifying if it's NaN
                n = 0;
            } else if (n != 0 && n != Infinity && n != -Infinity) {
                n = (n > 0 || -1) * Math.floor(Math.abs(n));
            }
        }
        if (n >= len) {
            return -1;
        }
        var k = n >= 0 ? n : Math.max(len - Math.abs(n), 0);
        for (; k < len; k++) {
            if (k in t && t[k] === searchElement) {
                return k;
            }
        }
        return -1;
    }
};

if(!Array.prototype.toArray){
    Array.prototype.toArray = function(o){
        return [].slice.call(o,0);
    };
};


if("logging" in appconfig && appconfig.logging != true) {
  for(var k in console){
      console[k]=function(){};
  }
};


//extend obj with proto
$C = function(obj, proto){
   for(var key in proto) {
       if (!obj[key]) {
        obj[key] = proto[key];
       }
   };
   return obj;
};

function $CAST(obj, _class, args){
    if (!obj || (typeof obj != "object")) { return obj;}
    if(obj && obj.nodeType==1){
        if (obj.prototype && (obj.prototype instanceof _class)) {
            return obj.prototype;
        }
        else {
            _class = _class||w3c.Element;
            return new _class((args ||{}), obj);
        }
    }
    else {
        if(obj && (obj instanceof _class)) {
            return obj;
        }
        else {
            _class = _class||w3c.Element;
            return new _class((args ||{}), obj);
        }
    }
};

window.getParameterByName = function(name) {
    var match = RegExp('[?&]' + name + '=([^&]*)').exec(window.location.href);
    return match && decodeURIComponent(match[1].replace(/\+/g, ' '));
};



window.onerror = function(message, url, linenumber) {
  try{console.error("JavaScript error: " + message + " on line " + linenumber + " for " + url)}
  catch(e){}
};


;( function() {
    var lastTime = 0;
    var vendors = ['ms', 'moz', 'webkit', 'o'];
    for (var x = 0; x < vendors.length && !window.requestAnimationFrame; ++x) {
        window.requestAnimationFrame = window[vendors[x] + 'RequestAnimationFrame'];
        window.cancelRequestAnimationFrame = window[vendors[x] + 'CancelRequestAnimationFrame'];
    }
    if (!window.requestAnimationFrame)
        window.requestAnimationFrame = function(callback, element) {
            var currTime = new Date().getTime();
            var timeToCall = Math.max(0, 16 - (currTime - lastTime));
            var id = window.setTimeout(function() {
                callback(currTime + timeToCall);
            }, timeToCall);
            lastTime = currTime + timeToCall;
            return id;
        };

    if (!window.cancelAnimationFrame)
        window.cancelAnimationFrame = function(id) {
            clearTimeout(id);
        };
}());




prefix = (function () {
  var styles = window.getComputedStyle(document.documentElement, ''),
    pre = (Array.prototype.slice
      .call(styles)
      .join('') 
      .match(/-(moz|webkit|ms)-/) || (styles.OLink === '' && ['', 'o'])
    )[1],
    dom = ('WebKit|Moz|MS|O').match(new RegExp('(' + pre + ')', 'i'))[1];
  return {
    dom: dom,
    lowercase: pre,
    css: '-' + pre + '-',
    js: pre[0].toUpperCase() + pre.substr(1)
  };
})();


/*
    Copyright © 2013 ΩF:∅ Working Group contributors.
    Permission is hereby granted, free of charge, to any person obtaining a copy of this software and 
    associated documentation files (the "Software"), to deal in the Software without restriction, including 
    without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or 
    sell copies of the Software, and to permit persons to whom the Software is furnished to do so, 
    subject to the following conditions:
    
    The above copyright notice and this permission notice shall be included in all copies or substantial 
    portions of the Software.
    
    THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT 
    LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN 
    NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, 
    WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE 
    SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
*/

; (function(env) {
    var importedFiles={};
    var Class;
    env.NSRegistry = env.NSRegistry||{};
    env.Class = Class = function(){};
        Class.prototype = {
            preInitialize: function(){
                var res = this.initialize.apply(this, arguments);
                this.initializeTraits(arguments);
                return res;
            },
            
            initialize       : function() {return this;},
            
            hasOwnMember : function(key){
                try{return this.constructor.prototype.hasOwnProperty(key)}
                catch(e){return this.hasOwnProperty(key);}
            },
            
            initializeTraits : function(){
                var traits = this["@traits"]||[];
                for(var i=0; i<=traits.length-1; i++){
                    var trait = traits[i];
                    if(typeof trait == "function"){
                        new trait(this,arguments);
                    }
                    else if(trait && trait.initialize) {}
                }
            }
        };
    
    
    env.namespace = function(ns, def){
        if(def && typeof def == "object"){
            def.namespace = ns;
            def.classname = /([a-zA-Z]*)$/.test(ns) ? RegExp.$1:"Anonymous";
        }
        var n = createNS(ns);
        env.NSRegistry[ns] = n[0][n[1]] = def ?
            createClass(def,ns) : {};
    };
    
    
    var createNS = function(aNamespace){
        var scope       = env;
        var parts       = aNamespace.split(/\./g); 
        var classname   = parts.pop();
            
        for (var i = 0; i <= parts.length - 1; i++) {
            scope = scope[parts[i]]||(scope[parts[i]] = {});
        };
        return [scope,classname];
    };
    
    /*var createClass = function(properties){
        if(typeof properties == "function"){return properties}
        var obj = (properties["@inherits"]||Class);
        var traits = (properties["@traits"]||{});
        if (typeof(obj) === "function") {
            var F = function(){}; //optimization
                F.prototype = obj.prototype;
                
            var klass = function() {
                return this.preInitialize.apply(this, arguments);
            };
            klass.prototype = new F();
            inheritProperties(klass.prototype, properties);
            klass.prototype.constructor = klass;
            klass.prototype.ancestor = obj;
            inheritTraits(klass.prototype, traits);
        }
        return klass;
    };*/
    
    var createClass = function(properties, ns){
        if(typeof properties == "function"){return properties}
        loadImports(properties, ns);
        delete properties["@imports"];
        delete properties["@import"];
        var obj = properties["@inherits"];
        //(properties["@inherits"]||Class);
        /*if(!properties["@inherits"] && ("@inherits" in properties) && properties["@imports"]){
            loadImports(properties["@imports"], ns);
            obj = properties["@inherits"];
            alert(properties["@inherits"])
        } else{
            properties["@inherits"] = Class;
            obj = properties["@inherits"];
        }
        delete properties["@imports"];*/
       if(!("@inherits" in properties)) {
           obj = properties["@inherits"] = Class;
       }
       else if(typeof obj == "string") {
           var inheritedNS = obj;
           obj = properties["@inherits"] = (NSRegistry[obj]);
           if(!obj){
               throw new TypeError(ns + " inherits from a class, " +inheritedNS + " - that is not defined")
           }
       }
       else {
           obj = properties["@inherits"] = (properties["@inherits"]);
           if(!obj){
               throw new TypeError(ns + " inherits from a class that is not defined.")
           }
       }
        
        var traits = (properties["@traits"]||{});
        if (typeof(obj) === "function") {
            var F = function(){}; //optimization
                F.prototype = obj.prototype;
                
            var klass = function() {
                return this.preInitialize.apply(this, arguments);
            };
            klass.prototype = new F();
            inheritProperties(klass.prototype, properties);
            klass.prototype.constructor = klass;
            klass.prototype.ancestor = obj;
            inheritTraits(klass.prototype, traits);
        }
        return klass;
    };
    
    var loadImports = function(properties, ns){
        var amdSupported = true;
        var forceImports = false;
        
        if(appconfig && ("AMD" in appconfig) && appconfig.AMD==false){
            amdSupported=false;
        }
        if(!("@forceimports" in properties) || properties["@forceimports"]==false){
            forceImports=false;
        } else {
            forceImports=true;
        }
        if(!amdSupported && !forceImports) {return}

        var imports = properties["@imports"]||properties["@import"]||[];
        for(var i=0; i<=imports.length-1; i++){
           imports[i] = relativeToAbsoluteFilePath(imports[i], ns);
        }
        for(var i=0; i<=imports.length-1; i++) {
            if(importedFiles[imports[i]]) {
               //console.info("@imports from cache:",imports[i]);
               continue;
            } else{
                 var  oXMLHttpRequest = new XMLHttpRequest;
                 oXMLHttpRequest.open("GET", imports[i], false);
                 oXMLHttpRequest.setRequestHeader("Content-type", "text/javascript");
                 oXMLHttpRequest.onreadystatechange  = function() {
                    if (this.readyState == XMLHttpRequest.DONE) {
                        var head   = document.getElementsByTagName("head").item(0);
                        var scripts = head.getElementsByTagName("script");
                        var script = document.createElement("script");
                            script.setAttribute("type", "text/javascript");
                            script.setAttribute("charset", (config.charset || "utf-8"));
                            script.text = this.responseText;
                            head.appendChild(script);
                            //console.info("@imports loaded:",imports[i]);
                            importedFiles[imports[i]]=true;
                    }
                 }
                 oXMLHttpRequest.send(null);
            }
        }
    };
    
    var relativeToAbsoluteFilePath = function(path){
        var apppath = appconfig.apppath? (appconfig.apppath + "/") : "";
        
        if(path.indexOf("~/") >= 0){
            path = path.replace("~/", apppath);
        } else if(path.indexOf("./") >= 0){
            path = path.replace("./", apppath + this.namespace.replace(".","/","g") + "/");
        } 
        else if(path.indexOf("http") == 0){
            return path;//.replace("./", appconfig.apppath + "/" + ns.replace(".","/","g") + "/");
        }
        else{
            if(path.indexOf(appconfig.apppath)<0){
                path = apppath + path
            }
        }
        path = /http:/.test(path)? path : path.replace("//","/");
        return path;
    };
    
    var inheritTraits = function(klass, properties){
        var _traits = properties; 
        if (_traits) {
            var traits = [];
            if (_traits.reverse) {
                traits = traits.concat(_traits.reverse());}
            else {traits.push(_traits);}
            var trait;
            for (var i = 0; (trait = traits[i]); i++) {
                if (typeof trait == "object") {
                    inheritProperties(klass, trait)
                }
            }
        }
        return klass;
    };
        
    var inheritProperties = function(dest, src, fname){
        if (!src || !dest) {return;}
        if (arguments.length === 3) {
            var ancestor    = dest[fname], 
                descendent  = src[fname], 
                method      = descendent;
                
            descendent = function() {
                var ref     = this.parent;
                this.parent = ancestor;
                var result  = method.apply(this, arguments);
                if(ref) {
                    this.parent = ref;
                }
                else { delete this.parent }
                return result;
            };
            descendent.valueOf  = function() { return method;};
            descendent.toString = function() { return method.toString();};
            dest[fname] = descendent;
        }
        else {
            for (var prop in src) {
                if (dest[prop] && typeof(src[prop]) === 'function') { 
                    inheritProperties(dest, src, prop);
                }
                else { dest[prop] = src[prop]; }
            }
        }
        return dest;
    };
})(this);

/*
    Copyright © 2013 ΩF:∅ Working Group contributors.
    Permission is hereby granted, free of charge, to any person obtaining a copy of this software and 
    associated documentation files (the "Software"), to deal in the Software without restriction, including 
    without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or 
    sell copies of the Software, and to permit persons to whom the Software is furnished to do so, 
    subject to the following conditions:
    
    The above copyright notice and this permission notice shall be included in all copies or substantial 
    portions of the Software.
    
    THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT 
    LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN 
    NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, 
    WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE 
    SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
*/

namespace("js.Trait", {
    initialize : function(){}
});

namespace("browser.DeviceInfo");
browser.DeviceInfo = {
    initialize : function () {
        this.browser = this.searchString(this.dataBrowser) || "An unknown browser";
        this.version = this.searchVersion(navigator.userAgent)
            || this.searchVersion(navigator.appVersion)
            || "an unknown version";
        this.OS = this.searchString(this.dataOS) || "an unknown OS";
    },
    searchString: function (data) {
        for (var i=0;i<data.length;i++) {
            var dataString = data[i].string;
            var dataProp = data[i].prop;
            this.versionSearchString = data[i].versionSearch || data[i].identity;
            if (dataString) {
                if (dataString.indexOf(data[i].subString) != -1) {
                    return data[i].identity;
                }
            }
            else 
                if (dataProp) {
                    return data[i].identity;
                }
        }
    },
    searchVersion: function (dataString) {
        var index = dataString.indexOf(this.versionSearchString);
        if (index == -1) {
            return;
        };
        return parseFloat(dataString.substring(index+this.versionSearchString.length+1));
    },
    dataBrowser: [
        {
            string: navigator.userAgent,
            subString: "Chrome",
            identity: "Chrome"
        },
        {   string: navigator.userAgent,
            subString: "OmniWeb",
            versionSearch: "OmniWeb/",
            identity: "OmniWeb"
        },
        {
            string: navigator.vendor,
            subString: "Apple",
            identity: "Safari",
            versionSearch: "Version"
        },
        {
            prop: window.opera,
            identity: "Opera"
        },
        {
            string: navigator.vendor,
            subString: "iCab",
            identity: "iCab"
        },
        {
            string: navigator.vendor,
            subString: "KDE",
            identity: "Konqueror"
        },
        {
            string: navigator.userAgent,
            subString: "Firefox",
            identity: "Firefox"
        },
        {
            string: navigator.vendor,
            subString: "Camino",
            identity: "Camino"
        },
        {       // for newer Netscapes (6+)
            string: navigator.userAgent,
            subString: "Netscape",
            identity: "Netscape"
        },
        {
            string: navigator.userAgent,
            subString: "MSIE",
            identity: "MSIE",
            versionSearch: "MSIE"
        },
        {
            string: navigator.userAgent,
            subString: "Gecko",
            identity: "Mozilla",
            versionSearch: "rv"
        },
        {       // for older Netscapes (4-)
            string: navigator.userAgent,
            subString: "Mozilla",
            identity: "Netscape",
            versionSearch: "Mozilla"
        }
    ],
    dataOS : [
        {
            string: navigator.platform,
            subString: "Win",
            identity: "Windows"
        },
        {
            string: navigator.platform,
            subString: "Mac",
            identity: "Mac"
        },
        {
               string: navigator.userAgent,
               subString: "iPhone",
               identity: "iPhone/iPod"
        },
        {
            string: navigator.platform,
            subString: "Linux",
            identity: "Linux"
        }
    ]
};
browser.DeviceInfo.initialize();


// require EcmaScriptTemplates
// require mustache
// require Kruntch


var Observer = function() {
    this.observations = [];
    this.subscribers  = {};
};
 
var Observation = function(name, func) {
    this.name = name;
    this.func = func;
};
 
Observer.prototype = {
    addEventListener : function(eventName, callback, capture){
        if (!this.subscribers[eventName]) {
            this.subscribers[eventName] = [];}
        this.subscribers[eventName].push(new Observation(eventName, callback));
    },
    
    dispatchEvent : function(eventName, data, scope) {
        scope = (scope||this||window);
        var funcs = this.subscribers[eventName]||[];
            funcs.forEach(function notify_observer(observer) { 
                observer.func.call(scope, data); 
            });  
    },
    
    removeEventListener : function(eventName, callback){
        var subscribers = this.subscribers[eventName]||[];
            subscribers.remove(function(i) {
                return i.name === eventName && i.func === callback;
            });
    }
};


namespace('ui.models.ComponentModel', {
    "@traits": [new Observer],
    
    preInitialize: function(data, element) {
        this.resetListeners();
        this.resetModel(data);
        this.setElement(element);
        this.initialize(data, element);
    },
    
    setElement : function(element){
        this.element = element||this;
    },
    
    initialize : function (data, element) {
        
    },
    
    start: function() {},
    
    resetListeners: function() {
        this.observations = [];
        this.subscribers = {};
    },
    
    resetModel: function(data) {
        this.data = data;
    },
    
    set: function(prop, value) {
        this.data[prop] = value;
        this.dispatchEvent("modelchanged", {
            model: this,
            name: prop
        });
    },
    
    get: function(prop) {
        return this.data[prop]; 
    },
    
    isValid: function() {
        var self = this;
        return true;
    },

    find: function(jsonquery) {
        
    },
    
    registerUI:function(){},
    
    resolve: function(path, obj){
            var scope       = obj||window;
            var nsParts     = path.split(/\./); 
            //console.warn(nsParts)
            for (var i = 0; i <= nsParts.length - 1; i++) {
                    if(i >= nsParts.length - 1) {
                        return scope[nsParts[i]]
                    }
                    else {
                        scope = scope[nsParts[i]];
                   }
                            //console.info(scope)
            };
            return scope; 
    }
});

SimpleTemplateEngine = {
    parseTemplate : function(templateString, data){
        return templateString;
    }
};


namespace("w3c.CSSStyleUtilities");

w3c.CSSStyleUtilities = {
    __getInheritableStylesheets : function(){
        var ancestor    = this.ancestor;
        var classes     = [];
        var ancestors   = [];
        var stylesheets = [];
        
        if(this["@cascade"]) {
            while(ancestor){
                classes.unshift(ancestor.prototype.classname);
                var styles = ancestor.prototype["@stylesheets"]||[];
                //stylesheets = stylesheets.concat(styles)
                    ancestors.unshift(ancestor);
                    for(var i=0; i<=styles.length-1; i++){ 
                        stylesheets.push(styles[i]);     
                    }
                    
                if(ancestor.prototype["@cascade"]) {
                    ancestor = ancestor.prototype.ancestor;
                }
                else { ancestor=null; break; }
            };
            stylesheets = stylesheets.concat(this["@stylesheets"]||[]);
        }
        else {
            stylesheets = ([].concat(this["@stylesheets"]||[]));
        }
        this.classList = classes;
        this.classList.push(this.classname);
        return stylesheets;
    },
    
    loadcss: function(url){
        var self=this;
        var usingSking=false;
        var stylesheets = window.loaded_stylesheets;
        if (!stylesheets) {
            window.loaded_stylesheets = {};
            stylesheets = window.loaded_stylesheets;}
        
        if(stylesheets[url]){self.__onStylesheetLoaded(stylesheets[url]); return;}   
        if((appconfig.skin && stylesheets[appconfig.skin])){
            return;
        }
        if(appconfig.skin && !stylesheets[appconfig.skin]) {url=appconfig.skin; usingSking=true;}
        var something_went_wrong = "Error loading stylesheets. Expected an array of style urls or a single url to a stylesheet for this component.";
        var styles = (url||this["@stylesheets"]);

        if(styles) {
            if(styles instanceof Array) {
                for(var i=0; i<=styles.length-1; i++) {
                    this.loadcss(styles[i]);
                }
            }
            else if(typeof styles === "string" && styles.indexOf("http://") != 0) {
                var path = this.resourcepath(styles);
                var stylenode= document.createElement('style');
                    stylenode.setAttribute("type", 'text/css');
                    stylenode.setAttribute("rel", 'stylesheet');
                    stylenode.setAttribute("href", path);
                    stylenode.setAttribute("media", 'all');
                    stylenode.setAttribute("component", this.namespace||"");
                    //head.appendChild(stylenode);
                    this.appendStyleSheet(stylenode);
                    stylesheets[styles] = stylenode;
                    var oXMLHttpRequest;
                        try{
                            oXMLHttpRequest = new core.http.XMLHttpRequest;
                        } catch(e){
                            oXMLHttpRequest = new XMLHttpRequest;
                        };
                        oXMLHttpRequest.open("GET", path, true);
                        oXMLHttpRequest.setRequestHeader("Content-type", "text/css");
                        oXMLHttpRequest.onreadystatechange  = function() {
                            if (this.readyState == XMLHttpRequest.DONE) {
                                //if (this.status == 200) {
                                    var _cssText = self.cssTransform(this.responseText);
                                    self.setCssTextAttribute(_cssText, stylenode); 
                                    self.__onStylesheetLoaded(stylenode);           
                                //}
                            }
                        }
                        oXMLHttpRequest.send(null);
            }
            else if(styles && styles.indexOf("http:") == 0){
                var cssNode = document.createElement('link');
                cssNode.type = 'text/css';
                cssNode.setAttribute("component", this.namespace||"");
                cssNode.rel = 'stylesheet';
                cssNode.href = this.resourcepath(styles);
                this.appendStyleSheet(cssNode);
                stylesheets[styles] = cssNode;
                self.__onStylesheetLoaded(cssNode);
            }
            else{
                try{console.warn("Unable to resolve path to stylesheet. Invalid uri: '" + styles + "'")} catch(e){}
            }
        }
        else {}
        
    },
    
    cssTransform : function(_cssText){
        var self=this;
        try{
            _cssText = _cssText.replace(/resource\(([A-Z0-9a-z\'\"\s\_\.\/\\\-.]*)\)/img, function(){
                return "url(" + self.resourcepath(arguments[1]) + ")"
            });
        } catch(e){console.warn("CSS parse warning: unable to parse custom css function 'resourcepath()'")}
        return _cssText;
    },
    
    onStylesheetLoaded : function (style){},
    
    __onStylesheetLoaded : function(style){
        this.onStylesheetLoaded(style)
    },
    
    setCssTextAttribute : function(_cssText, stylenode){
        if (stylenode && stylenode.styleSheet) {
            stylenode.styleSheet.cssText = _cssText;
        }
        else {
            stylenode.appendChild(document.createTextNode(_cssText));
        }
    },
    
    resourcepath : function resourcepath(filepath){
        //var nspath = this.namespace.replace(/\./g,"/");
        var apppath = appconfig.apppath||"";
        var path = apppath + filepath.replace("[$theme]", ("themes/"+appconfig.theme));
        return this.relativeToAbsoluteFilePath(path);
    },
    
    relativeToAbsoluteFilePath : function(path){
        var apppath = appconfig.apppath? (appconfig.apppath + "/") : "";
        
        if(path.indexOf("~/") >= 0){
            path = path.replace("~/", apppath);
        } else if(path.indexOf("./") >= 0){
            path = path.replace("./", apppath + this.namespace.replace(".","/","g") + "/");
        } 
        else if(path.indexOf("http") == 0){
            return path;//.replace("./", appconfig.apppath + "/" + ns.replace(".","/","g") + "/");
        }
        else{
            if(path.indexOf(appconfig.apppath)<0){
                path = apppath + path
            }
        }
        path = /http:/.test(path)? path : path.replace("//","/");
        return path;
    },
    
    getStyle : function (styleProp, element) {
        element = element||this.element;
        if (element.currentStyle){
            var y = element.currentStyle[styleProp];
        }
        else if (window.getComputedStyle) {
            var y = document.defaultView.getComputedStyle(element,null).getPropertyValue(styleProp);
        }
        return y;
    },
    
    up : function(classname, element){
        classname = classname.replace(".","");
        element   = element||this.element;
        while(element && !this.hasClass(classname,element)){
            element=element.parentNode;
        };
        return element;
    },
    
    down : function(classname, element){
        element   = element||this.element;
        return this.querySelector(classname, element);
    },
    
    addClass: function(name, element) {
        element = element||this.element;
        
        if (!this.hasClass(name, element)) { 
            element.className += (element.className ? ' ' : '') + name; 
        }
    },
    
    hasClass : function (name, element) {
        element = element || this.element;
      //return ((element || this.element).className.indexOf(classname) >= 0);
        return new RegExp('(\\s|^)'+name+'(\\s|$)').test(element.className);
    },
    
    removeClass : function(name, element){
        element = element||this.element;
        if (this.hasClass(name, element)) {
            element.className = element.className.replace(
                new RegExp('(\\s|^)'+name+'(\\s|$)'),' ').replace(/^\s+|\s+$/g, '');
        }
    },
    
    toggleClass : function(className, element){
        element = element||this.element;
        if(this.hasClass(className,element)) {
            this.removeClass(className,element)
        }
        else{
            this.addClass(className,element)
        }
    },
    
    createStyleDocument : function (callback) {
        window.loadedstylesheets = window.loadedstylesheets||{};
        if(window.loadedstylesheets[this.namespace]) {
            return;
        }
        var cssCode         = (this.cssText && this.cssText.indexOf("<%") >= 0) ?
            this.parseTemplate(this.cssText,{}):
            this.cssText;
            
        if(!cssCode || cssCode.length <= 0) { return };
        this.stylesheet = document.createElement('style');
        this.stylesheet.setAttribute("type", 'text/css');
        this.stylesheet.setAttribute("rel", 'stylesheet');
        this.stylesheet.setAttribute("component", this.namespace||"");
        
        
        if (this.stylesheet.styleSheet) {
            this.stylesheet.styleSheet.cssText = cssCode;
        }
        else {
            this.stylesheet.appendChild(document.createTextNode(cssCode));
        }
        this.appendStyleSheet(this.stylesheet)
        window.loadedstylesheets[this.namespace] = true;
        return this.stylesheet;
    },
    
    appendStyleSheet : function(stylesheet){
        var headNode        = application.head;
        var configscript    = application.configscript;
        headNode.insertBefore(stylesheet, configscript);
    }
};


namespace("w3c.CSSSelectors");

w3c.CSSSelectors = {
    querySelectorAll : function(cssSelector, element){
        element = element || this.element;
        if(document.querySelectorAll) {
            return [].toArray(element.querySelectorAll(cssSelector))}
        else {
            throw new Error("'#querySelectorAll()' api not defined")
        }
    },
    
    querySelector : function(cssSelector, element){
        element = element || this.element;
        if(document.querySelector) {
            return element.querySelector(cssSelector);}
        else {
            throw new Error("'#querySelector()' api not defined");
        }
    }
};



namespace("w3c.Node", {
    '@traits': [w3c.CSSSelectors],
    
    preInitialize : function(model, element){
        this.element = element;
        this.model   = model;
        this.initialize(model, element)
    },
    
    initialize : function(model, element){
        
    },
    
    addEventListener : function(type, callback, capture, element){
        capture = (typeof capture == "boolean") ? capture : false;
        element = element||this.element;
        if(callback && !callback.isBound) {
            callback = callback.bind(this);
        }
        
        return element.addEventListener(type, callback, capture);
    },
    
    removeEventListener : function(type, callback, capture, element){
        element = element||this.element;
        return element.removeEventListener(type, callback, capture)
    },
    
    /*addEventDelegate : function(className, type, callback, capture){
        var self = this;
        className = className.replace(".","");
        if(!this.delegates) {
            this.delegates={}
        };
        if(!this.delegates[type]) {
            this.delegates[type]=[]
        };
        this.delegates[type].push({
            className:className,
            callback:callback,
            capture:capture
        });
        
        this.addEventListener(type, function(e){
            if(!self.delegates[type]) { return }
            else {
                var handlers = self.delegates[type];
                for(var i=0; i<=handlers.length-1; i++) {
                    var handler = handlers[i];
                    if(e.target && self.hasClass(handler.className, e.target)) {
                        handler.callback(e);
                    }
                }
            }
        }, capture);
    },*/
    
    dispatchEvent : function(type, bubbles, cancelable, eventdata, element){
        element     = element||this.element;
        bubbles     = (typeof bubbles    == "boolean") ? bubbles    : true;
        cancelable  = (typeof cancelable == "boolean") ? cancelable : true;
        var evt     = document.createEvent("Event");
        evt.initEvent(type, bubbles, cancelable);
        evt.data    = eventdata;
        
        element.dispatchEvent(evt);
        return evt;
    },
    
    createEvent : function(type, bubbles, cancelable, eventdata){
        bubbles     = (typeof bubbles    == "boolean") ? bubbles    : true;
        cancelable  = (typeof cancelable == "boolean") ? cancelable : true;
        var evt     = document.createEvent("Event");
            evt.initEvent(type, bubbles, cancelable);
            evt.data= eventdata;
        return evt;
    },
    
    
    parentNode: function(element){
        element = element||this.element;
        return element.parentNode;
    },
    
    childNodes: function(element){
        element = element||this.element;
        return element.childNodes;
    },
    
    firstChild: function(element, elementOnly){
        element = element||this.element;
        var fc = element.firstChild;
        if(elementOnly) {
            while (fc&&fc.nodeType != 1) {
                fc = fc.nextSibling;
            }
        }
        return fc;
    },
    
    lastChild: function(element, elementOnly){
        element = element||this.element;
        var lc = element.lastChild;
        if(elementOnly) {
            while (lc.nodeType != 1) {
                lc = lc.previousSibling;
            }
        }
        return lc;
    },
    
    hasChildNode : function (child, parent) {
        parent = parent||this.element;
        if (parent === child) { 
            return false; 
        }
        while (child && child !== parent) { 
            child = child.parentNode; 
        }
       return child === parent;
    },
    
    previousSibling: function(element, elementOnly){
        element = element || this.element;
        element = element.previousSibling;
        var args = arguments;
        if(elementOnly) {
            while (element && element.nodeType != 1) {
                element = element.previousSibling
            }
        }
        return element;
    },
    
    nextSibling: function(element, elementOnly){
        element = element || this.element;
        element = element.nextSibling;
        if(elementOnly) {
            while (element && element.nodeType != 1) {
                element = element.nextSibling
            }
        }
        return element;
    },
    
    attributes: function(){
        element = element || this.element;
        return element.attributes;
    }, //NamedNodeMap
    
    ownerDocument: function(element){
        element = element || this.element;
        return element.ownerDocument;
    },
    
    insertBefore: function(newNode, refNode){
        var el = refNode||this.element;
        return el.parentNode.insertBefore(newNode, el);
    },
    
    insertAfter : function(newNode, refNode) {
        var el = refNode||this.element;
        return el.parentNode.insertBefore(newNode, this.nextSibling(el));
    },
    
    swapNode : function(b) {
        var a = this.element;
        var t = a.parentNode.insertBefore(document.createTextNode(""), a);
        b.parentNode.insertBefore(a, b);
        t.parentNode.insertBefore(b, t);
        t.parentNode.removeChild(t);
        return this;
    },
    
    replaceChild : function(newChild, oldChild){
        oldChild = oldChild||this.element;
        return oldChild.parentNode.replaceChild(newChild, oldChild);
    },
    
    removeChild : function(element){
        element = element||this.element;
        return element.parentNode.removeChild(element);
    },
    
    appendChild : function(child, slot, element){
        element = element||this.element;
        slot = (typeof slot === "string") ? this.querySelector(slot) : slot;
        slot = (slot)? slot:element;
        slot.appendChild((child instanceof w3c.Node || child.element) ? child.element:child);
        return child;
    },
    
    hasChildNodes: function(){
        return (this.childNodes().length > 0);
    },
    
    cloneNode : function(deep){
        deep = (typeof deep !== "undefined")? deep:true;
        return new this.constructor({}, this.element.cloneNode(deep));
    },
    
    getBoundingClientRect : function(element) {
        element = element||this.element;
        if (element.getBoundingClientRect) {
            // (1)
            var box = element.getBoundingClientRect();
            
            var body    = document.body
            var docElem = document.documentElement
            
            // (2)
            var scrollTop   = window.pageYOffset || docElem.scrollTop || body.scrollTop;
            var scrollLeft  = window.pageXOffset || docElem.scrollLeft || body.scrollLeft;
            
            // (3)
            var clientTop   = docElem.clientTop || body.clientTop || 0
            var clientLeft  = docElem.clientLeft || body.clientLeft || 0
            
            // (4)
            var top  = box.top  + (scrollTop  - clientTop);
            var left = box.left + (scrollLeft - clientLeft);
            
            return { 
                top: Math.round(top), 
                left: Math.round(left),
                right:  Math.round(box.right),
                bottom:  Math.round(box.bottom),
                width : Math.round(box.right - left),
                height: Math.round(box.bottom - top)
            }
        }
        else {
            //console.warn(this.namespace + "#getBoundingClientRect() - not supported by 'this.element' node on this device.")
            var top=0, left=0, right=0, bottom=0, width=0, height=0;
            while(element) {
                top  = top  + parseInt(element.offsetTop, 10);
                left = left + parseInt(element.offsetLeft,10);
                right = left + element.offsetWidth;
                bottom = top + element.offsetHeight;
                width = element.offsetWidth;
                height = element.offsetHeight;
                element = element.offsetParent;       
            };
            return {top: top, left: left, right:right, bottom:bottom, width:width, height:height};
        }
    },
    
    hittest : function(component) {
        if(!component){ return false }
        var compare,bounds;
        if( component instanceof w3c.Node){
            compare = component.getBoundingClientRect();
        }
        else if(component && ("left" in component) && ("top" in component)){
            compare = component;
        }
        else {
            throw new Error(this.namespace + "#hittest(component); expected an instance of\
            w3c.Node or {top:<int>, left:<int>}");
        }
        bounds = this.getBoundingClientRect();
        return (compare.left > bounds.left && compare.top > bounds.top && compare.left < bounds.right && compare.top < bounds.bottom);
    },
    
    getAttribute : function(attrName, element){
        element = element||this.element;
        if(element && typeof element == "string") {
            element = this.querySelector(element)||this.element;
        }
        var val = element.getAttribute(attrName);
        if(isNaN(val) == false && (/^\d+$/.test(val))) {
            return parseInt(val, 10);
        } else {
            return val;
        }
    }
});


namespace("w3c.HtmlComponent", {
    '@inherits':    w3c.Node,
    '@cascade' :    false,
    '@traits'  :    [w3c.CSSStyleUtilities],
    '@model'   :    ui.models.ComponentModel,
    '@stylesheets': [],
    '@htmlparser' : SimpleTemplateEngine,
    
    preInitialize : function(model, element, domready_func) {
        try {
            var self=this;
            if(element && element.prototype instanceof w3c.Node){return;}
            this.setDomReadyCallback(domready_func);
            this.onHashChanged_Handler = this.onHashChanged.bind(this);
            this.onPreRender(model, element);
            this.setModel(model);
            this.setElement(element);
            this.setPrototypeInstance();
            this.setNamespace();
            this.setUUID();
            this.rerouteEvents();
            this.setStyleDocuments();
            this.renderDOMTree();
            
            // this.initializeChildComponents();
            // this.initialize(this.model, this.element);
        } 
        catch(e){
            var msg = this.namespace + ".prototype.preInitialize() - " + e.message;
            try{console.error(msg, this)} catch(e){};
        }
        return this;
    },
    
    initialize : function() { return this },
    
    setDomReadyCallback : function(cb){
        this.domReadyHandler = cb;
    },
    
    onDomReady : function(el){
        this.onRender(this.model, this.element);
        
        if(this.domReadyHandler){
            this.domReadyHandler(el, this);
        }
        try{
            this.initializeChildComponents();
            this.initializeTraits(this.model);
            this.initialize(this.model, this.element);
        }catch(e){
            var msg = this.namespace + ".prototype.preInitialize() - " + e.message;
            try{console.error(msg)} catch(e){};
        }
    },

    
    setStyleDocuments : function(){
        this.createStyleDocument();
        this.setClassList();
        this.loadcss(this.__getInheritableStylesheets());
    },
    
    getComponentByQuery : function(cssSelector){
        var el = this.querySelector(cssSelector);
        return (el)? el.prototype:el;
    },
    
    onPreRender : function(model, element){},
    
    onRender: function(componentModel, componentElement){
        this.dispatchEvent("rendered",true,true,{});
    },
    
    dispose : function(){
        application.removeEventListener("statechanged", this.onHashChanged_Handler, false);
    },
    
    setClassList : function(){
        //classList is defined in w3c.CSSStyleUtilities.__getInheritableStylesheets();
        if(!this.classList){
            var ancestor    = this.ancestor;
            var classes     = [];
            var ancestors   = [];
            var stylesheets = [];
            
            if(this["@cascade"]) {
                while(ancestor){
                    classes.unshift(ancestor.prototype.classname);
                    ancestor = (ancestor.prototype["@cascade"])?
                        ancestor.prototype.ancestor:null;
                    if(!ancestor) break;
                }
            }
            this.classList = classes;
            this.classList.push(this.classname);
        }
        if(!this["@cascade"]) {
            this.addClass(this.classname);
        }
        else {
            this.addClass(this.classList.join(" "), this.element);
        }
    },
    
    initializeChildComponents : function(el){
        el = el||this;
        var self=this;
        this.components = {};
        var _childNodes = el.querySelectorAll("*[namespace]");
            for(var i=0; i<=_childNodes.length-1; i++){
                var node = _childNodes[i];
                if(!node || node.nodeType != 1) { continue };
                if(node.prototype && (node.prototype instanceof w3c.Node)){continue};
                if(node.inProgress) {continue};
                node.inProgress=true;
                var ns      = node.getAttribute("namespace");
                var Class   = NSRegistry[ns];
                var cid     = node.getAttribute("name");
                var f = function(el){};
                if(Class && node) {
                    var component = new Class(null, node, f);
                    self.components[cid] = component;
                }
            };
    },
    
    onHashChanged : function(e){
        
    },
    
    rerouteEvents : function(){
        var self=this;
        application.addEventListener("statechanged", this.onHashChanged_Handler, false);
        
        this.addEventListener("mouseover", function(e){
            var relTarget = e.relatedTarget;
            if (self.element === relTarget || self.hasChildNode(relTarget)){ return; }
            else{ self.dispatchEvent("hoverover", true, true, {})}
        }, true);
        
        this.addEventListener("mouseout", function(e){
            var relTarget = e.relatedTarget;
            if (self.element === relTarget || self.hasChildNode(relTarget)){ return; }
            else{ self.dispatchEvent("hoverout", true, true, {})}
        }, true);
    },
    
    zIndex : function(element){
        element = element||this.element;
        if(!this.globalzindex){this.globalzindex=0};
        this.globalzindex = this.globalzindex + 1;
        return this.globalzindex;
    },
    
    nodeIndex : function(){
        var index = -1;
        var nodes = this.element.parentNode.childNodes;
        for (var i = 0; i<=nodes.length-1; i++) {
            if(!nodes[i] || nodes[i].nodeType != 1){continue}
            index++;
            if (nodes[i] == this.element){break;}
        }
        return index;
    },
    
    parentComponent : function(element){
        element = element||this.element;
        var parent = element.parentNode;
        while(parent){
            if(parent && parent.prototype && parent.getAttribute("namespace")){
                break;
            } else {
                parent = parent.parentNode;
            }
        }
        return parent;
    },
    
    offset : function(elem) {
        elem = elem||this.element;;
    
        var x = elem.offsetLeft;
        var y = elem.offsetTop;
    
        while (elem = elem.offsetParent) {
            x += elem.offsetLeft;
            y += elem.offsetTop;
        }
    
        return { left: x, top: y };
    },

    /*setID : function(id){
        id = id||this.get("id");
        this.id = id;
        this.element.setAttribute("id", id);
    },*/
    
    innerHTML : "<div></div>",
    
    setModel : function(jsonobj) {
        jsonobj = jsonobj||{};
        this.model = (jsonobj && jsonobj instanceof this["@model"]) ?
            jsonobj : new this["@model"](jsonobj||{}, this.element);
        return this.model;
    },
    
    setElement : function(element){
        var canvas, el;
        el = this.element = element||document.createElement("div");
        if(this.element.prototype){return this.element;}
        return this.element;
    },
    
    renderDOMTree : function(){
        var el = this.element;
        var self=this;
        
        var canvas = this.querySelector(".canvas")||this.firstChild(null,true);
        this.canvas = canvas;
        
        if(el.childNodes.length<=0 || !canvas){
            if(!canvas){
                canvas=document.createElement("div"); 
                el.appendChild(canvas);  
            }
            this.canvas = canvas;
         
            //var path = el.getAttribute("href")||this["@href"];
            var path = this.constructor.prototype["@href"];
            if(path) {
                var oXMLHttpRequest;
                try{
                    oXMLHttpRequest = new core.http.XMLHttpRequest;
                } catch(e){
                    oXMLHttpRequest = new XMLHttpRequest;
                };
                    path = (typeof path=="string")?this.relativeToAbsoluteFilePath(path):path;
                    oXMLHttpRequest.open("GET", path, true);
                    oXMLHttpRequest.setRequestHeader("Content-type", "text/plain");
                    oXMLHttpRequest.onreadystatechange  = function() {
                        if (this.readyState == XMLHttpRequest.DONE) {
                            //if (this.status == 200) {
                                var htmltext = this.responseText;
                                self.constructor.prototype.innerHTML = htmltext;
                                self.constructor.prototype["@href"]=null;
                                var view = self.parseElement();
                                canvas.appendChild(view);
                                self.innerHTML=canvas.outerHTML;
                                self.onDomReady(el);          
                            //}
                        }
                    }
                    oXMLHttpRequest.send(null);
            } else {
               var view = this.parseElement();
               canvas.appendChild(view);
               self.onDomReady(el);
            }
        }
        else {
            self.onDomReady(el);
        }
        
        this.addClass("canvas", canvas);
        return el;
    },
    
    setUUID : function(){
        var uuid = Math.uuid(16);
        this.cuuid = uuid; // "c" for control
        this.element.setAttribute("cuuid", uuid);
    },
    
    setNamespace : function(){
        this.element.setAttribute("namespace", this.namespace);
    },
    
    getNamespace : function(){
        return this.element.getAttribute("namespace");
    },
    
    getPrototypeInstance : function(){
        return this.element.prototype;
    },
    
    setPrototypeInstance : function(){
        this.element.prototype = this;
    },
    
    get : function(key){
        return this.model.get(key)
    },
    
    set : function(key,val) {
        this.model.set(key,val);
    },
    
    getTemplateParser : function(){
       return this["@htmlparser"];
    },
    
    parseTemplate : function (template, _json) {
        var engine = this.getTemplateParser();
        if(!"parseTemplate" in engine){
            throw new Error("parseTemplate(templateString, data) method not implemented by the Template Engine api", engine);
        }
        return (engine.parseTemplate(template,this.model.data) || "");
    },

    parseElement : function (template, json){
        var templateString = (typeof this.innerHTML === "function") ?
            this.innerHTML() : this.innerHTML;
            
         var html = this.parseTemplate(templateString, json);
         if (html && html.length > 0) {return html.toHtmlElement()}
         else {
            throw new Error(this.namespace + "#parseElement(template, json). Invalid xhtml generated from 'template' string. Value of 'html' is: "+ html);
         }
    },
    
    resetzindex : function(){
        this.element.style["zIndex"] = 0;
    },
    
    cloneNode : function() {
        var elm   = this.element.cloneNode(true);
        var model = {}.extend(this.model.model);//js.extend({},this.model.model);
        var clone = new this.constructor(model||{},elm);
        return clone;
    },
    
    bind : function(accessor, events){
        this.set(accessor);     
        var self=this;                          //STEP 1: Update self using accessor
        accessor.model.addEventListener("changed:" + accessor.jsonpath,function(){  //STEP 2: listen to data model for changes
            self.set(accessor);
        },false);
        
        if(events) {                                            //STEP 3: is it 2-way binding?
            events = [].concat(events);                             //step a: foreach dom event[] (ex: 'keyup')
            for(var i=0; i<=events.length-1; i++){                      //step b: add listener
                this.addEventListener(events[i], function(e){
                    accessor.set(self.get(accessor.jsonpath, accessor, e));                     //step c: update accessor
                },false);
            }
        }
     },
     
    set : function(accessor){},
    
    get : function(keypath, accessor, e){},
    
    relativeToAbsoluteFilePath : function(path){
        var apppath = appconfig.apppath? (appconfig.apppath + "/") : "";
        
        if(path.indexOf("~/") >= 0){
            path = path.replace("~/", apppath);
        } else if(path.indexOf("./") >= 0){
            path = path.replace("./", apppath + this.namespace.replace(".","/","g") + "/");
        } 
        else if(path.indexOf("http") == 0){
            return path;//.replace("./", appconfig.apppath + "/" + ns.replace(".","/","g") + "/");
        }
        else{
            if(path.indexOf(appconfig.apppath)<0){
                path = apppath + path
            }
        }
        path = /http:/.test(path)? path : path.replace("//","/");
        return path;
    }
});



namespace("ui.Application", 
{
    '@inherits' : w3c.HtmlComponent,
    '@stylesheets' : [
       "resources/css/reset.css",
       "resources/css/framework.css"
    ],
    
    
    preInitialize : function(model, element) {
        window.application  = this;
        this.head           = document.getElementsByTagName("head")[0];
        this.configscript   = document.querySelector("script[id='config']")||
                              document.querySelector("script");
        
        if(window.addEventListener){
            window.addEventListener ("load", this.onLoad.bind(this), true);
            window.addEventListener ("hashchange", this.onLocationHashChanged.bind(this), true);
        }
        this.parent(model, element);
        this.setSpinner();
        this.showSpinner();
        this.setBrowserClassname();
        return this;
    },
    
    setSpinner : function (){
        var el = '<div class="bubblingG">\
                    <span id="bubblingG_1"></span>\
                    <span id="bubblingG_2"></span>\
                    <span id="bubblingG_3"></span>\
                  </div>'.toHtmlElement();
        this.spinner = el;
    },
    
    getSpinner : function (){
        return this.spinner.cloneNode(true);
    },
    
    showSpinner: function(){
        var el = this.getSpinner();
        this.currentSpinner = el;
        this.element.appendChild(el);
    },
    
    onLoad : function onLoad(e) {
        var self=this;
        var canvas=this.canvas;//this.querySelector(".canvas");
        var spinner = this.currentSpinner;
        setTimeout(function(){
            canvas.style.visibility="visible";
            canvas.style.opacity=1;
            self.removeChild(spinner);
            self.dispatchEvent("loaded", false, false, {event:e});
            self.doHashChangedEvent(e);
        }.bind(this),appconfig.foucdelay||1000)
    },
    
    doHashChangedEvent : function(){
        var hash = location.hash.substring(1);
        if(hash && hash.length > 0) {
            this.onLocationHashChanged(location);
        }
    },
    
    onLocationHashChanged : function(e){
        this.dispatchEvent("statechanged", false, false, {event:e})
    },
    
    generateSkin : function(){
        var skin = "";
        var a = [].toArray(document.getElementsByTagName("style"))
        
        for(var i=0; i<=a.length-1; i++){
            if(!a[i].getAttribute("component")) {continue;}
            skin += a[i].innerHTML
        }
        console.log(skin)
    },
    
    setBrowserClassname : function(){
        try {
            this.addClass(browser.DeviceInfo.OS, document.body);
            this.addClass(browser.DeviceInfo.browser, document.body);
            document.body.setAttribute("browser", browser.DeviceInfo.browser);
            document.body.setAttribute("os", browser.DeviceInfo.OS);
            this.addClass("application")
        } catch(e) {
            try{
                console.warn("There was a problem setting the agent/device information on the <body> tag.")
                console.warn(" |--> " + e.message)
            } catch(e){}
        }
    },
    
    globalzindex : 600000,
    
    absoluteZindex : function(nodeReference){
        this.globalzindex = this.globalzindex + 1;
        return this.globalzindex;
    },

    
    innerHTML:"<div></div>",
    
    cssText:
    'body > .canvas {\
        visibility: hidden;\
        opacity: 0;\
        transition: opacity 2s;\
        -webkit-transition:opacity 2s;\
        -o-transition:opacity 2s;\
        -moz-transition:opacity 2s;\
        -ms-transition:opacity 2s;\
    }'
});

// require ui.input.Field
// require ui.input.Calendar
// require ui.input.TextField
// require ui.input.TextArea
// require ui.input.DatePicker
// require ui.input.CheckBox
// require ui.input.Radio
// require ui.input.DropDown
// require ui.input.Button
// require ui.input.MenuButton
// require ui.input.ButtonGroup
// require ui.input.RadioGroup
// require ui.input.ToggleSwitch
// require ui.output.ProgressBar
// require ui.input.NumericStepper
// require ui.output.Cube
// require ui.input.Slider
// require ui.input.Scale
// require ui.input.SelectBox
// require ui.input.StarRating
// require ui.containers.DataGrid
// require ui.containers.Accordion
// require ui.containers.TreeView
// require ui.containers.Shelf
// require ui.containers.Dropdown
// require ui.containers.Card
/*
    Copyright © 2013 ΩF:∅ Working Group contributors.
    Permission is hereby granted, free of charge, to any person obtaining a copy of this software and 
    associated documentation files (the "Software"), to deal in the Software without restriction, including 
    without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or 
    sell copies of the Software, and to permit persons to whom the Software is furnished to do so, 
    subject to the following conditions:
    
    The above copyright notice and this permission notice shall be included in all copies or substantial 
    portions of the Software.
    
    THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT 
    LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN 
    NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, 
    WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE 
    SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
*/

document.addEventListener("DOMContentLoaded", function(){ 
    function bootup(){
        var timerId;
        var Application = NSRegistry[window.appconfig.namespace];
        if( Application) {
            timerId && clearTimeout(timerId);
            window.application = new Application(window.appconfig, document.body);
        }
        else { timerId = setTimeout(bootup,200) }
    };  
    
    bootup();
}, false);




namespace("framework",
{
    '@inherits': ui.Application,
    '@stylesheets' : [
        "reset.css", 
        "framework.css"
    ],
    
    initialize : function(){
        try{console.info("Framework Successfully Initialized")} catch(e){};
    }
});