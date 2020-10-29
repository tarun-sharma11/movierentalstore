const LocalStrategy = require("passport-local").Strategy;
const { pool } = require("./db");
const bcrypt = require("bcrypt");

function initialize(passport){
    const authenticateUser = async(email,password,done)=>{
        try {

            const search = await pool.query(
                "SELECT * FROM EMPLOYEES WHERE EMAIL=$1",
                [email]);
                // console.log(search.rows);
                if(search.rows.length>0)
                {
                    const user = search.rows[0];
                        bcrypt.compare(password,user.password,(err,isMatch)=>{
                            if(err){
                                
                                console.error(err.message);
                            }
                            if(isMatch){
                                
                                return done(null,user);
                            }
                            else{
                                
                                return done(null,false,{message:"Password is not correct"})
                            }
                        })
                    }
                    else{
                                console.log("err mail");
                                return done(null,false,{message:"Email not registered"});
                            }

        } catch (error) {
            console.log(error);
        }
        
        
    };

    passport.use(
        'employees',
        new LocalStrategy(
            {
                usernameField: "email",
                passwordField: "password"
            },
            authenticateUser
        )
    );

    passport.serializeUser((user,done)=> done(null,user.sin));

    passport.deserializeUser(async(id,done)=>{
        await pool.query(
            "SELECT * FROM EMPLOYEES WHERE SIN = $1",[id],(err,results)=>{
                if(err){
                    console.error(err.message);
                }
                return done(null,results.rows[0]);
            }
        )
    })
}

 module.exports = initialize;
