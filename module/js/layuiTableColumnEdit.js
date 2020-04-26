layui.define(["jquery","laydate","laytpl"],function(exports) {
    "use strict";
    var $ = layui.jquery,laydate = layui.laydate,
        laytpl = layui.laytpl,ddTpl =
        [
            '{{# if(d.data){ }}'
               ,'{{# layui.each(d.data, function(index,item){ }}'
                   ,'<dd lay-value="{{ item.name }}" class="layui-table-select-dd">{{ item.value }}</dd>',
               ,'{{# }); }}'
            ,'{{# } else { }}'
                ,'<dd lay-value="" class="">无数据</dd>'
            ,'{{# } }}'
        ].join(''),htmlTpl =
        {
            //单选下拉框模板
            selectTpl:
            [
                '<div class="layui-table-select-div div-style" style="z-index: 19910908;{{d.style.type}}px; width: {{d.style.width}}px;position: absolute; left: {{d.style.left}}px;">'
                  , '<dl>'
                      ,ddTpl
                  , '</dl>'
                , '</div>'
            ].join(''),
            //多选下拉框模板
            selectMoreTpl:
            [
                '<div class="layui-table-select-div" style="z-index: 19910908;{{d.style.type}}px; width: {{d.style.width}}px;position: absolute; left: {{d.style.left}}px;">'
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
                ,'</div>'
            ].join(''),
            ddTpl:ddTpl,
            ddSearchTpl:
            [
                '{{# if(d.data){ }}'
                   ,'{{# layui.each(d.data, function(index,item){ }}'
                       ,'{{# if((item.value+\'\').indexOf(d.search)>-1){ }}'
                           ,'<dd lay-value="{{ item.name }}" class="layui-table-select-dd">{{ item.value }}</dd>',
                       ,'{{# } }}'
                   ,'{{# }); }}'
                ,'{{# } else { }}'
                    ,'<dd lay-value="" class="">无数据</dd>'
                ,'{{# } }}'
            ].join('')
        };
    var Class = function () {}; //构造器
    var singleInstance = new Class(); //单列
    document.onclick = function () {if(singleInstance.leaveStat)singleInstance.deleteAll();};

    //日期选择框
    Class.prototype.date = function(options){
        var othis = this;
        othis.callback = options.callback,othis.element = options.element,othis.dateType = options.dateType;
        othis.dateType = othis.isEmpty(othis.dateType) ? "datetime":othis.dateType;
        var that = options.element;
        if ($(that).find('input').length>0)return;
        othis.deleteAll(),othis.leaveStat = false;
        var input = $('<input class="layui-input layui-table-select-input" type="text" id="thisDate">');
        $(that).append(input),input.focus();
        //日期时间选择器
        laydate.render({
            elem: '#thisDate'
            ,type: othis.dateType
            ,show: true //直接显示
            ,done:function (value, date) {
                othis.deleteAll();
                if(othis.callback){
                    othis.callback({value:value,td:that});
                }
            }
        });

        $('div.layui-laydate').hover(
            function () {othis.leaveStat = false;},
            function () {othis.leaveStat = true;}
        );
        $(that).hover(
            function () {othis.leaveStat = false;},
            function () {othis.leaveStat = true;}
        );
        layui.stope();
    };

    //判断是否为空函数
    Class.prototype.isEmpty = function(dataStr){
        return typeof dataStr === 'undefined' || dataStr === null || dataStr.length <= 0;
    };

    //生成下拉框函数入口
    Class.prototype.register = function(options){
        var othis = this;
        othis.enabled = options.enabled,othis.callback = options.callback,othis.data = options.data,othis.element = options.element;
        var that = othis.element;
        if ($(that).find('input').length>0)return;
        othis.deleteAll(that);
        //鼠标离开单元格或下拉框div区域状态，默认不离开（false）
        othis.leaveStat = false;
        var input = $('<input class="layui-input layui-table-select-input" placeholder="关键字搜索">');
        var icon = $('<i class="layui-icon layui-table-select-edge" data-td-text="'+$(that).find("div.layui-table-cell").eq(0).text()+'" >&#xe625;</i>');
        othis.input = input,othis.icon = icon;
        $(that).append(input),$(that).append(icon),input.focus();
        var thisY = that.getBoundingClientRect().top; //单元格y坐标
        var thisX = that.getBoundingClientRect().left; //单元格x坐标
        var thisHeight = that.offsetHeight,thisWidth = that.offsetWidth //单元格宽度和高度
            ,clientHeight = document.documentElement['clientHeight'] //窗口高度
            ,scrollTop = document.documentElement['scrollTop'];//滚动条滚动高度
        var bottom = clientHeight-scrollTop-thisY+3; //div底部距离窗口底部长度
        var top = thisY+thisHeight+scrollTop+3; //div元素y坐标
        //当前y坐标大于窗口0.55倍的高度则往上延伸，否则往下延伸。
        var type = thisY+thisHeight > 0.55*clientHeight ?  'top:auto;bottom: '+bottom : 'bottom:auto;top:'+top;
        //下三角图标旋转180度成上三角图标
        thisY+thisHeight > 0.55*clientHeight ? $(icon).addClass("layui-edge-transform") : '';
        //获取下拉框div模板
        var html = othis.enabled ? htmlTpl.selectMoreTpl : htmlTpl.selectTpl;
        //生成下拉框
        $('body').append(laytpl(html).render({data: othis.data,style: {type: type,width: thisWidth,left: thisX}}));
        //事件注册
        othis.events();
    };

    //删除所有删除下拉框和时间选择框
    Class.prototype.deleteAll = function(td){
        var othis = this;
        //删除下拉框
        $('div.layui-table-body').find('td').each(function () {
            var icon = $(this).find('i.layui-table-select-edge');
            if(icon.length === 0)return;
            $(this).find('input.layui-table-select-input').remove(),icon = icon.eq(0);
            var text = icon.attr('data-td-text');
            $(this).find("div.layui-table-cell").eq(0).text(text),icon.remove();
        });
        //删除时间选择框
        $("#thisDate").next().remove(),$("#thisDate").remove();
        $("div.layui-laydate").remove(),$('div.layui-table-select-div').remove();
        //清除leaveStat（离开状态属性）
        delete othis.leaveStat;
    };

    //注册事件
    Class.prototype.events = function(){
        var othis = this;
        //给输入框注册值改变事件
        othis.input.bind('input propertychange', function(){
            var val = this.value;
            if(othis.enabled === true){
                if(othis.isEmpty(val)) return;
                var ul = $('div.layui-table-select-div').find('ul.ul-edit-data').eq(0),searchDDs = [];
                $(ul).find('li').each(function () {
                    var thisValue = $(this).data('value');
                    thisValue = othis.isEmpty(thisValue) ? "" : thisValue;
                    if(thisValue.indexOf(val) > -1){
                        var classText = $(this).attr("class");
                        var backgroundColor = classText.indexOf("li-checked") > -1 ? "background-color: #60b979" : '';
                        var searchHtml = [
                            '<li class="'+$(this).attr("class")+'" data-name="'+$(this).data('name')+'" data-value="'+thisValue+'">'
                               ,'<div class="define-edit-checkbox" lay-skin="primary">'
                                  ,'<span>'+thisValue+'</span>'
                                  ,'<i style="'+backgroundColor+'" class="layui-icon layui-icon-ok"></i>'
                               ,'</div>'
                            ,'</li>'].join('');
                        searchDDs.push(searchHtml),$(this).remove();
                    }
                });
                ul.prepend(searchDDs.join("")),liFunc();
            }else {
                var dl = $('div.layui-table-select-div').find('dl').eq(0);
                var html = othis.isEmpty(val) ? htmlTpl.ddTpl : htmlTpl.ddSearchTpl;
                dl.html("");
                dl.prepend(laytpl(html).render({data: othis.data,search: val})),ddFunc();
            }
        });
        //注册点击事件
        othis.icon.bind('click',function () {layui.stope(),othis.deleteAll();});

        //给dd元素注册点击事件(单选)
        var ddFunc = function () {
            var ddArr = $('div.layui-table-select-div').find('dd');
            ddArr.unbind('click'),ddArr.bind('click',function (e) {
                layui.stope(e),othis.deleteAll();
                if(othis.callback)othis.callback({select:{name:$(this).attr('lay-value'),value:$(this).text()},td:othis.element});
            });
        };
        ddFunc();

        //给li元素注册点击事件（多选）
        var liFunc = function(){
            var liArr = $('div.layui-table-select-div').find('li');
            liArr.unbind('click'),liArr.bind('click',function (e) {
                layui.stope(e);
                var icon = $(this).find("i"),liClass = $(this).attr("class");
                (liClass && liClass.indexOf("li-checked")) > -1 ? (icon.css("background-color","#fff"),$(this).removeClass("li-checked"))
                    : (icon.css("background-color","#60b979"),$(this).addClass("li-checked"));
            });
        };
        liFunc();

        //给下拉框和当前单元格（td）注册鼠标悬停事件
        $('div.layui-table-select-div').hover(
            function () {othis.leaveStat = false;},
            function () {othis.leaveStat = true;}
        );
        $(othis.element).hover(
            function () {othis.leaveStat = false;},
            function () {othis.leaveStat = true;}
        );

        //给“确定”按钮和“全选”按钮注册点击事件
        //“确定”按钮
        $('#confirmBtn').bind('click',function (e) {
            var dataList = new Array();
            $("div.layui-table-select-div").find("div li").each(function (e) {
                var liClass = $(this).attr("class");
                if(!liClass || liClass.indexOf("li-checked") <= -1)return;
                dataList.push({name:$(this).data("name"),value:$(this).data("value")});
            });
            othis.deleteAll();
            if(othis.callback)othis.callback({select:dataList,td:othis.element});
        });

        //“全选”按钮
        $('#selectAll').bind('click',function () {
            var btn = this,status = $(btn).attr('data-status');
            $('ul.ul-edit-data').find('li').each(function (e) {
                var icon = $(this).find("i");
                othis.isEmpty(status) || status === 'false'
                    ? (icon.css("background-color","#60b979"),$(this).addClass("li-checked"),$(btn).attr("data-status","true"))
                    : (icon.css("background-color","#fff"),$(this).removeClass("li-checked"),$(btn).attr("data-status","false"));
            });
        });
    };

    //更新单元格中的显示值
    Class.prototype.update = function (options) {$(options.element).find("div.layui-table-cell").eq(0).text(options.value);};

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
    layui.link(layui.cache.base + 'css/layuiTableColumnEdit.css'),exports('layuiTableColumnEdit', active);
});