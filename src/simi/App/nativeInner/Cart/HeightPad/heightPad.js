import React, {useMemo} from 'react';

const HeightPad = (props) => {
    const {height = 50, unit = 'px'} = props || {}

    const styleObj = useMemo(() => {
        return {
            height: `${height}${unit}`
        }
    })

    return (
        <div style={styleObj}/>
    );
};

export default HeightPad;
