const express = require("express"),
	  router = express.Router();
      const {pool} = require("../db");
      
const middleware = require("../middleware");

// add payss

router.get("/pays/add",async(req,res)=>{
    res.render("register");
});

router.post("/pays/add/:rentid",async(req,res)=>{
    try {
        const {rentid} = req.params;
        const {sin,cost,status,type,detail} = req.body;
       await pool.query("CALL ADD_PAY($1::INTEGER,$2::INTEGER,$3::INTEGER,$4::VARCHAR,$5::VARCHAR,$6::INTEGER)",
            [rentid,sin,cost,status,type,detail],
            async(err,results)=>{
                if(err)
                  console.log(err);
                // console.log(results.row s);
                if(results){
                    res.json(results.rows);
                    //res.render("EJS PAGE",{errors})
                }
                
            }
                    
            );
                
        

    // console.log(name,email,passworzd);
    } catch (err) {
       console.error(err.message);
    }
});

// update payss;

router.get("/pays/update/:renid",async(req,res)=>{
    res.render("register");
});

router.put("/pays/update/:renid",async(req,res)=>{
    try {
        const {rentid} = req.params;
        const {sin,cost,status,type,detail} = req.body;
       await pool.query("CALL ADD_PAY($1::INTEGER,$2::INTEGER,$3::INTEGER,$4::VARCHAR,$5::VARCHAR,$6::INTEGER)",
            [rentid,sin,cost,status,type,detail],
                async(err,results)=>{
                    if(err)
                      console.log(err);
                    // console.log(results.row s);
                    if(results){
                        res.json("update");
                        //res.render("EJS PAGE",{errors})
                    }
                    
                }
                        
                );

    // console.log(name,email,passworzd);
    } catch (err) {
       console.error(err.message);
    }
});


		
module.exports = router;