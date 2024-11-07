import { getDoc, doc } from 'firebase/firestore';
import { db, auth } from 'src/firebase-config/firebase';
import { modelKeys } from 'src/genData/models';
import { addImages } from './addImages';

export const generateNewsletter = async ({ content, imageSettings = "Web" }) => {
  try {
    // Get firm info
    const userDoc = await getDoc(doc(db, 'users', auth.currentUser.email));
    let firmName = '', firmDescription = '';
    if (userDoc.exists()) {
      const firmDoc = await getDoc(doc(db, 'firms', userDoc.data().FIRM));
      if (firmDoc.exists()) {
        firmName = firmDoc.data().FIRM_INFO.NAME;
        firmDescription = firmDoc.data().FIRM_INFO.DESCRIPTION;
      }
    }

    const messages = [
      {
        "role": 'user',
        "content": `
          <instruction>
          You are a marketing assistant for ${firmName}, a law firm described as ${firmDescription}.
          Your task is to create an engaging email newsletter based on the following blog content:
          ${content}

          IMPORTANT INSTRUCTIONS:
          - The newsletter MUST start with a title wrapped in <h2> tags
          - The newsletter should be written in HTML format, suitable for email clients
          - For any lists, don't use ul or ol tags. only numbers
          - Include a catchy subject line and a greeting
          - Summarize the key points of the blog post
          - Include a call-to-action encouraging readers to visit our website or contact us
          - Add an image placeholder after the title in this format: //Image: {relevant description}//
          - Structure: <h2>Title</h2> //Image// <p>Content</p>
          </instruction>
        `,
      },
    ];

    const response = await fetch('https://us-central1-pentra-claude-gcp.cloudfunctions.net/gcp-claudeAPI', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        messages,
        model: modelKeys[1], 
      }),
    });

    let gptResponse = await response.text();
    gptResponse = gptResponse.trim();

    // Ensure response has proper structure
    if (!gptResponse.includes('<h2>')) {
      gptResponse = `<h2>Newsletter</h2>\n${gptResponse}`;
    }

    // Add default image placeholder if missing
    if (!gptResponse.includes('//Image:')) {
      gptResponse = gptResponse.replace('</h2>', '</h2>\n//Image: law firm professional team//\n');
    }

    // Process the response to include actual images
    const newsletterWithImages = await addImages([{ 
      platform: 'Newsletter',
      content: gptResponse 
    }], imageSettings);

    return newsletterWithImages[0].content;
    
  } catch (error) {
    console.error('Error generating newsletter:', error);
    throw error;
  }
};
