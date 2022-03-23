import React, { useEffect } from 'react';
import Loading from 'src/simi/BaseComponents/Loading';
import { useQuery } from '@apollo/client';
import { RESOLVE_URL } from '@magento/peregrine/lib/talons/MagentoRoute/magentoRoute.gql';
import RsHome from '../SeoBasic/Markup/RsHome';

//import Page404 from './Page404';
const Page404 = props => {
    return (
        <LazyComponent
            component={() =>
                import(/* webpackChunkName: "Page404"*/ './Page404')
            }
            {...props}
        />
    );
};
//import Product from '../RootComponents/Product';
const Product = props => {
    return (
        <LazyComponent
            component={() =>
                import(/* webpackChunkName: "SimiProductDetails"*/ '../RootComponents/Product')
            }
            {...props}
        />
    );
};
//import CMS from 'src/simi/App/core/RootComponents/CMS';
const CMS = props => {
    return (
        <LazyComponent
            component={() =>
                import(/* webpackChunkName: "CMS"*/ 'src/simi/App/core/RootComponents/CMS')
            }
            {...props}
        />
    );
};
//import Category from 'src/simi/App/core/RootComponents/Category';
const Category = props => {
    return (
        <LazyComponent
            component={() =>
                import(/* webpackChunkName: "SimiCategory"*/ 'src/simi/App/core/RootComponents/Category')
            }
            {...props}
        />
    );
};

const TYPE_PRODUCT = 'PRODUCT';
const TYPE_CATEGORY = 'CATEGORY';
const TYPE_CMS_PAGE = 'CMS_PAGE';

//pagebuilder import and creds
import { LazyComponent } from '../../../BaseComponents/LazyComponent/';
import { usePbFinder } from 'simi-pagebuilder-react';
export const endPoint = 'https://tapita.io/pb/graphql/';
export const integrationToken = '149NbMq20jsTkleXftqn3hNh2Epj17TMV1641796505';

import PageBuilderComponent from '../TapitaPageBuilder/PageBuilderComponent';

//store code
import { BrowserPersistence } from '@magento/peregrine/lib/util';
const storage = new BrowserPersistence();

const NoMatch = props => {
    const { location } = props;
    const pathname = location.pathname;

    const storeCode = storage.getItem('store_view_code') || null;
    const pbFinderProps = usePbFinder({
        endPoint,
        integrationToken,
        storeCode
    });
    const {
        allPages,
        loading: pbLoading,
        pageMaskedId,
        findPage,
        pathToFind,
        pageData
    } = pbFinderProps;

    const { data } = useQuery(RESOLVE_URL, {
        variables: {
            url: pathname
        },
        skip: !pathname || pathname === '/',
        fetchPolicy: 'cache-first'
    });

    useEffect(() => {
        if (pathname) {
            if (!pageMaskedId || pathname !== pathToFind) findPage(pathname);
        }
    }, [pathname, pageMaskedId, pathToFind, findPage]);

    const renderHomeSeo = () => {
        return (
            <React.Fragment>
                <RsHome type="home" />
            </React.Fragment>
        );
    };

    if (pageMaskedId && pageMaskedId !== 'notfound') {
        return (
            <div className="pagebuilder-component-ctn">
                {renderHomeSeo()}
                <PageBuilderComponent
                    key={pageMaskedId}
                    endPoint={endPoint}
                    maskedId={pageMaskedId}
                    pageData={
                        pageData && pageData.publish_items ? pageData : false
                    }
                />
            </div>
        );
    }

    if (data) {
        if (data.route && data.route.type) {
            const { type } = data.route;
            if (type === TYPE_PRODUCT)
                return (
                    <Product
                        {...{ ...props, ...data.route, ...{ pbFinderProps } }}
                    />
                );
            else if (type === TYPE_CATEGORY)
                return <Category {...{ ...props, ...data.route }} />;
            else if (type === TYPE_CMS_PAGE)
                return (
                    <React.Fragment>
                        {renderHomeSeo()}
                        <CMS {...{ ...props, ...data.route }} />
                    </React.Fragment>
                );
        } else {
            if (pbLoading || pathname !== pathToFind) {
                return '';
            }
        }
        return <Page404 />;
    }
    return <Loading />;
};
export default NoMatch;
