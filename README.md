# layuiTableColumnEdit
&emsp;在layui table的基础上对表格列进行扩展：点击单元格显示可搜索下拉列表及日期时间选择器。
<br/>
&emsp;不会使用请加qq：374506838

## 一、介绍
&emsp;&emsp;此项目是为了解决layui table表格单元格（column）点击事件中无下拉列表（select）及日期时间选择器功能的问题。
<br/>
&emsp;&emsp;a.可异步ajax请求后台数据。
<br/>
&emsp;&emsp;b.可直接以数组形式传参
<br/>
&emsp;&emsp;c.可输入关键字搜索下拉框数据
<br/>
&emsp;&emsp;d.可加入日期时间选择器
<br/>
&emsp;&emsp;e.下拉框支持多选
<br/>
&emsp;&emsp;f.下拉框支持单选或多选级联操作
<br/>
&emsp;&emsp;不会使用请加qq：374506838

## 二、使用说明

### 1.使用方法
&emsp;下载module整个文件夹，放在你的项目里面，然后使用模块加载的方式使用：
```javascript
layui.config({
    base: 'module/'
}).extend({
        layuiTableColumnEdit:'js/layuiTableColumnEdit'
}).use(['table','layuiTableColumnEdit'], function () {
    var layuiTableColumnEdit= layui.layuiTableColumnEdit;
    
});
```

### 2.整合layui使用

注意：整合layui使用时，必须使用本项目的table.js和layui.css，否则不能使用！

```html
<table class="layui-hide" id="tableId" lay-filter="tableEvent"></table>
<script>
       layui.use(['table','layer'], function () {
           var table = layui.table;
           var selectParams = [
               {name:1,value:"张三1"},
               {name:2,value:"张三2"},
               {name:3,value:"张三3"},
               {name:4,value:"张三4"},
               {name:5,value:"张三5"}
           ];
           table.render({
               elem: '#tableId'
               ,id:'id'
               ,url:'data.json'
               ,height: 'full-90'
               ,page: true
               ,cols: [[
                   {type:'checkbox'}
                   ,{field:'name',title: '姓名',width:120}
                   ,{field:'danxuan', title: '单选',width:120,edit:'select',data:selectParams}
                   ,{field:'duoxuan', title: '多选',width:120,edit:'select',data:selectParams,enabled:true} //enabled（单、多选开关） true：多选，false：单选。默认为false
                   ,{field:'birthday', title: '生日',width:120,edit:'date',dateType:'date'}
               ]]
           });
           table.on('edit(tableEvent)', function(obj){
               var value = obj.value //得到修改后的值
                   ,data = obj.data //得到所在行所有键值
                   ,field = obj.field; //得到字段
               console.log(value);
               if(field === 'danxuan'){
                   obj.update({danxuan:value.value});
               }
   
               if(field === 'duoxuan'){
                   obj.update({duoxuan:'多选'});
               }
   
               if(field === 'birthday'){
                   obj.update({birthday:value});
               }
           });
       });
</script>
```
### 3.单独使用

```html
<table class="layui-hide" id="tableId" lay-filter="tableEvent"></table>
<script>
      layui.config({
          base: 'module/'
      }).extend({
          layuiTableColumnEdit:'js/layuiTableColumnEdit'
      }).use(['table','layuiTableColumnEdit','layer'], function () {
          var table = layui.table,layer = layui.layer;
          var layuiTableColumnEdit = layui.layuiTableColumnEdit;
          var $ = layui.$;
          var selectParams = [
              {name:1,value:"张三1"},
              {name:2,value:"张三2"},
              {name:3,value:"张三3"},
              {name:4,value:"张三4"},
              {name:5,value:"张三5"}
          ];
          table.render({
              elem: '#tableId'
              ,id:'id'
              ,url:'tableData.json'
              ,height: 'full-90'
              ,page: true
              ,cols: [[
                  {type:'checkbox'}
                  ,{field:'name',title: 'table输入框',width:120}
                  ,{field:'age', title: 'table点击事件',width:120,sort:'true'}
                  ,{field:'state', title: 'ajax传参',width:120,event:'state'}
                  ,{field:'test', title: '数组传参',width:120,event:'test',sort:'true'}
              ]],
              done:function (res, curr, count) {
              }
          });
          table.on('tool(tableEvent)', function(obj){
              if(obj.event === 'state'){
                  //td必须为原生的DOM元素对象，不能为jquery元素对象。
                  var td = $(obj.tr).find("td[data-field='state']")[0];
                  $.getJSON('selectData.json',{},function (result) {
                      layuiTableColumnEdit.createSelect({
                          data:result.data,
                          element:td,
                          //enabled:true,//true：开启多选，false：单选。默认为false
                          callback:function (obj1) {
                              console.log(obj1.select); //下拉选项数据
                              console.log(obj1.td); //当前单元格（td）DOM元素
                              //把obj1.select中的name属性对应的值更新到行数据中。
                              obj.update({age: parseInt(obj1.select.name)});
                              //把选择的显示数据更新到单元格中显示
                              layuiTableColumnEdit.update({element:td,value:obj1.select.value});
                          }
                      });
                  });
              }
          });
      });
</script>
```

### 3.方法说明
方法名 | 描述 |
---          | ----
createSelect | 动态生成下拉框
createDate   | 动态生成时间日期选择框
update       | 更新单元格显示数据 注意：只更新显示的值，不更新所对应的行的值。

### 4.参数说明
#### createSelect
参数 | 类型 | 是否必填 | 描述 |
--- | --- | --- | ----
data      | array | 是 | 下拉数据。格式见（data格式）说明。
element   | DOM元素 | 是 | 单元格（td）元素，该参数必须为原生的DOM元素对象，不能为<br/>jquery元素对象。
callback  | function | 是 | 事件发生后的回调函数。
enabled   | boolean | 否 | 多选（true），单选（false），默认为false。

&emsp;**data格式**

```json
[
    {name:1,value:"测试1"},
    {name:2,value:"测试2"},
    {name:3,value:"测试3"},
    {name:4,value:"测试4"},
    {name:5,value:"测试5"}
]
```

#### createDate
参数 | 类型 | 是否必填 | 描述 |
--- | --- | --- | ----
element   | DOM元素 | 是 | 单元格（td）元素，该参数必须为原生的DOM元素对象，不能为<br/>jquery元素对象。
callback  | function | 是 | 事件发生后的回调函数。
dateType  | string | 否 | 日期时间选择器的类型：datetime（日期时间）、date（日期）<br/>和time（时间），默认datetime。

#### update
参数 | 类型 | 是否必填 | 描述 |
--- | --- | --- | ----
element   | DOM元素 | 是 | 单元格（td）元素，该参数必须为原生的DOM元素对象，不能为<br/>jquery元素对象。
value  | string | 是 | 单元格（td）的显示值。

### 5.效果图
&emsp;&emsp;输入框效果图：<br/>
&emsp;&emsp;数组形式传参：<br/>
![数组图1](https://images.gitee.com/uploads/images/2019/1201/005920_6bd870bd_1588195.png "2.png")
<br/>
![数组图2](https://images.gitee.com/uploads/images/2019/1201/005950_d701b34f_1588195.png "3.png")
<br/>
![数组图3](https://images.gitee.com/uploads/images/2019/1201/010015_121379ce_1588195.png "4.png")
<br/>
![日期时间选择器](https://images.gitee.com/uploads/images/2020/0309/222505_589db2d6_1588195.png "123333.png")