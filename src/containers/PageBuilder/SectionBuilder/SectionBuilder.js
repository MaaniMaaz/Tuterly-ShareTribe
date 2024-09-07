import React from 'react';
import { arrayOf, bool, func, node, oneOf, shape, string } from 'prop-types';
import classNames from 'classnames';

// Section components
import SectionArticle from './SectionArticle';
import SectionCarousel from './SectionCarousel';
import SectionColumns from './SectionColumns';
import SectionFeatures from './SectionFeatures';
import SectionHero from './SectionHero';
import SectionFooter from './SectionFooter';
import SectionMyComponent from './SectionMyComponent'; // Import the new section component

import css from './SectionBuilder.module.css';

const DEFAULT_CLASSES = {
  sectionDetails: css.sectionDetails,
  title: css.title,
  description: css.description,
  ctaButton: css.ctaButton,
  blockContainer: css.blockContainer,
};

const defaultSectionComponents = {
  article: { component: SectionArticle },
  carousel: { component: SectionCarousel },
  columns: { component: SectionColumns },
  features: { component: SectionFeatures },
  myComponent: { component: SectionMyComponent }, // Add your new section here
  footer: { component: SectionFooter },
  hero: { component: SectionHero },
};

const SectionBuilder = (props) => {
  const { sections, options } = props;
  const { sectionComponents = {}, isInsideContainer, ...otherOptions } = options || {};

  if (!sections || sections.length === 0) {
    return null;
  }

  const components = { ...defaultSectionComponents, ...sectionComponents };
  const getComponent = (sectionType) => {
    const config = components[sectionType];
    return config?.component;
  };

  const sectionIds = [];
  const getUniqueSectionId = (sectionId, index) => {
    const candidate = sectionId || `section-${index + 1}`;
    if (sectionIds.includes(candidate)) {
      let sequentialCandidate = `${candidate}1`;
      for (let i = 2; sectionIds.includes(sequentialCandidate); i++) {
        sequentialCandidate = `${candidate}${i}`;
      }
      return getUniqueSectionId(sequentialCandidate, index);
    } else {
      sectionIds.push(candidate);
      return candidate;
    }
  };

  return (
    <>
      {sections.map((section, index) => {
        const Section = getComponent(section.sectionType);
        const isDarkTheme =
          section?.appearance?.fieldType === 'customAppearance' &&
          section?.appearance?.textColor === 'white';
        const classes = classNames({ [css.darkTheme]: isDarkTheme });
        const sectionId = getUniqueSectionId(section.sectionId, index);

        if (Section) {
          return (
            <Section
              key={`${sectionId}_i${index}`}
              className={classes}
              defaultClasses={DEFAULT_CLASSES}
              isInsideContainer={isInsideContainer}
              options={otherOptions}
              {...section}
              sectionId={sectionId}
            />
          );
        } else {
          console.warn(
            `Unknown section type (${section.sectionType}) detected using sectionName (${section.sectionName}).`
          );
          return null;
        }
      })}
    </>
  );
};

const propTypeSection = shape({
  sectionId: string,
  sectionName: string,
  sectionType: oneOf([
    'article',
    'carousel',
    'columns',
    'features',
    'myComponent', // Ensure this matches your new section type
    'hero',
    'footer',
  ]).isRequired,
});

const propTypeOption = shape({
  fieldComponents: shape({ component: node, pickValidProps: func }),
  blockComponents: shape({ component: node }),
  sectionComponents: shape({ component: node }),
  isInsideContainer: bool,
});

SectionBuilder.propTypes = {
  sections: arrayOf(propTypeSection).isRequired,
  options: propTypeOption,
};

SectionBuilder.defaultProps = {
  sections: [],
  options: null,
};

export default SectionBuilder;
