import React, {useEffect} from 'react';
import { useWindowSize } from '@magento/peregrine';
import {EXTRA_SEMI_SEMI_LARGE, UPPER_MEDIUM} from "../../untils/breakpoints";

import {useAnimatePresence} from "use-animate-presence";

const variants = {
    // x: {from: -800, to: 0},
    opacity: {from: 0, to: 1},
};


const FilterRadiusSidebar = (props) => {
    const showLeftFilter = props ? props.showLeftFilter : null;
    const setShowLeftFilter = props ? props.setShowLeftFilter : null;
    const filter_radius = props ? props.filter_radius : null;
    const setCurrentFilter = props ? props.setCurrentFilter : null;
    const distanceUnit = props ? props.distanceUnit : null;

    const {innerWidth: width} = useWindowSize()

    const animatedDiv = useAnimatePresence({
        variants,
        initial: "hidden",
        debugName: 'filter_sidebar',
        duration: 100,
    });

    useEffect(() => {
        if (showLeftFilter && animatedDiv && !animatedDiv.isRendered) {
            animatedDiv.togglePresence()
        }
    }, [showLeftFilter, animatedDiv])

    const content = animatedDiv.isRendered ? (
        <div ref={animatedDiv.ref}
             style={{
                 height: 550,
                 // display: showLeftFilter ? 'block' : 'none',
                 position: 'absolute',
                 backgroundColor: 'white',
                 zIndex: 2,
                 border: '1px solid #00000040',
                 paddingRight: 7,
                 paddingTop: 7,
                 width: width > EXTRA_SEMI_SEMI_LARGE ? Math.min(390, (width * 3 * 976) / ((3.2 + 6) * 1000)) : width > UPPER_MEDIUM ? Math.max(383, (width * 3) / (3.2 + 6) - 2) : 300,
             }}
        >
            <button
                onClick={() => {
                    setShowLeftFilter(false);
                    animatedDiv.togglePresence();
                }}
                style={{float: "right"}}
            >
                {'x'}
            </button>

            <div style={{
                marginTop: 30,
                marginLeft: 30
            }}>
                <label htmlFor={'radius'}
                       style={{fontWeight: "bold", marginRight: 10}}
                >Filter Radius</label>

                <select name="radius" id="radius" onChange={e => setCurrentFilter(e.target.value)}>
                    <option key={'default'} value={'default'}>{'Default'}</option>
                    {!!filter_radius && (filter_radius.split(',')).map(rad => {
                        return (
                            <option key={rad} value={rad}>{`${rad} ${distanceUnit}`}</option>
                        )
                    })}
                </select>
            </div>
        </div>
    ) : <div/>

    return (
        <>
            {content}
        </>
    )
};

export default FilterRadiusSidebar;