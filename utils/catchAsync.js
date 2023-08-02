//a function to catch Async errors - the problem with Async errors is that they are returnedw without being caught by express, this is a work around that - we wrap each async function with this function and catch all errors thrown by the async function and pass it onto next to be handled by our error middleware

module.exports = (func) => {
    return(req,res,next) =>{
        func(req,res,next).catch(next)
    }
}