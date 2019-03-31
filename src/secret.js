const isProd = process.env.NODE_ENV === 'development' ? false : true

const appBase = {
    proxyURL: isProd ? '' : '',
    clientId: isProd ? 'On5DkG8z5mpEGCZzj9tQ99MXXSW1iVT9' : 'AKm0rmaY0ScS4y0FyUdvWMyfmtMdUYh6',
    redirect_uri: isProd ? 'https://shielded-bayou-64930.herokuapp.com/callback' : 'http://localhost:3000/callback'
}
// const appBase = {
//     proxyURL: 'https://cryptic-ravine-67258.herokuapp.com/',
//     clientId: 'On5DkG8z5mpEGCZzj9tQ99MXXSW1iVT9',
//     redirect_uri: 'https://shielded-bayou-64930.herokuapp.com/callback'
// }
export default appBase