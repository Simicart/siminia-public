/**
 * Created by codynguyen on 7/10/18.
 */
import React from 'react';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import PropTypes from 'prop-types';
import Identify from 'src/simi/Helper/Identify';
import {configColor} from "src/simi/Config";

const MuiListItem = (props) => {
    const className = props.className?props.className:'';
    const primaryText = Identify.isRtl()?
        <div style={{textAlign: 'right'}}>{props.primarytext}</div>:
        props.primarytext;
    
    return (
        <ListItem
                {...props}
                button
                className={className}>
            <ListItemText primary={primaryText}
                          primaryTypographyProps={{
                                style:{color:props.color?props.color:configColor.menu_text_color}
                          }}/>
            {props.children}
        </ListItem>
    )
}

MuiListItem.propTypes = {
    primarytext: PropTypes.oneOfType([PropTypes.string,PropTypes.object]).isRequired,
    classes: PropTypes.object
};

export default MuiListItem;