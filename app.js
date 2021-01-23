const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const request = require('request');
const https = require('https');

const port = 4040;
// renders CSS to the browser
app.use(express.static("public"))

// 
app.use(bodyParser.urlencoded({extended:true}))

app.get('/',function(req,res){
    res.sendFile(__dirname + '/sign-up.html');
})

app.post('/',function(req,res){
    const firstName = req.body.fName;
    const lastName = req.body.lName;
    const email = req.body.email;

    const data = {
        // from mailchimps API
        members: [
            {
                email_address: email,
                status: "subscribed",
                merge_fields:{
                    FNAME:firstName,
                    LNAME:lastName
                }
            }
        ]
    };

    const jsonData = JSON.stringify(data);

    
    const url = "https://us7.api.mailchimp.com/3.0/lists/8476df53cc"

    // from nodejs doc https get section 
    const options = {
        method: "POST",
        auth:"anup1:8c786ac46445eab3619258e8ae8a2b86-us7"
    }

    const request = https.request(url, options, function(response){

        if(response.statusCode === 200){
            res.sendFile(__dirname + "/success.html")
        }else{
            res.sendFile((__dirname + "/failure.html"))
        }

        response.on("data", function(data){
            console.log(JSON.parse(data));
        })
    })
    request.write(jsonData);
    request.end();
})

app.post('/failure.html',function(req,res){
    res.redirect('/')
})

app.post('/success.html',function(req,res){
    res.redirect('/')
})
app.listen(process.env.PORT, function(){
    console.log('server running at port 4040');

})
// API Key
// 8c786ac46445eab3619258e8ae8a2b86-us7

// List ID
// 8476df53cc