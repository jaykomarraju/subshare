// src/components/common/Footer.js
import React from 'react';
import styled from 'styled-components';

const FooterContainer = styled.footer`
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 1rem;
  background-color: #222;
  color: #fff;
  font-size: 0.875rem;
  text-align: center;
`;

const Footer = () => {
  return (
    <FooterContainer>
      <p>© {new Date().getFullYear()} Subshare. All rights reserved.</p>
    </FooterContainer>
  );
};

export default Footer;
