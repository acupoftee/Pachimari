class TwitterMediaUtil {
  beginBulkUpload () {

  }

  makePost (client, endpoint, params) {
    return new Promise((resolve, reject) => {
      client.post(endpoint, params, (err, data, response) => {
        if (err) {
          reject(err)
        } else {
          resolve(data)
        }
      })
    })
  }
}
module.exports = TwitterMediaUtil
