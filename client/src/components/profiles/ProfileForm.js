import React, { useState, useEffect } from 'react';
import styled, { keyframes } from 'styled-components';
import { getProfile, updateProfile } from '../../api/profile';
import Loader from '../common/Loader';

const slideIn = keyframes`
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
`;

const FormContainer = styled.div`
  background: #ffffffcc;
  backdrop-filter: blur(4px);
  padding: 2rem;
  border-radius: 16px;
  box-shadow: 0 4px 20px rgba(0,0,0,0.15);
  max-width: 400px;
  margin: 1rem auto;
  animation: ${slideIn} 0.5s ease-out;
`;

const Title = styled.h2`
  text-align: center;
  color: #333;
  margin-bottom: 1.5rem;
  font-family: 'Montserrat', sans-serif;
`;

const Message = styled.p`
  text-align: center;
  font-size: 1rem;
  color: ${(props) => (props.error ? '#e74c3c' : '#27ae60')};
  margin-bottom: 1rem;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1.2rem;
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
`;

const Label = styled.label`
  font-size: 1rem;
  color: #333;
  margin-bottom: 0.4rem;
  font-family: 'Roboto', sans-serif;
`;

const Input = styled.input`
  padding: 0.7rem;
  font-size: 1rem;
  border: 1px solid #ddd;
  border-radius: 8px;
  transition: border-color 0.3s ease;
  font-family: 'Roboto', sans-serif;

  &:focus {
    border-color: #6a82fb;
    outline: none;
  }
`;

const Button = styled.button`
  padding: 0.8rem;
  font-size: 1.1rem;
  color: #fff;
  background: linear-gradient(135deg, #6a82fb 0%, #fc5c7d 100%);
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: background 0.3s ease;
  font-family: 'Montserrat', sans-serif;
  
  &:hover {
    background: linear-gradient(135deg, #5a72ea 0%, #ea4a67 100%);
  }
  
  &:disabled {
    background: #ccc;
    cursor: not-allowed;
  }
`;

const ProfileForm = () => {
  const [profile, setProfile] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    profile_picture: '',
  });
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [error, setError] = useState(null);
  const [successMsg, setSuccessMsg] = useState(null);

  useEffect(() => {
    async function fetchProfile() {
      try {
        const data = await getProfile();
        setProfile(data);
        setFormData({
          name: data.name || '',
          profile_picture: data.profile_picture || '',
        });
      } catch (err) {
        setError(err.message || 'Failed to load profile.');
      } finally {
        setLoading(false);
      }
    }
    fetchProfile();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setUpdating(true);
    setError(null);
    setSuccessMsg(null);
    try {
      const updatedProfile = await updateProfile(formData);
      setProfile(updatedProfile);
      setSuccessMsg('Profile updated successfully.');
    } catch (err) {
      setError(err.message || 'Failed to update profile.');
    } finally {
      setUpdating(false);
    }
  };

  if (loading) return <Loader />;

  return (
    <FormContainer>
      <Title>Update Profile</Title>
      {error && <Message error>{error}</Message>}
      {successMsg && <Message>{successMsg}</Message>}
      <Form onSubmit={handleSubmit}>
        <FormGroup>
          <Label>Name:</Label>
          <Input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Your name"
          />
        </FormGroup>
        <FormGroup>
          <Label>Profile Picture URL:</Label>
          <Input
            type="text"
            name="profile_picture"
            value={formData.profile_picture}
            onChange={handleChange}
            placeholder="http://example.com/your-picture.jpg"
          />
        </FormGroup>
        <Button type="submit" disabled={updating}>
          {updating ? 'Updating...' : 'Update Profile'}
        </Button>
      </Form>
    </FormContainer>
  );
};

export default ProfileForm;
