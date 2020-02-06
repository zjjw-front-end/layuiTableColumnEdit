# layuiTableColumnSelect
&emsp;在layui table的基础上对表格列进行扩展：点击单元格显示可搜索下拉列表。

## 一、介绍
&emsp;&emsp;此项目是为了解决layui table表格单元格（column）点击事件中无下拉列表（select）功能的问题。
<br/>
&emsp;&emsp;a.可异步ajax请求后台数据。
<br/>
&emsp;&emsp;b.可直接以数组形式传参
<br/>
&emsp;&emsp;c.可输入关键字搜索下拉框数据

## 二、使用说明

### 1.使用方法
&emsp;下载module整个文件夹，放在你的项目里面，然后使用模块加载的方式使用：
```javascript
layui.config({
    base: 'module/'
}).extend({
        layuiTableColumnSelect:'js/layuiTableColumnSelect'
}).use(['table','layuiTableColumnSelect'], function () {
    var layuiTableColumnSelect= layui.layuiTableColumnSelect;
    
});
```

### 2.在layui table单元格中渲染下拉列表

```html
<table class="layui-hide" id="tableId" lay-filter="tableEvent"></table>
<script>
    layui.config({
        base: 'module/'
    }).extend({
        layuiTableColumnSelect:'js/layuiTableColumnSelect'
    }).use(['table','layuiTableColumnSelect','layer'], function () {
        var table = layui.table,layer = layui.layer;
        var layuiTableColumnSelect = layui.layuiTableColumnSelect;

        var selectParams = [
            {name:1,value:"张三1"},
            {name:2,value:"张三2"},
            {name:3,value:"张三3"},
            {name:4,value:"张三4"},
            {name:5,value:"张三5"}
        ];

        var rowData; //当前行数据

        table.render({
            elem: '#tableId'
            ,toolbar: '#toolbarDemo'
            ,id:'id'
            ,url:'tableData.json'
            ,height: 'full-90'
            ,page: true
            ,cols: [[
                {type:'checkbox'}
                ,{field:'name',title: 'table输入框',width:120,edit:'text'}
                ,{field:'age', title: 'table点击事件',width:120,event:'age',sort:'true'}
                ,{field:'state', title: 'ajax传参',width:120}
                ,{field:'test', title: '数组传参',width:120,sort:'true'}
            ]],
            done:function (res, curr, count) {
                layuiTableColumnSelect.render({
                    id:'#tableId',
                    field:'state',
                    url:'selectData.json',
                    where:{},
                    callback:function (obj) {
                        console.log(obj.select); //下拉选项数据
                        console.log(obj.td); //当前单元格（td）DOM元素
                        //把选择的数据更新到行数据中
                        rowData.update({state:parseInt(obj.select.name)});
                        //把选择的显示数据更新到单元格中显示
                        obj.update();
                    }
                });

                layuiTableColumnSelect.render({
                    id:'#tableId',
                    field:'test',
                    data:selectParams,
                    callback:function (obj) {
                        console.log(obj.select); //下拉选项数据
                        console.log(obj.td); //当前单元格（td）DOM元素
                        //把选择的数据更新到行数据中
                        rowData.update({test:parseInt(obj.select.name)});
                        //把选择的显示数据更新到单元格中显示
                        obj.update();
                    }
                });
            }
        });

        //解决前端页面排序出现的bug
        table.on('sort(tableEvent)', function(obj){
            layuiTableColumnSelect.reload("#tableId");//参数为表格id
        });

        //监听行单击事件（双击事件为：rowDouble）
        table.on('row(tableEvent)', function(obj){
            rowData = obj;
        });

        table.on('tool(tableEvent)',function (obj) {
            layer.msg("1111111");
        });

        table.on('edit(tableEvent)',function (obj) {
            layer.msg("edit");
        });

        //获取选中行事件
        table.on('toolbar(tableEvent)', function(obj){
            if(obj.event === 'getCheckData'){
                var checkStatus = table.checkStatus(obj.config.id);
                console.log(checkStatus.data)
            }
        });
    });
</script>
```

> 注意：<br>
> &emsp;&emsp;可以使用url传递数据，也可以使用data传递数据，如果使用url传递数据，参数是where字段为ajax后台请求参数。<br>
> &emsp;&emsp;表格绑定下拉框必须在表格异步加载数据完成后进行，否则绑定失败。

<br/>

&emsp;**数据格式**

&emsp;&emsp;data数据格式为name和value字段。
<br/>
&emsp;&emsp;数组形式传参时格式：
```json
[
    {name:1,value:"测试1"},
    {name:2,value:"测试2"},
    {name:3,value:"测试3"},
    {name:4,value:"测试4"},
    {name:5,value:"测试5"}
]
```

&emsp;&emsp;ajax请求后台时格式：
```json
{
    data:[
        {name:1,value:"测试1"},
        {name:2,value:"测试2"},
        {name:3,value:"测试3"},
        {name:4,value:"测试4"},
        {name:5,value:"测试5"}
    ]
}
```

### 3.参数说明
参数 | 类型 | 是否必填 | 描述 |
--- | --- | --- | ---
id | string | 是 | table表格的id值。
field | string | 是 | table表格中需要绑定下拉选择框的字段。
data | array | 否 | 数组形式传参，如果同时存在data和url，默认使用data。
url | string | 否 | ajax请求后台url，如果同时存在data和url，默认使用data。
where | object | 否 | ajax请求后台参数，与url参数配合使用。
parseData | function | 否 | 对ajax请求返回的数据在前端页面进行解析。
callback | function | 是 | 下拉框选择事件发生后的回调函数。

### 4.效果图
&emsp;&emsp;输入框效果图：<br/>
&emsp;&emsp;数组形式传参：<br/>
![数组图1](https://images.gitee.com/uploads/images/2019/1201/005920_6bd870bd_1588195.png "2.png")
<br/>
![数组图2](https://images.gitee.com/uploads/images/2019/1201/005950_d701b34f_1588195.png "3.png")
<br/>
![数组图3](https://images.gitee.com/uploads/images/2019/1201/010015_121379ce_1588195.png "4.png")