import React from 'react';
import styles from './LoginPage.module.scss';
import { RequestMagicLinkForm } from '../../features/auth/RequestMagicLinkForm';

export const LoginPage: React.FC = () => {
  return (
    <div className={styles.loginPageWrapper}>
      {/* Target glassmorphic scope using the modules object properties */}
      <div className={styles.loginCard}>
        {/* Rendering the modular magic link form inside the styled glass viewport */}
        <RequestMagicLinkForm />
      </div>
    </div>
  );
};
