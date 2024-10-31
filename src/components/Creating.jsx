import React, { useState, useEffect } from 'react';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import PropTypes from 'prop-types';
import { useNavigate } from 'react-router-dom';
import { Icon } from '@iconify/react';
import Iconify from 'src/components/iconify';

const Creating = ({ text, imgUrl }) => {

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
        minHeight: '600px', width: '100%', position: 'relative', marginTop: '20.5px',
        border: '0px solid black', overflow: 'hidden'
    }}>
        {/* <div style={{
            position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, minWidth: '100%',
            backgroundImage: `url(${image})`,
            backgroundSize: 'contain', backgroundRepeat: 'no-repeat', filter: 'blur(3.5px)', zIndex: 1
        }} /> */}

        <div style={{
            position: 'absolute', zIndex: 2, marginTop: -3.5,
            // height: 300, width: 800,
            backgroundColor: 'white', borderRadius: '7px', padding: '32px 57.5px 27px 25px',
            display: 'flex', flexDirection: 'row', alignItems: 'center',
            border: '0.25px solid gray', filter: 'none',
            
        }}>
            <img src='https://firebasestorage.googleapis.com/v0/b/pentra-hub.appspot.com/o/misc_images%2Fdrafts.png?alt=media&token=324937d7-e620-46c0-bb05-32f7143664d2' style={{height: 210, width: 210, marginTop: 10}} alt=''/>

            <div style={{display: 'flex', flexDirection: 'column', 
                alignItems: 'start', justifyContent: 'left', marginLeft: 30 }}>

            <p style={{fontSize: 18.5, marginBottom: 15, letterSpacing: -0.35, marginTop: -12,
              color: scolor, fontWeight: 200, textAlign: 'left', lineHeight: 2.1}}>
                {/* This is where posts appear. <br/> */}
                <strong>{text}</strong> <br/>
                Come back in ~5 minutes <br/> 
                to see everything updated.
            </p>
      
            <Button
                sx={(theme) => ({
                    width: 185, color: 'white',
                    backgroundColor: theme.palette.primary.black, 
                    '&:hover': { backgroundColor: theme.palette.primary.black, },
                    fontWeight: 600, fontSize: 16, 
                    transition: 'all 0.25s ease-out',display: 'flex', 
                    justifyContent: 'center', alignItems: 'center',
                })}
                onClick={() => {navigate('/seo');}}
                startIcon={<Iconify icon="eos-icons:three-dots-loading" height="20px" width="20px" marginRight="-1.75px" />}
            >
                Pentra is Working
            </Button>
        </div>
        </div>
    </div>
    );
};

export default Creating;

Creating.propTypes = {
    text: PropTypes.string.isRequired,
    imgUrl: PropTypes.string
};