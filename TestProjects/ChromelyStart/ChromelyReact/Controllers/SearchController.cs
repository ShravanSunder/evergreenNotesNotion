using System.Collections.Generic;
using System;
using System.Text.Json;
using Chromely.CefGlue;
using Chromely.Core;
using Chromely.Core.Configuration;
using Chromely.Core.Network;
using Newtonsoft.Json;
using TrakDiscovery.Services.Spotify;

namespace ChromelyReact.Controllers
{
    [ControllerProperty(Name = "SearchController", Route = "search")]
    public class SearchController : ChromelyController
    {
        private readonly IChromelyConfiguration _config;

        /// <summary>
        /// Initializes a new instance of the <see cref="DemoController"/> class.
        /// </summary>
        public SearchController(IChromelyConfiguration config)
        {
            _config = config;
        }

        [HttpGet(Route = "/search/spotify3")]
        public ChromelyResponse Search3(ChromelyRequest request)
        {
            var service = new SpotifySearchService();
            var items = service.Search("U2");

            return new ChromelyResponse(request.Id)
            {
                Data = items.Artists.Items
            };
        }

        [Command(Route = "/search/showdevtools")]
        public void ShowDevTools(IDictionary<string, string> queryParameters)
        {
            if (_config != null && !string.IsNullOrWhiteSpace(_config.DevToolsUrl))
            {
                BrowserLauncher.Open(_config.Platform, _config.DevToolsUrl);
            }
        }



    }
}
