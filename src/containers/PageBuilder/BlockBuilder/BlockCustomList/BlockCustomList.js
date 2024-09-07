import React from 'react';
import BlockContainer from '../BlockContainer';  // Make sure this path is correct.
import css from './BlockCustomList.module.css';
import myCustomIcon from '../../../../assets/search-icon.svg';

const BlockCustomList = ({ blockId, title, listItems }) => (
  <BlockContainer id={blockId} className={css.block}>
    <h3 className={css.title}>{title}</h3>
    <ul className={css.customList}>
      {listItems.map((item, index) => (
        <li key={index} className={css.customListItem}>
          <img src={myCustomIcon} alt="Custom Icon" className={css.customBullet} />
          <div>{item}</div>
        </li>
      ))}
    </ul>
  </BlockContainer>
);


export default BlockCustomList;
