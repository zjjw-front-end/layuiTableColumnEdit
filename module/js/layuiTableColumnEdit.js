layui.define(["jquery","laydate","laytpl"],function(exports) {
    "use strict";

    var $ = layui.jquery,laydate = layui.laydate,laytpl = layui.laytpl,
        //构造器
        Class = function () {
        },
        //单列
        singleInstance = new Class(),
        //监听鼠标中间键滚轮滚动回调事件
        scrollFunc=function(e){
            if(singleInstance.leaveStatus){
                singleInstance.deleteAll();
            }
        };
    /*注册事件*/
    if(document.addEventListener){
        //兼容火狐浏览器
        document.addEventListener('DOMMouseScroll',scrollFunc,false);
    }
    window.onmousewheel=document.onmousewheel=scrollFunc;//IE/Opera/Chrome

    document.onclick = function () {
        if(singleInstance.leaveStat){
            singleInstance.deleteAll();
        }
    };

    //日期选择框
    Class.prototype.date = function(options){
        var othis = this;
        othis.cacheOptions = options;
        othis.callback = options.callback;
        othis.cacheOptions.dateType =  othis.isEmpty(othis.cacheOptions.dateType) ? "datetime":othis.cacheOptions.dateType;
        var that = options.element;
        othis.td = that;
        if ($(that).find('input').length>0) {
            return;
        }
        othis.deleteAll();
        othis.leaveStat = false;
        var input = $('<input class="layui-input layui-table-select-input" type="text" id="thisDate">');
        $(that).append(input);
        var icon = $('<i class="layui-icon layui-table-select-edge">&#x1007;</i>');
        $(that).append(icon);
        icon.bind('click',function () {
            layui.stope();
            othis.deleteAll();
        });
        //日期时间选择器
        laydate.render({
            elem: '#thisDate'
            ,type: othis.cacheOptions.dateType
            ,done:function (value, date) {
                othis.deleteAll();
                if(othis.callback){
                    othis.callback({value:value,td:that});
                }
            }
        });

        $('div.layui-laydate').hover(
            function () {
                othis.leaveStat = false;
            },function () {
                othis.leaveStat = true;
            }
        );

        $(othis.td).hover(
            function () {
                othis.leaveStat = false;
            },function () {
                othis.leaveStat = true;
            }
        );
    };

    //判断是否为空函数
    Class.prototype.isEmpty = function(dataStr){
        if(typeof dataStr === 'undefined' || dataStr === null || dataStr.length <= 0){
            return true;
        }else {
            return false;
        }
    };

    //删除td中的input和时间选择器
    Class.prototype.deleteDate = function(){
        $("#thisDate").next().remove();
        $("#thisDate").remove();
        $("div.layui-laydate").remove();
        delete this.leaveStat;
    };

    //生成下拉框函数入口
    Class.prototype.register = function(options){
        var othis = this;
        othis.cacheOptions = options;
        othis.callback = options.callback;
        othis.data = options.data;
        var that = options.element;
        othis.td = that;
        if ($(that).find('input').length>0) {
            return;
        }
        othis.deleteAll(that);
        othis.leaveStatus = true;
        othis.leaveStat = false;
        var input = $('<input class="layui-input layui-table-select-input" placeholder="关键字搜索">');
        var icon = $('<i class="layui-icon layui-table-select-edge" data-td-text="'+$(that).find("div.layui-table-cell").eq(0).text()+'" >&#xe625;</i>');
        $(that).append(input);
        $(that).append(icon);
        input.focus();
        input.bind('input propertychange', function(){
            var val = this.value;
            if(othis.cacheOptions.enabled === true){
                var ul = $('div.layui-table-select-div').find('ul.ul-edit-data').eq(0);
                if(val === null || val === '' || val.length === 0){
                    return;
                }
                var searchDDs = [];
                $(ul).find('li').each(function () {
                    var thisValue = $(this).data('value');
                    thisValue = othis.isEmpty(thisValue)?"":thisValue;
                    if(thisValue.indexOf(val) > -1){
                        var classText = $(this).attr("class");
                        var backgroundColor = "";
                        if(classText.indexOf("li-checked") > -1){
                            backgroundColor = "background-color: #60b979";
                        }
                        var searchHtml = [
                            '<li class="'+$(this).attr("class")+'" data-name="'+$(this).data('name')+'" data-value="'+thisValue+'">'
                               ,'<div class="define-edit-checkbox" lay-skin="primary">'
                                  ,'<span>'+thisValue+'</span>'
                                  ,'<i style="'+backgroundColor+'" class="layui-icon layui-icon-ok"></i>'
                               ,'</div>'
                            ,'</li>'].join('');
                        searchDDs.push(searchHtml);
                        $(this).remove();
                    }
                });
                ul.prepend(searchDDs.join(""));
                othis.liClick(that);
            }else {
                var dl = $('div.layui-table-select-div').find('dl').eq(0);
                var html;
                if(val === null || val === '' || val.length === 0){
                    html = [
                        '{{# if(d.data){ }}'
                           ,'{{# layui.each(d.data, function(index,item){ }}'
                               ,'<dd lay-value="{{ item.name }}" class="layui-table-select-dd">{{ item.value }}</dd>',
                           ,'{{# }); }}'
                        ,'{{# } else { }}'
                               ,'<dd lay-value="" class="">无数据</dd>'
                        ,'{{# } }}'].join('');
                }else {
                    html = [
                        '{{# if(d.data){ }}'
                           ,'{{# layui.each(d.data, function(index,item){ }}'
                               ,'{{# if((item.value+\'\').indexOf(d.search)>-1){ }}'
                                   ,'<dd lay-value="{{ item.name }}" class="layui-table-select-dd">{{ item.value }}</dd>',
                               ,'{{# } }}'
                           ,'{{# }); }}'
                        ,'{{# } else { }}'
                            ,'<dd lay-value="" class="">无数据</dd>'
                        ,'{{# } }}'].join('');
                }
                dl.html("");
                dl.prepend(laytpl(html).render({
                    data: othis.data
                    ,search: val //索引
                }));
                othis.ddClick(that);
            }
        });
        icon.bind('click',function () {
            layui.stope();
            othis.deleteAll();
        });
        //layui.stope(input);
        var thisY = that.getBoundingClientRect().top; //y坐标
        var thisX = that.getBoundingClientRect().left; //x坐标
        var tdHeight = that.offsetHeight;
        var tdWidth = that.offsetWidth;
        var tdInfo = {
            x:thisX,
            y:thisY,
            width:tdWidth,
            height:tdHeight,
            type:'',
            td:that
        };
        var winHeight = $(window).height();
        //当前y坐标大于窗口0.55倍的高度则往上延伸，否则往下延伸。
        if(thisY+tdHeight > 0.55*winHeight){
            //往上延伸
            tdInfo.type = 'up';
            $(icon).addClass("layui-edge-transform");
        }else {
            //往下延伸
            tdInfo.type = 'down';
        }
        othis.dynamicGenerationSelect(othis.data,tdInfo);
        othis.registerHover();
    };

    //给下拉列表注册点击事件
    Class.prototype.ddClick = function(){
        var othis = this;
        $('div.layui-table-select-div').find('dd').bind('click',function (e) {
            layui.stope(e);
            var name = $(this).attr('lay-value');
            othis.deleteAll();
            if(othis.callback){
                var update = {name:name,value:$(this).text()};
                var thisObj = {
                    select:update,
                    td:othis.td
                };
                othis.callback(thisObj);
            }
        });
    };

    //给下拉列表注册点击事件
    Class.prototype.liClick = function(){
        $('div.layui-table-select-div').find('li').unbind('click');
        $('div.layui-table-select-div').find('li').bind('click',function (e) {
            layui.stope(e);
            var icon = $(this).find("i");
            var liClass = $(this).attr("class");
            if(liClass && liClass.indexOf("li-checked") > -1){
                icon.css("background-color","#fff");
                $(this).removeClass("li-checked");
            }else {
                icon.css("background-color","#60b979");
                $(this).addClass("li-checked");
            }
        });
    };

    //删除所有删除下拉框和input和div
    Class.prototype.deleteAll = function(td){
        var othis = this;
        othis.deleteDate();
        $('div.layui-table-body').find('td').each(function () {
            var icon = $(this).find('i.layui-table-select-edge');
            if(icon.length === 0){
                return;
            }
            $(this).find('input.layui-table-select-input').blur();
            $(this).find('input.layui-table-select-input').remove();
            icon = icon.eq(0);
            var text = icon.attr('data-td-text');
            $(this).find("div.layui-table-cell").eq(0).text(text);
            icon.remove();
        });
        delete othis.leaveStatus;
        delete othis.leaveStat;
        $('div.layui-table-select-div').remove();
    };

    //动态生成下拉框
    Class.prototype.dynamicGenerationSelect = function(data,tdInfo){
        var othis = this;
        var html;
        var winHeight = $(window).height()+window.scrollY;//加上滚动条滚动高度
        var type = tdInfo.type === 'up'?'top:auto;bottom: '+(winHeight-tdInfo.y)+'px;':'bottom:auto;top:'+(tdInfo.y+tdInfo.height)+'px;';
        var width = tdInfo.width;
        var left = tdInfo.x;
        if(othis.cacheOptions.enabled === true){
            html = [
                '<div class="layui-table-select-div" style="z-index: 19910908;{{d.style.type}} width: {{d.style.width}}px;position: absolute; left: {{d.style.left}}px;">'
                   ,'<div>'
                       ,'<span style="text-align: left">'
                          ,'<button type="button" id="selectAll" class="layui-btn layui-btn-sm layui-btn-primary">全选</button>'
                       ,'</span>'
                       ,'<span style="float: right">'
                          ,'<button id="confirmBtn" type="button" class="layui-btn layui-btn-sm layui-btn-primary">确定</button>'
                       ,'</span>'
                   ,'</div>'
                   ,'<div style="margin:0;background-color: #93f3ff;border: 1px solid #d2d2d2;max-height: 290px;overflow-y: auto;font: 14px Helvetica Neue,Helvetica,PingFang SC,Tahoma,Arial,sans-serif;">'
                       ,'<ul class="ul-edit-data" >'
                          ,'{{# if(d.data){ }}'
                              ,'{{# layui.each(d.data, function(index,item){ }}'
                                 ,'<li class="define-edit-checkbox" data-name="{{ item.name }}" data-value="{{ item.value }}">'
                                    ,'<div class="define-edit-checkbox" lay-skin="primary">'
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
                ,'</div>'].join('');
        }else {
            html = [
             '<div class="layui-table-select-div div-style" style="z-index: 19910908;{{d.style.type}} width: {{d.style.width}}px;position: absolute; left: {{d.style.left}}px;">'
               ,'<dl>'
                 ,'{{# if(d.data){ }}'
                    ,'{{# layui.each(d.data, function(index,item){ }}'
                        ,'<dd lay-value="{{ item.name }}" class="layui-table-select-dd">{{ item.value }}</dd>',
                    ,'{{# }); }}'
                 ,'{{# } else { }}'
                    ,'<dd lay-value="" class="">无数据</dd>'
                 ,'{{# } }}'
               ,'</dl>'
             ,'</div>'].join('');
        }
        $('body').append(laytpl(html).render({
            data: data
            ,style: {
                type: type
                ,width: width
                ,left: left
            }
        }));
        othis.ddClick();
        othis.liClick();
        othis.btnClick();
    };

    //多选下拉框 注册（“确定”或“全选”按钮）点击事件
    Class.prototype.btnClick = function(){
        var othis = this;
        //“确定”按钮
        $('#confirmBtn').bind('click',function (e) {
            var dataList = new Array();
            $("div.layui-table-select-div").find("div li").each(function (e) {
                var liClass = $(this).attr("class");
                if(!liClass || liClass.indexOf("li-checked") <= -1){
                    return;
                }
                var name = $(this).data("name");
                var value = $(this).data("value");
                var update = {name:name,value:value};
                dataList.push(update);
            });
            othis.deleteAll();
            if(othis.callback){
                var thisObj = {
                    select:dataList,
                    td:othis.td
                };
                othis.callback(thisObj);
            }
        });

        //“全选”按钮
        $('#selectAll').bind('click',function () {
            var btn = this;
            var status = $(this).attr('data-status');
            $('ul.ul-edit-data').find('li').each(function (e) {
                var icon = $(this).find("i");
                if(othis.isEmpty(status) || status === 'false'){
                    icon.css("background-color","#60b979");
                    $(this).addClass("li-checked");
                    $(btn).attr("data-status","true");
                }else {
                    icon.css("background-color","#fff");
                    $(this).removeClass("li-checked");
                    $(btn).attr("data-status","false");
                }
            });
        });
    };

    //更新单元格中的显示值
    Class.prototype.update = function (options) {
        $(options.element).find("div.layui-table-cell").eq(0).text(options.value);
    };

    //给下拉框注册鼠标悬停事件
    Class.prototype.registerHover = function () {
        var othis = this;
        $('div.layui-table-select-div').hover(
            function () {
                othis.leaveStatus = false;
                othis.leaveStat = false;
            },function () {
                othis.leaveStatus = true;
                othis.leaveStat = true;
            }
        );

        $(othis.td).hover(
            function () {
                othis.leaveStat = false;
            },function () {
                othis.leaveStat = true;
            }
        );
    };

    var active = {
        createSelect:function (options) {
            singleInstance.register(options);
        },
        update:function (options) {
            singleInstance.update(options);
        },
        createDate:function (options) {
            singleInstance.date(options);
        }
    };
    layui.link(layui.cache.base + 'css/layuiTableColumnEdit.css');
    exports('layuiTableColumnEdit', active);
});