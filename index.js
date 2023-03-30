const fast2sms = require("fast-two-sms");
var express = require("express");
const router = express.Router();
const bodyparser = require("body-parser");
const User = require("./model/user");
const mongoose = require("mongoose");
 
const app = express();

mongoose.connect('mongodb+srv://admin1:IgGTjZvjV5fJTfjf@cluster0.nrc6un4.mongodb.net/otp-auth?retryWrites=true&w=majority');

mongoose.connection.on('error', err=>{
    console.log('connection failed');
})

mongoose.connection.on('connected', connected=>{
    console.log('connected to database');
});

var otp = Math.floor(1000 + Math.random() * 9000);

app.use(bodyparser.urlencoded({ extended: false }));
 
app.use(bodyparser.json());
 
app.get("/", (req, res) => {
  res.sendFile(__dirname + "/index.html");
});
 
app.post("/sendmessage", (req, res) => {
  console.log(req.body.number);

  if(!req.body.number){
    return res.status(500).json({
        error: err
    });
    }else{



    const user = new User({
        _id: new mongoose.Types.ObjectId(),
        phone: req.body.number,
        otp: otp
    })

    sendMessage(res);

    user.save()
            .then(result => {
                console.log(result);
                // res.status(200).json({
                //     new_user : result
                // })
            }).catch(err => {
                res.status(500).json({
                    error : err
                })
            });
    }
 
  
});
 
function sendMessage(res) {
  var options = {
    authorization: 'wxBe5Svz82h7MfyQVXL1pYIqNFGbHsjmlkoA36ndi0aJtUTcWOMCD3JLvRyeFO80g6ZTxSHVlhEUtrmG',
    message: 'Your OTP is ' + otp,
    numbers: [9352738869],
  };
 
  // send this message
 
  fast2sms
    .sendMessage(options)
    .then((response) => {
      res.send("SMS OTP Code Sent Successfully");
      console.log("SMS OTP Code Sent Successfully")
    })
    .catch((error) => {
      res.send("Some error taken place");
    });
}


// router.post('/signup', (req, res, next) => {`
app.post('/verify', (req, res, next) => {
    User.find({phone: req.body.number})
    .exec()
    .then(user => { 
        if(user.length < 1){
            return res.status(401).json({
                message: 'Auth failed'
            });
        }
        if(user.slice(-1)[0] .otp == req.body.otp){
            return res.status(200).json({
                message: 'Auth successful'
            });
        }
        res.status(401).json({
            message: 'Auth failed'
        });
    })
    .catch(err => {
        console.log(err);
        res.status(500).json({
            error: err
        });
    });
});




app.listen(5000, () => {
  console.log("App is listening on port 5000");
});