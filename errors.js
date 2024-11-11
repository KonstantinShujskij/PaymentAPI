module.exports = {
    notAuth: { answer: { error: 'Bad Auth' }, custom: true },
    notAccess: { answer: { error: 'Access Denied' }, custom: true },
    notFind: { answer: { error: 'Not Find' }, custom: true },
    userIsExist: { answer: { error: 'User Is Exist' }, custom: true },
    userNotExist: { answer: { error: 'User Not Exist' }, custom: true },
    lowBalance: { answer: { error: 'Low Balance' }, custom: true },
    invalidValue: { answer: { error: 'Low or hight value' }, custom: true },
    invalidCurrency: { answer: { error: 'Invalid Currency' }, custom: true },
    incorectNumber: { answer: { error: 'Incorect Card Number' }, custom: true },
    incorectIban: { answer: { error: 'Incorect Iban' }, custom: true },
    incorectINN: { answer: { error: 'Incorect INN' }, custom: true },
    incorectValue: { answer: { error: 'Incorect Value' }, custom: true },

    notCanTake: { answer: { error: 'Not Can Take' }, custom: true },
    OrderNotWait: { answer: { error: 'Order In Not Processing' }, custom: true },

    badUrl:  { answer: { error: 'Bad End Point. Set Protocol' }, custom: true },

    wrongData: { answer: { error: 'Wrong Data' }, custom: true },
    badCardNumber: { answer: { error: 'Bad Card Number' }, custom: true },

    unknown: { answer: { error: "Something went wrong..." }, custom: true  }
}
