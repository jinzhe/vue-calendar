# vue-calendar

基于vuejs+webpack环境使用的日期选择插件,QQ讨论群: 240319632。

* 支持`单选`和`多选`日期
* 支持限定`开始`和`结束`日期范围选择。
* 支持小时分钟
* 需要引入`fontawesome.io` 的图标库。


![](http://ww1.sinaimg.cn/large/823603acgw1ez1n57t8jug20d40acwjw.gif)

![](http://ww3.sinaimg.cn/large/823603acgw1ez8ks5cudrg20in0badzn.gif)


# Options
* :show    是否显示
* :type    date|datetime
* :value	默认值
* :begin  可选开始时间
* :end    可选结束时间
* :x      显示x坐标
* :y      显示y坐标
* :range  是否多选

# test.vue

```
<template>
	<input type="text" @click="showCalendar" v-model="value" placeholder="请输入日期">
	<calendar :show.sync="show" :value.sync="value" :x="x" :y="y" :begin="begin" :end="end" :range="range"></calendar>
</template>

<script>
module.exports = {
    data: function() {
        return {
            show:false,
            type:"date", //date datetime
            value:"2015-12-11",
            begin:"2015-12-20",
            end:"2015-12-25",
            x:0,
            y:0,
            range:true,//是否多选
        }
    },
    methods:{
        showCalendar:function(e){
            e.stopPropagation();
            var that=this;
            that.show=true;
            that.x=e.target.offsetLeft;
            that.y=e.target.offsetTop+e.target.offsetHeight+8;
            var bindHide=function(e){
                e.stopPropagation();
                that.show=false;
                document.removeEventListener('click',bindHide,false);
            };
            setTimeout(function(){
                document.addEventListener('click',bindHide,false);
            },500);
        }
    },
    components:{
        calendar: require('./calendar.vue')
    }
}
</script>
```
