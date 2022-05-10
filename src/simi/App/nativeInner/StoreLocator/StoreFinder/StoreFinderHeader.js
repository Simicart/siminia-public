import React from "react";
import { useWindowSize } from '@magento/peregrine';
import {
    EXTRA_EXTRA_LARGE,
    EXTRA_LARGE, EXTRA_SMALL, GAMING,
    LOWER_SMALL,
    MEDIUM, OUT_OF_PAGE, OUTER_LARGE,
    PRESENTATION,
    SEMI_LARGE,
    SMALL
} from "../untils/breakpoints";

const StoreFinderHeader = (props) => {
    const upload_head_image = props ? props.upload_head_image : null;
    const title = props ? props.title : null;
    const description = props ? props.description : null;
    const upload_head_icon = props ? props.upload_head_icon : null;

    const {innerWidth: width} = useWindowSize()

    if (width < 0) {
        return (
            <div>

            </div>
        )
    }

    return (
        <div style={{}}>
            <img src={upload_head_image}
                 height={width > SEMI_LARGE ? 330 : (width > MEDIUM ? 250 : 175)}
                 width={'100%'}
                 style={{
                     display: width > SMALL ? "inherit" : 'none'
                 }}
                 alt={'Big Image'}
            />
            <div style={{
                position: width > SMALL ? "absolute" : 'static',
                marginTop: width > SEMI_LARGE ? -220 : (width > MEDIUM ? -190 : (width > SMALL ? -135 : 0)),
                paddingTop: width > SMALL ? 0 : (width > LOWER_SMALL ? 10 : 0),
                left: width > OUT_OF_PAGE ? '35%' : width > OUTER_LARGE ? '20%' : width > PRESENTATION ? '18%' : width > EXTRA_EXTRA_LARGE ? '14%' : (width > EXTRA_LARGE ? '11%' : (width > MEDIUM ? '7%' : (width > SMALL ? '10%' : '30%'))),
                backgroundImage: width > 530 ? 'none' : `url(${upload_head_image})`,
                backgroundRepeat: "no-repeat",
                backgroundSize: `${width - 60}px auto`,
                textAlign: width > SMALL ? 'start' : 'center',
                width: '100%',
                display: width > SMALL ? 'block' : (width > LOWER_SMALL ? 'table' : 'flex'),
                minHeight: 100,
                justifyContent: 'center',
                alignItems: "center"
            }}
            >
                <h3 style={{
                    color: '#555',
                    fontSize: width > GAMING ? '3.5rem' : width > SEMI_LARGE ? '3rem' : (width > MEDIUM ? '2.3rem' : (width > SMALL ? '1.6rem' : (width > LOWER_SMALL ? '1.5rem' : (width > EXTRA_SMALL ? '2rem' : '1.4rem')))),
                    fontWeight: '300',
                    font: 'normal 3rem/1.4 Arial, Helvetica, sans-serif',
                    marginTop: width > EXTRA_SMALL ? 0 : -14,
                    marginBottom: 0,
                    paddingBottom: 0
                }}>{title}</h3>
                <p style={{
                    fontSize: width > GAMING ? 22 : width > MEDIUM ? 16 : 14,
                    width: width > GAMING ? 370 : 300,
                    color: '#555',
                    font: 'normal 14px/1.4 Arial, Helvetica, sans-serif',
                    maxWidth: width > SEMI_LARGE ? "none" : (width > MEDIUM ? 250 : (width > SMALL ? 240 : 200)),
                    textAlign: width > SMALL ? "inherit" : "start",
                    verticalAlign: width > SMALL ? "baseline" : 'middle',
                    display: width > SMALL ? "inherit" : (width > LOWER_SMALL ? 'table-cell' : "none"),
                    maxHeight: width > MEDIUM ? "none" : 200
                }}>{description}</p>
            </div>
            <div style={{
                position: "absolute",
                marginTop: width > SEMI_LARGE ? -290 : (width > MEDIUM ? -220 : -160),
                right: width > OUT_OF_PAGE ? '35%' : width > OUTER_LARGE ? '20%' : width > PRESENTATION ? '18%' : width > EXTRA_EXTRA_LARGE ? '14%' : (width > EXTRA_LARGE ? '11%' : (width > MEDIUM ? '7%' : (width > SMALL ? '10%' : '30%'))),

                // right: width > EXTRA_EXTRA_LARGE ? '12%' : width > EXTRA_SEMI_LARGE ? '8.5%' : width > EXTRA_LARGE ? '8%' : (width > MEDIUM ? '6.5%' : '8.5%'),
                display: width > SMALL ? "inherit" : "none"
            }}>
                <img src={upload_head_icon}
                     width={width > SEMI_LARGE ? 270 : (width > MEDIUM ? 210 : 150)}
                     style={{
                         maxHeight: '67%',
                         height: 'auto'
                     }}
                     alt={'small-icon'}
                />
            </div>
        </div>
    )
}

export default StoreFinderHeader