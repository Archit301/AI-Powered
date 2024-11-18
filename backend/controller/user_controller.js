import { User } from "../models/user_model.js"
import { Article } from "../models/article_model.js";
import bcryptjs from "bcryptjs"
import jwt from "jsonwebtoken"


export const registerUser = async (req, res) => {
    const {username,email,password,role}=req.body;
    //  console.log(req.body)
    try {
        const userExists = await User.findOne({
            $or: [{ username }, { email }]
         });
         if (userExists) {
            if (userExists.username === username) {
               return res.status(409).json({ message: 'Username already exists!' });
            }
            if (userExists.email === email) {
               return res.status(409).json({ message: 'Email already exists!' });
            }
         }
            const hashpassword = await bcryptjs.hash(password, 10);
       const newuser=new User({username,email,password:hashpassword,role})
      await  newuser.save();
    //   console.log(newuser)
     console.log(newuser)
    res.status(201).json( newuser);
    // console.log("hello")
    } catch (error) {
        console.log(error)
        if (error.name === "ValidationError") {
            return res.status(400).json({
              message: "Validation failed",
              errors: error.errors,
            });
          }
        return res.status(500).json({ message: 'Server error !' });
    }
};


export const login=async(req,res,next)=>{
    const {email,password}=req.body;
    try {
        const user = await User.findOne({ email });
        
        // console.log(user)
       if (!user) {
            return res.status(404).json({ message: 'Email does not exist!' });
        }
       
        const isMatch = await bcryptjs.compare(password, user.password);
      
        if (!isMatch) {
            return res.status(401).json({ message: 'Invalid credentials!' });
        }
      
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
    
        const { password: pass, ...rest } = user._doc;
      
        res
        .cookie('access_token', token, { httpOnly: true })
        .status(200)
        .json(rest);
    
    } catch (error) {
        return res.status(500).json({ message: 'Server error!', error: error.message });   
    }
}


export const signout=async(req,res,next)=>{
    try {
        res.clearCookie('access_token')
        console.log("hello")
        res.status(200).json({message:'User has been logged out!',  success:true});
    } catch (error) {
        return res.status(500).json({ message: 'Server error!', error: error.message });    
    }
    }

    export const google=async(req,res,next)=>{
        try {
           const user=await User.findOne({email:req.body.email})
          if(user){
            const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET); 
            const { password: pass, ...rest } = validUser._doc;
           return  res
            .cookie('access_token', token, { httpOnly: true })
            .status(200)
            .json(rest);
          }
          else{
            const generatedPassword =
            Math.random().toString(36).slice(-8) +
            Math.random().toString(36).slice(-8);
            const hashedPassword = bcryptjs.hashSync(generatedPassword, 10);
            const newUser = new User({
                username:
                  req.body.name.split(' ').join('').toLowerCase() +
                  Math.random().toString(36).slice(-4),
                email: req.body.email,
                password: hashedPassword,
                avatar: req.body.photo,
              });
              await newUser.save();
              const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET);
              const { password: pass, ...rest } = newUser._doc;
              res
                .cookie('access_token', token, { httpOnly: true })
                .status(200)
                .json(rest);
          }
        } catch (error) {
            return res.status(500).json({ message: 'Server error!', error: error.message });      
        }
    }

export const followUser=async(req,res)=>{
    try {
     const {userId,followUserId}=req.params;
     const user=await User.findById(userId) 
     if(!user.followedUsers.includes(followUserId))
        {
            user.followedUsers.push(followUserId);
            await user.save();   
        }  
        res.status(200).json({ message: 'User followed' })   
    } catch (error) {
        res.status(500).json({ error: 'Failed to follow user' }); 
    }
}

export const getUserProfile = async (req, res) => {
    try {
        const user = await User.findById(req.params.userId);
        res.status(200).json(user);
    } catch (error) {
        res.status(500).json({ error: 'Failed to get profile' });
    }
};


export const updateUserProfile = async (req, res) => {
    try {
        // console.log(req.body)
        const { username, bio, avatar,email,password } = req.body;
        const user = await User.findByIdAndUpdate(
            req.params.userId,
            req.body,
            { new: true }
        );
        console.log(user)
        res.status(200).json(user);
    } catch (error) {
        res.status(500).json({ error: 'Failed to update profile' });
    }
};


export const getfollowuser = async (req, res) => {
    try {
      const { articleId, userId } = req.params;
      console.log(articleId, userId)
      // Get the article and its author
      const author = await Article.findById(articleId).populate('author');
      const authorId = author.author._id;
  
      // Get the user who authored the article
      const user = await User.findById(userId);
  
      // Check if the user has followed the author
      if (!user.followedUsers.includes(authorId)) {
        return res.status(200).json({ message: 'User not followed' });
      }
  
      return res.status(200).json({ message: 'User followed' });
    } catch (error) {
      return res.status(500).json({ error: 'Failed to follow user' });
    }
  };



  export const UnfollowUser=async(req,res)=>{
    try {
     const {userId,followUserId}=req.params;
     const user=await User.findById(userId) 
     if(user.followedUsers.includes(followUserId))
        {
            user.followedUsers.pull(followUserId);
            await user.save();   
        }  
        res.status(200).json({ message: 'User not followed' })   
    } catch (error) {
        res.status(500).json({ error: 'Failed to follow user' }); 
    }
}