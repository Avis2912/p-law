import React, { useEffect, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import Quill from 'quill';
import 'quill/dist/quill.snow.css';
import QuillBetterTable from 'quill-better-table';
import 'quill-better-table/dist/quill-better-table.css';

Quill.register({
  'modules/better-table': QuillBetterTable
}, true);

function BlogEditor({ text, setText, isGenerating, boxWidth, boxHeight }) {
  const quillRef = useRef(null);
  const editorRef = useRef(null);
  const [content, setContent] = useState(text);

  useEffect(() => {
    if (!editorRef.current && quillRef.current) {
      try {
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
              bindings: QuillBetterTable.keyboardBinddings
            }
          },
        });

        // Add table button to toolbar
        const toolbar = editorRef.current.getModule('toolbar');
        toolbar.addHandler('table', () => {
          const tableModule = editorRef.current.getModule('better-table');
          tableModule.insertTable(3, 2);
        });

      } catch (error) {
        console.error('Error initializing Quill:', error);
      }

      editorRef.current.on('text-change', () => {
        const html = editorRef.current.root.innerHTML;

        const cleanedHtml = html
          .replace(/<p>\s*<\/p>/g, '')
          .replace(/<br>/g, '')
          .replace(/<p>\s*<\/p>$/g, '');
        
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