import React from 'react';
import Gallery from './Gallery';
import defaultClasses from './products.css';
import Identify from 'src/simi/Helper/Identify'
import Sortby from './Sortby'
import Filter from './Filter'
import Pagination from 'src/simi/BaseComponents/Pagination'
import Loading from 'src/simi/BaseComponents/Loading'
import classify from 'src/classify';

class Products extends React.Component {

    renderFilter() {
        const {props} = this
        const { data, filterData } = props;
        if (data && data.products &&
            data.products.filters) {
            return (
                <div>
                    <Filter data={data.products.filters} filterData={filterData}/>
                </div>
            );
        }
    }

    renderLeftNavigation = (classes) => {
        const shopby = [];
        const filter = this.renderFilter();
        if (filter) {
            shopby.push(
                <div 
                    key="siminia-left-navigation-filter" 
                    className={classes["left-navigation"]} >
                    {filter}
                </div>
            );
        }
        return shopby;
    }

    renderItem = ()=>{
        const {pagination} = this
        const {history, location, currentPage, pageSize} = this.props
        if (
            pagination && 
            pagination.state && 
            pagination.state.limit && 
            pagination.state.currentPage &&
            (pagination.state.limit!==pageSize||
            pagination.state.currentPage!==currentPage)) {
                const { search } = location;
                const queryParams = new URLSearchParams(search);
                queryParams.set('product_list_limit', pagination.state.limit);
                queryParams.set('page', pagination.state.currentPage);
                history.push({ search: queryParams.toString() });
        }
    };

    renderList = (classes) => {
        const {props} = this
        const { data, pageSize, history, location, sortByData, currentPage } = props;
        const items = data ? data.products.items : null;
        if (!data)
            return <Loading />
        if (!data.products || !data.products.total_count)
            return(<div className={classes['no-product']}>{Identify.__('No product found')}</div>)
        return (
            <React.Fragment>
                <Sortby classes={classes} 
                    parent={this}
                    data={data}
                    sortByData={sortByData}
                    />
                <section className={classes.gallery}>
                    <Gallery data={items} pageSize={pageSize} history={history} location={location} />
                </section>
                <div className={classes['product-grid-pagination']} style={{marginBottom: 20}}>
                    <Pagination 
                        renderItem={this.renderItem.bind(this)}
                        itemCount={data.products.total_count}
                        limit={pageSize}
                        currentPage={currentPage}
                        itemsPerPageOptions={[12, 24, 36, 48, 60]}
                        showInfoItem={false}
                        ref={(page) => {this.pagination = page}}/>
                </div>
            </React.Fragment>
        )
    }

    render() {
        const {props} = this
        const { data, classes, title } = props;
        let itemCount = ''
        if(data && data.products && data.products.total_count){
            const text = data.products.total_count > 1 ? Identify.__('%t items') : Identify.__('%t item');
            itemCount = <div className={classes["items-count"]}>
                    {text
                        .replace('%t', data.products.total_count)}
                </div>;
        }
                
        return (
            <article className={classes.root}>
                <h1 className={classes.title}>
                    <div className={classes.categoryTitle}>{title}</div>
                </h1>
                {itemCount}
                <div className={classes["product-list-container-siminia"]}>
                    {this.renderLeftNavigation(classes)}
                    <div style={{display: 'inline-block', width: '100%'}}>
                        {this.renderList(classes)}
                    </div>
                </div>
            </article>
        );
    }
};


export default classify(defaultClasses)(Products);

