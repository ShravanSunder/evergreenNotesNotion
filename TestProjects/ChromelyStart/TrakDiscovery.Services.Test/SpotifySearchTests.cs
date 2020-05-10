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
            var s = new SpotifySearchService(new SpotifyAuthService().ImplicitAuthenticate());
            //var item = api.SearchItemsEscaped("roadhouse+blues", SearchType.Album | SearchType.Playlist);
        }
    }
}
