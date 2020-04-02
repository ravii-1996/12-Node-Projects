const express = require('express');
const bodyparser = require('body-parser');
const path = require('path');
const nodemailer = require('nodemailer'); // to sent a mail

const app = express();

app.use(bodyparser.json());
app.use(bodyparser.urlencoded({extended: false}));

app.get('/', function(req,res){
  res.sendFile(path.join(__dirname+'/views/home.html'));
});

app.get('/home', function(req,res){
  res.redirect('/');
});

// render contact details..
app.get('/contact', function(req,res){
  res.sendFile(path.join(__dirname+'/views/contact.html'));
});


// call when submit button hit..with help of form action
app.post('/contact/send', function(req,res){

  //in createtransporter we pass object which contains details of host --id, pswd and service..
  var transporter = nodemailer.createTransport({
    //host: 'smtp.mailtrap.io',    // if you sent through smtp
    //port: '2525',       // mention the port if use smtp
    //pool : true       // if we have to send multiple mails 
    service : 'Gmail',
    auth: {
      user: "raviprakash****@gmail.com",    // host mail id
      pass:'*****'    // host pswd
    }
  })

  // contains the details which you want to send...

  var mailOptions ={
    from : 'World.com <raviprakash392@gmail.com>',
    to: req.body.email,
    subject : 'Welcome in World.com',
    text : 'Hello , \nYou visited World.com with following details : ' + req.body.email + '. Your Registered Number: '+req.body.message+ "\n\n\n" +
    "Have a nice Day!" 
    // it can also contains html...
  }

  // use transporter to send the mail object which we wrote above...
  transporter.sendMail(mailOptions, function(error,info){
    if(error){
      console.log(error);
      res.redirect('/');
    }
      
    else{
      console.log("Message sent !"+ info.response)    // info response give the satatus of mail...and time taken to sent a mail.
      res.redirect('/');
    }
  })

})

app.listen(3000);
console.log("Server Is working...!");
