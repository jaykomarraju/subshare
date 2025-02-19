import React from 'react';
import styled, { keyframes } from 'styled-components';

const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(5px); }
  to { opacity: 1; transform: translateY(0); }
`;

const Card = styled.div`
  background: #fff;
  border-radius: 12px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
  padding: 1.5rem;
  margin: 1rem 0;
  border-left: 5px solid #6a82fb;
  animation: ${fadeIn} 0.5s ease-out;
`;

const Title = styled.h4`
  margin: 0 0 0.5rem;
  font-size: 1.4rem;
  color: #333;
  font-family: 'Montserrat', sans-serif;
`;

const Text = styled.p`
  margin: 0.4rem 0;
  font-size: 1rem;
  color: #555;
  font-family: 'Roboto', sans-serif;

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
