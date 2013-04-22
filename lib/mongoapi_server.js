var mongo = require("mongoskin");
var _app = {};
var _ = require("underscore")._;

var MongoApiServer = function(app){

  //assume localhost
  var connect = function(dbName,next){
    var db = mongo.db("localhost/" + dbName, {safe : true});
    next(db);
  }

  //root - send down the links
  app.get("/mongo-api", function(req,res){
    var out = {
      root : "/mongo-api/dbs",
      database : "/mongo-api/:database",
      collection : "/mongo-api/:database/:collection",
      document : "/mongo-api/:database/:collection/:id"
    }
    res.json(out);
  });

  //stubbed query method for later use
  app.post("/mongo-api/query", function(req,res){
    var dbName = req.body.db;
    var collection = req.body.collection;
    var queryText = req.body.query;
    if(queryText.substring(0,1) != "{"){
      queryText = "{" + queryText + "}";
    }
    var query = JSON.parse(queryText);
    connect(dbName, function(db){
      db.collection(collection).find(query).toArray(function(err,response){
        res.json(response);
      });    
    })

  });

  //list of all databases
  app.get("/mongo-api/dbs",function(req,res){
    var out = [];
    connect("admin",function(db){
      db.admin.listDatabases(function(err,result){
        var out = [];
        _.each(result.databases,function(item){
          var formatted = {
            name : item.name,
            details : "/mongo-api/" + item.name,
            type : "database"
          }
          out.push(formatted);
        });
        res.json(out);
      });
    });
  });
  
  app.delete("/mongo-api/dbs",function(req,res){
    var dbName = req.query.name
    if(!dbName) throw {error : "Need a db to delete"}
    connect(dbName, function(db){
      db.dropDatabase(function(err,result){
        if(err) throw({error : err});
        res.send("OK")
      });
    });
  });
  app.post("/mongo-api/dbs",function(req,res){
    var dbName = req.body.name;
    if(!dbName) throw({error : "Need a database name"});
    connect(dbName, function(db){
      db.createCollection("users",function(err,result){
        res.json(formatDbResponse(dbName));
      });
    });
    
  });

  app.get("/mongo-api/:db",function(req,res){
    var dbName = req.params.db;
    connect(dbName, function(db){
      var out = [];
      db.collectionNames(function(err,collNames){
        _.each(collNames, function(collName){
          var cleanName = collName.name.replace(dbName + ".","");
          var formatted = {
            name : cleanName,
            details : "/mongo-api/" + dbName + "/" + cleanName,
            database : dbName,
            type : "collection"
          };
          if(cleanName != "system.indexes")
            out.push(formatted);
        });
        res.json(out);
      });
    });
  });

  app.post("/mongo-api/:db",function(req,res){
    //adds a collection
    var collectionName = req.body.name;
    var dbName = req.params.db;
    var out = [];
    connect(dbName, function(db){
      db.createCollection(collectionName, function(err,result){
        var out = {
          name : collectionName,
          type : "collection",
          details : "/mongo-api/" + db + "/" + collectionName
        };
        res.json(out);
      });
    });
  });

  app.get("/mongo-api/:db/:collection",function(req,res){
    var dbName = req.params.db;
    var collName = req.params.collection;
    var out = [];
    connect(dbName, function(db){
      db.collection(collName).find().limit(50).toArray(function(err,items){
        var out = [];
        _.each(items,function(item){
          var formatted = {
            name : item.name,
            id : item._id,
            details : "/mongo-api/" + dbName + "/" + collName + "/" + item._id,
            type : "document"
          };
          out.push(formatted)
        });
      
        res.json(out);
      });
    });
  });
  app.get("/mongo-api/:db/:collection/:id",function(req,res){
    var dbName = req.params.db;
    var id = req.params.id;
    var collName = req.params.collection;
    connect(dbName, function(db){
      db.collection(collName).findById(id,function(err,doc){
        var out = {
          database : dbName,
          collection : collName,
          id : id,
          document : doc
        }
        res.json(out);
      });
    });
  });
  app.delete("/mongo-api/:db", function(req,res) {
    var dbName = req.params.db;
    var collectionName = req.query.name;
    connect(dbName, function(db){
      db.dropCollection(collectionName,function(err,result){
        res.json(result);
      });   
    });
  });

  app.delete("/mongo-api/:db/:collection/:id",function(req,res){
    var dbName = req.params.db;
    connect(dbName, function(db){
      db.collection(req.params.collection).removeById(req.params.id,function(err,result){
        res.json(result);
      });
    });
  });
 
  app.post("/mongo-api/:db/:collection",function(req,res){
    var dbName = req.params.db;
    connect(dbName, function(db){
      var doc = req.body;
      db.collection(req.params.collection).insert(doc, function(err,result){
        var out ={error : err, result : result}; 
        res.json(out);
      });
    });
  });
  
  app.put("/mongo-api/:db/:collection/:id",function(req,res){
    var dbName = req.params.db;
    connect(dbName, function(db){
      var doc = req.body;
      delete doc._id;
      db.collection(req.params.collection).updateById(req.params.id, doc, {}, function(err,result){
        var out ={error : err, result : result}; 
        res.json(out);
      });
    });
  });

  return app;

};

module.exports = MongoApiServer;
