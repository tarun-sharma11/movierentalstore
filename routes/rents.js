const express = require("express"),
	  router = express.Router();
      const {pool} = require("../db");
      
const middleware = require("../middleware");

// display 

router.get("/rents",middleware.ifAuthenticated,async(req,res)=>{
    try {
        await pool.query("SELECT * FROM RENTALS",[],
        (err,result)=>{
            if(result){
                res.render("./rental/rents",{rentals:result.rows});
            }
            if(err){
                console.log(err);
            }
        })
        
    } catch (err) {
        console.error(err.message);
    }
    
})

// add rentss

router.get("/rents/add",middleware.ifAuthenticated,async(req,res)=>{
    res.render("./rental/addrent");
});

router.post("/rents/add",middleware.ifAuthenticated,async(req,res)=>{
    try {
        const {sin,tpid,cusid,stid} = req.body;
       await pool.query("CALL ADD_RENTAL($1::INTEGER,$2::VARCHAR,$3::INTEGER,$4::INTEGER,$5::INTEGER)",
            [tpid,'PENDING',cusid,sin,stid],
            async(err,results)=>{
                if(err)
                  console.log(err);
                // console.log(results.row s);
                if(results){
                    // res.json(results.rows);    
                    res.redirect("/rents");
                    //res.render("EJS PAGE",{errors})
                }
                
            }
                    
            );
                
        

    // console.log(name,email,passworzd);
    } catch (err) {
       console.error(err.message);
    }
});

// update rentss;

router.get("/rents/update/:renid",middleware.ifAuthenticated,async(req,res)=>{
    const {renid} = req.params;
    await pool.query("SELECT * FROM RENTALS WHERE RENTAL_ID=$1",
    [renid],
    (err,result)=>{
        if(result)
        res.render("./rental/updrent",{rent:result.rows[0]});
        // console.log(result.rows[0].rental_id)
        if(err)
        console.log(err);
    })
    
});

router.put("/rents/update/:renid",middleware.ifAuthenticated,async(req,res)=>{
    try {
            const {renid}=req.params;
            const {sin,tpid,cusid,stid} = req.body;
           await pool.query("CALL UPD_RENTAL($1::INTEGER,$2::INTEGER,$3::VARCHAR,$4::INTEGER,$5::INTEGER,$6::INTEGER)",
                [renid,tpid,'PENDING',cusid,sin,stid],
                async(err,results)=>{
                    if(err)
                      console.log(err);
                    // console.log(results.row s);
                    if(results){
                        res.redirect("/rents")
                        // res.json("update");
                        // res.render("EJS PAGE",{errors})
                    }
                    
                }
                        
                );

    // console.log(name,email,passworzd);
    } catch (err) {
       console.error(err.message);
    }
});
   

module.exports = router;