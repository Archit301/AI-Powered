import express from "express"
import mongoose from "mongoose"
import cors from "cors"
import dotenv  from  "dotenv"
dotenv.config()
import userRoutes from "./routes/user_route.js"
import articleRoutes from "./routes/article_route.js"
import commentRoutes from "./routes/comment_route.js"
import questionRoutes from "./routes/question_route.js"
const app = express()
app.use(cors())
app.use(express.json())
mongoose.connect(
    process.env.MONGO
).then(
    console.log("Database is connected")
)


app.use('/api/users', userRoutes);
app.use('/api/articles', articleRoutes);
app.use('/api/comments', commentRoutes);
app.use('/api/questions', questionRoutes);


 const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
