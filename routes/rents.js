const express = require("express"),
	  router = express.Router();
      const {pool} = require("../db");
      
const middleware = require("../middleware");

// add rentss

router.get("/rents/add",async(req,res)=>{
    res.render("register");
});

router.post("/rents/add",async(req,res)=>{
    try {
        const {sin,tpid,cusid,stid} = req.body;
       await pool.query("CALL ADD_RENTAL($1::INTEGER,$2::VARCHAR,$3::INTEGER,$4::INTEGER,$5::INTEGER)",
            [tpid,'PENDING',cusid,sin,stid],
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

// update rentss;

router.get("/rents/update/:renid",async(req,res)=>{
    res.render("register");
});

router.put("/rents/update/:renid",async(req,res)=>{
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

router.delete("/rents/delete/:renid",async(req,res)=>{ //middleware.ifsurvisor,
	try {
		const {renid} = (req.params);
		
		await pool.query("CALL DEL_RENTAL($1)",
        [renid],
        (err,result)=>{
            if(result)
            res.json("Deleted the rents");
		// res.redirect("/movies")
        }
		);
		
	} catch (err) {
		console.error(err.message);
	}
});
module.exports = router;