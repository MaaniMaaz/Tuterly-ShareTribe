import React from 'react';
import { arrayOf, bool, node, object, shape, string } from 'prop-types';
import classNames from 'classnames';

import Field, { hasDataInFields } from '../../Field';
import BlockBuilder from '../../BlockBuilder';
import SectionContainer from '../SectionContainer';

import css from './SectionFeatures.module.css';

// SVG or image URL to be used as the icon
const iconUrl = ''; // Change this to your image or SVG path

const SectionFeatures = (props) => {
  const {
    sectionId,
    className,
    rootClassName,
    defaultClasses,
    title,
    description,
    appearance,
    callToAction,
    blocks,
    isInsideContainer,
    options,
  } = props;

  const fieldComponents = options?.fieldComponents;
  const fieldOptions = { fieldComponents };

  const hasHeaderFields = hasDataInFields([title, description, callToAction], fieldOptions);
  const hasBlocks = blocks?.length > 0;

  return (
    <SectionContainer
      id={sectionId}
      className={className}
      rootClassName={rootClassName}
      appearance={appearance}
      options={fieldOptions}
    >
      {hasHeaderFields ? (
        <header className={defaultClasses.sectionDetails}>
          <Field data={title} className={defaultClasses.title} options={fieldOptions} />
          <Field data={description} className={defaultClasses.description} options={fieldOptions} />
          <Field data={callToAction} className={defaultClasses.ctaButton} options={fieldOptions} />
        </header>
      ) : null}
      {hasBlocks ? (
        <div
          className={classNames(defaultClasses.blockContainer, css.featuresMain, {
            [css.noSidePaddings]: isInsideContainer,
          })}
        >
          <BlockBuilder
            rootClassName={css.block}
            ctaButtonClass={defaultClasses.ctaButton}
            blocks={blocks.map(block => ({
              ...block,
              // Modify block content to include an image before each list item
              text: {
                ...block.text,
                content: block.text.content.replace(/<li>/g, `<li><img src="${iconUrl}" alt="icon" style="width: 16px; margin-right: 8px;" />`)
              },
            }))}
            sectionId={sectionId}
            responsiveImageSizes="(max-width: 767px) 100vw, 568px"
            options={options}
          />
        </div>
      ) : null}
    </SectionContainer>
  );
};

export default SectionFeatures;
