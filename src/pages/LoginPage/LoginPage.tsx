import React from 'react';
import { RequestMagicLinkForm } from '../../features/auth/RequestMagicLinkForm';
import './LoginPage.scss';

export const LoginPage: React.FC = () => {
  return (
    <div className="login-page-wrapper">
      {/* Visual 3D glassmorphic card container that catches the SCSS overlay styles */}
      <div className="login-card">
        {/* Rendering the modular magic link form inside the styled glass viewport */}
        <RequestMagicLinkForm />
      </div>
    </div>
  );
};