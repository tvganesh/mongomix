/* 
 * A Bluemix application using  MongoDB & Node Express 
 * Developed by: Tinniam V Ganesh
 * Date: 06 Aug 2014
 * File: deleteuser.js
 */
var mongodb = require('mongodb');
var async = require('async');

//Create a callback function
var mycallback = function(err,results) {
    console.log("mycallback");
    if(err) throw err;
};

/* POST for delete function*/
exports.list = function(req, res) {
	
	if (process.env.VCAP_SERVICES) {
		  var env = JSON.parse(process.env.VCAP_SERVICES);
		  if (env['mongodb-2.2']) {
			var mongo = env['mongodb-2.2'][0]['credentials'];
		  }
		} else {
			   var mongo = {
			      "username" : "user1",
			      "password" : "secret",
			      "url" : "mongodb://user1:secret@localhost:27017/test"
		 }
	}
   
    // Setup connection to DB
    var MongoClient = mongodb.MongoClient;
	var db= MongoClient.connect(mongo.url, function(err, db) {
	  if(err) {
	    console.log("Failed to connect to the database");
	    return;
	  } else {
	    console.log("Connected to database");
	  }
	  
    // Get our form values. These rely on the "name" attributes
	var FirstName = req.body.firstname;
	var LastName = req.body.lastname;
	var Mobile = req.body.mobile;

	 async.series([
	                
	                function(callback)
	                { 
	                	collection = db.collection('phonebook', function(error, response) {
	              	      if( error ) {
	              	          console.log(error + "  Could not connect to database-1")
	              	          console.log("2");
	              	          return;
	              	          
	              	       }
	              	       else {
	              	          console.log("Connected to phonebook");
	              	          console.log("3");
	              	       }
	                	});
	                	callback(null, 'one');
	              	    
	                },
	                function(callback)
	                {
	                	console.log("222");
	                	// Insert the record into the DB
	                	// Delete the specified record
	                	
	                	collection.findOne(function(err, item) {
	                		console.log("Item is ="+ item);
	                         collection.remove(item, {justOne:true},(function (err, doc) {
	                             if (err) {
	                                 // If it failed, return error
	                                 res.send("There was a problem removing the information to the database.");
	                             }
	                            else {
	                               console.log("Removed------------")
	                               // If it worked redirect to userlist
	                               res.location("userlist");
	                               // And forward to success page
	                               res.redirect("userlist");
	                           }
	                          }));
	                         
	                       	
	                	});
	                	collection.find().toArray(function(err, items) {
    	    	            console.log("Length =----------------" + items.length);
    	    	            db.close();
                            });
	                	
	                	callback(null, 'two');
	                }
	               
	             ]);
   
 
	});
   
};
