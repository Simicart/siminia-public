import React from 'react';
import {debounce} from "../untils/debounce";
import Icon from "@magento/venia-ui/lib/components/Icon";
import {
    ChevronRight as ChevronRightIcon,
    ChevronLeft as ChevronLeftIcon,
} from 'react-feather';

import './magicChevron.css'


const SideMapToggle = (props) => {
    const setShowBody = props ? props.setShowBody : null;
    const showBody = props ? props.showBody : null;

    return (
        <div style={{
            position: "absolute",
            marginTop: 0,
            marginLeft: -30,
            // marginLeft: (width < 760 && showBody) ? 300 : 0,
            backgroundColor: "white",
            zIndex: 2,
            width: 30,
            height: 30,
            display: "flex",
            justifyContent: 'center',
            alignItems: 'center',
            border: '0.5px solid #00000050'
        }}>
            <button onClick={debounce(() => {
                setShowBody(prevState => !prevState)
            }, 100)}
                    style={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center"
                    }}
            >
                <Icon src={showBody ? ChevronLeftIcon : ChevronRightIcon}
                      size={30}
                      classes={['magic-chevron']}/>
            </button>
        </div>
    );
};

export default SideMapToggle;