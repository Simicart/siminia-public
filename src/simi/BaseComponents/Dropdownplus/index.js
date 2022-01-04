import React, { useState } from 'react';
import Addic from 'src/simi/BaseComponents/Icon/Add';
import Minusic from 'src/simi/BaseComponents/Icon/Minus';

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
                    <Addic />
                </div>
                <div
                    className={classes['dropdownplus-title-minus-ic']}
                    style={{
                        display: showing ? 'block' : 'none'
                    }}
                >
                    <Minusic />
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
