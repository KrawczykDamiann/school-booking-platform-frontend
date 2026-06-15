import React from 'react';
import { RequestMagicLinkForm } from '../../features/auth/RequestMagicLinkForm';

export const LoginPage: React.FC = () => {
  return (
    <div className="login-page-wrapper" style={{ minHeight: '100vh', backgroundColor: '#f9fafb', display: 'flex', alignItems: 'center' }}>
      {/* Rendering the modular magic link form inside the login page */}
      <RequestMagicLinkForm />
    </div>
  );
};