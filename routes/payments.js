const express = require("express"),
	  router = express.Router();
      const {pool} = require("../db");
      
const middleware = require("../middleware");

router.get("/pays",middleware.ifAuthenticated,async(req,res)=>{
    try {
        await pool.query("SELECT * FROM PAYMENTS",[],
        (err,results)=>{
            if(err)
            console.log(err)
            if(results)
            res.render("./payment/payments",{pays:results.rows})
        })
    } catch (err) {
        
    }
})


// add payss

router.get("/pays/add",middleware.ifAuthenticated,async(req,res)=>{
    res.render("./payment/addpayment");
});

router.post("/pays/add",middleware.ifAuthenticated,async(req,res)=>{
    try {
        
        const {rentid,sin,cost,status,type,detail} = req.body;
       await pool.query("CALL ADD_PAY($1::INTEGER,$2::INTEGER,$3::INTEGER,$4::VARCHAR,$5::VARCHAR,$6::INTEGER)",
            [rentid,sin,cost,status,type,detail],
            async(err,results)=>{
                if(err)
                  console.log(err);
                // console.log(results.row s);
                if(results){
                    res.redirect("/pays");   
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

router.get("/pays/update/:renid",middleware.ifAuthenticated,async(req,res)=>{
    const {renid} = req.params;
    
    await pool.query("SELECT * FROM PAYMENTS WHERE RENTAL_ID=$1",[renid],
    (err,result)=>{
        if(err)
        console.log(err);
        if(result)
        res.render("./payment/updpayment",{pay:result.rows[0]})
        
    })
});

router.put("/pays/update/:renid",middleware.ifAuthenticated,async(req,res)=>{
    try {
        const {renid} = req.params;
        const {sin,cost,status,type,detail} = req.body;
       await pool.query("CALL UPD_PAY($1::INTEGER,$2::INTEGER,$3::INTEGER,$4::VARCHAR,$5::VARCHAR,$6::INTEGER)",
            [renid,sin,cost,status,type,detail],
                async(err,results)=>{
                    if(err)
                      console.log(err);
                    // console.log(results.row s);
                    if(results){
                        res.redirect("/pays"); 
                        
                    }
                    
                }
                        
                );

    // console.log(name,email,passworzd);
    } catch (err) {
       console.error(err.message);
    }
});


		
module.exports = router;