const express = require("express"),
	  router = express.Router();
const {pool} = require("../db");
const middleware = require("../middleware");
  
router.post("/movies/add",middleware.ifsurvisor,async(req,res)=>{  //
	try {
		const {stock,price,st_id,title,direct,descp,gene,rating,nos} = req.body;
		
		await pool.query("CALL ADD_TAPE ($1,$2,$3,$4,$5,$6,$7,$8,$9);",
		[stock,price,st_id,title,direct,descp,gene,rating,nos],
		(err,result)=>{
			if(err)
				console.log(err)
			if(result)
			res.redirect("/movies"); 
		});

		
	} catch (err) {
		console.error(err.message);
	}
});
router.get("/movies/add",middleware.ifsurvisor,(req,res)=>{ //,middleware.ifsurvisor
	try {
		res.render("./movies/addmovie");
	} catch (err) {
		console.error(err.message);
	}
});
router.get("/movies",middleware.ifAuthenticated,async(req,res)=>{  //,middleware.ifAuthenticated
	try {
		const allMovie = await pool.query("SELECT * FROM TAPES NATURAL JOIN MOVIES");


		res.render('./movies/movies',{movies:allMovie.rows});
	} catch (err) {
		console.error(err.message);
	}
});

router.get("/movies/update/:id",middleware.ifsurvisor,async(req,res)=>{  //middleware.ifsurvisor,
	try {

		
		const {id} = req.params;
		const aMovie = await pool.query("SELECT * FROM TAPES NATURAL JOIN MOVIES WHERE TAPES.TAPE_ID=$1",
		[id]
		);
		// res.json(aMovie.rows[0]);
		
		res.render("./movies/update",{movie:aMovie.rows[0]});
	} catch (err) {
		console.error(err.message);
		
	}
	
});

router.put("/movies/update/:id",middleware.ifsurvisor,async(req,res)=>{ //middleware.ifsurvisor,
	try {
		const {stock,price,st_id,title,direct,descp,gene,rating,nos} = req.body;
		const {id} = req.params;
		await pool.query("CALL UPD_TAPE ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10);",
		[id,stock,price,st_id,title,direct,descp,gene,rating,nos],
		(err,results)=>{
			if(results)
			res.redirect("/movies");
			if(err)
			console.log(err);
		}
		);
		// res.json("Update the Tape");
		
	} catch (err) {
		console.error(err.message);
	}
});

router.delete("/movies/delete/:id",middleware.ifsurvisor,async(req,res)=>{ //middleware.ifsurvisor,
	try {
		const {id} = (req.params);
		
		await pool.query("CALL DEL_TAPE($1::INTEGER)",
		[id],
		(err,result)=>{
			if(err)
			console.log(err);
			if(result) 
			res.redirect("/movies");
		}
		);
		
		
	} catch (err) {
		console.error(err.message);
	}
});

module.exports = router;