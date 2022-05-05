import React, { Fragment } from 'react';
import ReactHtmlParser from 'react-html-parser';
import { SubCategories } from '../components/MenuTree';

const isMath = data => /child_categories_content/.test(data);

const checkParentNode = (node, checkFn) =>
  node.type === 'tag' &&
  node.name === 'p' &&
  node.children.some(child => checkFn(child.data));

export default function amMegaMenuRenderer({
  html,
  classes,
  level,
  items,
  hideCategories,
  column_count,
  view
}) {
  // Even if empty, render a div with no content, for styling purposes.
  if (!html) {
    return null;
  }

  const options = {
    decodeEntities: true,
    transform: (node, id) => {
      if (checkParentNode(node, isMath) || isMath(node.data)) {
        return !hideCategories ? (
          <div
            key={id}
            className={[classes.root, classes.extendRoot].join(' ')}
          >
            <SubCategories
              items={items}
              level={level}
              view={view}
              column_count={column_count}
            />
          </div>
        ) : null;
      }
    }
  };

  const content = ReactHtmlParser(html, options);
  console.log("content",content)
  const isEmptyContent =
    !Array.isArray(content) || content.every(node => !node);

  return (
    <Fragment>
      {!isEmptyContent && (level === 1 || hideCategories) && (
        <div className={[classes.root, classes.extendRoot].join(' ')}>
          {content}
        </div>
      )}
    </Fragment>
  );
}
