import React from 'react';
import ReactDom from 'react-dom';
import PropTypes from 'prop-types';
import { withRouter } from 'src/drivers';
import Identify from 'src/simi/Helper/Identify';
import * as Constants from 'src/simi/Config/Constants';

class BreadCrumb extends React.Component {

    state = {}

    static getDerivedStateFromProps(props, state) {
        const { breadcrumb, location } = props || [];
        // fix bug product detail breadcrumb back link to category
        if (breadcrumb && breadcrumb.length) {
            let last = breadcrumb[breadcrumb.length - 1];
            if (last && !last.link) {
                last.link = location.pathname;
            }
        }
        Identify.storeDataToStoreage(Identify.SESSION_STOREAGE, Constants.BREADCRUMBS, breadcrumb);
        return state;
    }

    renderBreadcrumb = data => {
        const { history, children } = this.props
        if (data.length > 0) {
            const size = data.length;
            const breadcrumb = data.map((item, key) => {
                const action = item.link ? () => history.push(item.link) : () => { } //fix for last breadcrumb has link
                const arrow = size === key + 1 ? null : <span className="breadcrumb-arrow"> {'>'} </span>
                let name = item.name.split(' ');
                name = name.map((word) => (word.charAt(0).toUpperCase() + word.toLowerCase().slice(1))).join(' ');
                return (
                    <React.Fragment key={key}>
                        <span role="presentation" className="breadcrumb-item" onClick={() => action()} onKeyUp={() => action()}>
                            {Identify.__(name)}
                        </span>
                        {arrow}
                    </React.Fragment>
                )
            }, this)
            if (children) {
                breadcrumb.push(
                    <React.Fragment key={children}>
                        <span className="breadcrumb-arrow"> {'>'} </span>
                        <span role="presentation" className="breadcrumb-item">
                            {Identify.__(children)}
                        </span>
                    </React.Fragment>
                );
            }
            return breadcrumb;
        }
    }

    renderView = () => {
        const { breadcrumb } = this.props || [];
        if (breadcrumb.length < 1) return null;
        return (
            <div className="container">
                <div className="siminia-breadcrumb">
                    {this.renderBreadcrumb(breadcrumb)}
                </div>
            </div>
        );
    }

    render() {
        if (document.getElementById('data-breadcrumb'))
            return ReactDom.createPortal(
                this.renderView(),
                document.getElementById('data-breadcrumb'),
            );
        return '';
    }
}
BreadCrumb.propTypes = {
    breadcrumb: PropTypes.array.isRequired,
    history: PropTypes.object
}

export default withRouter(BreadCrumb)
