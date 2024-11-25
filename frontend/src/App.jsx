import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import { BrowserRouter,Navigate,Route,Router,Routes } from 'react-router-dom'
import Signup from './component/Signup'
import Login from './component/Login'
import Header from './component/Header'
import Homepage from './component/Homepage'
import ArticlesPage from './component/ArticlesPage'
import ArticleDetailPage from './component/ArticleDetailPage'
import QuestionPage from './component/QuestionPage'
import TopicsPage from './component/TopicsPage'
import AboutSection from './component/AboutSection'
import ProfileSection from './component/ProfileSection'
import AdminHeader from './component/AdminHeader'
import AdminDashboard from './component/AdminDashboard'
import CreateArticleForm from './component/CreateArticleForm'
import Adminarticle from './component/Adminarticle'
import AdminArticleView from './component/AdminArticleView'
import AdminQuestion from './component/AdminQuestion'
import AdminAddQuestion from './component/AdminAddQuestion'
import AdminReport from './component/AdminReport'
import ArticleEdit from './component/ArticleEdit'
import AdminEditQuestion from './component/AdminEditQuestion'
import { useSelector } from 'react-redux'
import ArticlePage from './component/ArticlePage'
import Author from './component/Author'
import AuthorProfile from './component/AuthorProfile'
import SavedArticles from './component/SavedArticles'
import QuestionView from './component/QuestionView'
import Insight from './component/Insight'
import AdminQuestionView from './component/AdminQuestionView'
import PrivateRouteuser from './component/PrivateRouteuser'
import PrivateRouteadmin from './component/PrivateRouteadmin'


function App() {
  const {currentUser}= useSelector((state)=>state.user)

  const [count, setCount] = useState(0)

  return (
    <>
    <BrowserRouter>
    <div className="flex flex-col min-h-screen"> 
    {currentUser ? (
      currentUser.role === "admin" ? <AdminHeader /> : <Header />
    ) : null}
           {/* <Header />  */}
   {/* <AdminHeader/> */}
        <main className="flex-grow"> 
    <Routes>
    <Route
  path="/login"
  element={
    !currentUser ? (
      <Login />
    ) : currentUser.role === "admin" ? (
      <Navigate to="/admindashboard" />
    ) : (
      <Navigate to="/" />
    )
  }
/>
<Route
  path="/register"
  element={
    !currentUser ? (
      <Signup />
    ) : currentUser.role === "admin" ? (
      <Navigate to="/admindashboard" />
    ) : (
      <Navigate to="/" />
    )
  }
/>
    <Route  element={<PrivateRouteuser/>}>
    <Route path='/articles' element={<ArticlesPage/>}/> 
    <Route path='/detailed' element={<ArticleDetailPage/>}/>
    <Route path='/questions' element={<QuestionPage/>}/>  
    <Route path='/question/:id' element={<QuestionView/>}/> 
    <Route path='/topics' element={<TopicsPage/>}/> 
    <Route path='/about' element={<AboutSection/>}/> 
    <Route path='/profile' element={<ProfileSection/>}/> 
    <Route path='/author/:id' element={<AuthorProfile/>}/> 
    <Route path='/saved' element={<SavedArticles/>}/> 
    <Route path='/' element={<Homepage/>}/> 
    <Route path='/article/:id' element={<ArticlePage/>}/> 
    <Route path='/authors' element={<Author/>}/>
    </Route>
    <Route  element={<PrivateRouteadmin/>}>
    <Route path='/admin/questions/view/:id' element={<AdminQuestionView/>}/>  
    <Route path='/admin/profile' element={<ProfileSection/>}/> 
    <Route path='/adminquestionedit/:id' element={<AdminEditQuestion/>}/>
    <Route path='/adminarticlesedit/:id' element={<ArticleEdit/>}/>
    <Route path='/adminreport' element={<AdminReport/>}/> 
    <Route path='/admininsight' element={<Insight/>}/> 
    <Route path='/adminaddquestion' element={<AdminAddQuestion/>}/> 
    <Route path='/adminquestion' element={<AdminQuestion/>}/> 
    <Route path='/adminarticle' element={<Adminarticle/>}/> 
    <Route path='/admindashboard' element={<AdminDashboard/>}/> 
    <Route path='/adminarticleview/:id' element={<AdminArticleView/>}/> 
    <Route path='/createarticle' element={<CreateArticleForm/>}/> 
    </Route>
      </Routes>
       </main> 
      </div>
    </BrowserRouter>
      
    </>
  )
}

export default App
