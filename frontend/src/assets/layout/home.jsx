import React, { useEffect, useState,useCallback } from "react";
import axios from 'axios';
import { useNavigate } from "react-router-dom";
import peeper from "../images/peeper.jpg";
import potato from "../images/potato1.jpg";
import tomato from "../images/tomato.jpg";
import cookie from "js-cookie";
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer, toast } from 'react-toastify';

import '../styles/home.css'
function Home() {
  const [isOpen, setIsOpen] = useState(false);
  const [avatar, setAvatar] = useState(null);
  const navigate = useNavigate();

  const validateUser = useCallback(async (token) => {
    try {
      const result = await axios.post("http://localhost:4040/verifyjwt", { token });
      if (result.status === 200) {
        console.log('User logged in');
      } else {
        console.log('You are not eligible to access this route! Please login first');
        handleLogout();
      }
    } catch (error) {
      console.log('You are not eligible to access this route! Please login first');
      handleLogout();
    }
  },[cookie.get("cookie-1")]);
  
  const decodeToken = useCallback(async (token) => {
    try {
      const result = await axios.post("http://localhost:4040/decodejwt", { token });
      if (result.status === 201) {
        console.log(result.data);
        setAvatar(result.data.profileURL);
      } else {
        console.log('You are not eligible to access this route! Please login first');

      }
    } catch (error) {
      console.log('You are not eligible to access this route! Please login first');
    }
  },[setAvatar]);
  

  const handleLogout = (msg) => {

      toast.error(`You cannot access`, {
        position: "top-center",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "dark",
      });
    setTimeout(() => {
      navigate('/');
    }, 1500);
  }
  const toggleDropdown = () => {
    setIsOpen(!isOpen);
    console.log(isOpen);
  };

  const handleItemClick = (item) => {
    console.log("Clicked on:", item);
    if(item==='signout'){
      console.log("You are not")
      document.cookie = 'cookie-1' + "=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
      setTimeout(() => {
        navigate('/');
      }, 1500);
    
      toast.success('Logged Out', {
        position: "top-center",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "dark",
      });
    }
    else if(item==='profile'){
      navigate('/profile');
    }
    else if(item==='Home'){
      navigate('/home');
    }
  };

  useEffect(() => {
    const token = cookie.get("cookie-1");

      validateUser(token);
      decodeToken(token);

  }, [cookie.get("cookie-1")]);

  return (
    <div>
    <ToastContainer /> 
      <nav className="navbar-home">


        <span>Plant Disease Classification</span>
        <div className="dropdown">
          <a className="navbar-brand-home" >
            <img
              src={avatar}
              width="50"
              height="50"
              alt="Peeper Logo"
              onClick={toggleDropdown} // Toggle dropdown on image click
            />
          </a>

          {isOpen && (
            <div className="dropdown-menu-home" aria-labelledby="dropdownMenuButton">
              <a className="dropdown-item" onClick={() => handleItemClick("Home")} >Home</a>
              <a className="dropdown-item" onClick={() => handleItemClick("profile")} >Profile</a>
              <div className="dropdown-divider"></div>
              <a className="dropdown-item" onClick={() => handleItemClick("signout")} >Sign Out</a>
            </div>
          )}
        </div>
      </nav>
      <div className="card-container" style={{ display: 'flex', justifyContent: 'space-between' }}>
        <div className="card-element" style={{ padding: '30px' }}>
          <div className="card" style={{ width: '250px', backgroundColor: '#FED8B1', padding: '20px' }}>
            <img src={peeper} className="card-img-top" alt="..." style={{ width: '250px', height: '175px' }} />
            <div className="card-body">
              <h5 className="card-title" style={{ fontSize: '24px' }}>Peeper Disease</h5>

              <p className="card-text">Pepper disease classification uses machine learning to detect bacterial spot disease in bell peppers</p>
              <button className="btn btn-primary" onClick={() => navigate('/peeperdisease')}>GO</button>
            </div>
          </div>
        </div>
        <div className="card-element" style={{ padding: '30px' }}>
          <div className="card" style={{ width: '250px', backgroundColor: '#B1E2FE', padding: '20px' }}>
            <img src={potato} className="card-img-top" alt="..." style={{ width: '250px', height: '190px' }} />
            <div className="card-body">
              <h5 className="card-title" style={{ fontSize: '24px' }}>Potato Disease</h5>
              <p className="card-text">Potato disease classification uses machine learning to identify 10 different types of potato diseases</p>
              <button className="btn btn-primary" onClick={() => navigate('/potatodisease')}>Go</button>

            </div>
          </div>
        </div>
        <div className="card-element" style={{ padding: '30px' }}>
          <div className="card" style={{ width: '250px', backgroundColor: '#FFE1B1', padding: '20px' }}>
            <img src={tomato} className="card-img-top" alt="..." style={{ width: '250px', height: '190px' }} />
            <div className="card-body">
              <h5 className="card-title" style={{ fontSize: '24px' }}>Tomato Disease</h5>
              <p className="card-text">Tomato disease classification uses machine learning to identify three types of tomato diseases</p>
              <button className="btn btn-primary" onClick={() => navigate('/tomatodisease')}>Go</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home;
