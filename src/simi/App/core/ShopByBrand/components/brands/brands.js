import React, { useMemo, useEffect, useLayoutEffect, useRef } from "react";
import { FormattedMessage, useIntl } from 'react-intl';
import { fullPageLoadingIndicator } from '@magento/venia-ui/lib/components/LoadingIndicator';
import { useBrands } from '../../talons/useBrands';
import defaultClasses from './brands.module.css'
import { Link } from "react-router-dom";
import Identify from 'src/simi/Helper/Identify';
import Breadcrumbs from "src/simi/BaseComponents/Breadcrumbs";
import Icon from '@magento/venia-ui/lib/components/Icon';
import { Search as SearchIcon } from 'react-feather';
import { randomString } from '../../../TapitaPageBuilder/CarefreeHorizontalScroll/randomString';
import mixitup from 'mixitup';




let mixer = ''

const Brands = props => {
    const searchWrapper = useRef(null)
    const { categoryId} = props
    const {
        brandsList,
        brandsLoading,
        derivedErrorMessage,
        startWith,
        setStartWith,
        availableChars,
        brandSearchString,
        setBrandSearchString,
        brandSearchResult,
        brandConfiguration
    } = useBrands({ categoryId });
    const classes = defaultClasses;
    const { formatMessage } = useIntl();

    const color = (brandConfiguration && brandConfiguration.color) ? brandConfiguration.color : `#0ed08e`

    const handleClickOutside = (event) => {
        if (searchWrapper.current && !searchWrapper.current.contains(event.target)) {
            const resultDiv = document.querySelector('#shopbybrand-search-result')
            if(resultDiv && resultDiv.style && resultDiv.style.display !== 'none') {
                resultDiv.style.display = 'none'
            }
        }
    }

    const handleClickInput = (e) => {
        const resultDiv = document.querySelector('#shopbybrand-search-result')
        if(resultDiv && resultDiv.style && resultDiv.style.display === 'none') {
            resultDiv.style.display = 'block'
        }
    }

    const toogleClickIcon = (e) => {
        const resultDiv = document.querySelector('#shopbybrand-search-result')
        if(resultDiv && resultDiv.style) {
            if(resultDiv.style.display === 'none') {
                resultDiv.style.display = 'block'
            } else {
                resultDiv.style.display = 'none'
            }
  
        }
    }

    const handleFilter = (dictionary) => {
        document.querySelectorAll('.brand-filter').forEach((el) => {
            el.style.backgroundColor = '#fff'
            el.style.color = '#333333'
        })
        
        const filterEle = document.querySelector(`.brand-filter-${dictionary}`)
        if(filterEle) {
            filterEle.style.backgroundColor = color
            filterEle.style.color = '#fff'
        }
        const filterDictionary = dictionary === 'all' ? dictionary : `.${dictionary}`
        mixer.filter(filterDictionary)

    }

    useEffect(() => {
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            // Unbind the event listener on clean up
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    useLayoutEffect(() => {
        const brandListEl = document.querySelector('.brand-list-content');
        if (brandListEl) {
            mixer = mixitup(brandListEl, {
                controls: {
                    enable: false
                }
            });
            window.mixer = mixer;
        }
    });

    const searchResult = useMemo(() => {
        if(brandSearchResult.length) {
            return (
                <div id="shopbybrand-search-result" className={classes.searchResult}>
                    {brandSearchResult.map(
                        (searchItem, index) => {
                            return (
                                <Link key={searchItem.brand_id+index}
                                    className={classes.searchItem}
                                    to={`/brands/${searchItem.url_key}.html`}>
                                    <div className={classes.searchItemPhotoWrapper}>
                                        <img className={classes.searchItemPhoto} src={searchItem.image} alt={searchItem.default_value} />
                                    </div>
                                    <div className={classes.searchItemInfo}>
                                        <div className={classes.searchItemName} >{searchItem.default_value}</div>
                                        <div className={classes.searchItemDesc}>{searchItem.short_description}</div>
                                    </div>
                                </Link>
                            )
                        }
                    )}
                </div> 
            )
        }
        
        return null
    }, [classes, brandConfiguration, brandSearchResult]) 

    if (brandsLoading)
        return fullPageLoadingIndicator;

    if (derivedErrorMessage)
        return <div className={classes.brandError}>{derivedErrorMessage}</div>;

    let displayOption = 1; // 1 -logo and label, 0 - logo only, 2 - label only
    let brand_list_logo_height = 150;
    let brand_list_logo_width = 150;
    let showAlphabet = false;
    let show_description = false;
    let show_product_qty = false;
    if (brandConfiguration) {
        displayOption = parseInt(brandConfiguration.display_option)
        brand_list_logo_height = brandConfiguration.brand_list_logo_height ? brandConfiguration.brand_list_logo_height : 150
        brand_list_logo_width = brandConfiguration.brand_list_logo_width ? brandConfiguration.brand_list_logo_width : 150
        if (brandConfiguration.brandlist_style === 1)
            showAlphabet = true;
        if (brandConfiguration.show_description)
            show_description = true;
        if (brandConfiguration.show_product_qty)
            show_product_qty = brandConfiguration.show_product_qty
    }

    let brandListItems
    if (brandsList && brandsList.length) {
        brandListItems = []
        brandsList.map(
            (item, index) => {
                const urlKey = '/brands/' + (item.url_key ? item.url_key : item.default_value.toLowerCase()) + '.html';
                const location = {
                    pathname: urlKey,
                    state: {
                        attribute_id: item.attribute_id,
                        option_id: item.option_id,
                        brand: item
                    }
                }
                const firstChar = item.default_value.toUpperCase()[0];
                brandListItems.push(
                    <React.Fragment key={index}>
                        <div key={item.brand_id} className={`mix ${firstChar} ${classes.brandItem}`}>
                            <div className={classes.brandItemInfo} style={{width: 240}}>
                                {
                                    (displayOption === 1 || displayOption === 0) &&
                                    <Link className={classes.brandItemLink} to={location} >
                                        <span className={classes.productImageContainer} style={{width: 240}}>
                                            <span className={classes.productImageWrapper} style={{paddingBottom: '125%'}}>
                                                <img className={classes.productImagePhoto} width={brand_list_logo_width} height={brand_list_logo_width} src={item.image} alt={item.value} />
                                            </span>
                                        </span>
                                    </Link>
                                }
                                {
                                    (displayOption === 1 || displayOption === 2) &&
                                    <div className={classes.brandItemDetail}>
                                        <strong className={classes.brandItemName}>
                                            <Link className={classes.brandItemLink} to={urlKey}>
                                                {item.value || item.default_value} {show_product_qty ? `(${item.product_quantity})` : ''}
                                            </Link>
                                        </strong>
                                  
                                        {!!(show_description && item.short_description) && <div className={classes.listItemSortDescription}>{item.short_description}</div>}
                                    </div>
                                }
                            </div>
                        </div>
                        {((index + 1) % 2) === 0 && <div key={randomString(3)+index} className={classes.hr2}></div>}
                        {((index + 1) % 3) === 0 && <div key={randomString(3)+index} className={classes.hr3}></div>}
                        {((index + 1) % 4) === 0 && <div key={randomString(3)+index} className={classes.hr4}></div>}
                        {((index + 1) % 7) === 0 && <div key={randomString(3)+index} className={classes.hr7}></div>}
                        {((index + 1) % 8) === 0 && <div key={randomString(3)+index} className={classes.hr8}></div>}
                        {((index + 1) % 9) === 0 && <div key={randomString(3)+index} className={classes.hr9}></div>}
                    </React.Fragment>
                )
            }
        )
    } else {
        brandListItems = (
            <div className={classes.brandError}>
                <FormattedMessage
                    id={'brands.NoBrandFound'}
                    defaultMessage="No Brand Found"
                />
            </div>
        )
    }

    const dictionaryOptions = "abcdefghijklmnopqrstuvwxyz".split('').map(
        (dictionaryOption, index) => {
            const style = {
                color: '#777',
                opacity: '0.5',
                cursor: 'not-allowed'
            }
            if(availableChars.indexOf(dictionaryOption) !== -1) {
                style.color = '#333333'
                style.opacity = '1'
                style.cursor = 'pointer'
            }
            if(dictionaryOption === startWith) {
                style.color = '#ffffff'
                style.backgroundColor = (brandConfiguration && brandConfiguration.color) ? brandConfiguration.color : `#0ed08e`
                style.opacity = '1'
                style.cursor = 'pointer'
            }
            return (
                <div
                    key={index}
                    onClick={() => handleFilter(dictionaryOption.toUpperCase())}
                    data-filter={`.${dictionaryOption.toUpperCase()}`}
                    className={`${classes.dictOption} brand-filter brand-filter-${dictionaryOption.toUpperCase()}`}
                    style={style}
                >   <span>
                        {dictionaryOption.toUpperCase()}
                    </span>
                </div>
            )
        }
    )

    const listTitle = (brandConfiguration && brandConfiguration.brand_list_name) ? brandConfiguration.brand_list_name : `Brands`
    const breadcrumbs = [
        { 
            name: formatMessage({id: 'brands.home', defaultMessage: 'Home'}), 
            link: '/' 
        }, 
        {
            name: formatMessage({id: 'brands.brands',defaultMessage: 'Brands'}), 
        }];

    return (
        <div className={`${classes.brandPageRoot || ''} container`}>
            <div className={classes.breadCrumb}>
                <Breadcrumbs breadcrumb={breadcrumbs} history={props.history} />
            </div>
            <div className={classes.brandContainer}>
                <div className={classes.brandPageHeader} style={{ backgroundColor: (brandConfiguration && brandConfiguration.color) ? brandConfiguration.color : `#0ed08e` }}>
                    <div className={classes.brandPageTitle}>
                        <strong>
                            <FormattedMessage
                                id={'brand.Brands'}
                                defaultMessage={listTitle}
                            />
                        </strong>
                    </div>
                    <div className={classes.brandPageHeaderContent}>
                        <div className={classes.brandPageSearchBox} ref={searchWrapper}>
                            <div>
                                <input type="text" value={brandSearchString}
                                    className={`${classes.brandPageSearchInput} ${Identify.isRtl() ? classes.brandPageSearchInputRTL : ''}`}
                                    onChange={e => setBrandSearchString(e.target.value)}
                                    onClick={e => handleClickInput(e)}
                                    placeholder={formatMessage({id: 'brands.search', defaultMessage: 'Search a brand name'})}
                                />
                                <div className={classes.brandPageIcon} onClick={toogleClickIcon}>
                                    <Icon src={SearchIcon} />
                                </div>
                            </div>
                            {searchResult}
                        </div>
                    </div>
           
                </div>
                <div className={classes.dictList}>
                    <div className={classes.dictListWrapper}>
                        <div
                            onClick={() => handleFilter('all')}
                            className={`brand-filter brand-filter-all ${classes.dictOption}`}
                            key="all"
                            style={{ backgroundColor: (brandConfiguration && brandConfiguration.color) ? brandConfiguration.color : `#0ed08e`, color: "#fff"}}
                        ><span>{formatMessage({id: 'brands.all', defaultMessage: 'All'})}</span></div>
                        {dictionaryOptions}
                    </div>
                </div>
                <div className={`${classes.brandListContent} brand-list-content`}>
                    {brandListItems}
                </div>
            </div>
        </div>
    )
}

export default Brands;