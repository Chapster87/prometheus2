import { ReactNode } from 'react';

type config = {
  tmdbApiKey?: string;
  tmdbApiReadAccessToken?: string;
  xcUrl?: string;
  xcAuth?: {
    username: string;
    password: string;
  };
};

type session = {
  user?: {
    user_metadata: {
      tmdbApiKey: string;
      tmdbApiReadAccessToken: string;
      xcUrl: string;
      xcUsername: string;
      xcPassword: string;
    };
  };
};

type TmdbParams = {
  append_to_response?: string;
  language?: string;
  include_adult?: boolean;
  include_video?: boolean;
  page?: number;
  sort_by?: string;
  with_genres?: string;
  query?: string;
  first_air_date_year?: number;
};

type TmdbResponse = {
  title: ReactNode;
  results: any[];
  genres?: any[];
  content_ratings?: {
    results: {
      iso_3166_1: string;
      rating: string | null;
    }[];
  };
  release_dates?: {
    results: {
      iso_3166_1: string;
      release_dates: {
        certification: string;
      }[];
    }[];
  };
  media_type?: string;
};

export default class Spark {
  config!: config;
  /**
   * @param {{ xcUrl: string, auth: { username: string, password: string } }} [config]
   */
  constructor(session: session = {}) {
    if (import.meta.env.VITE_REACT_APP_USE_ENV === "true") {
      this.config = {
        tmdbApiKey: import.meta.env.VITE_REACT_APP_TMDB_API_KEY,
        tmdbApiReadAccessToken: import.meta.env.VITE_REACT_APP_TMDB_API_READ_ACCESS_TOKEN,
        xcUrl: import.meta.env.VITE_REACT_APP_XC_URL,
        xcAuth: {
          username: import.meta.env.VITE_REACT_APP_XC_USERNAME || "",
          password: import.meta.env.VITE_REACT_APP_XC_PASSWORD || "",
        },
      };
    } else if (session && session.user) {
      this.config = {
        tmdbApiKey: session.user.user_metadata.tmdbApiKey,
        tmdbApiReadAccessToken:
          session.user.user_metadata.tmdbApiReadAccessToken,
        xcUrl: session.user.user_metadata.xcUrl,
        xcAuth: {
          username: session.user.user_metadata.xcUsername,
          password: session.user.user_metadata.xcPassword,
        },
      };
    }
  }

  /**
   * query tmdb api
   *
   * @param {string} [section]
   * @param {string} [content]
   * @param {Object} [params]
   * @returns {Promise<any>}
   */
  async getTmdb(
    section: string,
    content: string,
    path_params: string | null,
    query_params: TmdbParams | null
  ): Promise<TmdbResponse | undefined> {
    if (this.config && this.config.tmdbApiReadAccessToken) {
      const tmdbBaseUrl = "https://api.themoviedb.org/3";
      const options: RequestInit = {
        method: "GET",
        headers: {
          accept: "application/json",
          Authorization: `Bearer ${this.config.tmdbApiReadAccessToken}`,
        },
      };

      let fetchUrl = `${tmdbBaseUrl}/${section}/${content}`;

      if (path_params) {
        fetchUrl += `/${path_params}`;
      }

      if (query_params) {
        const querystring = new URLSearchParams(query_params as any).toString();
        fetchUrl = fetchUrl + `?${querystring}`;
      }

      const res = await fetch(fetchUrl, options);
      if (!res.ok) {
        const message = `An error has occurred: ${res.status}`;
        console.error(message, "FetchURL: " + fetchUrl);
        return;
      }

      const data: TmdbResponse = await res.json();

      return data;
    }
  }

  /**
   * Fetch Movie Details for an array of ids from TMDB
   *
   */
  async getTmdbMoviesGroup(movieIdArray: number[]): Promise<TmdbResponse[] | undefined> {
    const params: TmdbParams = {
      append_to_response: "release_dates,watch/providers",
      language: "en-US",
    };

    const movieDetails: TmdbResponse[] = [];

    for (let i in movieIdArray) {
      let movie = await this.getTmdb("movie", movieIdArray[i].toString(), null, params);

      if (movie) {
        movie = { ...movie, media_type: "movie" };
        if (movie.media_type) {
          movie = await this.getTmdbCertificationRating(movie as TmdbResponse & { media_type: string });
        }
        movieDetails.push(movie);
      }
    }

    if (movieDetails.length > 0) {
      return movieDetails;
    }
  }

  /**
   * Fetch Movie Details for an array of ids from TMDB
   *
   */
  async getTmdbSeriesGroup(seriesIdArray: number[]): Promise<TmdbResponse[] | undefined> {
    const params: TmdbParams = {
        append_to_response: 'content_ratings,watch/providers',
        language: 'en-US'
    };

    const seriesDetails: TmdbResponse[] = [];

    for (let i in seriesIdArray) {
        let series = await this.getTmdb('tv', seriesIdArray[i].toString(), null, params);

        if (series) {
            series.media_type = 'tv';
            series = await this.getTmdbCertificationRating(series as TmdbResponse & { media_type: string });
            seriesDetails.push(series);
        }
    }

    if (seriesDetails.length > 0) {
        return seriesDetails;
    }
  }

  /**
   * Fetch Trending Movie from TMDB and attach stream id to link to Movie Detail
   *
   */
  async getTrendingMovies() {
    if (this.config) {
      const params = {
        language: "en-US",
      };

      const trendingMovies = await this.getTmdb(
        "trending",
        "movie",
        "week",
        params
      );

      if (trendingMovies && trendingMovies.results.length > 0) {
        const trendingMoviesIDs: number[] = [];
        let updatedTrendingMovies = null;

        trendingMovies.results.map((movies) => {
          trendingMoviesIDs.push(movies.id);
        });

        if (trendingMoviesIDs.length) {
          updatedTrendingMovies = await this.getTmdbMoviesGroup(
            trendingMoviesIDs
          );
        }

        return updatedTrendingMovies;
      }
    }
  }

  /**
   * Fetch Trending Series from TMDB and attach stream id to link to Series Detail
   *
   */
  async getTrendingSeries() {
    const params = {
        language:'en-US'
    };

    const trendingSeries = await this.getTmdb('trending', 'tv', 'week', params);

    if(trendingSeries && trendingSeries.results) {
        const trendingSeriesIDs: number[] = [];
        let updatedTrendingSeries = null;

        trendingSeries.results.map(series => {
            trendingSeriesIDs.push(series.id);
        });

        if(trendingSeriesIDs.length) {
            updatedTrendingSeries = await this.getTmdbSeriesGroup(trendingSeriesIDs);
        }

        return updatedTrendingSeries;
    }
  }

  /**
   * GET Media Certification Rating
   *
   * @param {Object} seriesList
   */
  async getTmdbCertificationRating(media: TmdbResponse & { media_type: string }): Promise<TmdbResponse & { certification_rating: string | null }> {
    let updatedMedia = { ...media, certification_rating: null as string | null };

    if (media.media_type === 'movie') {
      let ratingMatch = media.release_dates?.results.filter((rating: { iso_3166_1: string; release_dates: { certification: string }[] }) => rating.iso_3166_1 === 'US');
      if (ratingMatch && ratingMatch.length && ratingMatch[0].release_dates.length && ratingMatch[0].release_dates[0].certification) {
        updatedMedia.certification_rating = ratingMatch[0].release_dates[0].certification;
      }
    } else {
      let ratingMatch = media.content_ratings?.results.filter((rating: { iso_3166_1: string; rating: string | null }) => rating.iso_3166_1 === 'US');
      if (ratingMatch && ratingMatch.length && ratingMatch[0].rating) {
        updatedMedia.certification_rating = ratingMatch[0].rating;
      }
    }

    return updatedMedia;
  }
}