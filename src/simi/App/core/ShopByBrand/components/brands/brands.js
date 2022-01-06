import React, { useMemo } from "react";
import { FormattedMessage } from 'react-intl';
import { fullPageLoadingIndicator } from '@magento/venia-ui/lib/components/LoadingIndicator';
import { useBrands } from '../../talons/useBrands';
import defaultClasses from './brands.module.css'
import Icon from '@magento/venia-ui/lib/components/Icon';
import { Search as SearchIcon } from 'react-feather';
import { Link } from "react-router-dom";
 
const Brands = props => {
    const { categoryId, categoryName } = props
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
        let currentChar = ''
        brandsList.map(
            item => {
                if (showAlphabet && (!currentChar || (currentChar !== item.default_value.toLowerCase()[0]))) {
                    currentChar = item.default_value.toLowerCase()[0];
                    brandListItems.push(
                        <div className={classes.alphabetHeader} key={`char` + currentChar}>
                            {currentChar}
                        </div>
                    );
                }
                const urlKey = '/brands/' + (item.url_key ? item.url_key : item.default_value.toLowerCase()) + '.html';
                brandListItems.push(
                    <div key={item.brand_id} className={classes.brandItem} style={{ flexBasis: `${brand_list_logo_width + 10}px` }}>
                        {
                            (displayOption === 1 || displayOption === 0) &&
                            <Link to={urlKey} >
                                <div className={classes.brandItemImageWrapper}
                                    style={{
                                        backgroundImage: `url("${item.image}")`,
                                        width: brand_list_logo_width,
                                        height: brand_list_logo_width
                                    }} ></div>
                            </Link>
                        }
                        {
                            (displayOption === 1 || displayOption === 2) &&
                            <div className={classes.brandItemInfo}>
                                <Link className={classes.brandItemLink} to={urlKey}>
                                    {item.default_value} {show_product_qty ? `(${item.product_quantity})` : ''}
                                </Link>
                                {!!(show_description && item.short_description) && <div className={classes.listItemSortDescription}>{item.short_description}</div>}
                            </div>
                        }
                    </div>
                )
            }
        )
    } else {
        brandListItems = (
            <div className={classes.brandError}>
                <FormattedMessage
                    id={'brand.NoBrandFound'}
                    defaultMessage={'No Brand Found'}
                />
            </div>
        )
    }

    const dictionaryOptions = "abcdefghijklmnopqrstuvwxyz".split('').map(
        dictionaryOption => (
            <div
                key={dictionaryOption}
                onClick={
                    () => {
                        if (availableChars.indexOf(dictionaryOption) !== -1) {
                            setStartWith(dictionaryOption)
                        }
                    }
                }
                className={`${classes.dictOption} ${(dictionaryOption === startWith) && classes.selected} ${(availableChars.indexOf(dictionaryOption) === -1) && classes.disabled}`}
                style={{
                    backgroundColor: (availableChars.indexOf(dictionaryOption) !== -1 || (dictionaryOption === startWith)) ?
                        ((brandConfiguration && brandConfiguration.color) ? brandConfiguration.color : `#0ed08e`) :
                        `white`
                }}
            >
                {dictionaryOption.toUpperCase()}
            </div>
        )
    )
    const listTitle = (brandConfiguration && brandConfiguration.brand_list_name) ? brandConfiguration.brand_list_name : `Brands`
    return (
        <div className={`${classes.brandPageRoot} container`}>
            <div className={classes.breadCrumb}>
                <Link className={classes.breadCrumbLink} to="/">{`Home`}</Link>
                <span className={classes.breadCrumbSeparator}>{`/`}</span>
                {categoryName ? (
                    <React.Fragment>
                        <Link className={classes.breadCrumbLink} to="/brand.html">{listTitle}</Link>
                        <span className={classes.breadCrumbSeparator}>{`/`}</span>
                        <span className={classes.breadCrumbText}>{categoryName}</span>
                    </React.Fragment>
                ) : <span className={classes.breadCrumbText}>{listTitle}</span>}
            </div>
            <div className={classes.brandPageHeader} style={{ backgroundColor: (brandConfiguration && brandConfiguration.color) ? brandConfiguration.color : `#0ed08e` }}>
                <div className={classes.brandPageTitle}>
                    <strong>
                        <FormattedMessage
                            id={'brand.Brands'}
                            defaultMessage={listTitle}
                        />
                    </strong>
                </div>
                <div className={classes.brandPageSearchBox}>
                    <input type="text" value={brandSearchString}
                        className={classes.brandPageSearchInput}
                        onChange={e => setBrandSearchString(e.target.value)}
                        placeholder={`Search a brand name`}
                    />
                    <div className={classes.brandPageIcon}>
                        <Icon src={SearchIcon} />
                    </div>
                    {
                        brandSearchResult.length ?
                            <div className={classes.searchResult}>
                                {brandSearchResult.map(
                                    searchItem => {
                                        return (
                                            <Link key={searchItem.brand_id}
                                                className={classes.searchItem}
                                                to={`/brand/${searchItem.url_key}.html`}>
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
                            </div> : ''
                    }
                </div>
            </div>
            <div className={classes.dictList}>
                <div
                    key="all"
                    onClick={() => setStartWith('')}
                    style={{ backgroundColor: (brandConfiguration && brandConfiguration.color) ? brandConfiguration.color : `#0ed08e` }}
                    className={`${classes.dictOption} ${!startWith && classes.selected}`}
                >{`All`}</div>
                {dictionaryOptions}
            </div>
            <div className={classes.brandListContent}>
                {brandListItems}
            </div>
        </div >
    )
}

export default Brands;