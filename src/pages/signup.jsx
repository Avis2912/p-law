import { Helmet } from 'react-helmet-async';

import { SignUpView } from 'src/sectionsk/signup';

// ----------------------------------------------------------------------

export default function SignUpPage() {
  return (
    <>
      <Helmet>
        <title> SignUp | Pentra </title>
      </Helmet>

      <SignUpView />
    </>
  );
}
