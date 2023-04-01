const fast2sms = require("fast-two-sms");
var express = require("express");
const router = express.Router();
const bodyparser = require("body-parser");
const User = require("./model/user");
const mongoose = require("mongoose");

const PORT = process.env.PORT || 5000;
 
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
 
app.post("/sendotp", (req, res) => {
  console.log(req.body.number);

  if(!req.body.number){
    return res.status(502).json({
        error: err
    });
    }else{



    const user = new User({
        _id: new mongoose.Types.ObjectId(),
        phone: req.body.number,
        otp: otp
    })

    sendMessage(req.body.number, res);

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
 
function sendMessage(number,res) {
  var options = {
    authorization: 'wxBe5Svz82h7MfyQVXL1pYIqNFGbHsjmlkoA36ndi0aJtUTcWOMCD3JLvRyeFO80g6ZTxSHVlhEUtrmG',
    message: 'This is your One Time Password (OTP) ' + otp + '. Please do not share this OTP with anyone.'	,
    numbers: [number]
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
                message: 'Authentication Failed'
            });
        }
        if(user.slice(-1)[0] .otp == req.body.otp){
            return res.status(200).json({
                message: 'Authentication Successful'
            });
        }
        res.status(401).json({
            message: 'Authentication failed'
        });
    })
    .catch(err => {
        console.log(err);
        res.status(500).json({
            error: err
        });
    });
});




app.listen(PORT, () => {
  console.log("App is listening on port 5000");
});
