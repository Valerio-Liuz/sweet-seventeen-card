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


// app.get("/api/products",(req,res)=>{
//     Product.find().then(result=>{
//         res.send(result)
//     })
// })

// app.put("/api/products",(req,res)=>{
//     const data = req.body
//     Product.findByIdAndUpdate('679ccca031aabe5f8a0dd63f',data).then(result=>{
//         Product.find().then(result=>{
//             res.send(result)
//         })
//     })
// })
// app.delete("/api/products",(req,res)=>{
//     Product.findByIdAndDelete('679cccc831aabe5f8a0dd641').then(result=>{
//         Product.find().then(result=>{
//             res.send(result)
//         })
//     })
// })
// Product.updateOne({ name: 'Old Name' }, { $set: { price: 50 } })
// Product.updateMany({ name: 'Old Name' }, { $set: { price: 50 } })
// Product.deleteOne({ name: 'Product to Delete' })









app.listen(port,()=>{
    console.log(`Server running at http://${hostname}:${port}`);
})