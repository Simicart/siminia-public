import React from 'react'
import LoadingSpiner from 'src/simi/BaseComponents/Loading'
import {Carousel} from 'react-responsive-carousel'
import Connection from 'src/simi/Network/SimiConnection'
import PropTypes from 'prop-types'
import Innercontent from './Innercontent'
import { withRouter } from 'react-router-dom';

class Pbpage extends React.Component {
    constructor(props) {
        super(props)
        this.state = {customer_page: null}
        if (this.props.pb_page_id)
            this.pb_page_id = this.props.pb_page_id
        else if (this.props.match && this.props.match.params && this.props.match.params.id)
            this.pb_page_id = this.props.match.params.id
    }

    handleLink = (link) => {
        if (this.props.history)
            this.props.history.push(link);
    }

    componentDidMount() {
        if (this.pb_page_id) {
            const api = window.pb_page_api || {}
            const key = parseInt(this.pb_page_id, 10)
            if(api.hasOwnProperty(key)){
                const data = api[key]
                this.setData(data)
                return;
            }
            const config = window.SMCONFIGS;
            let url = config.simicart_url
            url = url.replace('app_configs', `v2/pbpages/${this.pb_page_id}`)
            Connection.connectSimiCartServer('GET', true, this, url)
        }
        else
            console.log('No Page Builder Id')
    }

    setData(data) {
        if (data && data.pbpage) {
            this.setState({customer_page: data.pbpage})
            const api = window.pb_page_api || {}
            const key = parseInt(this.pb_page_id, 10)
            api[key] = data;
            window.pb_page_api = api
        }
    }

    /*
    Render Item
    */
    onClickItem(item, e, forceRedirect = false) {
        const browserHistory = this.props.history
        let redirected = false
        if (
            !forceRedirect && (
                item.type === "product_scroll" ||
                item.type === "product_grid"
            )
        ) {
            if (e)
                e.stopPropagation();
            return
        }
        if (item.data) {
            if (item.data.openCategoryProducts) {
                browserHistory.push(`/products.html?cat=${item.data.openCategoryProducts}`)
                redirected = true
            } else if (item.data.openCategoryChildren) {
                browserHistory.push(`/products.html?cat=${item.data.openCategoryChildren}`)
                redirected = true
            } else if (item.data.openProductDetailBySKU) {
                browserHistory.push(`/product.html?sku=${item.data.openProductDetailBySKU}`)
                redirected = true
            } else if (item.data.openUrl) {
                if (item.data.openUrl.includes('http://') || item.data.openUrl.includes('https://'))
                    window.location.href = item.data.openUrl;
                else
                    browserHistory.push(item.data.openUrl)
                redirected = true
            }
        }
        if (redirected) {
            if (e)
                e.stopPropagation()
        }
    }

    renderItem(item, children) {
        const styles = this.prepareStyle(item)
        return (
            <div
                role="presentation"
                key={`${item.root?'root':item.entity_id}`}
                onClick={e=>this.onClickItem(item, e)}
                className={`pb-item ${item.root?'pb-item-root':''} ${item.class_name?item.class_name:''} pb-item-${item.type}`}
                style={styles}
            >
                {this.renderInnerContent(item, children)}
            </div>
        )
    }

    renderInnerContent(item, children) {
        if (item.type === 'slider') {
            const slideSettings = {
                autoPlay: true,
                showArrows: true,
                showThumbs: false,
                showIndicators: (children.length && children.length !== 1)?true:false,
                showStatus: false,
                infiniteLoop: true,
                lazyLoad: true,
            };
            return (
                <Carousel {...slideSettings}>
                    {children}
                </Carousel>
            )
        }
        return (
            <React.Fragment>
                {<Innercontent item={item} onClickItem={this.onClickItem.bind(this)} handleLink={this.handleLink.bind(this)} />}
                {children.length ? children : ''}
            </React.Fragment>
        )
    }

    prepareStyle(item) {
        const defaultStyles = {
            display: 'flex',
            flexDirection: 'column',
            flexWrap: 'wrap',
        }
        let style = defaultStyles
        if (item && item.styles) {
            try {
                const itemStyle = item.styles
                if (itemStyle.widthPercent) {
                    itemStyle.width = parseInt(itemStyle.widthPercent, 10) + '%'
                    delete itemStyle.widthPercent
                }
                if (itemStyle.widthPixel) {
                    itemStyle.width = parseInt(itemStyle.widthPixel, 10) + 'px'
                    delete itemStyle.widthPixel
                }
                if (itemStyle.heightPixel) {
                    if (itemStyle.heightPixel === 'auto')
                        itemStyle.height = itemStyle.heightPixel
                    else
                        itemStyle.height = parseInt(itemStyle.heightPixel, 10) + 'px'
                    delete itemStyle.heightPixel
                }

                style = {...style, ...itemStyle}
            } catch (err) {console.log(err)}
        }
        if (item && item.type !== 'image' && item.type !== 'category') {
            if (item.data) {
                let itemData = false
                if (typeof item.data === 'string')
                    itemData = JSON.parse(item.data)
                else
                    itemData = item.data
                if (itemData && itemData.image) {
                    style.backgroundImage = `url("${itemData.image}")`
                }
            }
        }
        return style
    }



    /*
    Recursive render
    */

    recursiveRender(childrenArray) {
        const returnedItems = []
        childrenArray.map(item => {
            const children = this.recursiveRender(item.children)
            returnedItems.push(this.renderItem(item, children))
            return null
        }, this)
        return returnedItems
    }

    renderItems(itemTree) {
        const children = this.recursiveRender(itemTree.children)
        return this.renderItem({root: true}, children)
    }

    updateCustomCss(css) {
        if (window.document.getElementById('pbcustomcss'))
            $('#pbcustomcss').remove();
        $('head').append(`<style type="text/css" id="pbcustomcss">${css}</style>`);
    }

    render() {
        if (!this.state.customer_page || !this.state.customer_page.pbitems)
            return <LoadingSpiner />
        const rootItem = {
            id: 'root'
        }
        rootItem.children = this.state.customer_page.pbitems
        const itemTree = rootItem
        if (!itemTree)
            return <LoadingSpiner />

        if (this.state.customer_page.custom_css)
            this.updateCustomCss(this.state.customer_page.custom_css)
            
        return (<div className="pb-page">{this.renderItems(itemTree)}</div>)
    }
}

Pbpage.propTypes = {
    pb_page_id: PropTypes.oneOfType([
        PropTypes.number,
        PropTypes.string,
    ]),
    history: PropTypes.object.isRequired
};

export default (withRouter)(Pbpage)