import { useState, useEffect } from "react";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import Tooltip from "@mui/material/Tooltip";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Iconify from "src/components/iconify";
import PostCard from "src/sectionsk/posts/post-card";
import Stack from "@mui/material/Stack";
import IconButton from "@mui/material/IconButton";
import Box from "@mui/material/Box";
import PropTypes from "prop-types";
import { modelKeys } from "src/genData/models";
// eslint-disable-next-line import/no-relative-packages
import { generatePosts } from "../../functions/src/Generate/generatePosts";

export default function CreateSocial({ content, isMade = false, isExpanding = false }) {
  
  const [socialBtnHover, setSocialBtnHover] = useState(false);
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [posts, setPosts] = useState(['', '', '']);
  const [isPostsMade, setIsPostsMade] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    setIsPostsMade(isMade);
  }, [isMade]);

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const handleBtnClick = async () => {
    if (isMade) {handleOpen();}
    else if (isLoading) {}
    else {
      setIsLoading(true);
      try {
        const generatedPosts = await generatePosts({
          isCreateSocial: true,
          postDescription: content,
          genPostPlatform: "LinkedIn",
          wordRange: "2-3",
          style: "Unstyled",
          isImagesOn: true,
          modelKeys: modelKeys, // Adjust these values based on your needs
          selectedModel: 1,
        });
        
        setPosts(generatedPosts.map(post => post.content));
        setIsLoading(false); setIsPostsMade(true);
        handleOpen();
      } catch (error) {
        console.error('Error generating posts:', error);
        setIsLoading(false);
      }
    }
  };

  return (
    <>
      {isExpanding ? (
        <Box sx={{ ml: 2, display: 'flex', gap: 1 }}>
          <IconButton
            size="small"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
          >
            <Iconify icon="material-symbols:edit-outline" />
          </IconButton>
          <IconButton size="small">
            <Iconify icon="material-symbols:delete-outline" />
          </IconButton>
          <Button size="small"
              style={{borderRadius: '5px', height: socialBtnHover ? '36px' : '30px', backgroundColor: '#404040',  color: 'white', minWidth: '30px', transition: 'all 0.25s ease-out',
                width: socialBtnHover ? 'auto' : '30px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginLeft: socialBtnHover ? 5 : 5,
                paddingLeft: socialBtnHover ? '10px' : '0px', paddingRight: socialBtnHover ? '10px' : '0px',
              }}
              onMouseEnter={() => setSocialBtnHover(true)}
              onMouseLeave={() => setSocialBtnHover(false)}
              onClick={() => {handleBtnClick()}}>
                <Iconify icon="mynaui:sparkles-solid" height="17px" width="17px" />
                {socialBtnHover && <span style={{ marginLeft: '5px' }}>Create Social Posts</span>}
          </Button>
        </Box>
      ) : (
        <Tooltip title="Create Social Posts" placement="top-start" componentsProps={{ tooltip: { 
          sx: { fontSize: 13, borderRadius: '6px', fontWeight: 400, letterSpacing: -0.35, padding: '6px 12px', }}}}
          slotProps={{ popper: { modifiers: [{ name: 'offset', options: { offset: [0, -5], }, },], }, }}>
          <Button size="small"
                  style={{ borderRadius: '5px', height: '38px', backgroundColor: '#404040', color: 'white', transition: 'all 0.25s ease-out',
                    minWidth: 38, fontSize: 15, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}
                  onMouseEnter={() => setSocialBtnHover(true)}
                  onMouseLeave={() => setSocialBtnHover(false)}
                  onClick={() => {handleBtnClick()}}>
            <Iconify icon={isPostsMade ? "solar:posts-carousel-horizontal-bold" : (isLoading ? "line-md:loading-twotone-loop" : "mynaui:sparkles-solid")} height="17px" width="17px" />
          </Button>
        </Tooltip>
      )}

      <Dialog open={open} onClose={handleClose}
        PaperProps={{
          style: { 
            position: 'absolute', 
            height: '627px', minWidth: '1086px',
            top: '50%', left: '50%', 
            transform: 'translate(-50%, -55%)',
            padding: 20
        }}}>
        <DialogContent>

        <Typography sx={{ fontFamily: "DM Serif Display", mb: 0, lineHeight: '55px', userSelect: 'none',
        letterSpacing: '-0.25px',  fontWeight: 800, fontSize: '35.75px', marginBottom: '25px'}}> 
        New Posts Created</Typography>

        <Stack direction="row" spacing={2} sx={{ justifyContent: 'space-between', marginBottom: '20px' }}>

          <PostCard content={posts[0]} platform="LinkedIn" index={0} />
          <PostCard content={posts[1]} platform="Facebook" index={0} />
          <PostCard content={posts[2]} platform="Instagram" index={0} />

        </Stack>

        </DialogContent>
      </Dialog>
    </>
  );
}

CreateSocial.propTypes = {
  isMade: PropTypes.bool,
  content: PropTypes.string.isRequired,
  isExpanding: PropTypes.bool,
};