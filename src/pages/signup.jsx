import { Helmet } from 'react-helmet-async';
import SignUpView from 'src/sectionsk/signup/signup-view';

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
