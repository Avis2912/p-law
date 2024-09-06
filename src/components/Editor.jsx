import React, { useEffect, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import Quill from 'quill';
import 'quill/dist/quill.snow.css';

function BlogEditor({ text, setText, isGenerating, boxWidth, boxHeight }) {
  const quillRef = useRef(null);
  const editorRef = useRef(null);
  const [content, setContent] = useState(text);

  useEffect(() => {
    if (!editorRef.current && quillRef.current) {
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

        const cleanedHtml = html
        .replace(/<p>\s*<\/p>/g, '')
        .replace(/<br>/g, '')
        .replace(/<p>\s*<\/p>$/g, '')
        // .replace(/<p><\/p>$/g, '')
        
        setContent(cleanedHtml);
        setText(cleanedHtml);
        console.log('Content changed:', cleanedHtml);


      });
    }

    return () => {
      if (editorRef.current) {
        editorRef.current.off('text-change');
      }
    };
  }, [setText]);

  useEffect(() => {
    if (editorRef.current && text !== editorRef.current.root.innerHTML) {
      editorRef.current.root.innerHTML = text;
    }
  }, [text]);

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