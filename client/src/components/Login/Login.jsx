import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from '../../api/axios';
import { toast, ToastContainer } from 'react-toastify'; // Import ToastContainer and toast
import 'react-toastify/dist/ReactToastify.css'; // Import toast CSS
import './Login.css';

const Login = () => {
    const [data, setData] = useState({
        email: '',
        password: ''
    });
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    const changeHandler = (e) => {
        setData({ ...data, [e.target.name]: e.target.value });
    };

    const submitHandler = async (e) => {
        e.preventDefault();
        try {
            const res = await axios.post('/login', data);
            localStorage.setItem('token', res.data.token);
            localStorage.setItem('fullname', res.data.fullname); // Store username
            toast.success('Login successful!'); // Display toast message
            setTimeout(() => {
                navigate('/dashboard');
            }, 2000); // Adjust delay to allow toast to be visible
        } catch (err) {
            console.error(err);
            setError('Login failed. Please check your credentials and try again.');
        }
    };

    return (
        <div>
            <section className="container">
                <h1 className='large text-primary'>Sign In</h1>
                <p className='lead'><i className="fas fa-user"></i> Sign into Your Account</p>
                <form className='form' onSubmit={submitHandler} autoComplete='off'>
                    <div className='form-group'>
                        <input
                            type='email'
                            placeholder='Email Address'
                            name="email"
                            onChange={changeHandler}
                            required
                        />
                    </div>
                    <div className='form-group'>
                        <input
                            type='password'
                            placeholder="Password"
                            name="password"
                            onChange={changeHandler}
                            required
                        />
                    </div>
                    {error && <p className='error'>{error}</p>}
                    <input type='submit' className='btn btn-primary' value="Login" />
                </form>
                <p className='large'>Don't have an account? <Link to="/register" >Sign Up</Link></p>
            </section>
            <ToastContainer className="custom-toast-container" 
              style={{
                        position: 'absolute',
                        top: '490px', /* Adjust this value to move the toast lower */
                        left: '50%', /* Adjust as needed to align it with the button */
                        transform: 'translateX(-50%)',
                        zIndex: 9999, /* Ensure it appears above other elements */
                    }}
                    autoClose={3000}
                    hideProgressBar={true}
                    closeOnClick
                    pauseOnHover
                    draggable/> 
        </div>
    );
}

export default Login;