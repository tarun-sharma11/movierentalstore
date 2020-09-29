const express = require("express"),
	  router = express.Router();
const {pool} = require("../db");
const middleware = require("../middleware");

// display

router.get("/customer",async(req,res)=>{  //middleware.ifsurvisor
	try {
		await pool.query("SELECT * FROM CUSTOMERS INNER JOIN CUS_PHONE ON CUSTOMERS.CUS_ID=CUS_PHONE.CUS_ID",
		[],
		(err,results)=>{
			if(err)
			console.log(err)
			if(results)
			res.render("./customer/customer",{customers:results.rows})

		});
		

		// res.render('./movies/movies',{movies:allMovie.rows});
	} catch (err) {
		console.error(err.message);
	}
});

// add  

router.get("/customer/add",(req,res)=>{ //,middleware.ifsurvisor
	try {
		res.render("./customer/addcustomer");
	} catch (err) {
		console.error(err.message);
	}
});

router.post("/customer/add",async(req,res)=>{  //,middleware.ifsurvisor
	try {
		const {cusname,stid,address,ph} = req.body;
		
		await pool.query("CALL ADD_CUS($1::VARCHAR,$2::INTEGER,$3::VARCHAR,$4::BIGINT)",
        [cusname,stid,address,ph],
        (err,results)=>{
            if(results){
            // res.json(results.rows[0]);
            res.redirect("/customer"); 
            }
            if(err){
                console.log(err);
            }
        }
		);

	} catch (err) {
		console.error(err.message);
	}
});

// UPDATE

router.get("/customer/update/:id",async(req,res)=>{ //,middleware.ifsurvisor
	try {
		const {id} = req.params;
		await pool.query("SELECT * FROM CUSTOMERS INNER JOIN CUS_PHONE ON CUSTOMERS.CUS_ID=CUS_PHONE.CUS_ID WHERE CUSTOMERS.CUS_ID=$1",
		[id],
		(err,result)=>{
			if(err)
			console.log(err)
			if(result)
			res.render("./customer/updcustomer",{customer:result.rows[0]});
		})

		
	} catch (err) {
		console.error(err.message);
	}
});

router.put("/customer/update/:id",async(req,res)=>{  //,middleware.ifsurvisor
	try {
        const {id}= req.params;
		const {cusname,stid,address,ph} = req.body;
		
		await pool.query("CALL UPD_CUS($1::INTEGER,$2::VARCHAR,$3::INTEGER,$4::VARCHAR,$5::BIGINT)",
        [id,cusname,stid,address,ph],
        (err,results)=>{
            if(results){
            // res.json("update");
            res.redirect("/customer"); 
            }
            if(err){
                console.log(err);
            }
        }
		);

	} catch (err) {
		console.error(err.message);
	}
});

// delete

router.delete("/customer/delete/:id",async(req,res)=>{ //middleware.ifsurvisor,
	try {
		const {id} = (req.params);
		
		await pool.query("CALL DEL_CUS($1::INTEGER)",
        [id],
        (err,result)=>{
			if(result)
			res.redirect("/customer");
			if(err)
			console.log(err);
		// res.redirect("/movies")
        }
		);
		
	} catch (err) {
		console.error(err.message);
	}
});

module.exports = router;