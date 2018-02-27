import React from 'react';
import PropTypes from 'prop-types';

export const ColorCircle = ({ color, size = '0.6rem', className }) => {
  return (
    <div
      className={'color-circle' + (className ? ' ' + className : '')}
      style={{ backgroundColor: color, height: size, width: size, borderRadius: size }}
    />
  );
};

ColorCircle.propTypes = {
  color: PropTypes.string.isRequired,
  size: PropTypes.string,
  className: PropTypes.string,
};
