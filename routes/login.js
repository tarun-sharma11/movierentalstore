const express = require("express"),
	  router = express.Router();
               
const session = require("express-session"); 
const passport = require("passport");
const middleware = require("../middleware")
router.get("/",(req,res)=>{
    res.render("login");
});
router.get("/dashboard",middleware.ifAuthenticated,(req,res)=>{
    res.render("dashboard");
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