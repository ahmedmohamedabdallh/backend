import Post from "../model/postModel.js";
import User from "../model/userModel.js";
import { v2 as cloudinary } from "cloudinary";

const createPost = async (req, res) => {
    try {
        const { postedBy, text } = req.body
        let {img}=req.body
        if (!postedBy || !text) {
            return res.status(400).json({ error: "postedby and text fields are required" })
        };
        const user = User.findById(postedBy)
        if (!user) {
            return res.status(404).json({ error: "user not found" })
        };


        if (postedBy.toString() !== req.user._id.toString()) {

            return res.status(401).json({ error: "Unauthorized to create post" })
        };
        const maxLength = 500
        if (text.length > maxLength) return res.status(400).json({ error: `Text must be less than ${maxLength} characters` });
        if(img){
            const uploadedResponse = await cloudinary.uploader.upload(img);
            img=uploadedResponse.secure_url
        }
        const newPost = new Post({ postedBy, text, img })
        await newPost.save();
        res.status(201).json(newPost);
    } catch (error) {
        res.status(500).json({ error: error.message })
    }
};
//getPost
const getPost = async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);

        if (!post) return res.status(404).json({ error: "post not found" });
        res.status(200).json( post )

    } catch (error) {
        res.status(500).json({ error: error.message })
    }
};
//deletePost
const deletePost = async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);
        if (!post) return res.status(404).json({ message: "post not found" });
        if (post.postedBy.toString() !== req.user._id.toString()) return res.status(401).json({ error: "Unauthorized to create post" });
        if(post.img){
            const imgId=post.img.split('/').pop().split('.')[0];
            await cloudinary.uploader.destroy(imgId)
        }
        await Post.findByIdAndDelete(req.params.id);
        res.status(200).json({ message: "Post deleted successfuly" });
    } catch (error) {
        res.status(500).json({ error: error.message })
    }
};
//likeUnlikePost
const likeUnlikePost = async (req, res) => {
    try {
        const { id: postId } = req.params
        const userId = req.user._id;
        
        const post =await Post.findById(postId);
        if(!post){
            return res.status(401).json({ error: "Post not found " });
        }
        
        const userLikedPost=post.like.includes(userId);
        if (userLikedPost) {
            await Post.updateOne({_id:postId},{$pull:{likes:userId}});
            res.status(200).json({ message: "Post unliked successfuly" });
        } else {  
            post.like.push(userId)
            await post.save();
            res.status(200).json({ message: "Post liked successfuly" });
        }

     

    } catch (error) {
        res.status(500).json({ error: error.message })
    }
};
const replayToPost=async(req,res)=>{
try {
    const {text}=req.body;
    const postId=req.params.id;
    const userId=req.user._id;
    const userProfailPic=req.user.profailPic;
    const username=req.user.username;
    const name=req.user.name;
    if (!text) {
        return res.status(400).json({ error: "text field is required " });
    }
    const post=await Post.findById(postId);
    if (!post) {
        return res.status(404).json({ error: "Post not found " });
    }
    const reply={userId,username,userProfailPic,text,name}
    post.replaies.push(reply);
    await post.save();
    res.status(200).json(reply);
} catch (error) {
    res.status(500).json({ error: error.message })
    
}
};
const getFeedPost=async(req,res)=>{
try {
    const userId=req.user._id;
    const user =await User.findById(userId);
    if(!user){
        return res.status(401).json({ error: "user not found " });
    }
    const following=user.following;
    const feedPosts=await Post.find({postedBy:{$in:following}}).sort({createdAt:-1});
    res.status(200).json(feedPosts)
    
} catch (error) {
    res.status(500).json({ error: error.message })
}
}
const getUserPosts = async (req, res) => {
	const { username } = req.params;
	try {
		const user = await User.findOne({ username });
		if (!user) {
			return res.status(404).json({ error: "User not found" });
		}

		const posts = await Post.find({ postedBy: user._id }).sort({ createdAt: -1 });

		res.status(200).json(posts);
	} catch (error) {
		res.status(500).json({ error: error.message });
	}

}
export { createPost, getPost, deletePost, likeUnlikePost,replayToPost,getFeedPost,getUserPosts }
