import React from 'react'
import { Accordion, AccordionSummary, AccordionDetails } from '@material-ui/core'
import Minus from "src/simi/BaseComponents/Icon/Minus";
import Add from "src/simi/BaseComponents/Icon/Add";
import classify from 'src/classify';
import defaultStyle from './style.css';

const Expansion = props => {
    const {classes, id, title, content, icon_color, expanded, defaultExpand} = props;
    const defaultExp = (defaultExpand !== null && id === defaultExpand) ? true: false;
    const expandedMain = (defaultExpand !== null && id === defaultExpand) ? `harlow-epx-${defaultExpand}` : expanded;
    const handleCollapse = panel => (event, expanded) => {
        props.handleExpand(expanded ? panel : false);
    };

    return (
        <Accordion
            className={classes["harlow-expansion-panel"]}
            defaultExpanded={defaultExp}
            expanded={expandedMain === `harlow-epx-${id}`}
            onChange={handleCollapse(`harlow-epx-${id}`)}
        >
            <AccordionSummary
                className={classes["harlow-expansion-heading"]}
                expandIcon={
                    expandedMain === `harlow-epx-${id}` ? (
                        <Minus className={classes["minus-expand"]}
                            style={{ color: icon_color ? icon_color : "#333132", fill: icon_color ? icon_color: "#333132" }}
                        />
                    ) : (
                        <Add className={classes["add-expand"]}
                            style={{ color: icon_color ? icon_color : "#333132", fill: icon_color ? icon_color: "#333132" }}
                        />
                    )
                }
            >
                {title}
            </AccordionSummary>
            <AccordionDetails
                className={classes["harlow-expansion-content"]}
                style={{ display: "block" }}
            >
                {content}
            </AccordionDetails>
        </Accordion>
    )
}

export default classify(defaultStyle)(Expansion)