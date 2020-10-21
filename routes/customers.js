const express = require("express"),
	  router = express.Router();
const {pool} = require("../db");
const middleware = require("../middleware");
const base64ToImage = require("base64-to-image");
var fs = require('fs');

// function to encode file data to base64 encoded string
function base64_encode(file) {
    // read binary data
    var bitmap = fs.readFileSync(file);
    // convert binary data to base64 encoded string
    return new Buffer(bitmap).toString('base64');
}
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

router.get("/img",async(req,res)=>{  
	try {
		// var base64str = base64_encode('/home/tarun/Downloads/tree.jpg');
		// await pool.query("insert into images (imgname,img) values ('tree',$1)",[base64str],
		// (err,result)=>{
		// 	if(err)
		// 	console.log(err)
		// 	if(result)
		// 	console.log("done");
		// });

		await pool.query("SELECT encode(img,'base64') FROM images where imgname='tree'",
		[],
		(err,results)=>{
			if(err)
			console.log(err)
			if(results)
			// res.json(results.rows[0].encode);
			{var optionalObj = {'fileName': 'imageFileName', 'type':'png'};
			var imageInfo = base64ToImage(results.rows[0].encode,'/home/tarun',optionalObj); 
			res.send(imageInfo.fileName);
			}
			

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