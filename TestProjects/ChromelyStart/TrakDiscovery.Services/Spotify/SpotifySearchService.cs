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

        public SearchItem Search(string search, SearchType? s)
        {
            if (s == null)
                return Search(search);
            else
                return Search(search, new[] { s.Value });

        }

        public SearchItem Search (string search, SearchType[] searchTypes = null)
        {
            SearchType sTypes;
            if (searchTypes == null || searchTypes.Length == 0)
                sTypes = SearchType.All;
            else
                sTypes = searchTypes[0];
            
            foreach (var s in searchTypes)
            {
                sTypes = sTypes | s;
            }

            var item = WebApi.SearchItemsEscaped(search, sTypes);
            return item;
        }
    }
}
