import React, { useMemo, useEffect } from "react";
import { useIntl, FormattedMessage } from "react-intl";
import defaultClasses from "./leftMenu.module.css";
import { useStyle } from "@magento/venia-ui/lib/classify.js";
import {
    Trash2,
    User,
    Trello,
    Heart,
    Tag,
    Check,
    Users,
    Info,
    Star,
    CheckCircle,
    DollarSign,
    Gift,
    CreditCard
} from "react-feather";
import Icon from "@magento/venia-ui/lib/components/Icon";
import { Link } from "react-router-dom";

const LeftMenu = (props) => {
    const { label } = props;
    const classes = useStyle(defaultClasses, props.classes);
    const { formatMessage } = useIntl();
    const rewardPointEnabled =
        window.SMCONFIGS &&
        window.SMCONFIGS.plugins &&
        window.SMCONFIGS.plugins.SM_ENABLE_REWARD_POINTS &&
        parseInt(window.SMCONFIGS.plugins.SM_ENABLE_REWARD_POINTS) === 1;
    const giftCardEnabled =
        window.SMCONFIGS &&
        window.SMCONFIGS.plugins &&
        window.SMCONFIGS.plugins.SM_ENABLE_GIFT_CARD &&
        parseInt(window.SMCONFIGS.plugins.SM_ENABLE_GIFT_CARD) === 1;

    let listMenuContent = [
        "Order History",
        "WishList",
        "Address Book",
        "Saved Payments",
        "Product Review",
        "Communications",
        "Account Information",
        "Account Subcriptions",
    ];
    const rewardMenuContent = [
        "Reward Points",
         "Reward Transactions"
    ];
    const giftCardContent = [
        "My Gift Cards",
    ];
    let iconList = [
        <Icon className={classes.icon} size={22} src={Trello} />,
        <Icon className={classes.icon} size={22} src={Heart} />,
        <Icon className={classes.icon} size={22} src={Tag} />,
        <Icon className={classes.icon} size={22} src={Check} />,
        <Icon className={classes.icon} size={22} src={Star} />,
        <Icon className={classes.icon} size={22} src={Users} />,
        <Icon className={classes.icon} size={22} src={Info} />,        
        <Icon className={classes.icon} size={22} src={CheckCircle} />,
    ];
    const rewardIconList = [        
        <Icon className={classes.icon} size={22} src={DollarSign} />,
        <Icon className={classes.icon} size={22} src={Gift} />
    ];
    const giftCardIconList = [        
        <Icon className={classes.icon} size={22} src={CreditCard} />,
    ];
    if (rewardPointEnabled) {
        listMenuContent = listMenuContent.concat(rewardMenuContent);
        iconList = iconList.concat(rewardIconList);
    }
    if (giftCardEnabled) {
        listMenuContent = listMenuContent.concat(giftCardContent);
        iconList = iconList.concat(giftCardIconList);
    }
    const MenuItems = listMenuContent.map((item, index) => {
        const reformat = item.replace(/\s/g, "-");
        const urlText = reformat.toLowerCase();

        return (
            <div
                key={index}
                className={label == item ? classes.activeItem : classes.item}
            >
                {iconList[index]}
                <Link to={`/${urlText}`}>{item}</Link>
            </div>
        );
    });

    return (
        <div className={classes.wrapper}>
            {MenuItems}
            <div className={classes.logout}>
                <Link to="/logout.html">
                    {formatMessage({
                        id: "Log out",
                        defaultMessage: "Log out",
                    })}
                </Link>
            </div>
        </div>
    );
};

export default LeftMenu;
