# tableEdit
&emsp;在layui table的基础上对表格列进行扩展：点击单元格显示可搜索下拉列表及日期时间选择器。
<br/>
&emsp;不会使用请加qq：374506838

## 一、介绍
&emsp;&emsp;此项目是为了解决layui table表格单元格（column）点击事件中无下拉列表（select）及日期时间选择器功能的问题。
<br/>
&emsp;&emsp;a.可异步ajax请求后台数据。
&emsp;&emsp;b.可直接以数组形式传参
&emsp;&emsp;c.可输入关键字搜索下拉框数据
<br/>
&emsp;&emsp;d.可加入日期时间选择器
&emsp;&emsp;e.下拉框支持单选或多选
&emsp;&emsp;f.下拉框支持级联操作

## 二、使用说明

### 1.使用方法
&emsp; 把tableEdit.js放在你的项目里面，然后使用模块加载的方式使用：

```javascript
layui.config({
    base: 'module/'
}).extend({
        tableEdit:'js/tableEdit'
}).use(['table','tableEdit'], function () {
    var tableEdit= layui.tableEdit;
    
});
```

### 2.aop代理整合应用

&emsp;&emsp; aop代理整合应用.html（含下拉级联操作）

### 3.单独使用

&emsp;&emsp; 单独使用.html

### 4.方法说明
方法名 | 描述 |
---          | ----
createSelect | 动态生成下拉框
createDate   | 动态生成时间日期选择框
update       | 更新单元格显示数据 注意：只更新显示的值，不更新所对应的行的值。
aopObj       | aop代理整合应用，使用此方法获取table的aop代理对象
on           | 事件注册
onCallback   | 事件回调

### 5.参数说明
#### createSelect
参数      | 类型    | 是否必填 | 描述 |
---       | ---     | ---      | ----
data      | array   | 是       | 下拉数据。格式见（data格式）说明。
element   | DOM元素 | 是       | 单元格（td）元素，该参数必须为原生的DOM元素对象，不能为<br/>jquery元素对象。
callback  | function| 是       | 事件发生后的回调函数。
enabled   | boolean | 否       | 多选（true），单选（false），默认为false。

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
参数      | 类型      | 是否必填 | 描述 |
---       | ---       | ---      | ----
element   | DOM元素   | 是       | 单元格（td）元素，该参数必须为原生的DOM元素对象，不能为<br/>jquery元素对象。
callback  | function  | 是       | 事件发生后的回调函数。
dateType  | string    | 否       | 日期时间选择器的类型：datetime（日期时间）、date（日期）<br/>和time（时间），默认datetime。

#### update
参数      | 类型    | 是否必填 | 描述 |
---       | ---     | ---      | ----
element   | DOM元素 | 是       | 单元格（td）元素，该参数必须为原生的DOM元素对象，不能为<br/>jquery元素对象。
value     | string  | 是       | 单元格（td）的显示值。

#### aopObj
参数      | 类型      | 是否必填 | 描述 |
---       | ---       | ---      | ----
cols      | array     | 是       | 单元格列信息(如下所示)

&emsp;**cols格式**

```json
 [[
   {"field":"danxuan", "title": "单选","width":120,"event":"danxuan","select":{"data":params,"cascadeSelectField":"name"}}
   ,{"field":"duoxuan", "title": "多选","width":120,"event":"duoxuan","select":{"data":params,"enabled":true}}
   ,{"field":"birthday", "title": "生日","width":120,"event":"birthday","date":{"dateType":"date"}}
 ]]
```

#### on
参数      | 类型    | 是否必填 | 描述 |
---       | ---     | ---      | ----
event     | string  | 是       | 事件名称
callback  | function| 是       | 事件回调方法

#### onCallback
参数      | 类型    | 是否必填 | 描述 |
---       | ---     | ---      | ----
event     | string  | 是       | 事件名称
params    | obj     | 否       | 事件回调方法的参数

### 6.效果图
![效果图](https://images.gitee.com/uploads/images/2020/0508/123901_092d3f62_1588195.gif "tableEdit.gif")