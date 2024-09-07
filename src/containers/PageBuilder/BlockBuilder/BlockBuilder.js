import React from 'react';
import { arrayOf, func, node, oneOf, shape, string } from 'prop-types';

// Block components
import BlockDefault from './BlockDefault';
import BlockFooter from './BlockFooter';
import BlockSocialMediaLink from './BlockSocialMediaLink';
import BlockCustomList from './BlockCustomList';  // Import your custom block

///////////////////////////////////////////
// Mapping of block types and components //
///////////////////////////////////////////

const defaultBlockComponents = {
  defaultBlock: { component: BlockDefault },
  footerBlock: { component: BlockFooter },
  socialMediaLink: { component: BlockSocialMediaLink },
  customListBlock: { component: BlockCustomList },  // Register the custom block
};

////////////////////
// Blocks builder //
////////////////////

const BlockBuilder = props => {
  const { blocks, sectionId, options, ...otherProps } = props;

  const { blockComponents, fieldComponents } = options || {};
  const blockOptionsMaybe = fieldComponents ? { options: { fieldComponents } } : {};

  if (!blocks || blocks.length === 0) {
    return null;
  }

  const components = { ...defaultBlockComponents, ...blockComponents };

  return (
    <>
      {blocks.map((block, index) => {
        const config = components[block.blockType];
        const Block = config?.component;
        const blockId = block.blockId || `${sectionId}-block-${index + 1}`;

        if (Block) {
          return (
            <Block
              key={`${blockId}_i${index}`}
              {...block}
              blockId={blockId}
              {...blockOptionsMaybe}
              {...otherProps}
            />
          );
        } else {
          console.warn(`Unknown block type (${block.blockType}) detected inside (${sectionId}).`);
          return null;
        }
      })}
    </>
  );
};

export default BlockBuilder;
