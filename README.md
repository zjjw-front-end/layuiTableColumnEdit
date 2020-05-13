# tableEdit
&emsp;ayui table edit编辑功能
<br/>
&emsp;不会使用请加qq：374506838

## 一、介绍
&emsp;&emsp; 基于aop编程思想对layui table工具条事件tool(lay-filter)进行封装而成的table单元格编辑器。
<br/>
支持编辑器类型：
<br/>
a.下拉框（单或多选）
<br/>
b.时间选择框
<br/>
c.单元格下拉框联动（下拉框联动下拉框、时间选择框联动下拉框）

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
&emsp; 测试页面tableEdit.html


### 2.方法说明
方法名 | 描述 |
---          | ----
aopObj       | 获取一个table的aop代理对象方法,一张表对应一个aop对象。
on           | 事件注册
callbackFn   | 事件回调

### 3.参数说明

#### aopObj
参数      | 类型      | 是否必填 | 描述 |
---       | ---       | ---      | -----
cols      | array     | 是       | table.render(options)中options的cols属性值（单元格信息）。

#### on
参数      | 类型    | 是否必填 | 描述 |
---       | ---     | ---      | ----
event     | string  | 是       | 事件名称
callback  | function| 是       | 事件回调方法


&emsp;**cols格式**

```json
 [[
   {"field":"name","title": "输入框","event":"name","config":{"type":"input"}}
   ,{"field":"danxuan", "title": "单选","event":"danxuan","config":{"type":"select","data":params,"cascadeSelectField":"name"}}
   ,{"field":"duoxuan", "title": "多选","event":"duoxuan","config":{"type":"select","data":params,"enabled":true}}
   ,{"field":"birthday", "title": "生日","event":"birthday","config":{"type":"date","dateType":"date"}}
 ]]
```

&emsp;**cols说明**

参数      | 类型      | 是否必填 | 描述 |
---       | ---       | ---      | -----
config    | object    | 是       | aop增强配置字段

&emsp;**select说明**

参数               | 类型      | 是否必填 | 描述 |
---                | ---       | ---      | -----
type               | string    | 是       | 输入框：input 下拉框：select 时间选择框：date
data               | array     | 是       | 下拉框数据
enabled            | boolean   | 否       | 多选：true，单选：false，默认单选。
dateType           | string    | 否       | 时间格式 date:yyyy-MM-dd,datetime:yyyy-MM-dd HH:ss:mm,time:HH:ss:mm
cascadeSelectField | string    | 否       | 联动下拉框配置字段

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

### 6.效果图
![效果图](https://images.gitee.com/uploads/images/2020/0508/123901_092d3f62_1588195.gif "tableEdit.gif")