using System;
using Chromely;
using Chromely.Core;
using Chromely.Core.Network;
using ChromelyReact.Controllers;

namespace ChromelyReact
{
    class Program
    {
        [STAThread]
        static void Main(string[] args)
        {
            AppBuilder
            .Create()
            .UseApp<DemoChromelyApp>()
            .Build()
            .Run(args);
        }
    }

    public class DemoChromelyApp : ChromelyBasicApp
    {
        public override void Configure(IChromelyContainer container)
        {
            base.Configure(container);
            container.RegisterSingleton(typeof(ChromelyController), Guid.NewGuid().ToString(), typeof(SearchController));
        }
    }
}