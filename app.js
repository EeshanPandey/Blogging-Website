var express = require("express");
var app = express();
var bodyParser = require("body-parser");
var expressSanitizer = require("express-sanitizer");
var mongoose  = require("mongoose");
var methodOverride = require("method-override");
mongoose.connect(process.env.DATABASEURL, {useNewUrlParser: true, useUnifiedTopology: true});

//mongoose.connect("mongodb://localhost:27017/restful_blog_app", {useNewUrlParser: true});
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));
app.use(expressSanitizer());
app.use(methodOverride("_method"));
app.set("view engine", "ejs");

var blogSchema = new mongoose.Schema({
	title: String,
	image: String,
	body: String,
	created: {type: Date, default: Date.now}
});

var Blog = mongoose.model("Blog", blogSchema);

app.get("/", function(req,res){
	res.redirect("/blogs");
});

app.get("/blogs", function(req,res){
	Blog.find({}, function(err, blogs){
		if(err){
			console.log("ERROR!");
		}
		else{
			res.render("index", {blogs: blogs});
		}
	});
	
});

app.get("/blogs/new", function(req,res){
	res.render("new");
});

app.post("/blogs", function(req,res){
	//create blog
	req.body.blog.body = req.sanitize(req.body.blog.body)
	Blog.create(req.body.blog, function(err, newBlog){
		if(err){
			res.render("new")
		}
		else{
			res.redirect("/blogs")
		}
		
	})
	
	//redirect
});

app.get("/blogs/:id", function(req,res){
	Blog.findById(req.params.id, function(err, foundBlog){
		if(err){
			res.redirect("/blogs");
		}
		else{
			res.render("show", {blog: foundBlog})
		}
	})
	
});

app.get("/blogs/:id/edit", function(req,res){
	Blog.findById(req.params.id, function(err, foundBlog){
		if(err){
			res.redirect("/blogs")
		}
		else{
			res.render("edit", {blog: foundBlog})
		}
	})
	
})

//update route
app.put("/blogs/:id", function(req, res){
	req.body.blog.body = req.sanitize(req.body.blog.body)
	Blog.findByIdAndUpdate(req.params.id, req.body.blog, function(err, updatedBlog){
		if(err){
			res.redirect("/blogs")
			
		}
		else{
			res.redirect("/blogs/"+req.params.id);
		}
	})
		
		
	
});

app.delete("/blogs/:id", function(req,res){
	//destroy
	Blog.findByIdAndRemove(req.params.id, function(err){
		if(err){
			res.redirect("/blogs");
		}
		else{
			res.redirect("/blogs");
		}
	})
	
	//redirect
});







app.listen(4000, function(){
	console.log("Server Started");
})