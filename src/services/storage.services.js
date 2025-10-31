const imageKit = require("imagekit")

const storageInstance = new imageKit({

    publicKey :  process.env.IMAGEKIT_PUBLIC_KEY,
    privateKey:  process.env.IMAGEKIT_PRIVATE_KEY,
    urlEndpoint:  process.env.IMAGEKIT_URL,
})
console.log("imagekit install")

 const sendfilesToStorage =async (file, fileName)=>{
    return await storageInstance.upload({
  file,
  fileName,
  folder:"TasteMate"
    })
 }

module.exports = sendfilesToStorage;