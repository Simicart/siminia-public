import React from 'react';
import { render } from 'react-dom';
require('./categoryDescription.scss');

const CategoryDescription = props => {
    const childCate = props.childCate || {}
    const description = childCate && childCate.description ? childCate.description : '';
    const cms_block = childCate && childCate.cms_block ? childCate.cms_block : null;    
    const renderDescription = () => {
        if (description) {
            return (    
                <div
                    className='description'
                    dangerouslySetInnerHTML={{
                        __html: description
                    }}
                />
            );
        }
        return '';
    };
    const renderBlock = () => {
        if (cms_block) {
            return (
                <div className='wrapBlock'>
                    <div className='titleBlock'>
                        {cms_block.title}
                    </div>
                    <div className='content'>
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
            {renderDescription()}
            {renderBlock()}
        </>
    );
};

export default CategoryDescription;
