layui.define(["laydate","laytpl","table"],function(exports) {
    "use strict";
    var moduleName = 'tableEdit',_layui = layui,laytpl = _layui.laytpl
        ,$ = _layui.$,laydate = _layui.laydate,table = _layui.table
        ,selectTpl = [ //单选下拉框模板
            '<div class="layui-tableEdit-div" style="{{d.style}}">'
                ,'<ul class="layui-tableEdit-ul">'
                    ,'{{# if(d.data){ }}'
                        ,'{{# d.data.forEach(function(item){ }}'
                            ,'{{# var $class = (item.value === d.selectedValue) || (item.name+"" === d.selectedValue) ? "layui-tableEdit-selected" : "";  }}'
                            ,'<li class="{{ $class }}" data-name="{{ item.name }}" data-value="{{ item.value }}">'
                                ,'<div class="layui-unselect layui-form-checkbox" lay-skin="primary"><span>{{ item.value }}</span></div>'
                            ,'</li>'
                        ,'{{# }); }}'
                        ,'{{# } else { }}'
                            ,'<li>无数据</li>'
                    ,'{{# } }}'
                ,'</ul>'
            , '</div>'
        ].join('')
        ,selectMoreTpl = [ //多选下拉框模板
            '<div class="layui-tableEdit-div" style="{{d.style}}">'
                ,'<div class="layui-tableEdit-tpl">'
                    ,'<ul>'
                    ,'{{# if(d.data){ }}'
                        ,'{{# d.data.forEach(function(item){ }}'
                            ,'{{# var $class = (item.value === d.selectedValue) || (item.name+"" === d.selectedValue) ? "layui-tableEdit-selected" : "";  }}'
                            ,'<li class="{{ $class }}" data-name="{{ item.name }}" data-value="{{ item.value }}">'
                                ,'<div class="layui-unselect layui-form-checkbox" lay-skin="primary"><span>{{ item.value }}</span><i class="layui-icon layui-icon-ok"></i></div>'
                            ,'</li>'
                        ,'{{# }); }}'
                    ,'{{# } else { }}'
                        ,'<li>无数据</li>'
                    ,'{{# } }}'
                    ,'</ul>'
                ,'</div>'
                ,'<div style="line-height: 36px;">'
                    ,'<div style="float: left">'
                        ,'<button type="button" event-type="select" class="layui-btn layui-btn-sm layui-btn-primary">全选</button>'
                    ,'</div>'
                    ,'<div style="text-align: right">'
                        ,'<button event-type="confirm" type="button" class="layui-btn layui-btn-sm layui-btn-primary">确定</button>'
                    ,'</div>'
                ,'</div>'
            ,'</div>'
        ].join('');
    //组件用到的css样式
    var thisCss = [];
    thisCss.push('.layui-tableEdit-div{position:absolute;background-color:#fff;font-size:14px;border:1px solid #d2d2d2;z-index:19910908445;max-height: 252px;}');
    thisCss.push('.layui-tableEdit-tpl{margin:0;max-height:216px;overflow-y:auto;}');
    thisCss.push('.layui-tableEdit-div li{line-height:36px;padding-left:5px;text-align:center;}');
    thisCss.push('.layui-tableEdit-div li:hover{background-color:#f2f2f2;}');
    thisCss.push('.layui-tableEdit-selected{background-color:#5FB878;}');
    thisCss.push('.layui-tableEdit-ul div{padding-left:0px!important;}');
    thisCss.push('.layui-tableEdit-edge{position:absolute;right:3px;bottom:8px;z-index:199109084;}');
    thisCss.push('.layui-tableEdit-input{position:absolute;left:0;bottom:0;width:100%;height:38px;z-index:19910908;}');
    var thisStyle = document.createElement('style');
    thisStyle.innerHTML = thisCss.join('\n'),document.getElementsByTagName('head')[0].appendChild(thisStyle);

    var configs = {
        callbacks:{}
    };

    var Class = function () { //单列模式  也就是只能new一个对象。
        var instance;
        Class = function Class() {
            return instance;
        };
        Class.prototype = this; //保留原型属性
        instance = new Class();
        instance.constructor = Class; //重置构造函数指针
        return instance
    }; //构造器
    var singleInstance = new Class();
    var inFunc = function () {singleInstance.leaveStat = false;},outFunc = function () {singleInstance.leaveStat = true;};
    document.onclick = function () {if(singleInstance.leaveStat)singleInstance.deleteAll();};

    //日期选择框
    Class.prototype.date = function(options){
        var othis = this;
        othis.callback = options.callback,othis.element = options.element,othis.dateType = options.dateType;
        othis.dateType = othis.isEmpty(othis.dateType) ? "datetime":othis.dateType;
        var that = options.element;
        if ($(that).find('input').length>0)return;
        othis.deleteAll(),othis.leaveStat = false;
        var input = $('<input class="layui-input layui-tableEdit-input layui-tableEdit-date" type="text">');
        (39 - that.offsetHeight > 3) && input.css('height','30px');
        (that.offsetHeight - 39 > 3) && input.css('height','50px');
        $(that).append(input),input.focus();
        //日期时间选择器 (show: true 表示直接显示)
        laydate.render({elem: input[0],type: othis.dateType,show: true,done:function (value, date) {
                othis.deleteAll();
                if(othis.callback)othis.callback.call(that,value);
            }});
        $('div.layui-laydate').hover(inFunc,outFunc),$(that).hover(inFunc,outFunc);
        _layui.stope();
    };

    //判断是否为空函数
    Class.prototype.isEmpty = function(dataStr){return typeof dataStr === 'undefined' || dataStr === null || dataStr.length <= 0;};

    //生成下拉框函数入口
    Class.prototype.register = function(options){
        var othis = this;
        othis.enabled = options.enabled,othis.callback = options.callback;
        othis.data = options.data,othis.element = options.element;
        othis.selectedValue = options.selectedValue;
        var that = othis.element;
        if($(that).find('input.layui-tableEdit-input')[0]) return;
        othis.deleteAll(),othis.leaveStat = false;
        var input = $('<input class="layui-input layui-tableEdit-input" placeholder="请选择">')
            ,icon = $('<i class="layui-icon layui-tableEdit-edge">&#xe625;</i>')
            ,tableEdit = $('<div class="layui-tableEdit"></div>')
            ,tableBody = $(that).parents('div.layui-table-body')
            ,tablePage = $(that).parents('div.layui-table-box').eq(0).next();
        (39 - that.offsetHeight > 3) && (input.css('height','30px'),icon.css('bottom','5px'));
        (that.offsetHeight - 39 > 3) && (input.css('height','50px'),icon.css('bottom','14px'));
        tableEdit.append(input),tableEdit.append(icon),$(that).append(tableEdit),input.focus();
        var thisY = input[0].getBoundingClientRect().top //输入框y坐标
            ,thisX = input[0].getBoundingClientRect().left //输入框x坐标
            ,thisHeight = ((39 - that.offsetHeight > 3) ? 30 : input[0].offsetHeight) //输入框高度
            ,thisHeight = ((that.offsetHeight - 39 > 3) ? 50 :thisHeight)
            ,thisWidth = input[0].offsetWidth; //输入框宽度
        function toBody() {
            var clientHeight = document.documentElement['clientHeight'] //窗口高度
                ,scrollTop = document.body['scrollTop'] | document.documentElement['scrollTop']//滚动条滚动高度
                ,scrollLeft = document.body['scrollLeft'] | document.documentElement['scrollLeft']//滚动条滚动宽度
                ,bottom = clientHeight-scrollTop-thisY+3 //div底部距离窗口底部长度
                ,top = thisY+thisHeight+scrollTop+3 //div元素y坐标
                ,type = thisY+thisHeight > 0.55*clientHeight ?  'top: auto;bottom: '+bottom+'px;' : 'bottom: auto;top: '+top+'px;';
            var style = type+'width: '+(thisWidth-2)+'px;left: '+(thisX+scrollLeft)+'px;'+(othis.enabled ? '':'overflow-y: auto;');
            (thisY+thisHeight > 0.55*clientHeight) && icon.css('transform','rotate(180deg)');
            $('body').append(laytpl(othis.enabled ? selectMoreTpl : selectTpl).render({data: othis.data,style: style,selectedValue:othis.selectedValue}));
        }
        function toThisElem(){
            var elemY = that.getBoundingClientRect().top //输入框y坐标
                ,tableBodyY = tableBody[0].getBoundingClientRect().top
                ,pageY = tablePage[0].getBoundingClientRect().top
                ,tableBodyHeight = tableBody.height() //表格高度
                ,isType = thisY-tableBodyY > 0.8*tableBodyHeight
                ,type = isType ? 'top: auto;bottom: '+(thisHeight+3)+'px;' : 'bottom: auto;top: '+(thisHeight+3)+'px;';
            isType && icon.css('transform','rotate(180deg)');
            if(elemY<tableBodyY)tableBody[0].scrollTop = that.offsetTop; //调整滚动条位置
            var style = type+'width: '+thisWidth+'px;left: 0px;'+(othis.enabled ? '':'overflow-y: auto;');
            tableEdit.append(laytpl(othis.enabled ? selectMoreTpl : selectTpl).render({data: othis.data,style: style,selectedValue:othis.selectedValue}));
            var $tableEdit = $('div.layui-tableEdit-div');
            (thisY+$tableEdit.height()+thisHeight > pageY) && !isType && (tableBody[0].scrollTop = that.offsetTop);//调整滚动条位置
        }
        tableBody[0].offsetHeight-252 > 38 ? toThisElem() : toBody();
        othis.events();
    };

    //删除所有下拉框和时间选择框
    Class.prototype.deleteAll = function(){
        $('div.layui-tableEdit-div,div.layui-tableEdit,div.layui-laydate,input.layui-tableEdit-date').remove();
        delete this.leaveStat;//清除（离开状态属性）
    };

    //注册事件
    Class.prototype.events = function(){
        var othis = this;
        var searchFunc = function(val){ //多选关键字搜索
            $('div.layui-tableEdit-div li').each(function () {
                othis.isEmpty(val) || $(this).data('value').indexOf(val) > -1 ? $(this).show() : $(this).hide();
            });
        },liClickFunc = function(){ //给li元素注册点击事件
            var liArr = $('div.layui-tableEdit-div li');
            liArr.unbind('click'),liArr.bind('click',function (e) {
                _layui.stope(e);
                var zthis = this;
                othis.enabled ? function () {
                    var icon = $(zthis).find("i"),liClass = $(zthis).attr("class");
                    (liClass && liClass.indexOf("li-checked") > -1) ? (icon.css("background-color","#fff"),$(zthis).removeClass("li-checked"))
                        : (icon.css("background-color","#60b979"),$(zthis).addClass("li-checked"));
                }() : function () {
                    othis.deleteAll();
                    if(othis.callback)othis.callback.call(othis.element,{name:$(zthis).data("name"),value:$(zthis).data("value")});
                }();
            });
        },btnClickFunc = function (){ //给button按钮注册点击事件
            $("div.layui-tableEdit-div button").bind('click',function () {
                var eventType = $(this).attr("event-type"), btn = this,status = $(btn).attr('data-status'),dataList = new Array();
                eventType === 'select' ? function () { //“全选”按钮
                    $('div.layui-tableEdit-div li').each(function (e) {
                        var icon = $(this).find("i");
                        othis.isEmpty(status) || status === 'false'
                            ? (icon.css("background-color","#60b979"),$(this).addClass("li-checked"),$(btn).attr("data-status","true"))
                            : (icon.css("background-color","#fff"),$(this).removeClass("li-checked"),$(btn).attr("data-status","false"));
                    });
                }() : function () { //“确定”按钮
                    $('div.layui-tableEdit-div li').each(function (e) {
                        var liClass = $(this).attr("class");
                        if(!liClass || liClass.indexOf("li-checked") <= -1)return;
                        dataList.push({name:$(this).data("name"),value:$(this).data("value")});
                    });
                    othis.deleteAll();
                    if(othis.callback)othis.callback.call(othis.element,dataList);
                }();
            });
        };
        //事件注册
        $(othis.element).find('input.layui-tableEdit-input').bind('input propertychange', function(){searchFunc(this.value)});
        $(othis.element).find('i.layui-tableEdit-edge').bind('click',function () {_layui.stope(),othis.deleteAll();});
        othis.enabled ? (liClickFunc(),btnClickFunc()) : liClickFunc();
        !$(othis.element).find('div.layui-tableEdit-div')[0] && $('div.layui-tableEdit-div').hover(inFunc,outFunc);
        $(othis.element).hover(inFunc,outFunc);
    };

    var AopEvent = function(cols){this.config = {cols:cols};};//aop构造器
    AopEvent.prototype.on = function(event,callback){
        var othis = this;othis.config.event = event,othis.config.callback = callback;
        table.on(othis.config.event,function (obj) {
            var zthis = this,field = $(zthis).data('field'),eventType,thisData,thisEnabled,dateType,cascadeSelectField;
            othis.config.cols.forEach(function (ite) {
                ite.forEach(function (item) {
                    if(field !== item.field || (!item.select && !item.date))return;
                    item.select ? (eventType = 'select',thisData = item.select.data,thisEnabled = item.select.enabled,cascadeSelectField=item.select.cascadeSelectField)
                        : (eventType = 'date',dateType = item.date.dateType,cascadeSelectField=item.date.cascadeSelectField);
                });
            });
            var classCallback = function (res) {
                obj.value = Array.isArray(res) ? (res.length>0 ? res : [{name:'',value:''}]) : res;
                othis.config.callback.call(zthis,obj);
                if(!singleInstance.isEmpty(cascadeSelectField)){
                    var thisCascadeSelectElement = $(this.parentNode).find("td[data-field='"+cascadeSelectField+"']");
                    $(thisCascadeSelectElement).attr("cascadeSelect-data",JSON.stringify({data:res,field:field}));
                }
            };
            var _csdata = $(this).attr("cascadeSelect-data");//级联数据
            singleInstance.isEmpty(_csdata) ?
            function () { //非级联事件
                if('select' === eventType){
                    singleInstance.register({data:thisData,element:zthis,enabled:thisEnabled,selectedValue:obj.data[field],callback:classCallback});
                }else if('date' === eventType){
                    singleInstance.date({dateType:dateType,element:zthis,callback:classCallback});
                }else{
                    othis.config.callback.call(zthis,obj);
                }
            }() : function () {//级联事件
                if('date' === eventType) return;
                //获取当前单元格的table表格的lay-filter属性值
                var filter = $(zthis).parents('div.layui-table-view').eq(0).prev().attr('lay-filter')
                    ,rs = active.callbackFn('clickBefore('+filter+')',JSON.parse(_csdata));
                    rs = singleInstance.isEmpty(rs) ? {} : rs;
                singleInstance.register({data:rs.data,element:zthis
                    ,enabled:rs.enabled,selectedValue:obj.data[field],callback:classCallback});
            }();

        });
    };
    var active = {
        aopObj:function(cols){return new AopEvent(cols);},
        on:function (event,callback) {
            var filter = event.match(/\((.*)\)$/),eventName = (filter ? event.replace(filter[0],'') : event)+'_'+(filter ? filter[1] : '');
            configs.callbacks[moduleName+'_'+eventName]=callback;
        },
        callbackFn:function (event,params) {
            var filter = event.match(/\((.*)\)$/),eventName = (filter ? event.replace(filter[0],'') : event)+'_'+(filter ? filter[1] : '');
            var key = moduleName+'_'+eventName,func = configs.callbacks[key];
            if(!func) return;
            return func.call(this,params);
        }
    };
    exports(moduleName, active);
});