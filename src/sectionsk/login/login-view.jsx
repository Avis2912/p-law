import Box from '@mui/material/Box';
import Link from '@mui/material/Link';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import LoadingButton from '@mui/lab/LoadingButton';
import { alpha, useTheme } from '@mui/material/styles';
import InputAdornment from '@mui/material/InputAdornment';

import { getDoc, updateDoc, doc, setDoc, collection, query, where } from 'firebase/firestore';

import { useRouter } from 'src/routes/hooks';

import { bgGradient } from 'src/theme/css';

import Logo from 'src/components/logo';
import Iconify from 'src/components/iconify';

import { db, auth, googleProvider } from 'src/firebase-config/firebase';
import { signInWithEmailAndPassword, signInWithPopup } from 'firebase/auth';
import { useState, useEffect } from 'react';

// import loginImage from '/assets/images/covers/cover_19.jpg';

export default function LoginView() {
  const theme = useTheme();
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const brandsData = collection(db, 'brands');

  const handleClick = () => {
    router.push('/signup');
  };

  const handleHome = () => {
    router.push('/');
  };


const createUserDocument = async (user) => {
    const usersRef = doc(db, 'users', user.email);
    const usersSnapshot = await getDoc(usersRef);

    if (!usersSnapshot.exists()) {
        const currentDate = new Date();
        const formattedDate = `${currentDate.getDate()} ${currentDate.toLocaleString('default', { month: 'short' })}`;

        await setDoc(usersRef, {
            FIRM: 'testlawyers',
            DATE_SIGNED_UP: formattedDate,
        });
    } else {
        const userData = usersSnapshot.data();
        if (!userData.FIRM) {await updateDoc(usersRef, {FIRM: 'testlawyers', });   
    }}
}

const signUpWithGoogle = async () => {
    try {
        const userCredential = await signInWithPopup(auth, googleProvider);
        const user = userCredential.user;
        await createUserDocument(user);
    } catch (err) {
        alert(err);
        return;
    }
    router.push('/seo');
};

const SignIn = async () => {
    try {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;
        // await createUserDocument(user);
    } catch (err) {
        alert('Invalid email / password');
        return;
    }
    router.push('/seo');
};

  const renderForm = (
    <>
      <Stack spacing={3}>
        <TextField
          name="email"
          label="Email address"
          onChange={(e) => setEmail(e.target.value)}
        />

        <TextField
          onChange={(e) => setPassword(e.target.value)}
          name="password"
          label="Password"
          type={showPassword ? 'text' : 'password'}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
                  <Iconify
                    icon={showPassword ? 'eva:eye-fill' : 'eva:eye-off-fill'}
                  />
                </IconButton>
              </InputAdornment>
            ),
          }}
        />
      </Stack>

      <Stack direction="row" alignItems="center" justifyContent="flex-end" sx={{ my: 2 }} />

      

      <LoadingButton
        fullWidth
        size="large"
        type="submit"
        variant="contained"
        color="inherit"
        onClick={SignIn}
      >
        Login
      </LoadingButton>

      <Stack direction="row" alignItems="center" justifyContent="flex-end" sx={{ my: 2 }}>
        <Link variant="subtitle2" underline="hover" onClick={handleClick}>
          Forgot password?
        </Link>
      </Stack>
    </>
  );

  return (
    <Box
      sx={{
        display: 'flex',
        height: 1,
      }}
    >
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          flex: 1,
          ...bgGradient({
            color: alpha(theme.palette.background.default, 0.9),
            imgUrl: '/assets/background/overlay_4.jpg',
          }),
        }}
      >
        <Logo
          sx={{
            position: 'fixed',
            top: { xs: 16, md: 24 },
            left: { xs: 16, md: 24 },
          }}
        />
        <Stack
          alignItems="center"
          justifyContent="center"
          sx={{ height: 1, p: { xs: 5, md: 0 },backgroundColor: theme.palette.primary.navBg }}
        >
          <Card
            sx={{
              p: 5, pb: 1, pt: 4.25,
              width: 1,
              maxWidth: 420,
            }}
          >
            <Typography variant="h4">Sign in to Pentra</Typography>
            <Typography variant="body2" sx={{ mt: 2, mb: 3 }}>
              Don’t have an account?
              <Link variant="subtitle2" sx={{ ml: 0.5 }} onClick={handleClick}>
                Get started
              </Link>
            </Typography>
            <Stack direction="row" spacing={2}>
              <Button
                fullWidth
                size="large"
                color="inherit"
                variant="outlined"
                onClick={signUpWithGoogle}
                sx={{
                  borderColor: alpha(theme.palette.grey[500], 0.16),
                }}
              >
                <Iconify icon="eva:google-fill" color="#DF3E30" />
              </Button>
            </Stack>
            <Divider sx={{ my: 3 }}>
              <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                OR
              </Typography>
            </Divider>
            {renderForm}
          </Card>
        </Stack>
      </Box>
      <Box
        sx={{
          flex: 1,
          backgroundColor: alpha(theme.palette.primary.main, 0.2), // Adjust the shade of pink
        }}
      >
        <img
          src="/assets/images/covers/cover_19.jpg"
          alt="Login"
          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
        />
      </Box>
    </Box>
  );
}
