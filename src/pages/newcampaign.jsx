import { Helmet } from 'react-helmet-async';
import { auth } from 'src/firebase-config/firebase';
import { AccountView } from 'src/sectionsk/newcampaign/view';


// ----------------------------------------------------------------------

export default function ListsPage() {
  if (!auth.currentUser) {
    window.location.href = '/login';
  }  return (
    <>
      <Helmet>
        <title> New Campaign </title>
      </Helmet>

      <AccountView />
    </>
  );
}
