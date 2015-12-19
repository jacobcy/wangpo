/**
* CloudImage.js
*
* @description :: TODO: You might write a short summary of how this model works and what it represents here.
* @docs        :: http://sailsjs.org/#!documentation/models
*/

module.exports = {
  schema: true,

  attributes: {
    /*
     * 文件hash值
     * 按照七牛云存储方式计算hash值，详见 https://github.com/qiniu/qetag。
     * 算法大体如下：
     *   如果你能够确认文件 <= 4M，那么
     *   hash = UrlsafeBase64([0x16, sha1(FileContent)])。
     *   也就是，文件的内容的sha1值（20个字节），前面加一个byte（值为0x16），
     *   构成 21 字节的二进制数据，然后对这 21 字节的数据做 urlsafe 的 base64 编码。
     *   如果文件 > 4M，则
     *   hash = UrlsafeBase64([0x96, sha1([sha1(Block1), sha1(Block2), ...])])，
     *   其中 Block 是把文件内容切分为 4M 为单位的一个个块，
     *   也就是 BlockI = FileContent[I*4M:(I+1)*4M]。
     */
    hash: {
      type: 'string',
      primaryKey: true,
      unique: true,
      size: 1024
    },

    // 原始图片URL
    sourceUrl: {
      type: 'string',
      required: true,
      unique: true,
      size: 1024
    },

    // 本地保存地址
    localPath: {
      type: 'string',
      size: 1024
    },

    // 远程URL
    remoteUrl: {
      type: 'string',
      size: 1024
    }
  }
};

