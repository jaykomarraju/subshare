// src/pages/Dashboard.js
import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import SubscriptionCard from '../components/subscriptions/SubscriptionCard';
import Loader from '../components/common/Loader';
import { getSubscriptions } from '../api/subscriptions';
import { Link } from 'react-router-dom';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 2rem;
  background-color: #f4f4f4;
//   height: 100%;
`;

const Title = styled.h2`
  text-align: center;
  color: #333;
  margin-bottom: 1rem;
`;

const Message = styled.p`
  text-align: center;
  font-size: 1rem;
  color: #555;

  a {
    color: #2196F3;
    text-decoration: none;

    &:hover {
      text-decoration: underline;
    }
  }
`;

const SubscriptionsList = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 1rem;
  width: 100%;
  max-width: 900px;
  margin-top: 1rem;
`;

const ButtonContainer = styled.div`
  margin-top: 2rem;
`;

const CreateButton = styled(Link)`
  display: inline-block;
  padding: 0.75rem 1.5rem;
  font-size: 1rem;
  color: #fff;
  background-color: #4CAF50;
  border-radius: 4px;
  text-decoration: none;
  text-align: center;
  transition: background 0.3s ease-in-out;

  &:hover {
    background-color: #45a049;
  }
`;

const Dashboard = () => {
  const [subscriptions, setSubscriptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchSubscriptions() {
      try {
        const data = await getSubscriptions();
        setSubscriptions(data);
      } catch (err) {
        setError(err.message || 'Failed to fetch subscriptions.');
      } finally {
        setLoading(false);
      }
    }
    fetchSubscriptions();
  }, []);

  if (loading) return <Loader />;
  if (error) return <Message>{error}</Message>;

  return (
    <Container>
      <Title>Your Subscriptions</Title>
      {subscriptions.length === 0 ? (
        <Message>
          No subscriptions found. <Link to="/subscription/create">Create one!</Link>
        </Message>
      ) : (
        <SubscriptionsList>
          {subscriptions.map((sub) => (
            <SubscriptionCard key={sub._id} group={sub} />
          ))}
        </SubscriptionsList>
      )}
      <ButtonContainer>
        <CreateButton to="/subscription/create">Create New Subscription</CreateButton>
      </ButtonContainer>
    </Container>
  );
};

export default Dashboard;
