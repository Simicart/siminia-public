import { useMutation } from '@apollo/client';
import { UPLOAD_GIFT_CARD_IMAGE } from './GiftCard.gql';

export const uploadGiftCardImage = props => {
	const [
    uploadGcImage, 
    { loading: uploadGcImageLoading, data: uploadGcImageData, error: uploadGcImageError }
  ] = useMutation(UPLOAD_GIFT_CARD_IMAGE)

	let uploadGcImageErrorMessage;
   	if (uploadGcImageError) {
       const errorTarget = uploadGcImageError;
       if (errorTarget.graphQLErrors) {
           // Apollo prepends "GraphQL Error:" onto the message,
           // which we don't want to show to an end user.
           // Build up the error message manually without the prepended text.
           uploadGcImageErrorMessage = errorTarget.graphQLErrors
               .map(({ message }) => message)
               .join(', ');
       } else {
           // A non-GraphQL error occurred.
           uploadGcImageErrorMessage = errorTarget.message;
       }
   	}
 
	return {
		uploadGcImage,
	  uploadGcImageLoading,
	  uploadGcImageData,
	  uploadGcImageErrorMessage
	}
}