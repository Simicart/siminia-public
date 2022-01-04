import React, { useEffect } from 'react';
/**
 * @RootComponent
 * description = 'Basic CMS Page'
 * pageTypes = CMS_PAGE
 */

import VeniaCMS from '@magento/venia-ui/lib/RootComponents/CMS';
require('./cms.scss');

const CMS = props => {
    useEffect(() => {
        /* no jquery
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
        */
    }, []);
    return <VeniaCMS {...props} />;
};

export default CMS;
