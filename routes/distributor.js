const express = require("express"),
	  router = express.Router();
const {pool} = require("../db");
const middleware = require("../middleware");

// display

router.get("/distributor",middleware.ifAuthenticated,async(req,res)=>{  //middleware.ifsurvisor
	try {
		const aDistributor = await pool.query("SELECT * FROM DISTRIBUTOR INNER JOIN DISTRI_PHONE ON DISTRIBUTOR.DNAME=DISTRI_PHONE.DNAME");
		// res.json(aDistributor.rows);

		res.render('./distributor/distributor',{distributors:aDistributor.rows});
	} catch (err) {
		console.error(err.message);
	}
});

// add 

router.get("/distributor/add",middleware.ifsurvisor,(req,res)=>{ //,middleware.ifsurvisor
	try {
		res.render("./distributor/adddistributor");
	} catch (err) {
		console.error(err.message);
	}
});

router.post("/distributor/add",middleware.ifsurvisor,async(req,res)=>{  //
	try {
		const {dname,address,ph} = req.body;
		
		await pool.query("CALL ADD_DISTRI($1::VARCHAR,$2::VARCHAR,$3::BIGINT)",
        [dname,address,ph],
        (err,results)=>{
            if(results){
            // res.json(results.rows[0]);
            res.redirect("/distributor"); 
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

router.get("/distributor/update/:dname",middleware.ifsurvisor,async(req,res)=>{ //,middleware.ifsurvisor
	try {
		const {dname}= req.params;
		const aDistributor = await pool.query("SELECT * FROM DISTRIBUTOR INNER JOIN DISTRI_PHONE ON DISTRIBUTOR.DNAME=DISTRI_PHONE.DNAME WHERE DISTRIBUTOR.DNAME=$1",[dname]);
		res.render("./distributor/updatedistributor",{distributor:aDistributor.rows[0]});
	} catch (err) {
		console.error(err.message);
	}
});

router.put("/distributor/update/:dname",middleware.ifsurvisor,async(req,res)=>{  //
	try {
        const {dname}= req.params;
		const {address,ph} = req.body;
		
		await pool.query("CALL UPD_DISTRI($1::VARCHAR,$2::VARCHAR,$3::BIGINT)",
        [dname,address,ph],
        (err,results)=>{
            if(results){
            // res.json("update");
            res.redirect("/distributor"); 
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

router.delete("/distributor/delete/:dname",middleware.ifsurvisor,async(req,res)=>{ //
	try {
		const {dname} = (req.params);
		
		await pool.query("CALL DEL_DISTRI($1::VARCHAR)",
        [dname],
        (err,result)=>{
			if(err)
			res.json(err);
			if(result)
			res.redirect("/distributor");
        }
		);
		
	} catch (err) {
		console.error(err.message);
	}
});

module.exports = router;