import React from 'react';
import { RequestMagicLinkForm } from '../../features/auth/RequestMagicLinkForm';
import './LoginPage.scss';

export const LoginPage: React.FC = () => {
  return (
    <div className="login-page-wrapper">
      {/* Rendering the modular magic link form inside the login page */}
      <RequestMagicLinkForm />
    </div>
  );
};