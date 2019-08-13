/**
 * Created by codynguyen on 7/10/18.
 */
import React from 'react';
import List from '@material-ui/core/List';


function MuiList(props) {
    return (
        <List component="nav"
              {...props}>
            {props.children}
        </List>
    );
}

export default MuiList;