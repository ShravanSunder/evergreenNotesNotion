using System;
using TrakDiscovery.Services.Spotify;
using Xunit;

namespace TrakDiscovery.Services.Test
{
    public class StpotiyAuthService
    {
        [Fact]
        public void AuthTest()
        {
            var auth = new SpotifyAuthService();

            auth.ImplicitAuthenticate();
        }
    }
}
