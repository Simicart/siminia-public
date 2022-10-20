import React, { Fragment, useEffect } from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import { shape, string } from 'prop-types';
import { Form } from 'informed';

import { useToasts } from '@magento/peregrine';
import { useContactPage } from 'src/simi/talons/ContactPage';

import { useStyle } from '@magento/venia-ui/lib/classify';
import { isRequired } from '@magento/venia-ui/lib/util/formValidators';

import Button from '@magento/venia-ui/lib/components/Button';
import CmsBlock from '@magento/venia-ui/lib/components/CmsBlock/block';
import { Meta, StoreTitle } from '@magento/venia-ui/lib/components/Head';
import FormError from '@magento/venia-ui/lib/components/FormError';
import Field from '@magento/venia-ui/lib/components/Field';
import TextInput from '@magento/venia-ui/lib/components/TextInput';
import TextArea from '@magento/venia-ui/lib/components/TextArea';
// import LoadingIndicator from '@magento/venia-ui/lib/components/LoadingIndicator';
import ErrorView from '@magento/venia-ui/lib/components/ErrorView';
import ContactPageShimmer from './contactPage.shimmer';
import defaultClasses from './contactPage.module.css';
import AlertMessages from '../../nativeInner/ProductFullDetail/AlertMessages';
import Loader from '../../nativeInner/Loader';
const BANNER_IDENTIFIER = 'contact-us-banner';
const SIDEBAR_IDENTIFIER = 'contact-us-sidebar';
const NOT_FOUND_MESSAGE =
    "Looks like the page you were hoping to find doesn't exist. Sorry about that.";

const ContactPage = props => {
    const { classes: propClasses } = props;
    const classes = useStyle(defaultClasses, propClasses);
    const { formatMessage } = useIntl();
    const talonProps = useContactPage({
        cmsBlockIdentifiers: [BANNER_IDENTIFIER, SIDEBAR_IDENTIFIER]
    });
    const [, { addToast }] = useToasts();

    const {
        isEnabled,
        cmsBlocks,
        errors,
        handleSubmit,
        isBusy,
        isLoading,
        setFormApi,
        response,
        setAlertMsg,
        alertMsg
    } = talonProps;

    // useEffect(() => {
    //     if (response && response.status) {
    //         addToast({
    //             type: 'success',
    //             message: formatMessage({
    //                 id: 'contactPage.submitMessage',
    //                 defaultMessage: 'Your message has been sent.'
    //             }),
    //             timeout: 5000
    //         });
    //     }
    // }, [addToast, formatMessage, response]);

    // if (!isLoading && !isEnabled) {
    //     return (
    //         <Fragment>
    //             <StoreTitle>
    //                 {formatMessage({
    //                     id: 'contactPage.title',
    //                     defaultMessage: 'Contact Us'
    //                 })}
    //             </StoreTitle>
    //             <ErrorView
    //                 message={formatMessage({
    //                     id: 'magentoRoute.routeError',
    //                     defaultMessage: NOT_FOUND_MESSAGE
    //                 })}
    //             />
    //         </Fragment>
    //     );
    // }

    // if (isLoading) {
    //     return <ContactPageShimmer />;
    // }

    const maybeLoadingIndicator = isBusy ? (
        <div className={classes.loadingContainer}>
            <Loader>
                <FormattedMessage
                    id={'contactPage.loadingText'}
                    defaultMessage={'Sending'}
                />
            </Loader>
        </div>
    ) : null;

    const contactUsBannerContent = cmsBlocks.find(
        item => item.identifier === BANNER_IDENTIFIER
    )?.content;

    const contactUsBanner = contactUsBannerContent ? (
        <div className={classes.banner}>
            <CmsBlock content={contactUsBannerContent} />
        </div>
    ) : null;

    const contactUsSidebarContent = cmsBlocks.find(
        item => item.identifier === SIDEBAR_IDENTIFIER
    )?.content;

    const contactUsSidebar = contactUsSidebarContent ? (
        <div className={classes.sideContent}>
            <CmsBlock content={contactUsSidebarContent} />
        </div>
    ) : null;

    const pageTitle = formatMessage({
        id: 'Contact Us',
        defaultMessage: 'Contact Us'
    });

    const metaDescription = formatMessage({
        id: 'Contact Us',
        defaultMessage: 'Contact Us'
    });
    let topInsets = 0;
    let bottomInsets = 0;
    try {
        if (window.simicartRNinsets) {
            const simicartRNinsets = JSON.parse(window.simicartRNinsets);
            topInsets = parseInt(simicartRNinsets.top);
            bottomInsets = parseInt(simicartRNinsets.bottom);
        } else if (window.simpifyRNinsets) {
            const simpifyRNinsets = JSON.parse(window.simpifyRNinsets);
            topInsets = parseInt(simpifyRNinsets.top);
            bottomInsets = parseInt(simpifyRNinsets.bottom);
        }
    } catch (err) {}

    return (
        <Fragment>
            <StoreTitle>{pageTitle}</StoreTitle>
            <Meta name="title" content={pageTitle} />
            <Meta name="description" content={metaDescription} />
            <article className={`${classes.root} container`} data-cy="ContactPage-root">
            <AlertMessages
                message={formatMessage({
                    id: 'contactPage.submitMessage',
                    defaultMessage: 'Your message has been sent.'
                })}
                setAlertMsg={setAlertMsg}
                alertMsg={alertMsg}
                status="success"
                topInsets={topInsets}
            />
                {contactUsBanner}
                <div className={classes.content}>
                    <div
                        className={classes.formContainer}
                        data-cy="ContactPage-formContainer"
                    >
                        {maybeLoadingIndicator}
                        <h1 className={classes.title}>
                            <FormattedMessage
                                id={'Contact Us'}
                                defaultMessage={'Contact Us'}
                            />
                        </h1>
                        
                        <div className={classes.writeUs}>
                            <p className={classes.subtitle}>
                                <FormattedMessage
                                    id={'Write Us'}
                                    defaultMessage={`Write Us`}
                                />
                            </p>
                        </div>
                       
                        <p className={classes.subtitle}>
                            <FormattedMessage
                                id={"Jot us a note and we’ll get back to you as quickly as possible."}
                                defaultMessage={`Jot us a note and we’ll get back to you as quickly as possible.`}
                            />
                        </p>
                        <FormError
                            allowErrorMessages
                            errors={Array.from(errors.values())}
                        />
                        <Form
                            getApi={setFormApi}
                            className={classes.form}
                            onSubmit={handleSubmit}
                        >
                            <Field
                                id="contact-name"
                                label={formatMessage({
                                    id: 'global.name',
                                    defaultMessage: 'Name'
                                })}
                            >
                                <TextInput
                                    autoComplete="name"
                                    field="name"
                                    id="contact-name"
                                    validate={isRequired}
                                    data-cy="name"
                                />
                            </Field>
                            <Field
                                id="contact-email"
                                label={formatMessage({
                                    id: 'global.email',
                                    defaultMessage: 'Email'
                                })}
                            >
                                <TextInput
                                    autoComplete="email"
                                    field="email"
                                    id="contact-email"
                                    validate={isRequired}
                                    placeholder={formatMessage({
                                        id: 'global.emailPlaceholder',
                                        defaultMessage: 'abc@xyz.com'
                                    })}
                                    data-cy="email"
                                />
                            </Field>
                            <Field
                                id="contact-telephone"
                                label={formatMessage({
                                    id: 'Phone number',
                                    defaultMessage: 'Phone Number'
                                })}
                                optional={true}
                            >
                                <TextInput
                                    autoComplete="tel"
                                    field="telephone"
                                    id="contact-telephone"
                                    placeholder={formatMessage({
                                        id: 'contactPage.telephonePlaceholder',
                                        defaultMessage: '(222)-222-2222'
                                    })}
                                    data-cy="telephone"
                                />
                            </Field>
                            <Field
                                id="contact-comment"
                                label={formatMessage({
                                    id: 'Message',
                                    defaultMessage: 'Message'
                                })}
                            >
                                <TextArea
                                    autoComplete="comment"
                                    field="comment"
                                    id="contact-comment"
                                    validate={isRequired}
                                    placeholder={formatMessage({
                                        id: "Tell us what's on your mind",
                                        defaultMessage: `Tell us what's on your mind`
                                    })}
                                    data-cy="comment"
                                />
                            </Field>
                            <div className={classes.buttonsContainer}>
                                <Button
                                    priority="high"
                                    type="submit"
                                    disabled={isBusy}
                                    data-cy="submit"
                                >
                                    <FormattedMessage
                                        id={'Send'}
                                        defaultMessage={'Send'}
                                    />
                                </Button>
                            </div>
                        </Form>
                    </div>
                    {contactUsSidebar}
                </div>
            </article>
        </Fragment>
    );
};

ContactPage.propTypes = {
    classes: shape({
        loadingContainer: string,
        banner: string,
        sideContent: string,
        root: string,
        content: string,
        formContainer: string,
        title: string,
        subtitle: string,
        form: string,
        buttonsContainer: string
    })
};

export default ContactPage;
