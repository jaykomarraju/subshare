// src/App.js
import React from 'react';
import { AuthProvider } from './contexts/AuthContext';
import AppRoutes from './routes/AppRoutes';
import Navbar from './components/common/Navbar';
import Footer from './components/common/Footer';
import { BrowserRouter as Router } from 'react-router-dom';
import styled from 'styled-components';

const AppContainer = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  background: #f4f4f4;
`;

const Content = styled.main`
  flex: 1;
  display: flex;
  flex-direction: column;
`;

function App() {
  return (
    <Router>
      <AuthProvider>
        <AppContainer>
          <Navbar />
          <Content>
            <AppRoutes />
          </Content>
          <Footer />
        </AppContainer>
      </AuthProvider>
    </Router>
  );
}

export default App;
