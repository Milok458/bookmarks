const TOKEN = "2abbf7c3-245b-404f-9473-ade729ed4653";

function keyChecker(req, res, next){
    let tokenAH = req.headers.authorization;
    let tokenAPIH = req.headers['book-api-key'];
    let tokenParam = req.query.apiKey;

    if(tokenAH !== `Bearer ${TOKEN}` && tokenAPIH !== TOKEN && tokenParam !== TOKEN){
        res.statusMessage = "Authorization token was not sent or is invalid";
        return res.status(401).end();
    }

    next();
}

module.exports = keyChecker;