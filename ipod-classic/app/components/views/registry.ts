import { ComponentType } from "react";
import { SplitScreenPreview } from "@/components/previews";

import AboutView from "./AboutView";
import AlbumView from "./AlbumView";
import AlbumsView from "./AlbumsView";
import ArtistView from "./ArtistView";
import ArtistsView from "./ArtistsView";
import BrickGameView from "./BrickGameView";
import CoverFlowView from "./CoverFlowView";
import GamesView from "./GamesView";
import GenresView from "./GenresView";
import HomeView from "./HomeView";
import MusicView from "./MusicView";
import NowPlayingView from "./NowPlayingView";
import PlaylistView from "./PlaylistView";
import PlaylistsView from "./PlaylistsView";
import SearchView from "./SearchView";
import SettingsView from "./SettingsView";
import SocialLinksView from "./SocialLinksView";
import SongsView from "./SongsView";

export type ViewProps = {
  home: undefined;
  music: undefined;
  games: undefined;
  settings: undefined;
  about: undefined;
  socialLinks: undefined;
  artists: {
    artists?: MediaApi.Artist[];
    inLibrary?: boolean;
    showImages?: boolean;
  };
  artist: { id: string; inLibrary?: boolean };
  albums: { albums?: MediaApi.Album[]; inLibrary?: boolean };
  album: { id: string; inLibrary?: boolean };
  songs: { songs: MediaApi.Song[] };
  nowPlaying: undefined;
  playlists: { playlists?: MediaApi.Playlist[]; inLibrary?: boolean };
  playlist: { id: string; inLibrary?: boolean };
  search: { initialQuery?: string };
  genres: undefined;
  brickGame: undefined;
  coverFlow: undefined;
};

export type ViewId = keyof ViewProps;

export type ViewType = "split" | "full" | "coverFlow";

export type ViewConfig<TViewId extends ViewId = ViewId> = {
  component: ComponentType<ViewProps[TViewId]>;
  type: ViewType;
  title: string;
  isSplitScreen?: boolean;
  preview?: SplitScreenPreview;
  disableLongPress?: boolean;
};

export const VIEW_REGISTRY = {
  home: {
    component: HomeView,
    type: "split",
    title: "Kaya's iPod",
    isSplitScreen: true,
  } as ViewConfig<"home">,

  music: {
    component: MusicView,
    type: "split",
    title: "Music",
    isSplitScreen: true,
    preview: SplitScreenPreview.Music,
  } as ViewConfig<"music">,

  games: {
    component: GamesView,
    type: "split",
    title: "Games",
    isSplitScreen: true,
    preview: SplitScreenPreview.Games,
  } as ViewConfig<"games">,

  settings: {
    component: SettingsView,
    type: "split",
    title: "Settings",
    isSplitScreen: true,
    preview: SplitScreenPreview.Settings,
  } as ViewConfig<"settings">,

  socialLinks: {
    component: SocialLinksView,
    type: "full",
    title: "Social Links",
  } as ViewConfig<"socialLinks">,

  about: {
    component: AboutView,
    type: "full",
    title: "About",
    preview: SplitScreenPreview.Settings,
  } as ViewConfig<"about">,

  artists: {
    component: ArtistsView,
    type: "full",
    title: "Artists",
    preview: SplitScreenPreview.Music,
  } as ViewConfig<"artists">,

  artist: {
    component: ArtistView,
    type: "full",
    title: "Artist",
    preview: SplitScreenPreview.Music,
  } as ViewConfig<"artist">,

  albums: {
    component: AlbumsView,
    type: "full",
    title: "Albums",
    preview: SplitScreenPreview.Music,
  } as ViewConfig<"albums">,

  album: {
    component: AlbumView,
    type: "full",
    title: "Album",
    preview: SplitScreenPreview.Music,
  } as ViewConfig<"album">,

  songs: {
    component: SongsView,
    type: "full",
    title: "Songs",
    preview: SplitScreenPreview.Music,
  } as ViewConfig<"songs">,

  nowPlaying: {
    component: NowPlayingView,
    type: "full",
    title: "Now Playing",
    preview: SplitScreenPreview.Music,
  } as ViewConfig<"nowPlaying">,

  playlists: {
    component: PlaylistsView,
    type: "full",
    title: "Playlists",
    preview: SplitScreenPreview.Music,
  } as ViewConfig<"playlists">,

  playlist: {
    component: PlaylistView,
    type: "full",
    title: "Playlist",
    preview: SplitScreenPreview.Music,
  } as ViewConfig<"playlist">,

  search: {
    component: SearchView,
    type: "full",
    title: "Search",
    preview: SplitScreenPreview.Music,
  } as ViewConfig<"search">,

  genres: {
    component: GenresView,
    type: "full",
    title: "Genres",
    preview: SplitScreenPreview.Music,
  } as ViewConfig<"genres">,

  brickGame: {
    component: BrickGameView,
    type: "full",
    title: "Brick",
    preview: SplitScreenPreview.Games,
    disableLongPress: true,
  } as ViewConfig<"brickGame">,

  coverFlow: {
    component: CoverFlowView,
    type: "coverFlow",
    title: "Cover Flow",
    preview: SplitScreenPreview.Music,
  } as ViewConfig<"coverFlow">,
} as const;
