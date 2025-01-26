import { Helmet } from 'react-helmet-async';

import { CONFIG } from 'src/config-global';

import { LoginView } from 'src/auth/log-in-view';

// ----------------------------------------------------------------------

export default function LoginPage() {
  return (
    <>
      <Helmet>
        <title> {`Sign in - ${CONFIG.appName}`}</title>
      </Helmet>

      <LoginView />
    </>
  );
}
