import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { getProfile } from '../api/profile';
import ProfileForm from '../components/profiles/ProfileForm';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background-color: #f4f4f4;
  padding: 2rem;
`;

const Title = styled.h2`
  text-align: center;
  color: #333;
  margin-bottom: 1rem;
`;

const ProfileDetails = styled.div`
  background: white;
  padding: 1.5rem;
  border-radius: 8px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  width: 100%;
  max-width: 400px;
  text-align: center;
`;

const ProfileItem = styled.p`
  font-size: 1rem;
  color: #555;
  margin: 0.5rem 0;
`;

const EditButton = styled.button`
  margin-top: 1rem;
  padding: 0.5rem 1rem;
  border: none;
  background-color: #007bff;
  color: white;
  cursor: pointer;
  border-radius: 4px;

  &:hover {
    background-color: #0056b3;
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
        <ProfileForm profile={profile} onSuccess={(updatedProfile) => {
          setProfile(updatedProfile);
          setIsEditing(false);
        }} />
      ) : (
        <ProfileDetails>
          <ProfileItem><strong>Name:</strong> {profile.name}</ProfileItem>
          <ProfileItem><strong>Email:</strong> {profile.email}</ProfileItem>
          <div>
          {profile.profile_picture && (
            <img src={profile.profile_picture} alt="Profile" width={100} height={100} />
          )}
          </div>
          <EditButton onClick={() => setIsEditing(true)}>Edit Profile</EditButton>
        </ProfileDetails>
      )}
    </Container>
  );
};

export default Profile;
