const express =require('express');//includes express
const app = express(); //calls the express method
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
//cross origin resource sharing
const cors = require('cors');//cross origin restriction to be waived
const bcrypt = require('bcryptjs');
const config = require('./config.json');
const product = require('./Products.json');
const Product = require('./models/products.js');
const User = require('./models/users.js');
const Project = require('./models/projects.js')
const port = 3001;

//use ends here
app.use((req,res,next)=>{
 console.log(`${req.method} request ${req.url}`);
  next();
})

app.use(bodyParser.json());//calling body parser method
app.use(bodyParser.urlencoded({extended:true}));//using default
app.use(cors()); //calling cors method
app.get('/',(req,res)=> res.send('Hello! I am from the backendsssss'))

// Connect to mongoose Database:::::::::::::::::::::::::::::::::::::::::::::::
 mongoose.connect(`mongodb+srv://${config.MONGO_USER}:${config.MONGO_PASSWORD}@cluster0.${config.MONGO_CLUSTER_NAME}.mongodb.net/Sample?retryWrites=true&w=majority`, {useNewUrlParser: true,useUnifiedTopology: true})
.then(()=>console.log('DB connected!'))
.catch(err=>{
  console.log(`DBConnectionError:${err.message}`);
});


// Project Methods:::::::::::::::::::::::::::::::::::::::::::::::::::::::::::

//post method to write or create a document in mongodb
app.post('/addProject',(req,res)=>{
  const dbProject = new Project({
    _id : new mongoose.Types.ObjectId,
    title : req.body.title,
    description: req.body.description,
    image_url : req.body.image_url,
    author: req.body.author
  });
  //save to the database and notify the user
  dbProject.save().then(result=>{
    res.send(result);
  }).catch(err=>res.send(err));
})

//retrieve objects or documents from the database
app.get('/allProjectsFromDB',(req,res)=>{
  Project.find().then(result=>{
    res.send(result);
  })
})

//patch is to update the details of the objects
app.patch('/updateProject/:id',(req,res)=>{
  const idParam = req.params.id;
  Project.findById(idParam,(err,project)=>{
    if (project['user_id'] == req.body.userId){
      const updatedProject = {
        title : req.body.title,
        description: req.body.description,
        image_url : req.body.image_url,
        author: req.body.author
      }
      Project.updateOne({_id:idParam}, updatedProject).
      then(result=>{
        res.send(result);
      }).catch(err=> res.send(err));
    } else{
      res.send('error: Project not found')
    }//else
  })
})

//delete a product from database
app.delete('/deleteProject/:id',(req,res)=>{
  const idParam = req.params.id;
  Project. findOne({_id:idParam}, (err,product)=>{
    if(product){
      Project.deleteOne({_id:idParam},err=>{
        res.send('deleted');
    });
    } else {
      res.send('not found');
    } //else
  }).catch(err=> res.send(err));
});//delete


//get method to access data from projects.json
//routing to the endpoint
app.get('/allProjects', (req,res)=>{
  res.json(project);
})

app.get('/projects/p=:id',(req,res)=>{
  const idParam = req.params.id;
  for (let i =0; i<product.length; i++){
    if (idParam.toString() === product[i].id.toString()){
      res.json(product[i]);
    }
  }
});
// ::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::
//                          User Methods
// :::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::
// register a new user
app.post('/registerUser',(req,res)=>{
  //checking if user is found in the db already
  User.findOne({username:req.body.username},(err,userResult)=>{
    if (userResult){
      res.send('username taken already. Please try another name');

    } else {
      const hash = bcrypt.hashSync(req.body.password); //encrypts MONGO_PASSWORD
      const user = new User({
        _id : new mongoose.Types.ObjectId,
        username : req.body.username,
        email : req.body.email,
        password : hash
      });
      //saves to database and notify the user
      user.save().then(result=>{
        res.send(result);
      }).catch(err=>res.send(err));
    }
  })
});

//view all users
app.get('/allUser',(req,res)=>{
  User.find().then(result=>{
    res.send(result);
  })
});

//login the user
app.post('/loginUser', (req,res)=>{
  User.findOne({username:req.body.username},(err,userResult)=>{
    if (userResult){
      if (bcrypt.compareSync(req.body.password, userResult.password)){
        res.send(userResult);
      } else {
        res.send('not authorized');
      }//inner if
    } else {
       res.send('user not found. Please register');
    }//outer if
  });//findOne
});//post



//listening to port

app.listen(port,()=>console.log(`My fullstack application is listening on port ${port}`))
