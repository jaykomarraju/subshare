import React from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';

// Mapping for common services (case insensitive)
const serviceColors = {
  netflix: '#E50914',
  hulu: '#1CE783',
  'disney+': '#113CCF',
  'disney +': '#113CCF',
  max: '#000000',
  'youtube premium': '#FF0000'
};

// Helper: Get contrast color (black or white) based on hex luminance.
const getContrastColor = (hexColor) => {
  const hex = hexColor.replace('#', '');
  const r = parseInt(hex.substr(0, 2), 16);
  const g = parseInt(hex.substr(2, 2), 16);
  const b = parseInt(hex.substr(4, 2), 16);
  const brightness = (r * 299 + g * 587 + b * 114) / 1000;
  return brightness < 128 ? '#fff' : '#000';
};

const Card = styled.div`
  background: #fff;
  border-radius: 12px;
  box-shadow: 0 4px 15px rgba(0,0,0,0.1);
  padding: 1.8rem;
  margin: 1rem 0;
  animation: fadeIn 0.5s ease-out;
  border-left: 5px solid ${(props) => props.borderColor};
  
  @keyframes fadeIn {
    from { opacity: 0; transform: translateY(5px); }
    to { opacity: 1; transform: translateY(0); }
  }
`;

const Title = styled.h3`
  margin: 0 0 0.5rem;
  font-size: 1.8rem;
  color: #333;
  font-family: 'Montserrat', sans-serif;
`;

const Text = styled.p`
  margin: 0.3rem 0;
  font-size: 1rem;
  color: #555;
  font-family: 'Roboto', sans-serif;
  
  strong {
    color: #222;
  }
`;

const Badge = styled.span`
  display: inline-block;
  padding: 0.3rem 0.6rem;
  border-radius: 6px;
  background-color: ${(props) => props.bgColor};
  color: ${(props) => props.fgColor};
  font-weight: bold;
  margin-bottom: 0.6rem;
  font-family: 'Montserrat', sans-serif;
`;

const DetailsLink = styled(Link)`
  display: inline-block;
  margin-top: 1rem;
  padding: 0.6rem 1.2rem;
  font-size: 1rem;
  text-decoration: none;
  color: #000;
  border: 2px solid black;
  border-radius: 8px;
  transition: background 0.3s ease;
  font-family: 'Montserrat', sans-serif;
  
  &:hover {
    background: linear-gradient(135deg, #5a72ea 0%, #ea4a67 100%);
    color:#fff;
    border: 2px solid white
  }
`;

const SubscriptionCard = ({ group }) => {
  const { _id, service_name, cost, due_date, invitees, paid } = group;
  const formattedDueDate = new Date(due_date).toLocaleDateString();

  const lowerCaseService = service_name.toLowerCase();
  const logoColor = serviceColors[lowerCaseService] || (paid ? '#4CAF50' : '#FF9800');
  const contrastColor = getContrastColor(logoColor);

  return (
    <Card borderColor={logoColor}>
      <Badge bgColor={logoColor} fgColor={contrastColor}>
        {service_name}
      </Badge>
      <Title>{service_name}</Title>
      <Text><strong>Cost:</strong> ${cost}</Text>
      <Text><strong>Due Date:</strong> {formattedDueDate}</Text>
      <Text><strong>Members Invited:</strong> {invitees ? invitees.length : 0}</Text>
      <Text><strong>Status:</strong> {paid ? 'Paid' : 'Pending'}</Text>
      <DetailsLink to={`/subscription/${_id}`}>View Details</DetailsLink>
    </Card>
  );
};

export default SubscriptionCard;
