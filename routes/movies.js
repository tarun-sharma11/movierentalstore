const express = require("express"),
	  router = express.Router();
const {pool} = require("../db");
const middleware = require("../middleware");
  
router.post("/movies/add",async(req,res)=>{  //,middleware.ifsurvisor
	try {
		const {stock,price,st_id,title,direct,descp,gene,rating,nos} = req.body;
		
		const newMovie = await pool.query("CALL ADD_TAPE ($1,$2,$3,$4,$5,$6,$7,$8,$9);",
		[stock,price,st_id,title,direct,descp,gene,rating,nos]
		);

		res.json(newMovie.rows[0]);
		// res.redirect("/movies"); 


	} catch (err) {
		console.error(err.message);
	}
});
router.get("/movie/add",middleware.ifsurvisor,(req,res)=>{ //,middleware.ifsurvisor
	try {
		res.send("./movies/addmovie");
	} catch (err) {
		console.error(err.message);
	}
});
router.get("/movies",async(req,res)=>{  //,middleware.ifAuthenticated
	try {
		const allMovie = await pool.query("SELECT * FROM TAPES INNER JOIN MOVIES ON TAPE_ID=TAPE_ID");
		res.json(allMovie.rows);

		// res.render('./movies/movies',{movies:allMovie.rows});
	} catch (err) {
		console.error(err.message);
	}
});

router.get("/movies/:id/update",async(req,res)=>{  //middleware.ifsurvisor,
	try {

		
		const {id} = req.params;
		const aMovie = await pool.query("SELECT * FROM TESTING WHERE ID = $1",
		[id]
		);
		// res.json(aMovie.rows[0]);
		
		res.render("./movies/update",{movie:aMovie.rows[0]});
	} catch (err) {
		console.error(err.message);
		
	}
	
});

router.put("/movies/:id/update",async(req,res)=>{ //middleware.ifsurvisor,
	try {
		const {id} = req.params;
		const {descp} = req.body;
		
		const updateMovie = await pool.query("UPDATE TESTING SET DESCRIPTION = ($1) WHERE ID = $2",
		[descp,id]
		);
		// res.json("Update the Tape");
		res.redirect("/movies")
	} catch (err) {
		console.error(err.message);
	}
});

router.delete("/movies/:id",async(req,res)=>{ //middleware.ifsurvisor,
	try {
		const {id} = (req.params);
		
		const deleteMovie = await pool.query("DELETE FROM TESTING WHERE ID = $1",
		[id]
		);
		// res.json("Deleted the tape");
		res.redirect("/movies")
	} catch (err) {
		console.error(err.message);
	}
});

module.exports = router;