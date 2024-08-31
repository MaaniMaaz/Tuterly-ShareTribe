import React from 'react';
import css from './TopbarSearchForm.module.css';

const IconSearchDesktop = () => (
  <img
    className={css.iconSvg}
    src={require('../../../../assets/search-icon.svg').default} // Corrected path to SVG
    alt="Search"
    width="25"
    height="25"

  />
);

export default IconSearchDesktop;
