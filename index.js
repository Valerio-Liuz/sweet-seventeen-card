import express from "express";
import mongoose from "mongoose";
import 'dotenv/config';
import Comment from "./model/comment.js"
const app = express()

const hostname = '127.0.0.1';
const port = 3000;

mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(() => console.log('Connected to MongoDB'))
.catch((err) => console.error('MongoDB connection error:', err));

app.use(express.urlencoded({extended:true}));
app.use(express.json());
app.set("view engine","ejs")
app.use(express.static('public'));

app.get("/",(req,res)=>{
    res.render("invitation")
})

app.get('/api/comments',(req,res)=>{
    Comment.find().then(results=>{
        res.json({user:results})
    })
})

app.post("/api/comments",(req,res)=>{
    const data = req.body
    if (data && Object.keys(data).length > 0){
        Comment.create(data).then(results=>{
            res.json({status:200})
        })
    }
    else{
        res.json({status:400,message:"Data tidak valid"})
    }
})

app.listen(port,()=>{
    console.log(`Server running at http://${hostname}:${port}`);
})
