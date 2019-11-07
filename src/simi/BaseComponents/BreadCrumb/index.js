import React from 'react'
import ReactDom from 'react-dom'
import PropTypes from 'prop-types'
import { withRouter, Link } from 'react-router-dom';

class Breadcrumb extends React.Component{
    renderBreadcrumb = data => {
        if(data.length > 0){
            const size = data.length;
            const breadcrumb = data.map((item,key) => {
                const arrow = size === key+1 ? null : <span className="breadcrumb-arrow" style={{margin :'0 5px'}}> > </span>
                return (
                    <React.Fragment key={key}>
                        <Link to={item.link?item.link:'#'} className="breadcrumb-item">
                            {item.name}
                        </Link>
                        {arrow}
                    </React.Fragment>
                )
            },this)
            return breadcrumb
        }
    }

    renderView = () => {
        const {breadcrumb} = this.props || [];
        if(breadcrumb.length < 1) return null;
        return (
            <div className="container">
                <div className="siminia-breadcrumb">
                    {this.renderBreadcrumb(breadcrumb)}
                </div>
            </div>
        );
    }

    render() {
        if(document.getElementById('data-breadcrumb'))
            return ReactDom.createPortal(
                this.renderView(),
                document.getElementById('data-breadcrumb'),
            );
        return ''
    }
}
Breadcrumb.propTypes = {
    breadcrumb : PropTypes.array.isRequired,
    history: PropTypes.object
}

export default withRouter(Breadcrumb)
