import React, { useEffect } from 'react';
import resolveUrl from 'src/simi/queries/urlResolver.graphql';
import { simiUseQuery } from 'src/simi/Network/Query';
import Page404 from './Page404';

//pagebuilder import and creds
import { LazyComponent } from 'src/simi/BaseComponents/LazyComponent/';
import { usePbFinder } from 'simi-pagebuilder-react';
const endPoint = 'https://tapita.io/pb/graphql/';
const integrationToken = '14FJiubdB8n3Byig2IkpfM6OiS6RTO801622446444';
const PageBuilderComponent = props => {
    return (
        <LazyComponent
            component={() =>
                import(/* webpackChunkName: "PageBuilderComponent"*/ 'src/simi/App/core/TapitaPageBuilder/PageBuilderComponent')
            }
            {...props}
        />
    );
};

//store code
import { BrowserPersistence } from '@magento/peregrine/lib/util';
const storage = new BrowserPersistence();

const ResolveUrlResult = props => {
    const { pathname, renderByTypeAndId } = props;
    const storeCode = storage.getItem('store_view_code') || null;
    const {
        loading: pbLoading,
        pageMaskedId,
        findPage,
        pathToFind,
        pageData
    } = usePbFinder({
        endPoint,
        integrationToken,
        storeCode,
        getPageItems: true
    });

    const { data } = simiUseQuery(resolveUrl, {
        variables: {
            urlKey: pathname
        }
    });

    useEffect(() => {
        if (pathname) {
            if (!pageMaskedId || pathname !== pathToFind) findPage(pathname);
        }
    }, [pathname, pageMaskedId, pathToFind, findPage]);

    if (data) {
        if (pageMaskedId && pageMaskedId !== 'notfound') {
            return (
                <div className="pagebuilder-component-ctn">
                    <PageBuilderComponent
                        key={pageMaskedId}
                        endPoint={endPoint}
                        maskedId={pageMaskedId}
                        pageData={
                            pageData && pageData.publish_items
                                ? pageData
                                : false
                        }
                    />
                </div>
            );
        }
        if (data.urlResolver) {
            const result = renderByTypeAndId(
                data.urlResolver.type,
                data.urlResolver.id
            );
            if (result) return result;
        }
        if (pbLoading || pathname !== pathToFind) {
            return '';
        }
        return <Page404 />;
    }
    return '';
};

export default ResolveUrlResult;
