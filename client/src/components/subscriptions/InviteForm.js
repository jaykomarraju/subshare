import React, { useState } from 'react';
import styled, { keyframes } from 'styled-components';

const slideIn = keyframes`
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
`;

const FormContainer = styled.div`
  background: #fff;
  padding: 1.8rem;
  border-radius: 12px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
  max-width: 450px;
  margin: 2rem auto;
  animation: ${slideIn} 0.5s ease-out;
`;

const Title = styled.h3`
  text-align: center;
  color: #333;
  margin-bottom: 1rem;
  font-family: 'Montserrat', sans-serif;
`;

const Message = styled.p`
  text-align: center;
  font-size: 0.95rem;
  color: ${(props) => (props.error ? '#e74c3c' : '#27ae60')};
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
  padding: 0.65rem;
  font-size: 1rem;
  border: 1px solid #ddd;
  border-radius: 6px;
  transition: border-color 0.3s ease;
  font-family: 'Roboto', sans-serif;

  &:focus {
    border-color: #6a82fb;
    outline: none;
  }
`;

const Button = styled.button`
  padding: 0.75rem;
  font-size: 1rem;
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

const InviteForm = ({ onInvite }) => {
  const [inviteesInput, setInviteesInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [successMsg, setSuccessMsg] = useState(null);

  const handleChange = (e) => {
    setInviteesInput(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccessMsg(null);
    setLoading(true);

    const invitees = inviteesInput
      .split(',')
      .map(email => email.trim())
      .filter(email => email.length > 0);

    if (invitees.length === 0) {
      setError('Please enter at least one valid email address.');
      setLoading(false);
      return;
    }

    try {
      await onInvite(invitees);
      setSuccessMsg('Invitations sent successfully.');
      setInviteesInput('');
    } catch (err) {
      setError(err.message || 'Failed to send invitations.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <FormContainer>
      <Title>Invite Friends</Title>
      {error && <Message error>{error}</Message>}
      {successMsg && <Message>{successMsg}</Message>}
      <Form onSubmit={handleSubmit}>
        <FormGroup>
          <Label>Emails (comma separated):</Label>
          <Input
            type="text"
            value={inviteesInput}
            onChange={handleChange}
            placeholder="e.g., friend1@example.com, friend2@example.com"
          />
        </FormGroup>
        <Button type="submit" disabled={loading}>
          {loading ? 'Sending...' : 'Send Invites'}
        </Button>
      </Form>
    </FormContainer>
  );
};

export default InviteForm;
