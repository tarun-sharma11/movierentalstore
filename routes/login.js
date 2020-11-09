const express = require("express"),
      reset = require("../seedDB"),
	  router = express.Router();
               

const passport = require("passport");

const { pool } = require("../db");
const middleware = require("../middleware")

router.get("/",(req,res)=>{
    res.redirect("/homepage");
});
router.get("/dashboard",middleware.ifAuthenticated,async(req,res)=>{ 
    const id = req.user.sin;
    const ifad = await pool.query("select * from supervisors where sin=$1",[id]);
    const totemp = await pool.query("select count(*) from employees where sin <> 0");
    const totmov = await pool.query("select count(*) from tapes");
    const totcus = await pool.query("select count(*) from customers");
    const totpay = await pool.query("select count(*) from payments");
    let dba = 0;
    if(id===1010)
    dba=1;
    await pool.query("SELECT EMPLOYEES.SIN,ENAME,DOB,DOJ,STORE_ID,EMAIL,PASSWORD,PH FROM EMPLOYEES,EM_PHONE WHERE EMPLOYEES.SIN=$1 AND EM_PHONE.SIN=$1",[id],
    (err,result)=>{
        if(err)
        console.log(err)
        if(result)
        res.render("dashboard",{oneemp:result.rows[0],ifadmin:ifad.rows[0],countemp:totemp.rows[0].count,countmov:totmov.rows[0].count,countcus:totcus.rows[0].count,countpay:totpay.rows[0].count,dataadmin:dba});
        
    })
    
})

router.post("/user/login",passport.authenticate("employees",{
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

router.get("/reset",middleware.dba,(req,res)=>{
    reset.reset();
    res.redirect("/user/logout");
});

module.exports = router;