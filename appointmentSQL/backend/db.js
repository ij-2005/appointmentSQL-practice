import mysql from "mysql2";

export const db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "Ivanjoshua12!",
    database: "appointment_system"
});

db.connect(err => {
    if(err){
        console.error("ERROR!", err);
    } else {
        console.log("SQL connected.");
    }
});