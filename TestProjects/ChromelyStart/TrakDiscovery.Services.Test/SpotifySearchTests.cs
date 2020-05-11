using System;
using System.Collections.Generic;
using System.Text;
using TrakDiscovery.Services.Spotify;
using Xunit;


namespace TrakDiscovery.Services.Test
{
    public class SpotifySearchTests
    {
        [Fact]
        public void SearchTest()
        {
            var service = new SpotifySearchService();
            var item = service.Search("U2");

        }
    }
}
