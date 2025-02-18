// src/pages/SubscriptionDetails.js
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import styled from 'styled-components';
import Loader from '../components/common/Loader';
import InviteForm from '../components/subscriptions/InviteForm';
import PaymentForm from '../components/payments/PaymentForm';
import PaymentCard from '../components/payments/PaymentCard';
import { getGroupDetails, markSubscriptionAsPaid, inviteMembers } from '../api/subscriptions';
import { getGroupPayments } from '../api/payments';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 2rem;
  background-color: #f4f4f4;
//   min-height: 100vh;
`;

const DetailsBox = styled.div`
  background: #fff;
  padding: 2rem;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  width: 100%;
  max-width: 600px;
`;

const Title = styled.h2`
  text-align: center;
  color: #333;
  margin-bottom: 1rem;
`;

const InfoText = styled.p`
  font-size: 1rem;
  color: #555;

  strong {
    color: #222;
  }
`;

const List = styled.ul`
  list-style: none;
  padding: 0;
  margin-top: 0.5rem;
`;

const ListItem = styled.li`
  font-size: 1rem;
  color: #555;
  padding: 0.5rem 0;
  border-bottom: 1px solid #eee;
`;

const Button = styled.button`
  padding: 0.75rem;
  font-size: 1rem;
  color: #fff;
  background-color: ${(props) => (props.disabled ? '#ccc' : '#4CAF50')};
  border: none;
  border-radius: 4px;
  cursor: ${(props) => (props.disabled ? 'not-allowed' : 'pointer')};
  transition: background 0.3s ease-in-out;
  width: 100%;
  margin-top: 1rem;

  &:hover {
    background-color: ${(props) => (props.disabled ? '#ccc' : '#45a049')};
  }
`;

const Section = styled.div`
  margin-top: 2rem;
  width: 100%;
`;

const PaymentsContainer = styled.div`
  width: 100%;
  max-width: 600px;
  margin-top: 1rem;
`;

const SubscriptionDetails = () => {
  const { id } = useParams();
  const [group, setGroup] = useState(null);
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchDetails() {
      try {
        const groupData = await getGroupDetails(id);
        setGroup(groupData);
        const paymentData = await getGroupPayments(id);
        setPayments(paymentData);
      } catch (err) {
        setError(err.message || 'Failed to load subscription details.');
      } finally {
        setLoading(false);
      }
    }
    fetchDetails();
  }, [id]);

  const handleInvite = async (invitees) => {
    try {
      await inviteMembers(id, invitees);
      const updatedGroup = await getGroupDetails(id);
      setGroup(updatedGroup);
    } catch (err) {
      alert(err.message || 'Failed to send invitations.');
    }
  };

  const handleMarkPaid = async () => {
    try {
      await markSubscriptionAsPaid(id);
      const updatedGroup = await getGroupDetails(id);
      setGroup(updatedGroup);
    } catch (err) {
      alert(err.message || 'Failed to mark subscription as paid.');
    }
  };

  const handlePaymentLogged = (payment) => {
    setPayments([...payments, payment]);
  };

  if (loading) return <Loader />;
  if (error) return <InfoText>{error}</InfoText>;
  if (!group) return <InfoText>No subscription group details found.</InfoText>;

  return (
    <Container>
      <DetailsBox>
        <Title>{group.service_name} Subscription Details</Title>
        <InfoText><strong>Cost:</strong> ${group.cost}</InfoText>
        <InfoText><strong>Due Date:</strong> {new Date(group.due_date).toLocaleDateString()}</InfoText>
        <InfoText><strong>Status:</strong> {group.paid ? 'Paid' : 'Pending'}</InfoText>

        <Section>
          <h3>Invitees:</h3>
          <List>
            {group.invitees.map((invitee, index) => (
              <ListItem key={index}>
                {invitee.email} - {invitee.status}
              </ListItem>
            ))}
          </List>
        </Section>

        <Button onClick={handleMarkPaid} disabled={group.paid}>
          {group.paid ? 'Already Paid' : 'Mark as Paid'}
        </Button>

        <Section>
          <InviteForm onInvite={handleInvite} />
        </Section>
      </DetailsBox>

      <PaymentsContainer>
        <h3>Payments</h3>
        {payments.length === 0 ? (
          <InfoText>No payments logged yet.</InfoText>
        ) : (
          payments.map((payment) => (
            <PaymentCard key={payment._id} payment={payment} />
          ))
        )}
        <PaymentForm groupId={id} onPaymentLogged={handlePaymentLogged} />
      </PaymentsContainer>
    </Container>
  );
};

export default SubscriptionDetails;
