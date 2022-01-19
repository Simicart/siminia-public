import React from 'react';
import {Helmet} from "react-helmet";
import Robots from "./Robots";
import { compose } from 'redux';
import { withRouter } from 'react-router-dom';

const Seo = (props) => {
    const {title, description} = props || {};
    return (
        <Helmet>
            {title &&
                <title>{title}</title>
            }
            {description &&
                <meta name="description" content={description}/>
            }
            {Robots({location: props.location, pageType: props.pageType})}
        </Helmet>
    );
}

export default compose(withRouter)(Seo);