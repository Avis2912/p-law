// writeWeeklyBlogs.js
import { getDoc, doc, updateDoc } from '@firebase/firestore';
import { useState, useCallback } from 'react';
import { db, auth } from 'src/firebase-config/firebase';

export const writeWeeklyBlogs = async (
  contactUsLink, 
  internalLinks, 
  bigBlogString, 
  firmName, 
  selectedModel, 
  modelKeys, 
  browseWeb, 
  browseText,
  isImagesOn, 
  addImages,
  plan
) => {

    console.log('ACTIVATED WRITE WEEKLY BLOGS');
    let tempPosts = []; const numberOfBlogs = 6; 
    let isError = false; let firmNameInt; let firmDescriptionInt; let internalLinksInt; let contactUsLinkInt; let smallBlogInt; let blogTitlesInt; let imagesSettingsInt;
    const userDoc = await getDoc(doc(db, 'users', auth.currentUser.email)); 
    if (userDoc.exists()) {const firmDoc = await getDoc(doc(db, 'firms', userDoc.data().FIRM)); 
    if (firmDoc.exists()) {firmNameInt = firmDoc.data().FIRM_INFO.NAME; firmDescriptionInt = firmDoc.data().FIRM_INFO.DESCRIPTION; 
        const linksArray = firmDoc.data().BLOG_DATA.BIG_BLOG.map(blog => blog.LINK); 
        const blogTitlesArray = firmDoc.data().BLOG_DATA.BIG_BLOG.map(blog => blog.TITLE); blogTitlesInt = blogTitlesArray.join(", ");
        internalLinksInt = JSON.stringify(firmDoc.data().BLOG_DATA.BIG_BLOG.map(blog => ({title: blog.TITLE, link: blog.LINK}))); imagesSettingsInt = firmDoc.data().SETTINGS.IMAGES;
        contactUsLinkInt = firmDoc.data().FIRM_INFO.CONTACT_US; console.log('contact us link: ', contactUsLinkInt); console.log('internal links: ', internalLinksInt); 
        const bigBlog = firmDoc.data().BLOG_DATA.BIG_BLOG; const smallBlogArray = firmDoc.data().BLOG_DATA.SMALL_BLOG || [];
        smallBlogInt = smallBlogArray.map(index => `[${bigBlog[index]?.TITLE || ''}]: ${bigBlog[index]?.CONTENT || ''}`).join('\n'); 
    }}


    const response0 = await fetch('https://us-central1-pentra-claude-gcp.cloudfunctions.net/gcp-claudeAPI', {
        method: 'POST',headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({ model: plan === 'Trial Plan' ? modelKeys[2] : modelKeys[2], 
        messages: [{ role: "user", content: `
        <instruction> 
        GIVE ME A JSON PARSABLE ARRAY WITH SHORT BUT 12 VERY SPECIFIC BLOG TITLES. 
        
        Make them very, very specific and relevant to ${firmNameInt}, a law firm described as the following: "${firmDescriptionInt}".

        - FOLLOW THE TITLING STYLE FROM PREVIOUS TITLES (BUT DONT COPY OUTRIGHT): ${blogTitlesInt}
        - MAKE SURE: ALL 12 TITLES MUST BE DISTINCTLTY DIFFERENT. Use tangentially related topics to go after long tail keywords if required.
        - OUTPUT FORMAT: ["Title 1", "Title 2", "Title 3", "Title 4", "Title 5", "Title 6", "Title 7", "Title 8", "Title 9", "Title 10", "Title 11", "Title 12"]
        - DONT OUT ANYTHING ELSE. DONT START BY SAYING ANYTHING. JUST. OUTPUT. THE. ARRAY.
        </instruction>
        ` }
        ]})});

    let gptResponse0; try { gptResponse0 = JSON.parse(await response0.text()); } catch (error) { console.error(error); } console.log(gptResponse0);
    const shuffledArray = gptResponse0.sort(() => 0.5 - Math.random());
    const titleArray = shuffledArray.slice(0, numberOfBlogs);
    console.log('contact us link: ', contactUsLinkInt);
    console.log('internal links: ', internalLinksInt);


    for (let i = 0; i < numberOfBlogs; i += 1) {

        let browseTextResponse = "";
        // eslint-disable-next-line no-await-in-loop
        browseTextResponse = JSON.stringify((await browseWeb(titleArray[i])).hits.map(({snippet, title, link}) => ({title, snippet, link})));
        console.log('browseTextResponse: ', browseTextResponse);

        // eslint-disable-next-line no-await-in-loop
        const response = await fetch('https://us-central1-pentra-claude-gcp.cloudfunctions.net/gcp-claudeAPI', {
        method: 'POST',headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({ model: modelKeys[selectedModel], 
        messages: [
            { role: "user", content: `
            
            <role>You are Pentra AI, a friendly, witty lawyer & expert SEO writer for ${firmNameInt}. ${firmNameInt} is described as such: ${firmDescriptionInt}.
            Mention ${firmNameInt} ONLY at the end. </role> 

            <instruction>

            IMPORTANT INSTRUCTIONS:
            - TOPIC: This post is on ${titleArray[i]}. Use exactly this title.
            - FORMATTING: Wrap titles in <h1> and sub-titles in <h2> tags. Wrap all paragraphs (and everything else that should have a line after) in <p> tags. Use b tags only in same-line text or 'title: paragraph'.
            - TABLES: Always include table(s) with 2 or 3 columns. Add in this syntax (which is only 1 column for example's sake):

            <div class="quill-better-table-wrapper">
                <table class="quill-better-table" style="width: 600px;">
                <colgroup>
                    <col width="300"> <col width="300">
                </colgroup>
                <tbody>
                    <tr data-row="row-1" height="45">
                    <td data-row="row-1" rowspan="1" colspan="1">
                        <p class="qlbt-cell-line" data-row="row-1" data-cell="cell-xc52" data-rowspan="1" data-colspan="1">Hey whats popping</p>
                    </td>
                    </tr>
                    <tr data-row="row-2" height="45">
                    <td data-row="row-2" rowspan="1" colspan="1">
                        <p class="qlbt-cell-line" data-row="row-2" data-cell="cell-ywlw" data-rowspan="1" data-colspan="1"></p>
                    </td>
                    </tr>
                </tbody>
                </table>
                <p></p>
            </div>

            - WORD RANGE: this post should be 1000+ WORDS LONG.
            - IMAGES: blog post should contain 2-3 images. Please add representations of them in this format: //Image: {Image Description}//. 
            Consider putting them right after h2 titles. Make sure these are evenly spaced out in the post and with specific descriptions.
            - SPECIFICITY: Be as specific and detailed as possible. Don't be repetitive and ramble.
            - LINK TO RELEVANT POSTS: Use <a> tags to add link(s) to relevant blog posts from the firm wherever applicable: ${internalLinksInt}.
            - PERSPECTIVE: Don't EVER refer to yourself in the post. Explain how your firm ${firmNameInt} can help, but ONLY at the end. 
            - CONTACT US LINK AT END: Use this contact us link with <a> tags at the end: ${contactUsLinkInt}
            - NEVER OUTPUT ANYTHING other than the blog content. DONT START BY DESCRIBING WHAT YOURE OUTPUTING, JUST OUTPUT. 

            </instruction>

            ${browseTextResponse !== "" && 
            `WEB RESULTS: Consider using the following web information I got from an LLM for the prompt ${browseText}:
            <web-information> ${browseTextResponse} </web-information>`}

            VERY IMPORTANT: REPRODUCE THE TONE & STYLE OF THE FOLLOWING BLOGS PERFECTLY IN YOUR OUTPUT. YOUR OUTPUT ALSO MUST BE FRIENDLY & APPROACHABLE. BLOGS:

            <example-blogs>
            ${smallBlogInt}
            </example-blogs>
            ` }

            // TEXT DUMP
            // ${isMimicBlogStyle && 
            //   `VERY VERY IMPORTANT: REPRODUCE THE TONE & STYLE OF THE FOLLOWING BLOGS PERFECTLY IN YOUR OUTPUT. YOUR OUTPUT MUST BE FRIENDLY & APPROACHABLE.
            //  ${smallBlog}`} 
            // - ${isReferenceGiven && `USEFUL DATA: Refer to the following text and use as applicable: ${referenceText}`}
            // - ${browseTextResponse !== "" && `WEB RESULTS: Consider using the following web information I got from an LLM for the prompt ${browseText}: ${browseTextResponse}`}
            // - ${style !== "Unstyled" && `STYLE: This blog post should be written in the ${style} style.`}

        ] })
        });


        // eslint-disable-next-line no-await-in-loop
        let gptResponse = (await response.text()); console.log(gptResponse);
        // eslint-disable-next-line no-await-in-loop
        gptResponse = gptResponse.replace(/<br\s*\/?>/gi, '').replace(/<\/p>|<\/h1>|<\/h2>|<\/h3>|<\/ul>|\/\/Image:.*?\/\//gi, '$&<br>').replace(/<\/ol>/gi, '$&<br><br>').replace(/(<image[^>]*>|\/\/Image:.*?\/\/)/gi, '$&<br>');
        const postTitle = gptResponse.match(/<h1>(.*?)<\/h1>/i)[1]; 
        // eslint-disable-next-line no-control-regex
        const sanitizedResponse = gptResponse.replace(/[\u0000-\u001F\u007F-\u009F]/g, ''); let textWithoutImages;
        try { textWithoutImages = [{content: sanitizedResponse}] } catch (err) {isError = true; console.log(err)};
        console.log(textWithoutImages); let textWithImages = textWithoutImages;
        // eslint-disable-next-line no-await-in-loop
        if (isImagesOn) {textWithImages = await addImages(textWithoutImages, imagesSettingsInt);}
        // eslint-disable-next-line no-await-in-loop
        tempPosts = tempPosts.concat(textWithImages); console.log(`TEMP BLOGS ${i} DONE): `, tempPosts); 
    };

    try {
        if (userDoc.exists()) { const firmDoc = await getDoc(doc(db, 'firms', userDoc.data().FIRM));
        if (firmDoc.exists()) {
            const currentDate = new Date();
            const formattedDate = `${currentDate.getMonth() + 1}/${currentDate.getDate()}/${currentDate.getFullYear().toString().slice(-2)}`;
            await updateDoc(doc(db, 'firms', userDoc.data().FIRM), { 'WEEKLY_BLOGS.BLOGS': tempPosts, 'WEEKLY_BLOGS.LAST_DATE': isError ? "3/3/3" : formattedDate });
        }
        }} catch (err) {console.log(err)};
    // eslint-disable-next-line react-hooks/exhaustive-deps

};

export default writeWeeklyBlogs;