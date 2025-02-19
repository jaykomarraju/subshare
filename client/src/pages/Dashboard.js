import React, { useState, useEffect } from 'react';
import styled, { keyframes } from 'styled-components';
import SubscriptionCard from '../components/subscriptions/SubscriptionCard';
import Loader from '../components/common/Loader';
import { getSubscriptions } from '../api/subscriptions';
import { Link } from 'react-router-dom';

// const fadeIn = keyframes`
//   from { opacity: 0; transform: translateY(10px); }
//   to { opacity: 1; transform: translateY(0); }
// `;

const Container = styled.div`
  min-height: 100vh;
  background: linear-gradient(135deg, #f6d365 0%, #fda085 100%);
  padding: 2rem;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const Title = styled.h2`
  font-family: 'Montserrat', sans-serif;
  color: #333;
  text-align: center;
  margin-bottom: 1.5rem;
  font-size: 2rem;
`;

const Message = styled.p`
  font-family: 'Roboto', sans-serif;
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
  gap: 1.5rem;
  width: 100%;
  max-width: 900px;
`;

const ButtonContainer = styled.div`
  margin-top: 2rem;
`;

const CreateButton = styled(Link)`
  display: inline-block;
  padding: 0.85rem 1.8rem;
  font-size: 1.1rem;
  color: #fff;
  background: linear-gradient(135deg, #6a82fb 0%, #fc5c7d 100%);
  border-radius: 8px;
  text-decoration: none;
  text-align: center;
  font-family: 'Montserrat', sans-serif;
  transition: background 0.3s ease;
  
  &:hover {
    background: linear-gradient(135deg, #5a72ea 0%, #ea4a67 100%);
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
