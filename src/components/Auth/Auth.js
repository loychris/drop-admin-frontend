import React, { useState, useContext } from "react";
import { Formik } from 'formik';
import { AuthContext } from '../context/auth-context';
import axios from 'axios';


import classes from './Auth.module.css';



function Auth(props) {

    const auth = useContext(AuthContext);
    
    const [password, setPassword] = useState('')
    const [email, setEmail] = useState('')

    const [incorrectPW, setIncorrectPW] = useState(false);


    const login = (event) => {
        console.log('Logging in', password, email);
        event.preventDefault();
        axios.post(
            '/api/users/login', 
            JSON.stringify({
                identification: email,
                password: password
            }), 
            { headers: { 'Content-Type': 'application/json' } }
        ).then(res => {
            const expirationDate = new Date(new Date().getTime() + res.data.expiresIn * 1000);
            localStorage.setItem('token', res.data.token);
            localStorage.setItem('expirationDate', expirationDate);
            localStorage.setItem('user', JSON.stringify(res.data));
            props.setAuthOpen(false);
        }).catch(err => {
            console.log(err);
        })
    }


    const validateLogin = () => {
        let errors = {};
        if (!email) {
            errors.email = 'Required';
        } else if (
            !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(email)
        ) {
            errors.email = 'Not a valid email address!';
        } 
        if(!password){
            errors.password = 'Required';
        } else if( password.length < 6){
            errors.password = 'Password must be at least 6 characters long'
        }
        return errors;
    }

    const onEmailChange = (event) => {
        setEmail(event.target.value);
    }

    const onPasswordChange = (event) => {
        setPassword(event.target.value);
    }

    return(    
        <div>
            {props.loggedIn ? null: <div className={classes.backDrop}></div>}
            <div className={`${classes.login} ${props.loggedIn ? classes.hidden : ''}`}>
                <form className={classes.form} onSubmit={login}>
                    <h3>login</h3>
                    <label>Email:</label>
                    <input
                        id="email"
                        type="email"
                        name="email"
                        onChange={onEmailChange}
                        onBlur={validateLogin}
                        value={email}
                    />
                    <br/>
                    <label>Password:</label>
                    <input
                        id="password"
                        type="password"
                        name="password"
                        onChange={onPasswordChange}
                        onBlur={validateLogin}
                        value={password}
                    />
                    {incorrectPW ? <span className={classes.invalidMessage}>
                        Email or password incorrect. Please try again <br/>
                    </span>  : null}
                    <button variant="contained" type="submit" size='small'>
                        Login
                    </button>
                </form>
            </div>
        </div>
    )
}

export default Auth;