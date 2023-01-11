import React, { Suspense } from 'react';
import defaultClasses from './applyRP.module.css';
import LoadingIndicator from '@magento/venia-ui/lib/components/LoadingIndicator';
import customerOperations from 'src/simi/BaseComponents/RewardPoint/queries/customer.gql';
import Button from '@magento/venia-ui/lib/components/Button';
import { FormattedMessage, useIntl } from 'react-intl';
import { Section } from '@magento/venia-ui/lib/components/Accordion';
import { useStyle } from '@magento/venia-ui/lib/classify';
import { Form } from 'informed';
import { useApply } from 'src/simi/BaseComponents/RewardPoint/talons/useApply';
import { Price } from '@magento/peregrine';

const Apply = props => {
    const { useAccrodion, rewardPoint, refetchCartPage, isCheckout } = props;

    const { formatMessage } = useIntl();
    const classes = useStyle(defaultClasses, props.classes);

    const talonsProps = useApply({
        operations: {
            ...customerOperations
        },
        isCheckout,
        rewardPoint,
        refetchCartPage,
        formatMessage
    });

    const {
        isActive,
        pointSlider,
        usePoint,
        loading,
        balancePoint,
        point,
        rate,
        currency,
        handleApply,
        handleSetUsePoint
    } = talonsProps;

    if (!isActive) return null;

    const textButton = loading ? (
        <FormattedMessage id={'Loading...'} defaultMessage={'Loading...'} />
    ) : (
        <FormattedMessage id={'Apply'} defaultMessage={'Apply'} />
    );

    const inputSlider = pointSlider ? (
        <input
            type="range"
            className={classes.slider}
            min={0}
            max={point}
            step={1}
            value={usePoint}
            disabled={loading}
            onChange={handleSetUsePoint}
            onMouseUp={handleApply}
            onTouchEnd={handleApply}
        />
    ) : null;

    const content = (
        <div className={classes.root}>
            <div className={classes.point}>
                <span className={classes.title}>
                    <FormattedMessage
                        id={'Your Reward Point:'}
                        defaultMessage={'Your Reward Point:'}
                    />
                </span>
                <span className={classes.value}>{balancePoint}</span>
            </div>
            <div className={classes.rate}>
                <span className={classes.title}>
                    <FormattedMessage
                        id={'{rate} point(s) can be redeemed for'}
                        defaultMessage={'{rate} point(s) can be redeemed for'}
                        values={{ rate }}
                    />
                </span>
                <span className={classes.value}>
                    <Price value={1} currencyCode={currency} />
                </span>
            </div>
            <Form onSubmit={handleApply}>
                {inputSlider}
                <div className={classes.pointSpend}>
                    <input
                        value={usePoint}
                        onChange={handleSetUsePoint}
                        disabled={loading}
                        className={classes.input}
                    />
                    <Button priority="high" type="submit" disabled={loading}>
                        {textButton}
                    </Button>
                </div>
            </Form>
        </div>
    );

    if (useAccrodion) {
        const sesstionClasses = {
            root: classes.sectionRoot,
            title: classes.sectionTitle
        };
        if (classes.title_wrapper)
            sesstionClasses.title_wrapper = classes.title_wrapper;
        if (classes.contents_container)
            sesstionClasses.contents_container = classes.contents_container;

        return (
            <Section
                id={'reward_points'}
                title={formatMessage({
                    id: 'Apply Reward',
                    defaultMessage: 'Apply Reward'
                })}
                classes={sesstionClasses}
            >
                <Suspense fallback={<LoadingIndicator />}>{content}</Suspense>
            </Section>
        );
    }

    return content;
};

Apply.defaultProps = {
    isCheckout: false
};

export default Apply;
