import ReactQuill from 'react-quill';
import "react-quill/dist/quill.snow.css"; // import styles
import PropTypes from 'prop-types';
import './Editor.css'; // replace with the path to your CSS file

// ----------------------------------------------------------------------

export default function BlogEditor({ text, setText, isGenerating, boxWidth, boxHeight }) {

    const Font = ReactQuill.Quill.import("formats/font");
    Font.whitelist = ["serif", "arial", "courier", "comic-sans"]; // Add more fonts here
    ReactQuill.Quill.register(Font, true);
    
    const Size = ReactQuill.Quill.import("formats/size");
    Size.whitelist = ["small", "medium", "large", "huge"]; // Add more sizes here
    ReactQuill.Quill.register(Size, true);
    
    const modules = {
      toolbar: [
        // [{ font: Font.whitelist }],
        [{ size: Size.whitelist }],
        ["bold", "italic", "underline"],
        [{ list: "ordered" }, { list: "bullet" }],
        ["link"],
      ],
    };
        
    return (

        <ReactQuill 
        value={text}
        // value={`<p><span style="font-family: serif">${text}</span></p>`}
        modules={modules}
        theme='snow'
        onChange={setText}
        // formats={["font", "size", "bold", "italic", "underline", "list", "bullet", "link"]}
        style={{ 
        width: boxWidth, 
        height: boxHeight,  
        marginBottom: '58px', 
        border: '0px solid #ccc',
        borderRadius: '0px', 
        backgroundColor: isGenerating ? 'white' : 'white',
        opacity: '1',
        fontFamily: 'serif', // Set font family to serif
        transition: 'ease-in-out 0.3s',
        // ...loadingAnimation
        }}
        />

    );
}

BlogEditor.propTypes = {
    text: PropTypes.node.isRequired,
    setText: PropTypes.func.isRequired,
    isGenerating: PropTypes.bool,
    boxWidth: PropTypes.string,
    boxHeight: PropTypes.string
  };