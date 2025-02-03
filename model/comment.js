import mongoose from "mongoose";

const CommentSchema = mongoose.Schema({
    name:{
        type:String,
        require:[true,"Please enter product name"]
    },
    comment:{
        type:String,
        require:[true,"Komen dibutuhkan"]
    },
},{timestamps:true})

const Comment = mongoose.model("comment",CommentSchema)
export default Comment