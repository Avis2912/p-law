import { getDoc, doc, updateDoc } from '@firebase/firestore';
import { useCallback } from 'react';

export const writeWeeklyPosts = async (bigBlogString, firmName, genPostPlatform, selectedModel, auth, db, modelKeys, addImages, isImagesOn) => {
    
    const isUseBrandedWeeklyImages = true;
    
    console.log('WEEKLY POSTS ACTIVATED');
    let tempPosts = []; const platforms = ["LinkedIn", "Facebook", "Instagram",];
    // const platforms = ["LinkedIn", "LinkedIn", "Facebook", "Facebook", "Instagram", "Instagram",]; 
    let firmNameInt; let firmDescriptionInt; let imagesSettingsInt;
    const userDoc = await getDoc(doc(db, 'users', auth.currentUser.email));
    if (userDoc.exists()) {const firmDoc = await getDoc(doc(db, 'firms', userDoc.data().FIRM));
    if (firmDoc.exists()) {firmNameInt = firmDoc.data().FIRM_INFO.NAME; firmDescriptionInt = firmDoc.data().FIRM_INFO.DESCRIPTION; imagesSettingsInt = firmDoc.data().SETTINGS.IMAGES;}};


    for (let i = 0; i < platforms.length; i += 1) {
      const tempPlatform = platforms[i];
      let isError; let tries = 0; let textWithoutImages;
      do {isError = false; tries += 1;
        // eslint-disable-next-line no-await-in-loop
        const response = await fetch('https://us-central1-pentra-claude-gcp.cloudfunctions.net/gcp-claudeAPI', {
          method: 'POST',headers: {'Content-Type': 'application/json'},
          body: JSON.stringify({ model: modelKeys[selectedModel], 
          messages: [
            { role: "user", content: `<role> You are Pentra AI, an attorney at ${firmNameInt}.
            ${firmName} Description: ${firmDescriptionInt}. </role> 
            
            <instruction>
            YOUR GOAL: Write 3 FULL EDUCATIONAL ${tempPlatform} posts from the perspective of ${firmName}. Don't be generic and corporate but be approachable and genuinely informative. Don't be lazy.
            
            IMPORTANT INSTRUCTIONS:
            - RESPONSE FORMAT: Always respond with a JSON-parsable array of 3 hashmaps, 
            EXAMPLE OUTPUT: "[{"platform": "${tempPlatform}", "content": "*Post Content*"}, {"platform": "${tempPlatform}", "content": "*Post Content*"}, {"platform": "${tempPlatform}", "content": "*Post Content*"}]". 
            ONLY OUTPUT THE ARRAY. NOTHING ELSE.
            - POST FORMAT: Wrap titles in <h2> tags. Wrap EVERY paragraph in <p> tags. don't use list tags.
            - Be truly informative about a relevant topic, and mention the firm at the end. Add hashtags in a new paragraph at the very end.
            ${tempPlatform === 'LinkedIn' && `
            - PARAGRAPH COUNT: these posts should be 5-6 paragraphs long. 
            `}
            ${tempPlatform === 'Facebook' && `
            - PARAGRAPH COUNT: these posts should be 4-5 paragraphs long.
            `}
            ${tempPlatform === 'Instagram' && `
            - PARAGRAPH COUNT: these posts should be 1 paragraph long.
            `}
            - IMAGES: post should contain 1 image, placed right after the h2 post title. Please add it in this format: //Image: {short image description}//.
            - Array should be in proper format: [{}, {}, {}]. </instruction>

            Pull from in the following blog posts only if useful information is contained:

            ${bigBlogString}
            ` }
          ] })
        });

        // - POINTERS: only if applicable, use same-line <b> titled points (don't use list tags). wrap each point in a p tag.

        // eslint-disable-next-line no-await-in-loop
        let gptResponse = (await response.text()); console.log(gptResponse);
        // eslint-disable-next-line no-await-in-loop
        gptResponse = gptResponse.replace(/<br\s*\/?>/gi, '').replace(/<\/p>|<\/h1>|<\/h2>|<\/h3>|\/\/Image:.*?\/\//gi, '$&<br>').replace(/(<image[^>]*>|\/\/Image:.*?\/\/)/gi, '$&<br>');
        // eslint-disable-next-line no-control-regex
        const sanitizedResponse = gptResponse.replace(/[\u0000-\u001F\u007F-\u009F]/g, ''); 
        try { textWithoutImages = JSON.parse(sanitizedResponse) } catch (err) {isError = true; console.log('TEMP ERROR: ', err)};
      } while (isError && tries < 3);
      console.log(textWithoutImages); let textWithImages = textWithoutImages;
      // eslint-disable-next-line no-await-in-loop
      textWithImages = await addImages(textWithoutImages, isUseBrandedWeeklyImages ? 'Brand' : 'Web');
      // eslint-disable-next-line no-await-in-loop
      tempPosts = tempPosts.concat(textWithImages); console.log(`TEMP POSTS (${tempPlatform} DONE): `, tempPosts);
    };

    try {
      if (userDoc.exists()) { const firmDoc = await getDoc(doc(db, 'firms', userDoc.data().FIRM));
        if (firmDoc.exists()) {
          const currentDate = new Date();
          const formattedDate = `${currentDate.getMonth() + 1}/${currentDate.getDate()}/${currentDate.getFullYear().toString().slice(-2)}`;
          await updateDoc(doc(db, 'firms', userDoc.data().FIRM), { 'WEEKLY_POSTS.POSTS': tempPosts, 'WEEKLY_POSTS.LAST_DATE': formattedDate });
        }
      }} catch (err) {console.log(err)};
     // eslint-disable-next-line react-hooks/exhaustive-deps
  
};
