<template>
    <div @click="none"  @touchstart="none" class="calendar" v-show="show" :style="{'left':x+'px','top':y+'px'}" transition="calendar" transition-mode="out-in">
        <div class="calendar-tools">
            <i class="fa fa-angle-left float left" @click="prev"  @touchstart="prev"></i>
            <i class="fa fa-angle-right float right" @click="next"  @touchstart="next"></i>
            <div class="text center">{{current}}</div>
        </div>
        <table>
        <thead>
            <tr>
                <td v-for="week in weeks" class="week">{{week}}</td>
            </tr>
         </thead>
        <tr v-for="(k1,day) in days">
            <td 
            v-for="(k2,child) in day" 
            :class="{'today':child.today,'disabled':child.disabled}"
            @click="select(k1,k2,$event)" @touchstart="select(k1,k2,$event)">
            {{child.day}}
            </td>
        </tr>
        </table>
    </div>
</template>

<script>
module.exports = {
    props: {
        show: {
            type: Boolean,
            required: true,
            twoWay: true    
        },
        value: {
            type: String,
            required: true,
            twoWay: true    
        },
        x: {
            type: Number,
            required: true,
            twoWay: true    
        },
        y: {
            type: Number,
            required: true,
            twoWay: true    
        }, 
        begin: {
            type: String
        }, 
        end: {
            type: String 
        }
    },
    data:function(){
        return {
            year:0,
            month:0,
            day:0,
            days:[],
            today:[],
            current:'',
            sep:"/",
            weeks:['日', '一', '二', '三', '四', '五', '六'],
            months:['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12']
        }
    },
    ready:function(){
        var that=this;
        var now = new Date();
        if(that.value.indexOf("-")!=-1)that.sep="-";
        that.year = now.getFullYear();
        that.month = now.getMonth();
        that.day = now.getDate();
        that.render(that.year,that.month);
    },
    methods:{
        render:function(y,m){
            var that=this;
            var d = new Date(),
            firstDayOfMonth = new Date(y, m, 1).getDay(),//当月第一天
            lastDateOfMonth = new Date(y, m + 1, 0).getDate(),//当月最后一天
            lastDayOfLastMonth = m == 0 ? new Date(y - 1, 11, 0).getDate() : new Date(y, m, 0).getDate();//最后一月的最后一天
            that.current=y + ' / ' + that.months[m];


            var seletSplit=that.value.split(that.sep);
            var i,line=0,temp=[];
            for(i=1;i <= lastDateOfMonth;i++) {
                var dow = new Date(y, m, i).getDay();
                // 第一行
                if (dow == 0) {
                    temp[line]=[];
                }else if (i == 1) {
                    temp[line]=[];

                    var k = lastDayOfLastMonth - firstDayOfMonth + 1;
                    for (var j = 0; j < firstDayOfMonth; j++) {
                        temp[line].push({day:k,disabled:true});
                        k++;
                    }
                }
                // 当月渲染
                var chk = new Date();
                var chkY = chk.getFullYear();
                var chkM = chk.getMonth();
                // 选中当前input日期
                if(
                    parseInt(seletSplit[0])==that.year 
                    &&
                    parseInt(seletSplit[1])-1==that.month
                    &&
                    parseInt(seletSplit[2])==i
                    &&
                    (that.begin==""&&that.end=="")
                ){
                    temp[line].push({day:i,today:true});
                    that.today=[line,temp[line].length-1];
                // 当天
                }else if (chkY == that.year && chkM == that.month && i == that.day&&that.value=="") {
                    temp[line].push({day:i,today:true});
                    that.today=[line,temp[line].length-1];
                } else {//默认
                    // 1.判断begin和end的日期
                    var options={day:i,today:false};
                    if(that.begin!=""){
                        var beginSplit=that.begin.split(that.sep);
                        var beginDate=new Date(parseInt(beginSplit[0]),parseInt(beginSplit[1])-1,parseInt(beginSplit[2]));
                        var beginTime=Number(beginDate);
                        var thisDate=new Date(that.year,that.month,i);
                        var thisTime=Number(thisDate);
                        if(beginTime>thisTime)options.disabled=true;
                    }
                    if(that.end!=""){
                        var endSplit=that.end.split(that.sep);
                        var endDate=new Date(parseInt(endSplit[0]),parseInt(endSplit[1])-1,parseInt(endSplit[2]));
                        var endTime=Number(endDate);
                        var thisDate=new Date(that.year,that.month,i);
                        var thisTime=Number(thisDate);
                        if(endTime<thisTime)options.disabled=true;
                    }
                    temp[line].push(options);
                }
                // 最后一行
                if (dow == 6) {
                    line++;
                }else if (i == lastDateOfMonth) {
                    var k = 1;
                    for (dow; dow < 6; dow++) {
                        temp[line].push({day:k,disabled:true});
                        k++;
                    }
                }
            }

            that.days=temp;
        },
        prev:function(e){
            e.stopPropagation();
            var that=this;
            if (that.month == 0) {
                that.month = 11;
                that.year = that.year - 1;
            } else {
                that.month = that.month - 1;
            }
            that.render(that.year,that.month);
        },
        next:function(e){
            e.stopPropagation();
            var that=this;
            if (that.month == 11) {
                that.month = 0;
                that.year = that.year + 1;
            } else {
                that.month = that.month + 1;
            }
            that.render(that.year,that.month);
        },
        select:function(k1,k2,e){
            if(e!=undefined)e.stopPropagation();
            var that=this;
            // 取消上次选中
            if(that.today.length>0){
                that.days[that.today[0]][that.today[1]].today=false; 
            }
            
            // 设置当前选中天
            that.days[k1][k2].today=true;
            that.today=[k1,k2];
            that.value=that.year+that.sep+(that.month+1)+that.sep+that.days[k1][k2].day;
            that.show=false;
        },
        none:function(e){
            e.stopPropagation();
        }
    }
}
</script>
 
<style>
.calendar {
    width: 300px;
    padding: 10px;
    background: #fff;
    position: absolute;
    border: 1px solid #DEDEDE;
    border-radius: 2px;
    opacity:.95;
    transition: all .5s ease;
}
 
.calendar-enter, .calendar-leave {
    opacity: 0;
    transform: translate3d(0,-10px, 0);
}

.calendar:before {
    position: absolute;
    left:30px;
    top: -10px;
    content: "";
    border:5px solid rgba(0, 0, 0, 0);
    border-bottom-color: #DEDEDE;
}
.calendar:after {
    position: absolute;
    left:30px;
    top: -9px;
    content: "";
    border:5px solid rgba(0, 0, 0, 0);
    border-bottom-color: #fff;
}

.calendar-tools{
    height:32px;
    font-size: 20px;
    line-height: 32px;
    color:#5e7a88;
}
.calendar-tools>i{
    margin:0 16px;
    line-height: 32px;
    cursor: pointer;
    color:#707070;
}
.calendar-tools>i:hover{
    color:#5e7a88;
}
.calendar table {
  clear: both;
  width: 100%;
  border-collapse: collapse;
  color: #444444;
}
.calendar td {
  height: 40px;
  width: 14.28571429%;
  text-align: center;
  vertical-align: middle;
  font-size:14px;
  cursor: pointer;
  border-radius: 2px;
}
.calendar td:hover{
    background:#f3f8fa;
}
.calendar td.week{
  pointer-events:none !important;
  cursor: default !important;    
}
.calendar td.disabled {
  color: #c0c0c0;
  pointer-events:none !important;
  cursor: default !important;
}
.calendar td.today {
    
  background-color: #5e7a88;
  color: #fff;
  font-size:16px;
}
.calendar thead td {
  text-transform: uppercase;
}
</style>