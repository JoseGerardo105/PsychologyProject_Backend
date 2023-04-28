const authentication = (req, res, next) => {
    console.log('Since my middleware');
    next();
}

export default authentication;