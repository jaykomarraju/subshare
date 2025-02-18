// src/components/payments/PaymentCard.js
import React from 'react';
import styled from 'styled-components';

const Card = styled.div`
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  padding: 1.5rem;
  margin: 1rem 0;
//   max-width: 400px;
  border-left: 5px solid #4CAF50;
`;

const Title = styled.h4`
  margin: 0 0 0.5rem;
  font-size: 1.25rem;
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

const PaymentCard = ({ payment }) => {
  const formattedDate = new Date(payment.payment_date).toLocaleString();

  return (
    <Card>
      <Title>Payment: ${payment.amount}</Title>
      <Text><strong>Method:</strong> {payment.method}</Text>
      {payment.details && <Text><strong>Details:</strong> {payment.details}</Text>}
      <Text><strong>Date:</strong> {formattedDate}</Text>
    </Card>
  );
};

export default PaymentCard;
