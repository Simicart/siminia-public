/* eslint-disable jsx-a11y/no-onchange */
/* eslint-disable prefer-const */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
import React from 'react'
import Pagination from 'src/simi/BaseComponents/Pagination'
import Identify from 'src/simi/Helper/Identify'
import Arrow from "src/simi/BaseComponents/Icon/Arrow";

class PaginationTable extends Pagination {
    constructor(props) {
        super(props)
        this.startPage = 1;
        this.endPage = this.startPage + 2;
    }

    renderColumnTitle = () => {
        let data = this.props.cols;
        if(data.length > 0){
            let columns = data.map((item, index)=>{
                return <th key={index} width={item.width?item.width: ''} >{Identify.__(item.title)}</th>
            });
            return (
                <thead>
                    <tr>
                        {columns}
                    </tr>
                </thead>
            ) 
            
        }
    }

    componentDidUpdate(prevProps){
        if(this.props.limit !== prevProps.limit){
            this.setState({limit: this.props.limit})
        }
    }

    handleChangePage =(next = true, total)=>{
        let currentPage = next ? (this.state.currentPage === total?this.state.currentPage: this.state.currentPage + 1) : (this.state.currentPage> 1 ? this.state.currentPage - 1: this.state.currentPage);
        if(currentPage > this.endPage){
            this.startPage = this.startPage + 1;
            this.endPage = this.endPage + 1;
        }else if (currentPage < this.startPage){
            this.startPage = this.startPage - 1;
            this.endPage = this.endPage - 1;
        }
        this.setState({
            currentPage : currentPage
        })
    }

    changeLimit = (e) => {
        const {setLimit} = this.props;
        setLimit(e.target.value)
    }

    renderDropDown = () => {
        return(
            <select itemType="number" className='dropdown-show-item' onChange={this.changeLimit}>
                <option value={Number(10)}>10</option>
                <option value={20}>20</option>
                <option value={30}>30</option>
            </select>
        )
    }

    renderPageNumber = (total)=> {
        // Logic for displaying page numbers
        if(!this.props.showPageNumber) return null;
        const pageNumbers = [];
        let totalItem = total;
        total =  Math.ceil(total / this.state.limit);
        let endpage = this.endPage > total ? total : this.endPage
        for (let i = this.startPage; i <= endpage; i++) {
            pageNumbers.push(i);
        }
        let obj = this;
        const renderPageNumbers = pageNumbers.map(number => {
            let active = number === obj.state.currentPage ? 'active': '';
            return (
                // eslint-disable-next-line jsx-a11y/click-events-have-key-events
                <li
                    key={number}
                    id={number}
                    onClick={(e)=>this.changePage(e)}
                    className={`'page-nums' ${active}`}
                >
                    {number}
                </li>
            );
        });
        let option_limit = [];
        if (this.props.itemsPerPageOptions)
        {
            this.props.itemsPerPageOptions.map((item, index) => {
                    option_limit.push(<option key={index} value={item} >{item}</option>);
                    return null 
                }
            );
        }
        let nextPageIcon = <Arrow style={{width: 20, height: 20, transform: 'rotate(90deg)'}}/>;
        let prevPageIcon = <Arrow style={{width: 20, height: 20, transform: 'rotate(-90deg)'}}/>;

        let pagesSelection = (total>1)?(
            <ul id="page-numbers" style={{
                border : 'none',
                padding : 0,
                display : 'flex',
                alignItems : 'center',
                fontSize : 14,
            }}>
                <li className="icon-page-number" onClick={()=>this.handleChangePage(false, total)}>{prevPageIcon}</li>
                {renderPageNumbers}
                <li className="icon-page-number" onClick={()=>this.handleChangePage(true, total)}>{nextPageIcon}</li>
            </ul>
        ):'';
        let {currentPage,limit} = this.state;
        let lastItem = currentPage * limit;
        let firstItem = lastItem - limit+1;
        lastItem = lastItem > totalItem ? totalItem : lastItem;
        let itemsPerPage = (
            <div className="icon-page-number">
                {
                    this.props.showInfoItem &&
                    <span style={{marginRight : 10,fontSize : 16}}>
                        {Identify.__('%a - %b of %c').replace('%a', firstItem).replace('%b', lastItem).replace('%c', totalItem)}
                    </span>
                }
            </div>
        );
        return (
            <div className="config-page"
                 style={{
                     display : 'flex',
                     alignItems : 'center',
                     justifyContent : 'space-between',
                     clear: 'both'
                 }}
            >
                <div style={{display:"flex", alignItems:"center"}}>
                    {itemsPerPage}
                    <div style={{display:"flex"}}>
                        {Identify.__("Show")} {this.renderDropDown()}{Identify.__(" per page")}
                    </div>
                </div>
                {pagesSelection}
            </div>
        )
    }

    renderPagination = () => {
        let {data, currentPage, limit} = this.state;
        if(data.length > 0){
            // Logic for displaying current todos
            const indexOfLastTodo = currentPage * limit;
            const indexOfFirstTodo = indexOfLastTodo - limit;
            const currentReview = data.slice(indexOfFirstTodo, indexOfLastTodo);
            let obj = this;
            const items = currentReview.map((item, key) => {
                return obj.renderItem(item, key);
            });
            let total = data.length;
            return (
                <React.Fragment>
                    <table className='col-xs-12 table-striped table-siminia'>
                        {this.renderColumnTitle()}
                        <tbody>{items}</tbody>
                    </table>
                    {this.renderPageNumber(total)}
                </React.Fragment>
            )
        }
        return <div></div>
    }

    render() {
        return this.renderPagination();
    }
}

export default PaginationTable
