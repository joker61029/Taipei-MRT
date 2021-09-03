from abc import abstractmethod
import mysql.connector, json
from mysql.connector import errorcode
from dotenv import load_dotenv
import os

load_dotenv()
mydb = mysql.connector.connect(
    host = os.getenv('DB_HOST'),
    user = os.getenv('DB_user'),
    password = os.getenv('DB_PASSWORD'),
    database = os.getenv('DB_DATABASE')
)

url = open(r"mrt_station.json", "r", encoding="UTF-8")
r_url = url.read()
data = json.loads(r_url)
for i in range(len(data)):
    station = data[i]
    StationUID = station["StationUID"]
    StationID = station["StationID"]
    StationName_TW = station["StationName"]["Zh_tw"]
    StationName_EN = station["StationName"]["En"]
    StationAddress = station["StationAddress"]
    StationBike = station["BikeAllowOnHoliday"]
    CityCode = station["LocationCityCode"]
    Line = filter(str.isalpha, StationID)
    LineID_line = ''.join(list(Line))
    Line = filter(str.isdigit, StationID)
    LineID_Num = ''.join(list(Line))
    cursor = mydb.cursor(buffered=True)
    sql = """INSERT INTO `station` (stationUID, stationID, stationName_TW, stationName_EN, stationAddress, stationBike, lineID , lineNum, cityCode)
             VALUES ( %s, %s, %s, %s, %s, %s, %s, %s, %s );"""
    cursor.execute(sql, (StationUID, StationID, StationName_TW, StationName_EN, StationAddress, StationBike, LineID_line, LineID_Num, CityCode))
    mydb.commit()


url = open(r"mrt_line.json", "r", encoding="UTF-8")
r_url = url.read()
data = json.loads(r_url)
for i in range(len(data)):
    line = data[i]
    LineID = line["LineID"]
    LineName_TW = line["LineName"]["Zh_tw"]
    LineName_EN = line["LineName"]["En"]
    LineColor = line["LineColor"]
    cursor = mydb.cursor(buffered=True)
    sql = """INSERT INTO `line` ( lineID, lineName_TW, lineName_EN, lineColor) VALUES ( %s, %s, %s, %s );"""
    cursor.execute(sql, (LineID, LineName_TW, LineName_EN, LineColor))
    mydb.commit()
    # sql = """UPDATE `station` SET `lineColor`= %s WHERE `lineID` = %s;"""
    # cursor.execute(sql, (LineColor, LineID))
    # mydb.commit()

url = open(r"mrt_facitily.json", "r", encoding="UTF-8")
r_url = url.read()
data = json.loads(r_url)
for i in range(len(data)):
    facitily = data[i]
    name = facitily["車站名稱"]
    elevator = facitily["電梯"]
    escalator = facitily["電扶梯"]
    atm = facitily["銀行ATM"]
    nursing = facitily["哺集乳室"]
    drinking = facitily["飲水機/飲水臺"]
    charging = facitily["充電站"]
    ticket = facitily["自動售票機/含加值機"]
    wc = facitily["廁所"]
    cursor = mydb.cursor(buffered=True)
    sql = """INSERT INTO `facility` 
            ( stationName_TW, elevator, escalator, atm, nursing, drinking, charging, ticket, wc) 
            VALUES ( %s, %s, %s, %s, %s, %s, %s, %s, %s );"""
    cursor.execute(sql, (name, elevator, escalator, atm, nursing, drinking, charging, ticket, wc))
    mydb.commit()

url = open(r"mrt_shuttle_bus.json", "r", encoding="UTF-8")
r_url = url.read()
data = json.loads(r_url)
for i in range(len(data)):
    bus = data[i]
    name = bus["車站"][:-1]
    bus_line = bus["免費接駁車路線"]
    line = bus["路線別"]
    cursor = mydb.cursor(buffered=True)
    sql = "SELECT `lineID` FROM `line` WHERE `lineName_TW` = %s;"
    line_name = (line,)
    cursor.execute(sql, line_name)
    for j in cursor:
        sql = """INSERT INTO `bus` 
                ( stationName_TW, line, bus ) 
                VALUES ( %s, %s, %s );"""
        cursor.execute(sql, (name, j[0], bus_line))
    mydb.commit()
    

