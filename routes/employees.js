const express = require("express"),
	  router = express.Router();
      const {pool} = require("../db");
      const bcrypt = require("bcrypt");
const middleware = require("../middleware");

// add supervisor

router.get("/supervisor/add",middleware.ifsurvisor,(req,res)=>{
    res.render("supervisor");
});
router.post("/supervisor/add",middleware.ifsurvisor,async(req,res)=>{
        try {
            const {email} = req.body;
             
            let errors=[]
            if(!email)
            errors.push({message:"Please enter correct name"});
            if(errors.length>0){
                res.send(errors);
            }
            else{
                await pool.query("CALL ADD_SUPVIS($1)",[email],
                async(err,results)=>{
                    if(err)
                    console.log(err)
                    if(results)
                    {res.json(results.rows[0]);}
                })
        }
        }
        catch (err) {
            console.error(err.message);
        }
});

// delete supervisor

router.delete("/supervisor/delete/:sin",middleware.ifsurvisor,async(req,res)=>{
    try {
        const {sin} = req.params;
         
        let errors=[]   
        if(!sin)
        errors.push({message:"Please enter correct name"});
        if(errors.length>0){
            res.send(errors);
        }
        else{
            await pool.query("CALL DEL_SUPVIS($1::integer)",[sin],
            async(err,results)=>{
                if(err)
                console.log(err)
                if(results)
                // res.json("deleted");
                res.redirect("/")
            })
    }
    }
    catch (err) {
        console.error(err.message);
    }
});

// display

router.get("/employee",middleware.ifsurvisor,async(req,res)=>{  //middleware.ifsurvisor
	try {
		const aemployee = await pool.query("SELECT * FROM EMPLOYEES INNER JOIN EM_PHONE ON EMPLOYEES.SIN=EM_PHONE.SIN");
		// res.json(aemployee.rows);
        const asup = await pool.query("SELECT * FROM SUPERVISORS");
		res.render('./employee/employees',{employees:aemployee.rows,supervise:asup.rows});
	} catch (err) {
		console.error(err.message);
	}
});

// add employees

router.get("/employee/add",middleware.ifsurvisor,async(req,res)=>{
    res.render("register");
});

router.post("/employee/add",middleware.ifsurvisor,async(req,res)=>{
    try {
        const {sin,name,address,dob,doj,stid,sal,email,password,password2,ph} = req.body;
        let errors = []
        if(!name || !email || !password || !password2)
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
            // console.log(hashedpassword);
            await pool.query("CALL ADD_EMP($1::INTEGER,$2::VARCHAR,$3::VARCHAR,$4::VARCHAR,$5::VARCHAR,$6::SMALLINT,$7::INTEGER,$8::VARCHAR,$9::VARCHAR,$10::BIGINT)",
            [sin,name,address,dob,doj,stid,sal,email,hashedpassword,ph],
            async(err,results)=>{
                if(err)
                  console.log(err);
                // console.log(results.row s);
                if(results){
                    res.json("added");
                    //res.render("EJS PAGE",{errors})
                }
                
            }
                    
            );
                
        }

    // console.log(name,email,passworzd);
    } catch (err) {
       console.error(err.message);
    }
});

// update employees;

router.get("/employee/update/:sin",middleware.ifsurvisor,async(req,res)=>{
    res.render("register");
});

router.put("/employee/update/:sin",middleware.ifsurvisor,async(req,res)=>{
    try {
        const {sin} = req.params;
        const {name,address,dob,doj,stid,sal,email,password,password2,ph} = req.body;
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
            
            await pool.query("CALL UPD_EMP($1,$2,$3,$4,$5,$6,$7,$8,$9,$10)",
            [sin,name,address,dob,doj,stid,sal,email,hashedpassword,ph],
            async(err,results)=>{
                if(err)
                console.log(err);
                // console.log(results.rows);
                if(results){
                    res.json(results.rows[0]);
                    //res.render("EJS PAGE",{errors})
                }
                
            }
                    
            );
                
        }

    // console.log(name,email,passworzd);
    } catch (err) {
       console.error(err.message);
    }   
});

router.delete("/employee/delete/:sin",middleware.ifsurvisor,async(req,res)=>{ //middleware.ifsurvisor,
	try {
		const {sin} = (req.params);
		
		const deleteMovie = await pool.query("CALL DEL_EMP($1)",
        [sin],
        (err,result)=>{
            if(result)
            // res.json("Deleted the tape");
		res.redirect("/employee");
        }
		);
		
	} catch (err) {
		console.error(err.message);
	}
});

module.exports = router;