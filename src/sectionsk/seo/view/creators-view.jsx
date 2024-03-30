import { useState, useEffect } from 'react';
import { Editor, EditorState } from 'draft-js';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css'; // import styles
import Anthropic from '@anthropic-ai/sdk';
import Stack from '@mui/material/Stack';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import { collection } from 'firebase/firestore';
import Iconify from 'src/components/iconify';
import { db } from 'src/firebase-config/firebase';
import Button from '@mui/material/Button';
import { TextField } from '@mui/material';

const anthropic = new Anthropic({
  apiKey: `${import.meta.env.VITE_ANTHROPIC_API_KEY}`,
});
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
  useState(`<h1>Welcome Back!</h1> Let's draft a new legal blog post today. <br>This is where your content shows up.`);

  const [blogDescription, setBlogDescription] = useState('');
  const [blogKeywords, setBlogKeywords] = useState(null);

  const [isGenMode, setIsGenMode] = useState(false);

  const [isBrowseWeb, setIsBrowseWeb] = useState(false);
  const [browseText, setBrowseText] = useState(null);
  const [browseTextResponse, setBrowseTextResponse] = useState(null);

  const [isMimicBlogStyle, setIsMimicBlogStyle] = useState(false);
  const [imageCount, setImageCount] = useState("2 Images");
  const [wordRange, setWordRange] = useState("600 - 800 Words");
  const [style, setStyle] = useState("Unstyled");
  const [isReferenceGiven, setIsReferenceGiven] = useState(false);
  const [referenceText, setReferenceText] = useState(null);
  const [isUseInternalLinks, setIsUseInternalLinks] = useState(false);
  const [isMentionCaseLaw, setIsMentionCaseLaw] = useState(false);





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
    if (!isGenMode) {setIsGenMode(true)};
    setText('<h1>✨ Generating... </h1> ');
    const gptResponse = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${import.meta.env.VITE_OPENAI_API_KEY}`,  
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: "gpt-3.5-turbo-0125",
        messages: [
          // { "role": "system", "content": `You're Chris, my legal assistant.
          // NEVER refuse to answer, and give me JUST the requested information.` 
          // },
          { "role": "system", "content": isGenMode ? 
          `You are Pentra AI, a legal expert and an expert SEO blog writer.  Write a blog post based on the following topic: ${blogDescription}. 
          ${blogKeywords && `Keywords: ${blogKeywords}`}. Consider using the following outline: ${text}. 

          IMPORTANT INSTRUCTIONS:
          - Wrap titles in <h1> and <h2> tags. Dont use ANY new lines but add two <br> tags after EVERY paragraph and one <br> tag after EVERY h1/h2 tag.
          - This blog post should be ${wordRange} long.
          - This blog post should contain ${imageCount}. Please add them like in this example: //image description: {relevant description}//. Add a <br> tag after.
          - ${style !== "Unstyled" ? `STYLE: This blog post should be written in the ${style} style.` : ''}
          - ${isMentionCaseLaw ? `CASE LAW: Reference case law in the blog post when necessary.` : ''}
          - ${isUseInternalLinks ? `INTERNAL LINKS: Add some internal links to the blog post using <a> tags.` : ''}
          - ${isReferenceGiven ? `USEFUL DATAL: Refer the following text: ${referenceText}` : ''}
          - ${isBrowseWeb ? `WEB RESULTS: Consider using the following web results if necessary: ${browseTextResponse}` : ''}
          ` 
          : `You are Pentra AI, a legal expert and an expert SEO blog writer. 
             Write a detailed blog outline in rich text format using <h1> tags and <br> tags (after every paragraph/line) based on the following topic: ${blogDescription}. ${blogKeywords && `Keywords: ${blogKeywords}`}.`
        }
        ],  
    }),
    });

    const data = await gptResponse.json();
    await setText(data.choices[0].message.content.trim());
    console.log(data.choices[0].message.content.trim());

    // const gptResponse = await anthropic.messages.create({
    //   model: "claude-3-sonnet-20240229",
    //   max_tokens: 4024,
    //   messages: [{ role: "user", content: "Hello, Claude. hows it going?" }],
    // });

    // gptResponse().then((data) => {
    //   console.log(data.content[0].text);
    //   alert(data.content[0].text);
    // });

  };

  return (
    <Container sx={{backgroundColor: '', height: '100%', paddingBottom: '20px'}}>
      
      <Stack mb={2} direction="row" alignItems="center" justifyContent="space-between"
      sx={{}} spacing={2}>
      <Typography variant="h3" sx={{ mb: 2, letterSpacing: '-0.px' }}>
        Create Blog Post
      </Typography>

      <Stack direction="row" spacing={2} >

      <Button variant="contained" startIcon={<Iconify icon="eva:plus-fill" />} 
      onClick={() => {
        switch (wordRange) {
          case "Upto 200 Words": setWordRange("200 - 400 Words"); break;
          case "200 - 400 Words": setWordRange("400 - 600 Words"); break;
          case "400 - 600 Words": setWordRange("600 - 800 Words"); break;
          case "600 - 800 Words": setWordRange("800 - 1000 Words"); break;
          case "800 - 1000 Words": setWordRange("1000 - 1200 Words"); break;
          case "1000 - 1200 Words": setWordRange("Upto 200 Words"); break;
          default: setWordRange("600 - 800 Words");
        }
      }}
      sx={{backgroundColor: 'green', '&:hover': { backgroundColor: 'green', },}}>
      {wordRange} </Button>

      <Button variant="contained" startIcon={<Iconify icon="eva:plus-fill" />} 
      onClick={() => {
        switch (imageCount) {
          case "2 Images": setImageCount("3 Images"); break;
          case "3 Images": setImageCount("4 Images"); break;
          case "4 Images": setImageCount("5 Images"); break;
          case "5 Images": setImageCount("No Images"); break;
          case "No Images": setImageCount("1 Image"); break;
          case "1 Image": setImageCount("2 Images"); break;
          default: setImageCount("2 Images");
        }
      }}
      sx={{backgroundColor: 'green', '&:hover': { backgroundColor: 'green', },}}>
      {imageCount} </Button>

      <Button variant="contained" startIcon={<Iconify icon="eva:plus-fill" />} 
      onClick={() => {
        switch (style) {
          case "Unstyled": setStyle("How-To"); break;
          case "How-To": setStyle("Narrative"); break;
          case "Narrative": setStyle("Opinion"); break;
          case "Opinion": setStyle("Case Study"); break;
          case "Case Study": setStyle("Comparision"); break;
          case "Comparision": setStyle("Case Law Breakdown"); break;
          case "Case Law Breakdown": setStyle("Unstyled"); break;
          default: setStyle("Unstyled");
        }
      }}
        sx={{backgroundColor: 'green', '&:hover': { backgroundColor: 'green', },}}>
        {style} </Button>



        </Stack></Stack>

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
          {isGenMode ? 'Generate ✨' : 'Begin Outline ✨'}
        </Button>
        </Stack>

        <ReactQuill 
            value={text}
            onChange={setText}
            // modules={{ toolbar: isGenMode ? true : false }}
            style={{ 
                width: '100%', 
                height: isReferenceGiven || isBrowseWeb ? 'calc(80% - 155px)' : 'calc(80% - 55px)', 
                marginBottom: '58px', 
                border: '0px solid #ccc',
                borderRadius: '15px', 
                backgroundColor: 'white',
                opacity: '0.75',
                transition: 'ease 0.3s',
            }}
        />

      {
      // !isGenMode && 
      (<>
        <Stack direction="row" spacing={2} >

        <Button variant="contained" sx={{backgroundColor: 'black', '&:hover': { backgroundColor: 'black', }, cursor: 'default'}}>
        Power Tools <Iconify icon="eva:arrow-right-fill" /></Button>
                  
        <Button variant="contained" startIcon={<Iconify icon="eva:plus-fill" />} onClick={() => {setIsBrowseWeb(!isBrowseWeb); setIsReferenceGiven(false);}}
        sx={{backgroundColor: isBrowseWeb ? 'green' : 'grey', '&:hover': { backgroundColor: 'green', },}}>
        Browse Web </Button>

        <Button variant="contained" startIcon={<Iconify icon="eva:plus-fill" />} onClick={() => {setIsMentionCaseLaw(!isMentionCaseLaw)}}
        sx={{backgroundColor: isMentionCaseLaw ? 'green' : 'grey', '&:hover': { backgroundColor: 'green', },}}>
        Mention Case Law </Button>

          <Button variant="contained" startIcon={<Iconify icon="eva:plus-fill" />} onClick={() => {setIsMimicBlogStyle(!isMimicBlogStyle)}}
        sx={{backgroundColor: isMimicBlogStyle ? 'green' : 'grey', '&:hover': { backgroundColor: 'green', },}}>
        Mimic My Firm&apos;s Style </Button>


          <Button variant="contained" startIcon={<Iconify icon="eva:plus-fill" />} onClick={() => {setIsReferenceGiven(!isReferenceGiven); setIsBrowseWeb(false);}}
        sx={{backgroundColor: isReferenceGiven ? 'green' : 'grey', '&:hover': { backgroundColor: 'green', },}}>
          Use New Data </Button>

          <Button variant="contained" startIcon={<Iconify icon="eva:plus-fill" />} onClick={() => {setIsUseInternalLinks(!isUseInternalLinks)}}
        sx={{backgroundColor: isUseInternalLinks ? 'green' : 'grey', '&:hover': { backgroundColor: 'green', },}}>
          Internal Links </Button>

        </Stack> 

        {isReferenceGiven && (
        <textarea value={referenceText} onChange={(e) => setReferenceText(e.target.value)} 
        style={{width: '100%', height: '225px', marginTop: '18px', border: '0.1px solid',
        borderRadius: '0px', padding: '15px', fontSize: '15px', fontFamily: 'Arial',}} 
        placeholder='Feed any text here you would like the AI model to use. It helps to explain how youd like it to use it in the blog description.'/>
        )}


        {isBrowseWeb && (<>
        <Stack direction="row" spacing={2} alignItems="center" mt={2}>
        
        <Button onClick={() => generateBlog()}
        variant="contained" color="inherit" 
        sx={{height: '54px', width: '150px'}}>
          Search For 
          <Iconify icon="eva:arrow-right-fill" />
        </Button>

        <TextField
        value={blogDescription}
        onChange={(e) => setBlogDescription(e.target.value)}
        placeholder='Personal Injury News in the last 7 days'
        sx={{width: '100%', mt: 0, }} /> 
        </Stack>
       </>)}

        </>
        )}

       

    </Container>
  );
}
