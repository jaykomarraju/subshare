// src/pages/CreateSubscription.js
import React, { useState } from 'react';
import { createSubscriptionGroup } from '../api/subscriptions';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
//   min-height: 100vh;
  background-color: #f4f4f4;
  padding: 1rem;
`;

const FormBox = styled.div`
  background: #fff;
  padding: 2rem;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  width: 100%;
  max-width: 500px;
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

const CreateSubscription = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    service_name: '',
    cost: '',
    due_date: '',
    invitees: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const inviteesArray = formData.invitees
        .split(',')
        .map(email => email.trim())
        .filter(email => email.length > 0);
      
      const groupData = {
        service_name: formData.service_name,
        cost: parseFloat(formData.cost),
        due_date: formData.due_date,
        invitees: inviteesArray,
      };
      const data = await createSubscriptionGroup(groupData);
      setLoading(false);
      navigate(`/subscription/${data.group._id}`);
    } catch (err) {
      setLoading(false);
      setError(err.message || 'Failed to create subscription group.');
    }
  };

  return (
    <Container>
      <FormBox>
        <Title>Create New Subscription Group</Title>
        {error && <Message error>{error}</Message>}
        <Form onSubmit={handleSubmit}>
          <FormGroup>
            <Label>Service Name:</Label>
            <Input 
              type="text"
              name="service_name"
              value={formData.service_name}
              onChange={handleChange}
              required
            />
          </FormGroup>
          <FormGroup>
            <Label>Cost ($):</Label>
            <Input 
              type="number"
              name="cost"
              value={formData.cost}
              onChange={handleChange}
              required
              step="0.01"
            />
          </FormGroup>
          <FormGroup>
            <Label>Due Date:</Label>
            <Input 
              type="date"
              name="due_date"
              value={formData.due_date}
              onChange={handleChange}
              required
            />
          </FormGroup>
          <FormGroup>
            <Label>Invitees (comma-separated emails):</Label>
            <Input 
              type="text"
              name="invitees"
              value={formData.invitees}
              onChange={handleChange}
              placeholder="friend1@example.com, friend2@example.com"
            />
          </FormGroup>
          <Button type="submit" disabled={loading}>
            {loading ? 'Creating...' : 'Create Subscription Group'}
          </Button>
        </Form>
      </FormBox>
    </Container>
  );
};

export default CreateSubscription;
