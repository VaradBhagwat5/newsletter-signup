const express = require("express")
const https = require("https")
const bodyParser = require("body-parser")
const request = require("request")
require('dotenv').config();

const app = express()
// app.use(express.static("public"))
app.use(bodyParser.urlencoded({extended: true}))

app.get("/", function(req, res){
    res.sendFile(__dirname + "/signup.html")
})

app.post("/", function(req, res){
    const fname = req.body.firstName
    const lname = req.body.lastName
    const email = req.body.email
    
    const data = {
        members: [
            {
                email_address: email,
                status: "subscribed",
                merge_fields: {
                    FNAME: fname,
                    LNAME: lname
                }
            }
        ]
    }
    const JSONdata = JSON.stringify(data)

    const url = "https://us15.api.mailchimp.com/3.0/lists/"+ process.env.AUDIENCE_ID

    const options = {
        method: "POST",
        auth: `varad:${process.env.API_KEY}`
    }

    const request = https.request(url, options, function(response){

        if( response.statusCode === 200){
            res.sendFile(__dirname + "/success.html")
        }else{
            res.sendFile(__dirname + "/failure.html")
        }

        response.on("data", function(data){
            console.log(JSON.parse(data))
        })
    })

    request.write(JSONdata)
    request.end()
})

app.post("/failure", function(req, res){
    res.redirect("/")
})


app.listen(process.env.PORT || 3000, function(){
    console.log("Server started on port 3000.")
})