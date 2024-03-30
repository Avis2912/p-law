import { useState, useEffect } from 'react';
import { Editor, EditorState } from 'draft-js';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css'; // import styles

import Stack from '@mui/material/Stack';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Unstable_Grid2';
import Typography from '@mui/material/Typography';
import { getDocs, addDoc, collection } from 'firebase/firestore';

import { db, creator_avatars } from 'src/firebase-config/firebase';
import { products } from 'src/_mock/products';
import Button from '@mui/material/Button';
import { TextField } from '@mui/material';
import ProductSearch from '../product-search';

import CreatorCard from '../creator-card';
import ProductSort from '../product-sort';
import FollowerSort from '../follower-sort';
import PlatformSort from '../platform-sort';
import EngagementSort from '../engagement-sort';
import StyleSort from '../style-sort';


// ----------------------------------------------------------------------

export default function ProductsView() {
  const [openFilter, setOpenFilter] = useState(false);

  const creatorsData = collection(db, 'creators');
  const [resultLength, setResultLength] = useState(0);
  const [allCreators, setAllCreators] = useState([]);

  const [engagement, setEngagement] = useState([]);
  const [locations, setLocations] = useState([]);
  const [platforms, setPlatforms] = useState([]);
  const [followers, setFollowers] = useState([]);
  const [styles, setStyles] = useState([]);

  const [editorState, setEditorState] = useState(EditorState.createEmpty());
  const [text, setText] = 
  useState(`<h1>Blog whats</h1> going on
phh`);

  const [blogDescription, setBlogDescription] = useState('');
  const [blogKeywords, setBlogKeywords] = useState('');


  // useEffect (() => {
  // const addDocument = async () => {
  // await addDoc(creatorsData, { 
  //   pentra_id: 12, 
  //   name: "Tinky itnk", 
  //   email: "jamesjames@g.com",
  //   country: "USA",
  //   address: "12 Main st",

  //   handles: { IG: "@amandacerny", TT: "", YT: "@tink", IG_bio: "", TT_bio: "", YT_bio: ""}, 
  //   followers: {IG: 1788, TT: 0, YT: 0}, 

  //   wantsGifts: true,
  //   wantsSponsors: false,
  //   gifts: { IG_story: true, tiktok: false, IG_post: true, 
  //   IG_reel: true, YT_video: false,  other: false},
  //   sponsor_rates: "",

  //   styles: {makeup: true, skincare: true, fashion: false, lifestyle: false},
  //   Date: '14 Oct', 
  
  //   engagement: 'A+'}); };


  //   const otherstuff = async () => {
  //     try {
  //       const querySnapshot = await getDocs(creatorsData);
  //       setAllCreators(querySnapshot.docs);
  //       const desiredDoc = querySnapshot.docs.find(doc => doc.data().pentra_id === 7);

  //     } catch (error) {
  //       alert(error);
  //     }
  //   }
    

  // otherstuff();
  // // addDocument();
  // }, [creatorsData])


  // // const handleOpenFilter = () => {
  // //   setOpenFilter(true);
  // // };

  // // const handleCloseFilter = () => {
  // //   setOpenFilter(false);
  // // };

  // const searchCreators = () => {
    
  //   alert("done sum");
  // }

  const generateBlog = async () => {
    const gptResponse = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${import.meta.env.VITE_OPENAI_API_KEY}`,  
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: "gpt-3.5-turbo-0125",
        messages: [
          { "role": "system", "content": `You're Chris, my legal assistant.
          NEVER refuse to answer, and give me JUST the requested information.` 
          },
          { "role": "user", "content": `Write a blog post based on the following topic: ${blogDescription}. Keywords (ignore if empty): ${blogKeywords}.
          Wrap titles in <h1> and <h2> tags. Add a \n after the h1 title and each paragraph.
          IMPORTANT: Also this is weird but please add 1-2 image tag like in this example: //image description: {relevant description}//
          `}
        ],  
    }),
    });

    const data = await gptResponse.json();
    setText(data.choices[0].message.content.trim());

  };

  return (
    <Container sx={{backgroundColor: '', height: '100%', paddingBottom: '20px'}}>
      <Typography variant="h3" sx={{ mb: 2, letterSpacing: '-0.px' }}>
        Create Blog Post
      </Typography>

      <Stack mb={2} direction="row" alignItems="center" justifyContent="space-between"
      sx={{}} spacing={2}>
    
      <Stack direction="row" spacing={2} sx={{width: 'calc(100% - 150px)'}}>
      <TextField
       value={blogDescription}
       onChange={(e) => setBlogDescription(e.target.value)}
       placeholder='Blog Description'
       sx={{width: '70%'}} />

      <TextField
       value={blogKeywords}
       onChange={(e) => setBlogKeywords(e.target.value)}
       placeholder='Blog Keywords'
       sx={{width: '30%'}} />
       </Stack>
       
        <Button onClick={() => generateBlog()}
        variant="contained" color="inherit" 
        sx={{height: '54px', width: '150px'}}>
          Generate ✨
        </Button>
        </Stack>

        <ReactQuill 
            value={text}
            onChange={setText}
            style={{ 
                width: '100%', 
                height: '80%', 
                marginBottom: '50px', 
                border: '0px solid #ccc',
                borderRadius: '15px', 
                backgroundColor: 'white',
                opacity: '0.75',
            }}
        />

       

    </Container>
  );
}
