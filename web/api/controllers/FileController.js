/**
 * FileController
 *
 * @description :: Server-side logic for managing files
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */

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

    var fileHash = req.param('hash');
    if (!fileHash) {
      res.json({
        error: 'Hash不能为空'
      });
      return;
    }

    req.file('image').upload({
      dirname: require('path').resolve('./upload/images'),
      saveAs: fileHash,
      // You can apply a file upload limit (in bytes)
      maxBytes: 2 * 1000 * 1000
    }, function whenDone(err, uploadedFiles) {
      if (err) {
        return res.serverError(err);
      }
      return res.json({
        files: uploadedFiles,
        textParams: req.params.all()
      });
    });
  }
};

