// Constants
const request = require('request');
const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const port = 3000;

app.use(bodyParser.urlencoded({
  extended: true
}));

app.listen(process.env.PORT || port, function() {
  console.log("Server started on port " + port);
});

app.use(express.static("public"))

app.get("/", function(req, res) {
  res.sendFile(__dirname + "/signup.html");

});

app.post("/", function(req, res) {
  var firstName = req.body.firstName;
  var lastName = req.body.lastName;
  var emailAddress = req.body.emailAddress;

  // Data to be sent to API (Need to reference MailChimp API docs for key/value pairs)
  var data = {
    members: [{
      email_address: emailAddress,
      status: "subscribed",
      merge_fields: {
        FNAME: firstName,
        LNAME: lastName
      }
    }]
  };
  var jsonData = JSON.stringify(data);

  // Options for Request NPM package (need to reference npm request docs)
  var options = {
    url: "https://us4.api.mailchimp.com/3.0/lists/5d3872fc06",
    method: "POST",
    headers: {
      "Authorization": "jordan c942c05d858a980a6850600b4267c3c4-us4"
    },
    body: jsonData
  };

  // Sending reqiest data tp MailChimp server
  // If request fails, then the error page is triggered
  // Only HTTP status 200 pages are considered a success.
  request(options, function(error, response, body) {
    if (error) {
      res.sendFile(__dirname + "/failure.html");
    } else {
      if(response.statusCode === 200){
      res.sendFile(__dirname + "/success.html");
    }
  else{
      res.sendFile(__dirname + "/failure.html");
  }}
  });
});

// If failure, redirect to home
app.post("/failure",function(req,res){
  res.redirect("/");
});
