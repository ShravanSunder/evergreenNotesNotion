using System.Text.Json;
using Chromely.CefGlue;
using Chromely.Core;
using Chromely.Core.Configuration;
using Chromely.Core.Network;
using Newtonsoft.Json;

namespace ChromelyReact.Controllers
{
    public class AuthController : ChromelyController
    {
        [HttpGet(Route = "/authController/Auth")]
        public ChromelyResponse Auth(ChromelyRequest request)
        {

            return null;
        }

    }
}
