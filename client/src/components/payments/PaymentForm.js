// src/components/payments/PaymentForm.js
import React, { useState } from 'react';
import styled from 'styled-components';
import { logPayment } from '../../api/payments';

const FormContainer = styled.div`
  background: #fff;
  padding: 2rem;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  max-width: 400px;
  margin: 1rem auto;
`;

const Title = styled.h3`
  margin-bottom: 1rem;
  color: #333;
  text-align: center;
`;

const ErrorMessage = styled.p`
  color: red;
  font-size: 0.9rem;
  text-align: center;
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

const Select = styled.select`
  padding: 0.5rem;
  font-size: 1rem;
  border: 1px solid #ccc;
  border-radius: 4px;
  background: #fff;
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
    try {
      const data = await logPayment(formData);
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
      <Title>Log a Payment</Title>
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
          {loading ? 'Logging Payment...' : 'Log Payment'}
        </Button>
      </Form>
    </FormContainer>
  );
};

export default PaymentForm;
