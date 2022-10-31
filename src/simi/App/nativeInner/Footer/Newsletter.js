import React, { useState } from 'react';
import TextBox from 'src/simi/BaseComponents/TextBox';
import { Whitebtn } from 'src/simi/BaseComponents/Button';
import { SimiMutation } from 'src/simi/Network/Query';
import CUSTOMER_NEWSLETTER_UPDATE from 'src/simi/queries/customerNewsletterUpdate.graphql';
import Loading from 'src/simi/BaseComponents/Loading';
import { useIntl } from 'react-intl';

const Newsletter = props => {
    const { classes } = props;
    const { formatMessage } = useIntl();
    const [email, setEmail] = useState('');

    return (
        <div className={classes['app-newsletter']}>
            <div
                className={`container ${classes['app--flex']} ${
                    classes['pd-10-15']
                }`}
            >
                <div className={classes['newsletter__text']}>
                    <h4 className={classes['newsletter-title']}>
                        {formatMessage({
                            id:
                                'Stay up to date and never miss an offer! Sign up today'
                        })}
                    </h4>
                    <span className={classes['arrow-triangle']} />
                </div>
                <SimiMutation mutation={CUSTOMER_NEWSLETTER_UPDATE}>
                    {(updateCustomer, { loading, data }) => {
                        if (loading) return <Loading />;
                        return (
                            <form
                                className={classes['newsletter__form']}
                                onSubmit={e => {
                                    e.preventDefault();
                                    updateCustomer({
                                        variables: { email, isSubscribed: true }
                                    });
                                }}
                            >
                                <TextBox
                                    type="email"
                                    name="email"
                                    parentclasses={classes}
                                    placeholder={formatMessage({
                                        id: 'Enter email address'
                                    })}
                                    id="harlow-newsletter"
                                    defaultValue={email}
                                    onChange={e => setEmail(e.target.value)}
                                />
                                <Whitebtn
                                    type="submit"
                                    className="btn-secondary"
                                    text={formatMessage({
                                        id: 'Sign Up'
                                    })}
                                />
                            </form>
                        );
                    }}
                </SimiMutation>
            </div>
        </div>
    );
};

export default Newsletter;
