layui.define(["jquery","laydate","laytpl","table"],function(exports) {
    "use strict";
    var $ = layui.jquery,laydate = layui.laydate,table = layui.table,
        laytpl = layui.laytpl,
        selectTpl = [ //单选下拉框模板
            '<div class="layui-define-tcs-div layui-define-tcs-div-one" style="{{d.style.type}}px; width: {{d.style.width}}px; left: {{d.style.left}}px;">'
              , '<dl>'
                  ,'{{# if(d.data){ }}'
                      ,'{{# d.data.forEach(function(item){ }}'
                          ,'<dd lay-value="{{ item.name }}" class="layui-define-tcs-dd">{{ item.value }}</dd>'
                      ,'{{# }); }}'
                  ,'{{# } else { }}'
                      ,'<dd lay-value="" class="layui-define-tcs-dd">无数据</dd>'
                  ,'{{# } }}'
              , '</dl>'
            , '</div>'
        ].join(''),selectMoreTpl = [ //多选下拉框模板
            '<div class="layui-define-tcs-div layui-define-tcs-div-more" style="{{d.style.type}}px; width: {{d.style.width}}px; left: {{d.style.left}}px;">'
              ,'<div>'
                 ,'<span style="text-align: left">'
                    ,'<button type="button" event-type="select" class="layui-btn layui-btn-sm layui-btn-primary">全选</button>'
                 ,'</span>'
                 ,'<span style="float: right">'
                    ,'<button event-type="confirm" type="button" class="layui-btn layui-btn-sm layui-btn-primary">确定</button>'
                 ,'</span>'
              ,'</div>'
              ,'<div class="layui-define-tcs-div-tpl">'
                 ,'<ul class="layui-define-tcs-ul" >'
                    ,'{{# if(d.data){ }}'
                        ,'{{# d.data.forEach(function(item){ }}'
                            ,'<li class="layui-define-tcs-checkbox" data-name="{{ item.name }}" data-value="{{ item.value }}">'
                               ,'<div class="layui-define-tcs-checkbox" lay-skin="primary">'
                                  ,'<span>{{ item.value }}</span>'
                                  ,'<i class="layui-icon layui-icon-ok"></i>'
                               ,'</div>'
                            ,'</li>'
                        ,'{{# }); }}'
                    ,'{{# } else { }}'
                        ,'<li>无数据</li>'
                    ,'{{# } }}'
                 ,'</ul>'
              ,'</div>'
            ,'</div>'
        ].join('');
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
        var input = $('<input class="layui-input layui-define-tcs-input" type="text">');
        $(that).append(input),input.focus();
        //日期时间选择器 (show: true 表示直接显示)
        laydate.render({elem: input[0],type: othis.dateType,show: true,done:function (value, date) {
            othis.deleteAll();
            if(othis.callback)othis.callback.call(that,value);
        }});
        $('div.layui-laydate').hover(inFunc,outFunc),$(that).hover(inFunc,outFunc);
        layui.stope();
    };

    //判断是否为空函数
    Class.prototype.isEmpty = function(dataStr){return typeof dataStr === 'undefined' || dataStr === null || dataStr.length <= 0;};

    //生成下拉框函数入口
    Class.prototype.register = function(options){
        var othis = this;
        othis.enabled = options.enabled,othis.callback = options.callback,othis.data = options.data,othis.element = options.element;
        var that = othis.element;
        if ($(that).find('input').length>0)return;
        othis.deleteAll(that),othis.leaveStat = false; //鼠标离开单元格或下拉框div区域状态，默认不离开（false）
        var input = $('<input class="layui-input layui-define-tcs-input" placeholder="关键字搜索">');
        var icon = $('<i class="layui-icon layui-define-tcs-edge">&#xe625;</i>');
        $(that).append(input),$(that).append(icon),input.focus();
        var thisY = that.getBoundingClientRect().top; //单元格y坐标
        var thisX = that.getBoundingClientRect().left; //单元格x坐标
        var thisHeight = that.offsetHeight,thisWidth = that.offsetWidth //单元格宽度和高度
            ,clientHeight = document.documentElement['clientHeight'] //窗口高度
            ,scrollTop = document.body['scrollTop'] | document.documentElement['scrollTop']//滚动条滚动高度
            ,scrollLeft = document.body['scrollLeft'] | document.documentElement['scrollLeft'];//滚动条滚动宽度
        var bottom = clientHeight-scrollTop-thisY+3; //div底部距离窗口底部长度
        var top = thisY+thisHeight+scrollTop+3; //div元素y坐标
        //当前y坐标大于窗口0.55倍的高度则往上延伸，否则往下延伸。
        var type = thisY+thisHeight > 0.55*clientHeight ?  'top:auto;bottom: '+bottom : 'bottom:auto;top:'+top;
        //下三角图标旋转180度成上三角图标
        thisY+thisHeight > 0.55*clientHeight ? $(icon).addClass("layui-define-tcs-edgeTransform") : '';
        //生成下拉框
        $('body').append(laytpl(othis.enabled ? selectMoreTpl : selectTpl).render({data: othis.data,style: {type: type,width: thisWidth,left: thisX+scrollLeft}}));
        //事件注册
        othis.events();
    };

    //删除所有下拉框和时间选择框
    Class.prototype.deleteAll = function(){
        $('div.layui-define-tcs-div,div.layui-laydate,input.layui-define-tcs-input,i.layui-define-tcs-edge').remove();
        delete this.leaveStat; //清除leaveStat（离开状态属性）
    };

    //注册事件
    Class.prototype.events = function(){
        var othis = this;
        var liSearchFunc = function(val){ //多选关键字搜索
            $('ul.layui-define-tcs-ul li').each(function () {
                othis.isEmpty(val) || $(this).data('value').indexOf(val) > -1 ? $(this).show() : $(this).hide();
            });
        },ddSearchFunc = function(val){ //单选关键字搜索
            $('div.layui-define-tcs-div dd').each(function () {
                othis.isEmpty(val) || $(this).text().indexOf(val) > -1 ? $(this).show() : $(this).hide();
            });
        },ddClickFunc = function () { //给dd元素注册点击事件(单选)
            var ddArr = $('div.layui-define-tcs-div').find('dd');
            ddArr.unbind('click'),ddArr.bind('click',function (e) {
                layui.stope(e),othis.deleteAll();
                if(othis.callback)othis.callback.call(othis.element,{name:$(this).attr('lay-value'),value:$(this).text()});
            });
        },liClickFunc = function(){ //给li元素注册点击事件（多选）
            var liArr = $('div.layui-define-tcs-div').find('li');
            liArr.unbind('click'),liArr.bind('click',function (e) {
                layui.stope(e);
                var icon = $(this).find("i"),liClass = $(this).attr("class");
                (liClass && liClass.indexOf("li-checked") > -1) ? (icon.css("background-color","#fff"),$(this).removeClass("li-checked"))
                    : (icon.css("background-color","#60b979"),$(this).addClass("li-checked"));
            });
        },btnClickFunc = function (){ //给button按钮注册点击事件
            $("div.layui-define-tcs-div button").bind('click',function () {
                var eventType = $(this).attr("event-type"), btn = this,status = $(btn).attr('data-status'),dataList = new Array();
                eventType === 'select' ? function () { //“全选”按钮
                    $('ul.layui-define-tcs-ul').find('li').each(function (e) {
                        var icon = $(this).find("i");
                        othis.isEmpty(status) || status === 'false'
                            ? (icon.css("background-color","#60b979"),$(this).addClass("li-checked"),$(btn).attr("data-status","true"))
                            : (icon.css("background-color","#fff"),$(this).removeClass("li-checked"),$(btn).attr("data-status","false"));
                    });
                }() : function () { //“确定”按钮
                    $("div.layui-define-tcs-div").find("div li").each(function (e) {
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
        $(othis.element).find('input.layui-define-tcs-input').bind('input propertychange', function(){othis.enabled ? liSearchFunc(this.value) : ddSearchFunc(this.value);});
        $(othis.element).find('i.layui-define-tcs-edge').bind('click',function () {layui.stope(),othis.deleteAll();});
        othis.enabled ? (liClickFunc(),btnClickFunc()) : ddClickFunc();
        $('div.layui-define-tcs-div').hover(inFunc,outFunc),$(othis.element).hover(inFunc,outFunc);
    };

    var AopEvent = function(cols){this.config = {cols:cols};};//aop构造器
    AopEvent.prototype.on = function(event,callback){
        var othis = this;othis.config.event = event,othis.config.callback = callback;
        table.on(othis.config.event,function (obj) {
            var zthis = this,field = $(zthis).data('field'),eventType,thisData,thisEnabled,dateType;
            othis.config.cols.forEach(function (ite) {
                ite.forEach(function (item) {
                    if(field !== item.field || (!item.select && !item.date))return;
                    item.select ? (eventType = 'select',thisData = item.select.data,thisEnabled = item.select.enabled) : (eventType = 'date',dateType = item.date.dateType);
                });
            });
            var classCallback = function (res) {
                obj.value = Array.isArray(res) ? (res.length>0 ? res : [{name:'',value:''}]) : res;
                othis.config.callback.call(zthis,obj);
            };
            if('select' === eventType){
                singleInstance.register({data:thisData,element:zthis,enabled:thisEnabled,callback:classCallback});
            }else if('date' === eventType){
                singleInstance.date({dateType:dateType,element:zthis,callback:classCallback});
            }else{
                othis.config.callback.call(zthis,obj);
            }
        });
    };
    var active = {
        aopObj:function(cols){return new AopEvent(cols);},
        createSelect:function (options) {singleInstance.register(options);},
        update:function (options) {$(options.element).find("div.layui-table-cell").eq(0).text(options.value);},
        createDate:function (options) {singleInstance.date(options);}
    };

    exports('layuiTableColumnEdit', active);
});