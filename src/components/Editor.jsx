import React, { useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import Quill from 'quill';
import 'quill/dist/quill.snow.css';

function BlogEditor({ text, setText, isGenerating, boxWidth, boxHeight }) {
  const quillRef = useRef(null);
// Existing code...
const editorRef = useRef(null);

// Add this line to create a state for the sanitized text
const [sanitizedText, setSanitizedText] = React.useState(text.replace(/<br>/g, ''));


  useEffect(() => {
    if (!editorRef.current) {
      editorRef.current = new Quill(quillRef.current, {
        theme: 'snow',
        modules: {
          toolbar: [
            ['bold', 'italic', 'underline'],
            [{ list: 'ordered' }, { list: 'bullet' }],
            ['link'],
          ],
        },
      });

      editorRef.current.on('text-change', () => {
        const html = editorRef.current.root.innerHTML;
        setText(html.replace(/<br>/g, ''));
      });
    }

    return () => {
      if (editorRef.current) {
        editorRef.current.off('text-change');
      }
    };
  }, [setText]);


useEffect(() => {
  setSanitizedText(text
    // .replace(/<br>/g, '')
    .replace(/<p>\s*<\/p>/g, ''));
  console.log('Sanitized text:', sanitizedText);
    // eslint-disable-next-line
}, [text]);

// Replace all occurrences of 'text' with 'sanitizedText' in the rest of your code
useEffect(() => {
  if (!editorRef.current) {
    editorRef.current = new Quill(quillRef.current, {
      theme: 'snow',
      modules: {
        toolbar: [
          ['bold', 'italic', 'underline'],
          [{ list: 'ordered' }, { list: 'bullet' }],
          ['link'],
        ],
      },
    });

    editorRef.current.on('text-change', () => {
      const html = editorRef.current.root.innerHTML;
      setSanitizedText(html.replace(/<br>/g, ''));
    });
  }

  return () => {
    if (editorRef.current) {
      editorRef.current.off('text-change');
    }
  };
}, [setSanitizedText]);

useEffect(() => {
  if (editorRef.current && sanitizedText !== editorRef.current.root.innerHTML) {
    editorRef.current.root.innerHTML = sanitizedText;
  }
}, [sanitizedText]);

// Existing code...

  return (
    <div
      ref={quillRef}
      style={{
        width: boxWidth,
        height: boxHeight,
        marginBottom: '58px',
        border: '0px solid #ccc',
        borderRadius: '0px',
        backgroundColor: isGenerating ? 'white' : 'white',
        opacity: '1',
        fontFamily: 'serif',
        transition: 'ease-in-out 0.3s',
      }}
    />
  );
}

BlogEditor.propTypes = {
  text: PropTypes.string.isRequired,
  setText: PropTypes.func.isRequired,
  isGenerating: PropTypes.bool,
  boxWidth: PropTypes.string,
  boxHeight: PropTypes.string,
};

export default BlogEditor;