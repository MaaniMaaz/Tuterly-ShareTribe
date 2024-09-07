import React from 'react';
import SectionContainer from '../SectionContainer';
import Field from '../../Field';
import css from './SectionMyComponent.module.css';

const SectionMyComponent = (props) => {
  const { sectionId, className, rootClassName, title, description, blocks, options } = props;

  const fieldOptions = { fieldComponents: options?.fieldComponents };

  return (
    <SectionContainer
      id={sectionId}
      className={className}
      rootClassName={rootClassName}
      options={fieldOptions}
    >
      <header>
        <Field data={title} className={css.title} options={fieldOptions} />
        <Field data={description} className={css.description} options={fieldOptions} />
      </header>

      <div className={css.content}>
        {blocks?.map((block, index) => (
          <div key={index}>
            <Field data={block.text} className={css.blockText} options={fieldOptions} />
          </div>
        ))}
      </div>
    </SectionContainer>
  );
};

export default SectionMyComponent;
