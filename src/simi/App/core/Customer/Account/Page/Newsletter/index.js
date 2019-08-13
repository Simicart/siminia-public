import React from 'react';
import { compose } from 'redux';
import classify from 'src/classify';
import Identify from 'src/simi/Helper/Identify'
import TitleHelper from 'src/simi/Helper/TitleHelper'
import Loading from "src/simi/BaseComponents/Loading";
import { connect } from 'src/drivers';
import { Simiquery, SimiMutation } from 'src/simi/Network/Query'
import CUSTOMER_NEWSLETTER from 'src/simi/queries/customerNewsletter.graphql';
import CUSTOMER_NEWSLETTER_UPDATE from 'src/simi/queries/customerNewsletterUpdate.graphql';
import defaultClasses from './style.css';
import { toggleMessages } from 'src/simi/Redux/actions/simiactions';

class Newsletter extends React.Component {

    constructor(props) {
        super(props);
    }

    render() {
        const {user, classes} = this.props;
        return (
            <div className={classes['newsletter-wrap']}>
                {TitleHelper.renderMetaHeader({title:Identify.__('Newsletter')})}
                <h1>{Identify.__('Newsletter Subscription')}</h1>
                <div className={classes['subscription-title']}>{Identify.__('Subscription option')}</div>
                <Simiquery query={CUSTOMER_NEWSLETTER}>
                    {({ loading, error, data }) => {
                        if (error) return <div>Data Fetch Error</div>;
                        if (loading) return <Loading />;
                        const { customer } = data;
                        const { is_subscribed } = customer;
                        let clicked = false;
                        return (
                            <SimiMutation mutation={CUSTOMER_NEWSLETTER_UPDATE}>
                                {(updateCustomer, { data }) => {
                                    if (data && data.updateCustomer && data.updateCustomer.customer) {
                                        if (data.updateCustomer.customer.is_subscribed === true) {
                                            this.props.toggleMessages([{
                                                    type: 'success',
                                                    message: "Newsletter is subcribed successfully!",
                                                    auto_dismiss: true
                                            }]);
                                        } else {
                                            this.props.toggleMessages([{
                                                    type: 'success',
                                                    message: "Newsletter is unsubcribed successfully!",
                                                    auto_dismiss: true
                                            }]);
                                        }
                                    }
                                    return (
                                    <>
                                        <div className={classes["account-newsletter"]}>
                                            <input id="checkbox-subscribe" type="checkbox" onChange={(e)=> {
                                                if (!user.email) return false;
                                                clicked = true;
                                                let isSubscribed = e.target.checked ? true : false;
                                                updateCustomer({ variables: { email: user.email, isSubscribed: isSubscribed } });
                                            }}
                                            checked={is_subscribed} value={1} />
                                            <label htmlFor="checkbox-subscribe">&nbsp;{Identify.__('General Subscription')}</label>
                                        </div>
                                        {(data === undefined && clicked) && <Loading />}
                                    </>
                                    )
                                }}
                            </SimiMutation>
                        );
                    }}
                </Simiquery>
            </div>
        );
    }
}

const mapStateToProps = ({ user }) => {
    const { currentUser } = user
    return {
        user: currentUser
    };
}

const mapDispatchToProps = {
    toggleMessages,
}

export default compose(
    classify(defaultClasses),
    connect(
        mapStateToProps,
        mapDispatchToProps
    )
)(Newsletter);