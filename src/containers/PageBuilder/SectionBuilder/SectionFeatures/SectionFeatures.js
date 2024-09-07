import React from 'react';
import { useHistory } from 'react-router-dom';
import classNames from 'classnames';
import BlockBuilder from '../../BlockBuilder';
import SectionContainer from '../SectionContainer';
import Field, { hasDataInFields } from '../../Field';
import css from './SectionFeatures.module.css';

const iconUrl = ''; // You can set your icon URL here

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

  const history = useHistory(); // For navigation

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
              text: {
                ...block.text,
                content: block.text.content.replace(
                  /<li>/g,
                  `<li><img src="${iconUrl}" alt="icon" style="width: 16px; margin-right: 8px;" />`
                ),
              },
              ctaButton: block.ctaButton
                ? {
                    ...block.ctaButton,
                    onClick: () => {

                      handleCTAClick(block.ctaButton.text); // Apply click handler
                    },
                  }
                : null,
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
