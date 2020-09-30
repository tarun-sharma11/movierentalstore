const express = require("express"),
	  router = express.Router();
const {pool} = require("../db");
const middleware = require("../middleware");

// display

router.get("/stores",middleware.ifAuthenticated,async(req,res)=>{  //middleware.ifsurvisor
	try {
		const astores = await pool.query("SELECT * FROM STORE INNER JOIN ST_PHONE ON STORE.STORE_ID=ST_PHONE.STORE_ID",
		[],
		(err,result)=>{
			if(err)
			console.log(err)
			if(result)
			res.render('./store/store',{stores:result.rows});	
		});

		
	} catch (err) {
		console.error(err.message);
	}
});

// add 

router.get("/stores/add",middleware.ifsurvisor,(req,res)=>{ //,middleware.ifsurvisor
	try {
		res.render("./store/addstore");
	} catch (err) {
		console.error(err.message);
	}
});

router.post("/stores/add",middleware.ifsurvisor,async(req,res)=>{  //,middleware.ifsurvisor
	try {
		const {sname,address,dname,ph} = req.body;
		
		await pool.query("CALL ADD_STORE($1::VARCHAR,$2::VARCHAR,$3::VARCHAR,$4::BIGINT)",
        [sname,address,dname,ph],
        (err,results)=>{
            if(results){
            // res.json(results.rows[0]);
            res.redirect("/stores"); 
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

router.get("/stores/update/:stid",middleware.ifsurvisor,async(req,res)=>{ //,middleware.ifsurvisor
	try {
		const {stid} = req.params;
		await pool.query("SELECT * FROM STORE INNER JOIN ST_PHONE ON STORE.STORE_ID=ST_PHONE.STORE_ID WHERE STORE.STORE_ID=$1",
		[stid],
		(err,result)=>{
			if(err)
			console.log(err)
			if(result)
			res.render("./store/updstore",{store:result.rows[0]});
			// res.json(result.rows[0]);	
		})
		
	} catch (err) {
		console.error(err.message);
	}
});
 
router.put("/stores/update/:stid",middleware.ifsurvisor,async(req,res)=>{  //,middleware.ifsurvisor
	try {
        const {stid}= req.params;
		const {sname,address,dname,ph} = req.body;
		
		await pool.query("CALL UPD_STORE($1::INTEGER,$2::VARCHAR,$3::VARCHAR,$4::VARCHAR,$5::BIGINT)",
        [stid,sname,address,dname,ph],
        (err,results)=>{
            if(results){
            // res.json("update");
            res.redirect("/stores"); 
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





module.exports = router;