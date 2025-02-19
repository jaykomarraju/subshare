import React, { useState } from 'react';
import { createSubscriptionGroup } from '../api/subscriptions';
import { useNavigate } from 'react-router-dom';
import styled, { keyframes } from 'styled-components';

const slideIn = keyframes`
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
`;

const Container = styled.div`
  min-height: 100vh;
  background: linear-gradient(135deg, #f6d365 0%, #fda085 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem;
`;

const FormBox = styled.div`
  background: #ffffffcc;
  backdrop-filter: blur(4px);
  padding: 2.5rem;
  border-radius: 16px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
  width: 100%;
  max-width: 500px;
  animation: ${slideIn} 0.5s ease-out;
`;

const Title = styled.h2`
  text-align: center;
  font-size: 2rem;
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
