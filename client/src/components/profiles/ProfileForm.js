// src/components/profiles/ProfileForm.js
import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { getProfile, updateProfile } from '../../api/profile';
import Loader from '../common/Loader';

const FormContainer = styled.div`
  background: #fff;
  padding: 2rem;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  max-width: 400px;
  margin: 1rem auto;
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

  &:hover {
    background-color: #45a049;
  }

  &:disabled {
    background-color: #ccc;
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
