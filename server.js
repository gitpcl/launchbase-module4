const express = require('express') //import express
const nunjucks = require('nunjucks') //import nunjucks
const routes = require("./routes")
const methodOverride = require('method-override')

const server = express() //create a server and execute express

server.set("view engine", "html")

server.use(express.urlencoded({ extended: true}))
server.use(express.static('public'))
server.use(methodOverride('_method'))
server.use(routes)

nunjucks.configure("views", {
    express: server,
    autoescape: false, //allows to print html in a variable
    noCache: true
})

server.listen(5000, function () { //initialize server on port 5000, callback is a function that executes after listen is executed
    console.log("server is running")
})