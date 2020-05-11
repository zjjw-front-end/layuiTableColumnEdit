layui.define(["laydate","laytpl","table"],function(exports) {
    "use strict";
    var moduleName = 'tableEdit',_layui = self === top ? layui : top.layui,laytpl = _layui.laytpl
        ,$ = _layui.$,laydate = _layui.laydate,table = _layui.table
        ,selectTpl = [ //单选下拉框模板
            '<div class="layui-tableEdit-div" style="{{d.style}}">'
              , '<ul class="layui-tableEdit-ul">'
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
              , '</ul>'
            , '</div>'
        ].join('')
        ,selectMoreTpl = [ //多选下拉框模板
            '<div class="layui-tableEdit-div" style="{{d.style}}">'
              ,'<div style="line-height: 36px;">'
                 ,'<div style="float: left">'
                    ,'<button type="button" event-type="select" class="layui-btn layui-btn-sm layui-btn-primary">全选</button>'
                 ,'</div>'
                 ,'<div style="text-align: right">'
                    ,'<button event-type="confirm" type="button" class="layui-btn layui-btn-sm layui-btn-primary">确定</button>'
                 ,'</div>'
              ,'</div>'
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
            ,'</div>'
        ].join('');
    //组件用到的css样式
    var thisCss = [];
    thisCss.push('.layui-tableEdit-div{position:absolute;max-height: 252px;background-color:#fff;font-size:14px;border:1px solid #d2d2d2;z-index:19910908445;}');
    thisCss.push('.layui-tableEdit-tpl{margin:0;max-height:216px;overflow-y:auto;}');
    thisCss.push('.layui-tableEdit-div li{line-height:36px;padding-left:5px;}');
    thisCss.push('.layui-tableEdit-div li:hover{background-color:#f2f2f2;}');
    thisCss.push('.layui-tableEdit-ul div{padding-left:0px!important;}');
    thisCss.push('.layui-tableEdit-selected{background-color:#5FB878;}');
    thisCss.push('.layui-tableEdit-edge{position:absolute;right:3px;bottom:8px;z-index:199109084;}');
    thisCss.push('.layui-tableEdit-input{position:absolute;left:0;bottom:0;width:100%;height:38px;z-index:19910908;}');
    var thisStyle = document.createElement('style');
    thisStyle.innerHTML = thisCss.join('\n'),document.getElementsByTagName('head')[0].appendChild(thisStyle);

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
        var othis = this
            ,tableEdit$ = $(options.element).find('div.layui-tableEdit-div');
        if(tableEdit$[0])return;
        $(this.element).find('i.layui-tableEdit-edge').css('transform',''); //转回下三角图标
        othis.enabled = options.enabled;  //注意：这里不能用$.extend({},{})
        othis.callback = options.callback;
        othis.data = options.data;
        othis.element = options.element;
        othis.selectedValue = options.selectedValue;
        var that = othis.element;
        othis.deleteAll(),othis.leaveStat = false;
        var input = $(that).find('input.layui-tableEdit-input')
            ,icon = $(that).find('i.layui-tableEdit-edge')
            ,$div = $(that).children('div.layui-tableEdit')
            ,div$ = $(that).parents('div.layui-table-body')
            ,divPage = $(that).parents('div.layui-table-box').eq(0).next();
        if(!$div[0]){
            $div = $('<div class="layui-tableEdit"></div>');$(that).append($div);
        }
        if(!input[0]){
            input = $('<input class="layui-input layui-tableEdit-input" placeholder="请选择">');
            $div.append(input),input.focus();
        }
        if(!icon[0]){
            icon = $('<i class="layui-icon layui-tableEdit-edge">&#xe625;</i>');
            $div.append(icon);
        }
        var elemY = that.getBoundingClientRect().top //输入框y坐标
            ,divY = div$[0].getBoundingClientRect().top
            ,thisWidth = input[0].offsetWidth
            ,pageY = divPage[0].getBoundingClientRect().top
            ,$divY = $div[0].getBoundingClientRect().top
            ,clientHeight = div$.height() //表格高度
            ,elemHeight = that.offsetHeight
            ,type = elemY-divY > 0.8*clientHeight ? 'top: auto;bottom: '+(elemHeight)+'px;' : 'bottom: auto;top: '+(elemHeight)+'px;';
        icon.css('transform','rotate(180deg)');
        if(elemY<divY)div$[0].scrollTop = that.offsetTop; //调整滚动条位置
        var style = type+'width: '+thisWidth+'px;left: 0px;'+(othis.enabled ? '':'overflow-y: auto;');
        othis.selectedValue = singleInstance.isEmpty(input[0].value) ? othis.selectedValue : input[0].value;
        $div.append(laytpl(othis.enabled ? selectMoreTpl : selectTpl).render({data: othis.data,style: style,selectedValue:othis.selectedValue}));
        tableEdit$ = $('div.layui-tableEdit-div');
        if($divY+tableEdit$.height() > pageY) div$[0].scrollTop = that.offsetTop+tableEdit$.height(); //调整滚动条位置
        othis.events();
    };

    //删除所有下拉框和时间选择框
    Class.prototype.deleteAll = function(){
        var othis = this;
        $('div.layui-tableEdit-div,div.layui-laydate,input.layui-tableEdit-date').remove();
        $(othis.element).find('i.layui-tableEdit-edge').css('transform','');
        delete othis.leaveStat;//清除（离开状态属性）
        var filter = $(othis.element).parents('div.layui-table-view').eq(0).prev().attr('lay-filter');
        active.callback('deleteAfter('+filter+')');
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
        $(othis.element).hover(inFunc,outFunc);
    };

    var AopEvent = function(cols){this.config = {cols:cols};};//aop构造器
    AopEvent.prototype.on = function(event,callback){
        var othis = this;othis.config.event = event,othis.config.callback = callback;
        table.on(othis.config.event,function (obj) {
            var zthis = this,field = $(zthis).data('field'),eventType,thisData,thisEnabled,dateType,cascadeSelectField;
            othis.config.cols.forEach(function (ite) {
                ite.forEach(function (item) {
                    var $select = item.select,$date = item.date;
                    if(field !== item.field || (!$select && !$date))return;
                    $select ? (eventType = 'select',thisData = $select.data,thisEnabled = $select.enabled)
                        : (eventType = 'date',dateType = $date.dateType);
                    cascadeSelectField = $select ?  $select.cascadeSelectField : $date.cascadeSelectField;
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
                    singleInstance.register({data:thisData,element:zthis,enabled:thisEnabled,selectedValue:obj.data[field],callback:classCallback});
                }else if('date' === eventType){
                    singleInstance.date({dateType:dateType,element:zthis,callback:classCallback});
                }else{
                    othis.config.callback.call(zthis,obj);
                }
            }() : function () {//级联事件
                if('date' === eventType) return;
                delete othis.cascadeSelectConfig; //清除上一次缓存的级联配置数据
                //获取当前单元格的table表格的lay-filter属性值
                var filter = $(zthis).parents('div.layui-table-view').eq(0).prev().attr('lay-filter');
                active.callback.call(zthis,'clickBefore('+filter+')');
                if(!othis.cascadeSelectConfig) return;
                singleInstance.register({data:othis.cascadeSelectConfig.data,element:zthis
                    ,enabled:othis.cascadeSelectConfig.enabled,selectedValue:obj.data[field],callback:classCallback});
            }();

        });
    };
    var active = {
        aopObj:function(cols){return new AopEvent(cols);},
        on:function (event,callback) {_layui.onevent.call(this,moduleName,event,callback);},
        callback:function (event,params) {_layui.event.call(this,moduleName,event,params)}
    };
    active.on('showInput',function (options) {
        if(!options || !options['fields'] || !options.element) return
        options['fields'].forEach(function (field) {
            $(options.element).next().find('div.layui-table-body td[data-field="'+field+'"]').each(function () {
                var input = $('<input class="layui-input layui-tableEdit-input" placeholder="请选择" value="'+($(this).children('div.layui-table-cell').text())+'">')
                    ,icon = $('<i class="layui-icon layui-tableEdit-edge">&#xe625;</i>')
                    ,div = $('<div class="layui-tableEdit"></div>');
                div.append(input),div.append(icon),$(this).append(div);
            });
        });
    });
    active.on('hideInput',function (options) {
        options && options.fields && options.element ? options.fields.forEach(function (field) {
            $(options.element).next().find('div.layui-table-body td[data-field="'+field+'"] div.layui-tableEdit').remove()
        }) : $('div.layui-tableEdit').remove();
    });
    exports(moduleName, active);
});