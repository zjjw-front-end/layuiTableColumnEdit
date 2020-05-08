layui.define(["jquery","laydate","laytpl","table"],function(exports) {
    "use strict";
    var $ = layui.jquery,laydate = layui.laydate,table = layui.table,
        laytpl = layui.laytpl,moduleName = 'tableEdit',_layui = self === top ? layui : top.layui,
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
    //自动加载样式
    var thisCss = ".layui-define-tcs-div{position: absolute;margin:0;background-color: #fff;font-size: 14px;border: 1px solid #d2d2d2;z-index: 19910908;}.layui-define-tcs-div-one{background-color: #93f3ff;padding: 5px 0;overflow-y: auto;max-height: 288px;}.layui-define-tcs-div-more{max-height: 318px;}.layui-define-tcs-div-tpl{margin:0;background-color: #93f3ff;border: 1px solid #d2d2d2;max-height: 288px;overflow-y: auto;}.layui-define-tcs-dd{padding: 0 10px;line-height: 36px;white-space: nowrap;overflow: hidden;text-overflow: ellipsis;}.layui-define-tcs-div dd:hover {background-color: #44aedb;-webkit-transition: .5s all;transition: .5s all;}.layui-define-tcs-edge{position: absolute;right: 3px;top: 50%;margin-top: -15px;cursor: pointer;border-width: 6px;-webkit-transition: all .3s;border-style: dashed;border-color: transparent;}.layui-define-tcs-edgeTransform{transform:rotate(180deg);transition: all .3s;}.layui-define-tcs-input{position: absolute;left: 0;top: 0;width: 100%;height: 100%;padding: 0 14px 1px;border-radius: 0;box-shadow: 1px 1px 20px rgba(0,0,0,.15)}.layui-define-tcs-input:focus{border-color: #5FB878!important;}.layui-define-tcs-checkbox{position: relative;display: inline-block;vertical-align: middle;height: 36px;line-height: 36px;padding-left: 5px;cursor: pointer;font-size: 0;-webkit-transition: .1s linear;transition: .1s linear;box-sizing: border-box;min-width: 100%;}.layui-define-tcs-checkbox *{display: inline-block;vertical-align: middle;}.layui-define-tcs-checkbox span{padding: 0 10px;height: 100%;font-size: 14px;border-radius: 2px 0 0 2px;background-color: #d2d2d2;color: #fff;overflow: hidden;white-space: nowrap;text-overflow: ellipsis;}.layui-define-tcs-checkbox:hover span{background-color: #44aedb;}.layui-define-tcs-checkbox i{position: absolute; right: 0; top: 0; width: 30px; height: 28px; border: 1px solid #d2d2d2; border-left: none; border-radius: 0 2px 2px 0; color: #fff; font-size: 20px; text-align: center;}.layui-define-tcs-checkbox:hover i{border-color: #c2c2c2; color: #c2c2c2;}.layui-define-tcs-checkbox[lay-skin=\"primary\"]{height: auto!important; line-height: normal!important; min-width: 18px; min-height: 18px; border: none!important; margin-right: 0; padding-left: 28px; padding-right: 0; background: none;}.layui-define-tcs-checkbox[lay-skin=\"primary\"] span{padding-left: 0; padding-right: 15px; line-height: 18px; background: none; color: #666;}.layui-define-tcs-checkbox[lay-skin=\"primary\"] i{right: auto; left: 0; width: 16px; height: 16px; line-height: 16px; border: 1px solid #d2d2d2; font-size: 12px; border-radius: 2px; background-color: #fff; -webkit-transition: .1s linear; transition: .1s linear;}.layui-define-tcs-checkbox[lay-skin=\"primary\"]:hover i{border-color: #5FB878; color: #fff;}.layui-define-tcs-ul{overflow: auto;}.layui-define-tcs-ul li{height: 36px; line-height: 36px;}.layui-define-tcs-ul li:hover{background-color: #44aedb; transition: .5s all;}";
    var thisStyle = document.createElement('style');
    thisStyle.innerHTML = thisCss,document.getElementsByTagName('head')[0].appendChild(thisStyle);

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
                $(othis.element).find('input.layui-define-tcs-input').val(''),liSearchFunc();
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
                    $(thisCascadeSelectElement).attr("cascadeSelect-data",JSON.stringify(res)).attr("cascadeSelect-field",field);
                }
            };
            var elementCascadeSelectField = $(this).attr("cascadeSelect-field");//级联字段
            singleInstance.isEmpty(elementCascadeSelectField) ?
            function () { //非级联事件
                if('select' === eventType){
                    singleInstance.register({data:thisData,element:zthis,enabled:thisEnabled,callback:classCallback});
                }else if('date' === eventType){
                    singleInstance.date({dateType:dateType,element:zthis,callback:classCallback});
                }else{
                    othis.config.callback.call(zthis,obj);
                }
            }() : function () {//级联事件
                if('date' === eventType) return;
                delete othis.cascadeSelectConfig; //清除上一次缓存的级联配置数据
                active.onCallback.call(zthis,'clickBefore');
                if(!othis.cascadeSelectConfig) return;
                singleInstance.register({data:othis.cascadeSelectConfig.data,element:zthis,enabled:othis.cascadeSelectConfig.enabled,callback:classCallback});
            }();

        });
    };
    var active = {
        aopObj:function(cols){return new AopEvent(cols);},
        createSelect:function (options) {singleInstance.register(options);},
        update:function (options) {$(options.element).find("div.layui-table-cell").eq(0).text(options.value);},
        createDate:function (options) {singleInstance.date(options);},
        on:function (event,callback) {_layui.onevent.call(this,moduleName,event,callback);},
        onCallback:function (event,params) {_layui.event.call(this,moduleName,event,params)}
    };

    exports(moduleName, active);
});