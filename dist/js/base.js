;
(function(root, factory) {
    if (typeof exports === 'object' && exports) {
        // commonjs
        factory(module.exports);
    } else {
        var Base = {};
        factory(Base);
        if (typeof define === 'function' && define.amd) {
            // AMD
            define(Base);
        } else {
            // script
            //console.log(window.Base);
            root.Base = root.thisBase = Base;
        }
    }
})(this, function(Base, undefined) {
    //Array.forEach implementation for IE support..
    //https://developer.mozilla.org/en/JavaScript/Reference/Global_Objects/Array/forEach
    if (!Array.prototype.forEach) {
        Array.prototype.forEach = function(callback, thisArg) {
            var T, k;
            if (this == null) {
                throw new TypeError(" this is null or not defined");
            }
            var O = Object(this);
            var len = O.length >>> 0; // Hack to convert O.length to a UInt32
            if ({}.toString.call(callback) != "[object Function]") {
                throw new TypeError(callback + " is not a function");
            }
            if (thisArg) {
                T = thisArg;
            }
            k = 0;
            while (k < len) {
                var kValue;
                if (k in O) {
                    kValue = O[k];
                    callback.call(T, kValue, k, O);
                }
                k++;
            }
        };
    }
    /**
     * [hasClass 是否含有指定class]
     * @param  {[type]}  dom       [目标dom]
     * @param  {[type]}  className [className]
     * @return {Boolean}           [true or false]
     */
    Base.hasClass = function(dom, className) {
        var result = dom.className.match(new RegExp('(\\s|^)' + className + '(\\s|$)'));
        if (result) {
            return true;
        } else {
            return false;
        }
    }
    /**
     * [addClass 添加class]
     * @param {[type]} dom       [目标元素]
     * @param {[type]} className [添加class]
     */
    Base.addClass = function(dom, className) {
        if (!Base.hasClass(dom, className)) dom.className += " " + className;
    }
    /**
     * [removeClass 删除指定class]
     * @param  {[type]} dom       [dom]
     * @param  {[type]} className [class名称]
     */
    Base.removeClass = function(dom, className) {
        if (Base.hasClass(dom, className)) {
            var reg = new RegExp('(\\s|^)' + className + '(\\s|$)');
            dom.className = dom.className.replace(reg, ' ');
        }
    }
    /**
     * [del_ff 删除空格等节点]
     * @param  {[type]} elem [目标 dom]
     * @return {[type]}      [返回去除空格节点的dom]
     */
    Base.html = function(elem, value) {
        if (!value) {
            var resultHtml = elem.innerHTML;
            return resultHtml;
        } else {
            elem.innerHTML = elem.innerHTML + value;
        }
    }
    /**
     * [css 获取或添加css属性]
     * @param  {[type]} elem  [description]
     * @param  {[type]} value [description]
     * @return {[type]}       [description]
     */
    Base.css = function(elem, value) {
        function endsWith(str, filter) {
            var stratLen = str.length - filter.length;
            return stratLen >= 0 && str.indexOf(filter, stratLen) == stratLen; //str.indexOf(filter, stratLen) 匹配位置是否等于差值
        }
        if (value) {
            var oldCss = elem.style.cssText;
            if (oldCss) {
                if (!endsWith(oldCss, ';')) {
                    oldCss += ';';
                }
                value = oldCss + value;
            }
            if (!endsWith(value, ';')) {
                value += ';';
            }
            elem.style.cssText = value;
        } else {

            return elem.style.cssText;
        }
    }
    /**
     * [del_ff 删除空格节点]
     * @param  {[type]} elem
     * @return {[type]}
     */
    Base.del_ff = function(elem) {
        var elem_child = elem.childNodes;
        for (var i = 0; i < elem_child.length; i++) {
            if (elem_child[i].nodeName == "#text" && !/\s/.test(elem_child.nodeValue)) {
                elem.removeChild(elem_child)
            }
        }
        return elem;
    }
    /**
     * [requestAnimationFrame 简单动画]
     * @return {[type]} [description]
     */
    Base.requestAnimationFrame = function(fn, isFlag) {
        var lastTime = 0,
            vendors = ['webkit', 'moz'];
        for (var x = 0; x < vendors.length && !window.requestAnimationFrame; ++x) {
            window.requestAnimationFrame = window[vendors[x] + 'RequestAnimationFrame'];
            window.cancelAnimationFrame = window[vendors[x] + 'CancelAnimationFrame'] || // Webkit中此取消方法的名字变了
            window[vendors[x] + 'CancelRequestAnimationFrame'];
        }
        if (!window.requestAnimationFrame) {
            window.requestAnimationFrame = function(callback, element) {
                var currTime = new Date().getTime();
                var timeToCall = Math.max(0, 16.7 - (currTime - lastTime));
                var id = window.setTimeout(function() {
                    callback(currTime + timeToCall);
                }, timeToCall);
                lastTime = currTime + timeToCall;
                return id;
            };
        }
        if (!window.cancelAnimationFrame) {
            window.cancelAnimationFrame = function(id) {
                clearTimeout(id);
            };
        }
        if (!isFlag || isFlag == "start") {
            window.requestAnimationFrame(fn);
        }
        if (isFlag == "stop") {
            window.cancelAnimationFrame(fn);
        }
    }
    /**
     * 拖拽
     * @param  element 拖拽元素
     * @param  limitElem  限制范围
     * @param  callback  回调
     */
    Base.funDrag = function(element, limitElem, callback) {
        var params = {
            left: 0,
            top: 0,
            currentX: 0,
            currentY: 0,
            flag: false,
            limitFlag: false
        };
        //相关判断
        if (!Base.isDOM(element)) return;
        if (limitElem) {
            if (Base.isDOM(limitElem)) {
                var limitLeft = limitElem.offsetLeft,
                    limitTop = limitElem.offsetTop,
                    limitMaxLeft = limitElem.offsetWidth + limitLeft,
                    limitMaxTop = limitElem.offsetHeight + limitTop;
            }
            if (limitElem == document) {
                var limitLeft = 0,
                    limitTop = 0,
                    limitMaxLeft = document.documentElement.clientWidth + limitLeft,
                    limitMaxTop = document.documentElement.clientHeight + limitTop;
            }
            params.limitFlag = true;
        }
        if (limitElem && Base.isFunction(limitElem)) {
            callback = limitElem;
        }
        callback = callback || function() {};
        //拖拽的实现
        if (Base.getStyle(element, "left") !== "auto") {
            params.left = Base.getStyle(element, "left");
        }
        if (Base.getStyle(element, "left") == "auto") {
            params.left = element.offsetLeft;
        }
        if (Base.getStyle(element, "top") !== "auto") {
            params.top = Base.getStyle(element, "top");
        }
        if (Base.getStyle(element, "top") == "auto") {
            params.left = element.offsetTop;
        }
        var dragDown = function(event) {
            Base.stopDefault(event);
            params.flag = true;
            event = event || window.event;
            var touch = event.touches ? event.touches[0] : {};
            params.currentX = touch.clientX || event.clientX;
            params.currentY = touch.clientY || event.clientY;
            Base.event(document, "mousemove", dragMove);
            Base.event(document, "touchmove", dragMove);
            Base.event(element, "mouseup", dragUp);
            Base.event(element, "touchend", dragUp);
        }
        Base.event(element, "touchstart", dragDown);
        Base.event(element, "mousedown", dragDown);
        var dragUp = function(event) {
            Base.stopDefault(event);
            params.flag = false;
            if (Base.getStyle(element, "left") !== "auto") {
                params.left = Base.getStyle(element, "left");
            }
            if (Base.getStyle(element, "top") !== "auto") {
                params.top = Base.getStyle(element, "top");
            }
            //callback();
            callback.call(elem, event);
            Base.removeEvent(document, "touchmove", dragMove);
            Base.removeEvent(document, 'mousemove', dragMove);
            Base.removeEvent(element, "touchend", dragUp);
            Base.removeEvent(element, 'mouseup', dragUp);
            return false;
        }
        var dragMove = function(event) {
            Base.stopDefault(event);
            event = event || window.event;
            if (params.flag) {
                var touch = event.touches ? event.touches[0] : {};
                var nowX = touch.clientX || event.clientX,
                    nowY = touch.clientY || event.clientY;
                var disX = nowX - params.currentX,
                    disY = nowY - params.currentY;
                var finLeft = parseInt(params.left) + disX,
                    finRight = parseInt(params.top) + disY;
                if (params.limitFlag) {
                    var elemWidth = element.offsetWidth,
                        elemHeight = element.offsetHeight;
                    if ((finLeft + elemWidth) >= limitMaxLeft) {
                        finLeft = limitMaxLeft - elemWidth;
                    }
                    if (finLeft < limitLeft) {
                        finLeft = limitLeft;
                    }
                    if ((finRight + elemHeight) >= limitMaxTop) {
                        finRight = limitMaxTop - elemHeight;
                    }
                    if (finRight < limitTop) {
                        finRight = limitTop;
                    }
                }
                element.style.left = finLeft + "px";
                element.style.top = finRight + "px";
            }
        }
    };
    /**
     * 摘自张鑫旭，抛物线
     * @param  element : 初始dom
     * @param  target  : 结束dom
     * @param  options : 配置选项
     */
    Base.funParabola = function(element, target, options) {
        /*
         * 网页模拟现实需要一个比例尺
         * 如果按照1像素就是1米来算，显然不合适，因为页面动不动就几百像素
         * 页面上，我们放两个物体，200~800像素之间，我们可以映射为现实世界的2米到8米，也就是100:1
         * 不过，本方法没有对此有所体现，因此不必在意
         */
        var defaults = {
            speed: 166.67, // 每帧移动的像素大小，每帧（对于大部分显示屏）大约16~17毫秒
            curvature: 0.001, // 实际指焦点到准线的距离，你可以抽象成曲率，这里模拟扔物体的抛物线，因此是开口向下的
            progress: function() {},
            complete: function() {}
        };
        var params = {},
            options = options || {};

        for (var key in defaults) {
            params[key] = options[key] || defaults[key];
        }

        var exports = {
            mark: function() {
                return this;
            },
            position: function() {
                return this;
            },
            move: function() {
                return this;
            },
            init: function() {
                return this;
            }
        };

        /* 确定移动的方式 
         * IE6-IE8 是margin位移
         * IE9+使用transform
         */
        var moveStyle = "margin",
            testDiv = document.createElement("div");
        if ("oninput" in testDiv) {
            ["", "ms", "webkit"].forEach(function(prefix) {
                var transform = prefix + (prefix ? "T" : "t") + "ransform";
                if (transform in testDiv.style) {
                    moveStyle = transform;
                }
            });
        }
        // 根据两点坐标以及曲率确定运动曲线函数（也就是确定a, b的值）
        /* 公式： y = a*x*x + b*x + c;
         */
        var a = params.curvature,
            b = 0,
            c = 0;
        // 是否执行运动的标志量
        var flagMove = true;
        if (element && target && element.nodeType == 1 && target.nodeType == 1) {
            var rectElement = {}, rectTarget = {};

            // 移动元素的中心点位置，目标元素的中心点位置
            var centerElement = {}, centerTarget = {};

            // 目标元素的坐标位置
            var coordElement = {}, coordTarget = {};

            // 标注当前元素的坐标
            exports.mark = function() {
                if (flagMove == false) return this;
                if (typeof coordElement.x == "undefined") this.position();
                element.setAttribute("data-center", [coordElement.x, coordElement.y].join());
                target.setAttribute("data-center", [coordTarget.x, coordTarget.y].join());
                return this;
            }
            exports.position = function() {
                if (flagMove == false) return this;
                var scrollLeft = document.documentElement.scrollLeft || document.body.scrollLeft,
                    scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
                // 初始位置
                if (moveStyle == "margin") {
                    element.style.marginLeft = element.style.marginTop = "0px";
                } else {
                    element.style[moveStyle] = "translate(0, 0)";
                }
                // 四边缘的坐标
                rectElement = element.getBoundingClientRect();
                rectTarget = target.getBoundingClientRect();
                // 移动元素的中心点坐标
                centerElement = {
                    x: rectElement.left + (rectElement.right - rectElement.left) / 2 + scrollLeft,
                    y: rectElement.top + (rectElement.bottom - rectElement.top) / 2 + scrollTop
                };
                // 目标元素的中心点位置
                centerTarget = {
                    x: rectTarget.left + (rectTarget.right - rectTarget.left) / 2 + scrollLeft,
                    y: rectTarget.top + (rectTarget.bottom - rectTarget.top) / 2 + scrollTop
                };
                // 转换成相对坐标位置
                coordElement = {
                    x: 0,
                    y: 0
                };
                coordTarget = {
                    x: -1 * (centerElement.x - centerTarget.x),
                    y: -1 * (centerElement.y - centerTarget.y)
                };
                /*
                 * 因为经过(0, 0), 因此c = 0
                 * 于是：
                 * y = a * x*x + b*x;
                 * y1 = a * x1*x1 + b*x1;
                 * y2 = a * x2*x2 + b*x2;
                 * 利用第二个坐标：
                 * b = (y2+ a*x2*x2) / x2
                 */
                // 于是
                b = (coordTarget.y - a * coordTarget.x * coordTarget.x) / coordTarget.x;
                return this;
            };
            // 按照这个曲线运动
            exports.move = function() {
                // 如果曲线运动还没有结束，不再执行新的运动
                if (flagMove == false) return this;
                var startx = 0,
                    rate = coordTarget.x > 0 ? 1 : -1;

                var step = function() {
                    // 切线 y'=2ax+b
                    var tangent = 2 * a * startx + b; // = y / x
                    // y*y + x*x = speed
                    // (tangent * x)^2 + x*x = speed
                    // x = Math.sqr(speed / (tangent * tangent + 1));
                    startx = startx + rate * Math.sqrt(params.speed / (tangent * tangent + 1));
                    // 防止过界
                    if ((rate == 1 && startx > coordTarget.x) || (rate == -1 && startx < coordTarget.x)) {
                        startx = coordTarget.x;
                    }
                    var x = startx,
                        y = a * x * x + b * x;
                    // 标记当前位置，这里有测试使用的嫌疑，实际使用可以将这一行注释
                    element.setAttribute("data-center", [Math.round(x), Math.round(y)].join());

                    // x, y目前是坐标，需要转换成定位的像素值
                    if (moveStyle == "margin") {
                        element.style.marginLeft = x + "px";
                        element.style.marginTop = y + "px";
                    } else {
                        element.style[moveStyle] = "translate(" + [x + "px", y + "px"].join() + ")";
                    }
                    if (startx !== coordTarget.x) {
                        //及时函数
                        params.progress(x, y);
                        Base.requestAnimationFrame(step);
                    } else {
                        // 运动结束，回调执行
                        params.complete();
                        flagMove = true;
                    }
                };
                Base.requestAnimationFrame(step);
                flagMove = false;
                return this;
            };
            // 初始化方法
            exports.init = function() {
                this.position().mark().move();
            };
        }
        return exports;
    }
    /**
     * 取CSS样式值
     * @param  obj  ：dom节点
     * @param  attr : css属性
     */
    Base.getStyle = function(obj, attr) {
        var hasBgp = attr.indexOf("background-position-");
        if (!Base.isDOM(obj)) return;
        //兼容Firefox获取 背景图位置
        if (hasBgp != -1) {
            if (!obj.currentStyle) {
                var poxy = getComputedStyle(obj, false)["background-position"],
                    arr = [];
                arr = poxy.split(" ");
                if (attr == 'background-position-x') {
                    return arr[0];
                }
                if (attr == 'background-position-y') {
                    return arr[1];
                }
            }
        }
        if (obj.currentStyle) {
            return obj.currentStyle[attr];
        } else {
            return getComputedStyle(obj, false)[attr];
        }
    }
    /**
     * [move description]
     * @param  obj：   运动物体
     * @param  json：  运动属性和运动目标值的json集合，{width:200,height:200}
     * @param  sv：    运动的速度，speed-value,值越小速度越大
     * @param  fnEnd： 运动结束后的回调函数
     */
    Base.move = function(obj, json, sv, fnEnd) {
        //运动开始          
        var isAllCompleted = true; //假设全部运动都完成了
        var recdJson = {};
        for (var attr in json) {
            switch (attr) {
                case 'opacity':
                    var attrValue = Math.round(parseFloat(Base.getStyle(obj, attr)) * 100);
                    recdJson[attr] = attrValue;
                    break;
                default:
                    var attrValue = parseInt(Base.getStyle(obj, attr));
                    recdJson[attr] = attrValue;
            }
        };

        function timer() {
            for (var attr in json) {
                var attrValue = 0,
                    nowVal = json[attr],
                    recdVal = recdJson[attr];
                switch (attr) {
                    case 'opacity':
                        attrValue = Math.round(parseFloat(Base.getStyle(obj, attr)) * 100);
                        nowVal = nowVal * 100;
                        break;
                    default:
                        attrValue = parseInt(Base.getStyle(obj, attr));
                }
                sv = sv || 4;
                var speed = (nowVal - recdVal) / sv;
                speed = speed > 0 ? Math.ceil(speed) : Math.floor(speed);
                //如果循环过程中存在尚未结束的运动，isAllCompleted为假
                if (attrValue != nowVal) {
                    isAllCompleted = false;
                    if (Math.abs(nowVal - attrValue) <= Math.abs(speed)) {
                        attrValue = nowVal;
                        speed = 0;
                        delete json[attr];
                    }
                    switch (attr) {
                        case 'opacity':
                            {
                                obj.style.filter = "alpha(opacity=" + (attrValue + speed) + ")";
                                obj.style.opacity = (attrValue + speed) / 100;
                            };
                            break;
                        default:
                            obj.style[attr] = attrValue + speed + 'px';
                    }
                }
            }
            if (Base.isEmptyObject(json)) {
                isAllCompleted = true;
                Base.requestAnimationFrame(timer, "stop");
                if (Base.isFunction(fnEnd)) {
                    fnEnd();
                }
                return this;
            } else {
                Base.requestAnimationFrame(timer);
            }
        };
        timer();
    };
    /**
     * 判断对象是否为空
     * @param  obj ： 对象
     */
    Base.isEmptyObject = function(obj) {
        var name;
        for (name in obj) {
            return false;
        }
        return true;
    }
    /**
     * [getType 返回对象的type]
     * @param  {[type]} obj
     * @return {[type]}  
     */
    Base.getType = function(obj) {
        return Object.prototype.toString.call(obj).match(/\s([a-z|A-Z]+)/)[1].toLowerCase();
    };
    /**
     * 判断对象是否为fun
     * @param  obj ： 对象
     */
    Base.isFunction = function(obj) {
        return Base.getType(obj) === "function";
    }
    /**
     * 判断对象是否为String
     * @param  obj ： 对象
     */
    Base.isString = function(obj) {
        return Base.getType(obj) === "string";
    }
    /**
     * 判断对象是否为String
     * @param  obj ： 对象
     */
    Base.isNum = function(obj) {
        return Base.getType(obj) === "number";
    }
    /**
     * [判断是否是数组]
     * @param  {[type]} obj [目标数组]
     */
    Base.isArray = Array.isArray || function(obj) {
        return Base.getType(obj) === 'array';
    }
    /**
     * [isDOM 检测是否是dom]
     * @param  {[type]}  dom [description]
     * @return {Boolean}     [description]
     */
    Base.isDOM = function(dom) {
        if (typeof HTMLElement === 'object') {
            var result = function(dom) {
                return dom instanceof HTMLElement;
            }
        } else {
            var result = function(dom) {
                return dom && typeof dom === 'object' && dom.nodeType === 1 && typeof dom.nodeName === 'string';
            }
        }
        return result(dom);
    }
    /**
     * [unique 数组去重复]
     * @param  {[type]} arr [目标数组]
     */
    Base.arrUnique = function(arr) {
        if (!Base.isArray(arr)) return;
        var result = [],
            hash = {};
        for (var i = 0, elem;
            (elem = arr[i]) != null; i++) {
            if (!hash[elem]) {
                result.push(elem);
                hash[elem] = true;
            }
        }
        return result;
    }
    /**
     * [event 事件函数]
     * @param  {[type]}   elem   [委托dom或目标dom]
     * @param  {[type]}   target [目标dom，支持id，class，html标签]
     * @param  {[type]}   evt    [事件]
     * @param  {Function} fn     [函数]
     * @return {[type]}          [简易事件处理]
     */
    Base.event = function(elem, target, evt, fn) {
        if (!Base.isDOM(elem) && elem != document) return;
        var isDelege = false;
        if (Base.isFunction(evt) && !Base.isString(evt)) {
            fn = evt;
            evt = target;
        } else {
            isDelege = true;
        }
        if (!Base.isFunction(fn)) {
            fn = function() {}
        }
        if (elem.addEventListener) {
            if (isDelege) {
                //暂不支持，自定义事件事件委托
                elem.addEventListener(evt, function(event) {
                    delege(evt, target, fn);
                }, false);
            } else {
                elem.addEventListener(evt, fn, false);
                var ev = document.createEvent("HTMLEvents");
                ev.initEvent(evt, false, false);
                if (!elem["ev" + evt]) {
                    elem["ev" + evt] = ev;
                }
            }
        } else if (elem.attachEvent) {
            if (isDelege) {
                elem.attachEvent("on" + evt, function(event) {
                    delege(event, target, fn);
                });
            } else {
                elem.attachEvent('on' + evt, function() {
                    fn.call(elem, window.event);
                });
                if (isNaN(elem["cu" + evt])) {
                    // 自定义属性，触发事件用
                    elem["cu" + evt] = 0;
                }
                var fnEv = function(event) {
                    if (event.propertyName == "cu" + evt) {
                        fn.call(elem);
                    }
                };
                elem.attachEvent("onpropertychange", fnEv);
                // 在元素上存储绑定的propertychange事件，方便删除
                if (!elem["ev" + evt]) {
                    elem["ev" + evt] = [fnEv];
                } else {
                    elem["ev" + evt].push(fnEv);
                }
            }
        } else {
            //貌似一般走不到这里。走到这里，事件委托，我也不会了,不知是不是这么写
            if (Base.isDOM(target)) {
                elem["on" + evt] = function(event) {
                    delege(event, target, fn);
                }
            } else {
                elem["on" + evt] = fn;
            }
        }

        function delege(event, target, fn) {
            var theEvent = window.event || event,
                theTag = theEvent.target || theEvent.srcElement;
            if (Base.isDOM(target)) {
                if (theTag == target) {
                    fn.call(theTag, theEvent); //fn方法应用到theTag上面
                }
            }
            if (Base.isString(target)) {
                if (target.charAt(0) == "#") {
                    var target = document.getElementById(target.substring(1, target.length));
                    if (theTag == target) {
                        fn.call(theTag, theEvent); //fn方法应用到theTag上面
                    }
                } else if (document.querySelectorAll) {
                    var qSelectorList = elem.querySelectorAll(target),
                        qELLent = qSelectorList.length;
                    if (document.querySelectorAll) {
                        for (var i = 0; i < qELLent; i++) {
                            if (theTag == qSelectorList[i]) {
                                fn.call(theTag, theEvent); //fn方法应用到theTag上面
                            }
                        };
                    }
                } else {
                    if (target.charAt(0) == ".") {
                        var targetClass = target.substring(1, target.length),
                            classList = elem.getElementsByTagName('*'),
                            classListLen = classList.length;
                        for (var i = 0; i < classListLen; i++) {
                            if (Base.hasClass(classList[i], targetClass) && classList[i] == theTag) {
                                fn.call(theTag, theEvent); //fn方法应用到theTag上面
                            }
                        };
                    } else {
                        var targetTagName = target.toLowerCase(),
                            classList = elem.getElementsByTagName('*'),
                            classListLen = classList.length;
                        for (var i = 0; i < classListLen; i++) {
                            var classListTagName = classList[i].tagName.toLowerCase();
                            if (classList[i] == theTag && classListTagName == targetTagName) {
                                fn.call(theTag, theEvent); //fn方法应用到theTag上面
                            }
                        };
                    }
                }
            }
        }
    }
    /**
     * [trim 去除首尾空格]
     * @param  {[type]} str [str]
     * @return {[type]}     [返回去除空格的]
     */
    Base.trim = function(str) {
        return str.replace(/^(\s|\u00A0)+/, '').replace(/(\s|\u00A0)+$/, '');
    }
    /**
     * [fireEvent 触发函数]
     * @param  {[type]} elem [节点]
     * @param  {[type]} evt  [事件]
     */
    Base.fireEvent = function(elem, evt) {
        if (typeof evt === "string") {
            if (document.dispatchEvent) {
                if (elem["ev" + evt]) {
                    elem.dispatchEvent(elem["ev" + evt]);
                }
            } else if (document.attachEvent) {
                // 改变对应自定义属性，触发自定义事件
                elem["cu" + evt]++;
            }
        }
    }
    /**
     * [removeEvent description]
     * @param  {[type]}   obj  [description]
     * @param  {[type]}   type [description]
     * @param  {Function} fn   [description]
     * @return {[type]}        [description]
     */
    Base.removeEvent = function(obj, type, fn) {
        if (obj.removeEventListener)
            obj.removeEventListener(type, fn, false);
        else if (obj.detachEvent) {
            obj.detachEvent("on" + type, obj["e" + type + fn]);
            obj["e" + type + fn] = null;
            var arrEv = obj["ev" + type];
            if (arrEv instanceof Array) {
                for (var i = 0; i < arrEv.length; i += 1) {
                    // 删除该方法名下所有绑定的propertychange事件
                    obj.detachEvent("onpropertychange", arrEv[i]);
                }
            }
        }

    };
    /**
     * [ready description]
     * @return {[type]} [模拟ready]
     */
    Base.ready = function() {
        var funs = arguments;
            // readyRE = /complete|loaded|interactive/;
        //是否依赖require
        var require = require || false
        if (require) {
            runJs();
        } else if (document.readyState == "complete") { //已加载完成
            runJs();
        } else {
            if (document.addEventListener) {
                document.addEventListener("DOMContentLoaded", function() {
                    //注销事件，避免反复触发
                    document.removeEventListener("DOMContentLoaded", arguments.callee, false);
                    runJs();
                }, false);
            } else if (document.attachEvent) {
                document.attachEvent("onreadystatechange", function() {
                    if (document.readyState === "complete") {
                        //注销事件，避免反复触发
                        document.detachEvent("onreadystatechange", arguments.callee);
                        runJs();
                    }
                });
            }
        }
        //执行函数

        function runJs() {
            for (var i = 0; i < funs.length; i++) {
                if (Base.isFunction(funs[i])) {
                    funs[i]();
                }
            };
        }
    }
    /**
     * [writePath description]
     * @param  {[type]} 写入类型【js，css】
     * @param  {[type]} 路径
     * @param  {[type]} 写入后的调用方法
     * @return {[type]}
     */
    Base.writePath = function(type, url, arrFun) {
        var head = document.getElementsByTagName('head')[0];
        if (type == "js") {
            var node = document.createElement('script');
            node.type = 'text/javascript',
            node.charset = 'utf-8',
            node.onload = node.onreadystatechange = function() {
                if (!this.readyState || this.readyState === "loaded" || this.readyState === "complete") {
                    //根据方法名，执行回调方法
                    if (arrFun) {
                        if(Base.isArray(arrFun)) {
                            for (var i = 0; i < arrFun.length; i++) {
                                var thisFunction = new Function(arrFun[i] + "();");
                                try {
                                    thisFunction();
                                } catch (e) {
                                    if (window.console) {
                                        console.log("该方法不存在！");
                                    } else {
                                        alert("该方法不存在！");
                                    }
                                }
                            };
                        }
                        if(Base.isFunction(arrFun)) {
                            arrFun();
                        }
                            
                    }
                    //ie缓存
                    node.onload = node.onreadystatechange = null;
                }
            };
            node.src = url;
            head.appendChild(node);
        }
        if (type == "css") {
            var node = document.createElement('link');
            node.href = url;
            node.rel = 'stylesheet';
            node.type = 'text/css';
            head.appendChild(node);
        }
    }
    //touch 相关
    Base.hasTouch = ('ontouchstart' in window);
    /**
     * [transform 获取transform的X，Y]
     * @param  {[type]} elem [description]
     * @return {[type]}      [description]
     */
    Base.transform = function(elem) {
        var transform = Base.getStyle(elem, "transform") || Base.getStyle(elem, "-webkit-transform"),
            transformX,
            transformY,
            transformZ,
            transformArr = [];
        if (transform == "none" || transform == undefined) {
            transformArr.push(0);
            transformArr.push(0);
        } else {
            var matrix = transform.split('(')[1].split(')')[0].split(',');
            if (matrix.length == 6) {
                transformX = matrix[4];
                transformY = matrix[5];
                transformArr.push(parseInt(transformX));
                transformArr.push(parseInt(transformY));
            } else if (matrix.length == 16) {
                transformX = matrix[12];
                transformY = matrix[13];
                transformZ = matrix[14];
                transformArr.push(parseInt(transformX));
                transformArr.push(parseInt(transformY));
            }
        }
        return transformArr;
    }
    /**
     * [stopDefault 阻止浏览器冒泡行为]
     * @param  {[type]} e [description]
     * @return {[type]}   [description]
     */
    Base.stopDefault = function(e) {
        //阻止默认浏览器动作(W3C) 
        if (e && e.preventDefault) {
            e.preventDefault();
        } else { //IE中阻止函数器默认动作的方式 
            window.event.returnValue = false;
        }
        return false;
    }
    /**
     * [touch 简单模拟touch事件]
     * @param  {[type]} elem      [description]
     * @param  {[type]} swipeFlag [description]
     * @param  {[type]} fun       [description]
     * @return {[type]}           [description]
     */
    Base.touch = function(elem, swipeFlag, jsonOpt, fun) {
        var transformArr = Base.transform(elem),
            transformX = transformArr[0],
            transformY = transformArr[1];
        var params = {
            left: transformX,
            top: transformY,
            currentX: 0,
            currentY: 0,
            flag: false
        };
        var recDate, nowDate, displacement, speed, isSwipe = false,
            isMove = false;
        if (Base.isFunction(jsonOpt)) {
            fun = jsonOpt;
        }
        if (Base.getType(jsonOpt) === "object") {
            var opt = {
                'displacement': 0,
                'speed': 400
            }
            isSwipe = true;
            var finOpt = Base.extend(opt, jsonOpt);
            displacement = parseInt(finOpt.displacement);
            speed = parseInt(finOpt.speed);
        }

        if (!Base.isFunction(fun)) {
            fun = function() {}
        }
        var dragDown = function(event) {
            Base.stopDefault(event);
            params.flag = true;
            event = event || window.event;
            var touch = event.touches ? event.touches[0] : {};
            params.currentX = touch.clientX || event.clientX;
            params.currentY = touch.clientY || event.clientY;
            addEvent();
            recDate = new Date();
        }
        var dragMove = function(event) {
            Base.stopDefault(event);
            event = event || window.event;
            if (params.flag) {
                var touch = event.touches ? event.touches[0] : {};
                var nowX = touch.clientX || event.clientX,
                    nowY = touch.clientY || event.clientY;
                var disX = nowX - params.currentX,
                    disY = nowY - params.currentY;
                switch (swipeFlag) {
                    case "swipeLeft":
                        if (disX >= 0) return;
                        //console.log(disX);
                        isMove = true;
                        disY = 0;
                        if (!isSwipe) {
                            setOpt(elem, disX, disY);
                        }
                        break;
                    case "swipeRight":
                        if (disX <= 0) return;
                        disY = 0;
                        isMove = true;
                        if (!isSwipe) {
                            setOpt(elem, disX, disY);
                        }
                        break;
                    case "swipeUp":
                        if (disY >= 0) return;
                        isMove = true;
                        disX = 0;
                        if (!isSwipe) {
                            setOpt(elem, disX, disY);
                        }
                        break;
                    case "swipeDown":
                        if (disY <= 0) return;
                        disX = 0;
                        isMove = true;
                        if (!isSwipe) {
                            setOpt(elem, disX, disY);
                        }
                        break;
                    case "tap":
                        disY = 0;
                        disX = 0;
                        break;
                    case "longTap":
                        disY = 0;
                        disX = 0;
                    default:
                        disX = disX,
                        disY = disY;
                        setOpt(elem, disX, disY);
                }
            }
        }
        var setOpt = function(elem, disX, disY) {
            var finLeft = parseInt(params.left) + disX,
                finRight = parseInt(params.top) + disY;
            elem.style.msTransform = elem.style.MozTransform = elem.style.OTransform = elem.style.webkitTransform = elem.style.transform = "matrix(1, 0, 0, 1, " + finLeft + ", " + finRight + ")";
        }
        var delEvent = function() {
            Base.removeEvent(document, "touchmove", dragMove);
            Base.removeEvent(document, 'mousemove', dragMove);
            Base.removeEvent(document, "touchend", dragUp);
            Base.removeEvent(document, 'mouseup', dragUp);
        }
        var addEvent = function() {
            Base.event(document, "touchend", dragUp);
            Base.event(document, "touchmove", dragMove);
            Base.event(document, "mousemove", dragMove);
            Base.event(document, "mouseup", dragUp);
        }
        var dragUp = function(event) {
            Base.stopDefault(event);
            params.flag = false;
            var transformArr = Base.transform(elem),
                transformX = transformArr[0],
                transformY = transformArr[1];
            params.left = transformX;
            params.top = transformY;
            nowDate = new Date();
            var keepTime = nowDate - recDate;
            switch (swipeFlag) {
                case "tap":
                    if (keepTime < 250) {
                        var isTap = "tap";
                        if (swipeFlag == isTap) {
                            fun.call(elem, event);
                        }
                    }
                    break;
                case "longTap":
                    if (keepTime > 250 && keepTime < 1400) {
                        var isTap = "longTap";
                        if (swipeFlag == isTap) {
                            fun.call(elem, event);
                        }
                    }
                    break;
                case "swipeLeft":
                    if (Base.isNum(displacement) && isMove) {
                        var dis = parseInt(params.left) - parseInt(displacement);
                        translate(elem, speed, dis, 0);
                        var animate = setTimeout(function() {
                            fun.call(elem, event);
                            clearTimeout(animate);
                            isMove = false;
                        }, speed);
                    }
                    break;
                case "swipeRight":
                    if (Base.isNum(displacement) && isMove) {
                        var dis = parseInt(params.left) + parseInt(displacement);
                        translate(elem, speed, dis, 0);
                        var animate = setTimeout(function() {
                            fun.call(elem, event);
                            clearTimeout(animate);
                            isMove = false;
                        }, speed);
                    }
                    break;
                case "swipeUp":
                    if (Base.isNum(displacement) && isMove) {
                        var dis = parseInt(params.top) - parseInt(displacement);
                        translate(elem, speed, 0, dis);
                        var animate = setTimeout(function() {
                            fun.call(elem, event);
                            clearTimeout(animate);
                            isMove = false;
                        }, speed);
                    }
                    break;
                case "swipeDown":
                    if (Base.isNum(displacement) && isMove) {
                        var dis = parseInt(params.top) + parseInt(displacement);
                        translate(elem, speed, 0, dis);
                        var animate = setTimeout(function() {
                            fun.call(elem, event);
                            clearTimeout(animate);
                            isMove = false;
                        }, speed);
                    }
                    break;
                default:
                    fun.call(elem, event);
            }
            delEvent();
            return false;
        }
        var translate = function(elem, speed, distanceX, distanceY) {
              elem.style.webkitTransitionDuration = elem.style.MozTransitionDuration = elem.style.transitionDuration = speed + "ms";
              elem.style.webkitTransform = elem.style.msTransform = elem.style.MozTransform = elem.style.OTransform = elem.style.transform = "matrix(1, 0, 0, 1, " + distanceX + ", " + distanceY + ")";
              elem.style.webkitTransform = "matrix(1, 0, 0, 1, " + distanceX + ", " + distanceY + ")";
            //alert(distanceX);
            //elem.style.webkitTransform = "translateX(200px)"
        };
        Base.event(elem, "touchstart", dragDown);
        Base.event(elem, "mousedown", dragDown);
    }
    /**
     * [getUrl 返回当前路径]
     * @return {[type]} [description]
     */
    Base.getUrl = function() {
        var div = document.createElement('div');
        div.innerHTML = '<a href="./" id="localId"></a>';
        var url = div.firstChild.href;
        div = null;
        return url;
    }
    /**
     * [extend 来自jq继承对象]
     * @return {[type]} [description]
     */
    Base.extend = function() {
        var src, copyIsArray, copy, name, options, clone,
            target = arguments[0] || {},
            i = 1,
            length = arguments.length,
            deep = false;
        // 判断是否是boolean类型
        if (typeof target === "boolean") {
            deep = target;
            // skip the boolean and the target
            target = arguments[i] || {};
            i++;
        }
        // 不是object和function 目标位 {}
        if (typeof target !== "object" && !Base.isFunction(target)) {
            target = {};
        }
        // 判断参数长度
        if (i === length) {
            target = this;
            i--;
        }
        for (; i < length; i++) {
            // 判断是否有参数
            if ((options = arguments[i]) != null) {
                // 合并
                for (name in options) {
                    src = target[name];
                    copy = options[name];
                    // 如果相等，本次结束
                    if (target === copy) {
                        continue;
                    }
                    // 递归如果我们合并对象或数组
                    if (deep && copy && (copyIsArray = Base.isArray(copy))) {
                        if (copyIsArray) {
                            copyIsArray = false;
                            clone = src && Base.isArray(src) ? src : [];

                        } else {
                            clone = src ? src : {};
                        }
                        // clone
                        target[name] = Base.extend(deep, clone, copy);
                        // 去除未定义的值
                    } else if (copy !== undefined) {
                        target[name] = copy;
                    }
                }
            }
        }
        // 返回结果
        return target;
    }
    Base.timer = function(fn,time) {
        //console.log(fn);
        var timer = setTimeout(function() {
            fn();
            clearTimeout(timer);
        }, time);
    }
});