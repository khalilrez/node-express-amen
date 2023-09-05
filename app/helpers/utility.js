// Require:
var postmark = require("postmark");

// Send an email:
var client = new postmark.ServerClient(process.env.POSTMARK_API_KEY);


exports.generateRandomNumberString = (length) => {
    let result = '';
    const characters = '0123456789';
    const charactersLength = characters.length;

    for (let i = 0; i < length; i++) {
        const randomIndex = Math.floor(Math.random() * charactersLength);
        result += characters.charAt(randomIndex);
    }

    return result;
}

exports.splitString = (inputString) => {
    if (inputString.length >= 7) {
        const activationCode = inputString.substring(0, 6);
        const id = inputString.substring(6);
        console.log("--------------------------------")
        console.log(id)
        console.log(activationCode)

        return { activationCode, id };
    } else {
        throw new Error('Input string should be longer than 7 characters');
    }
}

exports.generateOTP = () => {
    const digits = '0123456789';
    let otp = '';

    for (let i = 0; i < 6; i++) {
        otp += digits[Math.floor(Math.random() * 10)];
    }

    return otp;
}

exports.sendEmail = async (to, from, subject, text,html) => {
try{
    client.sendEmail({
        "From": from,
        "To": to,
        "Subject": subject,
        "HtmlBody": html,
        "TextBody": text,
        "MessageStream": "outbound"
      });
    }catch(error){
        console.error(error)
    }
}


