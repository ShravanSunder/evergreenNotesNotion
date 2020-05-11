using System;
using System.Collections.Generic;
using System.Text;
using SpotifyAPI.Web; //Base Namespace
using SpotifyAPI.Web.Enums; //Enums
using SpotifyAPI.Web.Models; //Models for the JSON-responses


namespace TrakDiscovery.Services.Spotify
{
    public class SpotifySearchService
    {
        //public SpotifyWebAPI Api { get => api; set => api = value; }
        protected SpotifyWebAPI api = null;

        public SpotifyWebAPI WebApi
        {  
            get
            {
                return SpotifyAuthService.GetService();
            } 
        }        

        public SearchItem Search (string search)
        {
            var item = WebApi.SearchItemsEscaped(search, SearchType.Album | SearchType.Playlist);
            return item;
        }
    }
}
