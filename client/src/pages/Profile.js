import React, { useEffect, useState } from 'react';
import styled, { keyframes } from 'styled-components';
import { getProfile } from '../api/profile';
import ProfileForm from '../components/profiles/ProfileForm';
import Loader from '../components/common/Loader';

const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
`;

const Container = styled.div`
  min-height: 100vh;
  background: linear-gradient(135deg, #f6d365 0%, #fda085 100%);
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 2rem;
`;

const Title = styled.h2`
  font-family: 'Montserrat', sans-serif;
  color: #333;
  text-align: center;
  margin-bottom: 1.5rem;
  font-size: 2rem;
`;

const ProfileDetails = styled.div`
  background: #ffffffcc;
  backdrop-filter: blur(4px);
  padding: 2rem;
  border-radius: 16px;
  box-shadow: 0 4px 20px rgba(0,0,0,0.15);
  width: 100%;
  max-width: 400px;
  text-align: center;
`;

const ProfileItem = styled.p`
  font-family: 'Roboto', sans-serif;
  font-size: 1.1rem;
  color: #555;
  margin: 0.5rem 0;
`;

const EditButton = styled.button`
  margin-top: 1.5rem;
  padding: 0.75rem 1.5rem;
  border: none;
  background: linear-gradient(135deg, #6a82fb 0%, #fc5c7d 100%);
  color: #fff;
  cursor: pointer;
  border-radius: 8px;
  font-family: 'Montserrat', sans-serif;
  transition: background 0.3s ease;
  
  &:hover {
    background: linear-gradient(135deg, #5a72ea 0%, #ea4a67 100%);
  }
`;

const Profile = () => {
  const [profile, setProfile] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    async function fetchProfile() {
      try {
        const userData = await getProfile();
        setProfile(userData);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    fetchProfile();
  }, []);

  if (loading) return <Container><Title>Loading...</Title></Container>;
  if (error) return <Container><Title>Error: {error}</Title></Container>;

  return (
    <Container>
      <Title>Your Profile</Title>
      {isEditing ? (
        <ProfileForm 
          profile={profile} 
          onSuccess={(updatedProfile) => {
            setProfile(updatedProfile);
            setIsEditing(false);
          }} 
        />
      ) : (
        <ProfileDetails>
          <ProfileItem><strong>Name:</strong> {profile.name}</ProfileItem>
          <ProfileItem><strong>Email:</strong> {profile.email}</ProfileItem>
          {profile.profile_picture && (
            <img src={profile.profile_picture} alt="Profile" width={120} height={120} style={{borderRadius: '50%', marginTop: '1rem'}} />
          )}
          <EditButton onClick={() => setIsEditing(true)}>Edit Profile</EditButton>
        </ProfileDetails>
      )}
    </Container>
  );
};

export default Profile;
