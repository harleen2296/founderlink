import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from './assets/vite.svg'
import heroImg from './assets/hero.png'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Home from './User/Home'
import Master from './Layout/User/Master'
import About from './User/About'
import Services from './User/Services'
import Contact from './User/Contact'
import Register from './Authentication/Register'
import Login from './Authentication/Login'
import Dashboard from './Admin/Dashboard'
import AdminMaster from './Layout/Admin/AdminMaster'
import { ToastContainer } from 'react-toastify'
import AddStartupIdeas from './User/addStartupIdeas'
import UpdateStartupIdeas from './User/UpdateStartupIdeas'
import ManageStartupIdeas from './User/ManageStartupIdeas'
import ViewIdeas from './User/ViewIdeas'
import ManageEnquiries from './Admin/ManageEnquiries'
import ManageUsers from './Admin/ManageUsers'
import AdminViewIdeas from './Admin/AdminViewIdeas'
import AdminLogin from './Authentication/AdminLogin'
import ApprovedIdeas from './Admin/ApprovedIdeas'
import RejectedIdeas from './Admin/RejectedIdeas'
import IdeaDescription from './User/IdeaDescription'
import AddInvestment from './User/AddInvestment'
import MyInvestmentRequests from './User/MyInvestmentRequests'
import OwnerInvestmentRequests from './User/OwnerInvestmentRequests'
import Payment from './User/Payment'
import ViewInvestments from './Admin/ViewInvestments'


function App() {
  const [count, setCount] = useState(0)

  return (
    <>
   <BrowserRouter>
   <Routes>
{/*USER */}
<Route path="/" element={<Master/>}>
<Route path="/" element={<Home/>}/>
<Route path="/about" element={<About/>}/>
<Route path="/services" element={<Services/>}/>
<Route path="/contact" element={<Contact/>}/>
<Route path="/addstartup" element={<AddStartupIdeas/>}/>
<Route path="/managestartupideas" element={<ManageStartupIdeas/>}/>
<Route path='/idea-description/:id' element={<IdeaDescription/>}/>
<Route path="/updateStartup/:id" element={<UpdateStartupIdeas/>}/>
<Route path="/viewIdeas" element={<ViewIdeas/>}/>
<Route path="/register" element={<Register/>}/>
<Route path="/login" element={<Login/>}/>
<Route path="/adminlogin" element={<AdminLogin/>}/>
<Route path='/add-investment/:id' element={<AddInvestment/>}/>
<Route path='/myinvestments' element={<MyInvestmentRequests/>}/>
<Route path='/viewrequests' element={<OwnerInvestmentRequests/>}/>
<Route path="/payment/:id" element={<Payment />} />


   
</Route>
{/*ADMIN */}
<Route path="/admin" element={<AdminMaster/>}>
<Route path="/admin" element={<Dashboard/>}/>
<Route path="/admin/manageenquiries" element={<ManageEnquiries/>}/>
<Route path="/admin/manageusers" element={<ManageUsers/>}/>
<Route path="/admin/viewideas" element={<AdminViewIdeas/>}/>
<Route path="/admin/approvedideas" element={<ApprovedIdeas/>}/>
<Route path="/admin/rejectedideas" element={<RejectedIdeas/>}/>
<Route path='/admin/viewinvestments' element={<ViewInvestments/>}/>



</Route>

   </Routes>
   
   
   </BrowserRouter>
   <ToastContainer/>
    </>
  )
}

export default App
