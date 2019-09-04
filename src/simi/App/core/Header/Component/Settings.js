import React from 'react'
import Identify from "src/simi/Helper/Identify";
import ClickAwayListener from '@material-ui/core/ClickAwayListener';
import Grow from '@material-ui/core/Grow';
import Popper from '@material-ui/core/Popper';
import Storeview from "src/simi/BaseComponents/Settings/Storeview";
import Currency from "src/simi/BaseComponents/Settings//Currency";
import SettingIcon from 'src/simi/BaseComponents/Icon/Settings'

class Settings extends React.Component{
    state = {
        open: false,
    };


    handleToggle = () => {
        this.setState(state => ({ open: !state.open }));
    };

    handleClose = event => {
        if (this.anchorEl.contains(event.target)) {
            return;
        }

        this.setState({ open: false });
    };

    renderSettingOptions = ()=>{
        const { open } = this.state;
        const {classes} = this.props
        const storeViewOptions = <Storeview classes={classes} className={classes['storeview-item']}/>
        const currencyOptions = <Currency classes={classes} className={classes['storeview-item']}/>
        if (!storeViewOptions && !currencyOptions)
            return false
        return (
            <Popper open={open} anchorEl={this.anchorEl}
                    placement="bottom-start"
                    transition disablePortal>
                {({ TransitionProps }) => (
                    <Grow
                        {...TransitionProps}
                        id="menu-list-grow"
                        style={{ transformOrigin:'center bottom' }}
                    >

                            <div className={classes["menu-settings"]}>
                                <ClickAwayListener onClickAway={this.handleClose}>
                                    <div className={classes["list-menu-settings"]}>
                                        <Storeview classes={classes} />
                                        <Currency classes={classes} />
                                    </div>
                                </ClickAwayListener>
                            </div>
                    </Grow>
                )}
            </Popper>
        )
    }

    render() {
        const {props} = this
        const { classes} = props
        const settingOptions = this.renderSettingOptions()
        if (!settingOptions)
            return ''
        return (
            <div style={{position:'relative'}}  ref={node => {
                this.anchorEl = node;
            }}>
                <div role="presentation" onClick={this.handleToggle}>
                    <div className={classes["item-icon"]} style={{display: 'flex', justifyContent: 'center'}}>
                        <SettingIcon style={{width: 30, height: 30, display: 'block', padding: 4}} />
                    </div>
                    <div className={classes["item-text"]} style={{whiteSpace : 'nowrap'}}>
                        {Identify.__('Settings')}
                    </div>
                </div> 
                {settingOptions}
            </div>
        );
    }
}

export default Settings;