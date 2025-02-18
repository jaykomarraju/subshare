// src/components/subscriptions/SubscriptionCard.js
import React from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';

const Card = styled.div`
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  padding: 1.5rem;
  margin: 1rem 0;
  max-width: 400px;
  border-left: 5px solid ${(props) => (props.paid ? '#4CAF50' : '#FF9800')};
`;

const Title = styled.h3`
  margin: 0 0 0.5rem;
  font-size: 1.5rem;
  color: #333;
`;

const Text = styled.p`
  margin: 0.25rem 0;
  font-size: 1rem;
  color: #555;

  strong {
    color: #222;
  }
`;

const DetailsLink = styled(Link)`
  display: inline-block;
  margin-top: 1rem;
  padding: 0.5rem 1rem;
  font-size: 1rem;
  text-decoration: none;
  color: #fff;
  background-color: #2196F3;
  border-radius: 4px;
  transition: background 0.3s ease-in-out;

  &:hover {
    background-color: #1976D2;
  }
`;

const SubscriptionCard = ({ group }) => {
  const { _id, service_name, cost, due_date, invitees, paid } = group;
  const formattedDueDate = new Date(due_date).toLocaleDateString();

  return (
    <Card paid={paid}>
      <Title>{service_name}</Title>
      <Text><strong>Cost:</strong> ${cost}</Text>
      <Text><strong>Due Date:</strong> {formattedDueDate}</Text>
      <Text><strong>Members Invited:</strong> {invitees ? invitees.length : 0}</Text>
      <Text><strong>Status:</strong> {paid ? 'Paid' : 'Pending'}</Text>
      <DetailsLink to={`/subscription/${_id}`}>View Details</DetailsLink>
    </Card>
  );
};

export default SubscriptionCard;
