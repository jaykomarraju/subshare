import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import styled, { keyframes } from 'styled-components';
import Loader from '../components/common/Loader';
import InviteForm from '../components/subscriptions/InviteForm';
import PaymentForm from '../components/payments/PaymentForm';
import PaymentCard from '../components/payments/PaymentCard';
import { getGroupDetails, markSubscriptionAsPaid, inviteMembers } from '../api/subscriptions';
import { getGroupPayments } from '../api/payments';

const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
`;

const Container = styled.div`
  min-height: 100vh;
  background: linear-gradient(135deg, #f6d365 0%, #fda085 100%);
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 2rem;
`;

const DetailsBox = styled.div`
  background: #ffffffcc;
  backdrop-filter: blur(4px);
  padding: 2rem;
  border-radius: 16px;
  box-shadow: 0 4px 20px rgba(0,0,0,0.15);
  width: 100%;
  max-width: 700px;
  margin-bottom: 2rem;
`;

const Title = styled.h2`
  text-align: center;
  font-size: 2rem;
  color: #333;
  margin-bottom: 1rem;
  font-family: 'Montserrat', sans-serif;
`;

const InfoText = styled.p`
  font-size: 1.1rem;
  color: #555;
  margin: 0.5rem 0;
  font-family: 'Roboto', sans-serif;
  
  strong {
    color: #222;
  }
`;

const List = styled.ul`
  list-style: none;
  padding: 0;
  margin-top: 1rem;
`;

const ListItem = styled.li`
  font-size: 1rem;
  color: #444;
  padding: 0.75rem;
  border-bottom: 1px solid #eee;
  font-family: 'Roboto', sans-serif;
`;

const Button = styled.button`
  width: 100%;
  padding: 0.75rem;
  margin-top: 1.5rem;
  font-size: 1.1rem;
  font-weight: bold;
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

const Section = styled.div`
  margin-top: 2rem;
  width: 100%;
`;

const PaymentsContainer = styled.div`
  width: 100%;
  max-width: 700px;
`;

const SubscriptionDetails = () => {
  const { id } = useParams();
  const [group, setGroup] = useState(null);
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // For demo purposes, we assume admin rights here.
  const isAdmin = true;

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
    if (group) {
      const updatedInvitees = group.invitees.map((invitee) =>
        invitee.email === payment.payer_email ? { ...invitee, status: 'Paid' } : invitee
      );
      setGroup({ ...group, invitees: updatedInvitees });
    }
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
          <h3 style={{ fontFamily: 'Montserrat, sans-serif', color: '#333' }}>Invitees</h3>
          <List>
            {group.invitees.map((invitee, index) => (
              <ListItem key={index}>
                {invitee.email} - {invitee.status}
              </ListItem>
            ))}
          </List>
        </Section>
        {isAdmin && (
          <Button onClick={handleMarkPaid} disabled={group.paid}>
            {group.paid ? 'Already Paid' : 'Mark as Paid'}
          </Button>
        )}
        <Section>
          <InviteForm onInvite={handleInvite} />
        </Section>
      </DetailsBox>
      <PaymentsContainer>
        <h3 style={{ fontFamily: 'Montserrat, sans-serif', color: '#333', textAlign: 'center' }}>Payments</h3>
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
