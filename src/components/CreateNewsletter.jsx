import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Button, Dialog, DialogContent, Typography, Stack, IconButton } from '@mui/material';
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
            height: '627px',
            minWidth: '1086px',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -55%)',
            padding: 20,
          },
        }}
      >
        <DialogContent>
          <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 2 }}>
            <Typography
              sx={{
                fontFamily: 'DM Serif Display',
                lineHeight: '55px',
                userSelect: 'none',
                letterSpacing: '-0.25px',
                fontWeight: 800,
                fontSize: '35.75px',
              }}
            >
                Newsletter Created
            </Typography>
            <IconButton onClick={handleDownload}>
              <Iconify icon="material-symbols:download" width={24} height={24} />
            </IconButton>
          </Stack>
          <Editor text={newsletterContent} setText={setNewsletterContent} />
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
