/**
 * 高精度扩展
 * @type {{}}
 */
var MathEx = {};
/**
 * 除法
 * @param num1
 * @param num2
 * @returns {number}
 * @constructor
 */
MathEx.Division = function (num1, num2) {
    if (num2 == undefined) {
        num2 = 100;
    }
    var t1 = 0, t2 = 0, r1, r2;
    try {
        t1 = num1.toString().split(".")[1].length;
    }
    catch (e) {
    }
    try {
        t2 = num2.toString().split(".")[1].length;
    }
    catch (e) {
    }
    with (Math) {
        r1 = Number(num1.toString().replace(".", ""));
        r2 = Number(num2.toString().replace(".", ""));
        return (r1 / r2) * pow(10, t2 - t1);
    }
};
/**
 * 乘法
 * @param num1
 * @param num2
 * @returns {number}
 * @constructor
 */
MathEx.Multiplication = function (num1, num2) {
    if (num1 == undefined) {
        return 0;
    }
    if (num2 == undefined) {
        num2 = 100;
    }
    var m = 0, s1 = num1.toString(), s2 = num2.toString();
    try {
        m += s1.split(".")[1].length;
    } catch (e) {
    }
    try {
        m += s2.split(".")[1].length;
    } catch (e) {
    }
    return Number(s1.replace(".", "")) * Number(s2.replace(".", "")) / Math.pow(10, m);
};
/**
 * 加法
 * @param num1
 * @param num2
 * @returns {number}
 * @constructor
 */
MathEx.Addition = function (num1, num2) {
    var r1 = 0, r2 = 0, m;
    try {
        r1 = num1.toString().split(".")[1].length;
    } catch (e) {
    }
    try {
        r2 = num2.toString().split(".")[1].length;
    } catch (e) {
    }
    m = Math.pow(10, Math.max(r1, r2));
    return (num1 * m + num2 * m) / m;
};
/**
 * 减法
 * @param num1
 * @param num2
 * @returns {string}
 * @constructor
 */
MathEx.Subtraction = function (num1, num2) {
    var r1 = 0, r2 = 0, m, n;
    try {
        r1 = num1.toString().split(".")[1].length;
    } catch (e) {
    }
    try {
        r2 = num2.toString().split(".")[1].length;
    } catch (e) {
    }
    m = Math.pow(10, Math.max(r1, r2));
    n = (r1 >= r2) ? r1 : r2;
    return ((num1 * m - num2 * m) / m).toFixed(n);
};

(function ($) {
    var reqs = {
        "json": true,
        "get": function (url, data, func) {
            return this._ajax("GET", url, data, func);
        },
        "post": function (url, data, func) {
            return this._ajax("POST", url, data, func);
        },
        "put": function (url, data, func) {
            return this._ajax("PUT", url, data, func);
        },
        "delete": function (url, data, func) {
            return this._ajax("DELETE", url, data, func);
        },
        "abort": function (request) {
            request.abort();
        },
        _ajax: function (type, url, data, func, async) {
            var me = this;
            if (!data || ($.isEmptyObject(data) && data.constructor != Array)) {
                data = undefined;
            }
            var _default = {
                type: type || "POST",
                url: url || $.href(),
                // dataType: 'json',
                // contentType: "application/json;charset=UTF-8",
                data: data || void 0,
                /*traditional: true,*/
                context: document.body,
                async: void 0 === async
            };
            if (me.json) {
                _default = $.extend({}, _default, {
                    dataType: "json",
                    contentType: "application/json;charset=UTF-8"
                });
                if (_default.data) {
                    _default.data = JSON.stringify(_default.data);
                }
            }
            $.console(type, url, data, func, async);
            return $.ajax(_default).done(function (r) {
                return me._callback(r, func);
            }).fail(function (r) {
                return me._callback(r, func);
            });
        },
        _callback: function (r, func) {

            if (r && $.isNumeric(r.status) && r.status === 0) {
                return;
            }

            function megi(msg) {
                setTimeout(function () {
                    $.alert(msg);
                }, 300);
                return false;
            }

            if (func != undefined && $.isFunction(func)) {
                func.call(this, r);
            }
            if (r.status == undefined || r.status == 200) {
                return false;
            }
            if (r.status != undefined) {
                switch (r.status) {
                    case 400:
                        megi(LANG_COMMON.ERROR_400_TEXT);
                        break;
                    case 401:
                        if (r.getResponseHeader("login") != undefined && r.getResponseHeader("login") == 1) {
                            $.goto(window.location.origin + "/login", {returnUrl: encodeURIComponent(window.location.href)});
                        } else {
                            megi(LANG_COMMON.ERROR_401_TEXT);
                        }
                        break;
                    case 403:
                        megi(LANG_COMMON.ERROR_403_TEXT);
                        break;

                    case 404:
                        megi(LANG_COMMON.ERROR_404_TEXT);
                        break;
                    case 405:
                        megi(LANG_COMMON.ERROR_405_TEXT);
                        break;
                    case 500:
                        megi(LANG_COMMON.ERROR_500_TEXT);
                        break;
                    default:
                        megi(LANG_COMMON.ERROR_DEFAULT_TEXT);
                        break;
                }
            }

        }
    };

    var basepath = function () {
        return (window.location.origin + window.location.pathname);
    };

    /**
     * 统一ajax请求函数
     */
    $.request = $.extend({}, reqs, {"json": false});
    $.requestJson = $.extend({}, reqs, {"json": true});
    /**
     * 控制台输出
     * 建议开发模式使用
     */
    $.console = function () {
        if (window.console != undefined && APPDEBUG) {
            var data = [];
            $.each(arguments, function (i, o) {
                data.push(o);
            });
            return window.console.log(data);
        }
    };

    /**
     * 获取URL
     * @param args
     * @returns {string}
     */
    $.href = function (args) {
        var _href = window.location.href.replace(/#/g, "");
        if (args != undefined) {
            if ($.isArray(args)) {
                _href += "/" + args.join("/");
            } else {
                _href += "/" + args;
            }
        }

        return _href;
    };

    /**
     * 获取拼接后的URL
     * @returns {string}
     */
    $.getHref = function () {
        if (arguments.length == 0) {
            return BASEPATH;
        }
        var args = [];
        $.each(arguments, function (i, o) {
            args.push(o);
        });

        return BASEPATH + "/" + (args.length > 0 ? args.join("/") : "");
    };

    $.getHrefPath = function (url) {
        url = url || window.location.href;
        if (url) {
            url = url.replace(/#$/, "");
        }
        if (url && url.indexOf("?") > -1) {
            return url.substr(0, url.indexOf("?"));
        }
        return url;
    };

    /**
     * 获取url参数
     * @param name
     * @returns {*}
     */
    $.urlParam = function (name) {
        var results = new RegExp("[\?&]" + name + "=([^&#]*)").exec(window.location.href);
        if (results == null) {
            return null;
        }
        else {
            return results[1] || 0;
        }
    };

    /**
     * 替换url参数
     * @param url
     * @param params
     * @returns {*}
     */
    $.urlParamReplace = function (url, params) {
        if (url) {
            url = url.replace(/#$/, "").replace(/\?$/, "").replace(/\&$/, "");
        }
        if (url && typeof params == "object") {
            $.each(params, function (k, v) {
                if (v) {
                    v = encodeURIComponent(v);
                }
                var pattern = "(\\?|&)" + k + "=([^&]*)";
                var rp_text = v ? k + "=" + v : "";
                if (url.match(pattern)) {
                    var reg = undefined;
                    if (rp_text) {
                        reg = new RegExp("&" + k + "=([^&]*)");
                        if (reg.test(url)) {
                            rp_text = "&" + rp_text;
                        } else {
                            rp_text = "?" + rp_text;
                        }
                    }
                    url = url.replace(eval("/(\\?|&)(" + k + "=)([^&]*)/gi"), rp_text);
                    if (url.indexOf("?") == -1 && url.indexOf("&") > -1) {
                        url = url.replace(/&/, "?");
                    }
                } else {
                    if (rp_text) {
                        if (/[\?]/.test(url)) {
                            url += "&" + rp_text;
                        } else {
                            url += "?" + rp_text;
                        }
                    }
                }
            });
            if (url.indexOf("?") < 0 && url.indexOf("&") > -1) {
                url = url.substr(0, url.indexOf("&")) + "?" + url.substr(url.indexOf("&") + 1);
            }
        }
        return url;
    };

    /**
     * 修改单个参数
     * @param url
     * @param ref
     * @param value
     * @returns {string}
     */
    $.changeURLPar = function (url, ref, value) {
        if (value == undefined || value == "") {
            return url;
        }
        var str = "";
        if (url.indexOf("?") != -1)
            str = url.substr(url.indexOf("?") + 1);
        else
            return url + "?" + ref + "=" + value;
        var returnurl = "";
        var setparam = "";
        var arr;
        var modify = "0";
        if (str.indexOf("&") != -1) {
            arr = str.split("&");
            for (i in arr) {
                if (arr[i].split("=")[0] == ref) {
                    setparam = value;
                    modify = "1";
                }
                else {
                    setparam = arr[i].split("=")[1];
                }
                returnurl = returnurl + arr[i].split("=")[0] + "=" + setparam + "&";
            }
            returnurl = returnurl.substr(0, returnurl.length - 1);
            if (modify == "0")
                if (returnurl == str)
                    returnurl = returnurl + "&" + ref + "=" + value;
        }
        else {
            if (str.indexOf("=") != -1) {
                arr = str.split("=");
                if (arr[0] == ref) {
                    setparam = value;
                    modify = "1";
                }
                else {
                    setparam = arr[1];
                }
                returnurl = arr[0] + "=" + setparam;
                if (modify == "0")
                    if (returnurl == str)
                        returnurl = returnurl + "&" + ref + "=" + value;
            }
            else
                returnurl = ref + "=" + value;
        }
        return url.substr(0, url.indexOf("?")) + "?" + returnurl;
    };

    /**
     * 替换当前url参数
     * @param params
     */
    $.hrefReplace = function (params) {
        return $.urlParamReplace(window.location.href, params);
    };

    /**
     * 跳转
     * @param parms
     */
    $.go = function (parms) {
        window.location.href = $.hrefReplace(parms);
    };

    /**
     * 跳转至指定页面
     * @param url
     * @param parms
     */
    $.goto = function (url, parms) {
        window.location.href = $.urlParamReplace(url || (basepath()), parms);
    };

    /**
     * 获取url参数
     * @param parm
     * @returns {{}}
     */
    $.getParm = function (parm) {
        return $.getUrlParm($.href(), parm);
    };
    $.getUrlParm = function (url, parm) {
        var ret = {};
        url = url || $.href();
        if (parm === undefined) {
            var search = url;
            if (/\?/.test(search)) {
                var str = search.substr(search.indexOf("?") + 1);
                var params = str.split("&");
                $.each(params, function (i, o) {
                    var param = o.split("=");
                    if (param.length > 0) {
                        ret[param[0]] = decodeURIComponent($.trim(param[1] == undefined ? "" : param[1]));
                    }
                });
            }
        } else if (typeof parm == "string") {
            var req = new RegExp($.format("(%0=)([^(&|#)]*)", parm), "g");
            var results = req.exec(url);
            if (results != undefined && results.length == 3) {
                return $.trim(decodeURIComponent(results[2]));
            }
            return undefined;
        } else if (typeof parm === "object" && parm instanceof Array) {
            $.each(parm, function (i, k) {
                var req = new RegExp($.format("(%0=)([^(&|#)]*)", k), "g");
                var results = req.exec(url);
                if (results != undefined && results.length == 3) {
                    ret[k] = $.trim(decodeURIComponent(results[2]));
                }
            });
        }
        return ret;
    };
    /**
     * 格式化字符串
     * @param t 字符串
     * @param ... 替换参数
     * @returns {*}
     */
    $.format = function (t) {
        if (t) {
            for (var e = 0; !(-1 == t.indexOf("%" + e) || e > 10);) {
                var a = new RegExp("%" + e, "gi"), n = arguments[e + 1];
                t = t.replace(a, void 0 != n ? n : ""), e++;
            }
            return t;
        }
        return t;
    };

    /**
     * 时间格式化
     * @param s
     * @param e
     * @returns {*}
     */
    $.timerFormat = function (s, e) {

        function frmat(r) {
            if (parseInt(r, 10) < 10) {
                return "0" + parseInt(r, 10);
            }
            return parseInt(r, 10);
        }

        var ts = (s) - (e);//计算剩余的毫秒数
        var dd = parseInt(ts / 1000 / 60 / 60 / 24, 10);//计算剩余的天数
        var hh = parseInt(ts / 1000 / 60 / 60 % 24, 10);//计算剩余的小时数
        var mm = parseInt(ts / 1000 / 60 % 60, 10);//计算剩余的分钟数
        var ss = parseInt(ts / 1000 % 60, 10);//计算剩余的秒数
        if (ss < 0 || mm < 0) {
            return "";
        }
        dd = frmat(dd);
        hh = frmat(hh);
        mm = frmat(mm);
        ss = frmat(ss);

        if (dd > 0) {
            return dd + LANG_PRODUCT.JS.RULE.TEXT23 + hh + LANG_TEXTS.TEXT56 + mm + LANG_TEXTS.TEXT57 + ss + LANG_TEXTS.TEXT58;
        }
        if (hh > 0) {
            return hh + LANG_TEXTS.TEXT56 + mm + LANG_TEXTS.TEXT57 + ss + LANG_TEXTS.TEXT58;
        }

        return mm + LANG_TEXTS.TEXT57 + ss + LANG_TEXTS.TEXT58;

    };

    /**
     * 向前补零
     * @param num
     * @param n
     * @returns {*}
     */
    $.pad = function (num, n) {
        if (n == undefined) {
            n = 2;
        }
        return Array(n > ("" + num).length ? (n - ("" + num).length + 1) : 0).join(0) + num;
    };

    /**
     * 获取元素
     * @param element
     * @returns {*}
     */
    $.getElement = function (element) {
        if (!element) return undefined;

        if ($("#" + element).length > 0) {
            return $("#" + element);
        } else if ($(element).length > 0) {
            return $(element);
        } else if ($("[name=" + element + "]").length > 0) {
            return $("[name=" + element + "]");
        } else if ($("." + element).length > 0) {
            return $("." + element);
        }
        return undefined;
    };

    /**
     * 滚动条滚动至指定位置
     * @param top
     * @param speed
     */
    $.goTop = function (top, speed) {
        $("html,body").animate({scrollTop: top || 0}, speed || 500);

    };

    /**
     * 判断是否为Integer
     * @param num
     * @returns {boolean}
     */
    $.isInteger = function (num) {
        var f = num != undefined && /^\d+$/.test(num);
        if (f) {
            num = parseInt(num, 10);
            f = num >= -2147483648 && num <= 2147483647;
        }
        return f;
    };
    $.isMFloat = function (num) {
        var re = /^\d+(\.\d{1,2})?$/;
        return re.test(num);
    };

    /**
     * 判断是否为double
     * @param num
     * @returns {boolean}
     */
    $.isDouble = function (num) {
        return num != undefined && /^\d+(.[0-9])?$/.test(num);
    };

    /**
     * 格式化金额
     * @param $cell
     * @param num
     * @returns {*}
     */
    $.formatMoney = function (s, n, f) {
        /*
         * 参数说明：
         * s：要格式化的数字
         * n：保留几位小数
         * */
        n = n > 0 && n <= 20 ? n : 2;
        s = parseFloat((s + "").replace(/[^\d\.-]/g, "")).toFixed(n) + "";
        var l = s.split(".")[0].split("").reverse(),
            r = s.split(".")[1];
        var t = "";
        var isMinues = s < 0;
        if (isMinues) {
            l.pop();
        }
        for (var i = 0; i < l.length; i++) {
            t += l[i] + ((i + 1) % 3 == 0 && (i + 1) != l.length && l.length > 4 && !f ? "," : "");
        }
        if (isMinues) {
            t += "-";
        }

        return t.split("").reverse().join("") + "." + r;
    };

    /**
     * 格式化金额 分转元
     * @param value
     * @returns {*}
     */
    $.formatMoneyPenny = function (value, f) {
        return $.formatMoney(MathEx.Division(value || 0, 100), 2, f);
    };

    /**
     * 判断是否为数字
     * @param obj
     * @returns {boolean}
     */
    $.isNumeric = function (obj) {
        return !isNaN(parseFloat(obj)) && isFinite(obj);
    };


    $.number = function ($cell) {
        var re = /([0-9]+\.[0-9]{2})[0-9]*/;
        var value = parseFloat(String($cell).replace(re, "$1") || 0, 10);
        return isNaN(value) ? "" : value;
    };

    $.moneyNumber = function ($cell) {
        var re = /([0-9]+\.[0-9]{2})[0-9]*/;
        var value = parseFloat(String($cell).replace(re, "$1") || 0, 10);
        return isNaN(value) ? "" : (value);
    };

    /**
     * 判断字符串为json
     * @author hejin 2018/06/25
     * @pram str{ 字符串对象 }
     */
    $.isJSON = function (str) {
        if (typeof str == "string") {
            try {
                var obj = JSON.parse(str);
                if (typeof obj == "object" && obj) {
                    return true;
                } else {
                    return false;
                }

            } catch (e) {
                return false;
            }
        }
        console.log("It is not a string!");
    };


})(jQuery);