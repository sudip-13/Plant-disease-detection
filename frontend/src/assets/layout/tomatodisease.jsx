import React, { useState, useRef, useEffect,useCallback } from "react";
import '../styles/disease.css';
import uploadLogo from '../images/upload.jpg';
import cookie from "js-cookie";
import { useNavigate } from "react-router-dom";
import arrow from '../images/arrow2.gif'
import clear from '../images/output-onlinepngtools1.png'
import capture from '../images/output-onlinepngtools2.png'
import healthy from '../images/output-onlinepngtools.jpg'
import disease from '../images/disease.png'
import axios from 'axios';
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer, toast } from 'react-toastify';
function TomatoDisease() {
    const [selectedFile, setSelectedFile] = useState(null);
    const videoRef = useRef(null);
    const [capturedImage, setCapturedImage] = useState(false);
    const [loading, setLoading] = useState(true);
    const [data, setData] = useState({ class: "", confidence: 0 });
    const [avatar, setAvatar] = useState(null);
    const [isOpen, setIsOpen] = useState(false);
    const navigate = useNavigate();

    const toggleDropdown = () => {
        setIsOpen(!isOpen);
        console.log(isOpen);
    };

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

    const handleFileChange = async (event) => {
        const file = event.target.files[0];
        setSelectedFile(file);
    };

    const handleCapture = async () => {
        setCapturedImage(true);
        try {
            const videoStream = await navigator.mediaDevices.getUserMedia({
                video: true,
            });
            if (videoRef.current) {
                videoRef.current.srcObject = videoStream;
            }
        } catch (error) {
            console.log(error);
        }
    };
    const CapImg = () => {

        const videoTracks = videoRef.current.srcObject.getVideoTracks();
        videoTracks.forEach(track => track.stop());

        setCapturedImage(false);

        const video = videoRef.current;
        const canvas = document.createElement('canvas');
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;

        const context = canvas.getContext('2d');
        context.drawImage(video, 0, 0, canvas.width, canvas.height);

        canvas.toBlob(blob => {

            const capturedFile = new File([blob], "352815491_568259745476347_7911184923723155130_n.jpg", {
                type: "image/jpeg",
                lastModified: Date.now()
            });

            console.log(capturedFile);
            setSelectedFile(capturedFile)

        }, 'image/jpeg');
    };

    const handleClearButtonClick = async () => {
        setSelectedFile(null);
    }

    useEffect(() => {
        const fetchData = async () => {
            try {
                if (selectedFile) {
                    let formData = new FormData();
                    formData.append("file", selectedFile);
                    let res = await axios.post("http://localhost:9000/predict", formData);
                    if (res.status === 200) {
                        setData(res.data);
                        console.log(res.data);
                        setLoading(false);
                    }
                }
            } catch (error) {
                alert(error.message);
                console.error("An error occurred:", error);
                setSelectedFile(null);
            }
        };

        fetchData();


        return () => {

        };
    }, [selectedFile, setLoading]);
    useEffect(() => {
        const token = cookie.get("cookie-1");
    
          validateUser(token);
          decodeToken(token);
    
      }, [cookie.get("cookie-1")]);

    return (
        <div>
            <ToastContainer/>
            <nav className="navbar">
                <span>Disease-Classification: Tomato Disease Classification</span>
                <a className="navbar-brand" href="#">
                    <img
                        src={avatar}
                        width="50"
                        height="50"
                        alt="Peeper Logo"
                        onClick={toggleDropdown} // Toggle dropdown on image click
                    />
                </a>
                {isOpen && (
                    <div className="dropdown-menu-home-disease" aria-labelledby="dropdownMenuButton">
                        <a className="dropdown-item-disease" onClick={() => handleItemClick("Home")} href="">Home</a>
                        <a className="dropdown-item-disease" onClick={() => handleItemClick("profile")} href="#">Profile</a>
                        <div className="dropdown-divider"></div>
                        <a className="dropdown-item-disease" onClick={() => handleItemClick("signout")} href="#">Sign Out</a>
                    </div>
                )}
            </nav>

            {!capturedImage && (
                <div className="image-uploader">
                    <input
                        type="file"
                        accept="image/*"
                        onChange={handleFileChange}
                        style={{ display: "none" }}
                        id="fileInput"
                    />
                    <label htmlFor="fileInput" className="upload-box">
                        {selectedFile ? (
                            <div>
                                <img
                                    src={URL.createObjectURL(selectedFile)}
                                    alt="Selected"
                                    className="preview-image"
                                />

                                <div className="arrow-logo">
                                    <img src={arrow} alt="Example GIF" style={{ height: '200px', width: '300px' }} />

                                </div>
                                {loading ? (
                                    <div className="result-input">
                                        <div className="loading">
                                            <div className="loader"></div>
                                            <h1>Loading...</h1>
                                        </div>
                                    </div>
                                ) : (<div>
                                    <div className="result-input">
                                        <div className="stamp">
                                            {data.class === 'Healthy' ? (
                                                <img src={healthy} alt="Healthy" style={{ height: '200px' }} />
                                            ) : (
                                                <img src={disease} alt="Disease" style={{ height: '200px' }} />
                                            )}
                                        </div>
                                        <div className="loading-res">
                                            <h1>LABEL: {data.class}</h1>
                                            <h2>CONFIDENCE: {(parseFloat(data.confidence) * 100).toFixed(2)}%</h2>
                                        </div>
                                    </div>
                                </div>)}
                                <button className="clear-button" onClick={handleClearButtonClick}>
                                    <img src={clear} alt="Logo" className="logo" style={{ height: '50px', width: '6opx' }} /> Clear
                                </button>
                            </div>
                        ) : (
                            <div>
                                <div className="upload-placeholder">
                                    <img src={uploadLogo} alt="Upload" className="upload-logo" />
                                    <span>Click to upload image</span>
                                </div>

                            </div>
                        )}
                    </label>
                    <div className="capture-button-container">
                        <button onClick={handleCapture} className="capture-button">
                            <img src={capture} alt="Logo" className="logo-cap" style={{ height: '50px' }} />
                            Capture Image
                        </button>

                    </div>
                </div>
            )}

            {capturedImage && (
                <div className="captured-image-container">
                    <video autoPlay playsInline style={{ height: "100%", width: "100%" }} ref={videoRef} />
                    <div className="button-container">
                        <button onClick={CapImg} className="capture-button-image">Click</button>
                    </div>
                </div>
            )}
        </div>
    );
}
export default TomatoDisease