const nodemailer = require('nodemailer')
const {google} = require('googleapis')

const oauth2Client = new google.auth.OAuth2(process.env.CLIENT_ID,process.env.CLIENT_SECRET,process.env.REDIRECT_URI)
oauth2Client.setCredentials({refresh_token: process.env.REFRESH_TOKEN})

const sendMail = async (mailOption) => {
    try{
        const accessToken = await oauth2Client.getAccessToken()

        const transport = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                type: 'OAuth2',
                user: 'pokehuy11@gmail.com',
                clientId: process.env.CLIENT_ID,
                clientSecret: process.env.CLIENT_SECRET,
                refreshToken: process.env.REFRESH_TOKEN,
                accessToken
            }
        })

        const result = await transport.sendMail(mailOption)
        return result
    } catch(e) {
        return e
    }
}

module.exports = sendMail