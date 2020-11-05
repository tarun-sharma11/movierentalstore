
const {pool} = require("../db");
const middleware = require("../middleware");
const express = require("express"),
	  router = express.Router();
var stream = require('stream');
var path = require('path');
const passport = require("passport");
const bcrypt = require("bcrypt");

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
});

router.get("/checkout/:id",middleware.ifcustomer,async(req,res)=>{
  await pool.query("Select * from tapes where tape_id=$1",
  [req.params.id],
  (err,results)=>{
    if(err)
    console.log(err)
    if(results){
      res.render("./display/checkout",{pay:results.rows[0]});
    }
  })
})

router.post("/checkout/:price/:id",middleware.ifcustomer,async(req,res)=>{
  const {detail} = req.body;
  const {cus_id} = req.user;
  // console.log(req.params.price);
  await pool.query("CALL ADD_RENTAL($1::INTEGER,$2::VARCHAR,$3::INTEGER,$4::INTEGER,$5::INTEGER)",
            [req.params.id,'ON RENT',cus_id,0,0],
            async(err,result)=>{
              if(err)
              console.log(err);
              if(result)
              await pool.query("SELECT RENTAL_ID FROM RENTALS WHERE TAPE_ID = $1",
              [req.params.id],
              async(err,result)=>{
                if(err)
                console.log(err);
                if(result);
                await pool.query("CALL ADD_PAY($1::INTEGER,$2::INTEGER,$3::INTEGER,$4::VARCHAR,$5::VARCHAR,$6::INTEGER)",
                [result.rows[0].rental_id,0,req.params.price,'COMPLETED','CARD',detail],
                (err,result)=>{
                  if(result)
                  res.redirect('/myrents');
                  if(err)
                  console.log(err);
                });
              })
              
            });
  
  })

router.get('/homepage', async(req, res) => {
  await pool.query("SELECT * FROM TAPES NATURAL JOIN MOVIES order by stock limit 4",
(err,files)=>{
    if(files)
  res.render("./display/homepage",{movies:files.rows});
  // res.json(result.rows[0])
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

router.post("/customer/login",passport.authenticate("customer",{
  successRedirect: "/",
  failureRedirect: "/customer/login",

}
)
);

router.get("/customer/login",middleware.ifnotcustomer,(req,res)=>{ //middleware
  res.render("./display/login");
});



router.get("/customer/logout",middleware.ifcustomer,(req,res)=>{
  req.logOut();
  //flash
  res.redirect("/homepage");
});

router.get("/myrents",middleware.ifcustomer,async(req,res)=>{
  const id = req.user.cus_id;
  await pool.query("SELECT * FROM TAPES NATURAL JOIN MOVIES WHERE TAPE_ID IN (SELECT TAPE_ID FROM RENTALS WHERE CUS_ID=$1)",
  [id],
  (err,results)=>{
    if(err)
    console.log(err);
    if(results)
    res.render("./display/allrented",{movies:results.rows});
    // res.json(results.rows);
  })
  
});

router.get("/newcustomer",middleware.ifnotcustomer,async(req,res)=>{
  res.render("./display/addcus");
});
router.post("/newcustomer",async(req,res)=>{  //,middleware.ifsurvisor
	try {
		
		const {cusname,address,email,password,password2,ph} = req.body;
		let errors = []
		
        if(!cusname || !email || !password || !password2)
        {errors.push({message:"Please enter all the field correctly"});} 
        if(password.length < 6)
        {errors.push({message:"Please enter all the field correctly"});} 
        if(password!=password2)
        {errors.push({message:"Please enter all the field correctly"});} 
        if(errors.length > 0){
            res.send("Error");
        }
    
        else{    
            
            const hashedpassword = await bcrypt.hash(password,10);
          
		await pool.query("CALL ADD_CUS($1::VARCHAR,$2::INTEGER,$3::VARCHAR,$4::VARCHAR,$5::VARCHAR,$6::BIGINT)",
        [cusname,0,address,email,hashedpassword,ph],
        (err,results)=>{
            if(results){
			// res.json(results.rows[0]);
			
			res.redirect("/")
            }
            if(err){
                console.log(err);
            }
        });
		}

	} catch (err) {
		console.error(err.message);
	}
});





 
router.get('/file/:id', async(req, res) => {
  try {
    await pool.query("SELECT * FROM USERS WHERE ID=$1",[req.params.id],
  (err,file )=> {
      if(file)
      // res.json(file.rows[0]);
      {
      var fileContents = Buffer.from(file.rows[0].data, "base64");
      var readStream = new stream.PassThrough();
      readStream.end(fileContents);
      
      res.set('Content-disposition', 'attachment; filename=' + file.name);
      res.set('Content-Type', file.type);
   
      readStream.pipe(res);
    }
    if(err){
      console.log(err);
      res.json({msg: 'Error', detail: err});
    };
  });
  
  } catch (err) {
    console.log(err);
  }
});

module.exports = router;