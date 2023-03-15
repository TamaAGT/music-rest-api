/* eslint-disable no-underscore-dangle */
class SongsHandler {
  constructor(service, validator) {
    this._service = service;
    this._validator = validator;
  }

  async postSongHandler(request, h) {
    this._validator.validateSongPayload(request.payload);

    const {
      title, year, performer, genre, duration, albumId,
    } = request.payload;

    const id = await this._service.addSong({
      title, year, performer, genre, duration, albumId,
    });

    const response = h.response({
      status: 'success',
      data: {
        songId: id,
      },
    });

    response.code(201);
    return response;
  }

  async getSongsHandler(request) {
    const { title, performer } = request.query;

    const result = await this._service.getSongs(title, performer);

    return {
      status: 'success',
      data: {
        songs: result,
      },
    };
  }

  async getSongByIdHandler(request) {
    const { id } = request.params;
    const result = await this._service.getSongById(id);

    return {
      status: 'success',
      data: {
        song: result,
      },
    };
  }

  async putSongByIdHandler(request) {
    this._validator.validateSongPayload(request.payload);
    const { id } = request.params;
    const {
      title, year, performer, genre, duration, albumId,
    } = request.payload;

    await this._service.editSongById(id, {
      title, year, performer, genre, duration, albumId,
    });

    return {
      status: 'success',
      message: 'Song berhasil diubah',
    };
  }

  async deleteSongByIdHandler(request) {
    const { id } = request.params;
    await this._service.deleteSongById(id);

    return {
      status: 'success',
      message: 'Song berhasil dihapus',
    };
  }
}

module.exports = SongsHandler;
