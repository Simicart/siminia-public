import React from 'react';
import { render } from 'react-dom';
require('./categoryDescription.scss');
import RichContent  from '@magento/venia-ui/lib/components/RichContent';
const CategoryDescription = props => {
    const childCate = props.childCate || {};
    const description =
        childCate && childCate.description ? childCate.description : '';
    const cms_block =
        childCate && childCate.cms_block ? childCate.cms_block : null;
    const renderBlock = () => {
        if (cms_block) {
            return (
                <div className="wrapBlock">
                    <div className="titleBlock">{cms_block.title}</div>
                    <div className="content">
                        <div
                            dangerouslySetInnerHTML={{
                                __html: cms_block.content
                            }}
                        />
                    </div>
                </div>
            );
        }
        return '';
    };
    return (
        <>
            <RichContent html={description} />
            {renderBlock()}
        </>
    );
};

export default CategoryDescription;
