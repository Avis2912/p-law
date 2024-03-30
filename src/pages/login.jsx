import { Helmet } from 'react-helmet-async';

import { LoginView } from 'src/sectionsk/login';

// ----------------------------------------------------------------------

export default function LoginPage() {
  return (
    <>
      <Helmet>
        <title> Login | Pentra </title>
      </Helmet>

      <LoginView />
    </>
  );
}
