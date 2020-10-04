const express = require("express"),
	  router = express.Router();
               
const session = require("express-session"); 
const passport = require("passport");
const { pool } = require("../db");
const middleware = require("../middleware")
router.get("/",(req,res)=>{
    res.render("login");
});
router.get("/dashboard",middleware.ifAuthenticated,async(req,res)=>{
    const id = req.user.sin;
    await pool.query("SELECT EMPLOYEES.SIN,ENAME,DOB,DOJ,STORE_ID,EMAIL,PASSWORD,PH FROM EMPLOYEES,EM_PHONE WHERE EMPLOYEES.SIN=$1 AND EM_PHONE.SIN=$1",[id],
    (err,result)=>{
        if(err)
        console.log(err)
        if(result)
        res.render("dashboard",{oneemp:result.rows[0]});
        
    })
    
})

router.post("/user/login",passport.authenticate("local",{
    successRedirect: "/dashboard",
    failureRedirect: "/user/login",

}
)
);
router.get("/user/login",middleware.ifnotAuthenticated,(req,res)=>{
    res.render("login")
})

router.get("/user/logout",middleware.ifAuthenticated,(req,res)=>{
    req.logOut();
    //flash
    res.redirect("/user/login");
});


module.exports = router;