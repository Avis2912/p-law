import { getDoc, doc } from 'firebase/firestore';
import { db, auth } from 'src/firebase-config/firebase';
import { modelKeys } from 'src/genData/models';
import { addImages } from './addImages';

export const generateNewsletter = async ({ content, imageSettings = "Web" }) => {
  try {
    // Get firm info
    const userDoc = await getDoc(doc(db, 'users', auth.currentUser.email));
    let firmName = '', firmDescription = ''; let brandVoice = ''; let contactUsLink = '';
    if (userDoc.exists()) {
      const firmDoc = await getDoc(doc(db, 'firms', userDoc.data().FIRM));
      if (firmDoc.exists()) {
        firmName = firmDoc.data().FIRM_INFO.NAME;
        firmDescription = firmDoc.data().FIRM_INFO.DESCRIPTION;
        brandVoice = firmDoc.data().SETTINGS.BRAND;
        contactUsLink = firmDoc.data().FIRM_INFO.CONTACT_US;
      }
    }

    const messages = [
      {
        "role": 'user',
        "content": `
          <instruction>
          You are a marketing assistant for ${firmName}, a firm described as ${firmDescription}.
          Your task is to repurpose and create an informative email newsletter based on the following blog content:

          ${content}

          IMPORTANT INSTRUCTIONS:
          - The newsletter MUST start with a title wrapped in <h2> tags. This is the subject so no need to include another one.
          - The newsletter should be written in HTML format, suitable for email clients
          - Don't speak like an AI, don't be cringe and make it truly engaging and informative.
          - The point of this newsletter is to repurpose the blog post's content. Make sure to hit all main points of the blog post.
          - For any lists, don't use ul or ol tags. only numbers.
          ${contactUsLink && `- Include a CTA encouraging readers to visit our website or contact us: ${contactUsLink}`}
          ${brandVoice && brandVoice.INSTRUCTIONS == "" && `- Write in the following brand voice: ${JSON.stringify(brandVoice)}`}
          - Add ONE image placeholder after the title in this format: //Image: {newsletter title (the one in h2 tags)}//
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
      gptResponse = `<h2>Newsletter Subject</h2>\n${gptResponse}`;
    } else {
        const h2Title = gptResponse.match(/<h2>(.*?)<\/h2>/)[1];
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
