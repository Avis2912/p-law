// import React, { useState, useEffect } from 'react';
// import firebase from 'firebase/app';
// import 'firebase/firestore';

// const Circle = () => {
//   const [conversation, setConversation] = useState([
//     { role: 'assistant', content: `Welcome to Morgan & Weisbrod. I'm ready to help. Are you an existing client?` },
//   ]);
//   const [inputText, setInputText] = useState('');
//   const [responseText, setResponseText] = useState('Sorry, please text me again.');
//   const [isChatOpen, setIsChatOpen] = useState(true);
//   const [isNameMoment, setIsNameMoment] = useState(false);
//   const [isNumberMoment, setIsNumberMoment] = useState(false);
//   const [inputPlaceholder, setInputPlaceholder] = useState('Type A Message');
//   const [nameProvided, setNameProvided] = useState('Not Provided');
//   const [numberProvided, setNumberProvided] = useState('Not Provided');
//   const [emailProvided, setEmailProvided] = useState('Not Provided');
//   const [situationProvided, setSituationProvided] = useState('Not Provided');
//   const [firstText, setFirstText] = useState('');
//   const [language, setLanguage] = useState(true);
//   const [themeColor, setThemeColor] = useState('#204760');

//   const baseStyle = { position: 'absolute', borderRadius: '50%' };
//   const circle = {
//     ...baseStyle,
//     width: '95px',
//     height: '95px',
//     bottom: '30px',
//     right: '30px',
//     backgroundColor: 'transparent',
//     backgroundSize: 'cover',
//     backgroundPosition: 'center',
//     boxShadow: '1.25px 1.25px 4px 0px rgba(0,0,0,0.4)',
//     backgroundImage: 'url("https://firebasestorage.googleapis.com/v0/b/pentra-hub.appspot.com/o/Screenshot%202024-04-12%20at%202.23.14%E2%80%AFAM.png?alt=media&token=1eacd2a0-0376-4108-84c6-3f4ea9464c96")',
//   };
//   const onlineCircle = {
//     ...baseStyle,
//     width: '13px',
//     height: '13px',
//     bottom: '5px',
//     right: '3px',
//     backgroundColor: 'lightgreen',
//     border: '2px solid white',
//   };
//   const chatPreviewBubble = {
//     width: '207.5px',
//     height: '42.5px',
//     position: 'fixed',
//     bottom: '57.5px',
//     right: '140px',
//     backgroundColor: 'white',
//     borderRadius: '10px',
//     borderBottomRightRadius: '0px',
//     display: 'flex',
//     justifyContent: 'center',
//     alignItems: 'center',
//     paddingRight: '1.5px',
//     fontFamily: 'Arial',
//     fontSize: '16px',
//     letterSpacing: '-0.15px',
//   };
//   const chatBox = {
//     width: '380px',
//     height: isChatOpen ? '510px' : '0px',
//     backgroundColor: 'white',
//     position: 'absolute',
//     bottom: '-2.5px',
//     right: '-2.5px',
//     padding: '10px',
//     paddingTop: '82.5px',
//     border: '0px solid black',
//     borderRadius: '7px',
//     zIndex: '999',
//     display: 'flex',
//     flexDirection: 'column',
//     transition: 'ease 0.5s',
//     overflowY: 'auto',
//   };
//   const chatBoxSpace = {
//     width: '380px',
//     backgroundColor: 'white',
//     height: isChatOpen ? '440px' : '0px',
//     opacity: 1,
//     marginBottom: '70px',
//     borderRadius: '0px',
//     marginTop: '0px',
//     position: 'absolute',
//     bottom: '-2.5px',
//     right: '-2.5px',
//     padding: '10px',
//     overflowY: 'auto',
//   };
//   const chatHeader = {
//     height: '65px',
//     width: 'calc(100% - 30px)',
//     marginBottom: '15px',
//     alignItems: 'center',
//     backgroundColor: themeColor,
//     position: 'absolute',
//     borderRadius: '7px 7px 0px 0px',
//     padding: '0px 15px',
//     left: '0px',
//     top: '0px',
//     flexDirection: 'row',
//     display: 'flex',
//     justifyContent: 'flex-end',
//   };
//   const closeBtn = {
//     width: '34px',
//     height: '34px',
//     borderRadius: '2px',
//     cursor: 'pointer',
//     backgroundColor: 'white',
//     marginLeft: '10px',
//     display: 'flex',
//     fontFamily: 'Arial',
//     letterSpacing: '-0.2px',
//     fontSize: '17px',
//     justifyContent: 'center',
//     alignItems: 'center',
//     verticalAlign: 'middle',
//   };
//   const reloadBtn = {
//     ...closeBtn,
//     fontSize: '30px',
//     fontWeight: 300,
//     paddingBottom: '4px',
//     height: '30px',
//     paddingLeft: '2px',
//     width: '34px',
//   };
//   const languageBtn = {
//     ...closeBtn,
//     padding: '0px 4px',
//     fontFamily: 'serif',
//     backgroundSize: '100%',
//     width: '80px',
//     backgroundSize: '0%',
//     fontWeight: '550',
//     fontSize: '16px',
//     letterSpacing: '-0.1px',
//   };
//   const logoIcon = {
//     ...closeBtn,
//     height: '38px',
//     width: '38px',
//     backgroundSize: '100%',
//     backgroundSize: '0%',
//     fontWeight: '550',
//     borderRadius: '50px',
//     position: 'absolute',
//     left: '7px',
//     backgroundSize: '100%',
//     backgroundRepeat: 'no-repeat',
//     backgroundPosition: 'center',
//     backgroundImage: 'url("https://firebasestorage.googleapis.com/v0/b/pentra-hub.appspot.com/o/decentral%20(25).png?alt=media&token=5e7a96c7-ae8a-47c8-a3e9-2ceb3bc7fc6f")',
//   };
//   const inputBox = {
//     height: '50px',
//     width: 'calc(340px)',
//     bottom: '42px',
//     marginLeft: '5px',
//     position: 'fixed',
//     backgroundColor: '#ededed',
//     borderRadius: '4.5px',
//     fontSize: '16px',
//     fontFamily: 'Arial',
//     letterSpacing: '-0.2px',
//     border: '0px solid black',
//     paddingInline: '15px',
//     placeholder: inputPlaceholder,
//     fontWeight: '600',
//     zIndex: '9',
//   };
//   const footer = {
//     height: '15px',
//     width: 'calc(340px)',
//     bottom: '27.5px',
//     backgroundColor: 'white',
//     position: 'fixed',
//   };
//   const sendBtn = {
//     height: '35px',
//     width: '35px',
//     color: inputText === '' ? 'black' : 'white',
//     bottom: '15px',
//     marginLeft: '5px',
//     position: 'fixed',
//     backgroundColor: inputText === '' ? 'white' : '#3d9440',
//     borderRadius: '4.5px',
//     fontSize: '20px',
//     fontFamily: 'Arial',
// letterSpacing: '-0.2px',
// border: '0px solid black',
// marginBottom: '8px',
// right: '50px',
// bottom: '42.5px',
// display: 'flex',
// justifyContent: 'center',
// alignItems: 'center',
// zIndex: '10',
// };
// const userMessageStyle = {
// backgroundColor: themeColor,
// color: 'white',
// width: 'auto',
// maxWidth: '65%',
// alignSelf: 'flex-end',
// marginBottom: '17.5px',
// padding: '17.5px',
// marginRight: '5px',
// borderRadius: '7px',
// borderBottomRightRadius: '2px',
// minWidth: '0px',
// fontSize: '16px',
// fontFamily: 'Arial',
// letterSpacing: '0.35px',
// lineHeight: '24px',
// };
// const assistantMessageStyle = {
// ...userMessageStyle,
// backgroundColor: '#ededed',
// color: 'black',
// borderBottomRightRadius: '7px',
// borderBottomLeftRadius: '2px',
// alignSelf: 'flex-start',
// marginRight: '0px',
// marginLeft: '15px',
// maxWidth: 'calc(65% - 20px)',
// transition: 'ease 2.5s',
// };
// const chatCircle = {
// ...circle,
// width: '34px',
// height: '34px',
// position: 'relative',
// bottom: '19px',
// left: '3.25px',
// boxShadow: 'none',
// backgroundSize: 'cover',
// backgroundPosition: 'center',
// backgroundImage: 'url("https://firebasestorage.googleapis.com/v0/b/pentra-hub.appspot.com/o/Screenshot%202024-04-12%20at%202.23.14%E2%80%AFAM.png?alt=media&token=1eacd2a0-0376-4108-84c6-3f4ea9464c96")',
// };

// useEffect(() => {
// if (responseText.includes('full name')) setIsNameMoment(true);
// if (responseText.includes('phone number')) setIsNumberMoment(true);

// let newConversation = [...conversation];
// const typingIndex = conversation.findIndex(
//   (item) => item.role === 'assistant' && item.content === 'Typing...'
// );

// if (typingIndex !== -1) {
//   newConversation[typingIndex] = { role: 'assistant', content: responseText };
//   setConversation(newConversation);
// }
// }, [responseText]);

// useEffect(() => {
// if (isNameMoment) {
//   setInputPlaceholder('Enter Your Full Name');
// } else if (isNumberMoment) {
//   setInputPlaceholder('Enter Your Phone Number');
// } else {
//   setInputPlaceholder('Type A Message');
// }
// }, [isNameMoment, isNumberMoment]);

// const handleSend = async () => {
// let inputConversation = [
//   { role: 'user', content: 'hey' },
//   ...conversation,
//   { role: 'user', content: inputText },
// ];
// let newConversation = [
//   ...conversation,
//   { role: 'user', content: inputText },
//   { role: 'assistant', content: 'Typing...' },
// ];

// if (isNameMoment) {
//   setNameProvided(inputText);
//   setIsNameMoment(false);
// }
// if (isNumberMoment) {
//   setNumberProvided(inputText);
//   setIsNumberMoment(false);
// }

// setConversation(newConversation);

// const hi = async () => {
//   const gptResponse = await fetch('https://us-central1-pentra-claude-gcp.cloudfunctions.net/gcp-claudeAPI', {
//     method: 'POST',
//     headers: { 'Content-Type': 'application/json' },
//     body: JSON.stringify({
//       messages: inputConversation,
//       model: 'claude-3-haiku-20240307',
//       system: `
//         <role>
//         You're a Customer Support assistant at Morgan & Weisbrod, a Dallas based Social Security & Disability Claims Advocacy Firm. 

//         FIRM DESCRIPTION: At Morgan & Weisbrod LLP, we have decades of experience working alongside disabled clients in Texas, Oklahoma, Arkansas, New Mexico, Arizona, and Colorado who need financial support. We are Board Certified Specialists in SS and VA Disability Law; it's all we do. Over the past 48 years, have won millions of dollars in past due benefits for the thousands of SS, SSI and VA Disability clients we have represented. Our law firm focuses solely on disability claim cases, and we have more Board-Certified Social Security Disability attorneys than any other law firm in the US.    
//       </role>

//       <instruction>
//         1. ALWAYS answer in very SHORT, usually just 1 sentence, maybe 2. Unless you really, really need to elaborate. 
//         2. Use the provided blog data to answer questions whenever necessary.
//         3. When the user gives you their situation details, always mention that you will inform the lawyer of that, and sometimes that you'll make sure they receive immediate support.
//         4. Make sure to always follow this conversation flow:
//         - First, greet user and ask them if they're an existing client.
//         IF (EXISTING_CLIENT) THEN { - Then ask them for their full name and situation. }
//         IF (NOT_EXISTING_CLIENT) THEN {
//         - First ask them for their full name incase you get disconnected.
//         - Then say last thing & ask them for phone number similarly.
//         - Then ask about the person's situation.
//         - Follow this up with short, relevant probing questions like "How have your injuries affected your ability to work?", "Have you visited your doctor in the last 12 months?", "Would you mind elaborating?", etc.
//         - When you're sure the main conversation is over, ask for location and email.
//         }
//         ${!language && `5. ALWAYS respond only in Spanish.`}
//       </instruction>

//       <blog-content>
      
//       </blog-content>
//       `,
//     }),
//   });

//   return gptResponse;
// };

// hi().then(async (data) => {
//   const text = await data.text();
//   console.log(text);
//   setResponseText(text);
// });

// const date = new Date();
// const formattedDate = `${date.toLocaleDateString('en-US', { month: '2-digit', day: '2-digit', year: '2-digit' })} | ${date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}`;

// const docRef = db.collection('firms').doc('Morgan & Weisbrod');

// if (firstText === '') {
//   setFirstText(inputText);
//   setInputText('');
//   await docRef.update({
//     LEADS: firebase.firestore.FieldValue.arrayUnion({
//       CONVERSATION: newConversation,
//       NAME: nameProvided,
//       EMAIL: emailProvided,
//       PHONE: numberProvided,
//       DATE_TIME: formattedDate,
//       SUMMARY: 'Not Provided',
//     }),
//   });
// } else {
//   // Update the first lead
//   const doc = await docRef.get();
//   const leads = doc.data().LEADS;
//   const firstLead = leads[0]; // Get the first lead

//   const updatedFirstLead = {
//     CONVERSATION: newConversation,
//     NAME: nameProvided,
//     EMAIL: emailProvided,
//     PHONE: numberProvided,
//     DATE_TIME: new Date().toLocaleString(),
//     SUMMARY: firstText,
//   };

//   setInputText('');
//   await docRef.update({
//     LEADS: firebase.firestore.FieldValue.arrayRemove(firstLead),
//   });
//   await docRef.update({
//     LEADS: firebase.firestore.FieldValue.arrayUnion(updatedFirstLead),
//   });
// }
// };

// const handleKeyPress = (event) => {
// if (event.key === 'Enter') {
//   handleSend();
// }
// };

// const toggleLanguage = async () => {
//     await setLanguage(!language);
// // restartChat(!language);
// };

// const toggleChat = () => setIsChatOpen(!isChatOpen);

// const stopPropagation = (event) => event.stopPropagation();

// return (
//   <div style={circle} onClick={toggleChat}>
//     <div style={chatPreviewBubble}>👋🏼 How can we help you?</div>
//     <div style={onlineCircle} />
//     {isChatOpen && (
//       <div onClick={stopPropagation} style={chatBox}>
//         <div style={chatBoxSpace}>
//           {conversation.map((message, index) => {
//             const isUserMessage = message.role === 'user';
//             const messageStyle = isUserMessage ? userMessageStyle : assistantMessageStyle;
//             return (
//               <div
//                 key={index}
//                 style={{
//                   display: 'flex',
//                   flexDirection: 'row',
//                   alignItems: 'end',
//                   justifyContent: isUserMessage ? 'flex-end' : 'flex-start',
//                 }}
//               >
//                 {!isUserMessage && <div style={chatCircle} />}
//                 <div style={messageStyle}>{message.content}</div>
//               </div>
//             );
//           })}
//         </div>
//         <div style={chatHeader}>
//           <div style={languageBtn} onClick={toggleLanguage}>
//             {language ? 'Español' : 'English'}
//           </div>
//           <div style={reloadBtn}>⟳</div>
//           <div style={closeBtn} onClick={toggleChat}>
//             &#x2715;
//           </div>
//         </div>
//         <input
//           style={inputBox}
//           placeholder={inputPlaceholder}
//           onKeyPress={handleKeyPress}
//           value={inputText}
//           onChange={(event) => setInputText(event.target.value)}
//         />
//         <div style={sendBtn} onClick={handleSend}>
//           &#x25B6;
//         </div>
//       </div>
//     )}
//   </div>
// );
// };

// export default Circle;