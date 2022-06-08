import React from 'react';
import { PageBuilderComponent as PbComponent } from 'tapita-pagebuilder-react';
import { ProductScroll } from 'src/simi/App/core/TapitaPageBuilder/Products/scroll';
import { CategoryScroll } from 'src/simi/App/core/TapitaPageBuilder/Category/scroll';
import ProductList from 'src/simi/App/core/TapitaPageBuilder/Products/list';
import ProductGrid from 'src/simi/App/core/TapitaPageBuilder/Products/grid';
import Category from 'src/simi/App/core/TapitaPageBuilder/Category';
import { useHistory, Link } from 'react-router-dom';
import { isBot } from 'src/simi/Helper/BotDetect';
import LzL from 'src/simi/BaseComponents/LazyLoad';
import './pagebuilder.css';

const PageBuilderComponent = props => {
    const { key, endPoint, maskedId, pageData, overRender, toPreview } = props;
    const history = useHistory();
    return (
        <PbComponent
            ProductList={props => (
                <LzL>
                    <ProductList {...props} />
                </LzL>
            )}
            ProductGrid={props => (
                <LzL>
                    <ProductGrid {...props} />
                </LzL>
            )}
            ProductScroll={props => (
                <LzL>
                    <ProductScroll {...props} />
                </LzL>
            )}
            CategoryScroll={CategoryScroll}
            Category={Category}
            key={key}
            endPoint={endPoint}
            maskedId={maskedId}
            pageData={pageData}
            history={history}
            Link={Link}
            overRender={overRender}
            toPreview={toPreview}
            lazyloadPlaceHolder={isBot() ? null : <div />}
        />
    );
};

export default PageBuilderComponent;
