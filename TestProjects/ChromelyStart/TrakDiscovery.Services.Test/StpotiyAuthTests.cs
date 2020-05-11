using System;
using TrakDiscovery.Services.Spotify;
using Xunit;

namespace TrakDiscovery.Services.Test
{
    public class StpotiyAuthTests
    {
        [Fact]
        public void AuthTest()
        {
            var service = SpotifyAuthService.GetService();
            Assert.NotNull(service);
        }
    }
}
