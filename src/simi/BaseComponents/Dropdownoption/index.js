import React, { useRef, useState } from 'react';
import { ChevronDown, ChevronUp } from 'react-feather';
import { useEventListener } from '@magento/peregrine/lib/hooks/useEventListener';
require('./index.scss');

const Dropdownoption = props => {
    const [showing, setShowing] = useState(!!props.expanded);
    const dropdownRef = useRef(null);

    const handleToggle = () => {
        setShowing(!showing);
    };
    const handleClickOutside = e => {
        if (
            showing &&
            dropdownRef &&
            dropdownRef.current &&
            !dropdownRef.current.contains(e.target)
        ) {
            setShowing(false);
        }
    };

    useEventListener(globalThis, 'mousedown', handleClickOutside);
    useEventListener(globalThis, 'keydown', handleClickOutside);

    return (
        <div
            role="presentation"
            className={`dropdownoption ${props.className || ''} ${showing &&
                'showing'}`}
            ref={dropdownRef}
        >
            <div
                role="presentation"
                className="dropdownoption-title"
                onClick={() => handleToggle()}
            >
                <div className="dropdown-title">{props.title}</div>
                {showing ? <ChevronUp size={22} /> : <ChevronDown size={22} />}
            </div>
            <div
                className="dropdownoption-inner"
                style={{ display: showing ? 'block' : 'none' }}
            >
                {props.children}
            </div>
        </div>
    );
};
export default Dropdownoption;
