// src/pages/Auth/Login.js
import React, { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import styled from 'styled-components';
import { login as apiLogin } from '../../api/auth';
import { AuthContext } from '../../contexts/AuthContext';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
//   min-height: 100vh;
  background-color: #f4f4f4;
  padding: 1rem;
`;

const AuthBox = styled.div`
  background: #fff;
  padding: 2rem;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  width: 100%;
  max-width: 400px;
`;

const Title = styled.h2`
  text-align: center;
  color: #333;
`;

const Message = styled.p`
  text-align: center;
  font-size: 0.9rem;
  color: ${(props) => (props.error ? 'red' : 'green')};
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
`;

const Label = styled.label`
  font-size: 1rem;
  color: #333;
  margin-bottom: 0.3rem;
`;

const Input = styled.input`
  padding: 0.5rem;
  font-size: 1rem;
  border: 1px solid #ccc;
  border-radius: 4px;
  transition: border-color 0.3s ease-in-out;
  
  &:focus {
    border-color: #4CAF50;
    outline: none;
  }
`;

const Button = styled.button`
  padding: 0.75rem;
  font-size: 1rem;
  color: #fff;
  background-color: #4CAF50;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: background 0.3s ease-in-out;
  width: 100%;

  &:hover {
    background-color: #45a049;
  }

  &:disabled {
    background-color: #ccc;
    cursor: not-allowed;
  }
`;

const LinkText = styled.p`
  text-align: center;
  font-size: 0.9rem;

  a {
    color: #2196F3;
    text-decoration: none;

    &:hover {
      text-decoration: underline;
    }
  }
`;

const GoogleButton = styled.button`
  padding: 0.75rem;
  font-size: 1rem;
  color: #fff;
  background-color: #DB4437;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: background 0.3s ease-in-out;
  width: 100%;
  margin-top: 1rem;

  &:hover {
    background-color: #C1351D;
  }
`;

const Login = () => {
  const { setAuthData } = useContext(AuthContext);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const data = await apiLogin(formData);
      setAuthData({ token: data.access_token, user: { email: formData.email } });
      localStorage.setItem('token', data.access_token);
      localStorage.setItem('user', JSON.stringify({ email: formData.email }));
      setLoading(false);
      navigate('/dashboard');
    } catch (err) {
      setLoading(false);
      setError(err.message || 'Login failed');
    }
  };

  return (
    <Container>
      <AuthBox>
        <Title>Login</Title>
        {error && <Message error>{error}</Message>}
        <Form onSubmit={handleSubmit}>
          <FormGroup>
            <Label>Email:</Label>
            <Input 
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </FormGroup>
          <FormGroup>
            <Label>Password:</Label>
            <Input 
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </FormGroup>
          <Button type="submit" disabled={loading}>
            {loading ? 'Logging in...' : 'Login'}
          </Button>
        </Form>
        <LinkText>
          Don't have an account? <Link to="/signup">Sign Up</Link>
        </LinkText>
        <GoogleButton onClick={() => window.location.href = 'http://localhost:8000/auth/login/google'}>
          Login with Google
        </GoogleButton>
      </AuthBox>
    </Container>
  );
};

export default Login;
