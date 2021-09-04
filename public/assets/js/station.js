const content = document.getElementById("content");
const mrt_card = document.createElement("div");
const time_item = document.getElementById("item-1-1");
const time_up_01 = document.getElementById("time_up_01");
const time_up_02 = document.getElementById("time_up_02");
const time_down_01 = document.getElementById("time_down_01");
const time_down_02 = document.getElementById("time_down_02");
const facility = document.getElementById("station_facility");
const facility_nav = document.getElementById("item-1-1-tab");
mrt_card.className = "stations_body"
content.appendChild(mrt_card);

let line_src = "/api/station/line"
fetch(line_src).then(function(response){
    return response.json();
}).then(function(result){
    for(let i=0; i<result.length; i++){
        line_name = result[i]["lineID"];
        let line_col = document.createElement("div");
        let name = document.createElement("h3");
        name.textContent = result[i]["lineName_TW"];
        name.className = "station_title";
        setAttributes(line_col, {"id":"col_"+line_name, "class":"stations_col row row-cols-3 row-cols-md-5 g-4"});
        mrt_card.appendChild(name);
        mrt_card.appendChild(line_col);
        line_start(line_name);
    }

})

function line_start(line_name){
    let src = "/api/station/line/"+line_name;
    fetch(src).then(function(response){
        return response.json();
    }).then(function(result){
        for(let i=0; i<result.length; i++){
            data = result[i];
            let id = data["stationID"];
            let name_TW = data["stationName_TW"];
            let name_EN = data["stationName_EN"];
            let address = data["stationAddress"];
            let color = data["lineColor"];
            station_line(id, name_TW, name_EN, address, color, line_name);    
        }
    })
}


function station_line(id, name_TW, name_EN, address, color, line_name){
    let col = document.getElementById("col_"+line_name);
    let card_col = document.createElement("div");
    let card = document.createElement("div");
    let card_body = document.createElement("div");
    let h5 = document.createElement("h5");
    let p =document.createElement("p");
    let time_up = document.createElement("div");
    let time_down = document.createElement("div");
    
    let card_footer = document.createElement("div");
    let btn_row = document.createElement("div");
    let btn_src = document.createElement("button");
    let btn_love = document.createElement("input");
    let btn_love_label = document.createElement("label");
    // let love_img = document.createElement("img");
    fetch("/api/station/time/"+id).then(function(response){
        return response.json()
    }).then(function(result){
        let data = result[0];
        time_up.textContent = "暫無發車";
        time_down.textContent = "暫無發車";
        if(data["up_least_time"][0] != "暫無發車"){
            time_up.textContent = "往 "+data["up_destination"]+" 剩餘"+data["up_least_time"][0]+"分鐘";
        }
        if(data["down_least_time"][0] != "暫無發車"){
            time_down.textContent = "往 "+data["down_destination"]+" 剩餘"+data["down_least_time"][0]+"分鐘";
        }
    })
    card_col.className = "col-6 col-sm-4";
    card.className = "card h-100";
    card_body.className = "card-body";
    h5.className = "card-title";
    p.className = "card-text";
    btn_src.textContent = "詳細資訊";
    btn_love_label.textContent = "我的最愛";
    // love_img.className = "myfavorite";
    // setAttributes(love_img, {"src": "/assets/img/heart.png", "class":"myfavorite"});
    setAttributes(btn_row, {"style": "display: grid;"})
    setAttributes(btn_love, {"type":"checkbox" ,"class" :"btn-check", "id":"love_"+id, "autocomplete": "off"})
    setAttributes(btn_love_label, {"class":"btn btn-outline-danger", "for":"love_"+id})
    setAttributes(btn_src, {"value":id, "onclick":"btn_station_infor(this);", "class":"btn btn-primary ", "type":"button", "data-bs-toggle":"modal", "data-bs-target":"#exampleModal"})
    setAttributes(card_footer, {"class":"card-footer", "style":"background-color:"+color})
    setAttributes(time_up, {"style": "color: white; font-size: 14px;"})
    setAttributes(time_down, {"style": "color: white; font-size: 14px;"})
    h5.textContent = "捷運"+name_TW+"站 "+name_EN;
    card_col.appendChild(card);
    card.appendChild(card_body);
    card.appendChild(card_footer);
    // btn_love_label.appendChild(love_img);
    card_body.appendChild(h5);
    card_body.appendChild(p);
    card_body.appendChild(btn_row);
    btn_row.appendChild(btn_love);
    btn_row.appendChild(btn_love_label);
    btn_row.appendChild(btn_src);
    card_footer.appendChild(time_up);
    card_footer.appendChild(time_down);
    col.appendChild(card_col);
}

function btn_onclick(btn){
    for(let i=0; i<line_id.length; i++){
        let none_line = document.getElementById("col_"+line_id[i]);
        if(line_id[i] != btn.value){
            none_line.className = "col col-1";
        }
        else{
            none_line.className = "col col-7";
        }
    }
}

function btn_station_infor(id){
    fetch("/api/station/time/"+id.value).then(function(response){
        return response.json()
    }).then(function(result){
        let data = result[0];
        time_up_01.textContent = "暫無發車";
        time_up_02.textContent = "暫無發車";
        time_down_01.textContent = "暫無發車";
        time_down_02.textContent = "暫無發車";
        if(data["up_least_time"][0] != "暫無發車"){
            time_up_01.textContent = "往 "+data["up_destination"]+" 剩餘"+data["up_least_time"][0]+"分鐘";
        }
        if(data["down_least_time"][0] != "暫無發車"){
            time_down_01.textContent = "往 "+data["down_destination"]+" 剩餘"+data["down_least_time"][0]+"分鐘";
        }
        if(data["up_least_time"][1] != "暫無發車" && data["up_least_time"][1] != null){
            time_up_02.textContent = "下一班往 "+data["up_destination"]+" 剩餘"+data["up_least_time"][1]+"分鐘";
        }
        if(data["down_least_time"][1] != "暫無發車" && data["down_least_time"][1] != null){
            time_down_02.textContent = "下一班往 "+data["down_destination"]+" 剩餘"+data["down_least_time"][1]+"分鐘";
        }
    })
    let time_up = document.getElementById("item-1-1");
    facility_nav.click();
    time_up.click();
    let modal_title = document.getElementById("exampleModalLabel");
    // let address = document.getElementById("station_address");
    let spinner = document.getElementsByTagName("spinner");
    modal_title.textContent = "";
    // address.textContent = "";
    let src = "/api/station/"+id.value;
    fetch(src).then(function(response){
        return response.json();
    }).then(function(result){
        let data_station = result[0]["station"];
        let data_facility = result[0]["facility"];
        let name = data_station["stationName_TW"];
        let elevator = "電梯："+data_facility["elevator"];
        let escalator = "電扶梯："+data_facility["escalator"];
        let atm = "ATM："+data_facility["atm"];
        let nursing = "哺乳室："+data_facility["nursing"];
        let drinking = "飲水機："+data_facility["drinking"];
        let charging = "充電站："+data_facility["charging"];
        let ticket = "自動售票："+data_facility["ticket"];
        let wc = "洗手間："+data_facility["wc"];
        let facility_infor = [elevator, escalator, atm, nursing, drinking, charging, ticket, wc];
        facility.textContent = "";
        modal_title.textContent = "捷運"+name+"站";
        // address.textContent = "地址："+data_station["stationAddress"];
        for(let i=0; i<facility_infor.length; i++){
            let now_data = document.createElement("p");
            now_data.textContent = facility_infor[i];
            facility.appendChild(now_data)
        }
        for (spin of spinner){
            spin.style.display="none";
        }
    })
    for (let spin of spinner){
        spin.style.display="block";
    }
    
}


function setAttributes(el, attrs) {
    for(var key in attrs) {
      el.setAttribute(key, attrs[key]);
    }
}
