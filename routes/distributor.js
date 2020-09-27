const express = require("express"),
	  router = express.Router();
const {pool} = require("../db");
const middleware = require("../middleware");

// display

router.get("/distributor",async(req,res)=>{  //middleware.ifsurvisor
	try {
		const aDistributor = await pool.query("SELECT * FROM DISTRIBUTOR INNER JOIN DISTRI_PHONE ON DISTRIBUTOR.DNAME=DISTRI_PHONE.DNAME");
		res.json(aDistributor.rows);

		// res.render('./movies/movies',{movies:allMovie.rows});
	} catch (err) {
		console.error(err.message);
	}
});

// add 

router.get("/distributor/add",middleware.ifsurvisor,(req,res)=>{ //,middleware.ifsurvisor
	try {
		res.send("./movies/addmovie");
	} catch (err) {
		console.error(err.message);
	}
});

router.post("/distributor/add",async(req,res)=>{  //,middleware.ifsurvisor
	try {
		const {dname,address,ph} = req.body;
		
		await pool.query("CALL ADD_DISTRI($1::VARCHAR,$2::VARCHAR,$3::BIGINT)",
        [dname,address,ph],
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

router.get("/distributor/update/:dname",middleware.ifsurvisor,(req,res)=>{ //,middleware.ifsurvisor
	try {
		res.send("./movies/update/:dname");
	} catch (err) {
		console.error(err.message);
	}
});

router.put("/distributor/update/:dname",async(req,res)=>{  //,middleware.ifsurvisor
	try {
        const {dname}= req.params;
		const {address,ph} = req.body;
		
		await pool.query("CALL UPD_DISTRI($1::VARCHAR,$2::VARCHAR,$3::BIGINT)",
        [dname,address,ph],
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

// delete

router.delete("/distributor/delete/:dname",async(req,res)=>{ //middleware.ifsurvisor,
	try {
		const {dname} = (req.params);
		
		const deleteMovie = await pool.query("CALL DEL_DISTRI($1::VARCHAR)",
        [dname],
        (err,result)=>{
            res.json("Deleted the tape");
		// res.redirect("/movies")
        }
		);
		
	} catch (err) {
		console.error(err.message);
	}
});

module.exports = router;