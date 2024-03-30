import { Helmet } from 'react-helmet-async';

import { SignUpView } from 'src/sectionsk/signup';

// ----------------------------------------------------------------------

export default function SignUpPage() {
  return (
    <>
      <Helmet>
        <title> SignUp | Minimal UI </title>
      </Helmet>

      <SignUpView />
    </>
  );
}
