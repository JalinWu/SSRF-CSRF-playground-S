
/******************************
 * Update parameters below
 ******************************/
function LineLoginPage() {
    var response_type = "";
    var redirect_uri = "";
    var state = genRandomString(12);
    var scope=""

    var link = `
https://access.line.me/oauth2/v2.1/authorize?
response_type=${response_type}&
client_id=${channel_id}&
redirect_uri=${redirect_uri}&
state=${state}&
scope=${scope}`;

    window.location.href = link;
}






/**********
 * Tool
 **********/
function genRandomString(length) {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const charactersLength = characters.length;
    let result = '';
    for (let i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
}