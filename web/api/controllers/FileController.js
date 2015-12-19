/**
 * FileController
 *
 * @description :: Server-side logic for managing files
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */

var fs=require('fs');

const UPLOAD_LIMIT_IN_MBYTES = sails.config.qiniu.uploadLimitInMbytes;

module.exports = {
  /**
   * `FileController.uploadImage()`
   *
   * Upload image file to the server's disk.
   */
  uploadImage: function (req, res) {

    // e.g.
    // 0 => infinite
    // 240000 => 4 minutes (240,000 miliseconds)
    // etc.
    //
    // Node defaults to 2 minutes.
    res.setTimeout(0);

    req.file('image').upload({
      dirname: require('path').resolve('./upload/images'),
      // You can apply a file upload limit (in bytes)
      maxBytes: UPLOAD_LIMIT_IN_MBYTES * 1000 * 1000
    }, function whenDone(err, uploadedFiles) {
      if (err) {
        res.json({ error: err });
        return;
      }
      var file = uploadedFiles[0];
      fs.readFile(file.fd, function(err, data) {
        if (err) {
          res.json({ error: err });
          return;
        }
        sails.services.utils.saveCloudImage(data, file.type, function(err, result) {
          if (err) {
            res.json({ error: err });
            return;
          }
          res.json({
            hash: result.hash,
            remoteUrl: result.url,
            localPath: file.fd,
            textParams: req.params.all()
          });
        });
      });
    });
  }
};

