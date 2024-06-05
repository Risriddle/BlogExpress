const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;


const BlogPostSchema = new Schema({
    author: { type: String, required: true },
    title: { type: String, required: true },
    body: { type: String, required: true },
    // image: { type: String },
    date: { type: Date, default: Date.now }
  });
  

const UsersSchema = new Schema({
    name: { type: String, required: true },
    password: { type: String, required: true },
  });

  const Users = mongoose.model('user', UsersSchema);
  

  
  const BlogPost = mongoose.model('blogPost', BlogPostSchema);
  


module.exports = {
  Users,
  BlogPost
};