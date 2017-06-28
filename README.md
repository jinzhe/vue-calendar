# Vue Calendar

> A calendar components for Vue.js.

![](http://ww1.sinaimg.cn/large/823603acgy1fh120p4bigg20b50c1wq4.gif)


### Live Demo
> http://jinzhe.github.io/vue-calendar/

### Getting Started

``` html
<template>
<div id="app">
    <div class="flex">
        <div>
            <span>弹出框</span>
            <input type="text" @click="openByDrop($event)" v-model="calendar3.display" readonly>
            <input type="text" @click="openByDialog" :value="calendar4.display" readonly>
        </div>

        <div>
            <span>单选/英文</span>
            <calendar :lunar="calendar1.lunar" :value="calendar1.value" :begin="calendar1.begin" :end="calendar1.end" :weeks="calendar1.weeks" :months="calendar1.months" @select="calendar1.select"></calendar>
        </div>

        <div>
            <span>多选/农历</span>
            <calendar :range="calendar2.range" :lunar="calendar2.lunar" :value="calendar2.value" :begin="calendar2.begin" :end="calendar2.end" @select="calendar2.select"></calendar>
        </div>
    </div>

    <transition name="fade">
    <div class="calendar-dropdown" :style="{'left':calendar3.left+'px','top':calendar3.top+'px'}" v-if="calendar3.show">
        <calendar :zero="calendar3.zero" :lunar="calendar3.lunar" :value="calendar3.value" :begin="calendar3.begin" :end="calendar3.end" @select="calendar3.select"></calendar>
    </div>
    </transition>

    <transition name="fade">
    <div class="calendar-dialog" v-if="calendar4.show">
        <div class="calendar-dialog-mask" @click="closeByDialog"></div>
        
        <div class="calendar-dialog-body">
            <calendar :range="calendar4.range" :zero="calendar4.zero" :lunar="calendar4.lunar" :value="calendar4.value"  @select="calendar4.select"></calendar>
        </div>
        
    </div>
    </transition>
</div>
</template>

<script>
 
import calendar from './calendar.vue'

export default {
    name: 'app',
    components: {
        calendar
    },
    data(){
        return {
            calendar1:{
                value:[2018,2,16], //默认日期
                // lunar:true, //显示农历
                weeks:['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
                months:['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
                select(value){
                    console.log(value.toString());
                }
            },
            calendar2:{
                range:true,
                value:[[2018,2,16],[2019,2,16]], //默认日期
                lunar:true, //显示农历
                begin:[2017,2,16], //可选开始日期
                end:[2019,2,16], //可选结束日期

                select(begin,end){
                    // console.log(begin.toString(),end.toString());
                }
            },
            calendar3:{
                display:"2018/02/16",
                show:false,
                zero:true,
                value:[2018,2,16], //默认日期
                lunar:true, //显示农历
                select:(value)=>{
                    this.calendar3.show=false;
                    this.calendar3.value=value;
                    this.calendar3.display=value.join("/");
                }
            },
            calendar4:{
                display:"2018/02/16 ~ 2019/02/16",
                show:false,
                range:true,
                zero:true,
                value:[[2018,2,16],[2019,2,16]], //默认日期
                lunar:true, //显示农历
                select:(begin,end)=>{
                    console.log(begin,end)
                    this.calendar4.show=false;
                    this.calendar4.value=[begin,end];
                    this.calendar4.display=begin.join("/")+" ~ "+end.join("/");
                }
            },
        }
    },
    methods:{
        openByDrop(e){
            this.calendar3.show=true;
            this.calendar3.left=e.target.offsetLeft+19;
            this.calendar3.top=e.target.offsetTop+70;
           
            e.stopPropagation();
            window.setTimeout(()=>{
                document.addEventListener("click",(e)=>{
                    this.calendar3.show=false;
                    document.removeEventListener("click",()=>{},false);
                },false);
            },1000)
        },
        openByDialog(){
            this.calendar4.show=true;
        },
        closeByDialog(){
            this.calendar4.show=false;
        }
    }
}
</script>

<style>

/*transition*/
.fade-enter-active,
.fade-leave-active {
    transition: all .5s ease-in-out;
}
.fade-enter,.fade-leave-active{
    opacity: 0;
    transform: translateY(-10px);

}

/*下拉框*/
.calendar-dropdown{
    background: #fff;
    position: absolute;
    left:0;
    top:0;
    padding:20px;
    border: 1px solid #eee;
    border-radius: 2px;
}
.calendar-dropdown:before {
    position: absolute;
    left:30px;
    top: -10px;
    content: "";
    border:5px solid rgba(0, 0, 0, 0);
    border-bottom-color: #DEDEDE;
}
.calendar-dropdown:after {
    position: absolute;
    left:30px;
    top: -9px;
    content: "";
    border:5px solid rgba(0, 0, 0, 0);
    border-bottom-color: #fff;
}

/*弹出框*/
.calendar-dialog{
    position: absolute;
    left:0;
    top:0;
    right:0;
    bottom:0;
}

.calendar-dialog-mask{
    background:rgba(255,255,255,.5);
    width:100%;
    height:100%;
}

.calendar-dialog-body{
    background: #fff;
    position: absolute;
    left:50%;
    top:50%;
    transform: translate(-50%,-50%);
    padding:20px;
    border: 1px solid #eee;
    border-radius: 2px;
}
</style>
```

### Features
- You can limit the start and end dates.
- Customize week and month headlines.
- Support show Chinese lunar calendar, Chinese festivals, international festivals
- Support for custom presentation.
- Support multiple choice

### Build Setup

``` bash
# install dependencies
npm install

# serve with hot reload at localhost:8080
npm run dev

# build for production with minification
npm run build
```