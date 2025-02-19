import React, { useState } from 'react';
import styled, { keyframes } from 'styled-components';
import { logPayment } from '../../api/payments';

const slideUp = keyframes`
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
  animation: ${slideUp} 0.5s ease-out;
`;

const Title = styled.h3`
  text-align: center;
  color: #333;
  margin-bottom: 1rem;
  font-family: 'Montserrat', sans-serif;
`;

const ErrorMessage = styled.p`
  color: #e74c3c;
  font-size: 0.95rem;
  text-align: center;
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

const Select = styled.select`
  padding: 0.65rem;
  font-size: 1rem;
  border: 1px solid #ddd;
  border-radius: 6px;
  background: #fff;
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

const PaymentForm = ({ groupId, onPaymentLogged }) => {
  const [formData, setFormData] = useState({
    group_id: groupId,
    amount: '',
    method: 'manual',
    details: '',
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
    
    const currentUser = JSON.parse(localStorage.getItem('user'));
    const payload = { 
      ...formData, 
      payer_email: currentUser.email 
    };
    
    try {
      const data = await logPayment(payload);
      setLoading(false);
      if (onPaymentLogged) {
        onPaymentLogged(data.payment);
      }
    } catch (err) {
      setLoading(false);
      setError(err.message || 'Failed to log payment');
    }
  };

  return (
    <FormContainer>
      <Title>Log Payment</Title>
      {error && <ErrorMessage>{error}</ErrorMessage>}
      <Form onSubmit={handleSubmit}>
        <FormGroup>
          <Label>Amount ($):</Label>
          <Input
            type="number"
            name="amount"
            value={formData.amount}
            onChange={handleChange}
            required
            step="0.01"
          />
        </FormGroup>
        <FormGroup>
          <Label>Method:</Label>
          <Select name="method" value={formData.method} onChange={handleChange}>
            <option value="manual">Manual</option>
            <option value="venmo">Venmo</option>
          </Select>
        </FormGroup>
        <FormGroup>
          <Label>Details (optional):</Label>
          <Input
            type="text"
            name="details"
            value={formData.details}
            onChange={handleChange}
            placeholder="Enter transaction ID or notes"
          />
        </FormGroup>
        <Button type="submit" disabled={loading}>
          {loading ? 'Logging...' : 'Log Payment'}
        </Button>
      </Form>
    </FormContainer>
  );
};

export default PaymentForm;
