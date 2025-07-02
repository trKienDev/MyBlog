import { FeedRepository } from "./feed.repository.js";
import { FilmRepository } from "./film.repository.js";
import { VideoRepository } from "./video.repository.js";

const _videoRepository = new VideoRepository();
const _filmRepository = new FilmRepository();

const _feedRepository = new FeedRepository(_videoRepository, _filmRepository);

export {
      _videoRepository,
      _filmRepository, 
      _feedRepository
};