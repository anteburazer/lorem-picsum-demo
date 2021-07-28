import React from 'react';
import { Login as LoginModule } from 'modules/auth';
import style from './Auth.module.scss';

const Login: React.FC = () => {
  return (
    <div className={`${style.authContainer} mt-5 pt-5`}>
      <LoginModule />
    </div>
  );
};

export default Login;