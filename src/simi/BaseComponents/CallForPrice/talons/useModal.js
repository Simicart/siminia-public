import { useAppContext } from '@magento/peregrine/lib/context/app';

export const useModal = () => {
    const [{ drawer }, { closeDrawer }] = useAppContext();
    const isOpen = drawer === 'hidePrice.form';

    return {
        handleClose: closeDrawer,
        isOpen
    };
}