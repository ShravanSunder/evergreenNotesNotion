using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using SpotifyAPI.Web.Enums;
using TrakDiscovery.Services.Spotify;
using Unosquare.Swan;
using Xunit;


namespace TrakDiscovery.Services.Test
{
    public class SpotifySearchTests
    {
        public SpotifySearchTests ()
        {
            new SpotifySearchService();
        }

        [Fact]
        public void SearchTest()
        {
            var service = new SpotifySearchService();
            var item = service.Search("U2", SearchType.Artist);

            Assert.True(item.Artists.Items.Any());

        }
    }
}
