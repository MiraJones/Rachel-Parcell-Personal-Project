var express = require("express");
var bodyParser = require("body-parser");
var massive = require("massive");
var session = require("express-session");
var c = require("./controller");


require("dotenv").config();
var app = express();
app.use(express.static(( `${__dirname}/../build` )))
app.use(bodyParser.json())

var {SERVER_PORT, URI, SESSION_SECRET, } = process.env

app.use(session({
    secret: SESSION_SECRET,
    resave: false,
    saveUninitialized:true
}))

massive(URI).then(db => {
    console.log("connected to the database")
    app.set('db', db)
})

var checkForSession = (req, res, next)=>{
    console.log('middleware')
        console.log("hit")
        req.session.user = {id:0, loggedIn:false, orderId:0}
        next()
};

app.get("/api/allProducts", c.read)
app.post("/api/loginUser", checkForSession, c.check)
app.post("/api/allUserInfo", c.allInfo)
app.post("/api/newUser", checkForSession, c.newUser)
app.get("/api/getDresses", c.dresses)
app.get("/api/getTops", c.tops)
app.get("/api/getSkirts", c.skirts)
app.get("/api/getSpring", c.spring)
app.get("/api/product/:id", c.item)
app.post("/api/addToCart/:id", c.addToCart)
app.post("/api/getCart", c.cart)
app.delete("/api/deleteItem/:id", c.delete)
app.post("/api/payment", c.payment)
app.post("/api/newQuantity", c.newQuantity)
app.post("/api/updateTotal", c.updateTotal)


app.listen(SERVER_PORT, console.log(`Zombies to fight on port ${SERVER_PORT}`))