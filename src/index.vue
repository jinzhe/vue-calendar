<template>
    <div id="app">
        <input v-if="showtype!='inner'" type="text" :class="'dropinput '+extclass" @click="openByDrop($event)" :value="calendarinput.display" readonly>
        <!--下拉框-->
        <transition v-if="showtype=='drop'" name="fade">
            <div class="calendar-dropdown" :style="{'left':calendarinput.left+'px','top':calendarinput.top+'px'}" v-if="calendarinput.show">
                <calendar :range="calendarinput.range" :multi="calendarinput.multi" :zero="calendarinput.zero" :lunar="calendarinput.lunar" :value="calendarinput.value" :begin="calendarinput.begin" :end="calendarinput.end" @select="calendarinput.select"></calendar>
            </div>
        </transition>
        <!--弹出框-->
        <transition v-if="showtype=='dialog'" name="fade">
            <div class="calendar-dialog" v-if="calendarinput.show">
                <div class="calendar-dialog-mask" @click="closeByDialog"></div>
                <div class="calendar-dialog-body">
                    <calendar :range="calendarinput.range" :multi="calendarinput.multi" :zero="calendarinput.zero" :lunar="calendarinput.lunar" :value="calendarinput.value"  @select="calendarinput.select"></calendar>
                </div>
            </div>
        </transition>

        <!--单选/事件-->
        <calendar v-if="showtype=='inner'" :lunar="calendarinput.lunar" :value="calendarinput.value" :begin="calendarinput.begin" :end="calendarinput.end" @select="calendarinput.select" :weeks="calendarinput.weeks" :months="calendarinput.months"  :events="calendarinput.events" ></calendar>
        <!--多选/农历-->
        <!--<calendar :range="calendar2.range" :lunar="calendar2.lunar" :value="calendar2.value" :begin="calendar2.begin" :end="calendar2.end" @select="calendar2.select"></calendar>-->
    </div>
</template>

<script>

    import calendar from './calendar.vue'

    let nowdate = new Date();
    export default {
        name: 'calendarindex',
        props: {
            choosetype: {type: String, default: 'simple'}, //range（范围）,multi（多选）  //主要用来传递给 calendar.vue
            showtype: {type: String, default: 'drop'}, //drop（下拉）, dialog（弹框）, inner(直接在网页中) 主要用来 本文件的 展示样式选择
            extclass:{type: String,default:'form-control'},
            lunar:{type: Boolean,default:false},
            range:{type: Boolean,default:false},
            zero:{type: Boolean,default:false},
            show:{type: Boolean,default:false},
            begin:{type: String,default:''},
            end:{type: String,default:''},
            events:  {
                type: Object,
                default: function(){
                    return {}
                }
            },
            rangesplit:{type: String,default:' ~ '},
            datesplit:{type: String,default:'-'},
            display:{type:String,default:nowdate.getFullYear().toString()+this.datesplit+(nowdate.getMonth()+1).toString()+this.datesplit+nowdate.getDate().toString()},
            lang:{type: String,default:'zh_CN'} //目前只支持 这个支持就先不弄了
        },
        components: {
            calendar
        },
        data(){
            return {
                calendarinput:{
                    display:this.display,
                    show:this.show,
                    range:this.choosetype=='range'?true:false,
                    multi:this.choosetype=='multi'?true:false,
                    zero:this.zero,
                    value:this.getthisvalue(), //默认日期
                    lunar:this.lunar, //显示农历
                    select:(value,end)=>{
                        this.choosetype=='multi'?this.multiselect(value):(this.choosetype=='range'?this.rangeselect(value,end):this.simpleselect(value));
                        this.$emit("input",this.calendarinput.display)
                    }
                },
            }
        },
        mounted(){
            if(this.events.length>0){
                this.calendarinput.events=this.events;
            }
            if(this.begin.length>0){
                var nowdate=new Date(this.begin);
                this.calendarinput.begin=[nowdate.getFullYear(),nowdate.getMonth()+1,nowdate.getDate()];
            }
            if(this.end.length>0){
                var nowdate=new Date(this.end);
                this.calendarinput.end=[nowdate.getFullYear(),nowdate.getMonth()+1,nowdate.getDate()];
            }
        },
        methods:{
            getthisvalue(){
                var valuearr=this.display.replace(" ","").split(this.rangesplit.replace(" ",""));
                if (valuearr.length>1){
                    if(this.choosetype=='range'){
                        var nowdate=new Date(valuearr[0]);
                        return [nowdate.getFullYear(),nowdate.getMonth()+1,nowdate.getDate()];
                    }else{
                        var valuedata=[];
                        for(var i in valuearr){
                            var nowdate=new Date(valuearr[i]);
                            var valueone=[nowdate.getFullYear(),nowdate.getMonth()+1,nowdate.getDate()];
                            valuedata.push(valueone);
                        }
                        return valuedata;
                    }
                }else{
                    var nowdate=new Date(valuearr[0]);
                    if(this.choosetype=='simple') {
                        return [nowdate.getFullYear(), nowdate.getMonth() + 1, nowdate.getDate()];
                    }else if(this.choosetype=='multi'){
                        return [[nowdate.getFullYear(),nowdate.getMonth()+1,nowdate.getDate()]];
                    }else{
                        return [[nowdate.getFullYear(),nowdate.getMonth()+1,nowdate.getDate()],[nowdate.getFullYear(),nowdate.getMonth()+1,nowdate.getDate()]];
                    }
                }
            },
            simpleselect(value){
                this.calendarinput.show=false;
                this.calendarinput.value=value;
                this.calendarinput.display=value.join(this.datesplit);
            },
            rangeselect(begin,end){
                // this.calendarinput.show=false; //这个可以定义一个变量 来传值进来
                this.calendarinput.value=[begin,end];
                if(typeof(end)!='undefined'){
                    this.calendarinput.display=begin.join(this.datesplit)+this.rangesplit+end.join(this.datesplit);
                }else{
                    this.calendarinput.display=begin.join(this.datesplit);
                }
            },
            multiselect(value){
                // this.calendarinput.show=false;
                this.calendarinput.value=value;
                var display=[];
                for (var i = 0; i < value.length; i++) {
                    display.push(value[i].join(this.datesplit))
                }
                this.calendarinput.display=display.join(this.rangesplit);
            },
            getnowyear(){
                var nowdata=new Date(this.display);
                return nowdata.getFullYear();
            },
            getnowmonth(){
                var nowdata=new Date(this.display);
                return nowdata.getMonth()+1;
            },
            getnowdate(){
                var nowdata=new Date(this.display);
                return nowdata.getDate();
            },
            openByDrop(e){
                this.calendarinput.show=true;
                this.calendarinput.left=e.target.offsetLeft;
                this.calendarinput.top=e.target.offsetTop + e.target.offsetHeight; //这边可以再优化，如果在页面底部使用的时候 向上展开
                if(this.showtype!='simple'){
                    e.stopPropagation();
                    window.setTimeout(()=>{
                        document.addEventListener("click",(e)=>{
                            this.calendarinput.show=false;
                            document.removeEventListener("click",()=>{},false);
                        },false);
                    },1000)
                }
            },
            closeByDialog(){
                this.calendarinput.show=false;
            }
        }
    }
</script>

<style>
    /*demo*/
    .app{
        padding: 0;
        margin: 0;
    }
    .dropinput{
        box-sizing: border-box;
        background:url(data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBzdGFuZGFsb25lPSJubyI/PjwhRE9DVFlQRSBzdmcgUFVCTElDICItLy9XM0MvL0RURCBTVkcgMS4xLy9FTiIgImh0dHA6Ly93d3cudzMub3JnL0dyYXBoaWNzL1NWRy8xLjEvRFREL3N2ZzExLmR0ZCI+PHN2ZyB3aWR0aD0iMTYiIGhlaWdodD0iMTYiIHZpZXdCb3g9IjAgMCAxNiAxNiIgdmVyc2lvbj0iMS4xIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHhtbG5zOnhsaW5rPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rIj48ZGVmcz48c3R5bGUgdHlwZT0idGV4dC9jc3MiPjwhW0NEQVRBWwpAZm9udC1mYWNlIHsgZm9udC1mYW1pbHk6IGlmb250OyBzcmM6IHVybCgiLy9hdC5hbGljZG4uY29tL3QvZm9udF8xNDQyMzczODk2XzQ3NTQ0NTUuZW90PyNpZWZpeCIpIGZvcm1hdCgiZW1iZWRkZWQtb3BlbnR5cGUiKSwgdXJsKCIvL2F0LmFsaWNkbi5jb20vdC9mb250XzE0NDIzNzM4OTZfNDc1NDQ1NS53b2ZmIikgZm9ybWF0KCJ3b2ZmIiksIHVybCgiLy9hdC5hbGljZG4uY29tL3QvZm9udF8xNDQyMzczODk2XzQ3NTQ0NTUudHRmIikgZm9ybWF0KCJ0cnVldHlwZSIpLCB1cmwoIi8vYXQuYWxpY2RuLmNvbS90L2ZvbnRfMTQ0MjM3Mzg5Nl80NzU0NDU1LnN2ZyNpZm9udCIpIGZvcm1hdCgic3ZnIik7IH0KCl1dPjwvc3R5bGU+PC9kZWZzPjxnIGNsYXNzPSJ0cmFuc2Zvcm0tZ3JvdXAiPjxnIHRyYW5zZm9ybT0ic2NhbGUoMC4wMTU2MjUsIDAuMDE1NjI1KSI+PHBhdGggZD0iTTcxMS4zMDYyIDI5MC42OTcyYzI0LjI4MjEgMCA0NS4zNzY1LTE5LjcwNjkgNDUuMzc2NS00NC4wMzJWNDYuNTYwMjU1OTk5OTk5OTk1YzAtMjQuMzI1MS0yMS4wOTU0LTQ0LjA1MzUtNDUuMzc2NS00NC4wNTM1LTI0LjMwMjYgMC00My45ODggMTkuNzI4NC00My45ODggNDQuMDUzNXYyMDAuMTA0OTZDNjY3LjMxODMgMjcwLjk5MDMgNjg3LjAwMzYgMjkwLjY5NzIgNzExLjMwNjIgMjkwLjY5NzJ6TTYyMy40ODA4IDExMy40MjAzSDQwMC43NjQ5Mjh2NjYuNTEzOTJoMjIyLjcxNTkwNDAwMDAwMDAyVjExMy40MjAyODh6TTg4NC4wNTMgMTEzLjQyMDNoLTgyLjc3NDAxNnY2Ni4xNDUyOGg4NS45NDAyMjRjMjUuMjc4NSAwIDQ2LjYxMTUgMjEuMzc2IDQ2LjYxMTUgNDYuNjc3djE1My45Mjc2OEg5MC40Mzg2NTYwMDAwMDAwMXYtMTUzLjkyNzY4YzAtMjUuMyAyMS4zMzMtNDYuNjc3IDQ2LjYxMTUtNDYuNjc3aDg2LjUwMzQyNFYxMTMuNDIwMjg4aC04Mi42NDI5NDRjLTY0LjA4NiAwLTExNi41MDc2IDUyLjUwODctMTE2LjUwNzYgMTE2LjcwMzJ2Njc2LjgwMTUzNTk5OTk5OTljMCA2NC4xNzQxIDUwLjQ5MTQgMTE2LjY4MDcgMTE0LjU3NzQgMTE2LjY4MDdIODg0LjA1Mjk5MmM2NC4wNjI1IDAgMTE2LjUwNjYtNTIuNTA2NiAxMTYuNTA2Ni0xMTYuNjgwN1YyMzAuMTIzNTE5OTk5OTk5OThDMTAwMC41NTk2IDE2NS45MjkgOTQ4LjExNDQgMTEzLjQyMDMgODg0LjA1MyAxMTMuNDIwM3pNOTMzLjgyOTYgOTEwLjM1MTRjMCAyNS4zLTIxLjMzMyA0Ni42NzYtNDYuNjExNSA0Ni42NzZIMTM3LjA1MDExMTk5OTk5OTk4Yy0yNS4yNzg1IDAtNDYuNjExNS0yMS4zNzYtNDYuNjExNS00Ni42NzZWNDQ2LjQ0NTU2OEg5MzMuODI5NjMyVjkxMC4zNTEzNnpNMjY3LjEwODQgNjQ2LjE4MTljMzYuODc3MyAwIDY2Ljc1MjUtMjkuOTM5NyA2Ni43NTI1LTY2Ljg4MTUgMC0zNi45MjI0LTI5Ljg3NTItNjYuODYxMS02Ni43NTI1LTY2Ljg2MTEtMzYuODU0OCAwLTY2Ljc1MjUgMjkuOTM5Ny02Ni43NTI1IDY2Ljg2MTFDMjAwLjM1NTggNjE2LjI0MjIgMjMwLjI1MjUgNjQ2LjE4MTkgMjY3LjEwODQgNjQ2LjE4MTl6TTUxMS41NDg0IDY0Ni4xODE5YzM2Ljg1NTggMCA2Ni43NTI1LTI5LjkzOTcgNjYuNzUyNS02Ni44ODE1IDAtMzYuOTIyNC0yOS44OTU3LTY2Ljg2MTEtNjYuNzUyNS02Ni44NjExLTM2Ljg3NzMgMC02Ni43NTI1IDI5LjkzOTctNjYuNzUyNSA2Ni44NjExQzQ0NC43OTU5IDYxNi4yNDIyIDQ3NC42NzExIDY0Ni4xODE5IDUxMS41NDg0IDY0Ni4xODE5ek0yNjUuOTE2NCA4OTAuNzA5YzM2Ljg3NzMgMCA2Ni43NTE1LTI5LjkzOTcgNjYuNzUxNS02Ni44NjExIDAtMzYuOTQyOC0yOS44NzQyLTY2Ljg4MjYtNjYuNzUxNS02Ni44ODI2LTM2Ljg1NTggMC02Ni43NTI1IDI5LjkzOTctNjYuNzUyNSA2Ni44ODI2QzE5OS4xNjM5IDg2MC43NjkzIDIyOS4wNTk2IDg5MC43MDkgMjY1LjkxNjQgODkwLjcwOXpNNTExLjU0ODQgODkwLjcwOWMzNi44NTU4IDAgNjYuNzUyNS0yOS45Mzk3IDY2Ljc1MjUtNjYuODYxMSAwLTM2Ljk0MjgtMjkuODk1Ny02Ni44ODI2LTY2Ljc1MjUtNjYuODgyNi0zNi44NzczIDAtNjYuNzUyNSAyOS45Mzk3LTY2Ljc1MjUgNjYuODgyNkM0NDQuNzk1OSA4NjAuNzY5MyA0NzQuNjcxMSA4OTAuNzA5IDUxMS41NDg0IDg5MC43MDl6TTc1NS42NDEzIDY0Ni4xODE5YzM2Ljg1NjggMCA2Ni43NTM1LTI5LjkzOTcgNjYuNzUzNS02Ni44ODE1IDAtMzYuOTIyNC0yOS44OTY3LTY2Ljg2MTEtNjYuNzUzNS02Ni44NjExLTM2Ljg3NzMgMC02Ni43NTI1IDI5LjkzOTctNjYuNzUyNSA2Ni44NjExQzY4OC44ODk5IDYxNi4yNDIyIDcxOC43NjQgNjQ2LjE4MTkgNzU1LjY0MTMgNjQ2LjE4MTl6TTMxMS43MDM2IDI5MC42OTcyYzI0LjI4MTEgMCA0NS4zNzY1LTE5LjcwNjkgNDUuMzc2NS00NC4wMzJWNDYuNTYwMjU1OTk5OTk5OTk1YzAtMjQuMzI1MS0yMS4wOTQ0LTQ0LjA1MzUtNDUuMzc2NS00NC4wNTM1LTI0LjMwMTYgMC00My45ODkgMTkuNzI4NC00My45ODkgNDQuMDUzNXYyMDAuMTA0OTZDMjY3LjcxNDYgMjcwLjk5MDMgMjg3LjQwMiAyOTAuNjk3MiAzMTEuNzAzNiAyOTAuNjk3MnoiIGZpbGw9IiM1ZTdhODgiPjwvcGF0aD48L2c+PC9nPjwvc3ZnPg==) no-repeat 8px 7px;
        padding-left: 36px;
    }

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
