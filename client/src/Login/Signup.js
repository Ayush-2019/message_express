import React, { useState } from 'react';
import { Button, TextField, Container, Typography, Box, CircularProgress } from '@mui/material';
import axios from 'axios';
import { Buffer } from 'buffer';
import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Signup = () => {
    const history = useNavigate();
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [loading, setLoading] = useState(false);
  
    const handleSubmit = async(event) => {
      event.preventDefault();
        setLoading(true);
      const token = Buffer.from(`${username}:${password}`, 'utf-8').toString('base64');
      const messageArray = {"m":[]};


      const newuser = {
        email: username,
        password: password,
        firstName: firstName,
        lastName: lastName,
        socket_id: 'newuser',
        messages: JSON.stringify(messageArray)

      }
  
      axios.post('http://localhost:3001/v10/user/self', newuser).then((data) => {

        console.log(data);
  
        if(data.status == 201){
          history('/');
          localStorage.setItem('signup', 'Welcome! Please Login to Continue.');
        }
  
      })
      .catch((error) => {
        console.log(error);

        if(error.response.status == 400){
          toast.error('Email Already Exists');
          setLoading(false);
        }
        
        else{
          toast.error('An Error Occured');
          setLoading(false);
        }
      });
  
    };
  
    return (
      <div>
      <Container component="main" maxWidth="xs">
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            marginTop: 8,
          }}
        >
          <Typography component="h1" variant="h5">
            Register
          </Typography>
          <Box sx={{ mt: 1 }}>
            <TextField
              variant="outlined"
              margin="normal"
              required
              fullWidth
              id="username"
              label="Username"
              name="username"
              autoComplete="username"
              autoFocus
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
                        <TextField
              variant="outlined"
              margin="normal"
              required
              fullWidth
              name="password"
              label="Password"
              type="password"
              id="password"
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <TextField
              variant="outlined"
              margin="normal"
              required
              fullWidth
              name="firstName"
              label="firstName"
              type="firstName"
              id="firstName"
              autoComplete="FirstName"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
            />

                        <TextField
              variant="outlined"
              margin="normal"
              required
              fullWidth
              name="lastName"
              label="lastName"
              type="lastName"
              id="lastName"
              autoComplete="lastName"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
            />
            {/* Submit Button */}
            {
                !loading ? <Button
                onClick={handleSubmit}
                fullWidth
                variant="contained"
                sx={{ mt: 3, mb: 2 }}
              >
                Register
              </Button> : <CircularProgress color='secondary'/>
            }
          </Box>
        </Box>
      </Container>
      <ToastContainer
        position="bottom-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="dark"
  />
      </div>
    );
};

export default Signup;