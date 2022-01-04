import React from 'react';
import { getInternalCustomOptionValueObject } from '../../utils/getInternalCustomOptionValueObject';
import OptionLabel from '../OptionLabel/OptionLabel';
import { getOptionType } from '../../utils/getOptionType';

export const SummaryEntry = props => {
    const { children, classes, title } = props || {};
    return (
        <div className={classes.summaryItem}>
            <div
                style={{ fontWeight: '700' }}
                className={classes.summaryItemTitle}
            >
                {title}
            </div>
            <span>{children}</span>
        </div>
    );
};

export const CustomSummarySelectedList = props => {
    const { product, useProductFullDetailProps, classes = {} } = props;
    const { customOptions } = useProductFullDetailProps;

    const options = product.options;

    const content = Object.entries(customOptions)
        .sort((a, b) => a[0] - b[0]) // sort by key
        .map(([uid, valList]) => {
            const option = options.find(option => option.uid === uid);
            const { _, prLabel } = getOptionType(option);
            const title = option.title;

            const {
                key: subOptionKey,
                value: subOptionValue
            } = getInternalCustomOptionValueObject(option);

            if (!valList) {
                return null;
            }

            if (subOptionValue instanceof Array) {
                const displayedSubOption = valList
                    .map(val =>
                        subOptionValue.find(
                            option =>
                                parseInt(option.option_type_id) ===
                                parseInt(val)
                        )
                    )
                    .map(subOption => {
                        if (subOption) {
                            return (
                                <React.Fragment
                                    key={subOptionValue.option_type_id}
                                >
                                    <span
                                        className={
                                            classes['summary-entry-statement']
                                        }
                                    >
                                        {`${1} x ${subOption.title}`}
                                    </span>
                                    {/*<OptionLabel*/}
                                    {/*    title={''}*/}
                                    {/*    type_id={'simple'}*/}
                                    {/*    item={subOption}*/}
                                    {/*    classes={classes}*/}
                                    {/*/>*/}
                                </React.Fragment>
                            );
                        } else {
                            console.warn('what is this');
                            return null;
                        }
                    });

                return (
                    <SummaryEntry key={uid} title={title} classes={classes}>
                        {displayedSubOption}
                    </SummaryEntry>
                );
            } else {
                let firstVal = 0;
                try {
                    firstVal = valList[Object.keys(valList)[0]];
                } catch (err) {
                    console.warn(err);
                }
                return (
                    <SummaryEntry key={uid} title={title} classes={classes}>
                        <span>
                            <span
                                className={classes['summary-entry-statement']}
                            >
                                {`${1} x ${firstVal}`}
                            </span>
                            {/*<OptionLabel*/}
                            {/*    title={''}*/}
                            {/*    type_id={'simple'}*/}
                            {/*    item={prLabel}*/}
                            {/*    classes={classes}*/}
                            {/*/>*/}
                        </span>
                    </SummaryEntry>
                );
            }
        });

    return (
        <div className={classes.summaryWrapper}>
            <div className="summary-content">{content}</div>
        </div>
    );
};
