import React from 'react';
import { Form } from 'informed';
import { useIntl } from 'react-intl';
import { useForm } from '../../talons/useForm';
import { useStyle } from '@magento/venia-ui/lib/classify';
import { isRequired } from '@magento/venia-ui/lib/util/formValidators';
import defaultClasses from './form.module.css';
import Field from '@magento/venia-ui/lib/components/Field';
import TextInput from '@magento/venia-ui/lib/components/TextInput';
import TextArea from '@magento/venia-ui/lib/components/TextArea';
import Button from '@magento/venia-ui/lib/components/Button';

const HidePriceForm = props => {
    const { productSku } = props
    const { formatMessage } = useIntl();
    const classes = useStyle(defaultClasses, props.classes);
    const talonProps = useForm({
        productSku,
        formatMessage
    });

    const { fields, handleCallForPrice } = talonProps;

    const fieldsArr = fields.map((field, index) => {
        const returnField = null;
        switch (field.type) {
            case '1':
                returnField = (
                    <div key={index}>
                        <Field
                            // id={field.}
                            label={field.field_label}
                        >
                            <TextInput
                                field="email"
                                id="email"
                                validate={isRequired}
                            />
                        </Field>
                    </div>
                );
                break;
            case '2':
                returnField = (
                    <div key={index}>
                        <Field
                            // id={field.}
                            label={field.field_label}
                        >
                            <TextArea
                                field="email"
                                id="email"
                                validate={isRequired}
                            />
                        </Field>
                    </div>
                );
        }

        return returnField;
    });

    return (
        <Form
            className={classes.root}
            // initialValues={initialValues}
            onSubmit={handleCallForPrice}
        >
            <div className={classes.field}>
                <Field
                    id="name"
                    label={formatMessage({
                        id: 'Name',
                        defaultMessage: 'Name'
                    })}
                >
                    <TextInput field="name" id="name" />
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
            {fieldsArr}
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
