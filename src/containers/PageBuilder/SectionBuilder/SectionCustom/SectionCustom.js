import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import css from './SectionCustom.module.css';

const SectionCustom = props => {
  const { rootClassName, className } = props;
  const classes = classNames(rootClassName || css.root, className);

  return (
    <div className={classes}>
      <div className={css.sectionContent}>
        <header className={css.sectionDetails}>
          <h2 className={css.title}>How Tuterly Works</h2>
        </header>
        <div className={css.featuresMain}>
          <div className={css.block}>
            <img src={require('../../../../assets/Student.avif').default} alt="Feature 1" />
            <h3 className={css.heading}>Feature 1</h3>
            <p>Feature 1 description here.</p>
          </div>
          <div className={css.block}>
            <img src={require('../../../../assets/Teacher.avif').default} alt="Feature 2" />
            <h3 className={css.heading}>Feature 2</h3>
            <p>Feature 2 description here.</p>
          </div>
          {/* Add more blocks as needed */}
        </div>
      </div>
    </div>
  );
};

SectionCustom.propTypes = {
  rootClassName: PropTypes.string,
  className: PropTypes.string,
};

SectionCustom.defaultProps = {
  rootClassName: null,
  className: null,
};

export default SectionCustom;
