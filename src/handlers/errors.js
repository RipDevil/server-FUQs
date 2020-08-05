  
module.exports = async (ctx, next) => {
    try {
        next();
    } catch (e) {
        ctx.status = e.status || 500;
        ctx.body = { error: e.error || 'Internal Server Error' };
    }
};