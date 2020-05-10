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

        public SpotifySearchService(SpotifyAuthService authService)
        {
            api = new SpotifyWebAPI()
            {
                AccessToken = token.AccessToken,
                TokenType = token.TokenType
            };
        }

        

        public void Search (string search)
        {
            var item = api.SearchItemsEscaped("roadhouse+blues", SearchType.Album | SearchType.Playlist);

        }
    }
}
