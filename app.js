const express = require("express");
const app = express();
const cusapp = express();
const seed = require("./seedDB");
const methodOverride = require("method-override");
const bodyParser = require("body-parser");
const session = require("express-session");
const passport = require("passport");
// const userPassport = require("passport");
const router = express.Router();
const initializePassport = require("./passportConfig");
initializePassport(passport);
const userIniPassport = require("./userPassportConfig");
userIniPassport(passport);


app.use(express.json());
app.use(bodyParser.urlencoded({extended:true}));
app.use(
	session ({
		secret: "This backend was created by Tarun",
		resave : false,
		saveUninitialized: false
	})
);
// cusapp.use(express.json());
// cusapp.use(bodyParser.urlencoded({extended:true}));
// cusapp.use(
// 	session ({
// 		secret: "This backend was created by Tarun",
// 		resave : false,
// 		saveUninitialized: false
// 	})
// );
router.use(express.static(__dirname+"./public/"));
app.use(passport.initialize());
app.use(passport.session());
// cusapp.use(userPassport.initialize());
// cusapp.use(userPassport.session());        
app.set("view engine","ejs");
app.use(express.static("public"));   
app.use(methodOverride('_method'));
// cusapp.set("view engine","ejs");
// cusapp.use(express.static("public"));   
// cusapp.use(methodOverride('_method'));
// Seeding
seed.execute();
// Routes
const movieRouters = require("./routes/movies");
const loginRouters = require("./routes/login");
const distriRouters = require("./routes/distributor");
const empRouters = require("./routes/employees");
const rentRouters = require("./routes/rents");
const payRouters = require("./routes/payments");
const customRouters = require("./routes/customers");
const storeRouters = require("./routes/stores");
const userRouters = require("./routes/user");

app.use(movieRouters);
app.use(loginRouters);
app.use(distriRouters); 
app.use(empRouters);  
app.use(rentRouters);
app.use(payRouters);
app.use(customRouters);
app.use(storeRouters);
app.use(userRouters);



// Server config
app.listen(process.env.PORT || 8000, process.env.IP,()=>{
	console.log("DBMS Miniproject server started");
})	
        