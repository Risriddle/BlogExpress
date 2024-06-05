const express=require('express')
const bcrypt = require('bcrypt');
const session = require('express-session');
const app=express()

const path=require('path')
const port=process.env.PORT||5000


// Middleware
app.use(express.urlencoded({ extended: true }));
require('dotenv').config();
app.use(session({
    secret: process.env.SECRET_KEY,
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false } // Set to true if using HTTPS
}));

//jade config
app.set('views', __dirname+'/views');
app.set('view engine', 'jade');

//database connection
// require('dotenv').config();
const mongoose = require('mongoose');
const uri = process.env.MONGODB_URI;
mongoose.connect(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('Connected to MongoDB'))
.catch(err => console.error('Failed to connect to MongoDB', err));
// const BlogPost = require('./model.js'); // Import the blogs model
const {Users,BlogPost} = require('./model.js'); // Import the users model



//serve static content
app.use(express.static(path.join(__dirname,"public")))


//to parse the data received in requests
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


//routes
app.get('/',(req,res)=>{
    res.redirect('home')
})

app.get('/home',(req,res)=>{
    
    res.render('home')
})

app.get('/blogsUser',async(req,res)=>{
  try {
    const blogs = await BlogPost.find().select('title image');

    // res.json({blogs:blogs})
   res.render('blogs',{blogs:blogs});
   console.log(blogs)
  } catch (error) {
      res.status(500).json({ error: 'Internal server error' });
  }
  
})
app.get('/blogUser/:id',async(req,res)=>{
    
      const blogId = req.params.id;
      BlogPost.findById(blogId)
      .then(blog => {
        if (!blog) {
          return res.status(404).send('Blog post not found');
        }
        res.render('blog',{blog:blog}); 
      })
      .catch(err => {
        console.error('Error finding blog post:', err);
        res.status(500).send('Internal Server Error');
      });})



app.get('/register',(req,res)=>{res.render('register')})
app.post('/register',async (req,res)=>
{
  const name=req.body.name
  const pass=req.body.password
  const username=await Users.findOne({ name: name });
  
  if (username){
       console.log(username)
       res.render('register',{msg:"This username is already taken. Enter another to proceed."})
  }
  else{
    try{
      const hashedPass= await bcrypt.hash(pass, 10); // 10 is the salt rounds

    const newUser=new Users({
      name:name,
      password:hashedPass
    });
    console.log(newUser)
    const savedPost = await newUser.save();
    res.render('login',{msg:"Registration Successful. Now Log in"})
  }
  catch (err) {
    res.status(400).json({ error: err.message });
  }
  }
})

      
app.get('/login',(req,res)=>{res.render('login')})
app.post('/login', async (req, res) => {
  const name = req.body.name;
  const pass = req.body.password;
  try {
      const user = await Users.findOne({ name: name });
      if (!user) {
          return res.render('login', { msg: 'User not found' });
      }

      const isMatch = await bcrypt.compare(pass, user.password);
      if (isMatch) {
          // Set user information in session
          req.session.user = {
              name: user.name,
              isAdmin: user.name === 'Magia' 
          };

          if (req.session.user.isAdmin) {
              // Redirect admin to admin panel
              return res.redirect('/admin');
          } else {
              // Redirect regular user to home
              return res.redirect('/home');
          }
      } else {
          return res.render('login', { msg: 'Invalid username or password' });
      }
  } catch (err) {
      console.error('Login error:', err);
      res.status(500).send('Internal Server Error');
  }
});

// Middleware to check if the user is an admin
function isAdminn(req, res, next) {
  // Check if the user is authenticated and is an admin
  if (req.session.user && req.session.user.isAdmin) {
      // User is an admin, proceed to the next middleware/route handler
      next();
  } else {
      // User is not an admin, deny access
      res.status(403).send("Access Denied: Admins Only");
  }
}


//for admin tasks
app.get('/blogs',async(req,res)=>{
  try {
    const blogs = await BlogPost.find().select('title');
    res.json({blogs:blogs})   
  } catch (error) {
      res.status(500).json({ error: 'Internal server error' });
  }
  
})
app.get('/blog/:id',async(req,res)=>{
    
      const blogId = req.params.id;
      BlogPost.findById(blogId)
      .then(blog => {
        if (!blog) {
          return res.status(404).send('Blog post not found');
        }
        res.json({blogs:blog})
       })
      .catch(err => {
        console.error('Error finding blog post:', err);
        res.status(500).send('Internal Server Error');
      });})


app.get('/admin', isAdminn, (req, res) => {
  res.render('admin'); 
});

// Route to handle creating a new blog post (accessible only to admins)
app.get('/create',isAdminn, (req, res) => {
  res.render('create'); // Render the create blog post form
});

// Route to handle deleting a blog post
app.delete('/delete/:id',isAdminn, async (req, res) => {
  try {
      const { id } = req.params;
      const result = await BlogPost.findByIdAndDelete(id);
      if (!result) {
          return res.status(404).json({ message: 'Blog not found' });
      }
      res.status(200).json({ message: 'Blog deleted successfully' });
  } catch (error) {
      res.status(500).json({ message: 'Server error' });
  }
});



// Route to handle updating a blog post (accessible only to admins)
app.put('/update/:id', isAdminn, async (req, res) => {
  try {
    const { id } = req.params;
    const { title, author, body,date } = req.body;

    const updatedBlog = await BlogPost.findByIdAndUpdate(
      id,
      { title, author, body,date },
      { new: true }
    );

    if (!updatedBlog) {
      return res.status(404).send('Blog post not found');
    }
    
    res.json(updatedBlog);
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
});

// const fs = require('fs').promises;

app.post('/create',isAdminn,async (req, res) => {
    try {
      // await fs.rename(req.file.path, path.join(__dirname, 'public', 'images', req.file.originalname));

  
      const newPost = new BlogPost({
        author: req.body.author,
        title: req.body.title,
        body: req.body.body,
        // image:'/images/' + req.body.image
      });
      console.log(newPost)
      const savedPost = await newPost.save();
      res.send("Blog added successfully")
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  });


app.listen(port,()=>{console.log("app is available on http://localhost:5000")})