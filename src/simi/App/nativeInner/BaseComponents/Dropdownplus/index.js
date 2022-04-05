import React, { useState } from 'react';
import { ChevronDown, ChevronUp } from 'react-feather';
import Addic from 'src/simi/BaseComponents/Icon/Add';
import Minusic from 'src/simi/BaseComponents/Icon/Minus';
require('./index.scss');
const Dropdownplus = props => {
    const classes = props.classes || {};
    const [showing, setShowing] = useState(!!props.expanded);

    const handleToggle = () => {
        setShowing(!showing);
    };

    return (
        <div
            role="presentation"
            className={`${classes['dropdownplus']} ${props.className}`}
        >
            <div
                role="presentation"
                className={classes['dropdownplus-title']}
                onClick={() => handleToggle()}
            >
                {props.title}
                <div
                    className={classes['dropdownplus-title-plus-ic']}
                    style={{
                        display: showing ? 'none' : 'block'
                    }}
                >
                    <ChevronDown size={22} />
                </div>
                <div
                    className={classes['dropdownplus-title-minus-ic']}
                    style={{
                        display: showing ? 'block' : 'none'
                    }}
                >
                   <ChevronUp size={22} /> 
                </div>
            </div>
            <div
                className="dropdownoption-inner"
                style={{
                    display: showing ? 'block' : 'none'
                }}
            >
                {props.children}
            </div>
        </div>
    );
};
export default Dropdownplus;
