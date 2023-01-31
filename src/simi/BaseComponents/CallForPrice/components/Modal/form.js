import React, { Suspense } from 'react';
import { Form, Text as InformedText } from 'informed';
import { useIntl } from 'react-intl';
import { useForm } from '../../talons/useForm';
import { useStyle } from '@magento/venia-ui/lib/classify';
import { isRequired } from '@magento/venia-ui/lib/util/formValidators';
import defaultClasses from './form.module.css';
import Field from '@magento/venia-ui/lib/components/Field';
import TextInput from '@magento/venia-ui/lib/components/TextInput';
import TextArea from '@magento/venia-ui/lib/components/TextArea';
import Button from '@magento/venia-ui/lib/components/Button';
import Checkbox from '@magento/venia-ui/lib/components/Checkbox';
import Captcha from './captcha';

const HidePriceForm = props => {
    const { productSku } = props;
    const { formatMessage } = useIntl();
    const classes = useStyle(defaultClasses, props.classes);
    const talonProps = useForm({
        productSku,
        formatMessage
    });

    const {
        fields,
        initialValues,
        hdieFieldWhenLogin,
        handleCallForPrice
    } = talonProps;

    const fieldsArr = fields.map((field, index) => {
        let returnField = null;
        const fieldRequired = field.field_required ? isRequired : null;
        switch (field.field_type) {
            case '1':
                returnField = (
                    <div key={index} className={classes.field}>
                        <Field id={field.field_label} label={field.field_label}>
                            <TextInput
                                field={field.field_label}
                                id={field.field_label}
                                validate={fieldRequired}
                            />
                        </Field>
                    </div>
                );
                break;
            case '2':
                returnField = (
                    <div key={index} className={classes.field}>
                        <Field id={field.field_label} label={field.field_label}>
                            <TextArea
                                field={field.field_label}
                                id={field.field_label}
                                validate={fieldRequired}
                            />
                        </Field>
                    </div>
                );
                break;
            case '5':
                returnField = (
                    <div key={index} className={classes.field}>
                        <Checkbox
                            field={field.field_label}
                            label={field.field_label}
                            validate={fieldRequired}
                        />
                    </div>
                );
            default:
                break;
        }

        return returnField;
    });

    const basicFields = hdieFieldWhenLogin ? (
        <React.Fragment>
            <InformedText type="hidden" field="name" id="name" />

            <InformedText type="hidden" field="email" id="email" />
        </React.Fragment>
    ) : (
        <React.Fragment>
            <div className={classes.field}>
                <Field
                    id="name"
                    label={formatMessage({
                        id: 'Name',
                        defaultMessage: 'Name'
                    })}
                >
                    <TextInput field="name" id="name" validate={isRequired} />
                </Field>
            </div>
            <div className={classes.field}>
                <Field
                    id="email"
                    label={formatMessage({
                        id: 'global.email',
                        defaultMessage: 'Email'
                    })}
                >
                    <TextInput field="email" id="email" validate={isRequired} />
                </Field>
            </div>
        </React.Fragment>
    );

    return (
        <Form
            className={classes.root}
            initialValues={initialValues}
            onSubmit={handleCallForPrice}
        >
            {basicFields}
            {fieldsArr}
            <Suspense fallback={null}>
                <Captcha classes={classes} />
            </Suspense>
            <div className={classes.buttons}>
                <Button type="submit" priority="high">
                    {formatMessage({
                        id: 'global.submit',
                        defaultMessage: 'Submit'
                    })}
                </Button>
            </div>
        </Form>
    );
};

export default HidePriceForm;
