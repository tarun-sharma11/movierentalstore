const {pool} = require('./db');
const fs = require("fs");
const db = require('./db');
const sqlspt = fs.readFileSync('database.sql').toString();
const dbconfig = {};

dbconfig.execute=async()=>{
    try {
        await pool.connect();
    console.log("Connected successfully.");
    return 0;
    
    
    
    // await pool.end();                                                                                                                                                                                                   
    console.log("disconnect");
    } 
    catch (error) {
        console.error(error.message);    
    }   

}
dbconfig.reset=async()=>{
    try {
        console.log("Success in Reset");
        return await pool.query(sqlspt
            );
    } catch (error) {
        console.error(error.message);
        
    }
}

module.exports = dbconfig;