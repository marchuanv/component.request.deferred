const comnponentRequest = require("component.request");
const logging = require("logging");
logging.config.add("Re-Sending Deferred Request");
module.exports = { 
    send: ({ host, port, path, method, headers, data }) => {
        return new Promise(async (resolve)=>{
            const requestUrl = `${host}:${port}${path}`;
            let results = await comnponentRequest.send({  host, port, path, method, headers, data });
            if (results.statusCode === 202){
                logging.write("Re-Sending Deferred Request",`sending deferred request ${requestUrl}`);
                setTimeout(async () => {
                    results = await module.exports.send({ host, port, path, method, headers, data });
                    resolve(results);
                },1000);
            } else {
                resolve(results);
            }
        });
    }
};