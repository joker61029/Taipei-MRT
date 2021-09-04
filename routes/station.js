var express = require("express");
var router = express.Router();
var mysql = require('mysql');
const fetch = require("node-fetch");
const axios = require('axios');
const jsSHA = require('jssha');

module.exports = router ;
require('dotenv').config();

const getAuthorizationHeader = function() {
    var AppID = process.env['PTX_APP_ID'];
    var AppKey = process.env['PTX_APP_KEY'];
    var GMTString = new Date().toGMTString();
    var ShaObj = new jsSHA('SHA-1', 'TEXT');
    ShaObj.setHMACKey(AppKey, 'TEXT');
    ShaObj.update('x-date: ' + GMTString);
    var HMAC = ShaObj.getHMAC('B64');
    var Authorization = 'hmac username=\"' + AppID + '\", algorithm=\"hmac-sha1\", headers=\"x-date\", signature=\"' + HMAC + '\"';
	return { 'Authorization': Authorization, 'X-Date': GMTString}
}

Date.prototype.format = function(fmt) { 
    var o = { 
       "M+" : this.getMonth()+1,                 //月份 
       "d+" : this.getDate(),                    //日 
       "h+" : this.getHours(),                   //小时 
       "m+" : this.getMinutes(),                 //分 
       "s+" : this.getSeconds(),                 //秒 
       "q+" : Math.floor((this.getMonth()+3)/3), //季度 
       "S"  : this.getMilliseconds()             //毫秒 
   }; 
   if(/(y+)/.test(fmt)) {
           fmt=fmt.replace(RegExp.$1, (this.getFullYear()+"").substr(4 - RegExp.$1.length)); 
   }
    for(var k in o) {
       if(new RegExp("("+ k +")").test(fmt)){
            fmt = fmt.replace(RegExp.$1, (RegExp.$1.length==1) ? (o[k]) : (("00"+ o[k]).substr((""+ o[k]).length)));
        }
    }
   return fmt; 
}

var config =
{
    host: process.env['DB_HOST'],
    user: process.env['DB_user'],
    password: process.env['DB_PASSWORD'],
    database: process.env['DB_DATABASE'],
    port: 3306,
    ssl: true
};

const conn = new mysql.createConnection(config);


conn.connect(
    conn.on('error', function(err) {
        console.log("[mysql error]", err);
}));

router.route('/')
    .get(function(req, res){
        conn.query('SELECT * FROM `station`;', 
            function (err, results, fields) {
                res.json(results)
            });
})


router.route('/line')
    .get(function(req, res){
        conn.query('SELECT * FROM `line` ORDER BY `id`;',
            function (err, results, fields) {
                res.json(results)
            });
            
})

router.route('/time/:id')
    .get(function(req, res){
        let station_id = req.params.id;
        axios.get("https://ptx.transportdata.tw/MOTC/v2/Rail/Metro/StationTimeTable/TRTC?$filter=StationID%20eq%20'"+station_id+"'&$format=JSON", { 
        headers: getAuthorizationHeader(),
        }).then(function(response){
            let up_time = [];
            let down_time = [];
            let up_destination = "暫無資訊";
            let down_destination = "暫無資訊";
            let data = response.data;
            let length = data.length;
            for(let i=0; i<length; i++){
                let Timetables = data[i]["Timetables"]
                if(data[i]["Direction"]==1 && data[i]["ServiceDay"][week()]==true){
                    for(let j=0; j<Timetables.length; j++){
                        let time_check = prefer_time(Timetables[j]["ArrivalTime"])
                        if(time_check != false && time_check != null){
                            up_time.push(time_check);
                        }
                    }
                    up_destination = data[i]["DestinationStationName"]["Zh_tw"];
                }
                else if(data[i]["Direction"]==0 && data[i]["ServiceDay"][week()]==true){
                    for(let j=0; j<Timetables.length; j++){
                        let time_check = prefer_time(Timetables[j]["ArrivalTime"])
                        if(time_check != false && time_check != null){
                            down_time.push(time_check);
                        }
                    }
                    down_destination = data[i]["DestinationStationName"]["Zh_tw"];
                }
            }
            up_time.push("暫無發車")
            down_time.push("暫無發車")
            res.json([{"up_destination":up_destination, "up_least_time": up_time,"down_destination": down_destination, "down_least_time": down_time}]);
    })

});

router.route('/time/:id/:direction')
    .get(function(req, res){
        let station_id = req.params.id;
        let direction = req.params.direction;
        axios.get("https://ptx.transportdata.tw/MOTC/v2/Rail/Metro/StationTimeTable/TRTC?$filter=StationID%20eq%20'"+station_id+"'and%20Direction%20eq%20'"+direction+"'&$format=JSON", {
        headers: getAuthorizationHeader(),
        }).then(function(response){
            res.json(response.data);
    })
});


router.route('/:id')
    .get(function(req, res){
        let station_id = req.params.id;
        let id_data = []
        let name = ""
        
        conn.query('SELECT * FROM `station` WHERE `stationID` = ?;',[station_id],
            function (err, sta_results, fields) {
                let data = sta_results[0];
                name = data["stationName_TW"];
                conn.query('SELECT * FROM `facility` WHERE `stationName_TW` = ?;',[name],
                    function (err, fac_results, fields) {
                        id_data = [{"station": data, "facility": fac_results[0]}];
                        res.json(id_data);
                    });
            });

        
})

router.route('/line/:id')
    .get(function(req, res){
        let lineNum = req.params.id;
        conn.query('SELECT * FROM `station` WHERE `lineID` = ? ORDER BY `lineNum`;',[lineNum], 
            function (err, results, fields) {
                res.json(results)
            });
})

router.route('/line/:id/infor')
    .get(function(req, res){
        let lineNum = req.params.id;
        conn.query('SELECT * FROM `line` WHERE `lineID` = ? ;',[lineNum], 
            function (err, results, fields) {
                res.json(results)
            });
})

const Today = new Date();
const Today_time = Today.format("yyyy/MM/dd hh:mm");
function prefer_time(timetable){
    var starttime = Today_time; //設定開始時間格式 yyyy/mm/dd 00:00:00
    // var starttime = "2021/09/04 10:50"
    var endtime = Today.format("yyyy/MM/dd "+timetable); //設定結束時間格式
    var d1 = new Date(starttime);
    var d2 = new Date(endtime);
    if(Date.parse(starttime).valueOf() < Date.parse(endtime).valueOf()){
        let least_time = parseInt(d2 - d1) / 1000 / 60
        if(least_time < 30){
            return least_time;
        }
    } else{ return false; }
}


const week_list = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
function week(){
    var day = Today.getDay();
    return week_list[day];
}
