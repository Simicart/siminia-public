import React from 'react';
import TitleHelper from 'src/simi/Helper/TitleHelper';
import Identify from 'src/simi/Helper/Identify';

const PageTitle = props => {
    return (
        <React.Fragment>
            {TitleHelper.renderMetaHeader({
                title: Identify.__(props.title)
            })}
            <div className="customer-page-title">{Identify.__(props.title)}</div>
        </React.Fragment>
    )
}

export default PageTitle;
