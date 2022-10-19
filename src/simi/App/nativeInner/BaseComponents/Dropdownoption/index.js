import React, { useRef, useState } from 'react';
import { ChevronDown, ChevronUp } from 'react-feather';
import { useEventListener } from '@magento/peregrine/lib/hooks/useEventListener';
import { useIntl } from 'react-intl';
require('./index.scss');

const Dropdownoption = props => {
    const [showing, setShowing] = useState(!!props.showingDropdown);
    const dropdownRef = useRef(null);
    const handleToggle = () => {
        setShowing(!showing);
    };
    const { formatMessage } = useIntl();

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
                <div className="dropdown-title">
                    {formatMessage({
                        id: 'sort by',
                        defaultMessage: 'Sort by'
                    })}
                </div>
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
