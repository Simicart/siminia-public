import React from 'react'
import User from "src/simi/BaseComponents/Icon/User";
import Identify from "src/simi/Helper/Identify";
import MenuItem from '@material-ui/core/MenuItem'
import ClickAwayListener from '@material-ui/core/ClickAwayListener';
import Grow from '@material-ui/core/Grow';
import Popper from '@material-ui/core/Popper';
import { connect } from 'src/drivers';
import { withRouter } from 'react-router-dom';
import { compose } from 'redux';

class MyAccount extends React.Component{
    state = {
        open: false,
    };

    handleLink(link) {
        this.props.history.push(link)
    }

    handleToggle = () => {
        this.setState(state => ({ open: !state.open }));
    };

    handleClose = event => {
        if (this.anchorEl.contains(event.target)) {
            return;
        }

        this.setState({ open: false });
    };

    handleMenuAccount = link => {
        this.handleLink(link)
        this.handleToggle()
    }

    renderMyAccount = ()=>{
        const { open } = this.state;
        const {classes} = this.props
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

                            <div className={classes["menu-my-account"]}>
                                <ClickAwayListener onClickAway={this.handleClose}>
                                <div className={classes["list-menu-account"]}>
                                    <MenuItem className={classes["my-account-item"]} onClick={()=>this.handleMenuAccount('/account.html')}>
                                        {Identify.__('My Account')}
                                    </MenuItem>
                                    <MenuItem className={classes["my-account-item"]} onClick={()=>this.handleMenuAccount('/logout.html')}>
                                        {Identify.__('Logout')}
                                    </MenuItem>
                                </div>
                                </ClickAwayListener>
                            </div>
                    </Grow>
                )}
            </Popper>
        )
    }

    handleClickAccount = () =>{
        const {isSignedIn} = this.props
        if(isSignedIn){
            this.handleToggle()
        }else{
            this.handleLink('/login.html')
        }
    }

    render() {
        const {props} = this
        const {firstname, isSignedIn, classes} = props
        const account = firstname ? 
            <span className={classes["customer-firstname"]} style={{color:'#0F7D37'}}>
                {`Hi, ${firstname}`}
            </span>: Identify.__('Account')
        return (
            <div style={{position:'relative'}}  ref={node => {
                this.anchorEl = node;
            }}>
                <div role="presentation" onClick={this.handleClickAccount}>
                    <div className={classes["item-icon"]} style={{display: 'flex', justifyContent: 'center'}}>
                        <User style={{width: 30, height: 30, display: 'block'}} />
                    </div>
                    <div className={classes["item-text"]} style={{whiteSpace : 'nowrap'}}>
                        {account}
                    </div>
                </div> 
                {isSignedIn && this.renderMyAccount()}
            </div>
        );
    }
}


const mapStateToProps = ({ user }) => {
    const { currentUser, isSignedIn } = user;
    const { firstname, lastname } = currentUser;

    return {
        firstname,
        isSignedIn,
        lastname,
    };
}

export default compose(connect(mapStateToProps), withRouter)(MyAccount);