using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using TrakDiscovery.Services.Spotify;

namespace TrakDiscovery.Dev.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class SearchController : ControllerBase
    {

        [HttpGet("search")]
        public dynamic Get()
        {
            var service = new SpotifySearchService();
            var items = service.Search("U2");

            return true;
        }

    }
}
