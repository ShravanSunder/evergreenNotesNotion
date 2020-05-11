using System;
using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;
using Polly;
using SpotifyAPI.Web;
using SpotifyAPI.Web.Auth;
using SpotifyAPI.Web.Enums;
using SpotifyAPI.Web.Models;
using Flurl.Http;
using Flurl;

namespace TrakDiscovery.Services.Spotify
{
    public class SpotifyAuthService
    {
        private static string ClientId { get; set; } = "48f4b92c22f346e5850c31187fb208ff";
        private static string LocalAuthServer { get; set; } = "http://localhost:4013";
        private static string State { get; set; } = "xx.TrakDiscoveryAuthV0.1.r";
        
        protected static Token token = null;
        public static Token CurrentToken { get; protected set; } = null;
        //GET https://accounts.spotify.com/authorize

        protected static void ImplicitAuthenticate()
        {
            ImplicitGrantAuth auth = new ImplicitGrantAuth(
              ClientId,
              LocalAuthServer,
              LocalAuthServer,
              Scope.PlaylistModifyPublic |
              Scope.UserLibraryRead | Scope.UserLibraryModify | Scope.UserTopRead |
              Scope.UserReadRecentlyPlayed | Scope.PlaylistReadCollaborative | Scope.UserReadCurrentlyPlaying |
              Scope.Streaming,
              State + new Random().Next(0, 10000)
            );

            void callback(object sender, Token payload)
            {
                token = payload;
                auth.Stop();
            }

            auth.AuthReceived += callback;

            auth.ShowDialog = false;
            auth.Start(); // Starts an internal HTTP Server
            auth.OpenBrowser();

        }


        public static SpotifyWebAPI GetService ()
        {
            if (CurrentToken == null || CurrentToken.IsExpired() == true || !string.IsNullOrEmpty(CurrentToken.Error))
            {
                SpotifyAuthService.ImplicitAuthenticate();
            }

            var task = Task.Run(() =>
            {
                GetToken();
            });
            task.Wait();

            if (token != null)
            {
                CurrentToken = token;
                return new SpotifyWebAPI()
                {
                    TokenType = "Bearer",
                    AccessToken = CurrentToken.AccessToken,
                };
            }

            throw new Exception("Spotify Authentication error  " + CurrentToken?.ErrorDescription);
        }

        private static void GetToken()
        {
            var policy = Policy
                    .HandleResult<Token>(r => r == null)
                    .WaitAndRetry(40, retryAttempt => TimeSpan.FromMilliseconds(Math.Pow(1.1, retryAttempt) * 100));

            policy.Execute(() => token);
        }
    }


}
