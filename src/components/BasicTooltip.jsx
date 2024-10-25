import Tooltip from "@mui/material/Tooltip";
import PropTypes from "prop-types";

export default function BasicTooltip({ title, children, end=false }) {
  return (
    <Tooltip 
      title={title} 
      placement={end ? "top-end" : "top-start" }
      componentsProps={{ 
        tooltip: { 
          sx: { 
            fontSize: 13, 
            borderRadius: '6px', 
            fontWeight: 400, 
            letterSpacing: -0.35, 
            padding: '6px 13px', 
          }
        }
      }}
      slotProps={{ 
        popper: { 
          modifiers: [{ 
            name: 'offset', 
            options: { offset: [-2.5, -5] } 
          }] 
        } 
      }}
    >
      {children}
    </Tooltip>
  );
}

BasicTooltip.propTypes = {
  title: PropTypes.string.isRequired,
  children: PropTypes.node.isRequired,
  end: PropTypes.bool,
};