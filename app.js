var mysql = require('mysql');
var express = require('express');
var app = express();
var bodyParser = require('body-parser');
app.set("view engine","ejs");
app.use(bodyParser.urlencoded({ extended: false }))

var conn = mysql.createConnection({
    host:'localhost',
    user:'root',
    password:'',
    database:'exam1'
})

conn.connect();
if(conn){
    console.log('Database Connected');
}

app.get('/',function(req,res){
    res.render('user');
})

// Login Data
var loginid;
var logoutids;
app.post('/',function(req,res){
    var email = req.body.email;
    var pwd = req.body.password;
    var CheckData = "SELECT * FROM user WHERE email ='"+email+"' AND password = '"+pwd+"'";
    conn.query(CheckData ,function(err,result){
        if(err) throw err;

        else {
            loginid = result[0].uid;
            logoutids = loginid;
            var times = new Date();
            var UpdateData = "UPDATE user SET login = '"+times+"' where uid='"+loginid+"' ";
            conn.query(UpdateData,function(err,result){
                if(err) throw err;

                else{
                    res.redirect('/dashboard');
                }
            })
        }
    })
})

app.get('/dashboard',function(req,res){

    res.render('Dash');
})

app.get('/logout',function(req,res){
    // var dates = new Date();
    var times = new Date();
    var UpdateLogout = "UPDATE user SET logout = '"+times+"' where uid='"+logoutids+"' ";
    var DurationTime = "SELECT * FROM user where uid='"+logoutids+"'";
    conn.query(UpdateLogout,function(err,result){
        if(err) throw err;

        else{
            conn.query(DurationTime,function(err,result){
                if(err) throw err;

                else{
            var loginDate = new Date(result[0].login);
            var logoutDate = new Date(result[0].logout);
            var durationMs = logoutDate - loginDate;

            // Calculate hours, minutes, and seconds
            var hours = Math.floor(durationMs / (1000 * 60 * 60));
            var minutes = Math.floor((durationMs % (1000 * 60 * 60)) / (1000 * 60));
            var seconds = Math.floor((durationMs % (1000 * 60)) / 1000);

            var duration = `${hours} hours, ${minutes} minutes, ${seconds} seconds`;

                    var UpdateDuration = "UPDATE user SET duration = '"+duration+"' where uid='"+logoutids+"' ";
                    conn.query(UpdateDuration,function(err,result){
                        if(err) throw err;

                        else{
                            res.redirect('/');
                        }
                    })
                }
            })
        }
    })
})

app.listen(3000,function(){
    console.log('Server Running at 3000 PORT');
});


