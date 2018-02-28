import React from 'react';
import PropTypes from 'prop-types';
import { ColorCircle } from './color-circle';

export const Reachable = ({ reachable, ...props }) => {
  let color = reachable ? '#189e18' : '#9e1818';
  return <ColorCircle color={color} {...props} />;
};

Reachable.propTypes = {
  reachable: PropTypes.bool,
};
