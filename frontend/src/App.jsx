import {BrowserRouter, Routes,Route} from 'react-router-dom' 
import FarmerLogin from './assets/layout/login'
import SignupForm from './assets/layout/signup'
import ForgotPassword from './assets/layout/forgotpass'
import Home from'./assets/layout/home'
import Peeperdisease from './assets/layout/peeperdisease'
import Potatodisease from './assets/layout/potatodisease'
import TomatoDisease from './assets/layout/tomatodisease'
import Profile from './assets/layout/profile'

function App() {


  return (
    <BrowserRouter>
      <Routes>
      <Route path='/' element={< FarmerLogin />}></Route>
      <Route path='/signup' element={< SignupForm />}></Route>
      <Route path='/forgotpassword' element={< ForgotPassword />}></Route>
      <Route path='/home' element={< Home />}></Route>
      <Route path='/peeperdisease' element={< Peeperdisease />}></Route>
      <Route path='/potatodisease' element={< Potatodisease />}></Route>
      <Route path='/tomatodisease' element={< TomatoDisease />}></Route>
      <Route path='/profile' element={< Profile />}></Route>

    </Routes>
    </BrowserRouter>
  )
}

export default App
