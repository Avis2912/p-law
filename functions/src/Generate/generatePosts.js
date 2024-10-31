import { getDoc, doc, collection, getDocs, updateDoc } from '@firebase/firestore';
import { db, auth } from 'src/firebase-config/firebase';
import { addImages } from './addImages';

export const generatePosts = async ({
  isCreateSocial = false,
  postDescription = "",
  genPostPlatform = "LinkedIn",
  wordRange = "2-3",
  postKeywords = "",
  style = "Unstyled",
  isUseNews = false,
  browseText = "",
  isUseBlog = false,
  modelKeys,
  selectedModel,
  isImagesOn = true,
  imageSettings = "Brand",
  browseWeb // Pass this function as a parameter if needed
}) => {
  try {
    const messages = [];
    
    // Get firm info
    const userDoc = await getDoc(doc(db, 'users', auth.currentUser.email));
    let firmName = "", firmDescription = "", bigBlogString = "";
    
    if (userDoc.exists()) {
      const firmDoc = await getDoc(doc(db, 'firms', userDoc.data().FIRM));
      if (firmDoc.exists()) {
        firmName = firmDoc.data().FIRM_INFO.NAME;
        firmDescription = firmDoc.data().FIRM_INFO.DESCRIPTION;
      }
    }

    let browseTextResponse = "";
    if (isUseNews) {
      browseTextResponse = await browseWeb(browseText);
    }

    messages.push({
      "role": "user",
      "content": `<instruction> You are Pentra AI, a lawyer working at ${firmName}, described as ${firmDescription}.  
      YOUR GOAL: Write 3 informative posts for ${genPostPlatform} ${postDescription !== "" ? `based roughly on the following ${isCreateSocial ? `blog post content: ` : `topic: `} ${postDescription}` : ''} 
      
      IMPORTANT INSTRUCTIONS:
      - RESPONSE FORMAT: Always respond with a JSON-parsable array of 3 hashmaps
        EXAMPLE OUTPUT: "[{"platform": "${genPostPlatform}", "content": "*Post Content*"}, {"platform": "${genPostPlatform}", "content": "*Post Content*"}, {"platform": "${genPostPlatform}", "content": "*Post Content*"}]". 
        ONLY OUTPUT THE ARRAY. NOTHING ELSE. Make sure to put quotes at the ends of the content string.
      - Wrap titles in <h2> tags. Wrap EVERY paragraph in <p> tags.
      - PARAGRAPH COUNT: these posts should be ${wordRange} paragraphs long. 
      - IMAGES: post should contain 1 image, placed after the h2 post title. Please add it in this format: //Image: {relevant description}//.
      - ${browseTextResponse !== "" ? `WEB RESULTS: Consider using the following web information: ${browseTextResponse}` : ''}
      - ${postKeywords !== "" ? `KEYWORDS: Use the following keywords in your posts: ${postKeywords}.` : ''}
      - ${style !== "Unstyled" ? `STYLE: This post should SPECIFICALLY be written in the ${style} style.` : ''}
      - Be truly informative about a relevant topic, and mention the firm at the end. Add hashtags in a new paragraph at the very end.
      - DONT ADD ANY SPACE BETWEEN THE JSON AND ARRAY BRACKETS. It should be proper [{}, {}, {}].
      </instruction>

      ${isUseBlog ? `BLOGS: Use the following blogs from the firm to source content from: ${bigBlogString}.` : ''}`
    });

    let gptResponse;
    let textWithoutImages, textWithImages;
    let tries = 0;
    
    do {
      const response = await fetch('https://us-central1-pentra-claude-gcp.cloudfunctions.net/gcp-claudeAPI', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          messages, 
          blogDescription: postDescription, 
          blogKeywords: postKeywords,
          model: modelKeys[selectedModel] 
        })
      });

      gptResponse = await response.text();
      gptResponse = gptResponse.replace(/<br\s*\/?>/gi, '')
        .replace(/<\/p>|<\/h1>|<\/h2>|<\/h3>|\/\/Image:.*?\/\//gi, '$&<br>')
        .replace(/(<image[^>]*>|\/\/Image:.*?\/\/)/gi, '$&<br>');

      try {
        textWithoutImages = JSON.parse(gptResponse.trim().replace(/^```|```$/g, '').replace(/json/g, ''));
        textWithImages = textWithoutImages; console.log('TWI: ', textWithoutImages);
        if (isImagesOn) {textWithImages = await addImages(textWithoutImages, imageSettings);}

        break;
      } catch (error) {
        tries += 1;
        if (tries >= 3) throw error;
      }
    } while (tries < 3);

    // Store in database
    const firmDatabase = collection(db, 'firms');
    const data = await getDocs(firmDatabase);
    const currentUserDoc = await getDoc(doc(db, 'users', auth.currentUser.email));
    const firmDoc = data.docs.find((docc) => docc.id === currentUserDoc.data().FIRM);
    
    if (firmDoc) {
      const firmDocRef = doc(db, 'firms', firmDoc.id);
      const currentDate = new Date();
      const formattedDate = `${currentDate.getMonth() + 1}/${currentDate.getDate()}/${currentDate.getFullYear().toString().substr(-2)} | ${currentDate.getHours() % 12 || 12}:${currentDate.getMinutes()} ${currentDate.getHours() >= 12 ? 'PM' : 'AM'}`;
      const genPosts = firmDoc.data().GEN_POSTS || [];
      const newPost = { [formattedDate]: textWithImages };
      genPosts.unshift(newPost);
      await updateDoc(firmDocRef, { GEN_POSTS: genPosts });
    }

    return textWithImages;
  } catch (error) {
    console.error('Error generating posts:', error);
    throw error;
  }
};