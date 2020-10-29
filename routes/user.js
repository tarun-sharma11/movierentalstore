let upload = require('../multerconfig');
const {pool} = require("../db");
const middleware = require("../middleware");
const express = require("express"),
	  router = express.Router();
var stream = require('stream');
var path = require('path');
const passport = require("passport");


// router.get('/file/upload',  async(req, res) => {
//   res.render("./display/upload")
// })

// router.post('/file/upload', upload.single("file"), async(req, res) => {
//   try {
//       const type=req.file.mimetype,
//           name=req.file.filename,
//           data=req.file.buffer;
      
//       await pool.query("INSERT INTO USERS(TYPE,NAME,DATA) VALUES ($1,$2,$3::bytea)",
//       [type,name,data],
//       (err,results)=>{
//           if(err)
//           console.log(err);
//           if(results)
//           res.json("successfull");
//       })
//   } catch (err) {
//       console.log(err);
//   }

// });

// Online

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

router.post("/customer/login",passport.authenticate("customer",{
  successRedirect: "/",
  failureRedirect: "/customer/login",

}
)
);

router.get("/customer/login",middleware.ifnotAuthenticated,(req,res)=>{ //middleware
  res.render("./display/login");
});

router.get("/myrents",middleware.ifcustomer,async(req,res)=>{
  const id = req.user.cus_id;
  await pool.query("SELECT * FROM TAPES NATURAL JOIN MOVIES WHERE TAPE_ID=(SELECT TAPE_ID FROM RENTALS WHERE CUS_ID=$1)",
  [id],
  (err,results)=>{
    if(err)
    console.log(err);
    if(results)
    res.render("./display/allrented",{movies:results.rows});
    // res.json(results.rows);
  })
  
})

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