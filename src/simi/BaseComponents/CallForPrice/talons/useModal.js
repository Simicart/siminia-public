import { useAppContext } from '@magento/peregrine/lib/context/app';

export const useModal = (props) => {
    const { productSku } = props
    const [{ drawer }, { closeDrawer }] = useAppContext();
    const isOpen = drawer === 'hidePrice.form.' + productSku;

    return {
        handleClose: closeDrawer,
        isOpen
    };
}