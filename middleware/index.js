const middlewareObj = {};
const {pool} = require("../db");

middlewareObj.ifAuthenticated = (req,res,next)=>{
    if(req.isAuthenticated()){
        const iden= (req.user.sin);
        pool.query("select sin from employees where sin=$1",[iden],(err,results)=>{
            if(err){
                return res.redirect("back");
            }
            if(results.rows.length > 0){
                
                return next();
            }
        })
    }
    else{
        return res.redirect("/user/login");
    }
}
middlewareObj.ifnotAuthenticated = (req,res,next)=>{
    if(req.isAuthenticated()){
        return res.redirect("back");
    }
    else{
        return next();
    }
}

middlewareObj.ifcustomer = (req,res,next)=>{
    if(req.customerAuthenticate()){
        return next();
    }
    else
        return res.redirect("/homepage");
}

middlewareObj.ifsurvisor = (req,res,next)=>{
    if(req.isAuthenticated()){
        const iden= (req.user.sin);
        pool.query("select sin from supervisors where sin=$1",[iden],(err,results)=>{
            if(err){
                return res.redirect("back");
            }
            if(results.rows.length > 0){
                
                return next();
            }
        })
    }
    else{
        return res.redirect("back");
    }
}

middlewareObj.dba = (req,res,next)=>{
    if(req.isAuthenticated()){
        const iden= (req.user.sin);
        
            
            if(iden===1010){
                
                return next();
            }
            else{
                return res.redirect("back");
            }
    
        
    }
}

middlewareObj.ifcustomer = (req,res,next)=>{
    if(req.isAuthenticated()){
        return next();
    }
    else{
        return res.redirect("/customer/login");
    }
}

module.exports = middlewareObj;