import React, { useEffect } from 'react';
import LoadingSpiner from 'src/simi/BaseComponents/Loading';
import { GET_CMS_PAGE as getCmsPageQuery } from '@magento/peregrine/lib/talons/Cms/cmsPage.gql';
import Identify from 'src/simi/Helper/Identify';
import { Simiquery } from 'src/simi/Network/Query';
import { smoothScrollToView } from 'src/simi/Helper/Behavior';
import ReactHTMLParser from 'react-html-parser';
import TitleHelper from 'src/simi/Helper/TitleHelper';

require('./cms.scss');

const CMS = props => {
    console.log(props);
    const { id } = props;

    const variables = {
        id,
        onServer: true
    };
    smoothScrollToView($('#root'));

    useEffect(() => {
        $(document).ready(function() {
            $('.readmore-next-content').on('click', function() {
                $(this).hide();
                $(this)
                    .next('.hidden-content')
                    .show(250);
            });

            // term and condition page
            $('.term-and-condition-page .page-content > ul').on(
                'click',
                function() {
                    console.log('run');
                    $(this)
                        .find('ul')
                        .slideToggle();
                }
            );

            $('.term-and-condition-page .page-content > ul > li > ul').on(
                'click',
                function(event) {
                    event.stopPropagation();
                }
            );
        });
    }, []);

    return (
        <Simiquery query={getCmsPageQuery} variables={variables}>
            {({ loading, error, data }) => {
                if (error) return <div>Data Fetch Error</div>;
                if (!data || loading) return <LoadingSpiner />;
                return (
                    <div className="container">
                        {TitleHelper.renderMetaHeader({
                            title: data.cmsPage.meta_title
                                ? data.cmsPage.meta_title
                                : data.cmsPage.title,
                            description: data.cmsPage.meta_description
                                ? data.cmsPage.meta_description
                                : ''
                        })}
                        <div className="static-page international-page">
                            {data.cmsPage && data.cmsPage.content
                                ? ReactHTMLParser(data.cmsPage.content)
                                : Identify.__('Not found content')}
                        </div>
                    </div>
                );
            }}
        </Simiquery>
    );
};

export default CMS;
