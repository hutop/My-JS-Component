/*
* MTHCRM 2.0 JavaScript 插件库
* Require: jQuery 1.6.2
* Date: 2011-08-23
*/

(function ($) {
    //定义初始化时间为唯一标记
    var now = +new Date;
    /*
    ** Author:Hutop_chen
    ** CreateDate:2011-8-9
    ** Version:1.0
    ** Description:CRM1.1 文本框空值提示
    */
    $.fn.extend({
        /*
        ** emptyText:要在文本框为空时显示的信息
        ** emptyColor:显示空文本信息时使用的字体颜色
        */
        emptyTips: function (emptyText, emptyColor) {
            return this.each(function () {
                if (this.type.toLowerCase() !== "text" && this.type.toLowerCase() !== "textarea") {
                    return true;
                }
                var oriColor = this.style.color;
                oriColor = oriColor === '' ? 'black' : oriColor;
                this.isEmpty = "true";
                $(this).bind({
                    blur: function () {
                        if (this.value === "" || this.value === emptyText) {
                            this.value = emptyText;
                            this.style.color = emptyColor;
                            this.isEmpty = "true";
                        } else {
                            this.style.color = oriColor;
                            this.isEmpty = "false";
                        }
                    },
                    focus: function () {
                        if (this.value === emptyText) {
                            this.value = "";
                            this.style.color = oriColor;
                        }
                    }
                }).blur();
            });
        },
        /*
        ** 弹出框
        ** closeBtnID:控制关闭的按钮ID
        ** needTray:是否需要半透明边框
        ** needBG:是否需要半透明背景
        ** trayCls:托盘样式类
        ** bgCls:背景样式类
        */
        popup: function (closeBtnID, needTray, needBG, trayCls, bgCls) {
            return this.each(function () {
                var body = $("body"), doc = $(document), bg, elem, w, h, vpCenter, myBg, elemPos, i, closeBtns, closePopup, resizePopup, bgStyle, trayStyle, bgStyleTxt, trayStyleTxt;
                elem = $(this);
                needTray = needTray === false ? false : true;
                needBG = needBG === false ? false : true;
                if (needBG) {
                    bgStyle = {
                        'height': doc.height() + 'px'
                    };
                    if (!!bgCls) {
                        if (bgCls.constructor.__typeName === 'Object') {
                            $.extend(bgColor, bgCls);
                            bgCls = 'popup-bg';
                        } else if (typeof bgCls === 'string' && bgCls === '') {
                            bgCls = 'popup-bg';
                        }
                    } else {
                        bgCls = 'popup-bg';
                    }
                    bgStyleTxt = '';
                    for (i in bgStyle) {
                        if (bgStyle.hasOwnProperty(i)) {
                            bgStyleTxt += i + ':' + bgStyle[i] + ';';
                        }
                    }
                    bg = $('<div style="' + bgStyleTxt + '" class="' + bgCls + '"><iframe style="width:100%;z-index: -1;height:100%;background:transparent;color:#fff;opacity:0;filter:alpha(opacity=0);" allowTransparent="true" frameBorder="0" src="Utils/blank.htm"></iframe></div>');
                    bg.appendTo(body);
                }
                resizePopup = function () {
                    elem.show();
                    w = elem.outerWidth();
                    h = elem.outerHeight();
                    vpCenter = $.viewportCenter(w, h);
                    elem.css({ top: vpCenter.top + "px", left: vpCenter.left + "px", zIndex: 10000, position: "absolute" });
                    if (!!myBg) {
                        elemPos = elem.offset();
                        myBg.css({ width: (w + 12) + "px", height: (h + 12) + "px", top: (elemPos.top - 6) + "px", left: (elemPos.left - 6) + "px" });
                    }
                }
                resizePopup();
                if (needTray) {
                    trayStyle = {};
                    if (!!trayCls) {
                        if (trayCls.constructor.__typeName === 'Object') {
                            $.extend(trayStyle, trayCls);
                            trayCls = 'popup-tray-bg';
                        } else if (typeof trayCls === 'string' && trayCls === '') {
                            trayCls = 'popup-tray-bg';
                        }
                    } else {
                        trayCls = 'popup-tray-bg';
                    }
                    trayStyleTxt = '';
                    for (i in trayStyle) {
                        if (trayStyle.hasOwnProperty(i)) {
                            trayStyleTxt += i + ':' + trayStyle[i] + ';';
                        }
                    }
                    myBg = $('<div style="' + trayStyleTxt + '" class="' + trayCls + '"></div>');
                    elemPos = elem.offset();
                    myBg.css({ width: (w + 12) + "px", height: (h + 12) + "px", top: (elemPos.top - 6) + "px", left: (elemPos.left - 6) + "px" });
                    myBg.appendTo(body);
                }

                $.resizePopup = resizePopup;
                closeBtns = "";
                for (i = closeBtnID.length - 1; i >= 0; i--) {
                    closeBtns += "#" + closeBtnID[i] + ",";
                }
                if (closeBtns.length > 0) {
                    closeBtns = closeBtns.slice(0, closeBtns.length - 1);
                    closePopup = function () {
                        elem.css({ display: "none" });
                        if (needBG) {
                            //bg.find('*').dropToDustbin();
                            bg.dropToDustbin();          //bg.empty().remove();
                        }
                        if (needTray) {
                            myBg.dropToDustbin();
                        }
                        $(closeBtns).unbind("click", closePopup);
                        $.collapsePopup = null;
                        elem.trigger("popUpClose");
                    }
                    $(closeBtns).bind("click", closePopup);
                    $.collapsePopup = closePopup;
                }
            });
        },
        /*
        ** 回车触发事件
        ** ctrlID:需要回车事件的元素ID
        ** ctrlEvent:执行处理的事件名
        */
        enterControlButton: function (ctrlID, ctrlEvent) {
            return this.each(function () {
                var evt = $(this);
                evt.keydown(function (event) {
                    if (event.keyCode == 13) {
                        eval('$("#' + ctrlID + '").' + ctrlEvent + '()');
                    }
                });
            });
        },
        /*
        ** 文本框最大输入长度
        ** l:最大长度
        */
        maxLength: function (l) {
            var evt = $(this);
            evt.keydown(function (event) {
                var val = this.value;
                if (val.length >= l && !(event.keyCode == 8 || event.keyCode == 9 || (event.keyCode >= 37 && event.keyCode <= 40))) {
                    //evt.val(evt.val().substring(0, l));
                    return false;
                }
            });
        },
        /*
        ** 文本框输入的最大值，用于验证输入的数字
        ** v:最大值
        */
        maxValue: function (v) {
            var evt = $(this);
            evt.keydown(function (e) {
                var val = evt.val();
                try {
                    if (parseFloat(val) >= v && !(event.keyCode == 8 || event.keyCode == 9 || (event.keyCode >= 37 && event.keyCode <= 40))) {
                        //this.value = v;
                        return false;
                    }
                } catch (ex) {
                    throw ex;
                }
            }).keyup(function (e) {
                var val = this.value;
                if (parseFloat(val) > v) {
                    this.value = v;
                }
            });
        },
        /*
        ** 正数验证
        */
        inputPositive: function () {
            return this.each(function () {
                var evt = $(this);
                evt.keydown(function (event) {
                    var keycode = event.keyCode;
                    if (keycode === 229) {
                        $(this).one('keyup', function () {
                            this.value = this.value.replace(/[^\d\+\-\.]+$/g, '');
                        });
                        return;
                    }
                    if (event.ctrlKey || event.shiftKey || event.altKey) {
                        return false;
                    }
                    if ((keycode == 190 || keycode == 110) && this.value.indexOf('.') > -1) {
                        return false;
                    }
                    if (!((keycode > 47 && keycode < 58) || (keycode > 95 && keycode < 106) || keycode == 8 || event.keyCode == 9 || keycode == 110 || keycode == 190 || (keycode >= 37 && keycode <= 40))) {
                        return false;
                    }
                });
            });
        },
        /*
        ** 正整数验证
        */
        inputPositiveInt: function () {
            return this.each(function () {
                var evt = $(this);
                evt.keydown(function (event) {
                    var keycode = event.keyCode;
                    if (keycode === 229) {
                        $(this).one('keyup', function () {
                            this.value = this.value.replace(/[^\d\+]+$/g, '');
                        });
                        return;
                    }
                    if (event.ctrlKey || event.shiftKey || event.altKey) {
                        return false;
                    }
                    if (!((keycode > 47 && keycode < 58) || (keycode > 95 && keycode < 106) || keycode == 8 || event.keyCode == 9 || (keycode >= 37 && keycode <= 40))) {
                        return false;
                    }
                });
            });
        },
        /*
        ** 整数验证
        */
        inputInt: function () {
            return this.each(function () {
                var evt = $(this);
                evt.keydown(function (event) {
                    var keycode = event.keyCode;
                    if (keycode === 229) {
                        $(this).one('keyup', function () {
                            this.value = this.value.replace(/[^\d\+\-]+$/g, '');
                        });
                        return;
                    }
                    if (event.ctrlKey || event.shiftKey || event.altKey) {
                        return false;
                    }
                    if (!((keycode > 47 && keycode < 58) || (keycode > 95 && keycode < 106) || keycode == 8 || event.keyCode == 9 || keycode == 107 || keycode == 109 || keycode == 187 || keycode == 189 || (keycode >= 37 && keycode <= 40))) {
                        return false;
                    }
                    if ((keycode == 107 || keycode == 109 || keycode == 187 || keycode == 189) && this.value.indexOf('-') > -1) {
                        return false;
                    }
                });
            });
        },
        /*
        ** 字母+数字验证
        */
        inputChar: function () {
            return this.each(function () {
                var evt = $(this);
                evt.keydown(function (event) {
                    var keycode = event.keyCode;
                    if (keycode === 229) {
                        $(this).one('keyup', function () {
                            this.value = this.value.replace(/[^A-Za-z0-9]+/g, '');
                        });
                        return;
                    }
                    if (event.ctrlKey || event.shiftKey || event.altKey) {
                        return false;
                    }
                    if (!((keycode >= 65 && keycode <= 90) || keycode == 8 || event.keyCode == 9 || (keycode > 47 && keycode < 58) || (keycode > 95 && keycode < 106))) {
                        return false;
                    }
                });
            });
        },
        /*
        ** 字母+数字验证，带正负号
        */
        inputSignChar: function () {
            return this.each(function () {
                var evt = $(this);
                evt.keydown(function (event) {
                    var keycode = event.keyCode;
                    if (keycode === 229) {
                        $(this).one('keyup', function () {
                            this.value = this.value.replace(/[^A-Za-z0-9]+/g, '');
                        });
                        return;
                    }
                    if (event.ctrlKey || event.shiftKey || event.altKey) {
                        return false;
                    }
                    if (!((keycode >= 65 && keycode <= 90) || keycode == 8 || event.keyCode == 9 || (keycode > 47 && keycode < 58) || (keycode > 95 && keycode < 106) || keycode === 107 || keycode === 109 || keycode === 187 || keycode === 189)) {
                        return false;
                    }
                });
            });
        },
        /*
        ** 数字验证
        */
        inputDigit: function () {
            return this.each(function () {
                var evt = $(this);
                evt.keydown(function (event) {
                    var keycode = event.keyCode;
                    if (keycode === 229) {
                        $(this).one('keyup', function () {
                            this.value = this.value.replace(/[^0-9]+/g, '');
                        });
                        return;
                    }
                    if (event.ctrlKey || event.shiftKey || event.altKey) {
                        return false;
                    }
                    if (!(keycode == 8 || event.keyCode == 9 || (keycode > 47 && keycode < 58) || (keycode > 95 && keycode < 106))) {
                        return false;
                    }
                });
            });
        },
        /*
        ** 数字验证，带正负号
        */
        inputSignDigit: function () {
            return this.each(function () {
                var evt = $(this);
                evt.keydown(function (event) {
                    var keycode = event.keyCode;
                    if (keycode === 229) {
                        $(this).one('keyup', function () {
                            this.value = this.value.replace(/[^0-9\+\-]+/g, '');
                        });
                        return;
                    }
                    if (event.ctrlKey || event.shiftKey || event.altKey) {
                        return false;
                    }
                    if (!(keycode === 8 || event.keyCode === 9 || (keycode > 47 && keycode < 58) || (keycode > 95 && keycode < 106) || keycode === 107 || keycode === 109 || keycode === 187 || keycode === 189)) {
                        return false;
                    }
                });
            });
        },
        /*
        ** 带箭头的提示框
        ** opts:提示框配置参数{
        **      tar:提示目标
        **      position:箭头停靠的位置--------------
        **           "top left":上边框靠左
        **           "top right":上边框靠右
        **           "right top":右边框靠上
        **           "right bottom":右边框靠下
        **           "bottom left":下边框靠左
        **           "bottom right":下边框靠右
        **           "left top":左边框靠上
        **           "left bottom":左边框靠下
        **      -------------------------------------
        **      needClose:是否显示关闭按钮
        **      bgStyle:提示框背景颜色，目前提供白色和黄色两种
        **      zIndex:层叠高度
        ** }
        */
        tipsBox: function (opts) {
            var def = {
                tar: '',
                position: 'top left',
                needClose: true,
                bgStyle: 'white',
                closeBtnCls: 'btn-close',
                zIndex: 10000
            }, elem = this;
            def = $.extend(def, opts);
            if (!def.tar || def.tar.length === 0) {
                return this;
            }
            function location() {
                var tar, hasInit, elem, elemL, elemT, elemW, elemH, tarW, tarH, tarPos, tarT, tarL, arrow, arrowLine,
                    arrDiv, btnClose = $('<a href="javascript:void(0);" class="' + def.closeBtnCls + '"></a>');
                if (typeof def.tar === 'string') {
                    tar = $("#" + def.tar);
                } else {
                    tar = $(def.tar);
                }
                elem = $(this).appendTo("body").show();
                tarW = tar.outerWidth(); tarH = tar.outerHeight(); tarPos = tar.offset(); tarT = tarPos.top; tarL = tarPos.left; hasInit = elem.attr("tipsBox") === "true";
                if (hasInit) {
                    //elem.find('div:first').find('*').dropToDustbin();
                    elem.find("div:first").dropToDustbin();          //elem.find("div:first").empty().remove();
                    elem.find("a." + def.closeBtnCls).dropToDustbin();
                }

                arrow = $('<span>◆</span>');
                arrowLine = $('<em>◆</em>');
                arrDiv = $('<div></div>');
                arrDiv.prepend(arrow).prepend(arrowLine);

                switch (def.bgStyle) {
                    case 'yellow':
                        elem.addClass('tips-box');
                        break;
                    case 'white':
                        elem.addClass('tips-box tips-box-white');
                        break;
                    default:
                        elem.addClass('tips-box');
                        if (!!def.bgStyle) {
                            elem.addClass(def.bgStyle);
                        }
                        break;
                }
                elem.prepend(arrDiv);
                if (def.needClose) {
                    btnClose.click(function () {
                        elem.hide();
                        return false;
                    });
                    elem.prepend(btnClose).css({ 'padding-right': btnClose.outerWidth() + 5 });
                }
                elemW = elem.outerWidth();
                elemH = elem.outerHeight();
                //判断箭头位置
                switch (def.position) {
                    case 'top left':
                        arrow.addClass('arr-t');
                        arrowLine.addClass('arr-line-t');
                        arrDiv.addClass('top-box arr-pos-left');
                        elemT = tarH + tarT;
                        elemL = tarL;
                        break;
                    case 'top right':
                        arrow.addClass('arr-t');
                        arrowLine.addClass('arr-line-t');
                        arrDiv.addClass('top-box arr-pos-right');
                        elemT = tarH + tarT;
                        elemL = tarW + tarL - elemW;
                        break;
                    case 'bottom left':
                        arrow.addClass('arr-b');
                        arrowLine.addClass('arr-line-b');
                        arrDiv.addClass('bottom-box arr-pos-left');
                        elemT = tarT - elemH;
                        elemL = tarL;
                        break;
                    case 'bottom right':
                        arrow.addClass('arr-b');
                        arrowLine.addClass('arr-line-b');
                        arrDiv.addClass('bottom-box arr-pos-right');
                        elemT = tarT - elemH;
                        elemL = tarW + tarL - elemW;
                        break;
                    case 'left top':
                        arrow.addClass('arr-l');
                        arrowLine.addClass('arr-line-l');
                        arrDiv.addClass('left-box arr-pos-top');
                        elemT = tarT - 10;
                        elemL = tarL + tarW + 10;
                        break;
                    case 'left bottom':
                        arrow.addClass('arr-l');
                        arrowLine.addClass('arr-line-l');
                        arrDiv.addClass('left-box arr-pos-bottom');
                        elemT = tarT - elemH - 10;
                        elemL = tarL + tarW + 10;
                        break;
                    case 'right top':
                        arrow.addClass('arr-r');
                        arrowLine.addClass('arr-line-r');
                        arrDiv.addClass('right-box arr-pos-top');
                        elemT = tarT - 10;
                        elemL = tarL - elemW - 10;
                        break;
                    case 'right bottom':
                        arrow.addClass('arr-r');
                        arrowLine.addClass('arr-line-r');
                        arrDiv.addClass('right-box arr-pos-bottom');
                        elemT = tarT - elemH - 10;
                        elemL = tarL - elemW - 10;
                        break;
                    default:
                        arrow.addClass('arr-t');
                        arrowLine.addClass('arr-line-t');
                        arrDiv.addClass('top-box arr-pos-left');
                        elemT = tarH + tarT;
                        elemL = tarL + 10;
                        break;
                }
                elem.css({ top: elemT, left: elemL, zIndex: def.zIndex }).attr("tipsBox", "true");
                arrow.css("color", elem.css("background-color"));
                arrowLine.css("color", elem.css("border-color"));
                if ($.isIE6 && elem.find("iframe[src='Utils/blank.htm']").length === 0) {
                    elem.append("<iframe src='Utils/blank.htm' style='position:absolute;top:-1px;left:-1px;z-index:-1;width:" + elemW + "px;height:" + elemH + "px;opacity:0;filter:alpha(opacity=0);color:#fff;backkground:transparent' allowTransparent='true' frameBorder='0'></iframe>");
                }
            }
            return this.each(location);
        },
        /*
        ** 设置元素的最大高度
        ** h:最大高度
        ** s:超过最大高度时的样式(ex:{"overflow-y":"scroll"}),可选,默认scroll
        */
        maxHeight: function (h, s) {
            return this.each(function () {
                var evt = $(this);
                if ($.isIE6) {
                    if (!!s) {
                        evt.css($.extend({ height: h }, s));
                    } else {
                        evt.css({ height: h, 'overflow-y': 'scroll' });
                    }
                } else {
                    if (!!s) {
                        evt.css($.extend({ maxHeight: h }, s));
                    } else {
                        evt.css({ maxHeight: h, 'overflow-y': 'scroll' });
                    }
                }
            });
        },
        /*
        ** 鼠标手势
        */
        mouseGestures: function (opts) {
            var def = {
                step: 100,
                duration: 'fast'
            }, timeStamp, distance;
            def = $.extend(true, def, opts);
            //开始时间
            function catchStart(e) {
                timeStamp = +new Date;
                distance = e.pageX;
                $(this).trigger("moveStart");
            }
            //结束时间
            function catchEnd(e) {
                var evt = $(this), direction, step, evtW = evt.outerWidth(), evtL = evt.position().left;
                timeStamp = +new Date - timeStamp;
                distance = e.pageX - distance;
                direction = distance > 0 ? 1 : -1;
                step = direction * def.step + evtL;
                step = step > 0 ? 0 : step;
                step = step < -evtW + def.step ? -evtW + def.step : step;
                if (timeStamp < 500 && Math.abs(distance) > 40) {
                    evt.animate({ left: step }, def.duration, function () {
                        evt.trigger("moveComplete");
                    });
                }
            }
            return this.each(function () {
                var evt = $(this);
                evt.mousedown(catchStart).mouseup(catchEnd);
            });
        },
        /*
        ** 背景闪烁
        ** color:要闪烁的目标颜色
        ** times:闪烁次数
        ** duration:闪烁间隔
        */
        blinkBg: function (opts) {
            var def = {
                color: '#dc0c02',
                times: 4,
                duration: 100
            };
            def = $.extend(true, def, opts);
            if (def.times % 2 !== 0) {
                ++def.times;
            }
            if (def.duration < 50) {
                def.duration = 50;
            }
            function blink(elem, c) {
                elem.css({ "background-color": c });
            }
            return this.each(function () {
                var elem = $(this), oriColor, i, duration, color;
                oriColor = elem.css("background-color");
                for (i = 0; i < def.times; i++) {
                    duration = def.duration * i;
                    color = i % 2 === 0 ? def.color : oriColor;
                    //eval("setTimeout(function () { blink(elem, '" + color + "'); }, duration)");
                    (function (e, c, d) {
                        setTimeout(function () {
                            blink(e, c);
                        }, d);
                    })(elem, color, duration);
                }
            });
        },
        /*
        ** 用$.remove()方法[里面调用的是parentObj.removeChild方法]在IE6和7下会造成内存泄露，
        ** 但是使用innerHTML方法清空则不会出现此种情况，
        */
        dropToDustbin: function (opts) {
            return this.each(function () {
                $.event.remove(this);
                $.removeData(this);
                //判断是否已加载到DOM树并不在垃圾箱中
                if (this.parentNode && $(this).closest("#dvDustbin" + now).length < 1) {
                    document.getElementById("dvDustbin" + now).appendChild(this);       //放入到垃圾箱等待回收
                }
            });
        }
    });

    /*初始化一个用来存放需要移除的节点的垃圾箱，必须在文档加载完成后执行，否则会出现警告*/
    $(function () {
        $('<div id="dvDustbin' + now + '" style="display:none;"></div>').appendTo($("body"));
        //定时清空垃圾箱的HTML
        function clearDustbin() {
            document.getElementById("dvDustbin" + now).innerHTML = "";
            setTimeout(clearDustbin, 5000);
        }
        clearDustbin();
        $(window).unload(function () {
            document.getElementById("dvDustbin" + now).innerHTML = "";
        });
    });

    /*
    ** Author:Hutop_chen
    ** CreateDate:2011-7-29
    ** Version:1.0
    ** Description:CRM1.1一般处理函数
    */
    $.extend({
        errLog: [],
        /*
        ** 获取或设置当前URL的参数
        ** name:参数名，必须
        ** val:参数值，可选，若设置，则位设置对应名值对中的值，若不设，则为返回对应名值对的值
        */
        queryString: function (name, val, href) {
            var str, queryInit, qs, nameValList = [], temp, i;
            if (!!href) {
                str = href
            } else {
                str = location.href;
            }
            queryInit = str.indexOf("?") + 1;
            qs = str.slice(queryInit).split("&");
            if (!val) {
                for (i = qs.length - 1; i >= 0; i--) {
                    if (qs[i].indexOf("=") > -1) {
                        temp = qs[i].split("=");
                        if (temp[0].toLowerCase() == name.toLowerCase()) {
                            return temp[1];
                        }
                    }
                }
            } else {
                val = val.toString();
                for (i = qs.length - 1; i >= 0; i--) {
                    if (qs[i].indexOf("=") > -1) {
                        temp = qs[i].split("=");
                        if (temp[0] == name) {
                            break;
                        }
                    }
                }

                if (i >= 0) {
                    temp = qs[i].split("=");
                    temp[1] = val;
                    return str.replace(qs[i], temp[0] + "=" + temp[1]);
                } else {
                    if (str.indexOf("?") < 0) {
                        return str + "?" + temp[0] + "=" + val;
                    } else {
                        return str + "&" + name + "=" + val;
                    }
                }
            }
            return "";
        },
        /*
        ** 获取某样式类的内容
        */
        getCssClassContent: function (clsName) {
            var currentStyle, originalStyle, classStyle, name, tmpDiv;
            tmpDiv = document.createElement("div");
            $(tmpDiv).dropToDustbin();
            if (tmpDiv.runtimeStyle) {
                originalStyle = tmpDiv.runtimeStyle;
            } else {
                originalStyle = document.defaultView.getComputedStyle(tmpDiv);
            }
            tmpDiv.className = clsName;
            if (tmpDiv.runtimeStyle) {
                currentStyle = tmpDiv.runtimeStyle;
            } else {
                currentStyle = document.defaultView.getComputedStyle(tmpDiv);
            }
            classStyle = {};
            for (name in currentStyle) {
                if (currentStyle[name] !== originalStyle[name]) {
                    classStyle[name] = currentStyle[name]
                }
            }
            return classStyle;
        },
        /*
        ** 信息提示框
        ** tips:信息内容，可以是HTML标记
        ** _tipsBoxTpl:私有变量，tipsBox的容器
        ** _tipsBoxIE6Fix:私有变量，IE6中的防止tipsBox被select切割
        ** _tipsBoxIE6Fix2:私有变量，IE6中的防止tipsBox被select切割
        */
        _tipsBoxTpl: $('<div class="tips-box-top"></div>'),
        _tipsBoxTimeoutID: 0,
        _tipsBoxIE6Fix: $('<div style="filter:alpha(opacity=0);opacity:0;position:absolute;z-index:99998;overflow:hidden;"><iframe src="Utils/blank.htm" frameBorder="0" style="z-index:-1;width:100%;height:100%;"></iframe>&nbsp;</div>'),
        _tipsBoxIE6Fix2: $('<div style="filter:alpha(opacity=0);opacity:0;position:absolute;z-index:999;overflow:hidden;"><iframe src="Utils/blank.htm" frameBorder="0" style="z-index:-1;width:100%;height:100%;"></iframe>&nbsp;</div>'),
        /*
        ** tips:要显示的信息
        ** fadeIn:渐显间隔
        ** duration:显示完成后显示的时间间隔
        ** fadeOut:渐隐间隔
        ** callback:动作完成后要调用的函数
        ** blink:背景是否闪烁
        */
        tipsBox: function (tips, fadeIn, duration, fadeOut, callback, blink) {
            fadeIn = !!fadeIn ? fadeIn : 600;
            duration = !!duration ? duration : 2500;
            fadeOut = !!fadeOut ? fadeOut : 1000;
            var pos = $.viewportCenter(200, 80), w, h;
            $._tipsBoxTpl.css({ top: pos.top, left: pos.left, display: "none" }).empty().html(tips).appendTo($("body"));
            w = $._tipsBoxTpl.outerWidth();
            h = $._tipsBoxTpl.outerHeight();
            if ($.isIE6) {
                $._tipsBoxIE6Fix.css({ top: pos.top, left: pos.left, width: w, height: h }).appendTo($("body"));
            }
            $._tipsBoxTpl.stop().css({ "opacity": "1", width: 180 }).fadeIn(fadeIn, function () {
                clearTimeout($._tipsBoxTimeoutID);
                $._tipsBoxTimeoutID = setTimeout(function () {
                    $._tipsBoxTpl.fadeOut(fadeOut, function () {
                        $._tipsBoxTpl.remove();
                        if ($.isIE6) {
                            $._tipsBoxIE6Fix.remove();
                        }
                        if (!!callback) {
                            callback();
                        }
                    });
                }, duration);
            });
            if (!!blink) {
                $._tipsBoxTpl.blinkBg({
                    color: '#ffd0d0',
                    times: 6
                });
            }
        },
        /*
        ** 带箭头的信息提示框
        ** _tipsBoxTplArr:私有变量，tipsBoxArr的容器
        ** tar,position,needClose,bgStyle:参考tipsBox
        ** tips:提示信息
        */
        _tipsBoxTplArr: $('<div></div>'),
        tipsBoxArr: function (opts) {
            var def = {
                tar: null,
                position: 'top left',
                needClose: true,
                bgStyle: 'white',
                tips: ''
            };
            if (!!opts.tar) {
                def = $.extend(true, def, opts);
                if (typeof def.tips === 'string') {
                    $._tipsBoxTplArr.html(opts.tips).removeAttr("tipsBox").tipsBox(def);
                } else {
                    $._tipsBoxTplArr.append(opts.tips).removeAttr("tipsBox").tipsBox(def);
                }
            }
        },
        tipsBoxArrClose: function () {
            $._tipsBoxTplArr.hide();
        },
        viewportCenter: function (w, h) {
            var win = $(window);
            var vpWidth = win.width();
            var vpHeight = win.height();
            var vpScrollTop = win.scrollTop();
            var vpScrollLeft = win.scrollLeft();
            return { left: (vpWidth - w) / 2 + vpScrollLeft, top: (vpHeight - h) / 2 + vpScrollTop, winCenter: { top: vpHeight / 2, left: vpWidth / 2} };
        },
        isDigit: function (s) {
            var digit = /^\d*$/g;
            return digit.test(s);
        },
        isInt: function (s) {
            var i = /^(?:(?:\+|\-)?[1-9]\d*|0)$/g;
            return i.test(s);
        },
        isPositiveInt: function (s) {
            var i = /^(?:\+?[1-9]\d*|0)$/;
            return i.test(s);
        },
        isPositive: function (s) {
            var positiveNum = /^(?:\+?[1-9]\d*(?:\.\d+)?|0(?:\.\d+)?)$/g;
            return positiveNum.test(s);
        },
        isDate: function (s) {
            var date = /^(\d{1,4})(-|\/)(\d{1,2})\2(\d{1,2})$/
            return date.test(s);
        },
        isChar: function (s) {
            var str = /[a-zA-Z0-9]+/g;
            return str.test(s);
        },
        checkMoney: function (s) {
            var tempValue = s.replace(/(^\s+)|(\s+$)/g, '');
            if (!tempValue) { return false }
            if (/^-?\d+(\.\d+)?$/.test(tempValue)) {
                return true;
            }
        },
        bindMaxLength: function () {
            $("input:text").each(function () {
                var evt = $(this);
                if (!!evt.attr("MaxLength")) {
                    evt.keydown(function (event) {
                        var val = evt.val();
                        if (val.length >= l && event.keyCode != 8) {
                            return false;
                        }
                    });
                }
            });
        },
        collapsePopup: null,
        toJsonString: function (obj) {
            var tmp = '{', i;
            for (i in obj) {
                if (obj.hasOwnProperty(tmp)) {
                    tmp += '"' + i + '":"' + obj[i] + '",';
                }
            }

            return tmp.slice(0, -1) + '}';
        },
        mousePos: function (e) {
            var b = document.body;
            if (!e.pageX) {
                return { x: e.clientX + b.scrollLeft - b.clientLeft, y: e.clientY + b.scrollTop - b.clientTop };
            } else {
                return { x: e.pageX, y: e.pageY };
            }
        },
        setProperty: function (name, value) {
            $[name] = value;
        },
        isIE6: $.browser.msie && parseFloat($.browser.version) < 7
    });

    /*
    ** Author:Hutop_chen
    ** CreateDate:2011-7-12
    ** Version:1.0
    ** Description:CRM1.1专用图片按钮
    */
    $.MTHCrmButton = function (opts) {
        this.options = $.extend(true, {}, this.defaultOptions, opts);
        this.button = null;     //按钮实体
        this.initButton();
        return this;
    };
    $.MTHCrmButton.modiDefaultOptions = function (opts) {
        $.extend(true, $.MTHCrmButton.prototype.defaultOptions, opts);
    };
    $.extend(true, $.MTHCrmButton.prototype, {
        initButton: function () {
            this.enable();
        },
        /*
        ** outCls:鼠标移出时的样式
        ** overCls：鼠标移进时的样式
        ** clickCls：鼠标单击时的样式
        ** btnTitle：按钮提示文字
        ** imgSrc：按钮图片
        ** clickFunc：鼠标单击时的回调函数
        ** btnTpl：按钮模板
        */
        defaultOptions: {
            outCls: "btn-out",
            overCls: "btn-over",
            clickCls: "btn-click",
            btnTitle: "",
            btn_disabled_cls: "btn-disabled",
            btn_cls: "btn",
            imgSrc: "",
            imgSrc_disabled: "",
            callback: {},
            btnTpl: '<table cellspacing="0" cellpadding="0" class="{2}"><tr><td class="btn-left">&nbsp;</td><td class="btn-center"><img alt="{0}" title="{0}" src="{1}" /></td><td class="btn-right">&nbsp;</td></tr></table>'
        },
        setOptions: function (opts) {
            this.options = $.extend(true, this.options, opts);
        },
        /*
        ** 加入到页面DOM中
        ** tar：要加入到的父容器
        */
        appendTo: function (tar) {
            this.button.appendTo(tar);
            return this;
        },
        /*
        ** 绑定UI事件
        ** evts:事件列表({click:function(){ //TODO }})
        */
        bindEvents: function (evts) {
            this.button.bind(evts);
            return this;
        },
        /*
        ** 移除UI事件
        ** evts:事件列表({click:function(){ //TODO }})
        */
        unbindEvents: function (evtName, func) {
            if (evtName === "") {
                this.button.unbind();
            } else {
                if (!!func) {
                    this.button.unbind(evtName, func);
                } else {
                    this.button.unbind(evtName);
                }
            }
            return this;
        },
        /*
        ** 使按钮生效
        */
        enable: function () {
            var self = this;

            var tmpBtn;
            tmpBtn = $(this.options.btnTpl.replace(/\{0\}/mg, this.options.btnTitle).replace(/\{1\}/mg, this.options.imgSrc).replace(/\{2\}/mg, this.options.btn_cls));
            tmpBtn.hover(function () {
                $(this).removeClass(self.options.outCls + " " + self.options.clickCls).addClass(self.options.overCls);
            }, function () {
                $(this).removeClass(self.options.overCls + " " + self.options.clickCls).addClass(self.options.outCls);
            });
            tmpBtn.mousedown(function () {
                $(this).removeClass(self.options.outCls + " " + self.options.overCls).addClass(self.options.clickCls);
            });
            tmpBtn.click(function () {
                $(this).removeClass(self.options.clickCls + " " + self.options.outCls).addClass(self.options.overCls);
            });

            tmpBtn.bind(this.options.callback);

            if (!!this.button) {
                this.button.replaceWith(tmpBtn);
            }
            this.button = tmpBtn;

            return this;
        },
        /*
        ** 使按钮失效
        */
        disable: function () {
            this.button.unbind();
            var tmpBtn = $(this.options.btnTpl.replace(/\{0\}/mg, this.options.btnTitle).replace(/\{1\}/mg, this.options.imgSrc_disabled).replace(/\{2\}/mg, this.options.btn_disabled_cls));
            this.button.replaceWith(tmpBtn);
            this.button = tmpBtn;

            return this;
        },
        dispose: function () {
            //this.button.find('*').dropToDustbin();  //this.button.unbind();this.button.empty();
            this.button.dropToDustbin();            //this.button.remove();
        },
        /*
        ** 获取按钮实体的样式
        */
        css: function (name, extra) {
            return this.button.css(name, extra);
        }
    });

    /*
    ** Author:Hutop_chen
    ** CreateDate:2011-7-12
    ** Version:1.0
    ** Description:CRM1.1专用分页控件
    */
    $.MTHCrmPagingBar = function (opts) {
        this.options = $.extend(true, {}, this.defaultOptions, opts);
        this.pagingBar = null;          //分页控件栏
        this.btnFirPage = null;         //第一页按钮
        this.btnPrevPage = null;        //上一页按钮
        this.btnNextPage = null;        //下一页按钮
        this.btnLastPage = null;        //最后一页按钮
        this.btnRefresh = null;         //刷新按钮
        this.quickPaging = null;        //快速跳页
        this.btnQuickPaging = null;     //快色跳转按钮
        this.pageIndex = 1;             //当前页码
        this.pageCount = 1;             //分页总数
        this.totalCount = 1;            //总条数
        this.pageSize = 10;             //每页条数
        this.initPagingBar();
        return this;
    };
    $.MTHCrmPagingBar.modiDefaultOptions = function (opts) {
        $.extend(true, $.MTHCrmPagingBar.prototype.defaultOptions, opts);
    };
    $.extend(true, $.MTHCrmPagingBar.prototype, {
        initPagingBar: function () {
            var self = this, quickPagingTpl;
            this.pagingBar = $(this.options.pagingBarTpl);

            this.btnFirPage = new $.MTHCrmButton({
                btnTitle: "第一页",
                imgSrc: this.options.btnsSrc.first,
                imgSrc_disabled: this.options.btnsSrc_disabled.first,
                callback: this.options.btnsFunc.first
            });
            this.btnFirPage.appendTo(this.pagingBar).disable();

            this.btnPrevPage = new $.MTHCrmButton({
                btnTitle: "上一页",
                imgSrc: this.options.btnsSrc.prev,
                imgSrc_disabled: this.options.btnsSrc_disabled.prev,
                callback: this.options.btnsFunc.prev
            });
            this.btnPrevPage.appendTo(this.pagingBar).disable();

            this.btnNextPage = new $.MTHCrmButton({
                btnTitle: "下一页",
                imgSrc: this.options.btnsSrc.next,
                imgSrc_disabled: this.options.btnsSrc_disabled.next,
                callback: this.options.btnsFunc.next
            });
            this.btnNextPage.appendTo(this.pagingBar).bindEvents({
                click: function () {
                    self.paging(self.pageIndex + 1);
                }
            });

            this.btnLastPage = new $.MTHCrmButton({
                btnTitle: "最后一页",
                imgSrc: this.options.btnsSrc.last,
                imgSrc_disabled: this.options.btnsSrc_disabled.last,
                callback: this.options.btnsFunc.last
            });
            this.btnLastPage.appendTo(this.pagingBar).bindEvents({
                click: function () {
                    self.paging(self.pageCount);
                }
            });

            this.btnRefresh = new $.MTHCrmButton({
                btnTitle: "刷新",
                imgSrc: this.options.btnsSrc.refresh,
                imgSrc_disabled: this.options.btnsSrc_disabled.refresh,
                callback: this.options.btnsFunc.refresh
            });
            this.btnRefresh.appendTo(this.pagingBar).bindEvents({
                click: function () {
                    self.paging(self.pageIndex);
                }
            });

            quickPagingTpl = this.options.quickPagingTpl.replace(/\{totalCount\}/g, this.totalCount).replace(/\{pageCount\}/g, this.pageCount).replace(/\{pageIndex\}/g, this.pageIndex).replace(/\{pageSize\}/g, this.pageSize);
            this.quickPaging = $(quickPagingTpl);
            this.quickPaging.appendTo(this.pagingBar);
            this.quickPaging.find("input:text").keydown(function (event) {
                var keycode = event.keyCode, index;
                if (keycode == 13) {
                    index = parseInt(this.value);
                    self.paging(index);
                    event.stopPropagation();
                    return false;
                }
            }).inputInt();

            if (this.options.quickPagingButton) {
                this.btnQuickPaging = new $.MTHCrmButton({
                    btnTitle: "跳转",
                    imgSrc: this.options.btnsSrc.quickPaging,
                    imgSrc_disabled: this.options.btnsSrc_disabled.quickPaging,
                    callback: this.options.btnsFunc.quickPaging
                }).appendTo(this.quickPaging.find("td[rel='quickPagingButton']")).bindEvents({
                    click: function () {
                        var index;
                        index = self.quickPaging.find("input:text").val();
                        self.paging(parseInt(index));
                    }
                });
            }
        },
        /*
        ** 默认参数
        ** pagingBarTpl:分页栏模板
        ** quickPagingTpl:快速跳页模板
        ** quickPagingButton:是否显示快速跳转按钮
        ** btnSrc:各个图片按钮图片路径
        ** btnsSrc_disabled:各个图片按钮不可用图片路径
        ** btnsClickFunc:按钮单击时的回调函数
        ** sendPagingReq:发送跳页请求，可以在此函数内完成跳页的请求，动作等
        */
        defaultOptions: {
            pagingBarTpl: '<div class="toolbar"></div>',
            quickPagingTpl: '<table cellpadding="0" cellspacing="0" class="btn"><tr><td>共<span>{totalCount}</span>条/<span>{pageCount}</span>页,当前第</td><td><input type="text" value="{pageIndex}" style="width:50px;border:1px solid #98c0f4" /></td><td><span>页</span></td><td rel="quickPagingButton"></td><td>(每页<span>{pageSize}</span>条)</td></tr></table>',
            quickPagingButton: false,
            btnsSrc: {
                first: "../Include/Scripts/MTHCRMWidget/MTHCRMWidgetRes/Images/page-first.gif",
                prev: "../Include/Scripts/MTHCRMWidget/MTHCRMWidgetRes/Images/page-prev.gif",
                next: "../Include/Scripts/MTHCRMWidget/MTHCRMWidgetRes/Images/page-next.gif",
                last: "../Include/Scripts/MTHCRMWidget/MTHCRMWidgetRes/Images/page-last.gif",
                refresh: "../Include/Scripts/MTHCRMWidget/MTHCRMWidgetRes/Images/refresh.gif",
                quickPaging: "../Include/Scripts/MTHCRMWidget/MTHCRMWidgetRes/Images/qucik_paging.gif"
            },
            btnsSrc_disabled: {
                first: "../Include/Scripts/MTHCRMWidget/MTHCRMWidgetRes/Images/page-first-disabled.gif",
                prev: "../Include/Scripts/MTHCRMWidget/MTHCRMWidgetRes/Images/page-prev-disabled.gif",
                next: "../Include/Scripts/MTHCRMWidget/MTHCRMWidgetRes/Images/page-next-disabled.gif",
                last: "../Include/Scripts/MTHCRMWidget/MTHCRMWidgetRes/Images/page-last-disabled.gif",
                refresh: "../Include/Scripts/MTHCRMWidget/MTHCRMWidgetRes/Images/refresh.gif",
                quickPaging: "../Include/Scripts/MTHCRMWidget/MTHCRMWidgetRes/Images/qucik_paging_d.gif"
            },
            btnsFunc: {
                first: {},
                prev: {},
                next: {},
                last: {},
                refresh: {},
                quickPaging: {}
            },
            sendPagingReq: $.noop
        },
        /*
        ** 使控件里的按钮生效
        */
        enable: function () {
            var self = this;
            this.btnFirPage.enable().bindEvents({
                click: function () {
                    self.paging(1);
                }
            });
            this.btnLastPage.enable().bindEvents({
                click: function () {
                    self.paging(self.pageCount);
                }
            });
            this.btnNextPage.enable().bindEvents({
                click: function () {
                    self.paging(self.pageIndex + 1);
                }
            });
            this.btnPrevPage.enable().bindEvents({
                click: function () {
                    self.paging(self.pageIndex - 1);
                }
            });
            this.btnRefresh.enable().bindEvents({
                click: function () {
                    self.paging(self.pageIndex);
                }
            });
            if (this.options.quickPagingButton) {
                this.btnQuickPaging.enable().bindEvents({
                    click: function () {
                        var index;
                        index = self.quickPaging.find("input:text").val();
                        self.paging(parseInt(index));
                    }
                });
            }
            //this.quickPaging.find("input:text").removeAttr("disabled");
        },
        /*
        ** 使控件内的按钮失效
        */
        disable: function () {
            this.btnFirPage.disable();
            this.btnLastPage.disable();
            this.btnNextPage.disable();
            this.btnPrevPage.disable();
            this.btnRefresh.disable();
            if (this.options.quickPagingButton) {
                this.btnQuickPaging.disable();
            }
            //this.quickPaging.find("input:text").attr("disabled", "disabled");
        },
        /*
        ** 修改实例参数
        */
        setOptions: function (opts) {
            this.options = $.extend(true, this.options, opts);
        },
        /*
        ** 修改快速跳页的当前值
        */
        setQuickPagingValue: function (pageCount, pageIndex, totalCount, pageSize) {
            this.quickPaging.find("span:first").html(totalCount);
            this.quickPaging.find("span:eq(1)").html(pageCount);
            this.quickPaging.find("span:last").html(pageSize);
            this.pageCount = pageCount;

            if (!!pageIndex) {
                this.quickPaging.find("input:text").val(pageIndex);
                this.pageIndex = pageIndex;
            }

            this.resetButtons(pageIndex);
            var self = this;
            this.btnRefresh.enable().bindEvents({
                click: function () {
                    self.paging(self.pageIndex);
                }
            });

        },
        resetButtons: function (index) {
            if (this.pageCount <= 1 || isNaN(this.pageCount)) {
                this.btnFirPage.disable();
                this.btnPrevPage.disable();
                this.btnLastPage.disable();
                this.btnNextPage.disable();
                if (this.options.quickPagingButton) {
                    this.btnQuickPaging.disable();
                }
                return;
            }
            var self = this;
            this.quickPaging.find("input:text").val(index);
            this.pageIndex = index;
            if (this.options.quickPagingButton) {
                this.btnQuickPaging.enable().bindEvents({
                    click: function () {
                        var index;
                        index = self.quickPaging.find("input:text").val();
                        self.paging(parseInt(index));
                    }
                });
            }
            switch (index) {
                case 1:
                    this.btnFirPage.disable();
                    this.btnPrevPage.disable();
                    this.btnLastPage.enable().bindEvents({
                        click: function () {
                            self.paging(self.pageCount);
                        }
                    });
                    this.btnNextPage.enable().bindEvents({
                        click: function () {
                            self.paging(self.pageIndex + 1);
                        }
                    });
                    break;
                case this.pageCount:
                    this.btnFirPage.enable().bindEvents({
                        click: function () {
                            self.paging(1);
                        }
                    });
                    this.btnPrevPage.enable().bindEvents({
                        click: function () {
                            self.paging(self.pageIndex - 1);
                        }
                    });
                    this.btnLastPage.disable();
                    this.btnNextPage.disable();
                    break;
                default:
                    this.enable();
                    break;
            }
        },
        /*
        ** 跳页函数，发送跳页请求前的动作
        ** index:目标页码
        */
        paging: function (index) {
            if (this.pageIndex == index) {
                this.options.sendPagingReq(index, "refresh");
                return;
            }

            index = (index > this.pageCount ? this.pageCount : index);
            index = (index < 0 ? 0 : index);
            this.resetButtons(index);

            this.options.sendPagingReq(index);
        },
        /*
        ** 加载到DOM树中
        ** tar:目标DOM元素
        */
        appendTo: function (tar) {
            return this.pagingBar.appendTo(tar);
        },
        /*
        ** 获取分页栏的样式
        */
        css: function (name, extra) {
            if (!!extra) {
                return this.pagingBar.css(name, extra);
            } else {
                return this.pagingBar.css(name);
            }
        },
        /*
        ** 快速获取分页栏的宽，并把补白及边框计算在内
        ** val:可选，有则为修改，无则为获取
        */
        width: function (val) {
            if (!!val) {
                return this.pagingBar.width(val);
            } else {
                var adjust = parseInt(this.pagingBar.css("padding-left")) + parseInt(this.pagingBar.css("padding-right")) +
                                    parseInt(this.pagingBar.css("margin-left")) + parseInt(this.pagingBar.css("margin-right")) +
                                    parseInt(this.pagingBar.css("border-left-width")) + parseInt(this.pagingBar.css("border-right-width"));
                adjust = adjust == NaN ? 0 : adjust;
                return this.pagingBar.outerWidth() + adjust;
            }
        },
        /*
        ** 快速获取分页栏的高，并把补白及边框计算在内
        ** val:可选，有则为修改，无则为获取
        */
        height: function (val) {
            if (!!val) {
                return this.pagingBar.height(val);
            } else {
                var adjust = parseInt(this.pagingBar.css("padding-top")) + parseInt(this.pagingBar.css("padding-bottom")) +
                                    parseInt(this.pagingBar.css("margin-top")) + parseInt(this.pagingBar.css("margin-bottom")) +
                                    parseInt(this.pagingBar.css("border-top-width")) + parseInt(this.pagingBar.css("border-bottom-width"));
                adjust = isNaN(adjust) ? 0 : adjust;
                return this.pagingBar.outerHeight() + adjust;
            }
        },
        dispose: function () {
            var prop;
            //this.pagingBar.find('*').dropToDustbin();   //this.pagingBar.empty();
            this.pagingBar.dropToDustbin();             //this.pagingBar.remove();
            for (prop in this) {
                if (this.hasOwnProperty(prop)) {
                    if (!!this[prop] && !!this[prop].dispose) {
                        this[prop].dispose();
                    }
                    this[prop] = null;
                    delete this[prop];
                }
            }
        }
    });

    /*
    ** Author:Hutop_chen
    ** CreateDate:2011-7-12
    ** Version:1.0
    ** Description:CRM1.1专用控件阴影
    */
    $.MTHCrmShadow = $.fn.MTHCrmShadow = function (opts) {
        this.options = $.extend(true, {}, this.defaultOptions, opts);
        this.shadow = null;             //阴影实体
        this.initShadow();
        this.tar = null;                //
        return this;
    };
    $.extend(true, $.MTHCrmShadow.prototype, {
        initShadow: function () {
            this.shadow = $(this.options.shadowTpl);
            this.options.tar = $(this.options.tar);
            this.resize();
        },
        /*
        ** 重绘阴影区域
        */
        resize: function () {
            var w, h, z, pos;
            w = this.options.tar.width();
            h = this.options.tar.height();
            z = this.options.tar.css("z-index");
            pos = this.options.tar.position();
            this.shadow.css({ width: (w + 12) + "px", height: (h + 6) + "px", zIndex: this.shadow.css("z-index") || this.options.tar.css("z-index") - 1, top: (pos.top) + "px", left: (pos.left - 5) + "px" });
            this.shadow.children(":eq(1)").children().css({ height: (h - 6) + "px" });
            this.shadow.children().children(":nth-child(2)").css({ width: w + "px" });
        },
        /*
        ** 默认参数
        ** tar：要使用阴影的控件，必须
        ** shadowTpl：阴影模板
        */
        defaultOptions: {
            tar: null,
            shadowTpl: '<div class="shadow"><div class="st"><div class="stl"></div><div class="stc"></div><div class="str"></div></div><div class="sc"><div class="sml"></div><div class="smc"></div><div class="smr"></div></div><div class="sb"><div class="sbl"></div><div class="sbc"></div><div class="sbr"></div></div></div>'
        },
        /*
        ** 设置实例参数
        ** opts:要设置的参数
        */
        setOptions: function (opts) {
            this.options = $.extend(true, this.options, opts);
            return this;
        },
        /*
        ** 加载到DOM树中
        ** tar:父元素
        */
        appendTo: function (tar) {
            this.shadow.appendTo(tar);
            //this.shadow.pngFix();
            var ie55 = (navigator.appName == "Microsoft Internet Explorer" && parseInt(navigator.appVersion) == 4 && navigator.appVersion.indexOf("MSIE 5.5") != -1);
            var ie6 = (navigator.appName == "Microsoft Internet Explorer" && parseInt(navigator.appVersion) == 4 && navigator.appVersion.indexOf("MSIE 6.0") != -1);
            if (ie55 || ie6) {
                //ie6以下只能这样HACK了。。。
                this.shadow.get(0).style.filter = "progid:DXImageTransform.Microsoft.alpha(opacity=50) progid:DXImageTransform.Microsoft.Blur(pixelradius=4)";
            }
            return this;
        },
        /*
        ** 显示阴影
        */
        show: function () {
            this.shadow.show();
            return this;

        },
        /*
        ** 隐藏阴影
        */
        hide: function () {
            this.shadow.hide();
            return this;
        },
        /*
        ** 获取阴影实体的样式
        */
        css: function (name, extra) {
            return this.shadow.css(name, extra);
        }
    });

    /*
    ** Author:Hutop_chen
    ** CreateDate:2011-7-12
    ** Version:1.0
    ** Description:CRM1.1专用下拉列表
    */
    $.MTHCrmComboBox = function (opts) {
        this.options = $.extend(true, {}, this.defaultOptions, opts);
        this.mainBody = null;           //下拉列表主容器
        this.items = [];                //下拉列表项数组
        this.pagingBar = null;          //分页栏
        this.itemsShell = null;         //列表项容器
        this.shadow = null;             //阴影
        this.loadingImg = null;         //等待图片
        this.focalItem = null;          //当前高亮的列表项
        this.isShown = false;           //指示是否已经显示
        this.totalCount = 0;            //总条数
        this.pageCount = 0;             //总页数
        this.currentRecord = null;      //当前请求返回的数据
        //this.init();
        return this;
    };
    $.MTHCrmComboBox.modiDefaultOptions = function (opts) {
        $.extend(true, $.MTHCrmComboBox.prototype.defaultOptions, opts);
    };
    $.extend(true, $.MTHCrmComboBox.prototype, {
        /*
        ** comboBoxTpl:下拉列表模板
        ** itemsShellTpl:列表项容器模板
        ** itemTpl:列表项模板
        ** pagaing:是否使用分页
        ** shadowing:是否使用阴影
        ** pageSize:每页显示的信息数
        ** pageIndexField:列表数据源中指示页码的字段名称
        ** pageCountField:列表数据源中指示总页数的字段名称
        ** totalCountField:列表数据源中指示信息总条数的字段名称
        ** textField:显示字段
        ** valueField:值字段
        ** fields:数据源中要使用的字段名称
        ** dataSource:数据源
        ** dataRoot:数据源中主数据的字段名称
        ** width:控件宽度
        ** maxHeight:控件最大高度
        ** minHeight:控件最小高度
        ** ctrlID:要使用下拉框的页面控件ID
        ** loadingSrc:等待图片Src
        ** itemCallback:列表项的交互函数
        ** emptyText:无选择时显示的文本
        ** loadingText:数据源加载时显示等待的提示文字
        ** pagingCallback:分页控件的交互函数
        ** selected:选择列表项的回调函数
        ** requestDelay:请求的延迟时间(毫秒)
        ** callback:下拉框自身的交互事件
        ** keyboardNavi:是否需要键盘导航
        ** synData:是否同步显示
        ** needCombine:是否需要在客户端组织数据
        */
        defaultOptions: {
            mainBodyTpl: '<div class="combox-cnt"></div>',
            header: '',
            itemsShellTpl: '<div style="overflow-x:hidden;overflow-y:scroll;position:relative;"></div>',
            itemTpl: '',
            itemIns: true,
            itemOutCls: 'combox-item-normal',
            itemOverCls: 'combox-item-selected',
            itemSelectedCls: 'combox-item-selected',
            paging: true,
            pagingBarDelay: false,
            shadowing: true,
            pageSize: 10,
            pageIndexField: '',
            pageCountField: '',
            totalCountField: '',
            textField: '',
            valueField: '',
            fields: ["address", "type"],
            btnsSrc_disabled: null,
            btnsSrc: null,
            dataSource: {},
            dataRoot: 'root',
            width: 300,
            complete: $.noop,
            maxHeight: 0,
            minHeight: 0,
            maxWidth: 0,
            minWidth: 0,
            allowScroll: false,
            ctrlID: "",
            itemCallback: {},
            emptyText: '请输入楼盘中文名或拼音字母....',
            emptyColor: 'gray',
            loadingText: '请稍候...',
            loadingSrc: '../Include/Scripts/MTHCRMWidget/MTHCRMWidgetRes/Images/loading.gif',
            needLoading: true,
            pagingCallback: {},
            pagingBtnsSrc: {},
            pagingBtnsSrc_disabled: {},
            selected: function (itemData) { },
            requestDelay: 500,
            minChar: 1,
            callback: null,
            keyboardNavi: false,
            synData: true,
            needCombine: true
        },
        className: '[object MTHCRMComboBox]',
        init: function () {
            var self = this, timeoutID, ready = false, ctrler = $("#" + this.options.ctrlID);
            ctrler.css({ border: "1px solid" });
            ctrler.attr("isEmpty", "true");
            ctrler.emptyTips(self.options.emptyText, self.options.emptyColor).keyup(function (event) {
                var keyCode = event.keyCode;
                if (keyCode >= 37 && keyCode <= 40) {
                    return;
                }
                if (keyCode == 13) {
                    self.trigger('enterPress', null, self);
                    ctrler.trigger('doSubmit');
                    event.stopPropagation();
                    return;
                }
                if (!!timeoutID) {
                    clearTimeout(timeoutID);
                }
                var query = $(this).val();
                if (query.length < self.options.minChar) {
                    return;
                }
                if (query !== self.options.emptyText && query !== '') {
                    self.query = query;
                }
                timeoutID = setTimeout(function () {
                    self.getData();
                }, self.options.requestDelay);
            }).attr("autocomplete", "off");
            ctrler.blur();
            this.mainBody = $(this.options.mainBodyTpl);
            this.adjustPos();

            this.mainBody.keyup(function (event) {
                //阻止回车事件冒泡
                if (event.keyCode == 13) {
                    if (!!self.focalItem) {
                        if (self.options.itemIns) {
                            ctrler.val(self.focalItem.item.data("itemData")[self.options.textField]);
                        } else {
                            ctrler.val(self.focalItem.data("itemData")[self.options.textField]);
                        }
                    }
                    self.trigger("enterPress", null, self);
                    event.stopPropagation();
                    return false;
                }
            }).mouseover(function () {
                //self.mainBody.focus();
            }).click(function (event) {
                //event.stopPropagation();
            }).bind(this.options.callback);

            if (this.options.keyboardNavi) {
                this.keyboardNavi();
            }
            return this;
        },
        /*
        ** 设置下拉列表实例参数
        ** opts:要设置的参数
        */
        setOptions: function (opts) {
            this.options = $.extend(true, this.options, opts);
        },
        /*
        ** 获取数据源中的数据
        ** index:可选，当前条件下的页码
        ** act:可选，获取数据的动作(刷新(refresh))
        */
        getData: function (index, act) {
            if (this.options.paging && !this.options.pagingBarDelay) {
                if (!!this.pagingBar) {
                    this.pagingBar.disable();
                }
            }

            if (this.options.ctrlID !== "") {
                var canSend = $("#" + this.options.ctrlID).val();
                if (canSend == this.options.emptyText || canSend == "") {
                    return;
                }
            }
            this.show();
            var self = this;

            var queryData = { query: this.query, start: 0, limit: this.options.pageSize };
            if (!!index) {
                index -= 1;
                queryData.start = index * 10;
            } else if (index === null && act === 'refresh' && this.options.paging) {
                queryData.start = (this.pagingBar.pageIndex - 1) * 10;
                index = this.pagingBar.pageIndex - 1;
            }
            if (this.options.needLoading) {
                try {
                    this.itemsShell.children().dropToDustbin();
                } catch (e) { }
                this.loading();
            }

            setTimeout(function () {
                self.trigger("startGetData");
            }, 50);

            this.options.dataSource.request(queryData, function (record) {
                self.currentRecord = record;
                if (self.options.synData || self.isShown) {
                    self.showData.call(self, index);
                }
                if (!!self.options.complete) {
                    self.options.complete.call(self);
                }
                self.trigger("complete", null, [record]);
                if (act !== 'refresh') {
                    self.trigger("pageChange");
                }
            }, act);

            if (this.options.synData || this.isShown) {
                this.resize();
            }
            if (this.options.shadowing) {
                this.shadow.resize();
            }
            return this;
        },
        showData: function (index) {
            var totalCount = this.options.dataSource.remoteData[this.options.totalCountField],
                pageCount = Math.ceil(totalCount / this.options.pageSize);
            if (this.options.needLoading) {
                this.loadingImg.remove();
            }
            this.initItems(index);

            this.totalCount = totalCount;
            this.pageCount = pageCount;
            if (this.options.paging && !this.options.pagingBarDelay) {
                this.pagingBar.setQuickPagingValue(pageCount, !index || typeof index !== "number" ? 1 : (index + 1), totalCount, this.options.pageSize);
            }
            this.resize();
            if (this.options.shadowing) {
                this.shadow.resize();
            }
            this.isShown = true;
            return this;
        },
        /*
        ** 加载到DOM树中
        ** tar:父容器
        */
        appendTo: function (tar) {
            this.renderComponent();
            this.mainBody.appendTo(tar);
            //this.getData();
            this.hide();

            return this;
        },
        /*
        ** 返回需要加载到DOM树中的HTML
        */
        html: function () {

        },
        /*
        ** 重绘下拉框
        */
        resize: function () {
            this.mainBody.height("auto");
            this.itemsShell.height("auto");
            var tbH = 0;
            if (this.options.paging && !this.options.pagingBarDelay) {
                tbH = this.pagingBar.height();
            }
            var cbH = this.mainBody.height();
            cbH += tbH;
            if (this.options.maxHeight > 0) {
                cbH = cbH > this.options.maxHeight ? this.options.maxHeight : cbH;
            }
            if (this.options.minHeight > 0) {
                cbH = cbH < this.options.minHeight ? this.options.minHeight : cbH;
            }
            if (this.options.allowScroll) {
                this.itemsShell.height(cbH - tbH - 3);
            } else {
                this.itemsShell.height(cbH - tbH);
                this.itemsShell.css({ overflowY: "hidden" });
            }
            this.mainBody.height(cbH);
        },
        adjustPos: function () {
            var ctrler = $("#" + this.options.ctrlID), pos = ctrler.offset(), adjustW = parseInt(ctrler.css("border-left-width")) + parseInt(ctrler.css("border-right-width")),
                adjustH = parseInt(ctrler.css("border-top-width")) + parseInt(ctrler.css("border-bottom-width")),
                zIndex = ctrler.css("z-index"), parentZindex = ctrler;
            while ((zIndex === 'auto' || zIndex === 0) && !parentZindex.is($("body"))) {
                parentZindex = parentZindex.parent();
                zIndex = parentZindex.css("z-index");
            }
            this.options.width = ctrler.width() + (adjustW == NaN ? 0 : adjustW);
            if (this.options.maxWidth > 0) {
                this.options.width = this.options.width > this.options.maxWidth ? this.options.maxWidth : this.options.width;
            }
            if (this.options.minWidth > 0) {
                this.options.width = this.options.width < this.options.minWidth ? this.options.minWidth : this.options.width;
            }
            this.mainBody.css({ top: (pos.top + ctrler.height() + (adjustH == NaN ? 0 : adjustH)) + "px", left: pos.left + "px", width: this.options.width + "px", zIndex: zIndex + 1 });
            if (this.shadowing) {
                this.shadow.css({ zIndex: zIndex });
            }
        },
        trigger: function (evt, handler, params) {
            var paramArr;
            if (!handler) {
                paramArr = [this];
                if (!!params) {
                    $.merge(paramArr, params);
                }
                this.mainBody.trigger(evt, paramArr);
            } else {
                this.mainBody.bind(evt, handler);
            }
            return this;
        },
        inputTrigger: function (evt, handler, params) {
            var paramArr;
            if (!handler) {
                paramArr = [this];
                if (!!params) {
                    $.merge(paramArr, params);
                }
                $("#" + this.options.ctrlID).trigger(evt, paramArr);
            } else {
                $("#" + this.options.ctrlID).bind(evt, handler);
            }
            return this;
        },
        delegate: function (selector, evt, handler, params) {
            this.mainBody.delegate(selector, evt, handler);
            return this;
        },
        undelegate: function (selector, evt) {
            this.mainBody.undelegate(selector, evt);
            return this;
        },
        /*
        ** 加载控件（阴影，分页栏等）
        */
        renderComponent: function () {
            var self = this;
            this.itemsShell = $(this.options.itemsShellTpl);
            this.itemsShell.appendTo(this.mainBody);

            if (this.options.paging && !this.options.pagingBarDelay) {
                this.initPagingBar();
            }

            //ie6中，div不能覆盖select，
            if ($.isIE6) {
                this.mainBody.append("<iframe src='Utils/blank.htm' style='position:absolute;top:-3px;left:-3px;z-index:-1;width:110%;height:110%;opacity:0;filter:alpha(opacity=0);color:#fff;backkground:transparent' scrolling='no' allowTransparent='true' frameBorder='0'></iframe>");
            }
            if (this.options.shadowing) {
                this.shadow = new $.MTHCrmShadow({ tar: this.mainBody });
                this.shadow.appendTo($("body"));
            }

            this.hide();
        },
        /*
        ** 初始化分页栏
        */
        initPagingBar: function () {
            var self = this;
            this.pagingBar = new $.MTHCrmPagingBar({
                callback: this.options.pagingCallback,
                sendPagingReq: function (index, act) {
                    self.getData(index, act);
                },
                btnsSrc_disabled: this.options.pagingBtnsSrc_disabled,
                btnsSrc: this.options.pagingBtnsSrc
            });
            this.pagingBar.appendTo(this.mainBody).click(function (e) {
                self.trigger("pagingBarClick");
                e.stopPropagation();
            }).keyup(function (e) {
                self.trigger("pagingBarEnterPress");
                e.stopPropagation();
            });
            this.options.pagingBarDelay = false;
            var totalCount = this.options.dataSource.remoteData[this.options.totalCountField];
            var pageCount = Math.ceil(totalCount / this.options.pageSize);
            this.pagingBar.setQuickPagingValue(pageCount, 1, totalCount, this.options.pageSize);
        },
        /*
        ** 请求发送时显示的等待信息
        */
        loading: function () {
            this.disposeItems();
            if (this.loadingImg == null) {
                this.loadingImg = $("<img />");
                if (parseFloat($.fn.jquery.slice(0, 3)) < 1.6) {
                    this.loadingImg.attr({ src: this.options.loadingSrc, alt: this.options.loadingText, title: this.options.loadingText });
                } else {
                    this.loadingImg.prop({ src: this.options.loadingSrc, alt: this.options.loadingText, title: this.options.loadingText });
                }
            }
            this.loadingImg.appendTo(this.itemsShell);
        },
        /*
        ** 设置当前的焦点项
        ** item:要设置的项
        */
        setFocalItem: function (item) {
            this.focalItem = item;
        },
        /*
        ** 初始化列表项
        */
        initItems: function () {
            var self = this;
            this.items = [];
            var tmpItem;
            if (this.options.dataSource.remoteData.success === undefined) {
                return;
            }
            if (!this.options.dataSource.remoteData.success) {
                tmpItem = new $.MTHCrmComboBox.Item({
                    fields: this.options.fields,
                    callback: this.options.itemCallback,
                    itemData: "error",
                    displayTpl: "<div>" + this.options.dataSource.remoteData.errorText + "</div>",
                    selected: $.noop
                });
                this.itemsShell.children().dropToDustbin();
                tmpItem.appendTo(this.itemsShell);
                this.items.push(tmpItem);
                return;
            }
            if (!!this.options.dataSource.remoteData[this.options.dataRoot] && !!this.options.dataSource.remoteData[this.options.dataRoot][0].empty) {
                tmpItem = new $.MTHCrmComboBox.Item({
                    fields: this.options.fields,
                    callback: this.options.itemCallback,
                    itemData: "empty",
                    displayTpl: "<div>" + this.options.dataSource.remoteData[this.options.dataRoot][0].empty + "</div>",
                    selected: $.noop
                });
                this.itemsShell.children().dropToDustbin();
                tmpItem.appendTo(this.itemsShell);
                this.items.push(tmpItem);
                return;
            }
            if (this.options.itemIns) {
                this.itemInstance();
            } else {
                this.itemText();
            }
            if (this.options.header.length > 0) {
                this.itemsShell.prepend(this.options.header);
            }
        },
        /*
        ** 列表项实例，每项实例化一个，可操作性较高，但效率较低
        */
        itemInstance: function () {
            var loopTimes = this.options.dataSource.remoteData[this.options.dataRoot].length - 1;
            var self = this;
            for (var i = 0; i <= loopTimes; i++) {
                tmpItem = new $.MTHCrmComboBox.Item({
                    fields: this.options.fields,
                    callback: this.options.itemCallback,
                    itemData: this.options.dataSource.remoteData[this.options.dataRoot][i],
                    outCls: this.options.itemOutCls,
                    overCls: this.options.itemOverCls,
                    selectedCls: this.options.selectedCls,
                    displayTpl: this.options.itemTpl,
                    textField: this.options.textField,
                    valueField: this.options.valueField,
                    ctrlID: this.options.ctrlID,
                    selected: this.options.selected,
                    itemFocus: function (item) {
                        self.focalItem = item;
                    }
                }, i);
                tmpItem.appendTo(this.itemsShell);          //占用了  23%  的执行时间
                this.items.push(tmpItem);
            }
        },
        /*
        ** 列表项HTML文本，效率更高，但是可操作性低
        */
        itemText: function () {
            var self = this, itemsHtml = new StringBuilder();
            if (this.options.needCombine) {
                var loopTimes = this.options.dataSource.remoteData[this.options.dataRoot].length - 1, i = 0, regFields = [];
                for (i = this.options.fields.length - 1; i >= 0; i--) {
                    regFields[i] = new RegExp("\{" + this.options.fields[i] + "\}", "g");
                }
                var tmpHtml = '';
                var remoteData;
                for (i = 0; i <= loopTimes; i++) {
                    tmpHtml = this.options.itemTpl;
                    remoteData = this.options.dataSource.remoteData[this.options.dataRoot][i];
                    for (var j = regFields.length - 1; j >= 0; j--) {
                        tmpHtml = tmpHtml.replace(regFields[j], function (patt) {
                            return remoteData[patt.replace(/\{/g, '').replace(/\}/g, '')].replace(/\(/g, '（').replace(/\)/g, '）');
                        });
                    }
                    tmpHtml = tmpHtml.replace(this.expr_if, function (patt, $1, $2, $3, $4) {
                        if ($1 == $2) {
                            return $3;
                        }
                        else {
                            return $4;
                        }
                    }).replace(this.expr_odd_even, function (patt, $1, $2, $3) {
                        if ($1 == "odd" && (i + 1) % 2 != 0) {
                            return $3;
                        }
                        if ($2 == "even" && (i + 1) % 2 == 0) {
                            return $3;
                        }
                        return "";
                    }).replace(this.expr_index, function (patt) {
                        return i + 1;
                    }).replace(this.expr_switch, function (patt, $1, $2, $3) {
                        var rlt = $2.replace(self.expr_case, function (patt2, $4, $5) {
                            if ($1 === $4) {
                                return $5;
                            }
                            return '';
                        });
                        if (rlt === '' && !!$3) {
                            rlt = $3;
                        }
                        return rlt;
                    }).replace(/\（/g, '(').replace(/\）/g, ')');
                    itemsHtml.append(tmpHtml);
                }
            } else {
                itemsHtml.append(this.options.dataSource.remoteData[this.options.dataRoot][0]);
            }
            this.itemsShell.html(itemsHtml.toString());
            setTimeout(function () {
                self.bindEvents();
            }, 50);
            //this.bindEvents();
            this.focalItem = null;
        },
        bindEvents: function () {
            var items, itemTagName, oriCssText, self, itemCallback;
            this.itemsShell.undelegate();
            items = this.itemsShell.children();
            itemTagName = items.get(0).tagName;
            oriCssText = items.get(0).style.cssText;
            self = this;
            for (i = items.length - 1; i >= 0; i--) {
                try {
                    $(items[i]).data("itemData", this.options.dataSource.remoteData[this.options.dataRoot][i]);
                    if ((typeof this.options.itemOverCls).toLowerCase() === 'object') {
                        $.extend(items[i].style, this.options.itemOutCls);                 //通过直接设置css属性比设置class效率会更高
                    } else {
                        $(items[i]).addClass(self.options.itemOutCls);
                    }
                } catch (ex) {
                    $.errLog.push(ex.message);
                    continue;
                }
            }
            this.items = items;
            this.itemsShell.delegate(itemTagName, "mouseenter", function () {
                var elem = $(this), cssList, cssKeyValue, i, l;
                if (self.itemsShell.is(elem.parent())) {
                    if ((typeof self.options.itemOverCls).toLowerCase() === 'object') {
                        $.extend(this.style, self.options.itemOverCls);                 //通过直接设置css属性比设置class效率会更高
                    } else {
                        elem.removeClass(self.options.itemOutCls).addClass(self.options.itemOverCls);
                    }
                    self.focalItem = elem;
                }
            }).delegate(itemTagName, "mouseleave", function () {
                var elem = $(this), cssList, cssKeyValue, i, l;
                if (self.itemsShell.is(elem.parent())) {
                    if ((typeof self.options.itemOutCls).toLowerCase() === 'object') {
                        $.extend(this.style, self.options.itemOutCls);
                    } else if (self.options.itemOutCls === '') {
                        this.style.cssText = oriCssText;
                    } else {
                        elem.removeClass(self.options.itemOverCls).addClass(self.options.itemOutCls);
                    }
                }
            }).delegate(itemTagName, "click", function () {
                var elem = $(this);
                if (self.itemsShell.is(elem.parent())) {
                    if (self.options.ctrlID !== "") {
                        $("#" + self.options.ctrlID).val(elem.data("itemData")[self.options.textField]);
                    }
                    self.trigger("selectChange", null, [elem.data("itemData")]);
                    self.options.selected.call(self, elem.data("itemData"));
                }
            });
            itemCallback = this.options.itemCallback;
            for (i in itemCallback) {
                if (itemCallback.hasOwnProperty(i)) {
                    this.itemsShell.delegate(itemTagName, i, itemCallback[i]);
                }
            }
        },
        removeEvents: function () {

        },
        //判断表达式
        expr_if: /\[if\(([^\)]*)\)=\(([^\)]*)\)\(([^\)]*)\)\:\(([^\)]*)\)\]/g,
        //奇偶表达式
        expr_odd_even: /(?:\[(odd)|\[(even))\:\(([^\)]*)\)\]/g,
        //索引标记
        expr_index: /\[index\]/g,
        //分支表达式
        expr_switch: /\[switch\(([^\)]*)\)((?:case\([^\)*]\)\([^\)]*\))+)(?:default\(([^\)]*)\))?\]/g,
        expr_case: /case\(([^\)*])\)\(([^\)]*)\)/g,
        keyboardNavi: function () {
            var self = this;
            $("#" + self.options.ctrlID).keydown(function (event) {
                var pos, h1, h2, st, oriCssText, keyCode = event.keyCode, lastItem;
                if (self.mainBody.is(":visible")) {
                    oriCssText = self.itemsShell.children()[0].style.cssText;
                    lastItem = self.focalItem;
                    if (keyCode == 38) {
                        if (!!self.focalItem.prev().data("itemData")) {
                            self.focalItem = self.focalItem.prev();
                            if ((typeof self.options.itemOutCls).toLowerCase() === 'object') {
                                $.extend(self.focalItem[0].style, self.options.itemOverCls);
                            } else {
                                self.focalItem.removeClass(self.options.itemOutCls).addClass(self.options.itemOverCls);
                            }
                            if (!!lastItem) {
                                if ((typeof self.options.itemOutCls).toLowerCase() === 'object') {
                                    $.extend(lastItem[0].style, self.options.itemOutCls);
                                } else if (self.options.itemOutCls === '') {
                                    lastItem[0].style.cssText = oriCssText;
                                } else {
                                    lastItem.removeClass(self.options.itemOverCls).addClass(self.options.itemOutCls);
                                }
                            }
                            pos = self.focalItem.position();
                            h1 = self.focalItem.outerHeight(true);
                            st = self.itemsShell.scrollTop();
                            if (pos.top < 0) {
                                self.itemsShell.scrollTop(st - h1);
                            }
                            $(this).val(self.focalItem.data("itemData")[self.options.textField]);
                        }
                    } else if (keyCode == 40) {
                        if (!!self.focalItem) {
                            if (!!self.focalItem.next().data("itemData")) {
                                self.focalItem = self.focalItem.next();
                                if ((typeof self.options.itemOutCls).toLowerCase() === 'object') {
                                    $.extend(self.focalItem[0].style, self.options.itemOverCls);
                                } else {
                                    self.focalItem.removeClass(self.options.itemOutCls).addClass(self.options.itemOverCls);
                                }
                                if (!!lastItem) {
                                    if ((typeof self.options.itemOutCls).toLowerCase() === 'object') {
                                        $.extend(lastItem[0].style, self.options.itemOutCls);
                                    } else if (self.options.itemOutCls === '') {
                                        lastItem[0].style.cssText = oriCssText;
                                    } else {
                                        lastItem.removeClass(self.options.itemOverCls).addClass(self.options.itemOutCls);
                                    }
                                }
                                pos = self.focalItem.position();
                                h1 = self.focalItem.outerHeight(true);
                                st = self.itemsShell.scrollTop();
                                h2 = self.itemsShell.outerHeight();
                                if (pos.top > (h2 - h1)) {
                                    self.itemsShell.scrollTop(st + h1);
                                }
                                $(this).val(self.focalItem.data("itemData")[self.options.textField]);
                            }
                        } else {
                            self.focalItem = $(self.items[0]);
                            if ((typeof self.options.itemOutCls).toLowerCase() === 'object') {
                                $.extend(self.focalItem[0].style, self.options.itemOverCls);
                            } else {
                                self.focalItem.removeClass(self.options.itemOutCls).addClass(self.options.itemOverCls);
                            }
                            if (!!lastItem) {
                                if ((typeof self.options.itemOutCls).toLowerCase() === 'object') {
                                    $.extend(lastItem[0].style, self.options.itemOutCls);
                                } else if (self.options.itemOutCls === '') {
                                    lastItem[0].style.cssText = oriCssText;
                                } else {
                                    lastItem.removeClass(self.options.itemOverCls).addClass(self.options.itemOutCls);
                                }
                            }
                            pos = self.focalItem.position();
                            h1 = self.focalItem.outerHeight(true);
                            st = self.itemsShell.scrollTop();
                            h2 = self.itemsShell.outerHeight();
                            if (pos.top > (h2 - h1)) {
                                self.itemsShell.scrollTop(st + h1);
                            }
                            $(this).val(self.focalItem.data("itemData")[self.options.textField]);
                        }
                    }
                }
            });
        },
        /*
        ** 删除列表项
        */
        disposeItems: function () {
            if (this.options.itemIns) {
                for (var i = this.items.length - 1; i >= 0; i--) {
                    this.items[i].dispose();
                }
            } else {
                if (this.items.length > 0) {
                    $(this.items).dropToDustbin();
                    this.itemsShell.undelegate(); //this.itemsShell.undelegate().empty();
                }
            }
            this.items = [];
        },
        /*
        ** 设置数据源
        ** source:要设置的数据源
        */
        setDataSource: function (source) {
            this.options.dataSource = source;
            this.dataChage();
        },
        /*
        ** 显示下拉框
        */
        show: function () {
            if (this.mainBody.attr("hideOrShow") !== "show") {
                if (this.options.ctrlID != "") {
                    this.adjustPos();
                }
                this.mainBody.show().attr("hideOrShow", "show");
                if (this.options.shadowing) {
                    this.shadow.show();
                }
                this.trigger("show");
            }
            return this;
        },
        /*
        ** 隐藏下拉框
        */
        hide: function () {
            if (this.mainBody.attr("hideOrShow") !== "hide") {
                this.mainBody.hide().attr("hideOrShow", "hide");
                if (this.options.shadowing) {
                    this.shadow.hide();
                }
                this.trigger("hide");
            }
            //失去焦点的时候隐藏
            var self = this;
            function bchf() {
                self.hide();
            }
            $("body").one("click", bchf);
            return this;
        },
        /*
        ** 获取下拉框实体的样式
        */
        css: function (name, extra) {
            if (!!extra) {
                return this.mainBody.css(name, extra);
            } else {
                return this.mainBody.css(name);
            }
        },
        toString: function () {
            return "[Object MTHCrmComboBox]";
        },
        dispose: function () {
            //this.mainBody.find('*').dropToDustbin(); //this.mainBody.unbind().empty();
            var prop;
            this.mainBody.dropToDustbin();
            this.disposeItems();
            if (!!this.options.ctrlID) {
                $("#" + this.options.ctrlID).unbind();
            }
            this.trigger("dispose");
            for (prop in this) {
                if (this.hasOwnProperty(prop)) {
                    if (!!this[prop] && !!this[prop].dispose) {
                        this[prop].dispose();
                    }
                    this[prop] = null;
                    delete this[prop];
                }
            }
        },
        //清除已请求的数据
        clear: function () {
            this.options.dataSource.clearData();
            return this;
        }
    });


    /*
    ** Author:Hutop_chen
    ** CreateDate:2011-7-13
    ** Version:1.0
    ** Description:CRM1.1专用下拉列表项
    */
    $.MTHCrmComboBox.Item = function (opts, index) {
        this.options = $.extend(true, {}, this.defaultOptions, opts);
        this.item = null;           //列表项实体
        this.itemIndex = !!index ? index : 0;         //列表项索引，0开始
        this.initItem();
        return this;
    };
    $.extend(true, $.MTHCrmComboBox.Item.prototype, {
        /*
        ** 默认参数
        ** fields:数据源中要使用到的字段名称
        ** textField:文本字段
        ** valueField:值字段
        ** outCls:鼠标移出时的样式类
        ** overCls:鼠标移入时的样式类
        ** selectedCls:被选择时的样式
        ** itemData:列表项数据源
        ** callback:UI交互函数
        ** displayTpl:列表项模板
        ** ctrlID:要使用下拉框的页面控件ID
        ** itemFocus:获取焦点时的回调函数
        */
        defaultOptions: {
            fields: [],
            textField: '',
            valueField: '',
            outCls: 'combox-item-normal',
            overCls: 'combox-item-selected',
            selectedCls: 'combox-item-selected',
            itemData: {},
            callback: {},
            displayTpl: '',
            ctrlID: '',
            itemFocus: function (item) { }
        },
        //判断表达式
        expr_if: /\[if\(([^\)]*)\)=\(([^\)]*)\)\(([^\)]*)\)\:\(([^\)]*)\)\]/g,
        //奇偶表达式
        expr_odd_even: /(?:\[(odd)|\[(even))\:\(([^\)]*)\)\]/g,
        //索引标记
        expr_index: /\[index\]/g,
        initItem: function () {
            var self = this;
            var regFields = [];
            for (var i = this.options.fields.length - 1; i >= 0; i--) {
                regFields[i] = new RegExp("\{" + this.options.fields[i] + "\}", "g");
            }
            //regFields = new RegExp(regFields.substring(0, regFields.length - 1), "gm");
            //var start = new Date().getTime();
            var tarTpl = this.options.displayTpl;
            //正则匹配占用了  20%  执行时间
            var itemData = this.options.itemData;
            for (var j = regFields.length - 1; j >= 0; j--) {
                tarTpl = tarTpl.replace(regFields[j], function (patt) {
                    return itemData[patt.replace(/\{/g, '').replace(/\}/g, '')];
                });
            }
            tarTpl = tarTpl.replace(this.expr_if, function (patt, $1, $2, $3, $4) {
                if ($1 == $2) {
                    return $3;
                }
                else {
                    return $4;
                }
            }).replace(this.expr_odd_even, function (patt, $1, $2, $3) {
                if ($1 == "odd" && self.itemIndex % 2 != 0) {
                    return $3;
                }
                if ($2 == "even" && self.itemIndex % 2 == 0) {
                    return $3;
                }
                return "";
            }).replace(this.expr_index, function (patt) {
                return self.itemIndex + 1;
            });

            //var end = new Date().getTime() - start;
            this.item = $(tarTpl);
            this.item.addClass(this.options.outCls);
            this.item.hover(function () {
                $(this).removeClass(self.options.outCls).addClass(self.options.overCls);
                self.options.itemFocus(self);
            }, function () {
                $(this).removeClass(self.options.overCls).addClass(self.options.outCls);
            });

            this.item.click(function () {
                if (self.options.ctrlID !== "") {
                    $("#" + self.options.ctrlID).val(self.options.itemData[self.options.textField]);
                }
                self.options.selected.call(self, self.options.itemData);
            });

            this.item.bind(this.options.callback);

            this.item.data("itemData", itemData);
        },
        /*
        ** 设置列表项的实例参数
        ** opts:要设置的参数
        */
        setOptions: function (opts) {
            $.extend(true, this.options, opts);
            return this;
        },
        /*
        ** 删除列表项实例
        */
        dispose: function () {
            var prop;
            if (!this.item) {
                return;
            }
            //this.item.find('*').dropTopDustbin();
            this.item.dropToDusbin();               //this.item.removeData("itemData").unbind().empty().remove();
            for (prop in this) {
                if (this.hasOwnProperty(prop)) {
                    if (!!this[prop] && !!this[prop].dispose) {
                        this[prop].dispose();
                    }
                    this[prop] = null;
                    delete this[prop];
                }
            }
        },
        /*
        ** 加入到DOM树中
        ** tar:父容器
        */
        appendTo: function (tar) {
            this.item.appendTo(tar);
            return this;
        },
        /*
        ** 获取或设置列表项实体样式
        */
        css: function (name, extra) {
            return $.css(this.item, name, extra);
        }
    });

    /*
    ** Author:Hutop_chen
    ** CreateDate:2011-7-15
    ** Version:1.0
    ** Description:CRM1.1专用异步数据源
    */
    $.MTHCrmRemoteData = function (opts) {
        this.options = $.extend(true, {}, this.defaultOptions, opts);
        this.remoteDataSet = {};            //数据源数据集
        this.remoteData = [];               //当前使用的数据项
        this.currentIndex = 0;              //
        this.requestSuccess = false;        //是否请求成功
        this.currentReq = null;            //当前正在进行的请求对象(XMLHttpRequest)
        this.initRemoteData();
        return this;
    };
    $.extend(true, $.MTHCrmRemoteData.prototype, {
        initRemoteData: function () { },
        /*
        ** 默认参数
        ** url:数据源URL
        ** reqData:请求参数
        ** root:数据项中根字段名称
        ** success:请求数据回发成功时的回调函数
        ** error:请求错误时的回调函数
        ** beforSend:请求发送前的回调函数，可在此返回false阻止请求的提交
        ** type:请求类型
        ** dataType:回发数据的类型
        ** cache:是否使用缓存
        ** fields:数据源中的数据字段名称
        */
        defaultOptions: {
            url: '',
            reqData: {},
            root: 'root',
            success: function (record) { },
            error: $.noop,
            beforeSend: $.noop,
            type: "post",
            dataType: "json",
            cache: true,
            contentType: 'application/x-www-form-urlencoded',
            processData: true,
            reqDataType: 'json',
            keyWord: [],
            fields: []
        },
        /*
        ** 获取由当前请求条件组成的数据集的属性名
        ** 例如：
        ** 当前请求条件：{query:'jj',start:0,limit:10,PageSize:10}
        ** 则返回的是queryjjstart0limit10PageSize10
        ** 在数据集中的表现形式为{queryjjstart0limit10PageSize10:someObj}
        */
        getProTag: function () {
            var tag = "", tagName, i, reqData, keyword;
            reqData = this.options.reqData;
            keyword = this.options.keyWord;
            if (!!keyword && keyword.length === 0) {
                for (tagName in reqData) {
                    if (reqData.hasOwnProperty(tagName)) {
                        if (tagName === 'dummy') {
                            continue;
                        }
                        tag += tagName + reqData[tagName];
                    }
                }
            } else {
                for (i = keyword.length - 1; i >= 0; i--) {
                    if (keyword[i] === 'dummy') {
                        continue;
                    }
                    tag += keyword[i] + reqData[keyword[i]];
                }
            }
            return tag;
        },
        /*
        ** 设置请求参数
        */
        setRequestParam: function (data, type) {
            $.extend(true, this.options.reqData, data);
        },
        /*
        ** 
        */
        getData: function (pageIndex) {
            return this.remoteData[pageIndex - 1];
        },
        /*
        ** 发送请求
        ** data:请求参数
        ** callback:请求处理完成后调用的回发函数
        ** act:请求的动作类型('refresh'（刷新）)
        */
        request: function (data, callback, act) {
            var isSend, self, proTag;
            isSend = this.options.beforeSend.call(this);
            if (!!this.currentReq) {
                //this.currentReq.abort();
                //this.currentReq = null;
                if (this.currentReq.status !== 200) {
                    return false;
                } else {
                    this.currentReq = null;
                }
            }
            this.requestSuccess = false;
            this.setRequestParam(data);
            act = !!act ? act : '';
            proTag = this.getProTag();
            if (!!this.remoteDataSet[proTag] && act.toLowerCase() !== 'refresh') {
                this.remoteData = this.remoteDataSet[proTag];
                this.requestSuccess = true;
                callback(this.remoteData);
                return;
            }
            if (act.toLowerCase() === 'refresh') {
                this.setRequestParam({ dummy: Math.random() });
            }
            self = this;
            this.currentReq = $.ajax({
                url: this.options.url,
                type: this.options.type,
                dataType: this.options.dataType,
                contentType: this.options.contentType,
                success: function (record) {
                    setTimeout(function () {
                        if (self.options.reqDataType !== 'json') {
                            record = $.parseJSON(record.d);
                        }
                        if (record.success === false) {
                            self.options.success.call(self, record);
                            self.remoteData = record;
                            callback(record);
                            return;
                        }
                        self.remoteDataSet[proTag] = self.remoteData = record;
                        self.requestSuccess = true;
                        self.options.success.call(self, record);
                        self.currentReq = null;
                        callback(record);
                    }, 50);
                },
                error: function (a, b, c) {
                    self.options.error.call(self, a, b, c);
                    self.remoteData = { success: false, errorText: "出现错误，请重试!" };
                    self.currentReq = null;
                    callback({ success: false, errorText: "出现错误，请重试!" });
                },
                beforeSend: function () {
                    return isSend;
                },
                data: this.options.reqDataType == 'json' ? this.options.reqData : $.toJsonString(this.options.reqData),
                cache: this.options.cache,
                processData: this.options.processData
            });
        },
        dispose: function () {
            for (var prop in this) {
                if (this.hasOwnProperty(prop)) {
                    if (!!this[prop] && !!this[prop].hasOwnProperty("dispose")) {
                        this[prop].dispose();
                    }
                    this[prop] = null;
                    delete this[prop];
                }
            }
        },
        //清除已请求的数据
        clearData: function () {
            this.remoteDataSet = {};
            this.remoteData = [];
            this.currentIndex = 0;
            return this;
        }
    });

    /*  Date：2011-6-21
    **  Author:Hutop_chen
    **  Description:键盘导航
    **  Version:0.0.1
    **  Support Browser:IE 7,IE 8,Firefox,Chrome,Safari,Opera
    */
    /// <params name="expr">选择器，要加入到键盘导航的子代元素数组</params>
    /// <params name="opts">各种所需参数</params>
    /// <params name="hlCls">高亮模式CSS类名</params>
    /// <params name="callback">回调函数，完成一次导航时执行</params>
    /// <return type="jQuery">对象本身</return>
    $.MTHCRMKeyboardNavi = $.fn.MTHCRMKeyboardNavi = function (expr, opts, hlCls, callback, onstart) {
        var defaults = {};

        callback = callback == null ? $.noop : callback;
        onstart = onstart == null ? $.noop : onstart;

        return this.each(function () {
            var caches = {};

            var self = $(this);
            var list = self.find(expr);
            var settings = $.extend(true, defaults, opts);
            var hl = $("<div></div>").addClass(hlCls);
            self.prepend(hl);

            list.click(function (event) {
                onstart.call(self, $(this));
                $.MTHCRMKeyboardNavi.focus.call(this, hl, self, callback);
                $.MTHCRMKeyboardNavi.listIndex = $.inArray(this, list);
            });

            $("body").keyup(function (event) {
                $.MTHCRMKeyboardNavi.move.call(self, event, hl, list, callback, onstart);
                event.stopPropagation();
                return false;
            });
        });
    };

    $.extend(true, $.MTHCRMKeyboardNavi, {
        /// 上下左右箭头响应函数
        /// <params name="event">事件捕获对象，系统内置，但是需要通过参数方式传递进来</params>
        /// <params name="hl">高亮框对象</params>
        /// <params name="list">需要导航的元素列表</params>
        /// <return type="bool">false</return>
        move: function (event, hl, list, callback, onstart) {
            var tar, pos, doIt, zIndex;

            if (event.keyCode == 37 || event.keyCode == 38) {
                if ($.MTHCRMKeyboardNavi.listIndex > 0) {
                    tar = $(list[--$.MTHCRMKeyboardNavi.listIndex]);
                    pos = tar.position();
                    onstart.call(this, tar);
                    zIndex = tar.css("z-index");
                    zIndex = parseInt(zIndex) - 1;
                    hl.css({ zIndex: zIndex });
                    hl.animate({ top: pos.top + "px", left: pos.left + "px", height: tar.height() + "px", width: tar.width() }, "fast", function () {
                        callback.call(this, tar);
                    });
                }
            } else if (event.keyCode == 39 || event.keyCode == 40) {
                if ($.MTHCRMKeyboardNavi.listIndex < list.length - 1) {
                    tar = $(list[++$.MTHCRMKeyboardNavi.listIndex]);
                    pos = tar.position();
                    onstart.call(this, tar);
                    zIndex = tar.css("z-index");
                    zIndex = parseInt(zIndex) - 1;
                    hl.css({ zIndex: zIndex });
                    hl.animate({ top: pos.top + "px", left: pos.left + "px", height: tar.height() + "px", width: tar.width() }, "fast", function () {
                        callback.call(this, tar);
                    });
                }
            }

            return false;
        },
        /// 鼠标点击响应函数
        /// <params name="hl">高亮框对象</params>
        /// <return type="bool">false</return>
        focus: function (hl, self, callback) {
            var tar = $(this);
            var pos = tar.position();
            hl.animate({ top: pos.top + "px", left: pos.left + "px", height: (tar.height() + 15) + "px", width: tar.width() + "px" }, "fast", function () {
                callback.call(self, tar);
            });
        },
        listIndex: -1
    });

    /*
    ** Author:Hutop_chen
    ** CreateDate:2011-7-29
    ** Version:1.0
    ** Description:CRM模板
    */
    $.MTHCrmTemplate = function (fields, tpl) {
        var regFields = "";
        for (var i = fields.length - 1; i >= 0; i--) {
            regFields += "\{" + fields[i] + "\}|";
        }
        regFields = new RegExp(regFields.substring(0, regFields.length - 1), "gm");
        return tpl.replace(regFields, function (patt) {
            return self.options.itemData[patt.replace(/\{|\}/mg, '')];
        });
    };

    /*
    ** Author:Hutop_chen
    ** CreateDate:2011-8-10
    ** Version:1.0 Beta
    ** Description:CRM1.1专用GridView
    */
    $.MTHCrmGridView = function (opts) {
        //this.init();
        $.MTHCrmComboBox.call(this, opts);
        return this;
    };
    $.extend(true, $.MTHCrmGridView.prototype, $.MTHCrmComboBox.prototype, {
        init: function () {
            this.mainBody = $(this.options.mainBodyTpl);
            this.mainBody.bind(this.options.callback);
            return this;
        },
        className: '[object MTHCrmGridView]',
        toString: function () {
            return this.className;
        },
        appendTo: function (tar) {
            this.mainBody.appendTo(tar);
            this.renderComponent();
            if (this.options.synData) {
                this.getData();
            }

            return this;
        },
        hide: function () {
            return this;
        },
        resize: function () {
            this.mainBody.height("auto");
            this.itemsShell.height("auto");

            var tbH = 0;
            if (this.options.paging && !this.options.pagingBarDelay) {
                tbH = this.pagingBar.height();
            }
            var cbH = this.mainBody.height();
            if (isNaN(cbH) || isNaN(tbH)) {
                this.itemsShell.height("60px");
                return this;
            }
            cbH += tbH;
            this.itemsShell.css({ overflow: "hidden", position: "relative" });
            if (this.options.maxHeight > 0) {
                if (cbH >= this.options.maxHeight) {
                    cbH = this.options.maxHeight;
                    if (this.options.allowScroll) {
                        this.itemsShell.css({ overflowY: "scroll", overflowX: "hidden" });
                    }
                } else {
                    this.itemsShell.css({ overflowY: "hidden" });
                }
            }
            if (this.options.minHeight > 0) {
                if (cbH <= this.options.minHeight) {
                    cbH = this.options.minHeight;
                }
            }
            this.itemsShell.height(cbH - tbH);
            this.mainBody.height(cbH);
            return this;
        }
    });

    /*
    ** Author:Hutop_chen   
    ** CreateDate:2011-11-17
    ** Version:1.0 Beta
    ** Description:异步请求，可分页请求
    */
    $.MTHCRMAjax = function (opts) {
        this.options = $.extend(true, {}, this.defaultOptions, opts);
        this.currentIndex = 0;      //当前的页码
        this.pageCount = 0;         //总页数
        this.totalCount = 0;        //总条数
        this.mainBody = $(this.options.mainBodyTpl);
        this.loadingImg = null;
        this.reqParams = {};
        this.init();
    }
    $.extend(true, $.MTHCRMAjax.prototype, {
        /*
        ** url:返回数据的URL
        ** dataType:返回的数据的类型
        ** type:请求发送的类型
        ** cache:是否启用缓存
        ** dataShowType:数据的显示方式（prepend：在主容器的头部插入，append：在主容器的尾部加入，erase：替代原有数据）
        ** mainBodyTpl:主容器模板
        ** success:请求成功后调用的函数（可直接通过success事件绑定处理而不需要传递此函数）
        ** error:请求失败后调用的函数（可直接通过error事件绑定处理而不需要传递此函数）
        ** pageSize:每页数据条数
        ** dataRoot:要显示的数据的节点属性名
        ** callbacks:要绑定的数据项处理函数,结构格式为[{'selector':'selector','handlers':{'type':method,...}}...](ex:[{'selector':'div.info','handlers':{'click':function(){//to do}}}])
        ** handlerMethod:后台处理函数的函数名
        */
        defaultOptions: {
            url: '',
            dataType: 'json',
            type: 'get',
            cache: true,
            dataShowType: 'prepend',
            mainBodyTpl: '<div></div>',
            success: $.noop,
            error: $.noop,
            pageSize: 10,
            loadingText: '请稍候...',
            loadingSrc: '../Include/Scripts/MTHCRMWidget/MTHCRMWidgetRes/Images/loading.gif',
            dataRoot: 'data',
            totalField: 'totalCount',
            pageCountField: 'pageCount',
            callbacks: {},
            handlerMethod: '',
            needLoading: true
        },
        init: function () {
            var callbacks = this.options.callbacks, l = callbacks.length, i, selector, handlers, name;
            for (i = l - 1; i >= 0; i--) {
                selector = callbacks[i].selector;
                handlers = callbacks[i].handlers;
                for (name in handlers) {
                    if (handlers.hasOwnProperty(name)) {
                        this.mainBody.delegate(selector, name, handlers[name]);
                    }
                }
            }
            return this;
        },
        setReqParams: function (opts) {
            if (this.options.handlerMethod !== '') {
                this.reqParams.method = this.options.handlerMethod;
            }
            this.reqParams.start = this.currentIndex;
            this.reqParams.limit = this.options.pageSize;
            $.extend(true, this.reqParams, opts);
            return this;
        },
        getData: function (index) {
            if (index <= this.pageCount || (this.pageCount === 0 && this.currentIndex === 0)) {
                index = index > 0 ? index : 1;
                var self = this;
                if (this.options.needLoading) {
                    this.loading();
                }
                this.currentIndex = index;
                this.setReqParams();
                $.ajax({
                    url: this.options.url,
                    dataType: this.options.dataType,
                    data: this.reqParams,
                    type: this.options.type,
                    cache: this.options.cache,
                    success: function (msg) {
                        setTimeout(function () {
                            self.totalCount = msg[self.options.totalField];
                            if (self.options.needLoading) {
                                self.loadingImg.remove();
                            }
                            self.pageCount = msg[self.options.pageCountField];
                            if (self.pageCount === 0) {
                                self.currentIndex = 0;
                            }
                            switch (self.options.dataShowType) {
                                case 'prepend':
                                    self.mainBody.html(msg[self.options.dataRoot].toString() + self.mainBody.html());
                                    break;
                                case 'append':
                                    self.mainBody.html(self.mainBody.html() + msg[self.options.dataRoot].toString());
                                    break;
                                case 'erase':
                                    self.mainBody.html(msg[self.options.dataRoot].toString());
                                    break;
                            }
                            self.trigger("success");
                            self.options.success.call(self, msg);
                        }, 15);
                    },
                    error: function (a, b, c) {
                        self.trigger("error");
                        self.options.error.call(self, a, b, c);
                    },
                    complete: function () {
                        self.trigger("success");
                    }
                });
            }
            return this;
        },
        getPrevData: function () {
            return this.getData(this.currentIndex - 1);
        },
        getNextData: function () {
            return this.getData(this.currentIndex + 1);
        },
        refresh: function (index) {
            this.getData(index);
        },
        clearContent: function () {
            this.mainBody.html("");
            return this;
        },
        loading: function () {
            if (this.loadingImg == null) {
                this.loadingImg = $("<img />");
                if (parseFloat($.fn.jquery.slice(0, 3)) < 1.6) {
                    this.loadingImg.attr({ src: this.options.loadingSrc, alt: this.options.loadingText, title: this.options.loadingText });
                } else {
                    this.loadingImg.prop({ src: this.options.loadingSrc, alt: this.options.loadingText, title: this.options.loadingText });
                }
            }
            switch (this.options.dataShowType) {
                case 'prepend':
                    this.loadingImg.prependTo(this.mainBody);
                    break;
                case 'append':
                    this.loadingImg.appendTo(this.mainBody);
                    break;
                case 'erase':
                    this.mainBody.find('*').dropToDustbin();
                    this.loadingImg.appendTo(this.mainBody);
                    break;
            }
            return this;
        },
        appendTo: function (tar) {
            this.mainBody.appendTo(tar);
            return this;
        },
        css: function (name, extra) {
            if (!!extra) {
                return this.mainBody.css(name, extra);
            } else {
                return this.mainBody.css(name);
            }
        },
        trigger: function (evt, handler, params) {
            var paramArr;
            if (!handler) {
                paramArr = [this];
                if (!!params) {
                    $.merge(paramArr, params);
                }
                this.mainBody.trigger(evt, paramArr);
            } else {
                this.mainBody.bind(evt, handler);
            }
            return this;
        }
    });

    /*
    ** Author:Hutop_chen
    ** CreateDate:2011-10-26
    ** Version:1.0 Beta
    ** Description:StringBuilder
    */
    StringBuilder = function () {
        this.builder = [];
    }
    StringBuilder.prototype = {
        append: function () {
            var i, l = arguments.length;
            for (i = 0; i < l; i++) {
                this.builder.push(arguments[i]);
            }
            return this;
        },
        toString: function () {
            return this.builder.join('');
        }
    }

    /*
    ** 定义一个命名空间
    ** ns:命名空间名字
    ** p:父级命名空间(可选,默认为window)
    */
    NameSpace = function (ns, p) {
        var context = !!p ? p : window, nameList = ns.split('.'), tmpName;
        while (nameList.length > 0 && !context[tmpName = nameList.shift()]) {
            context[tmpName] = {};
            context = context[tmpName];
        }
    }
})(jQuery);
