const content = document.getElementById("content");
const mrt_card = document.createElement("div");
const line_id = [];
const facility = document.getElementById("station_facility");
const facility_nav = document.getElementById("item-1-1-tab");
content.appendChild(mrt_card);



let line_src = "/api/station/line"
fetch(line_src).then(function(response){
    return response.json();
}).then(function(result){
    for(let i=0; i<result.length; i++){
        line_name = result[i]["lineID"];
        // line_id[i] = line_name;
        let line_col = document.createElement("div");
        // let section = document.createElement("section");
        setAttributes(line_col, {"id":"col_"+line_name, "class":"row row-cols-3 row-cols-md-5 g-4"});
        mrt_card.appendChild(line_col);
        // setAttributes(section, { "id":"line_"+line_name,"class":"time-line"});
        // col.appendChild(section);
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
            // let line_num = data["lineNum"];
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
    setAttributes(card_footer, {"class":"card-footer", "style":"background-color:"+color})
    setAttributes(time_up, {"style": "color: white; font-size: 14px;"})
    setAttributes(time_down, {"style": "color: white; font-size: 14px;"})

    h5.textContent = "捷運"+name_TW+"站 "+name_EN;

    card_col.appendChild(card);
    card.appendChild(card_body);
    card.appendChild(card_footer);
    card_body.appendChild(h5);
    card_body.appendChild(p);
    card_footer.appendChild(time_up);
    card_footer.appendChild(time_down);
    col.appendChild(card_col);

    // let div_tag = document.createElement("div");
    // let button = document.createElement("button");
    // let div_btn = document.createElement("time");
    // let div_station = document.createElement("div");
    // let div_content = document.createElement("div");
    // let div_text = document.createElement("div");
    
    // let btn_src = document.createElement("button");
    
    // div_tag.className = "time-tag";
    // setAttributes(button, {"style":"background-color: "+color+"; border: 1px "+color+" solid;", "value": line_name ,"class":"btn btn-primary time-line-icon", "data-bs-hover-animate":"pulse", "type":"button", "onclick":"btn_onclick(this);","data-bs-toggle":"collapse", "data-bs-target":"#"+id, "aria-expanded":"false", "aria-controls":id})
    // setAttributes(div_station, {"id":id , "class":"time-line-content collapse"})
    // div_content.className = "time-line-content-inter card card-body"
    // div_text.className = "time-photo-list";
    // div_btn.textContent = id+" "+name_TW;
    // p.textContent = address;
    // btn_src.textContent = "詳細資訊";
    // setAttributes(btn_src, {"value":id, "onclick":"btn_station_infor(this);", "class":"btn btn-primary ", "type":"button", "data-bs-toggle":"modal", "data-bs-target":"#exampleModal"})
    // article.appendChild(div_tag);
    // div_tag.appendChild(button);
    // div_tag.appendChild(div_btn);
    // div_station.appendChild(div_content);
    // div_station.appendChild(p);
    // div_station.appendChild(div_text);
    // div_content.appendChild(h1);
    // div_content.appendChild(p);
    // div_content.appendChild(btn_src);
    // article.appendChild(div_station);
    // col.appendChild(article);
}

function btn_onclick(btn){
    for(let i=0; i<line_id.length; i++){
        let none_line = document.getElementById("col_"+line_id[i]);
        if(line_id[i] != btn.value){
            none_line.className = "col col-1";
            // none_line.style.display="none";
        }
        else{
            none_line.className = "col col-7";
        }
    }
}

function btn_station_time(id, direction){
    let src = "/api/station/time/"+id+"/"+direction;
    fetch(src).then(function(response){
        return response.json()
    }).then(function(result){
        let data = result[1]["Timetables"];
        console.log(data);
    })
}


function btn_station_infor(id){
    setAttributes(time_up, {"onclick":"btn_station_time('"+id.value+"',"+1+" );"})
    setAttributes(time_down, {"onclick":"btn_station_time('"+id.value+"',"+0+" );"})
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
