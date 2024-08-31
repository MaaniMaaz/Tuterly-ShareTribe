import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import css from './Topbar.module.css';

const SearchIcon = (props) => {
  const { className, rootClassName } = props;
  const classes = classNames(rootClassName || css.rootSearchIcon, className);

  return (
    <img
      className={classes}
      src={require('../../../assets/search-icon.svg').default} // Updated path to the SVG file in the assets directory
      alt="Search"
      width="25" // Adjust the width as needed
      height="25" // Adjust the height as needed
    />
  );
};

const { string } = PropTypes;

SearchIcon.defaultProps = {
  className: null,
  rootClassName: null,
};

SearchIcon.propTypes = {
  className: string,
  rootClassName: string,
};

export default SearchIcon;
