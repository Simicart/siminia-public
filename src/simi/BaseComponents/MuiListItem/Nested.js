import React from 'react';
import PropTypes from 'prop-types';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import Collapse from '@material-ui/core/Collapse';
import ExpandLess from '@material-ui/icons/ExpandLess';
import ExpandMore from '@material-ui/icons/ExpandMore';
import Identify from 'src/simi/Helper/Identify';
import {configColor} from "src/simi/Config";

class NestedListItem extends React.Component {
    state = { open: false };

    handleClick = () => {
        this.setState(state => ({ open: !state.open }));
    };

    shouldComponentUpdate(nextProps,nextState){
        return nextState.open !== this.state.open
    }

    render() {
        const className = this.props.className?this.props.className:'';
        const primaryText = Identify.isRtl()?
            <div style={{textAlign: 'right'}}>{this.props.primarytext}</div>:
            this.props.primarytext
        
        return (
            <div>
                <ListItem
                    {...this.props}
                          button
                          className={className}
                          onClick={this.handleClick}
                >
                    {this.props.listItemIcon}
                    <ListItemText primary={primaryText}
                                  primaryTypographyProps={{
                                      style:{color:this.props.color ? this.props.color:configColor.menu_text_color}
                                  }}/>
                    {this.state.open ? <ExpandLess /> : <ExpandMore />}
                </ListItem>
                <Collapse in={this.state.open} timeout="auto" unmountOnExit>
                    <List component="div" disablePadding>
                        {this.props.children}
                    </List>
                </Collapse>
            </div>
        );
    }
}

NestedListItem.propTypes = {
    primarytext: PropTypes.oneOfType([PropTypes.string,PropTypes.object]).isRequired,
    children: PropTypes.oneOfType([PropTypes.array,PropTypes.object]).isRequired,
    className: PropTypes.string,
    listItemIcon: PropTypes.object
};


export default NestedListItem;