const component = require("component");
let sendRequest;
component.register({moduleName: "component.request.deferred"}).then( async ({ requestDeferred }) => {
    const { request } = await component.load({ moduleName: "component.request.deferred"});
    const { host, port } = requestDeferred;
    sendRequest = ({ path, method, headers, data }) => {
        return new Promise(async (resolve)=>{
            let results = await request.send({ path, method, headers, data });
            if (results.statusCode === 202 && results.headers.deferredrequestid){
                const requestUrl = `${host}:${port}${path}`;
                requestDeferred.log(`sending deferred request ${requestUrl}`);
                setTimeout(async () => {
                    headers.deferredrequestid = results.headers.deferredrequestid;
                    results = await module.exports.send({ host, port, path, method, headers, data });
                    resolve(results);
                },1000);
            } else {
                resolve(results);
            }
        });
    }
});
module.exports = { send: sendRequest };