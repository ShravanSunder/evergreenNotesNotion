using System;
using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;
using Polly;
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

        public SpotifyAuthService ImplicitAuthenticate()
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

            auth.AuthReceived += (sender, payload) =>
            {
                auth.Stop();
                this.token = payload;
            };

            auth.ShowDialog = false;
            auth.Start(); // Starts an internal HTTP Server
            auth.OpenBrowser();

            return this;
        }

        public async Task<Token> GetToken()
        {
            var t = await Task.Run (() => { 
                    while (token == null) { }
                return token;
            }); 

            if (t != null)
            {
                return t;
            }
            else
            {
                throw new Exception("No Token");
            }
        }
    }
}
