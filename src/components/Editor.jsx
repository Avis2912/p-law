import React, { useEffect, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import Quill from 'quill';
import { Typography } from '@mui/material';
import 'quill/dist/quill.snow.css';
import QuillBetterTable from 'quill-better-table';
import 'quill-better-table/dist/quill-better-table.css';
import Iconify from 'src/components/iconify';
import { Icon } from '@iconify/react';

import BasicTooltip from './BasicTooltip';


Quill.register({
  'modules/better-table': QuillBetterTable
}, true);

function BlogEditor({ text, setText, isGenerating, boxWidth, boxHeight, wordCount, replaceImage }) {
  const quillRef = useRef(null);
  const editorRef = useRef(null);
  const [isInitialized, setIsInitialized] = useState(false);
  const [isReplacingImage, setIsReplacingImage] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [selectedImageDesc, setSelectedImageDesc] = useState(null);
  const lastSelectedImageRef = useRef(null);
  const lastSelectedImageDescRef = useRef(null);
  const lastSelectedImageIdRef = useRef(null);

  const cleanHtml = (html) => {
    // Remove all whitespace between tags
    html = html.replace(/>\s+</g, '><');
    // Replace empty <p> tags with <p><br></p>
    return html.replace(/<p>\s*<\/p>/gi, '<p><br></p>').trim();
  };

  const stripHtml = (html) => {
    const div = document.createElement('div');
    div.innerHTML = html;
    return div.textContent || div.innerText || '';
  };

  useEffect(() => {
    console.log('BlogEditor mounted. Initial text:', text);

    if (!editorRef.current && quillRef.current) {
      try {
        console.log('Initializing Quill editor');
        editorRef.current = new Quill(quillRef.current, {
          theme: 'snow',
          modules: {
            toolbar: [
              ['bold', 'italic', 'underline'],
              [{ list: 'ordered' }, { list: 'bullet' }],
              ['link'],
              ['table'],
              ['image']
            ],
            table: false,
            'better-table': {
              operationMenu: {
                items: {
                  unmergeCells: {
                    text: 'Another unmerge cells name'
                  }
                }
              }
            },
            keyboard: {
              bindings: QuillBetterTable.keyboardBindings
            }
          },
        });

        // Add table button to toolbar
        const toolbar = editorRef.current.getModule('toolbar');
        toolbar.addHandler('table', () => {
          const tableModule = editorRef.current.getModule('better-table');
          tableModule.insertTable(3, 2);
        });

        editorRef.current.on('text-change', () => {
          const content = editorRef.current.root.innerHTML;
          console.log('Quill content changed:', content);
          setText(cleanHtml(content));
        });

        editorRef.current.on('selection-change', (range) => {
          if (range && range.length > 0) {
            const delta = editorRef.current.getContents(range.index, range.length);
            const selectedHtml = delta.reduce((html, op) => {
              if (op.insert && typeof op.insert === 'string') {
                html += op.insert;
              } else if (op.insert && op.insert.image) {
                html += `<img src="${op.insert.image}" alt="${op.attributes.alt || ''}">`;
              }
              return html;
            }, '');
            console.log('Selected HTML:', selectedHtml);

            const imgMatches = selectedHtml.match(/<img\s+[^>]*src="([^"]*)"\s*alt="([^"]*)"\s*[^>]*>/i);
            if (imgMatches) {
              const imgSrc = imgMatches[1];
              const imgAlt = imgMatches[2];
              setSelectedImage(imgSrc);
              setSelectedImageDesc(imgAlt);
              lastSelectedImageRef.current = imgSrc;
              lastSelectedImageDescRef.current = imgAlt;
              console.log('Selected Image Src:', imgSrc);
              console.log('Selected Image Alt:', imgAlt);
            } else {
              setSelectedImage(null);
              setSelectedImageDesc(null);
            }
          } else {
            setSelectedImage(null);
            setSelectedImageDesc(null);
          }
        });

        setIsInitialized(true);
        console.log('Quill editor initialized');
      } catch (error) {
        console.error('Error initializing Quill:', error);
      }
    }

    return () => {
      console.log('BlogEditor unmounting');
      if (editorRef.current) {
        editorRef.current.off('text-change');
        editorRef.current.off('selection-change');
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [setText]);

  // Add this method to the editor reference
  useEffect(() => {
    if (editorRef.current) {
      editorRef.current.insertImage = (url) => {
        const range = editorRef.current.getSelection(true);
        editorRef.current.insertEmbed(range.index, 'image', url);
      };
    }
  }, [isInitialized]);

  const handleImageReplacement = async (imgDesc, imgSrc) => {
    
    setIsReplacingImage(true);
    const isHeaderImg = imgSrc.includes('https://templated');
    const [headerDesc, headerTimeToRead] = imgDesc.split('|').map(part => part.trim()) || ['', ''];

    const newImg = await replaceImage(isHeaderImg ? headerDesc : imgDesc, imgSrc, isHeaderImg, headerTimeToRead);
    console.log('New img: ', newImg)
    
      console.log('in1')
      const editor = editorRef.current;
      const editorHtml = editor.root.innerHTML;

      const tempDiv = document.createElement('div');
      tempDiv.innerHTML = editorHtml;

      // Find the image with the matching src
      const imgToReplace = tempDiv.querySelector(`img[src="${imgSrc}"]`);
      if (imgToReplace) {
        console.log('in2')

        const parser = new DOMParser();
        const doc = parser.parseFromString(newImg, 'text/html');
        const imgElement = doc.querySelector('img');
        const imgSrc0 = imgElement.getAttribute('src');
        console.log('Image src: ', imgSrc0);
        
        console.log('New img: ', imgSrc0)
        imgToReplace.src = imgSrc0; 
        
        editor.root.innerHTML = tempDiv.innerHTML;

        console.log('Image replaced successfully');
      } else {
        console.log('Image not found in editor');
    }
    setIsReplacingImage(false);
  };

  useEffect(() => {
    if (isInitialized && editorRef.current) {
      console.log('Updating Quill content. New text:', text);
      if (text !== editorRef.current.root.innerHTML) {
        editorRef.current.root.innerHTML = text;
        console.log('Quill content updated');
      } else {
        console.log('No update needed, content is the same');
      }
    }
  }, [text, isInitialized]);

  return (
    <>
                
      <Typography sx={{ position: 'relative', fontSize: '14px', fontFamily: 'Arial', height: 0,
                        top: 22.5, right: 13.5, letterSpacing: '-0.25px', fontWeight: '600', textAlign: 'right', display: 'flex', alignItems: 'center', justifyContent: 'flex-end' }}>
        
        <BasicTooltip title="Replace an Image">
          <span role="button" tabIndex={0}
            style={{ cursor: 'pointer', display: 'flex', alignItems: 'center' }}
            onClick={(e) => {
              e.stopPropagation();
              handleImageReplacement(lastSelectedImageDescRef.current, lastSelectedImageRef.current);
            }}
            onKeyPress={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.stopPropagation();
                handleImageReplacement(lastSelectedImageDescRef.current, lastSelectedImageRef.current);
              }
            }}
          >
            <Iconify icon={isReplacingImage ? 'line-md:loading-loop' : 'ph:images-square-light'} sx={{ mr: '7.5px', mb: '1px', height: '20px', width: '20px' }} />
          </span>
        </BasicTooltip>

        {wordCount > 1 ? `    ${wordCount} Words` : ''}
      </Typography>

      <div
        ref={quillRef}
        style={{
          width: boxWidth,
          height: boxHeight,
          marginBottom: 18,
          border: '0px solid #ccc',
          opacity: '1',
          transition: 'ease-in-out 0.3s',
        }}
      />
    </>
  );
}

BlogEditor.propTypes = {
  text: PropTypes.string.isRequired,
  setText: PropTypes.func.isRequired,
  isGenerating: PropTypes.bool,
  boxWidth: PropTypes.string,
  boxHeight: PropTypes.string,
  wordCount: PropTypes.number,
  replaceImage: PropTypes.func.isRequired,
};

export default BlogEditor;