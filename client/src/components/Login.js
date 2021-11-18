import React from 'react';
import '../styles/Login.css';

import {Container } from 'react-bootstrap';

const AUTH_URL = "https://accounts.spotify.com/authorize?client_id=dd765052203b40ab81362eb67f89a2f7&response_type=code&redirect_uri=http://localhost:3000&scope=streaming%20user-read-email%20user-read-private%20user-library-read%20user-library-modify%20user-read-playback-state%20user-modify-playback-state"



const Login = () => {
    return (
        <section id="home_login">
            <div className="login_form">
                <h1 id="login_text">Music Stream</h1>
                <p id="login_text">You must have a premium Spotify account to use this application.</p>
            <a id="login_text" className="btn btn-success btn-lg" href={AUTH_URL} >Login With Spotify</a>
            </div>
        </section>
    )
}

export default Login

