const express = require("express"),
	  router = express.Router();
const {pool} = require("../db");
const middleware = require("../middleware");

// display

router.get("/stores",async(req,res)=>{  //middleware.ifsurvisor
	try {
		const astores = await pool.query("SELECT * FROM STORE INNER JOIN ST_PHONE ON STORE.STORE_ID=ST_PHONE.STORE_ID");
		res.json(astores.rows);

		// res.render('./movies/movies',{movies:allMovie.rows});
	} catch (err) {
		console.error(err.message);
	}
});

// add 

router.get("/stores/add",middleware.ifsurvisor,(req,res)=>{ //,middleware.ifsurvisor
	try {
		res.send("./movies/addmovie");
	} catch (err) {
		console.error(err.message);
	}
});

router.post("/stores/add",async(req,res)=>{  //,middleware.ifsurvisor
	try {
		const {sname,address,dname,ph} = req.body;
		
		await pool.query("CALL ADD_STORE($1::VARCHAR,$2::VARCHAR,$3::VARCHAR,$4::BIGINT)",
        [sname,address,dname,ph],
        (err,results)=>{
            if(results){
            res.json(results.rows[0]);
            // res.redirect("/movies"); 
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

router.get("/stores/update/:stid",middleware.ifsurvisor,(req,res)=>{ //,middleware.ifsurvisor
	try {
		res.send("./movies/update/:stid");
	} catch (err) {
		console.error(err.message);
	}
});
 
router.put("/stores/update/:stid",async(req,res)=>{  //,middleware.ifsurvisor
	try {
        const {stid}= req.params;
		const {sname,address,dname,ph} = req.body;
		
		await pool.query("CALL UPD_STORE($1::INTEGER,$2::VARCHAR,$3::VARCHAR,$4::VARCHAR,$5::BIGINT)",
        [stid,sname,address,dname,ph],
        (err,results)=>{
            if(results){
            res.json("update");
            // res.redirect("/movies"); 
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