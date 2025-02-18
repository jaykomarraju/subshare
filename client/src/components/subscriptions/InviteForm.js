// src/components/subscriptions/InviteForm.js
import React, { useState } from 'react';
import styled from 'styled-components';

const FormContainer = styled.div`
  background: #fff;
  padding: 2rem;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  max-width: 400px;
  margin: 1rem auto;
`;

const Title = styled.h3`
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
      <Title>Invite Additional Members</Title>
      {error && <Message error>{error}</Message>}
      {successMsg && <Message>{successMsg}</Message>}
      <Form onSubmit={handleSubmit}>
        <FormGroup>
          <Label>Emails (comma-separated):</Label>
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
