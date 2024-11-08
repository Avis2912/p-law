import PropTypes from "prop-types";

export default function darkerColor(hex, alpha = 0.1) {
  // Remove # if present
  hex = hex.replace('#', '');

  // Validate hex
  if (!/^([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/.test(hex)) {
    throw new Error('Invalid hex color');
  }

  // Convert 3-digit hex to 6-digit
  if (hex.length === 3) {
    hex = hex.split('').map(char => char + char).join('');
  }

  // Convert hex to RGB
  let r = parseInt(hex.substring(0, 2), 16);
  let g = parseInt(hex.substring(2, 4), 16);
  let b = parseInt(hex.substring(4, 6), 16);

  // Make darker by reducing RGB values
  r = Math.round(r * (1 - alpha));
  g = Math.round(g * (1 - alpha));
  b = Math.round(b * (1 - alpha));

  // Convert back to hex
  const darkHex = '#' + [r, g, b]
    .map(x => {
      const hex = x.toString(16);
      return hex.length === 1 ? '0' + hex : hex;
    })
    .join('');

  return darkHex;
}

darkerColor.propTypes = {
  hex: PropTypes.string.isRequired,
  alpha: PropTypes.number
};