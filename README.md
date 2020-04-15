# layuiTableColumnEdit
&emsp;在layui table的基础上对表格列进行扩展：点击单元格显示可搜索下拉列表及日期时间选择器。
<br/>
&emsp;不会使用请加qq群：940796171

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
&emsp;&emsp;不会使用请加qq群：940796171

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

### 2.在layui table单元格中渲染下拉列表

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
                  var td = $(obj.tr).find("td[data-field='state']")[0];
                  $.getJSON('selectData.json',{},function (result) {
                      layuiTableColumnEdit.createSelect({
                          id:'#tableId',
                          data:result.data,
                          element:td,
                          //enabled:true,//true：开启多选，false：单选。默认为false
                          callback:function (obj1) {
                              console.log(obj1.select); //下拉选项数据
                              console.log(obj1.td); //当前单元格（td）DOM元素
                              obj.update({age: parseInt(obj1.select.name)});
                              //把选择的显示数据更新到单元格中显示
                              layuiTableColumnEdit.update({element:td,value:obj1.select.value});
                          }
                      });
                  });
              }else if(obj.event === 'test'){
                  var testTd = $(obj.tr).find("td[data-field='test']")[0];
                  layuiTableColumnEdit.createSelect({
                      id: '#tableId',
                      element: this,
                      data: selectParams,
                      callback: function (obj2) {
                          console.log(obj2.select); //下拉选项数据
                          console.log(obj2.td); //当前单元格（td）DOM元素
                          //把选择的数据更新到行数据中
                          obj.update({test: parseInt(obj2.select.name)});
                          //把选择的显示数据更新到单元格中显示
                          layuiTableColumnEdit.update({element:testTd,value:obj2.select.value});
                      }
                  });
              }
          });
      });
</script>
```


<br/>

&emsp;**数据格式**

```json
[
    {name:1,value:"测试1"},
    {name:2,value:"测试2"},
    {name:3,value:"测试3"},
    {name:4,value:"测试4"},
    {name:5,value:"测试5"}
]
```

### 3.参数说明
参数 | 类型 | 是否必填 | 描述 |
--- | --- | --- | ---
id | string | 是 | table表格的id值。
data | array | 是 | 数组。
element | DOM元素 | 是 | 该参数必须为原生的DOM元素对象，不能为jquery元素对象。
callback | function | 是 | 事件发生后的回调函数。
enabled | boolean | 否 | 下拉框参数。多选（true），单选（false），默认为false。
dateType | string | 否 | 日期时间选择器的类型：datetime（日期时间）、date（日期）和time（时间），默认datetime。

> 注意：<br>
> &emsp;&emsp;带"（select）"字样的为下拉选择框参数。<br>

### 4.效果图
&emsp;&emsp;输入框效果图：<br/>
&emsp;&emsp;数组形式传参：<br/>
![数组图1](https://images.gitee.com/uploads/images/2019/1201/005920_6bd870bd_1588195.png "2.png")
<br/>
![数组图2](https://images.gitee.com/uploads/images/2019/1201/005950_d701b34f_1588195.png "3.png")
<br/>
![数组图3](https://images.gitee.com/uploads/images/2019/1201/010015_121379ce_1588195.png "4.png")
<br/>
![日期时间选择器](https://images.gitee.com/uploads/images/2020/0309/222505_589db2d6_1588195.png "123333.png")