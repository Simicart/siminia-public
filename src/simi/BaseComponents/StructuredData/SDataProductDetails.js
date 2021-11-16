import React from 'react';
import { Helmet } from "react-helmet";

const SDataProductDetails = props => {
    let product = props.product ? props.product : {};
    let ratingSum;
    if (product.rating_summary && product.review_count) {
        ratingSum = product.rating_summary * 5 / 100;
        ratingSum = ratingSum.toString();
        ratingSum = {
            "@type": "AggregateRating",
            "ratingValue": ratingSum,
            "reviewCount": product.review_count.toString()
        }
    }
    const ldJson = {
        "@context": "https://schema.org/",
        "@type": "Product",
        name: product.name,
        "image": [
            (product.small_image && product.small_image.url) ? product.small_image.url : ''
        ],
        description: product.description,
        sku: product.sku,
        aggregateRating: ratingSum,
    }
    return (
        <Helmet>
            <script type="application/ld+json">
                {JSON.stringify(ldJson)}
            </script>
        </Helmet>
    );
}

export default SDataProductDetails;