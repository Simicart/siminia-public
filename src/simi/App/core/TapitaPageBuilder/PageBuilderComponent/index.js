import React from 'react';
import { PageBuilderComponent as PbComponent } from 'simi-pagebuilder-react';
import { ProductScroll } from 'src/simi/App/core/TapitaPageBuilder/Products/scroll';
import { CategoryScroll } from 'src/simi/App/core/TapitaPageBuilder/Category/scroll';
import ProductList from 'src/simi/App/core/TapitaPageBuilder/Products/list';
import ProductGrid from 'src/simi/App/core/TapitaPageBuilder/Products/grid';
import Category from 'src/simi/App/core/TapitaPageBuilder/Category';
import { useHistory, Link } from 'react-router-dom';
import Skeleton from 'react-loading-skeleton';

const PageBuilderComponent = props => {
    const { key, endPoint, maskedId, pageData } = props;
    const history = useHistory();
    return (
        <div
            style={{
                fontFamily: `"Poppins", Helvetica, Arial, sans-serif`,
                fontSize: '14px',
                lineHeight: 1.5
            }}
        >
            <style>
                @import
                url('https://fonts.googleapis.com/css2?family=Poppins:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900&display=swap');
            </style>
            <PbComponent
                ProductList={ProductList}
                ProductGrid={ProductGrid}
                ProductScroll={ProductScroll}
                CategoryScroll={CategoryScroll}
                Category={Category}
                key={key}
                endPoint={endPoint}
                maskedId={maskedId}
                pageData={pageData}
                history={history}
                Link={Link}
                lazyloadPlaceHolder={<Skeleton height="100%" width="100%" />}
            />
        </div>
    );
};

export default PageBuilderComponent;
