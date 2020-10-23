const express = require("express"),
	  router = express.Router();
const {pool} = require("../db");
const middleware = require("../middleware");
const upload = require('../multerconfig');

router.get('/file/upload',  async(req, res) => {
    res.render("./display/upload")
})
 
router.post('/file/upload', upload.single("file"), async(req, res) => {
    try {
        const type=req.file.mimetype,
            name=req.file.filename,
            data=req.file.buffer;
        
        await pool.query("INSERT INTO USERS(TYPE,NAME,DATA) VALUES ($1,$2,$3::bytea)",
        [type,name,data],
        (err,results)=>{
            if(err)
            console.log(err);
            if(results)
            res.json("successfull");
        })
    } catch (err) {
        console.log(err);
    }

  });

router.get("/info/:id",async(req,res)=>{
	await pool.query("SELECT * FROM TAPES NATURAL JOIN MOVIES WHERE TAPE_ID=$1",
	[req.params.id],
	async(err,files)=>{
		if(files)
		{
			results = await pool.query("SELECT * FROM TAPES NATURAL JOIN MOVIES order by stock limit 4");
		res.render("./display/infodisplay",{movies:files.rows[0],top:results.rows});
		}
		//   res.json(files.rows[0]);
		if(err)
		console.log(err);
		
	  });
})

router.get('/homepage', async(req, res) => {
  await pool.query("SELECT * FROM TAPES NATURAL JOIN MOVIES order by stock limit 4",
  
  (err,files)=>{
      if(files)
	  res.render("./display/homepage",{movies:files.rows});
		// res.json(files)
      if(err)
      console.log(err);
      
    });
  });

router.get("/alldisplay",async(req,res)=>{
	await pool.query("SELECT * FROM TAPES NATURAL JOIN MOVIES",
  
	(err,files)=>{
		if(files)
		res.render("./display/alldisplay",{movies:files.rows});
		  // res.json(files)
		if(err)
		console.log(err);
		
	  });
})

// display

router.get("/customer",middleware.ifAuthenticated,async(req,res)=>{  
	try {
		await pool.query("SELECT * FROM CUSTOMERS NATURAL JOIN CUS_PHONE ",
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

router.get("/customer/add",middleware.ifAuthenticated,(req,res)=>{ //,middleware.ifsurvisor
	try {
		res.render("./customer/addcustomer");
	} catch (err) {
		console.error(err.message);
	}
});

router.post("/customer/add",middleware.ifAuthenticated,async(req,res)=>{  //,middleware.ifsurvisor
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

router.get("/customer/update/:id",middleware.ifAuthenticated,async(req,res)=>{ //,middleware.ifsurvisor
	try {
		const {id} = req.params;
		await pool.query("SELECT * FROM CUSTOMERS NATURAL JOIN CUS_PHONE WHERE CUSTOMERS.CUS_ID=$1",
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

router.put("/customer/update/:id",middleware.ifAuthenticated,async(req,res)=>{  //,middleware.ifsurvisor
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

router.delete("/customer/delete/:id",middleware.ifAuthenticated,async(req,res)=>{ //middleware.ifsurvisor,
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