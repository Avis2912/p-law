import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Button, Dialog, DialogContent, Typography, Stack, IconButton, Box } from '@mui/material';
import Iconify from 'src/components/iconify';
import Editor from 'src/components/Editor';
import Tooltip from '@mui/material/Tooltip';
import { saveAs } from 'file-saver';
// eslint-disable-next-line import/no-relative-packages
import { generateNewsletter } from '../../functions/src/Generate/generateNewsletter';

export default function CreateNewsletter({ content, isMade = false, isExpanding = false }) {
  const [socialBtnHover, setSocialBtnHover] = useState(false);
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [newsletterContent, setNewsletterContent] = useState('');
  const [showImagePane, setShowImagePane] = useState(false);

  // Sample placeholder images - replace with your actual image URLs
  const placeholderImages = [
    'https://templated-assets.s3.amazonaws.com/public/thumbnail/d9c40e89-23b2-40ec-b570-a764e5d5e14c.webp',
    'https://templated-assets.s3.amazonaws.com/public/thumbnail/1836904a-1321-4499-adad-d3c9f5cb3a4e.webp',
    'https://templated-assets.s3.amazonaws.com/public/thumbnail/7aaa7a0d-0e9c-41a2-87cd-c6e0e942a528.webp',
    'https://templated-assets.s3.amazonaws.com/public/thumbnail/7fab5ced-03cd-4902-a684-259b65befd00.webp',
  ];

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const handleBtnClick = async () => {
    if (isLoading) return;
    setIsLoading(true);
    try {
      const generatedNewsletter = await generateNewsletter({ content });
      setNewsletterContent(generatedNewsletter);
      setIsLoading(false);
      handleOpen();
    } catch (error) {
      console.error('Error generating newsletter:', error);
      setIsLoading(false);
    }
  };

  const handleDownload = () => {
    const blob = new Blob([newsletterContent], { type: 'text/html;charset=utf-8' });
    saveAs(blob, 'newsletter.html');
  };

  const handleImageDownload = (url) => {
    fetch(url)
      .then((response) => response.blob())
      .then((blob) => {
        saveAs(blob, 'newsletter-image.jpg');
      });
  };

  const copyImageToClipboard = async (url) => {
    try {
      const response = await fetch(url);
      const blob = await response.blob();
      const item = new ClipboardItem({ 'image/png': blob });
      await navigator.clipboard.write([item]);
      // Optional: Add toast notification for success
    } catch (err) {
      console.error('Failed to copy image:', err);
      // Optional: Add toast notification for error
    }
  };

  const ImagePane = () => (
    <Box
      sx={{
        width: '40%',
        border: '1.75px solid',
        borderColor: 'divider',
        p: 3,
        transition: 'all 0.3s ease',
        height: '527px', // Match editor height
        overflowY: 'auto'
      }}
    >
      <Stack spacing={2.5}>
        <Typography variant="h5" sx={{ mb: 2, letterSpacing: '-0.35px' }}>Additional Images</Typography>
        <Box sx={{ 
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
          gap: 2,
          '& > div': {
            gridRow: 'span 1',
            '&.tall': {
              gridRow: 'span 2'
            }
          }
        }}>
          {placeholderImages.map((url, index) => {
            // Create an image element to check dimensions
            const img = new Image();
            img.src = url;
            const aspectRatio = img.height / img.width;
            const isTall = aspectRatio > 1.2;

            return (
              <Box
                key={index}
                className={isTall ? 'tall' : ''}
                sx={{
                  position: 'relative',
                  borderRadius: 1,
                  overflow: 'hidden',
                  backgroundColor: 'rgba(0,0,0,0.04)',
                  '&:hover .image-overlay': {
                    opacity: 1
                  },
                  '&:hover .image-actions': {
                    transform: 'translateY(0)',
                    opacity: 1
                  }
                }}
              >
                <Box sx={{ 
                  width: '100%', 
                  height: '100%',
                  position: 'relative',
                  '&::before': {
                    content: '""',
                    display: 'block',
                    paddingTop: `${aspectRatio * 100}%`
                  }
                }}>
                  <img 
                    src={url} 
                    alt={`Option ${index + 1}`} 
                    style={{ 
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover'
                    }} 
                  />
                </Box>
                <Box
                  className="image-overlay"
                  sx={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    bgcolor: 'rgba(0,0,0,0.45)',
                    opacity: 0,
                    transition: 'all 0.3s ease'
                  }}
                />
                <Stack
                  className="image-actions"
                  spacing={1.1}
                  sx={{
                    position: 'absolute',
                    bottom: 0,
                    left: 0,
                    right: 0,
                    p: 1.5,
                    transform: 'translateY(10px)',
                    opacity: 0,
                    transition: 'all 0.3s ease',
                    background: 'linear-gradient(to top, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0) 100%)',
                    '& button': {
                      backdropFilter: 'blur(4px)',
                      backgroundColor: 'rgba(255,255,255,0.1)',
                      color: 'white',
                      transition: 'all 0.2s ease',
                      '&:hover': {
                        backgroundColor: 'rgba(255,255,255,0.2)',
                      }
                    }
                  }}
                >
                  <Button
                    fullWidth
                    size="small"
                    startIcon={<Iconify icon="solar:copy-linear" />}
                    onClick={() => copyImageToClipboard(url)}
                    sx={{height: 34, borderRadius: '6px'}}
                  >
                    Copy Image
                  </Button>
                  <Button
                    fullWidth
                    size="small"
                    startIcon={<Iconify icon="solar:download-linear" />}
                    onClick={() => handleImageDownload(url)}
                    sx={{height: 34, borderRadius: '6px'}}
                  >
                    Download
                  </Button>
                </Stack>
              </Box>
            );
          })}
        </Box>
      </Stack>
    </Box>
  );

  return (
    <>
      {isExpanding ? (
        <Button
          size="small"
          style={{
            borderRadius: '5px',
            height: socialBtnHover ? '32px' : '30px',
            backgroundColor: '#404040',
            color: 'white',
            minWidth: '30px',
            transition: 'all 0.25s ease-out',
            width: socialBtnHover ? 'auto' : '30px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginLeft: socialBtnHover ? 5 : 5,
            paddingLeft: socialBtnHover ? '10px' : '0px',
            paddingRight: socialBtnHover ? '10px' : '0px',
          }}
          onMouseEnter={() => setSocialBtnHover(true)}
          onMouseLeave={() => setSocialBtnHover(false)}
          onClick={handleBtnClick}
        >
          <Iconify icon={isLoading ? 'line-md:loading-loop' : 'ic:baseline-email'} height="17px" width="17px" />
          {socialBtnHover && <span style={{ marginLeft: '5px' }}>Create Newsletter</span>}
        </Button>
      ) : (
        <Tooltip
          title="Create Newsletter"
          placement="top-start"
          componentsProps={{
            tooltip: {
              sx: { fontSize: 13, borderRadius: '6px', fontWeight: 400, letterSpacing: -0.35, padding: '6px 12px' },
            },
          }}
        >
          <Button
            size="small"
            style={{
              borderRadius: '5px',
              height: '38px',
              backgroundColor: '#404040',
              color: 'white',
              transition: 'all 0.25s ease-out',
              minWidth: 38,
              fontSize: 15,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
            }}
            onClick={handleBtnClick}
          >
            <Iconify icon={isLoading ? 'line-md:loading-loop' : 'ic:baseline-email'} height="17px" width="17px" />
          </Button>
        </Tooltip>
      )}

      <Dialog
        open={open}
        onClose={handleClose}
        PaperProps={{
          style: {
            position: 'absolute',
            height: '645px',
            minWidth: '1150px',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -55%)',
            padding: 20,
          },
        }}
      >
        <DialogContent sx={{ p: 1, px: 2 }}>
          <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 2, px: 2 }}>
            <Typography
              sx={{
                // fontFamily: 'DM Serif Display',
                lineHeight: '55px',
                userSelect: 'none',
                letterSpacing: '-0.75px',
                fontWeight: 800,
                fontSize: '29.75px',
                ml:-2,
                // background: 'red'
              }}
            >
              Newsletter Created
            </Typography>

            <Stack direction="row" spacing={1.75} mr={-2}>

              <Button
                variant="contained"
                startIcon={<Iconify icon="material-symbols:download" />}
                onClick={handleDownload}
                sx={{ 
                  bgcolor: (theme) => theme.palette.primary.black,
                  '&:hover': { bgcolor: (theme) => theme.palette.primary.black },
                }}
              >
                Download
              </Button>

              <Button
                variant="contained"
                startIcon={<Iconify icon="simple-icons:mailchimp" />}
                sx={{ 
                  bgcolor: '#ffca4f',
                  color: '#000',
                  '&:hover': { bgcolor: '#ffca4f' },
                }}
              >
                Integrate
              </Button>

              <Button
                variant="contained"
                startIcon={<Iconify icon={showImagePane ? 'mdi:close' : 'mdi:image-multiple'} />}
                onClick={() => setShowImagePane(!showImagePane)}
                sx={{ 
                  bgcolor: (theme) => theme.palette.primary.navBg,
                  '&:hover': { bgcolor: (theme) => theme.palette.primary.navBg },
                }}
              >
                {showImagePane ? 'Close Pane' : 'More Images'}
              </Button>

            </Stack>
          </Stack>

          <Box sx={{ display: 'flex', height: 'calc(100% - 130px)', transition: 'all 0.3s ease' }}>
            <Box sx={{ 
              flex: showImagePane ? '0 0 60%' : '1 1 100%',
              transition: 'all 0.3s ease',
              pr: showImagePane ? 2 : 0
            }}>
              <Editor text={newsletterContent} setText={setNewsletterContent} />
            </Box>
            {showImagePane && <ImagePane />}
          </Box>
        </DialogContent>
      </Dialog>
    </>
  );
}

CreateNewsletter.propTypes = {
  isMade: PropTypes.bool,
  content: PropTypes.string.isRequired,
  isExpanding: PropTypes.bool,
};
