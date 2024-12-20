import React, { useState, useEffect, useMemo } from 'react';
import { Editor, EditorState, ContentState } from 'draft-js';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css'; // import styles
import Anthropic from '@anthropic-ai/sdk';
import Stack from '@mui/material/Stack';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import { getDocs, getDoc, collection, doc, updateDoc, arrayUnion } from 'firebase/firestore';
import Iconify from 'src/components/iconify';
import { db, auth } from 'src/firebase-config/firebase';
import Button from '@mui/material/Button';
import { Card, TextField, ListItem, ListItemText, Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material';
import { css, keyframes } from '@emotion/react';
import PropTypes from 'prop-types';

import { createEditor } from 'slate';
import { Slate, Editable, withReact } from 'slate-react';
import { withHistory } from "slate-history";

import BlogEditor from 'src/components/Editor';
import WpDialog from 'src/components/WpDialog';
import ComingSoon from 'src/components/ComingSoon';
import PageTitle from 'src/components/PageTitle';
import BasicTooltip from 'src/components/BasicTooltip';
import { Page } from 'openai/pagination';
import { modelKeys } from 'src/genData/models';
import CategoryDialog from 'src/components/CategoryDialog';
import { ScheduleDialog } from './schedule-dialog';

// eslint-disable-next-line import/no-relative-packages
import publishBlog from '../../../../functions/src/WpFunctions/publishBlog';
// eslint-disable-next-line import/no-relative-packages
import saveToQueue from '../../../../functions/src/General/saveToQueue';



import 'src/components/Editor.css';

const isImagesOn = true;


// import "react-quill/dist/quill.snow.css"; // import styles

// ----------------------------------------------------------------------

export default function ProductsView() {

const Font = ReactQuill.Quill.import("formats/font");
Font.whitelist = ["serif", "arial", "courier", "comic-sans"]; // Add more fonts here
ReactQuill.Quill.register(Font, true);

const Size = ReactQuill.Quill.import("formats/size");
Size.whitelist = ["small", "medium", "large", "huge"]; // Add more sizes here
ReactQuill.Quill.register(Size, true);

const modules = {
  toolbar: [
    [{ font: Font.whitelist }],
    [{ size: Size.whitelist }],
    ["bold", "italic", "underline"],
    [{ list: "ordered" }, { list: "bullet" }],
    ["link"],
  ],
};

  const [text, setText] = useState('');

  const [blogTitle, setBlogTitle] = useState('');
  const [blogInstructions, setBlogInstructions] = useState(null);
  const [smallBlog, setSmallBlog] = useState(null); 
  const [internalLinks, setInternalLinks] = useState(null); 
  const [firmName, setFirmName] = useState(null);
  const [firmImage, setFirmImage] = useState('');
  const [firmDescription, setFirmDescription] = useState(null);
  const [customColor, setCustomColor] = useState(null);

  const [isGenMode, setIsGenMode] = useState(false);
  const [isAlterMode, setIsAlterMode] = useState(false);
  const [currentMode, setCurrentMode] = useState('Generate');
  const [isGenerating, setIsGenerating] = useState(false);
  const [isElongating, setIsElongating] = useState(false);
  const [loadIndicator, setLoadIndicator] = useState(['Welcome Back!', -185]);

  const [isBrowseWeb, setIsBrowseWeb] = useState(true);
  const [isUseThumbnail, setIsUseThumbnail] = useState(true);
  const [isAdvancedBrowseWeb, setIsAdvancedBrowseWeb] = useState(true);
  const [browseText, setBrowseText] = useState("");
  const [selectedModel, setSelectedModel] = useState(2);
  const [wordCount, setWordCount] = useState(0);
  const [contactUsLink, setContactUsLink] = useState(null);
  const [brandVoice, setBrandVoice] = useState(null);
  const [isSourcesOpen, setIsSourcesOpen] = useState(false);
  const [siteUrl, setSiteUrl] = useState(null);

  const [isMimicBlogStyle, setIsMimicBlogStyle] = useState(false);
  const [imageCount, setImageCount] = useState("2 Images");
  const [wordRange, setWordRange] = useState("600 - 800 Words");
  const [style, setStyle] = useState("Unstyled");
  const [isReferenceGiven, setIsReferenceGiven] = useState(false);
  const [referenceText, setReferenceText] = useState(null);
  const [isUseInternalLinks, setIsUseInternalLinks] = useState(false);
  const [isMentionCaseLaw, setIsMentionCaseLaw] = useState(false);
  const [imagesSettings, setImagesSettings] = useState("All");

  const [expandedSource, setExpandedSource] = useState(null);
  const [doneSourcing, setDoneSourcing] = useState(true);
  const [sources, setSources] = useState([]);
  const [selectedImage, setSelectedImage] = useState(null);

  const [isWpDropdownOpen, setIsWpDropdownOpen] = useState(false);
  const [isWpIntegrated, setIsWpIntegrated] = useState(false);
  const [isWpDialogOpen, setIsWpDialogOpen] = useState(false);
  const [isPostError, setIsPostError] = useState(false);

  const [wpUrl, setWpUrl] = React.useState(null);
  const [wpUsername, setWpUsername] = React.useState(null);
  const [wpPassword, setWpPassword] = React.useState(null);
  const [isComingSoon, setIsComingSoon] = React.useState(false);
  const titleTag = 'h2';

  const [isScheduleDialogOpen, setIsScheduleDialogOpen] = useState(false);
  const [scheduleDate, setScheduleDate] = useState('');
  const [scheduleTime, setScheduleTime] = useState('');

  const [isKeywordDropdownOpen, setIsKeywordDropdownOpen] = useState(false);
  const [selectedKeywords, setSelectedKeywords] = useState([]);
  const [weeklyKeywords, setWeeklyKeywords] = useState([]);

  const [isAddingKeyword, setIsAddingKeyword] = useState(false);
  const [newKeyword, setNewKeyword] = useState('');

  const [isCategoryDialogOpen, setIsCategoryDialogOpen] = useState(false);
  const [availableCategories, setAvailableCategories] = useState([]);
  const [selectedCategories, setSelectedCategories] = useState([]);

  const [isCategoryConfirmOpen, setIsCategoryConfirmOpen] = useState(false);

  const toggleKeywordSelection = (keyword) => {
    if (selectedKeywords.includes(keyword)) {
      setSelectedKeywords(selectedKeywords.filter(k => k !== keyword));
    } else {
      setSelectedKeywords([...selectedKeywords, keyword]);
    }
  };

  const handleAddKeyword = () => {
    if (newKeyword.trim()) {
      setWeeklyKeywords([{ keyword: newKeyword, data: ['Added Just Now'] }, ...weeklyKeywords]);
      setNewKeyword('');
      setIsAddingKeyword(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await fetch(`https://${wpUrl.replace('https://', '').replace('http://', '')}/wp-json/wp/v2/categories`, {
        headers: {
          'Authorization': `Basic ${btoa(`${wpUsername}:${wpPassword}`)}`,
        }
      });
      const categories = await response.json();
      setAvailableCategories(categories);
      setSelectedCategories([categories[0]?.id]); // Select first category by default
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  let boxHeight; const boxWidth = 'calc(100%)';
  if (isReferenceGiven) { boxHeight = 'calc(77.5% - 220px)';} 
  else if (wordCount < 300) { boxHeight = 'calc(77.5% - 51.5px)'; }
  else { boxHeight = 'auto' } 
  // else { boxHeight = '450px' }

  useEffect(() => {
    setWordCount(text.split(' ').length);
  }, [text]);

  useEffect(() => {

    const getFirmData = async () => {
      try {
        const userDoc = await getDoc(doc(db, 'users', auth.currentUser.email));
        if (userDoc.exists()) {
          const firmDoc = await getDoc(doc(db, 'firms', userDoc.data().FIRM));
          if (firmDoc.exists()) {
            await setFirmName(userDoc.data().FIRM);             
            await setFirmImage(firmDoc.data().FIRM_INFO.IMAGE);
            await setCustomColor(firmDoc.data().CHAT_INFO.THEME);
            await setFirmDescription(firmDoc.data().FIRM_INFO.DESCRIPTION);
            await setSelectedModel(firmDoc.data().SETTINGS.MODEL);
            await setImagesSettings(firmDoc.data().SETTINGS.IMAGES);
            await setBrandVoice(firmDoc.data().SETTINGS.BRAND);
            await setWeeklyKeywords(firmDoc.data().WEEKLY_KEYWORDS.KEYWORDS);
            const url = new URL(firmDoc.data().FIRM_INFO.CONTACT_US); await setSiteUrl(url.origin);
            const bigBlog = firmDoc.data().BLOG_DATA.BIG_BLOG || [];
            const smallBlogArray = firmDoc.data().BLOG_DATA.SMALL_BLOG || [];
            const smallBlogString = smallBlogArray.map(index => `[${bigBlog[index]?.TITLE || ''}]: ${bigBlog[index]?.CONTENT || ''}`).join('\n'); 
            await setSmallBlog(smallBlogString); 
            await setContactUsLink(firmDoc.data().FIRM_INFO.CONTACT_US);         
            const internalLinkData = bigBlog.map(blog => `${blog.TITLE}: ${blog.LINK}`).join('\n');
            await setInternalLinks(internalLinkData); 
            if (smallBlogString) {console.log('smallBlogString: ', true) } else {console.log('smallBlogString: ', false);}
          } else {
            console.log('Error: Firm document not found.');
          }
        }
      } catch (err) {
        console.log(err);
      }
    };
    getFirmData();
  
  }, []);

  // BLOG GENERATION

  const generateBlog = async () => {

      // setText(`<h1>✨ Generating${dots} </h1>`);
      setIsGenerating(true); 
      setText(''); setBrowseText(blogTitle);
      if (isBrowseWeb) {setDoneSourcing(false)};
      let messages = [];

      let browseTextResponse = "";

      if (currentMode === "Generate") {
        if (isBrowseWeb || isAdvancedBrowseWeb) {
          setLoadIndicator(['Browsing The Web', 30]);
          if (isAdvancedBrowseWeb) {browseTextResponse = await browseWeb(browseText, isUseInternalLinks); console.log('BROWSE RESPONSE:', browseTextResponse);}
          else {browseTextResponse = JSON.stringify((await browseWeb(browseText, isUseInternalLinks))
            // .hits.map(({snippet, title, link}) => ({title, snippet, link}))
          )};
        };
          messages.push({
          "role": "user", 
          "content":  `
          <instruction>
          Write an accurate, specific, ${wordRange} blog post based on the following title: ${blogTitle}. 
          ${blogInstructions && `IMPORTANT INSTRUCTIONS (THIS TRUMPS EVERYTHING): ${blogInstructions}`}. 
          ${text !== "" && `Consider using the following outline: ${text}`}. 
          Please don't start by saying anything else. Output ONLY the blog post.
          </instruction>
          `
        });
      }

      if (currentMode === "Build Outline") {
        messages.push({
          "role": "user", 
          "content": `You are Pentra AI, a legal expert and an expert SEO blog writer. 
          Write a brief blog outline in rich text using <b> tags based on the following topic: ${blogTitle}. 
          ${blogInstructions && `USER INSTRUCTIONS FOR BLOG (use only if necessary): ${blogInstructions}`}.
          KEEP IN MIND: this is for a blog post ${wordRange} long.
          ALSO, WRAP EVERY NEW LINE & HEADING IN <p> TAGS.
          
          EXAMPLE OUTLINE FORMAT TO FOLLOW:

          I. Introduction
              A. Definition of Probate Law
              B. Importance of Avoiding Probate
              C. Overview of Probate Process in Dallas

          II. Understanding Probate Law
              A. What is Probate?
              B. How Does Probate Work in Dallas?
              C. Key Terms and Concepts in Probate Law

          III. Reasons to Avoid Probate
              A. Time Consuming Process
              B. Costly Fees and Expenses
              C. Lack of Privacy
              D. Potential Family Conflicts

          IV. Strategies for Avoiding Probate in Dallas
              A. Estate Planning Tools
                  1. Revocable Living Trusts
                  2. Joint Ownership
                  3. Beneficiary Designations
                  4. Transfer-on-Death Designations
              B. Importance of Legal Counsel
                  1. Hiring an Experienced Estate Planning Attorney
                  2. Tailoring Strategies to Individual Needs
                  3. Ensuring Compliance with Texas Laws

          V. Steps to Take to Avoid Probate
              A. Reviewing and Updating Estate Plan Regularly
              B. Organizing and Documenting Assets
              C. Communicating Plans with Family Members

          VI. Common Misconceptions About Probate
              A. "I Don't Need an Estate Plan Because I'm Not Wealthy"
              B. "My Will Can Avoid Probate"
              C. "Probate is Only Necessary for Large Estates"

          VII. Conclusion
              A. Summary of Key Points
              B. Importance of Taking Action to Avoid Probate
              C. Encouragement to Seek Professional Legal Advice
                    
          `
        });
      }

      if (currentMode === "Alter Draft") {
        messages.push({
          "role": "user", 
          "content": `You are Pentra AI, a legal expert and an expert SEO blog writer. 
          EDIT the blog post given below based on this prompt: ${blogTitle}. Don't deviate from the prompt and keep the blog post AS MUCH THE SAME as you can. NEVER START by saying anything else - output ONLY the blog post.
          BLOG POST: ${text}.
          
          <instruction>
          IMPORTANT INSTRUCTIONS:
          - FORMATTING: Wrap titles in <h1> and <h2> tags. Wrap all paragraphs and also all individual pointers in <p> tags. Use b tags only in same-line text.
          - WORD RANGE: this post should be ${wordRange} long.
          - SPECIFICITY: Be as specific and detailed as possible. Don't be repetitive or ramble.
          - PERSPECTIVE: Don't ever, EVER refer to yourself in the post, this should be written in third-person-perspective. Explain how 'we at ${firmName}' can help, but ONLY at the end. 
          - IMAGES: blog post should contain ${imageCount}. Please add representations of them in this format: //Image: {Image Description}//. 
          Add two <br> tags after. Make sure these are evenly spaced out in the post and with specific and relevant descriptions.
          - ${style !== "Unstyled" && `STYLE: This blog post should be written in the ${style} style.`}
          - ${isMentionCaseLaw && `CASE LAW: Reference case law in the blog post when necessary.`}
          - ${isUseInternalLinks && `INTERNAL LINKS: Add internal links to the blog post using <a> tags.`}
          - ${isReferenceGiven && `USEFUL DATA: Refer to the following text and use as applicable: ${referenceText}`}
          - ${browseTextResponse !== "" && `WEB RESULTS: Please consider using the following internet information I got from an LLM for the prompt ${browseText}: ${browseTextResponse}`}
          </instruction>
          `
        });
      }

    //  const gptResponse = await fetch('https://api.openai.com/v1/chat/completions', {
    //  method: 'POST', headers: { 'Authorization': `Bearer ${import.meta.env.VITE_OPENAI_API_KEY}`, 'Content-Type': 'application/json', },
    //  body: JSON.stringify({ model: "gpt-3.5-turbo-0125", messages, }), });

    const generationText = currentMode === "Build Outline" ? 'Building Outline': 'Generating Article'; setLoadIndicator([generationText, 60]);

    if (isBrowseWeb) {console.log('BROWSETEXTRESPONSE IN SEO-VIEW:', isAdvancedBrowseWeb ? JSON.stringify(browseTextResponse)[1] : JSON.stringify(JSON.parse(browseTextResponse)), isUseInternalLinks);}

    const claudeResponse = await fetch('https://us-central1-pentra-claude-gcp.cloudfunctions.net/gcp-claudeAPI', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ messages, blogTitle, blogInstructions,
            model: modelKeys[selectedModel], system: 
        `
        ${currentMode === "Generate" ?
        `
        <role>You are Pentra AI, a friendly, witty lawyer & expert SEO writer for ${firmName}. ${firmName} is described as such: ${firmDescription}.
        Mention ${firmName} ONLY at the end. </role> 

        <instruction>

        IMPORTANT INSTRUCTIONS:
        - FORMATTING: Wrap titles in <${titleTag}> and sub-titles in <h3> tags. Wrap all paragraphs (and everything else that should have a line after) in <p> tags. Use b tags only in same-line text or 'title: paragraph'. Use numbers if you decide to add a list not ul tags.
        - LISTS: Don't EVER use html (ul or ol) lists. Instead, use numbered lists (i.e. 1., 2., 3.) for ordered lists and bullet points for unordered lists.
        - TABLES: Always include table(s) with 2 or 3 columns. Add in this syntax:

        <div class="quill-better-table-wrapper">
            <table class="quill-better-table" style="width: 600px;">
                <colgroup>
                    <col width="300">
                    <col width="300">
                </colgroup>
                <tbody>
                    <tr data-row="row-1" height="45">
                        <td data-row="row-1" rowspan="1" colspan="1">
                            <p class="qlbt-cell-line" data-row="row-1" data-cell="cell-0" data-rowspan="1" data-colspan="1"><strong>Estate Value</strong></p>
                        </td>
                        <td data-row="row-1" rowspan="1" colspan="1">
                            <p class="qlbt-cell-line" data-row="row-1" data-cell="cell-1" data-rowspan="1" data-colspan="1"><strong>Probate Requirement</strong></p>
                        </td>
                    </tr>
                    <tr data-row="row-2" height="45">
                        <td data-row="row-2" rowspan="1" colspan="1">
                            <p class="qlbt-cell-line" data-row="row-2" data-cell="cell-2" data-rowspan="1" data-colspan="1">Under $166,250</p>
                        </td>
                        <td data-row="row-2" rowspan="1" colspan="1">
                            <p class="qlbt-cell-line" data-row="row-2" data-cell="cell-3" data-rowspan="1" data-colspan="1">Simplified Procedures</p>
                        </td>
                    </tr>
                    <tr data-row="row-3" height="45">
                        <td data-row="row-3" rowspan="1" colspan="1">
                            <p class="qlbt-cell-line" data-row="row-3" data-cell="cell-4" data-rowspan="1" data-colspan="1">$166,250 or more</p>
                        </td>
                        <td data-row="row-3" rowspan="1" colspan="1">
                            <p class="qlbt-cell-line" data-row="row-3" data-cell="cell-5" data-rowspan="1" data-colspan="1">Full Probate Process</p>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>

        - PERSPECTIVE: Don't ever, EVER refer to yourself in the post, this should be written in third-person-perspective. Also don't mention ${firmName} at the beginning. You should how 'we at ${firmName}' can help, but ONLY at the end. 
        ${imageCount !== "No Images" && `- IMAGES: blog post should contain ${imageCount}. Please add representations of them in this format: //Image: {Relevant Image Description}//.
        Make sure these are evenly spaced out in the post, and place them after h tags or in between paragraphs.`}
        - SPECIFICITY: Be as specific and detailed as possible. Don't be repetitive and ramble.
        - ${style !== "Unstyled" && `STYLE: This blog post MUST be written in the ${style} style.`}
        - ${selectedKeywords.length > 0 && `KEYWORDS: Make sure to the following keywords in the blog post: ${selectedKeywords.join(', ')}.`}
        - ${isMentionCaseLaw && `CASE LAW: Reference case law in the blog post when necessary.`}
        - ${brandVoice && brandVoice.INSTRUCTIONS !== "" && `BRAND VOICE: Write in the following brand voice: ${JSON.stringify(brandVoice)}.`}
        - ${isReferenceGiven && `USEFUL DATA: Refer to the following text and use as applicable: ${referenceText}`}
        - ${contactUsLink && `CONTACT US LINK AT END: Use this contact us link with <a> tags toward the end if applicable: ${contactUsLink}`} 
        - ${browseTextResponse !== "" && `WEB RESULTS: Consider using the following web information I got from leading websites: ${isUseInternalLinks ? (isAdvancedBrowseWeb ? JSON.stringify(browseTextResponse)[1] : JSON.stringify(JSON.parse(browseTextResponse)[0].hits)) : browseTextResponse}.`}
        - ${isUseInternalLinks && `LINKS TO OTHER SOURCES: ALWAYS ADD THESE. Use <a> tags to to tag a few phrases and add links to relevant blog posts from non-law-firm sources from the following list wherever applicable: ${isAdvancedBrowseWeb ? JSON.stringify(browseTextResponse)[1] : JSON.stringify(JSON.parse(browseTextResponse)[0].hits)}.`}
        - LINK TO INTERNAL BLOGS: Use <a> tags to to tag phrases and add links to relevant blog posts from the urls of the following list wherever applicable: ${internalLinks}.
        - NEVER OUTPUT ANYTHING other than the blog content. DONT START BY DESCRIBING WHAT YOURE OUTPUTING, JUST OUTPUT. DONT OUTPUT INACCURATE INFORMATION.
      
        </instruction>

        ${isMimicBlogStyle && 
          `VERY VERY IMPORTANT: REPRODUCE THE TONE & STYLE OF THE FOLLOWING BLOGS PERFECTLY IN YOUR OUTPUT. BLOGS:
         ${smallBlog}`} 

        `
        : `<role>You are Pentra AI, a legal expert and an expert SEO blog writer for ${firmName}. ${firmDescription}.</role>` 
      }`
    }), });


    const elongationPrompt = `
    <instruction>
    - YOUR GOAL IS TO COPY THE USER-GIVEN DRAFT AND ELONGATE IT TO MAKE IT ${wordRange} LONG. Right now it's falling a little short.
    - OUTPUT: ONLY output the final article. NEVER START by saying anything else.
    - COPY THE TEXT'S CURRENT FORMAT EXACTLY: Wrap titles in <h1> and <h2> tags. Wrap all paragraphs in <p> tags. 
    - EXCEPTION: Just make sure the final how we can help / contact us paragraph remains at the end of your output.
    - STYLE & TONE: Keep the voice and tone of the text exactly the same when elongating it.
    - IMAGES: KEEP ALL IMAGES as they are. You're allowed to add one new one in your elongation in the same format.
    </instruction>
    `
    let gptResponse = (await claudeResponse.text())
    .replace(/<br><br> /g, '<br><br>')
    .replace(/<br\s*\/?>/gi, '');

    console.log('GPT RESPONSE:', gptResponse);

    const textWithBreaks0 = await gptResponse
    .replace(/<\/ol>/gi, '$&')  // Remove <br><br>
    .replace(/(<image[^>]*>)/gi, '$&')  // Remove <br>
    .replace(/<\/div><p><\p>/g, '</div>')
    .replace(/<\/p><p><br><\/p><p><br>/g, '</p><p><br>') // Remove duplicates
    .replace(/<br\s*\/?>/gi, '');  // Remove any remaining <br> tags
    if (currentMode === "Build Outline") {setCurrentMode('Generate');};
    if (currentMode === "Build Outline") {await setIsGenerating(false); await setText(textWithBreaks0); console.log('return'); return;};

    
    console.log('TEXT WITH BREAKS IN SEO-VIEW:', textWithBreaks0);

    // const data = await gptResponse.json();
    // const gptText = data.choices[0].message.content.trim();
    // const textWithImages = await addImages(gptText);

    const lowerRange = wordRange === "Upto 200 Words" ? 0 : parseInt(wordRange.split('-')[0], 10); let counter = 0;
    while (lowerRange > gptResponse.split(' ').length && counter < 3) {

      setLoadIndicator(['Improving Article', 75]);
      messages = [{"role": "user", "content": gptResponse}]; console.log('RUNNING:', gptResponse.split(' ').length, ' < ', lowerRange, 'count: ', counter);
      // eslint-disable-next-line no-await-in-loop
      const claudeElongationResponse = await fetch('https://us-central1-pentra-claude-gcp.cloudfunctions.net/gcp-claudeAPI', {
        method: 'POST', headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({ messages, model: modelKeys[selectedModel], system: elongationPrompt})});

      // eslint-disable-next-line no-await-in-loop
      gptResponse = await claudeElongationResponse.text();
      counter += 1; console.log('RAN: gptresponse', gptResponse, gptResponse.split(' ').length, lowerRange);
    }

    let textWithImages = gptResponse.trim();
    setLoadIndicator(['Adding All Images', 90]);
    if (isImagesOn) {textWithImages = await addImages(gptResponse.trim());}
    
    const textWithBreaks = await textWithImages
        .replace(/<br\s*\/?>/gi, '') // Remove all <br> tags initially
        .replace(/<\/p>|<\/h1>|<\/h2>|<\/h3>|\/\/Image:.*?\/\//gi, '$&<br>')
        .replace(/<\/ol>/gi, '$&<br><br>')
        .replace(/(<img[^>]*>)/gi, '$&<br>')
        .replace(/<\/div><p><\p>/g, '</div>')
        .replace(/<br\s*\/?>/gi, '') // Ensure no <br> tags remain
        .replace(/<p>\s*<\/p>/gi, ''); // Remove empty <p> tags
    
    await setText(textWithBreaks);
    console.log(textWithBreaks);

    if (currentMode === "Generate") await setWordCount(textWithBreaks.split(' ').length);
    if (currentMode === "Generate") {setCurrentMode('Alter Draft');};
    setIsGenerating(false);

    try {
      const firmDatabase = collection(db, 'firms');
      const data = await getDocs(firmDatabase);
      const userDoc = await getDoc(doc(db, 'users', auth.currentUser.email));
      const firmDoc = data.docs.find((docc) => docc.id === userDoc.data().FIRM);
      if (firmDoc) {  
        const firmDocRef = doc(db, 'firms', firmDoc.id);
        const currentDate = new Date();
        const formattedDate = `${currentDate.getMonth() + 1}/${currentDate.getDate()}/${currentDate.getFullYear().toString().substr(-2)} | ${currentDate.getHours() % 12 || 12}:${currentDate.getMinutes()} ${currentDate.getHours() >= 12 ? 'PM' : 'AM'}`;
        const genPosts = firmDoc.data().GEN_POSTS || [];
        const newPost = { [formattedDate]: textWithImages }; genPosts.unshift(newPost);
        await updateDoc(firmDocRef, { GEN_POSTS: genPosts });
    }} catch (err) {console.log('ERRORRRRRR', err);}


  };

  const fetchBrandImage = async (imgDescription, webPic='', imagelessText, isReplacing=false, headerDesc='', headerTimeToRead='') => { // 1.5c per image
    let resultImg = null;
    const h1Title = isReplacing ? headerDesc : (imagelessText.match(new RegExp(`<${titleTag}>(.*?)</${titleTag}>`)) || [])[1];
    const formattedDate = new Date().toLocaleDateString('en-US', { day: 'numeric', month: 'long', year: 'numeric' });
    const timeToRead = isReplacing ? headerTimeToRead : Math.ceil(imagelessText.split(' ').length / 200);
    let firmSite = ''; try {firmSite = new URL(contactUsLink).hostname.replace(/^www\./, '');} catch (e) {console.error(e);}      
  
    await fetch('https://api.templated.io/v1/render', {
      method: 'POST',
      async: false,
      body: JSON.stringify({
        "template" : '88e62b0b-9879-4d56-af23-1b32afbf1457',
        "async" : false,
        "layers" : {
          "primary-text" : {
            "text" : h1Title,
          },
          "shape-0" : {
            "stroke": customColor,
          },
          "firm-name" : {
            "text": firmName,
          },
          "firm-site" : {
            "text": firmSite,
          },
          "firm-img": {
            "image_url" : firmImage,
          },
          "date-today" : {
            "text": formattedDate,
          },
          "read-time" : {
            "text": `  ${timeToRead} MIN READ`,
          },
          "primary-img" : {
              "image_url": webPic,
          },
        }
      }),
      headers: {
        'Content-Type' : 'application/json',
        'Authorization' : `Bearer ${import.meta.env.VITE_TEMPLATED_API_KEY}`
      }
    })
    .then(response => {if(!response.ok){console.log('Network response was not ok')};  return response.json(); })
    .then(data => {console.log('templated data: ', data); resultImg = `<img src="${data.render_url}" alt="${h1Title} | ${timeToRead}" style="max-width: 100%;" />`;})
    .catch(error => {console.error('Error:', error);});
  
    return resultImg;
  }
  
  const fetchImage = async (description, isFirst=false, imagelessText='', replaceImgUrl=null) => {
    
    const isReplace = replaceImgUrl !== null; let resultImg = null;  
    const url = "https://api.dataforseo.com/v3/serp/google/images/live/advanced";
    const payload = JSON.stringify([{
        keyword: `${description}`,
        location_code: 2826, language_code: "en",
        device: "desktop", os: "windows", depth: 100,
        search_param: imagesSettings === 'Free' ? "&tbs=sur:cl" : ``,
    }]);
  
    const headers = {
        'Authorization': 'Basic YXZpcm94NEBnbWFpbC5jb206NTEwNjUzYzA0ODkyNjBmYg==',
        'Content-Type': 'application/json'
    };
  
    let counter = 0; let data = null; let tempUrl; let rIndex = 0;
    data = await fetch(url, { method: 'POST', headers, body: payload })
    .then(response => response.json())
    .catch(error => console.error('Error:', error));      
  
    while (counter < 5) {
      const currentItem = data.tasks[0].result[0].items[rIndex];
      if (currentItem.source_url === undefined || (isReplace && currentItem.source_url === replaceImgUrl)) {
        rIndex = Math.floor(Math.random() * 5); // Ensure it picks from one of the 5 items
        console.log('rerunn serp img, undefined OR same as replaceImgUrl: ', currentItem.source_url, 'img desc: ', description);
      } else {
        tempUrl = currentItem.source_url;
        console.log('img defined and not same as replaceImgUrl!: ', tempUrl, 'img desc: ', description);
        break;
      }
      counter += 1;
    }
    
    if (isFirst) {return fetchBrandImage(description, tempUrl, imagelessText);}
    resultImg = `<img src="${tempUrl}" alt="${description}" style="max-width: 100%;" />`;

    return resultImg;
  };
  
  const addImages = async (imagelessText) => {
    const regex = /\/\/Image: (.*?)\/\//g;
    const matches = [...imagelessText.matchAll(regex)];
    const descriptions = matches.map(match => match[1]);
  
    let imagefullText = imagelessText;
  
    const imageTags = [];
  
    for (let i = 0; i < descriptions.length; i += 3) {
      const batch = descriptions.slice(i, i + 3);
      const batchImageTags = await Promise.all(batch.map((item, index) => fetchImage(item, index === -1))); 
      imageTags.push(...batchImageTags); 
      
      if (i + 3 < descriptions.length) {
        await new Promise(resolve => setTimeout(resolve, 2000));
      }
    }
  
    const h1Title0 = (imagelessText.match(new RegExp(`<${titleTag}>(.*?)</${titleTag}>`)) || [])[1];
    if (isUseThumbnail) {
      const backgroundFormattedTitle = await fetch('https://us-central1-pentra-claude-gcp.cloudfunctions.net/gcp-claudeAPI', {
        method: 'POST', 
        headers: {'Content-Type': 'application/json'}, 
        body: JSON.stringify({ 
          model: modelKeys[2], 
          messages: [{
            role: "user", 
            content: `Based on '${h1Title0}' give me a distilled two word phrase with the three words attached at the end being HD background image. ONLY output the phrase. SAY NOTHING ELSE. Example: 'UI/UX trends in HR 2024' = 'UI/UX background image'`
          }],
        })
      });
      console.log(backgroundFormattedTitle);
      console.log('BACKGROUND FORMATTED TITLE: ', backgroundFormattedTitle.text());
  
      const brandImage = await fetchImage(`HD Background Image for ${blogTitle}`, true, imagelessText);
      
      imagefullText = imagelessText.replace(new RegExp(`(</${titleTag}>)`), `$1${brandImage}`);
    }
  
    matches.forEach((match, index) => {
      if (imageTags[index]) {
        imagefullText = imagefullText.replace(match[0], imageTags[index]);
      }
    });
  
    return imagefullText;
  }
  
  const replaceImage = async (imgDesc, imgSrc, isHeaderImg=false, headerTimeToRead='5') => {
    console.log('replacing image: ', imgDesc, imgSrc);
    let newImg = '';

    if (isHeaderImg) {

      const bgImg = await fetchImage(imgDesc, false, '', imgSrc); let newWebPic = '';
      const imgTag = bgImg.match(/<img\s+[^>]*src="([^"]*)"\s+alt="([^"]*)"/i);
      if (imgTag) { newWebPic = imgTag[1];  console.log('new webpic:', newWebPic); }

      newImg = await fetchBrandImage(imgDesc, newWebPic, '', true, imgDesc, headerTimeToRead);

    } else { 
      await fetchImage(imgDesc, false, '', imgSrc).then((fetchedImg) => {
      newImg = fetchedImg;
      }); 
    }

    console.log('fetched image tag: ', newImg);
    return newImg;
  };


  const browseWeb = async (prompt, isAddLinks = false) => {

    const youUrl = `https://us-central1-pentra-claude-gcp.cloudfunctions.net/youAPIFunction`;
    const apiKey = '7cc375a9-d226-4d79-b55d-b1286ddb4609<__>1P4FjdETU8N2v5f458P2BaEp-Pu3rUjGEYkI4jh';
    const query = encodeURIComponent(`GIVE FACTUAL LEGAL INFORMATION SPECIFICALLY ON: ${blogTitle}.`);
    let claudeKeyPoints = "";

    const options = {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        prompt: query,
      })
    };

  if (isAdvancedBrowseWeb) {
    setLoadIndicator(['Deeply Researching', 37.5]); 
    const results = []; 

    try {
    const youResponse = await fetch(youUrl, options);
    const data = await youResponse.json(); console.log(data); 
    setSources(data.hits); setDoneSourcing(true);

      for (let i = 0; i < 3; i += 1) {
        console.log('RUN ', i, data.hits[i]);
        const url = data.hits[i].url; const title = data.hits[i].title;

        try {
          // eslint-disable-next-line no-await-in-loop
          const response = await fetch('https://api.firecrawl.dev/v0/scrape', {
            method: 'POST',
            headers: {'Content-Type': 'application/json', 
            'Authorization': 'Bearer fc-62533a96243b43b597852174840099a3'},
            body: JSON.stringify({ url })
          });
          // eslint-disable-next-line no-await-in-loop
          const data0 = await response.json();
          const content = data0.data.content;
          const startIndex = content.indexOf('==================');
          if (startIndex !== -1) {
            const words = content.slice(startIndex).split(' ');
            const slicedWords = words.slice(0, 4000);
            const result = {LINK: url, TITLE: title, CONTENT: slicedWords.join(' ')};
            results.push(result);
            console.log(result);
          }
        } catch (err) {console.error(err);}
      }} catch (err) {console.error(err);}

    setLoadIndicator(['Synthesizing Info', 45]); 

    claudeKeyPoints = await fetch('https://us-central1-pentra-claude-gcp.cloudfunctions.net/gcp-claudeAPI', {
    method: 'POST', headers: {'Content-Type': 'application/json'}, body: JSON.stringify({ 
    model: modelKeys[1], messages: [{role: "user", content: `Give me 10-14 comprehensive and detailed key points for the web results
    given below, SPECIFICALLY in the context of ${blogTitle}. DONT DEVIATE. DATA: ${JSON.stringify(results)} `}],})});

    return (isAddLinks ? [results, claudeKeyPoints.text()] : claudeKeyPoints.text())

    } else {

    const youResult = await fetch(youUrl, options)
    .then(response => response.json())
    .then(data => {console.log(data); setSources(data.hits); setDoneSourcing(true); return data;})
    .catch(err => {console.error(err); return err;});

    return isAddLinks ? [youResult, youResult] : youResult;
    
  }
}

  return (
    <Container sx={{backgroundColor: '', height: '100%', paddingBottom: '20px'}}>
      <script src="http://localhost:30015/embed.min.js" defer />
      <Stack mb={1.5} direction="row" alignItems="center" justifyContent="space-between"
      sx={{}} spacing={2}>
        <style>
        @import url(https://fonts.googleapis.com/css2?family=Cormorant+Infant:ital,wght@0,300;0,400;0,500;0,600;0,700;1,300;1,400;1,500;1,600;1,700&family=DM+Serif+Display:ital@0;1&family=Fredericka+the+Great&family=Raleway:ital,wght@0,100..900;1,100..900&family=Taviraj:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900&family=Yeseva+One&display=swap);
      </style>
      <PageTitle title="Blog Generator" />

      <Stack direction="row" spacing={2} >

      <Button variant="contained" startIcon={<Iconify icon="solar:document-text-outline" sx={{height: '17.0px'}} />} 
      onClick={() => {
        switch (wordRange) {
          case "Upto 200 Words": setWordRange("200 - 400 Words"); break;
          case "200 - 400 Words": setWordRange("400 - 600 Words"); break;
          case "400 - 600 Words": setWordRange("600 - 800 Words"); break;
          case "600 - 800 Words": setWordRange("800 - 1000 Words"); break;
          case "800 - 1000 Words": setWordRange("1000 - 1200 Words"); break;
          case "1000 - 1200 Words": setWordRange("1200 - 1400 Words"); break;
          // case "1200 - 1400 Words": setWordRange("1400 - 1600 Words"); break;
          case "1200 - 1400 Words": setWordRange("Upto 200 Words"); break;
          default: setWordRange("600 - 800 Words");
        }
      }}
      sx={(theme) => ({ backgroundColor: theme.palette.primary.green, display: isWpDropdownOpen ? 'none' : 'flex',
      '&:hover': { backgroundColor: theme.palette.primary.green, }, })}>
      {wordRange} </Button>

      <BasicTooltip title='Number of Images'>
      <Button variant="contained" endIcon={<Iconify icon="ph:images-bold" />} 
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
      sx={(theme) => ({ backgroundColor: theme.palette.primary.green, display: isWpDropdownOpen ? 'none' : 'flex',
      '&:hover': { backgroundColor: theme.palette.primary.green, }, height: '40px' })}>
        {imageCount.replace(" Images", "")}
      </Button> </BasicTooltip>

      <BasicTooltip title='Browse The Web'>
      <Button variant="contained"
      sx={(theme) => ({backgroundColor: theme.palette.primary.green, '&:hover': { backgroundColor: theme.palette.primary.green, },
      width: '40px', height: '40px', justifyContent: 'center', alignItems: 'center', minWidth: '10px', display: isWpDropdownOpen ? 'none' : 'flex',})}
      onClick={() => {setIsBrowseWeb(!isBrowseWeb);}}>
        <Iconify icon= {isBrowseWeb ? "mdi:web" : "mdi:web-cancel"} sx={{minHeight: '18.25px', minWidth: '18.25px'}}/>
      </Button> </BasicTooltip>

      <BasicTooltip title='Header Image' end>
      <Button variant="contained"
      sx={(theme) => ({backgroundColor: theme.palette.primary.green, '&:hover': { backgroundColor: theme.palette.primary.green, },
      width: '40px', height: '40px', justifyContent: 'center', alignItems: 'center', minWidth: '10px', display: isWpDropdownOpen ? 'none' : 'flex',})}
      onClick={() => {setIsUseThumbnail(!isUseThumbnail);}}>
        <Iconify icon= {isUseThumbnail ? "material-symbols:thumbnail-bar" : "material-symbols:thumbnail-bar-outline"} sx={{minHeight: '18.25px', minWidth: '18.25px'}}/>
      </Button> </BasicTooltip>

      <BasicTooltip title='Writing Style' end>
      <Button variant="contained" startIcon={<Iconify icon="material-symbols:emoji-food-beverage" sx={{height: '18px'}}/>} 
      onClick={() => {
        switch (style) {
          case "Unstyled": setStyle("How-To Guide"); break;
          case "How-To Guide": setStyle("Data-Dense"); break;
          case "Data-Dense": setStyle("Opinion"); break;
          case "Opinion": setStyle("Case Study"); break;
          case "Case Study": setStyle("Case Law Breakdown"); break;
          case "Case Law Breakdown": setStyle("Unstyled"); break;
          default: setStyle("Unstyled");
        }
      }}
      sx={(theme) => ({ backgroundColor: theme.palette.primary.green, display: isWpDropdownOpen ? 'none' : 'flex',
      '&:hover': { backgroundColor: theme.palette.primary.green, }, height: '40px' })}>        
      {style} </Button> </BasicTooltip>

      <BasicTooltip title='Add Keywords'>
      <Button variant="contained"
      sx={(theme) => ({backgroundColor: theme.palette.primary.navBg, 
      '&:hover': { backgroundColor: theme.palette.primary.navBg, },
      width: '40px', height: '40px', justifyContent: 'center', 
      alignItems: 'center', minWidth: '10px', 
      display: isWpDropdownOpen ? 'none' : 'flex',
      position: 'relative'})}
      onClick={() => {setIsKeywordDropdownOpen(!isKeywordDropdownOpen)}}>
        <Iconify icon="eva:plus-fill" sx={{minHeight: '18.25px', minWidth: '18.25px'}}/>
      </Button>
      </BasicTooltip>


      <Card sx={(theme) => ({
        position: 'absolute',
        top: '92px',
        right: '54px',
        maxHeight: '362.5px',
        width: '360px',
        display: isKeywordDropdownOpen ? 'block' : 'none',
        zIndex: 100,
        backgroundColor: 'white',
        padding: '0px',
        border: `1.5px solid ${theme.palette.primary.navBg}`,
        borderRadius: '4px',
        boxShadow: 'none',
        overflow: 'auto'
      })}>
        <Card sx={(theme) => ({
          top: '0px',
          height: '52.5px',
          width: '100%',
          borderRadius: '0px',
          color: 'white',
          backgroundColor: theme.palette.primary.navBg,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          paddingLeft: '15.5px',
          paddingRight: '12px',
          fontSize: '16px',
          letterSpacing: '-0.25px',
          fontWeight: '600'
        })}> 
          Target Keywords
          <Button
            size="small"
            onClick={() => setIsAddingKeyword(true)}
            sx={{
              color: 'white',
              minWidth: 'auto',
              padding: '4px',
              '&:hover': { backgroundColor: 'rgba(255, 255, 255, 0.1)' }
            }}
          >
            <Iconify icon="eva:plus-fill" sx={{ width: '20px', height: '20px' }}/>
          </Button>
        </Card>

        {isAddingKeyword && (
          <ListItem sx={{
            height: '62.5px',
            borderBottom: '1px solid #c2c1c0',
            paddingInline: '15.5px'
          }}>
            <TextField
              fullWidth
              size="small"
              value={newKeyword}
              onChange={(e) => setNewKeyword(e.target.value)}
              placeholder="Enter new keyword"
              onKeyPress={(e) => e.key === 'Enter' && handleAddKeyword()}
              sx={{ '& .MuiOutlinedInput-root': { borderRadius: '5px' } }}
              InputProps={{
                endAdornment: (
                  <Button 
                    size="small"
                    onClick={handleAddKeyword}
                    sx={(theme) => ({ color: theme.palette.primary.navBg })}
                  >
                    Add
                  </Button>
                ),
              }}
            />
          </ListItem>
        )}

        {weeklyKeywords.map((kw, index) => (
          <ListItem 
            key={index}
            sx={{
              height: '62.5px',
              borderBottom: index !== weeklyKeywords.length - 1 && '1px solid #c2c1c0',
              justifyContent: 'space-between',
              paddingInline: '15.5px'
            }}>
            <Stack direction="column" spacing={0.5}>
              <ListItemText 
                primary={kw.keyword}
                primaryTypographyProps={{
                  style: {
                    fontSize: '15.75px',
                    fontWeight: '600',
                    letterSpacing: '-0.15px'
                  }
                }}
                secondary={`${kw.data[kw.data.length - 1] >! 0 ? `${kw.data[kw.data.length - 1]} monthly searches` : `Added just now`}`}
                secondaryTypographyProps={{
                  style: {
                    fontSize: '13px',
                    color: 'grey'
                  }
                }}
              />
            </Stack>
            <Iconify 
              icon={selectedKeywords.includes(kw.keyword) ? "mdi:tick" : "eva:plus-fill"}
              sx={{
                width: '19.5px',
                height: '19.5px',
                cursor: 'pointer',
                color: theme => theme.palette.primary.navBg
              }}
              onClick={() => toggleKeywordSelection(kw.keyword)}
            />
          </ListItem>
        ))}
      </Card>

      {isWpDropdownOpen && <Button variant="contained" startIcon={<Iconify icon="teenyicons:text-document-solid" sx={{height: '13.25px'}}/>} 
      onClick={async () => {
        await saveToQueue('DRAFTS', text);
        setText('');  setIsWpDropdownOpen(false);
        setBlogTitle(''); setBlogInstructions('');
      }}
      sx={(theme) => ({ backgroundColor: theme.palette.primary.black,
      '&:hover': { backgroundColor: theme.palette.primary.black, }, })}>        
      Save Draft </Button>}

      {isWpDropdownOpen && <Button variant="contained" startIcon={<Iconify icon="mdi:clock" sx={{height: '16.25px'}}/>} 
      onClick={() => setIsScheduleDialogOpen(true)}
      sx={(theme) => ({ backgroundColor: theme.palette.primary.black,
      '&:hover': { backgroundColor: theme.palette.primary.black, }, })}>        
      Schedule </Button>}

      {isComingSoon && <ComingSoon isDialogOpen2={isComingSoon} handleClose2={() => {setIsComingSoon(false)}} />}

      {isWpDropdownOpen && <Button 
        variant="contained" 
        startIcon={<Iconify icon="cib:telegram-plane" sx={{height: '15.75px'}}/>} 
        onClick={() => setIsCategoryConfirmOpen(true)}
        sx={(theme) => ({ 
          backgroundColor: theme.palette.primary.black,
          '&:hover': { backgroundColor: theme.palette.primary.black, }, 
        })}
      >        
        Publish Now 
      </Button>}

      {text !== '' && <Button variant="contained" startIcon={<Iconify icon="dashicons:wordpress" sx={{height: '15.25px'}}/>} 
      onClick={() => {if (isWpIntegrated) {setIsWpDropdownOpen(!isWpDropdownOpen);} else {setIsWpDialogOpen(true);}}}
    sx={(theme) => ({ backgroundColor: theme.palette.primary.navBg,
      '&:hover': { backgroundColor: theme.palette.primary.navBg, }, })}>        
      {(isWpDropdownOpen ? `Close` : `Publish`)} </Button>}

      {isBrowseWeb && sources.length !== 0 && 
      <Button variant="contained" startIcon={<Iconify icon= {doneSourcing ? "map:search" : "line-md:downloading-loop"} sx={{height: '18px'}}/>}  
      sx={(theme) => ({backgroundColor: theme.palette.primary.navBg, '&:hover': { backgroundColor: theme.palette.primary.navBg, },
      width: '40px', paddingLeft: '28px', minWidth: '10px',})}
      onClick={() => {if (sources.length !== 0) {setIsSourcesOpen(!isSourcesOpen);}}} />}

      <Card sx={(theme) => ({position: 'absolute', top: '92px', right: '54px', height: '362.5px', width: '460px', 
      display: isSourcesOpen ? 'block' : 'none', zIndex: 100, backgroundColor: 'white', padding: '0px', 
      border: `1.5px solid ${theme.palette.primary.navBg}`, borderRadius: '4px', boxShadow: 'none', overflow: 'auto'})}>
        
      <Card sx={(theme) => ({top: '0px', height: '52.5px', width: '100%', borderRadius: '0px', color: 'white',
      backgroundColor: theme.palette.primary.navBg, display: 'flex', alignItems: 'center',
      fontSize: '16px', letterSpacing: '-0.25px', paddingLeft: '12px', fontWeight: '600'})}> 
      <Iconify icon= "map:search" sx={{height: '14.5px', marginRight: '4px'}}/>
      {doneSourcing ? "Searched for" : "Searching for"} {blogTitle}
      </Card>

      {sources.map((source, index) => (

        <ListItem 
          key={index} 
          sx={{height: expandedSource === index ? 'auto' : '102.5px', borderBottom: sources.length > 3 ? (index !== sources.length - 1 && '1.5px solid darkred') : '1px solid #c2c1c0',
          transition: 'all 0.2s ease', padding: expandedSource === index && '14.5px', justifyContent: 'space-between', paddingInline: '15.5px'}}>          

          <Stack direction="column" spacing={0.75}>
          <ListItemText primaryTypographyProps={{ style: { fontSize: '15.75px', fontWeight: '600', 
          letterSpacing: '-0.15px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', 
          maxWidth: '325px', } }}>{source.title} </ListItemText>

          <Iconify icon={(isAdvancedBrowseWeb && (index === 0 || index === 1 || index === 2)) ? "noto:star" : ""} sx={{width: '19.5px',
          height: '19.5px', position: 'absolute', right: '80px', top: '8.75px', cursor: 'pointer'}}
          onClick={() => {setExpandedSource(expandedSource === index ? null : index);}}/>

          <Iconify icon="fluent:link-multiple-24-filled" sx={{width: '19.5px', height: '19.5px', position: 'absolute',
          right: '49.5px', top: '10.25px', cursor: 'pointer'}}
          onClick={() => {const url = source.url.startsWith('http://') || source.url.startsWith('https://') ? source.url : `http://${source.url}`; window.open(url, '_blank');}}/>

          <Iconify icon={expandedSource === index ? "eva:arrow-up-fill" : "eva:arrow-down-fill"} sx={{width: '29px', height: '29px', position: 'absolute',
          right: '15px', top: '5.0px', cursor: 'pointer'}}
          onClick={() => {setExpandedSource(expandedSource === index ? null : index);}}/>

          {expandedSource === index ? (
              <Typography variant="body2" style={{width: '420px',}}
              >{source.snippet}</Typography> ) : (
              <Typography variant="body2" style={{ width: '420px',
                  overflow: 'hidden', textOverflow: 'ellipsis', display: '-webkit-box', 
                  WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}>{source.snippet}
              </Typography>
          )}
          </Stack></ListItem>
      ))}

      </Card>

        {currentMode === "Alter Draft" && <Button variant="contained" startIcon={<Iconify icon="mingcute:quill-pen-fill" sx={{height: '20px'}}/>} // iconoir:post
        sx={{backgroundColor: 'black', '&:hover': { backgroundColor: 'black', },}}
        onClick={() => {setCurrentMode("Generate"); setText('');}}>
        New </Button>}

        {currentMode === "Build Outline" && <Button variant="contained" startIcon={<Iconify icon="eva:plus-fill" sx={{height: '20px'}}/>} 
        sx={(theme) => ({backgroundColor: theme.palette.primary.black, '&:hover': { backgroundColor: theme.palette.primary.black, },})}
        onClick={() => {setCurrentMode("Generate"); setText('');}}>
        Skip Outline </Button>}

        </Stack></Stack>

      <Stack mb={2} direction="row" alignItems="center" justifyContent="space-between"
      sx={{}} spacing={2}>

      <Stack direction="row" spacing={2} sx={{width: 'calc(100% - 150px)'}}>
      
      <TextField value={blogTitle} onChange={(e) => setBlogTitle(e.target.value)}
       placeholder={currentMode === "Alter Draft" ? 'Make the first two sections shorter & replace mentions of TX with Dallas' : 'Blog Post Title'}
       sx={{width: currentMode === "Alter Draft" ? '100%' : '61%', transition: 'ease 0.3s'}} />

    
      {isGenerating && (
      <Stack direction="column" spacing={loadIndicator[0] === "Welcome Back!" ? 0.5 : 1.25} sx={{top: '352.5px', right: 'calc((100% - 285px)/2 - 160px)', position: 'absolute', 
      height: 'auto', width: '320px', backgroundColor: 'transparent', display: 'flex', justifyContent: 'center', alignItems: 'center'}}>

      <Typography sx={{ fontFamily: "DM Serif Display", zIndex: 9,
      letterSpacing: '-0.55px',  fontWeight: 500, fontSize: '36.75px'}}>
        {loadIndicator[0]}
      </Typography>

      {loadIndicator[0] !== "Welcome Back!" && <Card sx={(theme) => ({height: '45px', backgroundColor: 'white', width: '100%', borderRadius: '6px', zIndex: 9,
      border: `2.00px solid ${theme.palette.primary.navBg}`, background: `linear-gradient(to right, ${theme.palette.primary.navBg} ${loadIndicator[1]}%, white 20%)`,
      transition: '1s ease all' })} />}

      </Stack>)}

      {!isGenerating && text === '' && (
      <Stack direction="column" spacing={loadIndicator[0] === "Welcome Back!" ? 0.5 : 1.25} sx={{
        top: 'calc(50vh)', 
        right: 'calc((100% - 285px)/2 - 160px)', position: 'absolute', 
      height: 'auto', width: '320px', backgroundColor: 'transparent', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 9}}>

      {loadIndicator[0] === "Welcome Back!" && <Typography sx={{ fontFamily: "DM Serif Display",
      letterSpacing: '-0.55px',  fontWeight: 500, fontSize: '36.75px', zIndex: 9}}>
        {text === '' ? "Welcome Back!" : ''}
      </Typography>}

      {loadIndicator[0] === "Welcome Back!" && !isReferenceGiven && text === '' && <Typography sx={{ fontFamily: "serif", 
      lineHeight: '32.5px', letterSpacing: '-0.25px',  fontWeight: 200, fontSize: '23.75px', textAlign: 'center', zIndex: 9}}>
        This is the place your new <br />  articles will appear.
      </Typography>}

      </Stack>)}

      {currentMode !== "Alter Draft" && <TextField
       value={blogInstructions}
       onChange={(e) => setBlogInstructions(e.target.value)}
       placeholder='Instructions or Keywords [Optional]'
       sx={{width: '60%', transition: 'ease 0.3s'}} />}
       </Stack>
       
        <Button onClick={() => isGenerating ? {} : generateBlog()}
        variant="contained" color="inherit" 
        className={`generate-button ${isGenerating ? 'generating' : ''} gen-buttons`}
        sx={(theme) => ({height: '54px', width: '140px', cursor: isGenerating ? 'default' : 'pointer',
        backgroundColor: isGenerating ? theme.palette.primary.black : theme.palette.primary.black})}>
          {isGenerating ? `Generating` : currentMode} {/* ✨ */}
        </Button>
        </Stack>

        <style>{`
                .generate-button:before {
                    content: ''; background: linear-gradient(45deg, #ff0000, #ff7300, #fffb00, #48ff00, #00ffd5, #002bff, #7a00ff, #ff00c8, #ff0000);
                    position: absolute; top: -2px; left:-2px; background-size: 400%; z-index: -1; filter: blur(1.2px);
                    width: calc(100% + 4px); height: calc(100% + 4px); animation: glowing 20s linear infinite;
                    opacity: 0; transition: opacity .3s ease-in-out; border-radius: inherit;
                }

                .generate-button.generating:before { opacity: 1; }

                .generate-button:after {
                    z-index: -1; content: ''; position: absolute; width: 100%; height: 100%;
                    background: black; left: 0; top: 0; border-radius: inherit;
                }

                @keyframes glowing {
                    0% { background-position: 0 0; }
                    50% { background-position: 400% 0; }
                    100% { background-position: 0 0; }
                }
            `}</style>

        <BlogEditor text={text} setText={setText} isGenerating={isGenerating}
        boxHeight={boxHeight} boxWidth={boxWidth} wordCount={wordCount}
        replaceImage={replaceImage} />

      
        <Stack direction="row" spacing={2} >

        <Button variant="contained" sx={(theme) => ({backgroundColor: theme.palette.primary.black, '&:hover': { backgroundColor: theme.palette.primary.black, }, cursor: 'default'})}>
        Power Tools <Iconify icon="eva:arrow-right-fill" /></Button>
                  
        <BasicTooltip title='Learn In-Depth from Online Sources'>
          <Button variant="contained" startIcon={<Iconify icon="eva:plus-fill" />} onClick={() => {setIsAdvancedBrowseWeb(!isAdvancedBrowseWeb); setIsReferenceGiven(false);}}
            sx={(theme) => ({backgroundColor: isAdvancedBrowseWeb ? theme.palette.primary.green : 'grey', '&:hover': { backgroundColor: theme.palette.primary.green, border: "2.5px solid darkgreen" },
            maxHeight: '36.0px',
            border: isAdvancedBrowseWeb ? "2.5px solid darkgreen" : '2.5px solid grey'})}>
            Deep Research
          </Button>
        </BasicTooltip>

        <BasicTooltip title='Write in Your Blog Writing Style'>
        <Button variant="contained" startIcon={<Iconify icon="eva:plus-fill" />} onClick={() => {setIsMimicBlogStyle(!isMimicBlogStyle)}}
        sx={(theme) => ({backgroundColor: isMimicBlogStyle ? theme.palette.primary.green : 'grey', '&:hover': { backgroundColor: theme.palette.primary.green, },})}>
        Mimic Firm Blogs </Button> </BasicTooltip>

        <BasicTooltip title='Cite External Sources'>
        <Button variant="contained" startIcon={<Iconify icon="eva:plus-fill" />} onClick={() => {setIsUseInternalLinks(!isUseInternalLinks)}}
        sx={(theme) => ({backgroundColor: isUseInternalLinks ? theme.palette.primary.green : 'grey', '&:hover': { backgroundColor: theme.palette.primary.green, },})}>
        Cite Sources </Button> </BasicTooltip>

        <BasicTooltip title='Experimental  -  Cite Case Law'>
        <Button variant="contained" startIcon={<Iconify icon="eva:plus-fill" />} onClick={() => {setIsMentionCaseLaw(!isMentionCaseLaw)}}
        sx={(theme) => ({backgroundColor: isMentionCaseLaw ? theme.palette.primary.green : 'grey', '&:hover': { backgroundColor: theme.palette.primary.green, },})}>
        Mention Cases </Button> </BasicTooltip>

        <BasicTooltip title='Add Your Own Data'>
        <Button variant="contained" startIcon={<Iconify icon="eva:plus-fill" />} onClick={() => {setIsReferenceGiven(!isReferenceGiven); setIsBrowseWeb(false);}}
        sx={(theme) => ({backgroundColor: isReferenceGiven ? theme.palette.primary.green : 'grey', '&:hover': { backgroundColor: theme.palette.primary.green, },})}>
        New Data </Button> </BasicTooltip>

        </Stack> 

        {isReferenceGiven && (
        <textarea value={referenceText} onChange={(e) => setReferenceText(e.target.value)} 
        style={{width: '100%', height: '125px', marginTop: '18px', border: '0.1px solid',
        borderRadius: '0px', padding: '15px', fontSize: '15px', fontFamily: 'Arial',}} 
        placeholder='Feed any text here you would like the AI model to use. It helps to explain how youd like it to use it in the blog description.'/>
        )}    

        <WpDialog isDialogOpen={isWpDialogOpen} handleClose={() => {setIsWpDialogOpen(false)}} 
        isWpIntegrated={isWpIntegrated} setIsWpIntegrated={setIsWpIntegrated} firmName={firmName}
        wpUrl={wpUrl} setWpUrl={setWpUrl} wpUsername={wpUsername} setWpUsername={setWpUsername}
        wpPassword={wpPassword} setWpPassword={setWpPassword} />

        <ScheduleDialog
          isOpen={isScheduleDialogOpen}
          onClose={() => setIsScheduleDialogOpen(false)}
          onSchedule={async (date, time) => {
            const response = await publishBlog(wpUsername, wpPassword, wpUrl, text, titleTag, `${date}T${time}:00`);
            if (response && (response.status === 200 || response.status === 201)) {
              await saveToQueue('SCHEDULED', text);
              setText('');
              setIsWpDropdownOpen(false);
              setCurrentMode('Generate');
              setIsPostError(false);
              setBlogTitle('');
              setBlogInstructions('');
            } else {
              setIsPostError(true); 
            }
          }}
        />

        <CategoryDialog 
          open={isCategoryDialogOpen}
          onClose={() => setIsCategoryDialogOpen(false)}
          categories={availableCategories}
          selectedCategories={selectedCategories}
          setSelectedCategories={setSelectedCategories}
          onPublish={async () => {
            const response = await publishBlog(wpUsername, wpPassword, wpUrl, text, titleTag, null, selectedCategories);
            if (response && (response.status === 200 || response.status === 201)) {
              await saveToQueue('PUBLISHED', text);
              setText(''); setIsWpDropdownOpen(false);
              setCurrentMode('Generate'); setIsPostError(false);
              setBlogTitle(''); setBlogInstructions('');
              setIsCategoryDialogOpen(false);
            } else {
              setIsPostError(true);
            }
          }}
        />

        <Dialog
          open={isCategoryConfirmOpen}
          onClose={() => setIsCategoryConfirmOpen(false)}
          PaperProps={{ style: { borderRadius: '6px' } }}
        >
          <Card sx={{ p: 3, width: '400px' }}>
            <Typography variant="h6" sx={{ mb: 2 }}>
              Would you like to add categories to this post?
            </Typography>
            <Stack direction="row" spacing={2}>
              <Button
                fullWidth
                variant="outlined"
                onClick={async () => {
                  setIsCategoryConfirmOpen(false);
                  const response = await publishBlog(wpUsername, wpPassword, wpUrl, text, titleTag);
                  if (response?.status === 200 || response?.status === 201) {
                    await saveToQueue('PUBLISHED', text);
                    setText(''); setIsWpDropdownOpen(false);
                    setCurrentMode('Generate'); setIsPostError(false);
                    setBlogTitle(''); setBlogInstructions('');
                  } else {
                    setIsPostError(true);
                  }
                }}
              >
                Skip Categories
              </Button>
              <Button
                fullWidth
                variant="contained"
                onClick={() => {
                  setIsCategoryConfirmOpen(false);
                  fetchCategories();
                  setIsCategoryDialogOpen(true);
                }}
                sx={(theme) => ({ 
                  minHeight: 38,
                  bgcolor: theme.palette.primary.navBg,
                  '&:hover': { bgcolor: theme.palette.primary.navBg }
                })}
              >
                Add Categories
              </Button>
            </Stack>
          </Card>
        </Dialog>
    
    </Container>
  );
}
