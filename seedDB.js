const {pool} = require('./db');
const fs = require("fs");
const sqlspt = fs.readFileSync('database.sql').toString();

async function execute(){
    try {
        await pool.connect();
    console.log("Connected successfully.");
    
    return await pool.query(sqlspt
        );
    
    
    // await pool.end();                                                                                                                                                                                                   
    console.log("disconnect");
    } 
    catch (error) {
        console.error(error.message);    
    }   

}

module.exports = execute;