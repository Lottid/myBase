;
(function(root, factory) {
    if (typeof exports === 'object' && exports) {
        // commonjs
        factory(module.exports);
    } else {
        var BaseObj = {};
        factory(BaseObj);
        if (typeof define === 'function' && define.amd) {
            // AMD
            define(BaseObj);
        } else {
            root.BaseObj = root.thisBaseObj = BaseObj;
        }
    }
})(this, function(BaseObj, undefined) {
    /**
     * [localData 操作localSorage]
     * @fun  setCookie  设置
     * @fun  getCookie  获取
     * @fun  clearCookie  删除
     */
    BaseObj.cookie = {
        //取得cookie  
        getCookie: function(name) {
            var nameEQ = name + "=";
            var ca = document.cookie.split(';'); //把cookie分割成组  
            for (var i = 0; i < ca.length; i++) {
                var c = ca[i]; //取得字符串  
                while (c.charAt(0) == ' ') { //判断一下字符串有没有前导空格  
                    c = c.substring(1, c.length); //有的话，从第二位开始取  
                }
                if (c.indexOf(nameEQ) == 0) { //如果含有我们要的name  
                    return unescape(c.substring(nameEQ.length, c.length)); //解码并截取我们要值  
                }
            }
            return false;
        },
        //清除cookie  
        clearCookie: function(name) {
            this.setCookie(name, "", -1);
        },
        //设置cookie  
        setCookie: function(name, value, seconds) {
            seconds = seconds || 0; //seconds有值就直接赋值，没有为0，这个根php不一样。  
            var expires = "";
            if (seconds != 0) { //设置cookie生存时间  
                var date = new Date();
                date.setTime(date.getTime() + (seconds * 1000));
                expires = "; expires=" + date.toGMTString();
            }
            document.cookie = name + "=" + escape(value) + expires + "; path=/"; //转码并赋值  
        }
    }
    /**
     * [localData 操作localSorage]
     * @fun  set  设置
     * @fun  get  获取
     * @fun  remove  删除
     */
    BaseObj.localData = {
        isLocalStorage: window.localStorage ? true : false,
        set: function(key, value) {
            if (this.isLocalStorage) {
                try {
                    window.localStorage.setItem(key, value);
                } catch (oException) {
                    if (oException.name == 'QuotaExceededError') {
                        console.log('已经超(www.111cn.net)出本地存储限定大小！');
                        // 可进行超出限定大小之后的操作，如下面可以先清除记录，再次保存
                        Base.localData.clear();
                        window.localStorage.setItem(key, value);
                    }
                }
            }
        },
        get: function(key) {
            if (this.isLocalStorage) {
                return window.localStorage.getItem(key);
            }
        },
        remove: function(key) {
            if (this.isLocalStorage) {
                window.llocalStorage.removeItem(key);
            }
        },
        clear: function() {
            if (this.isLocalStorage) {
                window.llocalStorage.clear();
            }
        }
    }
    BaseObj.imgLoad = {
        //miku图片加载器3.0
        placeholder : new Image(),
        loadingArray : [],
        init : function(placeholderPath, width, height) {
            console.log(this);
            this.placeholder.src = placeholderPath;
            this.placeholder.width = width;
            this.placeholder.height = height;
        },
        load : function(imgElem, imgSrc, callback) {
            //清除之前的onload函数
            if (imgElem.lastload) {
                imgElem.lastload.onload = function() {};
            }
            var testImg = new Image();
            testImg.src = imgSrc;
            //console.log(testImg.complete);
            //console.log(testImg);
            if (testImg.complete == true) {
                imgElem.src = testImg.src;
                imgElem.width = testImg.naturalWidth;
                if (imgElem.hasAttribute("height")) {
                    imgElem.removeAttribute("height");
                }
            } else {
                imgElem.src = this.placeholder.src;
                imgElem.width = this.placeholder.width;
                imgElem.height = this.placeholder.height;
                //绑定onload函数
                testImg.onload = function() {
                    imgElem.src = testImg.src;
                    imgElem.width = testImg.naturalWidth;
                    if (imgElem.hasAttribute("height")) {
                        imgElem.removeAttribute("height");
                    }
                    if (callback) {
                        callback();
                    }
                };
                imgElem.lastload = testImg;
                this.loadingArray.push(imgElem);
            }
        },
        //清除加载队列的所有onload函数
        clearOnload : function(loadingArray){
            for(var i=0;i<loadingArray.length;i++){
               var loading = loadingArray[i];
               loading.onload = function(){};
            }
        }
    }
});