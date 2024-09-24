import React, { useEffect, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import Quill from 'quill';
import { Typography } from '@mui/material';
import 'quill/dist/quill.snow.css';
import QuillBetterTable from 'quill-better-table';
import 'quill-better-table/dist/quill-better-table.css';

Quill.register({
  'modules/better-table': QuillBetterTable
}, true);

function BlogEditor({ text, setText, isGenerating, boxWidth, boxHeight, wordCount }) {
  const quillRef = useRef(null);
  const editorRef = useRef(null);
  const [isInitialized, setIsInitialized] = useState(false);

  const cleanHtml = (html) => {
      // Remove all whitespace between tags
      html = html.replace(/>\s+</g, '><');
      // Replace empty <p> tags with <p><br></p>
      return html.replace(/<p>\s*<\/p>/gi, '<p><br></p>').trim();
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
              ['table']
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
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [setText]);

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
          top: 12.5, right: 13.5, letterSpacing: '-0.25px', fontWeight: '600', textAlign: 'right' }}>
        {wordCount > 1 ? `${wordCount} Words` : ''}
      </Typography>

      <div
        ref={quillRef}
        style={{
          width: boxWidth,
          height: boxHeight,
          marginBottom: 18,
          border: '1px solid #ccc',
          borderRadius: '4px',
          backgroundColor: isGenerating ? '#f0f0f0' : 'white',
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
};

export default BlogEditor;