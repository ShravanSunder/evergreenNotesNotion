using System;
using System.Collections.Generic;
using System.Text;
using SpotifyAPI.Web;
using SpotifyAPI.Web.Auth;
using SpotifyAPI.Web.Enums;
using SpotifyAPI.Web.Models;

namespace TrakDiscovery.Services.Spotify
{
    public class SpotifyAuthService
    {
        protected string ClientId { get; set; } = "48f4b92c22f346e5850c31187fb208ff";
        protected Token token = null;

        //GET https://accounts.spotify.com/authorize

        public void ImplicitAuthenticate()
        {
            ImplicitGrantAuth auth = new ImplicitGrantAuth(
              ClientId,
              "http://www.google.com",
              "http://www.google.com",
              Scope.PlaylistModifyPublic |  
              Scope.UserLibraryRead | Scope.UserLibraryModify | Scope.UserTopRead | 
              Scope.UserReadRecentlyPlayed | Scope.PlaylistReadCollaborative | Scope.UserReadCurrentlyPlaying |
              Scope.Streaming
              ,
              "TrakDiscoveryAuthV1"
            );
            auth.AuthReceived += async (sender, payload) =>
            {
                auth.Stop();
                this.token = payload;
            };

            auth.ShowDialog = false;
            auth.Start(); // Starts an internal HTTP Server
            auth.OpenBrowser();
        }

    }
}
