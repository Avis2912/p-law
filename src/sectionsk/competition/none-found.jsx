import React, { useState, useEffect } from 'react';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import PropTypes from 'prop-types';
import { useNavigate } from 'react-router-dom';
import { Icon } from '@iconify/react';
import Iconify from 'src/components/iconify';

const NoneFound = ({ text, imgUrl='url(/assets/images/general/pub_bg2.png)', lower=false}) => {

    const [onHover, setOnHover] = useState(false);
    const navigate = useNavigate();
    const scolor = '#000000';

    const hexToRGBA = (hex, alpha = 1) => {
        const hexValue = hex.replace('#', '');
        const bigint = parseInt(hexValue, 16);
        /* eslint-disable no-bitwise */
        const r = (bigint >> 16) & 255;
        const g = (bigint >> 8) & 255;
        const b = bigint & 255;
        /* eslint-enable no-bitwise */
        return `rgba(${r}, ${g}, ${b}, ${alpha})`;
    };

    const [image, setImage] = useState('url(/assets/images/general/pub_bg2.png)');
    useEffect(() => {if (imgUrl) {setImage(imgUrl);}}, [imgUrl]);
  
    return (
    <div style={{
        display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'column',
        height: '200px', width: '100%', position: 'absolute', zIndex: 99999,
        border: '0px solid black', overflow: 'hidden', top: lower ? 58 : 23.5, 
    }}>
        {/* <div style={{
            position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, minWidth: '100%',
            backgroundImage: `url(${image})`,
            backgroundSize: 'contain', backgroundRepeat: 'no-repeat', filter: 'blur(3.5px)', zIndex: 1
        }} /> */}

        <div style={{
            position: 'absolute', zIndex: 2, marginTop: -3.5,  // height: 300, width: 800,
            backgroundColor: 'white', borderRadius: '3.5px', padding: '30px 47.5px 12px 15px',
            display: 'flex', flexDirection: 'row', alignItems: 'center',
            border: '0px solid gray', filter: 'none',
            
        }}>
            <img src='https://firebasestorage.googleapis.com/v0/b/pentra-hub.appspot.com/o/misc_images%2Fdrafts.png?alt=media&token=324937d7-e620-46c0-bb05-32f7143664d2'
             style={{height: 110, width: 110, marginTop: -5}} alt=''/>

            {/* <Iconify icon="bxs:bulb" height="100px" width="100px" marginRight="-1.75px" /> */}

            <div style={{display: 'flex', flexDirection: 'column', 
                alignItems: 'start', justifyContent: 'left', marginLeft: 15 }}>

            <p style={{fontSize: 15.5, letterSpacing: -0.35, marginTop: -12,
              color: scolor, fontWeight: 200, textAlign: 'left', lineHeight: 1.9}}>
                <strong>{text}</strong> <br/>
                As soon as this changes, <br/> 
                you&apos;ll see it appear here
            </p>
      
            {/* <Button
                sx={(theme) => ({
                    width: 185, color: 'white',
                    backgroundColor: theme.palette.primary.black, 
                    '&:hover': { backgroundColor: theme.palette.primary.black, },
                    fontWeight: 600, fontSize: 14, 
                    transition: 'all 0.25s ease-out',display: 'flex', 
                    justifyContent: 'center', alignItems: 'center',
                })}
                onClick={() => {navigate('/seo');}}
                startIcon={<Iconify icon="eos-icons:three-dots-loading" height="20px" width="20px" marginRight="-1.75px" />}
            >
                Pentra is Working
            </Button> */}
        </div>
        </div>
    </div>
    );
};

export default NoneFound;

NoneFound.propTypes = {
    text: PropTypes.string.isRequired,
    imgUrl: PropTypes.string,
    lower: PropTypes.bool
};