var server = require("http");
var file_system = require("fs");
var my_url = require("url");
var form_access = require("formidable");
var mongodb = require("mongodb").MongoClient;

var my_mongo_url = "mongodb+srv://hakimahafizi:*********@hakimah.fqjtcln.mongodb.net/?retryWrites=true&w=majority"

var client = new mongodb(my_mongo_url);



function mongo_db_get_data(res){
        var my_db = client.db("batch2024")
        var query = {}
    
            my_db.collection("FinalProject").find({}).toArray(function(err, result){
                if (err) {
                    console.error("Error querying MongoDB:", err);
                    res.writeHead(500, {'Content-Type': 'text/plain'});
                    res.end("Internal Server Error");
                    return;
                }
                console.log(err);
            res.writeHead(200, {'Content-Type':'application/json'});
            res.write(JSON.stringify(result));
            res.end();

        })

}
// #This is the data that will be inserted into our database

function insert_data_to_mongo(data){
    
        var my_db = client.db("batch2024")
        
        var query = {}
    
        my_db.collection("FinalProject").insertOne(data,function(err){
            console.log(err);
            

        })

}


server.createServer(function(req, res) {
    // res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000');
    // res.setHeader('Access-Control-Allow-Methods', 'OPTIONS, POST, GET');
    // res.setHeader('Access-Control-Allow-Headers', 'Content-Type'); 
    // if (req.method === 'OPTIONS') {
    //     // Pre-flight request
    //     res.writeHead(200);
    //     res.end();
    //     return;
    //   }
    var query = my_url.parse(req.url, true);
    var my_path = query.pathname;

    if (my_path == "/form"){
        file_system.readFile("form.html", function(err, data){
            res.writeHead(200, {'Content-Type':'text/html'});
            res.write(data);
            res.end();
        })
    }
    else if (my_path == "/form_submit"){
        console.log("called form submit")
        var my_form = new form_access.IncomingForm();
        my_form.parse(req, function(err,field,file){
            console.log(field)
            if (field.u_name != null){
            var user_name = field.u_name;
            var user_age = field.u_age;
            var user_city = field.u_city;
            var user_hobby = field.u_hobby;
            var my_mongo_object = {
                                name:user_name,
                                age:user_age,
                                city:user_city,
                                Hobby:user_hobby,
                            }
            insert_data_to_mongo(my_mongo_object)
            }
            res.writeHead(200, {'Content-Type':'text/html'});
            res.write("Form Submitted");
            res.end();
        })
        
    }
    // else if(my_path == "/all_data"){
    //     console.log ('any message')
    //     mongo_db_get_data(res)
    // }
    else{
        res.writeHead(200, {'Content-Type':'text/html'});
        var return_string = "Incorrect path chosen"
        res.write(return_string);
        res.end();
    }

    }
).listen(8088);
