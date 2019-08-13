class Card {
    static getCards() {
        let defaultFormat = /(\d{1,4})/g;
        let cardTypes = [
            {
                type: 'VI',
                pattern: /^4/,
                format: defaultFormat,
                lengthCard: [13, 16, 19],
                cvcLength: [3],
                cardFormatPattern: /\d{4,19}/g,
                luhn: true
            },
            {
                type: 'AE',
                pattern: /^3[47]/,
                format: /(\d{1,4})(\d{1,6})?(\d{1,5})?/,
                lengthCard: [15],
                cvcLength: [4],
                cardFormatPattern: /\d{4,15}/g,
                luhn: true
            },
            {
                type: 'MC',
                pattern: /^(5[1-5]|677189)|^(222[1-9]|2[3-6]\d{2}|27[0-1]\d|2720)/,
                format: defaultFormat,
                lengthCard: [16],
                cardFormatPattern: /\d{4,16}/g,
                cvcLength: [3],
                luhn: true
            },
            {
                type: 'DI',
                pattern: /^(6011|65|64[4-9]|622)/,
                format: defaultFormat,
                lengthCard: [16],
                cvcLength: [3],
                cardFormatPattern: /\d{4,16}/g,
                luhn: true
            },
            {
                type: 'SM',
                pattern: /^(5018|5020|5038|6304|6703|6708|6759|676[1-3])/,
                format: defaultFormat,
                lengthCard: [12, 13, 14, 15, 16, 17, 18, 19],
                cvcLength: [3],
                cardFormatPattern: /\d{4,19}/g,
                luhn: true
            },
            // {
            //     type: 'SO',
            //     pattern: '/^[0-9]{3,4}$/'
            // },
            {
                type: 'JCB',
                pattern: /^35/,
                format: defaultFormat,
                lengthCard: [16],
                cardFormatPattern: /\d{4,16}/g,
                cvcLength: [3],
                luhn: true
            }
        ];

        return cardTypes;
    }

    static detectCardType(cardNumber) {
        cardNumber = (cardNumber + '').replace(/\D/g, '');
        const cardTypes = this.getCards();
        for (let j = 0, len = cardTypes.length; j < len; j++) {
            const card = cardTypes[j];
            if (card.pattern.test(cardNumber)) {
                return card;
            }
        }

        return null;
    }

    static getCardFormatByType(type) {
        const cardTypes = this.getCards();
        const findCard = cardTypes.filter(item => {
            return item.type === type;
        });
        if (findCard.length === 0) {
            return false;
        }

        return findCard[0];
    }
}

export default Card;
