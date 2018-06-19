var express=require('express');
var app=express();
var bodyParser=require('body-parser');
var pg=require('pg');
var path=require('path');
//
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static(path.join(__dirname,'/public')));
//
//connecting to postgres database
var url='postgres://postgres:password@localhost:5432/mydb';
var client=new pg.Client(url);
client.connect(function(error){
if(error){
        console.log('error in connecting with database');
        throw error;
}else{
console.log('Connected!');
}
});
/////

////CREATING CONTACT
app.post('/details',function(req,res){
    var per=[
        name=req.body.name,
        phone=req.body.phone
]
client.query('INSERT INTO people(name,phone) VALUES($1,$2) RETURNING* ',per ,function(err,result){
    if(err){
    console.log('error in inserting values');
    throw err;
}else{
console.log('values inserted');
res.send(result.rows);
}
});
});
//////////////////

app.post('/delete',function(req,res){
    var phone=req.body.phone;
    client.query('SELECT * FROM people WHERE phone=$1 ',[phone],function(error,result){
    if(error){
        console.log('error in deleting');
    }else{
        if(result.rowCount>0){
                client.query('DELETE FROM people WHERE phone=$1',[phone],function(err,rest){
                        if(err){
                            console.log('error inside');
                        }else{
                            console.log('deleted contact');
        
                            res.send(JSON.stringify(result.rows) + " is deleted!");
                        }
                });
        }else{
                console.log('no user with that number');
                res.send('NO user with that number');
        }
    }
    });
});


///SEARCHING A CONTACT

app.post('/search',function(req,res){
    var name=req.body.name;
    client.query('SELECT * FROM people WHERE name=$1',[name],function(error,result){
        if(error){
            console.log('error in searching');
            throw error;
        }else{
            if(result.rowCount>0){
                console.log('SEARCH SUCCESSFUL!');
                res.send(result.rows);
            }else{
                console.log('No user with that name!');
                res.send('no user with that name');
            }

    }
    });
    });
///////////////

app.listen(4000);


