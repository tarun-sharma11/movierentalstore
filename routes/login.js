const express = require("express"),
	  router = express.Router();
const {pool} = require("../db");
const bcrypt = require("bcrypt");
const session = require("express-session"); 
const passport = require("passport");
const middleware = require("../middleware")
router.get("/",(req,res)=>{
    res.render("homepage");
});
router.get("/dashboard",(req,res)=>{
    res.send("dashboard");
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

router.get("/user/register",middleware.ifnotAuthenticated,async(req,res)=>{
    res.render("register");
});

router.get("/user/supervisor",(req,res)=>{
    res.render("supervisor");
});
router.post("/user/supervisor",async(req,res)=>{
        try {
            const {email} = req.body;
             
            let errors=[]
            if(!email)
            errors.push({message:"Please enter correct name"});
            if(errors.length>0){
                res.send(errors);
            }
            else{
                await pool.query("SELECT id FROM USERS WHERE EMAIL = $1",[email],
                async(err,results)=>{
                    if(err)
                    console.error(err.message);
                    // console.log(results.rows);
                    if(results.rows.length>1){
                        console.log("More than one");
                    }
                    else{
                        const {id} = results.rows[0];
                        await pool.query("INSERT INTO SUPERVISORS (ID) VALUES ($1)",
                        [id],
                        async(err,results)=>{
                            if(results){
                                res.redirect("/user/login");
                            }
                            if(err){
                                res.send("Error with supervisors relation")
                            }
                        });
                    }

            }
                );
        } }
        catch (err) {
            console.error(err.message);
        }
})

router.post("/user/register",middleware.ifnotAuthenticated,async(req,res)=>{
    try {
        const {name,email,password,password2} = req.body;
        let errors = []
        if(!name || !email || !password || !password2)
        errors.push({message:"Please enter all the field correctly"});
        if(password.length < 6)
        errors.push({message:"Please enter all the field correctly"});
        if(password!=password2)
        errors.push({message:"Please enter all the field correctly"});
        if(errors.length > 0){
            res.send("Error");
        }
        else{
            const hashedpassword = await bcrypt.hash(password,10);
            await pool.query("SELECT * FROM USERS WHERE EMAIL = $1",[email],
            async(err,results)=>{
                if(err)
                console.error(err.message);
                // console.log(results.rows);
                if(results.rows.length>0){
                    errors.push({message:"Email already registered"});
                    //res.render("EJS PAGE",{errors})
                }
                else{
                    const newUser = await pool.query("INSERT INTO USERS (NAME,EMAIL,PASSWORD) VALUES ($1,$2,$3) RETURNING *",
                    [name,email,hashedpassword]
                    );
                    // res.json(newUser.rows[0]);
                    res.redirect("/movies")
                }
            }
                    
            );
                
        }

    // console.log(name,email,passworzd);
    } catch (err) {
       console.error(err.message);
    }
});

module.exports = router;