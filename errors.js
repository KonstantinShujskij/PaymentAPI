module.exports = {
    notAuth: { answer: { error: 'Bad Auth' }, custom: true },
    notAccess: { answer: { error: 'Access Denied' }, custom: true },
    notFind: { answer: { error: 'Not Find' }, custom: true },
    userIsExist: { answer: { error: 'User Is Exist' }, custom: true },
    userNotExist: { answer: { error: 'User Not Exist' }, custom: true },
    lowBalance: { answer: { error: 'Low Balance' }, custom: true },

    notCanTake: { answer: { error: 'Not Can Take' }, custom: true },
    OrderNotWait: { answer: { error: 'Order In Not Processing' }, custom: true },

    badUrl:  { answer: { error: 'Bad End Point. Set Protocol' }, custom: true },

    wrongData: { answer: { error: 'Wrong Data' }, custom: true },

    unknown: { answer: { error: "Something went wrong..." }, custom: true  }
}
