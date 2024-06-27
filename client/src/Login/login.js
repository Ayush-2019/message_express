import React, { useEffect, useState } from 'react';
import { Button, TextField, Container, Typography, Box, CircularProgress } from '@mui/material';
import axios from 'axios';
import { Buffer } from 'buffer';
import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Login = () => {
  const history = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async(event) => {
    event.preventDefault();

    setLoading(true);
    const token = Buffer.from(`${username}:${password}`, 'utf-8').toString('base64');

    const user = await axios.get("https://message-express-backend.onrender.com/v10/user/self", {
        headers: {
            'Authorization': `Basic ${token}`
        }
    }).then((response) => {

      console.log(response)
      console.log(response.status)
      localStorage.setItem('user', JSON.stringify(response.data));
      localStorage.setItem('token', token);
      
      history('/chats');

    })
    .catch((error) => {
      toast.error('Invalid Credentials');
      setLoading(false);
    });

  };

  useEffect(() => {

    if(localStorage.getItem('signup')){
      toast.success(localStorage.getItem('signup'));
      localStorage.removeItem('signup');
    }
  },[]);

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
          Login
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

          {
            !loading ?           <Button
            onClick={handleSubmit}
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
          >
            Login
          </Button> : <CircularProgress/>
          }

        </Box>
      </Box>
    </Container>
    
    <div></div>
    <div style={{textAlign:"center"}}>
      <div>New User?</div> <Button variant='contained' color='secondary' onClick={() => history('/signup')}>Register</Button>
    </div>
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

export default Login;
