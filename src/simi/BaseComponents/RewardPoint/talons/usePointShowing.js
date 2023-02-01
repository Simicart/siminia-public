import { useMemo } from 'react';
import { useQuery } from '@apollo/client';
import { useUserContext } from '@magento/peregrine/lib/context/user';
import {
    getRewardPointIcon,
    getRewardPointMessRegister,
    getRewardPointSubscrible,
    getRewardPointProductReview,
    getRewardPointActive
} from '../utils';
import defaultOperations from '../queries/rule.gql';
import mergeOperations from '@magento/peregrine/lib/util/shallowMerge';

const ADMIN_CHANGE = 0;
const REGISTRATION = 1;
const BIRTHDAY = 2;
const FIRST_REVIEW = 3;
const REVIEW = 4;
const FIRST_ORDER = 5;
const ORDER = 6;
const ORDER_REFUND = 7;
const IMPORT = 8;
const SUBSCRIBLE_NEWSLETTERS = 9;

function isNumeric(n) {
    return !isNaN(parseFloat(n)) && isFinite(n);
}

function compareValues(validatedValue, value, strict = true) {
    if (
        null === value ||
        null === validatedValue ||
        (strict && isNumeric(validatedValue) && isNumeric(value))
    ) {
        return validatedValue == value;
    }

    return false;
}

function intersect(array1, array2) {
    return array1.filter(value => array2.includes(value));
}

export const usePointShowing = (props = {}) => {
    const { type } = props;
    const rewardPointActive = getRewardPointActive();
    const rewardPointIcon = getRewardPointIcon();
    const [{ isSignedIn }] = useUserContext();

    const object = useMemo(() => {
        let active = false;
        let validatedValue = null;
        switch (type) {
            case 'registration':
                active = getRewardPointMessRegister();
                validatedValue = REGISTRATION;
                break;
            case 'newsletter':
                active = getRewardPointSubscrible();
                validatedValue = SUBSCRIBLE_NEWSLETTERS;
                break;
            case 'review':
                active = getRewardPointProductReview();
                validatedValue = REVIEW;
            default:
                break;
        }

        return { active, validatedValue };
    }, [type]);

    const { active, validatedValue } = object;

    const operations = mergeOperations(defaultOperations, props.operations);

    const { getRuleRewardPoint } = operations;

    const { data } = useQuery(getRuleRewardPoint, {
        skip: !(rewardPointActive && active)
    });

    const validatedRule = useMemo(() => {
        if (!rewardPointActive || !active) return {};

        const rules = data?.bssRewardPointsRule?.rules || [];
        const findedRule = rules
            .filter(rule => rule.type === 'custom')
            .find(rule => {
                const conditionsSerialized = JSON.parse(
                    rule?.conditions_serialized || ''
                );
                if (conditionsSerialized && conditionsSerialized.conditions) {
                    return conditionsSerialized.conditions.some(condition => {
                        const value = condition.value;
                        let result = false;
                        switch (condition.operator) {
                            case '==':
                            case '!=':
                                if (Array.isArray(value)) {
                                    if (!Array.isArray(validatedValue)) {
                                        return false;
                                    }
                                    result =
                                        intersect(value, validatedValue)
                                            .length > 0;
                                } else {
                                    if (Array.isArray(validatedValue)) {
                                        result =
                                            validatedValue.length == 1 &&
                                            validatedValue.shift() == value;
                                    } else {
                                        result = compareValues(
                                            validatedValue,
                                            value
                                        );
                                    }
                                }
                                break;
                            case '<=':
                            case '>':
                                result = validatedValue <= value;
                                break;

                            case '>=':
                            case '<':
                                result = validatedValue >= value;
                                break;
                        }

                        return result;
                    });
                }

                return false;
            });

        return findedRule;
    });

    const isShow = useMemo(() => {
        return validatedRule?.rule_id >= 0 || false;
    }, [validatedRule]);

    const point = useMemo(() => {
        return validatedRule?.point || 0;
    });

    return {
        isShow,
        icon: rewardPointIcon,
        point,
        isSignedIn
    };
};
