import React from 'react'
import ExpansionPanel from "@material-ui/core/ExpansionPanel";
import ExpansionPanelSummary from "@material-ui/core/ExpansionPanelSummary";
import ExpansionPanelDetails from "@material-ui/core/ExpansionPanelDetails";
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
        <ExpansionPanel
            className={classes["harlow-expansion-panel"]}
            defaultExpanded={defaultExp}
            expanded={expandedMain === `harlow-epx-${id}`}
            onChange={handleCollapse(`harlow-epx-${id}`)}
        >
            <ExpansionPanelSummary
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
            </ExpansionPanelSummary>
            <ExpansionPanelDetails
                className={classes["harlow-expansion-content"]}
                style={{ display: "block" }}
            >
                {content}
            </ExpansionPanelDetails>
        </ExpansionPanel>
    )
}

export default classify(defaultStyle)(Expansion)