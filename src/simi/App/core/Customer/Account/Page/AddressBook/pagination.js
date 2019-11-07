import React from 'react';
import PropTypes from 'prop-types';

class Pagination extends React.Component {

    static defaultProps = {
        hideOnSinglePage: false,
        className: '',
        onChange: ()=>{},
        dispatch: ()=>{},
        current: 1,
        pageNumber: 5,
        pageSize: 10,
        pageSizeOptions: [5, 10, 15, 20],
        showSizeOptions: true,
        showPrevNext: true,
        showJumper: true,
        showInfo: true,
        prevIcon: ()=>{return '<'},
        nextIcon: ()=>{return '>'},
        jumpPrevIcon: ()=>{return '...'},
        jumpNextIcon: ()=>{return '...'},
        style: {},
        dataItems: []
    }

    static propTypes = {
        hideOnSinglePage: PropTypes.bool,
        className: PropTypes.string,
        onChange: PropTypes.func,
        dispatch: PropTypes.func,
        current: PropTypes.number,
        pageNumber: PropTypes.number,
        pageSize: PropTypes.number,
        pageSizeOptions: PropTypes.arrayOf(PropTypes.number),
        showSizeOptions: PropTypes.bool,
        showPrevNext: PropTypes.bool,
        showJumper: PropTypes.bool,
        showInfo: PropTypes.bool,
        prevIcon: PropTypes.oneOfType([PropTypes.func, PropTypes.node]),
        nextIcon: PropTypes.oneOfType([PropTypes.func, PropTypes.node]),
        jumpPrevIcon: PropTypes.oneOfType([PropTypes.func, PropTypes.node]),
        jumpNextIcon: PropTypes.oneOfType([PropTypes.func, PropTypes.node]),
        style: PropTypes.object,
        dataItems: PropTypes.array
    }
    
    constructor(props) {
        super(props);

        let current = props.current;
        let pageSize = props.pageSize;
        let allPages = this.calculatePageNumber();
        let prevPage = current - 1 > 0 ? current - 1 : 1;
        let nextPage = current + 1 < allPages ? current + 1 : allPages;
        const { pageFrom, pageTo }  = this.calculatePageFromTo(current, pageSize)

        this.state = {
            current,
            pageSize,
            allPages,
            prevPage,
            nextPage,
            pageTo,
            pageFrom
        };
        
        this.newState = {...this.state}
    }

    componentWillMount() {
        const props = this.props;
        const {items} = this.getItems();
        props.dispatch({items: items});
    }

    calculatePageNumber() {
        const total = this.props.dataItems.length
        let pageSize = this.props.pageSize
        if (this.state && this.state.hasOwnProperty('pageSize')) {
            pageSize = this.newState.pageSize
        }
        return (Math.ceil(total / pageSize));
    }

    calculatePageFromTo(current, pageSize) {
        let pageTo  = current * pageSize
        let pageFrom = (pageTo - pageSize) < 1 ? 1 : (pageTo - pageSize + 1)
        return {pageFrom, pageTo}
    }

    gotoPage = (p) => {
        const newState = this.dispatchChangeEvent({current: p});
        this.setState(newState);
    }

    optionsHandle = (e) => {
        let size = parseInt(e.target.value);
        this.newState = {...this.newState, ...{pageSize: size}}
        let allPages = this.calculatePageNumber();
        this.newState = {...this.newState, ...{allPages: allPages}}
        let nextState = this.dispatchChangeEvent(this.newState);
        this.newState = nextState;
        this.setState(nextState);
    }

    getItems(newState) {
        const { dataItems } = this.props
        let nextState = this.state
        if (typeof newState !== 'undefined') {
            nextState = newState
        }
        const { current, pageSize} = nextState
        const { pageFrom, pageTo }  = this.calculatePageFromTo(current, pageSize)
        let items = dataItems.slice(pageFrom - 1, pageTo)
        return {items, pageFrom, pageTo}
    }

    prevPage = (current) => {
        let prevPage = (current - 1) > 0 ? (current - 1) : 1;
        return prevPage;
    }

    nextPage = (current) => {
        let allPages = this.calculatePageNumber();
        let nextPage = (current + 1) < allPages ? (current + 1) : allPages;
        return nextPage;
    }

    dispatchChangeEvent = (stateChange) => {
        let newState = {...this.state, ...stateChange}
        const {items, pageFrom, pageTo} = this.getItems(newState);
        newState = {...newState, ...{pageFrom: pageFrom, pageTo: pageTo}}
        this.props.onChange(items, newState, this.props);
        this.props.dispatch({items: items});
        return newState;
    }

    renderPages() {
        const props = this.props
        const { current, allPages } = this.state
        const pageNumber = this.props.pageNumber;
        let middleNumber = Math.floor(pageNumber / 2);
        
        let calcFirstPager = current - middleNumber;
        let calcLastPager = current + middleNumber;
        let firstPager = calcFirstPager > 1 ? (calcFirstPager > allPages - pageNumber) ? (allPages - pageNumber): calcFirstPager : 1 ;
        let lastPager = calcLastPager < allPages ? (allPages > pageNumber && calcLastPager < pageNumber) ? pageNumber : calcLastPager : allPages;

        let jumpPrev = (firstPager - middleNumber) >= 1 ? firstPager - middleNumber : 1;
        let jumpNext = (lastPager + middleNumber) <= allPages ? lastPager + middleNumber : allPages;
        let prevPage = this.prevPage(current);
        let nextPage = this.nextPage(current);
        let disabledPrev = prevPage === current ? 'disabled' :'';
        let disabledNext = nextPage === current ? 'disabled' :'';

        let pages = []
        for (let i=firstPager; i<=lastPager; i++) {
            pages.push(i)
        }

        if (pages.length < 1) {
            return null
        }

        return (
            <>
            {allPages > 1 && 
                <ul>
                    {props.showPrevNext ? 
                        
                        <li className={disabledPrev}><a href="" title={`Go to page ${prevPage}`} onClick={(e)=> {this.gotoPage(prevPage); e.preventDefault()}}>{typeof props.prevIcon === 'function' ? props.prevIcon():props.prevIcon}</a></li>
                        : null
                    }
                    {props.showJumper && jumpPrev < firstPager ? 
                        <li><a href="" title={`Go to page ${jumpPrev}`} onClick={(e)=> {this.gotoPage(jumpPrev); e.preventDefault()}}>{typeof props.jumpPrevIcon === 'function' ? props.jumpPrevIcon():props.jumpPrevIcon}</a></li>
                        : null
                    }

                    {pages.map((page, index) => {
                        let activeClass = current === page ? 'active' : '';
                        return <li className={activeClass} key={index}><a href="" title={`Go to page ${page}`} onClick={(e)=> {this.gotoPage(page); e.preventDefault()}}>{page}</a></li>
                    })}

                    {props.showJumper && jumpNext > lastPager ? 
                        <li><a href="" title={`Go to page ${jumpNext}`} onClick={(e)=> {this.gotoPage(jumpNext); e.preventDefault()}}>{typeof props.jumpNextIcon === 'function' ? props.jumpNextIcon():props.jumpNextIcon}</a></li>
                        : null
                    }
                    {props.showPrevNext ? 
                        <li className={disabledNext}><a href="" title={`Go to page ${nextPage}`} onClick={(e)=> {this.gotoPage(nextPage); e.preventDefault()}}>{typeof props.nextIcon === 'function' ? props.nextIcon():props.nextIcon}</a></li>
                        : null
                    }
                </ul>
            }
            </>
        );
    }

    renderInfo() {
        const { dataItems, showInfo } = this.props
        const { current, pageSize } = this.state
        const size = dataItems.length
        const {pageFrom, pageTo} = this.calculatePageFromTo(current, pageSize)
        if (!showInfo) {
            return null
        }
        return (
            <div className="info"><span>Items {pageFrom} - {pageTo < size ? pageTo : size} of {size}</span></div>
        );
    }

    renderOptions() {
        const { pageSizeOptions, showSizeOptions } = this.props
        const { pageSize } = this.state
        if (!showSizeOptions) {
            return null
        }
        return (
            <div className="options-size">
                <span>Show</span>
                <select onChange={this.optionsHandle} value={pageSize}>
                    {
                        pageSizeOptions.map((size, index)=>{
                            return <option value={size} key={index}>{size}</option>
                        })
                    }
                </select>
                <span>per page</span>
            </div>
        );
    }

    render() {
        const props = this.props;
        return (
            <div className={props.className} style={props.style}>
                {this.renderPages()}
                {this.renderInfo()}
                {this.renderOptions()}
            </div>
        );
    }
}

export default Pagination;
