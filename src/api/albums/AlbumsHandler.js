/* eslint-disable no-underscore-dangle */
class AlbumsHandler {
  constructor(service, validator) {
    this._service = service;
    this._validator = validator;
  }

  async postAlbumHandler(request, h) {
    // validate the data before being consumed
    this._validator.validateAlbumPayload(request.payload);

    const { name, year } = request.payload;
    const id = await this._service.addAlbum({ name, year });

    const response = h.response({
      status: 'success',
      data: {
        albumId: id,
      },
    });
    response.code(201);

    return response;
  }

  async getAlbumByIdHandler(request, h) {
    const { id } = request.params;

    const albumData = await this._service.getAlbumById(id);

    return {
      status: 'success',
      data: {
        album: albumData,
      },
    };
  }

  async putAlbumByIdHandler(request, h) {
    this._validator.validateAlbumPayload(request.payload);

    const { id } = request.params;
    const { name, year } = request.payload;

    await this._service.editAlbumById(id, { name, year });

    return {
      status: 'success',
      message: 'Album berhasil diubah',
    };
  }

  async deleteAlbumByIdHandler(request, h) {
    const { id } = request.params;

    await this._service.deleteAlbumById(id);

    return {
      status: 'success',
      message: 'Album berhasil dihapus',
    };
  }
}

module.exports = AlbumsHandler;
