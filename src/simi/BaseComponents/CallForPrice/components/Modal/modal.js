import React from 'react';
import { FormattedMessage } from 'react-intl';
import { Portal } from '@magento/venia-ui/lib/components/Portal';
import { X as CloseIcon } from 'react-feather';
import { useModal } from '../../talons/useModal'
import { useStyle } from '@magento/venia-ui/lib/classify';
import Icon from '@magento/venia-ui/lib/components/Icon';
import Form from './form'
import defaultClasses from './modal.module.css';

const Modal = props => {
    const { productSku } = props

    const talonsProps = useModal()

    const { isOpen, handleClose } = talonsProps

    const classes = useStyle(defaultClasses, props.classes);
    const rootClass = isOpen ? classes.root_open : classes.root;

    return (
        <Portal>
            <aside className={rootClass}>
                <div className={classes.header}>
                    <span className={classes.headerText}>
                        <FormattedMessage
                            id={'Call For Price Form'}
                            defaultMessage={'Call For Price Form'}
                        />
                    </span>
                    <button
                        className={classes.closeButton}
                        onClick={handleClose}
                    >
                        <Icon src={CloseIcon} />
                    </button>
                </div>
                <div className={classes.body}>
                    <Form productSku={productSku} />
                </div>
            </aside>
        </Portal>
    )
}

export default Modal