const handlePriceInput = (e, setDynamicPrice, setPriceTitle, min_value, max_value, percentage_price_value) => {
    const tmp = Number(e.target.value)
    if(!tmp || tmp<0) setPriceTitle('$0.00')
    if(tmp>0 && min_value<=tmp<=max_value) setPriceTitle(`$${(tmp*Number(percentage_price_value)/100).toFixed(2)}`)
    if(tmp>0 && (tmp<min_value || tmp>max_value)) setPriceTitle(`$${tmp.toFixed(2)}`)
    setDynamicPrice(tmp)
}

const handleSenderName = (e, setSenderName) => {
    setSenderName(e.target.value)
}

const handleRecipientName = (e, setRecipientName) => {
    setRecipientName(e.target.value)
}

const handleSenderEmail = (e, setSenderEmail) => {
    setSenderEmail(e.target.value)
}

const handleRecipientEmail = (e, setRecipientEmail) => {
    setRecipientEmail(e.target.value)
}

const handleMessage = (e, setMessage) => {
    setMessage(e.target.value)
}

export { handlePriceInput, handleSenderName, handleRecipientName, handleSenderEmail, handleRecipientEmail, handleMessage }